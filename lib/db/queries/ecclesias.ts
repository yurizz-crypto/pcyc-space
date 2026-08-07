import { cache } from 'react';
import { db } from '@/lib/db';
import { ecclesias, type Ecclesia } from '@/lib/db/schema/ecclesias';
import { eq, asc, count } from 'drizzle-orm';
import { logger } from '@/lib/logger';

/**
 * Fetch all active Philippine ecclesias for public display (Home, About, Footer, Registration).
 * Memoized per server request lifecycle.
 */
export const getDisplayedEcclesias = cache(async function getDisplayedEcclesias(): Promise<Ecclesia[]> {
  try {
    return await db
       .select()
       .from(ecclesias)
       .where(eq(ecclesias.isDisplayed, true))
       .orderBy(asc(ecclesias.orderIndex), asc(ecclesias.name));
  } catch (error: any) {
    if (
      error?.digest === 'DYNAMIC_SERVER_USAGE' ||
      error?.message?.includes('DYNAMIC_SERVER_USAGE') ||
      error?.digest?.startsWith('NEXT_')
    ) {
      throw error;
    }
    logger.error({ error: error?.message || error }, 'Failed to fetch displayed ecclesias');
    return [];
  }
});

/**
 * Fetch all ecclesias (including hidden ones) for Admin management.
 * Memoized per server request lifecycle.
 */
export const getAllEcclesias = cache(async function getAllEcclesias(): Promise<Ecclesia[]> {
  try {
    return await db
      .select()
      .from(ecclesias)
      .orderBy(asc(ecclesias.region), asc(ecclesias.name));
  } catch (error: any) {
    if (
      error?.digest === 'DYNAMIC_SERVER_USAGE' ||
      error?.message?.includes('DYNAMIC_SERVER_USAGE') ||
      error?.digest?.startsWith('NEXT_')
    ) {
      throw error;
    }
    logger.error({ error: error?.message || error }, 'Failed to fetch all ecclesias for admin');
    return [];
  }
});

/**
 * Fetch count of active ecclesias in the database.
 * Memoized per server request lifecycle.
 */
export const getEcclesiaCount = cache(async function getEcclesiaCount(): Promise<number> {
  try {
    const result = await db
      .select({ value: count() })
      .from(ecclesias)
      .where(eq(ecclesias.isDisplayed, true));
    return result[0]?.value || 0;
  } catch (error: any) {
    if (
      error?.digest === 'DYNAMIC_SERVER_USAGE' ||
      error?.message?.includes('DYNAMIC_SERVER_USAGE') ||
      error?.digest?.startsWith('NEXT_')
    ) {
      throw error;
    }
    logger.error({ error: error?.message || error }, 'Failed to count ecclesias');
    return 0;
  }
});

/**
 * Fetch a single ecclesia by ID for admin editing.
 * Memoized per server request lifecycle.
 */
export const getEcclesiaById = cache(async function getEcclesiaById(id: string): Promise<Ecclesia | null> {
  try {
    const results = await db
      .select()
      .from(ecclesias)
      .where(eq(ecclesias.id, id))
      .limit(1);

    return results[0] || null;
  } catch (error: any) {
    if (
      error?.digest === 'DYNAMIC_SERVER_USAGE' ||
      error?.message?.includes('DYNAMIC_SERVER_USAGE') ||
      error?.digest?.startsWith('NEXT_')
    ) {
      throw error;
    }
    logger.error({ error: error?.message || error, id }, 'Failed to fetch ecclesia by id');
    return null;
  }
});

