'use client';

import React, { useState } from 'react';
import { EventCard } from './event-card';
import { EmptyState } from '@/components/molecules/empty-state';
import { Pagination } from '@/components/ui/pagination';
import { Calendar } from 'lucide-react';
import type { Event } from '@/lib/db/schema/events';

export interface EventGridProps {
  events: Event[];
  emptyTitle?: string;
  emptyDescription?: string;
  pageSize?: number;
}

export function EventGrid({
  events,
  emptyTitle = 'No events scheduled yet',
  emptyDescription = 'There are currently no events listed under this category. Please check back soon or browse other fellowship gatherings.',
  pageSize = 9,
}: EventGridProps) {
  const [currentPage, setCurrentPage] = useState(1);

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

  const totalPages = Math.max(1, Math.ceil(events.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * pageSize;
  const paginatedEvents = events.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {events.length > pageSize && (
        <div className="pt-4 flex justify-center">
          <Pagination
            currentPage={activePage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            totalItems={events.length}
            pageSize={pageSize}
            showCount={true}
          />
        </div>
      )}
    </div>
  );
}
