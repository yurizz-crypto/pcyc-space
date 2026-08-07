'use server';

import { db } from '@/lib/db';
import { orders, orderItems, paymentReceipts, type PaymentMethod } from '@/lib/db/schema/orders';
import { products } from '@/lib/db/schema/products';
import { getCurrentUserProfile } from '@/lib/db/queries/users';
import { orderSchema, receiptUploadSchema, isSizeAvailable } from '@/lib/validators';
import { saveUploadedImage } from '@/lib/storage';
import { logger } from '@/lib/logger';
import { revalidatePath } from 'next/cache';
import { eq, and } from 'drizzle-orm';

export interface OrderActionResult {
  success: boolean;
  orderId?: string;
  orderNumber?: string;
  totalAmount?: number;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export interface ReceiptActionResult {
  success: boolean;
  message?: string;
  error?: string;
}

const COURIER_DELIVERY_FEE = 120.0; // Standard PHP courier fee

/**
 * Server Action for authenticated Members to place a merchandise order or pre-order.
 * Shift-Left Security: Enforces user authentication, role separation, strict input validation,
 * and stock/size availability checking before recording transaction in DB.
 */
export async function createOrderAction(
  prevState: OrderActionResult,
  formData: FormData
): Promise<OrderActionResult> {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    return {
      success: false,
      error: 'Please sign in to your PCYC account to place an order.',
    };
  }

  // Role segregation: Admins should not order items as members
  if (profile.role === 'ADMIN' || profile.role === 'SUPERADMIN') {
    return {
      success: false,
      error: 'Administrators cannot place member merchandise orders. Please use a Member account.',
    };
  }

  const rawData = {
    productId: formData.get('productId') as string,
    quantity: Number(formData.get('quantity') || 1),
    selectedSize: (formData.get('selectedSize') as string) || undefined,
    fulfillmentType: (formData.get('fulfillmentType') as 'EVENT_PICKUP' | 'DELIVERY') || 'EVENT_PICKUP',
    recipientName: (formData.get('recipientName') as string) || `${profile.firstName} ${profile.lastName}`,
    contactNumber: (formData.get('contactNumber') as string) || profile.phoneNumber || '',
    targetEventTitle: (formData.get('targetEventTitle') as string) || 'Upcoming PCYC Youth Camp',
    deliveryAddress: (formData.get('deliveryAddress') as string) || undefined,
    city: (formData.get('city') as string) || undefined,
    province: (formData.get('province') as string) || undefined,
    zipCode: (formData.get('zipCode') as string) || undefined,
    notes: (formData.get('notes') as string) || undefined,
  };

