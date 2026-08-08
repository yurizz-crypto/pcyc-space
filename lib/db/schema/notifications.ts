import { pgTable, uuid, text, timestamp, boolean, jsonb, pgEnum, index } from 'drizzle-orm/pg-core';
import { profiles } from './users';

/**
 * Notification Types Enum
 */
export const notificationTypeEnum = pgEnum('notification_type', [
  'EVENT_REGISTRATION',
  'ORDER_STATUS',
  'PAYMENT_VERIFICATION',
  'ACCOUNT',
  'ANNOUNCEMENT',
  'SYSTEM',
]);

export type NotificationType = (typeof notificationTypeEnum.enumValues)[number];

/**
 * In-App Notifications Table
 * Stores real-time in-app notifications and event updates for members and administrators.
 */
export const notifications = pgTable(
  'notifications',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    type: notificationTypeEnum('type').default('SYSTEM').notNull(),
    title: text('title').notNull(),
    message: text('message').notNull(),
    linkUrl: text('link_url'),
    isRead: boolean('is_read').default(false).notNull(),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_notifications_user_unread').on(table.userId, table.isRead),
    index('idx_notifications_user_created').on(table.userId, table.createdAt),
  ]
);

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
