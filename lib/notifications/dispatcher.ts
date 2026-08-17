import { db } from '@/lib/db';
import { notifications, type NotificationType } from '@/lib/db/schema/notifications';
import { getAdminProfiles } from '@/lib/db/queries/users';
import { profiles } from '@/lib/db/schema/users';
import { eq } from 'drizzle-orm';
import { sendEmail } from '@/lib/email/mailer';
import { createModuleLogger } from '@/lib/logger';

const log = createModuleLogger('notifications:dispatcher');

export interface DispatchNotificationOptions {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  linkUrl?: string;
  metadata?: Record<string, unknown>;
  email?: {
    to?: string;
    subject: string;
    html: string;
    text?: string;
  };
  notifyAdmins?: boolean;
  adminAlert?: {
    title: string;
    message: string;
    linkUrl?: string;
    emailSubject?: string;
    emailHtml?: string;
  };
}

export interface DispatchResult {
  inAppNotificationId?: string;
  emailDispatched?: boolean;
  adminAlertsDispatched?: number;
}

/**
 * Unified notification engine for PCYC Space.
 * Concurrently writes in-app notifications and dispatches transactional emails
 * with non-blocking fail-safe error isolation.
 */
export async function dispatchNotification({
  userId,
  type,
  title,
  message,
  linkUrl,
  metadata,
  email,
  notifyAdmins,
  adminAlert,
}: DispatchNotificationOptions): Promise<DispatchResult> {
  const result: DispatchResult = {};

  try {
    const tasks: Promise<unknown>[] = [];

    // 1. In-App User Notification Write
    const userInAppPromise = (async () => {
      // Guard: Ensure user exists before inserting to prevent FK constraint failure
      const userExists = await db
        .select({ id: profiles.id })
        .from(profiles)
        .where(eq(profiles.id, userId))
        .limit(1);

      if (userExists.length === 0) {
        log.warn({ userId, type, title }, 'Skipped in-app notification: User profile not found');
        return;
      }

      const inserted = await db
        .insert(notifications)
        .values({
          userId,
          type,
          title,
          message,
          linkUrl: linkUrl || null,
          metadata: metadata || null,
        })
        .returning({ id: notifications.id });
        
      result.inAppNotificationId = inserted[0]?.id;
      log.info({ userId, type, title, notificationId: result.inAppNotificationId }, 'In-app notification created');
    })().catch((err) => {
      log.error({ userId, type, title, error: err }, 'Failed to insert in-app notification');
    });

    tasks.push(userInAppPromise);

    // 2. User Email Dispatch (if email payload provided)
    if (email && email.to) {
      const userEmailPromise = sendEmail({
        to: email.to,
        subject: email.subject,
        html: email.html,
        text: email.text,
      })
        .then((emailRes) => {
          result.emailDispatched = emailRes.success;
          if (emailRes.success) {
            log.info({ to: email.to, subject: email.subject }, 'User notification email delivered');
          }
        })
        .catch((err) => {
          log.error({ to: email.to, subject: email.subject, error: err }, 'User email dispatch error');
        });

      tasks.push(userEmailPromise);
    }

    // 3. Admin Alerts (In-App + Email to admins if requested)
    if (notifyAdmins) {
      const adminPromise = (async () => {
        try {
          const admins = await getAdminProfiles();
          if (admins.length === 0) return;

          // Insert in-app notifications for all admins
          const adminTitle = adminAlert?.title || title;
          const adminMessage = adminAlert?.message || message;
          const adminLink = adminAlert?.linkUrl || linkUrl;

          const adminNotificationValues = admins.map((admin) => ({
            userId: admin.id,
            type: 'SYSTEM' as NotificationType,
            title: `[Admin Alert] ${adminTitle}`,
            message: adminMessage,
            linkUrl: adminLink || '/admin',
            metadata: metadata || null,
          }));

          await db.insert(notifications).values(adminNotificationValues);
          result.adminAlertsDispatched = admins.length;

          // Send admin alert email if template provided
          if (adminAlert?.emailSubject && adminAlert?.emailHtml) {
            const adminEmails = admins.map((a) => a.email).filter(Boolean);
            if (adminEmails.length > 0) {
              await sendEmail({
                to: adminEmails,
                subject: adminAlert.emailSubject,
                html: adminAlert.emailHtml,
              });
            }
          }
        } catch (adminErr: any) {
          log.error({ error: adminErr?.message || adminErr }, 'Failed to dispatch admin notification alerts');
        }
      })();

      tasks.push(adminPromise);
    }

    // Await all tasks concurrently with zero unhandled rejections
    await Promise.allSettled(tasks);
    
    log.info(
      { 
        userId, 
        inAppCreated: !!result.inAppNotificationId, 
        emailDispatched: result.emailDispatched, 
        adminAlerts: result.adminAlertsDispatched || 0 
      }, 
      'Dispatch complete'
    );
  } catch (error: any) {
    log.error({ userId, type, title, error }, 'Unhandled error in dispatchNotification');
  }

  return result;
}
