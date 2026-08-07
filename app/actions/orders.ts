'use server';

import { db } from '@/lib/db';
import { orders, paymentReceipts } from '@/lib/db/schema/orders';
import { getCurrentUserProfile } from '@/lib/db/queries/users';
import { logger } from '@/lib/logger';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';

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
