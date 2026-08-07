import { db } from '@/lib/db';
import { orders, orderItems, paymentReceipts, type Order, type PaymentReceipt } from '@/lib/db/schema/orders';
import { eq, desc } from 'drizzle-orm';
import { logger } from '@/lib/logger';

export type OrderWithReceipt = Order & {
  receipt?: PaymentReceipt | null;
};

/**
 * Fetches all orders belonging to a specific user for the Member Portal.
 */
export async function getUserOrders(userId: string): Promise<OrderWithReceipt[]> {
  try {
    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));

    const ordersWithReceipts: OrderWithReceipt[] = [];

    for (const ord of userOrders) {
      const receipts = await db
        .select()
        .from(paymentReceipts)
        .where(eq(paymentReceipts.orderId, ord.id))
        .limit(1);

      ordersWithReceipts.push({
        ...ord,
        receipt: receipts[0] || null,
      });
    }

    return ordersWithReceipts;
  } catch (error) {
    logger.error({ error, userId }, 'Failed to fetch user orders');
    return [];
  }
}

/**
 * Fetches all orders with payment receipts for the Admin verification queue.
 */
export async function getAllOrdersWithReceipts(): Promise<OrderWithReceipt[]> {
  try {
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    const ordersWithReceipts: OrderWithReceipt[] = [];

    for (const ord of allOrders) {
      const receipts = await db
        .select()
        .from(paymentReceipts)
        .where(eq(paymentReceipts.orderId, ord.id))
        .limit(1);

      ordersWithReceipts.push({
        ...ord,
        receipt: receipts[0] || null,
      });
    }

    return ordersWithReceipts;
  } catch (error) {
    logger.error({ error }, 'Failed to fetch all orders for admin');
    return [];
  }
}
