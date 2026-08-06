import { pgTable, uuid, text, timestamp, boolean, integer, pgEnum } from 'drizzle-orm/pg-core';
import { profiles } from './users';

export const eventStatusEnum = pgEnum('event_status', ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED']);
export const registrationStatusEnum = pgEnum('registration_status', ['CONFIRMED', 'WAITLISTED', 'CANCELLED']);

/**
 * Events Table
 * Manages PCYC youth gatherings, bible camps, fellowship activities, and history.
 */
export const events = pgTable('events', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  theme: text('theme'),
  bannerUrl: text('banner_url'),
  startDate: timestamp('start_date', { withTimezone: true }).notNull(),
  endDate: timestamp('end_date', { withTimezone: true }).notNull(),
  location: text('location').notNull(),
  isPublished: boolean('is_published').default(false).notNull(),
  status: eventStatusEnum('status').default('UPCOMING').notNull(),
  maxAttendees: integer('max_attendees'),
  registrationDeadline: timestamp('registration_deadline', { withTimezone: true }),
  createdById: uuid('created_by_id').references(() => profiles.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Event Registrations Table
 */
export const eventRegistrations = pgTable('event_registrations', {
  id: uuid('id').defaultRandom().primaryKey(),
  eventId: uuid('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  status: registrationStatusEnum('status').default('CONFIRMED').notNull(),
  specialRequirements: text('special_requirements'),
  registeredAt: timestamp('registered_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type EventRegistration = typeof eventRegistrations.$inferSelect;
export type NewEventRegistration = typeof eventRegistrations.$inferInsert;
