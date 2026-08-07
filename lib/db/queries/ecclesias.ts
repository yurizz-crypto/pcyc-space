import { db } from '@/lib/db';
import { ecclesias, type Ecclesia } from '@/lib/db/schema/ecclesias';
import { eq, asc, count } from 'drizzle-orm';
import { logger } from '@/lib/logger';

/**
 * Fetch all active Philippine ecclesias for public display (Home, About, Footer, Registration).
 */
export async function getDisplayedEcclesias(): Promise<Ecclesia[]> {
  try {
    return await db
      .select()
      .from(ecclesias)
      .where(eq(ecclesias.isDisplayed, true))
      .orderBy(asc(ecclesias.orderIndex), asc(ecclesias.name));
  } catch (error: any) {
    logger.error({ error: error?.message }, 'Failed to fetch displayed ecclesias');
    return [];
  }
}

/**
 * Fetch all ecclesias (including hidden ones) for Admin management.
 */
export async function getAllEcclesias(): Promise<Ecclesia[]> {
  try {
    return await db
      .select()
      .from(ecclesias)
      .orderBy(asc(ecclesias.region), asc(ecclesias.name));
  } catch (error: any) {
    logger.error({ error: error?.message }, 'Failed to fetch all ecclesias for admin');
    return [];
  }
}

/**
 * Fetch count of active ecclesias in the database.
 */
export async function getEcclesiaCount(): Promise<number> {
  try {
    const result = await db
      .select({ value: count() })
      .from(ecclesias)
      .where(eq(ecclesias.isDisplayed, true));
    return result[0]?.value || 0;
  } catch (error: any) {
    logger.error({ error: error?.message }, 'Failed to count ecclesias');
    return 0;
  }
}

/**
 * Fetch a single ecclesia by ID for admin editing.
 */
export async function getEcclesiaById(id: string): Promise<Ecclesia | null> {
  try {
    const results = await db
      .select()
      .from(ecclesias)
      .where(eq(ecclesias.id, id))
      .limit(1);

    return results[0] || null;
  } catch (error: any) {
    logger.error({ error: error?.message, id }, 'Failed to fetch ecclesia by id');
    return null;
  }
}

