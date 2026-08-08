'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { notifications } from '@/lib/db/schema/notifications';
import { getCurrentUserProfile } from '@/lib/db/queries/users';
import { eq, and } from 'drizzle-orm';
import { logger } from '@/lib/logger';

export interface NotificationActionResult {
  success: boolean;
  error?: string;
}

/**
 * Server Action to mark a single notification as read.
 */
export async function markNotificationAsReadAction(
  formData: FormData
): Promise<NotificationActionResult> {
  try {
    const notificationId = formData.get('notificationId') as string;
    if (!notificationId) {
      return { success: false, error: 'Missing notification ID' };
    }

    const profile = await getCurrentUserProfile();
    if (!profile) {
      return { success: false, error: 'Unauthorized' };
    }

    await db
      .update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.id, notificationId), eq(notifications.userId, profile.id)));

    try {
      revalidatePath('/portal');
      revalidatePath('/', 'layout');
    } catch (cacheErr: any) {
      logger.warn({ error: cacheErr?.message }, 'Cache revalidation warning');
    }

    return { success: true };
  } catch (error: any) {
    logger.error({ error: error?.message || error }, 'Failed to mark notification as read');
    return { success: false, error: 'Failed to update notification' };
  }
}

/**
 * Server Action to mark all unread notifications for the current user as read.
 */
export async function markAllNotificationsAsReadAction(): Promise<NotificationActionResult> {
  try {
    const profile = await getCurrentUserProfile();
    if (!profile) {
      return { success: false, error: 'Unauthorized' };
    }

    await db
      .update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.userId, profile.id), eq(notifications.isRead, false)));

    try {
      revalidatePath('/portal');
      revalidatePath('/', 'layout');
    } catch (cacheErr: any) {
      logger.warn({ error: cacheErr?.message }, 'Cache revalidation warning');
    }

    return { success: true };
  } catch (error: any) {
    logger.error({ error: error?.message || error }, 'Failed to mark all notifications as read');
    return { success: false, error: 'Failed to mark notifications as read' };
  }
}

/**
 * Server Action to delete a notification from user feed.
 */
export async function deleteNotificationAction(
  formData: FormData
): Promise<NotificationActionResult> {
  try {
    const notificationId = formData.get('notificationId') as string;
    if (!notificationId) {
      return { success: false, error: 'Missing notification ID' };
    }

    const profile = await getCurrentUserProfile();
    if (!profile) {
      return { success: false, error: 'Unauthorized' };
    }

    await db
      .delete(notifications)
      .where(and(eq(notifications.id, notificationId), eq(notifications.userId, profile.id)));

    try {
      revalidatePath('/portal');
      revalidatePath('/', 'layout');
    } catch (cacheErr: any) {
      logger.warn({ error: cacheErr?.message }, 'Cache revalidation warning');
    }

    return { success: true };
  } catch (error: any) {
    logger.error({ error: error?.message || error }, 'Failed to delete notification');
    return { success: false, error: 'Failed to delete notification' };
  }
}
