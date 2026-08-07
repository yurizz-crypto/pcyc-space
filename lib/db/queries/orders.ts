import { cache } from 'react';
import { db } from '@/lib/db';
import { orders, orderItems, paymentReceipts, type Order, type OrderItem, type PaymentReceipt } from '@/lib/db/schema/orders';
import { products, type Product } from '@/lib/db/schema/products';
import { profiles, type Profile } from '@/lib/db/schema/users';
import { eq, desc, inArray } from 'drizzle-orm';
import { logger } from '@/lib/logger';

export type OrderItemWithProduct = OrderItem & {
  product?: Product | null;
};

export type OrderWithDetails = Order & {
  receipt?: PaymentReceipt | null;
  items: OrderItemWithProduct[];
  user?: Profile | null;
};

// Backwards-compatible alias
export type OrderWithReceipt = OrderWithDetails;

/**
 * Fetches all orders belonging to a specific user for the Member Portal.
 * Optimized with batch queries and memoized per server request lifecycle.
 */
export const getUserOrders = cache(async function getUserOrders(userId: string): Promise<OrderWithDetails[]> {
  try {
    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));

    if (userOrders.length === 0) return [];

    const orderIds = userOrders.map((o) => o.id);

    // 1. Batch load receipts
    const receipts = await db
      .select()
      .from(paymentReceipts)
      .where(inArray(paymentReceipts.orderId, orderIds));
    const receiptMap = new Map<string, PaymentReceipt>();
    receipts.forEach((r) => receiptMap.set(r.orderId, r));

    // 2. Batch load order items
    const items = await db
      .select()
      .from(orderItems)
      .where(inArray(orderItems.orderId, orderIds));

    // 3. Batch load associated products
    const productIds = Array.from(new Set(items.map((i) => i.productId).filter(Boolean))) as string[];
    const loadedProducts =
      productIds.length > 0
        ? await db.select().from(products).where(inArray(products.id, productIds))
        : [];
    const productMap = new Map<string, Product>();
    loadedProducts.forEach((p) => productMap.set(p.id, p));

    // Assemble rich order records
    return userOrders.map((ord) => {
      const ordItems = items
        .filter((i) => i.orderId === ord.id)
        .map((item) => ({
          ...item,
          product: item.productId ? productMap.get(item.productId) || null : null,
        }));

      return {
        ...ord,
        receipt: receiptMap.get(ord.id) || null,
        items: ordItems,
        user: null,
      };
    });
  } catch (error: any) {
    if (
      error?.digest === 'DYNAMIC_SERVER_USAGE' ||
      error?.message?.includes('DYNAMIC_SERVER_USAGE') ||
      error?.digest?.startsWith('NEXT_')
    ) {
      throw error;
    }
    logger.error({ error: error?.message || error, userId }, 'Failed to fetch user orders');
    return [];
  }
});

/**
 * Fetches all orders with payment receipts, items, and user profiles for Admin.
 * Batch queries provide sub-100ms response time even with hundreds of records.
 * Memoized per server request lifecycle.
 */
export const getAllOrdersWithReceipts = cache(async function getAllOrdersWithReceipts(): Promise<OrderWithDetails[]> {
  try {
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    if (allOrders.length === 0) return [];

    const orderIds = allOrders.map((o) => o.id);
    const userIds = Array.from(new Set(allOrders.map((o) => o.userId).filter(Boolean))) as string[];

    // 1. Batch load receipts
    const receipts = await db
      .select()
      .from(paymentReceipts)
      .where(inArray(paymentReceipts.orderId, orderIds));
    const receiptMap = new Map<string, PaymentReceipt>();
    receipts.forEach((r) => receiptMap.set(r.orderId, r));

    // 2. Batch load order items
    const items = await db
      .select()
      .from(orderItems)
      .where(inArray(orderItems.orderId, orderIds));

    // 3. Batch load products
    const productIds = Array.from(new Set(items.map((i) => i.productId).filter(Boolean))) as string[];
    const loadedProducts =
      productIds.length > 0
        ? await db.select().from(products).where(inArray(products.id, productIds))
        : [];
    const productMap = new Map<string, Product>();
    loadedProducts.forEach((p) => productMap.set(p.id, p));

    // 4. Batch load profiles
    const loadedProfiles =
      userIds.length > 0
        ? await db.select().from(profiles).where(inArray(profiles.id, userIds))
        : [];
    const profileMap = new Map<string, Profile>();
    loadedProfiles.forEach((prof) => profileMap.set(prof.id, prof));

    return allOrders.map((ord) => {
      const ordItems = items
        .filter((i) => i.orderId === ord.id)
        .map((item) => ({
          ...item,
          product: item.productId ? productMap.get(item.productId) || null : null,
        }));

      return {
        ...ord,
        receipt: receiptMap.get(ord.id) || null,
        items: ordItems,
        user: ord.userId ? profileMap.get(ord.userId) || null : null,
      };
    });
  } catch (error: any) {
    if (
      error?.digest === 'DYNAMIC_SERVER_USAGE' ||
      error?.message?.includes('DYNAMIC_SERVER_USAGE') ||
      error?.digest?.startsWith('NEXT_')
    ) {
      throw error;
    }
    logger.error({ error: error?.message || error }, 'Failed to fetch all orders for admin');
    return [];
  }
});
