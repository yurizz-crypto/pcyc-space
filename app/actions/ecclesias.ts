'use server';

import { db } from '@/lib/db';
import { ecclesias } from '@/lib/db/schema/ecclesias';
import { ecclesiaSchema } from '@/lib/validators';
import { verifyCurrentUserRole } from '@/lib/db/queries/users';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { CACHE_TAGS, invalidateCacheTag } from '@/lib/db/queries/cached';
import { redirect } from 'next/navigation';
import { logger } from '@/lib/logger';

export interface AdminEcclesiaActionState {
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * Server Action to register a new Ecclesia.
 */
export async function createEcclesiaAction(formData: FormData): Promise<void> {
  try {
    const { profile } = await verifyCurrentUserRole(['ADMIN', 'SUPERADMIN']);
    if (!profile) {
      logger.warn('Unauthorized attempt to create ecclesia');
      return;
    }

    const rawData = {
      name: formData.get('name') as string,
      region: formData.get('region') as 'Luzon' | 'Visayas' | 'Mindanao',
      city: formData.get('city') as string,
      address: formData.get('address') as string,
      contactPerson: (formData.get('contactPerson') as string) || undefined,
      meetingSchedule: formData.get('meetingSchedule') as string,
      isDisplayed: formData.get('isDisplayed') !== 'false' && formData.get('isDisplayed') !== 'off',
      orderIndex: Number(formData.get('orderIndex') || 0),
    };

    const parsed = ecclesiaSchema.safeParse(rawData);
    if (!parsed.success) {
      logger.warn({ errors: parsed.error.format() }, 'Validation failed for new ecclesia');
      return;
    }

    try {
      await db.insert(ecclesias).values({
        name: parsed.data.name,
        region: parsed.data.region,
        city: parsed.data.city,
        address: parsed.data.address,
        contactPerson: parsed.data.contactPerson || null,
        meetingSchedule: parsed.data.meetingSchedule,
        isDisplayed: parsed.data.isDisplayed,
        orderIndex: parsed.data.orderIndex,
      });

      logger.info({ name: parsed.data.name, adminId: profile.id }, 'New ecclesia registered by admin');
    } catch (error: any) {
      logger.error({ error: error?.message }, 'Failed to create ecclesia in database');
      return;
    }

    try {
      invalidateCacheTag(CACHE_TAGS.ecclesias, CACHE_TAGS.ecclesiasDisplayed, CACHE_TAGS.ecclesiasCount);
      revalidatePath('/');
      revalidatePath('/about');
      revalidatePath('/register');
      revalidatePath('/admin');
      revalidatePath('/admin/ecclesias');
    } catch (cacheErr: any) {
      logger.warn({ error: cacheErr?.message }, 'Cache revalidation warning');
    }

    redirect('/admin/ecclesias');
  } catch (err: any) {
    if (
      err?.digest === 'DYNAMIC_SERVER_USAGE' ||
      err?.message?.includes('DYNAMIC_SERVER_USAGE') ||
      err?.digest?.startsWith('NEXT_') ||
      err?.message === 'NEXT_REDIRECT'
    ) {
      throw err;
    }
    logger.error({ error: err?.message || err }, 'Unhandled error in createEcclesiaAction');
  }
}

/**
 * Server Action for Admins to update an existing Ecclesia in PostgreSQL.
 */
export async function updateEcclesiaAction(
  prevState: AdminEcclesiaActionState,
  formData: FormData
): Promise<AdminEcclesiaActionState> {
  try {
    const id = formData.get('id') as string;
    if (!id) {
      logger.warn('Update ecclesia attempt rejected: missing id');
      return {
        success: false,
        error: 'Invalid request: Ecclesia ID is required.',
      };
    }

    const { profile } = await verifyCurrentUserRole(['ADMIN', 'SUPERADMIN']);
    if (!profile) {
      logger.warn({ id }, 'Unauthorized attempt to edit ecclesia');
      return {
        success: false,
        error: 'Unauthorized: Admin credentials required.',
      };
    }

    const rawData = {
      name: formData.get('name') as string,
      region: formData.get('region') as 'Luzon' | 'Visayas' | 'Mindanao',
      city: formData.get('city') as string,
      address: formData.get('address') as string,
      contactPerson: (formData.get('contactPerson') as string) || undefined,
      meetingSchedule: formData.get('meetingSchedule') as string,
      isDisplayed: formData.get('isDisplayed') === 'on' || formData.get('isDisplayed') === 'true',
      orderIndex: Number(formData.get('orderIndex') || 0),
    };

    const parsed = ecclesiaSchema.safeParse(rawData);
    if (!parsed.success) {
      logger.warn({ id, fieldErrors: parsed.error.flatten().fieldErrors }, 'Ecclesia update failed schema validation');
      return {
        success: false,
        error: 'Please correct the highlighted errors in the form.',
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    try {
      await db
        .update(ecclesias)
        .set({
          name: parsed.data.name,
          region: parsed.data.region,
          city: parsed.data.city,
          address: parsed.data.address,
          contactPerson: parsed.data.contactPerson || null,
          meetingSchedule: parsed.data.meetingSchedule,
          isDisplayed: parsed.data.isDisplayed,
          orderIndex: parsed.data.orderIndex,
          updatedAt: new Date(),
        })
        .where(eq(ecclesias.id, id));

      logger.info(
        {
          ecclesiaId: id,
          name: parsed.data.name,
          region: parsed.data.region,
          adminId: profile.id,
        },
        'Ecclesia directory record updated by administrator'
      );
    } catch (error: any) {
      logger.error({ error: error?.message, id }, 'Failed to update ecclesia in database');
      return {
        success: false,
        error: 'Failed to update ecclesia directory entry. Please try again.',
      };
    }

    try {
      invalidateCacheTag(CACHE_TAGS.ecclesias, CACHE_TAGS.ecclesiasDisplayed, CACHE_TAGS.ecclesiasCount);
      revalidatePath('/');
      revalidatePath('/about');
      revalidatePath('/register');
      revalidatePath('/admin');
      revalidatePath('/admin/ecclesias');
    } catch (cacheErr: any) {
      logger.warn({ error: cacheErr?.message }, 'Cache revalidation warning');
    }

    redirect('/admin/ecclesias');
  } catch (err: any) {
    if (
      err?.digest === 'DYNAMIC_SERVER_USAGE' ||
      err?.message?.includes('DYNAMIC_SERVER_USAGE') ||
      err?.digest?.startsWith('NEXT_') ||
      err?.message === 'NEXT_REDIRECT'
    ) {
      throw err;
    }
    logger.error({ error: err?.message || err }, 'Unhandled error in updateEcclesiaAction');
    return {
      success: false,
      error: err?.message || 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * Server Action for Admins to delete an Ecclesia directory entry.
 */
export async function deleteEcclesiaAction(formData: FormData): Promise<void> {
  try {
    const { profile } = await verifyCurrentUserRole(['ADMIN', 'SUPERADMIN']);
    if (!profile) {
      logger.warn('Unauthorized attempt to delete ecclesia');
      return;
    }

    const id = formData.get('id') as string;
    if (!id) return;

    try {
      await db.delete(ecclesias).where(eq(ecclesias.id, id));
      logger.info({ id, adminId: profile.id }, 'Ecclesia deleted by administrator');
    } catch (error: any) {
      logger.error({ error: error?.message, id }, 'Failed to delete ecclesia');
      return;
    }

    try {
      invalidateCacheTag(CACHE_TAGS.ecclesias, CACHE_TAGS.ecclesiasDisplayed, CACHE_TAGS.ecclesiasCount);
      revalidatePath('/');
      revalidatePath('/about');
      revalidatePath('/register');
      revalidatePath('/admin');
      revalidatePath('/admin/ecclesias');
    } catch (cacheErr: any) {
      logger.warn({ error: cacheErr?.message }, 'Cache revalidation warning');
    }
  } catch (err: any) {
    logger.error({ error: err?.message || err }, 'Unhandled error in deleteEcclesiaAction');
  }
}
