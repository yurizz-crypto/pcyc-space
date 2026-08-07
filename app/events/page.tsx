import React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { EventGrid } from '@/components/domain/events/event-grid';
import { getPublishedEvents } from '@/lib/db/queries/events';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'PCYC Events & Youth Gatherings',
  description:
    'Discover upcoming nationwide camps, regional study weekends, and local ecclesia youth circles across the Philippines.',
};

export default async function EventsPage() {
  const events = await getPublishedEvents();

  return (
    <div className="flex flex-col w-full">
      <PageHeader
        badge="Fellowship & Youth Camps"
        title="PCYC Events & Study Circles"
        description="Discover upcoming nationwide camps, regional gatherings, and local study circles for the Philippine Christadelphian brotherhood."
      />

      <section className="py-12 sm:py-16 bg-[#fefcf1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <EventGrid
            events={events}
            emptyTitle="No Scheduled Events"
            emptyDescription="There are currently no upcoming events posted. Stay tuned as new study weekends and camps are announced!"
          />
        </div>
      </section>
    </div>
  );
}
