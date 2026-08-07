import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

/**
 * Site Settings Table
 * Configurable platform metrics such as youth & friends count, site banners, etc.
 */
export const siteSettings = pgTable('site_settings', {
  key: text('key').primaryKey(), // e.g. 'youth_and_friends_count'
  value: text('value').notNull(),
  description: text('description'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type SiteSetting = typeof siteSettings.$inferSelect;
export type NewSiteSetting = typeof siteSettings.$inferInsert;
