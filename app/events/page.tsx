import React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { EventGrid } from '@/components/domain/events/event-grid';
import { getCachedPublishedEvents } from '@/lib/db/queries/cached';
import { AlertTriangle, Clock } from 'lucide-react';

export const metadata = {
  title: 'PCYC Events & Youth Gatherings',
  description:
    'Discover upcoming nationwide camps, regional study weekends, and local ecclesia youth circles across the Philippines.',
};

export default async function EventsPage() {
  const events = await getCachedPublishedEvents();

  return (
    <div className="flex flex-col w-full">
      {/* Testing Notice Banner */}
      <div className="w-full bg-[#fbf1e2] border-b border-[#e0a861]/40 text-[#422e1b] py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              <strong className="text-[#2c3324]">Testing Phase Notice:</strong> Event registrations are currently disabled while the website is in testing. All event dates and details are for preview only.
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#9a6423] shrink-0">
            <Clock className="h-3.5 w-3.5" />
            <span>Official Registrations Opening Soon</span>
          </div>
        </div>
      </div>

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
