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

export async function updatePaymentSettingsAction(
  prevState: any,
  formData: FormData
) {
  try {
    const { profile } = await verifyCurrentUserRole(['ADMIN', 'SUPERADMIN']);
    if (!profile) {
      return { success: false, error: 'Unauthorized' };
    }

    const platform = formData.get('platform') as string;
    const accountName = formData.get('accountName') as string;
    const accountNumber = formData.get('accountNumber') as string;
    
    if (!platform || !accountName || !accountNumber) {
      return { success: false, error: 'All text fields are required.' };
    }

    // Handle QR code upload
    const { saveUploadedImage } = await import('@/lib/storage');
    let qrUrl = formData.get('existingQr') as string | null;
    const qrFile = formData.get('qrCodeFile') as File | null;
    
    if (qrFile && typeof qrFile === 'object' && qrFile.size > 0) {
      const uploadResult = await saveUploadedImage(qrFile, 'settings', 'payment-qr');
      if (!uploadResult.success) {
        return { success: false, error: uploadResult.error || 'Failed to upload QR.' };
      }
      qrUrl = uploadResult.url!;
    }

    // Save to siteSettings table
    const settingsToSave = [
      { key: 'payment_platform', value: platform, description: 'Payment Provider Name' },
      { key: 'payment_account_name', value: accountName, description: 'Payment Account Name' },
      { key: 'payment_account_number', value: accountNumber, description: 'Payment Account Number' },
    ];
    
    if (qrUrl) {
      settingsToSave.push({ key: 'payment_qr_url', value: qrUrl, description: 'Payment QR Code URL' });
    }

    for (const setting of settingsToSave) {
      await db
        .insert(siteSettings)
        .values({
          key: setting.key,
          value: setting.value,
          description: setting.description,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: siteSettings.key,
          set: {
            value: setting.value,
            updatedAt: new Date(),
          },
        });
    }

    invalidateCacheTag(CACHE_TAGS.settings);
    revalidatePath('/admin');
    revalidatePath('/merch');
    revalidatePath('/orders');
    
    return { success: true, message: 'Payment settings updated successfully' };
  } catch (err: any) {
    logger.error({ error: err?.message || err }, 'Unhandled error in updatePaymentSettingsAction');
    return { success: false, error: 'Unexpected error occurred.' };
  }
}