  const validation = orderSchema.safeParse(rawData);
  if (!validation.success) {
    logger.warn({ errors: validation.error.flatten(), userId: profile.id }, 'Order validation failed');
    return {
      success: false,
      error: 'Please check your order details and provide all required information.',
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const { data } = validation;

  try {
    // 1. Fetch and verify product
    const [targetProduct] = await db
      .select()
      .from(products)
      .where(eq(products.id, data.productId))
      .limit(1);

    if (!targetProduct) {
      return { success: false, error: 'The requested merchandise item could not be found.' };
    }

    if (!targetProduct.isAvailable && !targetProduct.isPreorder) {
      return { success: false, error: 'This merchandise item is currently not available for purchase.' };
    }

    // 2. Validate selected size
    if (data.selectedSize && !isSizeAvailable(data.selectedSize, targetProduct.availableSizes || [])) {
      return {
        success: false,
        error: `Size "${data.selectedSize}" is currently not available for this item. Available: ${(targetProduct.availableSizes || []).join(', ')}`,
      };
    }

    // 3. Compute price & delivery fee
    const unitPriceNum = Number(targetProduct.price);
    const itemSubtotal = unitPriceNum * data.quantity;
    const deliveryFee = data.fulfillmentType === 'DELIVERY' ? COURIER_DELIVERY_FEE : 0;
    const totalAmount = itemSubtotal + deliveryFee;

    // 4. Generate unique order number (e.g. PCYC-2026-84920)
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `PCYC-2026-${randomSuffix}`;

    // 5. Insert Order
    const [newOrder] = await db
      .insert(orders)
      .values({
        userId: profile.id,
        orderNumber,
        totalAmount: totalAmount.toFixed(2),
        status: 'PENDING_PAYMENT',
        shippingInfo: {
          recipientName: data.recipientName,
          contactNumber: data.contactNumber,
          deliveryAddress: data.deliveryAddress || 'Event Pickup at Registration Desk',
          city: data.city || 'Event Venue',
          province: data.province || 'Event Venue',
          zipCode: data.zipCode,
          notes: data.notes
            ? `${data.fulfillmentType === 'EVENT_PICKUP' ? `[Event Pickup: ${data.targetEventTitle}] ` : '[Courier Delivery] '}${data.notes}`
            : data.fulfillmentType === 'EVENT_PICKUP'
            ? `[Event Pickup: ${data.targetEventTitle}]`
            : '[Courier Delivery]',
        },
        notes: data.notes || null,
      })
      .returning();

    // 6. Insert Order Item
    await db.insert(orderItems).values({
      orderId: newOrder.id,
      productId: targetProduct.id,
      quantity: data.quantity,
      unitPrice: unitPriceNum.toFixed(2),
      selectedSize: data.selectedSize || null,
    });

    // 7. Optional Immediate Receipt Upload (if attached in form)
    const receiptFile = formData.get('receiptImage') as File | null;
    const refNumber = formData.get('referenceNumber') as string | null;
    const amountPaidStr = formData.get('amountPaid') as string | null;

    if (receiptFile && receiptFile.size > 0 && refNumber) {
      const uploadResult = await saveUploadedImage(receiptFile, 'receipts', `receipt-${orderNumber}`);
      if (uploadResult.success && uploadResult.url) {
        await db.insert(paymentReceipts).values({
          orderId: newOrder.id,
          receiptImageUrl: uploadResult.url,
          paymentMethod: 'GCASH',
          referenceNumber: refNumber.trim(),
          amountPaid: (amountPaidStr ? Number(amountPaidStr) : totalAmount).toFixed(2),
          verificationStatus: 'PENDING',
        });

        await db
          .update(orders)
          .set({ status: 'VERIFICATION_QUEUED', updatedAt: new Date() })
          .where(eq(orders.id, newOrder.id));
      }
    }

    logger.info(
      {
        orderId: newOrder.id,
        orderNumber,
        userId: profile.id,
        totalAmount,
        fulfillmentType: data.fulfillmentType,
      },
      'Merchandise order placed successfully'
    );

    revalidatePath('/portal');
    revalidatePath('/admin/orders');
    revalidatePath(`/merch/${targetProduct.slug}`);

    return {
      success: true,
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      totalAmount,
      message: `Order ${orderNumber} placed successfully! Please upload your GCash payment proof.`,
    };
  } catch (error: any) {
    logger.error({ error: error?.message, userId: profile.id }, 'Failed to place order');
    return {
      success: false,
      error: 'An unexpected error occurred while placing your order. Please try again.',
    };
  }
}

/**
 * Server Action for Members to upload or re-submit their GCash proof of payment receipt.
 */
export async function uploadReceiptAction(
  prevState: ReceiptActionResult,
  formData: FormData
): Promise<ReceiptActionResult> {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    return { success: false, error: 'Please sign in to upload your payment receipt.' };
  }

  const orderId = formData.get('orderId') as string;
  const paymentMethod = (formData.get('paymentMethod') as PaymentMethod) || 'GCASH';
  const referenceNumber = formData.get('referenceNumber') as string;
  const amountPaid = Number(formData.get('amountPaid') || 0);
  const receiptFile = formData.get('receiptImage') as File | null;

  if (!orderId || !referenceNumber || !receiptFile || receiptFile.size === 0) {
    return {
      success: false,
      error: 'Please attach your payment screenshot and enter the GCash reference number.',
    };
  }

  try {
    // 1. Verify that order exists and belongs to this user (or is admin)
    const [existingOrder] = await db
      .select()
      .from(orders)
      .where(
        profile.role === 'ADMIN' || profile.role === 'SUPERADMIN'
          ? eq(orders.id, orderId)
          : and(eq(orders.id, orderId), eq(orders.userId, profile.id))
      )
      .limit(1);

    if (!existingOrder) {
      return { success: false, error: 'Order not found or unauthorized.' };
    }

    // 2. Upload screenshot to Supabase Storage
    const uploadResult = await saveUploadedImage(
      receiptFile,
      'receipts',
      `receipt-${existingOrder.orderNumber}`
    );

    if (!uploadResult.success || !uploadResult.url) {
      return {
        success: false,
        error: uploadResult.error || 'Failed to upload payment receipt screenshot.',
      };
    }

    // 3. Upsert payment receipt
    const existingReceipts = await db
      .select()
      .from(paymentReceipts)
      .where(eq(paymentReceipts.orderId, orderId))
      .limit(1);

    if (existingReceipts.length > 0) {
      await db
        .update(paymentReceipts)
        .set({
          receiptImageUrl: uploadResult.url,
          paymentMethod,
          referenceNumber: referenceNumber.trim(),
          amountPaid: (amountPaid || Number(existingOrder.totalAmount)).toFixed(2),
          verificationStatus: 'PENDING',
          verificationNotes: null,
        })
        .where(eq(paymentReceipts.id, existingReceipts[0].id));
    } else {
      await db.insert(paymentReceipts).values({
        orderId,
        receiptImageUrl: uploadResult.url,
        paymentMethod,
        referenceNumber: referenceNumber.trim(),
        amountPaid: (amountPaid || Number(existingOrder.totalAmount)).toFixed(2),
        verificationStatus: 'PENDING',
      });
    }

    // 4. Update order status
    await db
      .update(orders)
      .set({
        status: 'VERIFICATION_QUEUED',
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId));

    logger.info(
      { orderId, orderNumber: existingOrder.orderNumber, userId: profile.id },
      'Payment receipt uploaded and queued for verification'
    );

    revalidatePath('/portal');
    revalidatePath('/admin/orders');
    revalidatePath('/admin');

    return {
      success: true,
      message: 'Proof of payment uploaded successfully! Our admin team will verify it shortly.',
    };
  } catch (error: any) {
    logger.error({ error: error?.message, orderId }, 'Failed to upload receipt');
    return {
      success: false,
      error: 'Failed to submit payment receipt. Please try again.',
    };
  }
}

/**
 * Server Action for Admins to verify/approve or reject an uploaded GCash payment receipt.
 */
export async function verifyReceiptAction(formData: FormData): Promise<void> {
  const orderId = formData.get('orderId') as string;
  const receiptId = formData.get('receiptId') as string;
  const decision = (formData.get('decision') as 'APPROVED' | 'REJECTED') || 'APPROVED';
  const adminNotes = formData.get('adminNotes') as string | undefined;

  if (!orderId || !receiptId) return;

  const profile = await getCurrentUserProfile();
  if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'SUPERADMIN')) {
    return;
  }

  try {
    // 1. Update Payment Receipt Record
    await db
      .update(paymentReceipts)
      .set({
        verificationStatus: decision,
        verifiedById: profile.id,
        verifiedAt: new Date(),
        verificationNotes: adminNotes || null,
      })
      .where(eq(paymentReceipts.id, receiptId));

    // 2. Update Order Status
    const newOrderStatus = decision === 'APPROVED' ? 'PAID' : 'PENDING_PAYMENT';
    await db
      .update(orders)
      .set({
        status: newOrderStatus,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId));

    logger.info({ orderId, receiptId, decision, adminId: profile.id }, 'Payment receipt verified');

    revalidatePath('/admin/orders');
    revalidatePath('/admin');
    revalidatePath('/portal');
  } catch (error: any) {
    logger.error({ error: error?.message, orderId, receiptId }, 'Failed to verify receipt');
  }
}
