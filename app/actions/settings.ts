'use server';

import { db } from '@/lib/db';
import { siteSettings } from '@/lib/db/schema/settings';
import { youthCountSettingSchema } from '@/lib/validators';
import { verifyCurrentUserRole } from '@/lib/db/queries/users';
import { revalidatePath } from 'next/cache';
import { CACHE_TAGS, invalidateCacheTag } from '@/lib/db/queries/cached';
import { logger } from '@/lib/logger';

export async function updateYouthCountAction(formData: FormData): Promise<void> {
  try {
    const { profile } = await verifyCurrentUserRole(['ADMIN', 'SUPERADMIN']);
    if (!profile) {
      logger.warn('Unauthorized attempt to update youth count setting');
      return;
    }

    const rawCount = Number(formData.get('count'));
    const parsed = youthCountSettingSchema.safeParse({ count: rawCount });

    if (!parsed.success) {
      logger.warn({ errors: parsed.error.format() }, 'Invalid youth count setting update');
      return;
    }

    try {
      await db
        .insert(siteSettings)
        .values({
          key: 'youth_and_friends_count',
          value: parsed.data.count.toString(),
          description: 'Number of youth & friends displayed on Home Page',
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: siteSettings.key,
          set: {
            value: parsed.data.count.toString(),
            updatedAt: new Date(),
          },
        });

      logger.info({ count: parsed.data.count }, 'Youth & Friends count setting updated');
    } catch (error: any) {
      logger.error({ error: error?.message }, 'Failed to update youth count setting in database');
      return;
    }

    try {
      invalidateCacheTag(CACHE_TAGS.settings, CACHE_TAGS.youthCount);
      revalidatePath('/');
      revalidatePath('/admin');
    } catch (cacheErr: any) {
      logger.warn({ error: cacheErr?.message }, 'Cache revalidation warning');
    }
  } catch (err: any) {
    if (
      err?.digest === 'DYNAMIC_SERVER_USAGE' ||
      err?.message?.includes('DYNAMIC_SERVER_USAGE') ||
      err?.digest?.startsWith('NEXT_') ||
      err?.message === 'NEXT_REDIRECT'
    ) {
      throw err;
    }
    logger.error({ error: err?.message || err }, 'Unhandled error in updateYouthCountAction');
  }
}
