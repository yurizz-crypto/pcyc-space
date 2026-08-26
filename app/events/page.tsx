import React from 'react';
import { EventGrid } from '@/components/domain/events/event-grid';
import { EventsFaq } from '@/components/events/events-faq';
import { getCachedPublishedEvents } from '@/lib/db/queries/cached';
import { WarningCircle, Clock, CalendarCheck, Sparkle, MapPin, Compass, BookOpen } from '@phosphor-icons/react/dist/ssr';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { HeroGlow } from '@/components/ui/hero-glow';

export const metadata = {
  title: 'PCYC Events & Youth Gatherings',
  description:
    'Discover upcoming nationwide camps, regional study weekends, and local ecclesia youth circles across the Philippines.',
};

export default async function EventsPage() {
  const events = await getCachedPublishedEvents();

  return (
    <div className="flex flex-col w-full overflow-hidden">
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
      <section className="bg-[#2c3324] text-[#fefcf1] py-28 sm:py-36 border-b border-[#3d4632] relative overflow-hidden">
        <HeroGlow />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <ScrollReveal className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e0a861]/20 border border-[#e0a861]/40 text-xs font-bold text-[#e0a861]">
                <CalendarCheck weight="fill" className="h-3.5 w-3.5" />
                <span>Annual Youth Camps & Study Gatherings</span>
              </div>
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight">
                Gather with <br />
                <span className="text-[#e0a861] italic shimmer-text">the Brotherhood.</span>
              </h1>
              <p className="text-lg sm:text-xl text-[#f8f4e3]/85 leading-relaxed max-w-xl font-light">
                Discover upcoming nationwide camps, regional study weekends, and local ecclesia youth circles across Luzon, Visayas, and Mindanao.
              </p>
            </ScrollReveal>

            {/* Quick Filter Tag Cloud */}
            <ScrollReveal delay={0.2} className="lg:col-span-4 flex flex-wrap gap-2.5 lg:justify-end">
              {[
                { label: 'National Bible Camps', icon: Sparkle },
                { label: 'Regional Study Days', icon: BookOpen },
                { label: 'Ecclesia Youth Circles', icon: Compass },
                { label: 'Online Zoom Studies', icon: MapPin },
              ].map((tag, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2.5 rounded-2xl bg-white/10 dark:bg-black/30 border border-white/15 backdrop-blur-md text-xs font-semibold text-[#fefcf1] flex items-center gap-2 shadow-xs"
                >
                  <Sparkle weight="fill" className="h-3.5 w-3.5 text-[#e0a861]" />
                  <span>{tag.label}</span>
                </div>
              ))}
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Event Grid Section */}
      <section className="py-28 bg-[#fefcf1] dark:bg-[#131710]">
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

      {/* Events FAQ Section */}
      <section className="py-28 bg-[#f8f4e3] dark:bg-[#1b2117] border-t border-[#e6dfcb] dark:border-[#323d2b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EventsFaq />
        </div>
      </section>
    </div>
  );
}
