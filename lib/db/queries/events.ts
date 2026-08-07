import { db } from '@/lib/db';
import { events, eventRegistrations, type Event } from '@/lib/db/schema/events';
import { eq, desc, asc, and, ne } from 'drizzle-orm';
import { logger } from '@/lib/logger';

/**
 * Fetches all published events for public visitors, ordered by start date.
 */
export async function getPublishedEvents(): Promise<Event[]> {
  try {
    return await db
      .select()
      .from(events)
      .where(and(eq(events.isPublished, true), ne(events.status, 'ARCHIVED')))
      .orderBy(asc(events.startDate));
  } catch (error) {
    logger.error({ error }, 'Failed to fetch published events');
    return [];
  }
}

/**
 * Fetches all events (including drafts and past events) for Admin dashboard.
 */
export async function getAllEvents(): Promise<Event[]> {
  try {
    return await db.select().from(events).orderBy(desc(events.createdAt));
  } catch (error) {
    logger.error({ error }, 'Failed to fetch all events for admin');
    return [];
  }
}

/**
 * Fetches a single published event by its URL slug.
 */
export async function getEventBySlug(slug: string): Promise<Event | null> {
  try {
    const results = await db
      .select()
      .from(events)
      .where(eq(events.slug, slug))
      .limit(1);

    return results[0] || null;
  } catch (error) {
    logger.error({ error, slug }, 'Failed to fetch event by slug');
    return null;
  }
}

/**
 * Fetches a single event by ID for the admin editor.
 */
export async function getEventById(id: string): Promise<Event | null> {
  try {
    const results = await db
      .select()
      .from(events)
      .where(eq(events.id, id))
      .limit(1);

    return results[0] || null;
  } catch (error) {
    logger.error({ error, id }, 'Failed to fetch event by id');
    return null;
  }
}

/**
 * Fetches a user's registration for a specific event (if any).
 */
export async function getUserEventRegistration(userId: string, eventId: string) {
  try {
    const results = await db
      .select()
      .from(eventRegistrations)
      .where(and(eq(eventRegistrations.userId, userId), eq(eventRegistrations.eventId, eventId)))
      .limit(1);

    return results[0] || null;
  } catch (error) {
    logger.error({ error, userId, eventId }, 'Failed to fetch user event registration');
    return null;
  }
}

/**
 * Fetches all event registrations for a user with joined event details (for Member Portal).
 */
export async function getUserEventRegistrations(userId: string) {
  try {
    return await db
      .select({
        registration: eventRegistrations,
        event: events,
      })
      .from(eventRegistrations)
      .innerJoin(events, eq(eventRegistrations.eventId, events.id))
      .where(eq(eventRegistrations.userId, userId))
      .orderBy(desc(eventRegistrations.registeredAt));
  } catch (error) {
    logger.error({ error, userId }, 'Failed to fetch user event registrations');
    return [];
  }
}

/**
 * Fetches all attendees for an event with user profile details (for Admin).
 */
export async function getEventAttendees(eventId: string) {
  try {
    const { profiles } = await import('@/lib/db/schema/users');
    return await db
      .select({
        registration: eventRegistrations,
        profile: profiles,
      })
      .from(eventRegistrations)
      .innerJoin(profiles, eq(eventRegistrations.userId, profiles.id))
      .where(eq(eventRegistrations.eventId, eventId))
      .orderBy(desc(eventRegistrations.registeredAt));
  } catch (error) {
    logger.error({ error, eventId }, 'Failed to fetch event attendees');
    return [];
  }
}

