import React from 'react';
import { EventCard } from './event-card';
import { EmptyState } from '@/components/molecules/empty-state';
import { Calendar } from 'lucide-react';
import type { Event } from '@/lib/db/schema/events';

export interface EventGridProps {
  events: Event[];
  emptyTitle?: string;
  emptyDescription?: string;
}

export function EventGrid({
  events,
  emptyTitle = 'No events scheduled yet',
  emptyDescription = 'There are currently no events listed under this category. Please check back soon or browse other fellowship gatherings.',
}: EventGridProps) {
  if (!events || events.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title={emptyTitle}
        description={emptyDescription}
        actionLabel="View All Events"
        actionHref="/events"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
