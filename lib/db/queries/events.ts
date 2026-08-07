import { db } from '@/lib/db';
import { events, eventRegistrations, type Event } from '@/lib/db/schema/events';
import { eq, desc, asc, and } from 'drizzle-orm';
import { logger } from '@/lib/logger';

/**
 * Fetches all published events for public visitors, ordered by start date.
 */
export async function getPublishedEvents(): Promise<Event[]> {
  try {
    return await db
      .select()
      .from(events)
      .where(eq(events.isPublished, true))
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
