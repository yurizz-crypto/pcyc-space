import { cache } from 'react';
import { db } from '@/lib/db';
import { siteSettings } from '@/lib/db/schema/settings';
import { eq } from 'drizzle-orm';
import { logger } from '@/lib/logger';

/**
 * Fetch a single site setting value by key.
 * Memoized per server request lifecycle.
 */
export const getSiteSetting = cache(async function getSiteSetting(key: string, defaultValue: string = ''): Promise<string> {
  try {
    const result = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, key))
      .limit(1);

    return result[0]?.value ?? defaultValue;
  } catch (error: any) {
    if (
      error?.digest === 'DYNAMIC_SERVER_USAGE' ||
      error?.message?.includes('DYNAMIC_SERVER_USAGE') ||
      error?.digest?.startsWith('NEXT_')
    ) {
      throw error;
    }
    logger.error({ error: error?.message || error, key }, 'Failed to fetch site setting');
    return defaultValue;
  }
});

/**
 * Fetch youth & friends count metric (ensures minimum of 1).
 * Memoized per server request lifecycle.
 */
export const getYouthAndFriendsCount = cache(async function getYouthAndFriendsCount(): Promise<number> {
  try {
    const val = await getSiteSetting('youth_and_friends_count', '150');
    const parsed = parseInt(val, 10);
    return isNaN(parsed) || parsed < 1 ? 150 : parsed;
  } catch (error: any) {
    if (
      error?.digest === 'DYNAMIC_SERVER_USAGE' ||
      error?.message?.includes('DYNAMIC_SERVER_USAGE') ||
      error?.digest?.startsWith('NEXT_')
    ) {
      throw error;
    }
    logger.error({ error: error?.message || error }, 'Failed to fetch youth and friends count');
    return 150;
  }
});
