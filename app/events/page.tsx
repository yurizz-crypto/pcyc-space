import React from 'react';
import { EventGrid } from '@/components/domain/events/event-grid';
import { getCachedPublishedEvents } from '@/lib/db/queries/cached';
import { WarningCircle, Clock } from '@phosphor-icons/react/dist/ssr';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

export const metadata = {
  title: 'PCYC Events & Youth Gatherings',
  description:
    'Discover upcoming nationwide camps, regional study weekends, and local ecclesia youth circles across the Philippines.',
};

export default async function EventsPage() {
  const events = await getCachedPublishedEvents();

  return (
    <div className="flex flex-col w-full">
      {/* Editorial Testing Notice */}
      <div className="w-full bg-[#fbf1e2] dark:bg-[#2b2315] border-b border-[#e0a861]/40 text-[#422e1b] dark:text-[#f0be7c] py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs sm:text-sm">
          <div className="flex items-center gap-3">
            <WarningCircle weight="fill" className="h-4 w-4 text-[#9a6423] dark:text-[#e0a861] shrink-0" />
            <span>
              <strong className="text-[#2c3324] dark:text-[#fefcf1] font-semibold tracking-wide uppercase mr-1">Preview Mode:</strong>
              Event registrations are disabled during testing. All dates are for preview purposes only.
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 font-medium text-[#9a6423] dark:text-[#f0be7c] shrink-0 uppercase tracking-widest text-[10px] sm:text-xs">
            <Clock weight="bold" className="h-3.5 w-3.5" />
            <span>Opening Soon</span>
          </div>
        </div>
      </div>

      {/* Bold Invitation Header */}
      <section className="bg-[#2c3324] text-[#fefcf1] py-24 sm:py-32 border-b border-[#3d4632] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-[#e0a861]/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal className="max-w-3xl space-y-6">
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
              Gather with <br /> the Brotherhood.
            </h1>
            <p className="text-lg sm:text-xl text-[#f8f4e3]/80 leading-relaxed max-w-xl">
              Discover upcoming nationwide camps, regional study weekends, and local ecclesia youth circles across the Philippines.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Event Grid Section */}
      <section className="py-24 bg-[#fefcf1] dark:bg-[#131710]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <EventGrid
              events={events}
              emptyTitle="No Scheduled Events"
              emptyDescription="The youth committee is finalizing the schedule for the next series of camps and study weekends. Stay tuned!"
            />
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
