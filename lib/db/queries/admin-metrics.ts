import { cache } from 'react';
import { db } from '@/lib/db';
import { ecclesias } from '@/lib/db/schema/ecclesias';
import { events } from '@/lib/db/schema/events';
import { products } from '@/lib/db/schema/products';
import { orders } from '@/lib/db/schema/orders';
import { profiles } from '@/lib/db/schema/users';
import { getYouthAndFriendsCount } from './settings';
import { sql, or, eq } from 'drizzle-orm';
import { logger } from '@/lib/logger';

export interface AdminOverviewMetrics {
  totalEcclesias: number;
  totalEvents: number;
  totalProducts: number;
  pendingOrdersCount: number;
  totalMembers: number;
  totalAdmins: number;
  youthCount: number;
  timestamp: number;
}

/**
 * Fast aggregate query for the Admin Command Center.
 * Executes lightweight SQL count(*) statements without pulling full tables into memory.
 * Memoized per server request lifecycle.
 */
export const getAdminOverviewMetrics = cache(async function getAdminOverviewMetrics(): Promise<AdminOverviewMetrics> {
  try {
    const [
      ecclesiaRes,
      eventRes,
      productRes,
      pendingOrdersRes,
      membersRes,
      adminsRes,
      youthCount,
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)::int` }).from(ecclesias),
      db.select({ count: sql<number>`count(*)::int` }).from(events),
      db.select({ count: sql<number>`count(*)::int` }).from(products),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(orders)
        .where(or(eq(orders.status, 'PENDING_PAYMENT'), eq(orders.status, 'VERIFICATION_QUEUED'))),
      db.select({ count: sql<number>`count(*)::int` }).from(profiles),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(profiles)
        .where(or(eq(profiles.role, 'ADMIN'), eq(profiles.role, 'SUPERADMIN'))),
      getYouthAndFriendsCount(),
    ]);

    return {
      totalEcclesias: ecclesiaRes[0]?.count ?? 0,
      totalEvents: eventRes[0]?.count ?? 0,
      totalProducts: productRes[0]?.count ?? 0,
      pendingOrdersCount: pendingOrdersRes[0]?.count ?? 0,
      totalMembers: membersRes[0]?.count ?? 0,
      totalAdmins: adminsRes[0]?.count ?? 0,
      youthCount,
      timestamp: Date.now(),
    };
  } catch (error: any) {
    if (
      error?.digest === 'DYNAMIC_SERVER_USAGE' ||
      error?.message?.includes('DYNAMIC_SERVER_USAGE') ||
      error?.digest?.startsWith('NEXT_')
    ) {
      throw error;
    }
    logger.error({ error: error?.message || error }, 'Failed to compute admin overview metrics');
    return {
      totalEcclesias: 0,
      totalEvents: 0,
      totalProducts: 0,
      pendingOrdersCount: 0,
      totalMembers: 0,
      totalAdmins: 0,
      youthCount: 150,
      timestamp: Date.now(),
    };
  }
});
