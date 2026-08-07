import { db } from '@/lib/db';
import { siteSettings } from '@/lib/db/schema/settings';
import { eq } from 'drizzle-orm';
import { logger } from '@/lib/logger';

/**
 * Fetch a single site setting value by key.
 */
export async function getSiteSetting(key: string, defaultValue: string = ''): Promise<string> {
  try {
    const result = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, key))
      .limit(1);

    return result[0]?.value ?? defaultValue;
  } catch (error: any) {
    logger.error({ error: error?.message, key }, 'Failed to fetch site setting');
    return defaultValue;
  }
}

/**
 * Fetch youth & friends count metric (ensures minimum of 1).
 */
export async function getYouthAndFriendsCount(): Promise<number> {
  try {
    const val = await getSiteSetting('youth_and_friends_count', '150');
    const parsed = parseInt(val, 10);
    return isNaN(parsed) || parsed < 1 ? 150 : parsed;
  } catch (error: any) {
    logger.error({ error: error?.message }, 'Failed to fetch youth and friends count');
    return 150;
  }
}
