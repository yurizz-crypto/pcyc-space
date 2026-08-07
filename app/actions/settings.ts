'use server';

import { db } from '@/lib/db';
import { siteSettings } from '@/lib/db/schema/settings';
import { youthCountSettingSchema } from '@/lib/validators';
import { verifyCurrentUserRole } from '@/lib/db/queries/users';
import { revalidatePath } from 'next/cache';
import { logger } from '@/lib/logger';

export async function updateYouthCountAction(formData: FormData): Promise<void> {
  const { profile } = await verifyCurrentUserRole(['ADMIN', 'SUPERADMIN']);
  if (!profile) {
    throw new Error('Unauthorized: Admin credentials required.');
  }

  const rawCount = Number(formData.get('count'));
  const parsed = youthCountSettingSchema.safeParse({ count: rawCount });

  if (!parsed.success) {
    logger.warn({ errors: parsed.error.format() }, 'Invalid youth count setting update');
    throw new Error(parsed.error.issues[0]?.message || 'Youth count cannot be less than 1');
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
    logger.error({ error: error?.message }, 'Failed to update youth count setting');
    throw new Error('Failed to update setting in database.');
  }

  revalidatePath('/');
  revalidatePath('/admin');
}
