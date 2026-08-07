import { pgTable, uuid, text, timestamp, boolean, integer, index } from 'drizzle-orm/pg-core';

/**
 * Philippine Ecclesias Table
 * Stores verified Christadelphian ecclesias across Luzon, Visayas, and Mindanao.
 */
export const ecclesias = pgTable(
  'ecclesias',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    region: text('region').notNull(), // 'Luzon' | 'Visayas' | 'Mindanao'
    city: text('city').notNull(),
    address: text('address').notNull(),
    contactPerson: text('contact_person'),
    meetingSchedule: text('meeting_schedule').notNull(),
    isDisplayed: boolean('is_displayed').default(true).notNull(),
    orderIndex: integer('order_index').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_ecclesias_display_region').on(table.isDisplayed, table.region),
    index('idx_ecclesias_order_index').on(table.orderIndex),
  ]
);

export type Ecclesia = typeof ecclesias.$inferSelect;
export type NewEcclesia = typeof ecclesias.$inferInsert;
