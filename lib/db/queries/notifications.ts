import { cache } from 'react';
import { db } from '@/lib/db';
import { notifications, type Notification } from '@/lib/db/schema/notifications';
import { getCurrentUserProfile } from '@/lib/db/queries/users';
import { eq, desc, and, count } from 'drizzle-orm';
import { logger } from '@/lib/logger';

/**
 * Fetches notifications for the currently logged-in user.
 * Memoized per server request lifecycle using React.cache().
 */
export const getCurrentUserNotifications = cache(async function getCurrentUserNotifications(
  limit = 20
): Promise<Notification[]> {
  const profile = await getCurrentUserProfile();
  if (!profile) return [];

  try {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, profile.id))
      .orderBy(desc(notifications.createdAt))
      .limit(limit);
  } catch (error: any) {
    if (
      error?.digest === 'DYNAMIC_SERVER_USAGE' ||
      error?.message?.includes('DYNAMIC_SERVER_USAGE') ||
      error?.digest?.startsWith('NEXT_')
    ) {
      throw error;
    }
    logger.error(
      { userId: profile.id, error: error?.message || error },
      'Failed to fetch current user notifications'
    );
    return [];
  }
});

/**
 * Fetches notifications for a specific user ID.
 * Memoized per server request lifecycle.
 */
export const getUserNotifications = cache(async function getUserNotifications(
  userId: string,
  limit = 20
): Promise<Notification[]> {
  try {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(limit);
  } catch (error: any) {
    if (
      error?.digest === 'DYNAMIC_SERVER_USAGE' ||
      error?.message?.includes('DYNAMIC_SERVER_USAGE') ||
      error?.digest?.startsWith('NEXT_')
    ) {
      throw error;
    }
    logger.error(
      { userId, error: error?.message || error },
      'Failed to fetch user notifications by userId'
    );
    return [];
  }
});

/**
 * Gets the count of unread notifications for a user.
 * Memoized per server request lifecycle.
 */
export const getUnreadNotificationCount = cache(async function getUnreadNotificationCount(
  userId: string
): Promise<number> {
  try {
    const result = await db
      .select({ count: count() })
      .from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));

    return Number(result[0]?.count || 0);
  } catch (error: any) {
    if (
      error?.digest === 'DYNAMIC_SERVER_USAGE' ||
      error?.message?.includes('DYNAMIC_SERVER_USAGE') ||
      error?.digest?.startsWith('NEXT_')
    ) {
      throw error;
    }
    logger.error(
      { userId, error: error?.message || error },
      'Failed to fetch unread notification count'
    );
    return 0;
  }
});
