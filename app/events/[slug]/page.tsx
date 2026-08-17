import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { getUserEventRegistration } from '@/lib/db/queries/events';
import { getCachedEventBySlug } from '@/lib/db/queries/cached';
import { getCurrentUserProfile } from '@/lib/db/queries/users';
import { formatPHP, formatEventSchedule } from '@/lib/utils';
import { Calendar, MapPin, Users, CheckCircle, ArrowLeft } from '@phosphor-icons/react/dist/ssr';
import { EventRegistrationBox } from '@/components/domain/events/event-registration-box';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ui/scroll-reveal';

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const event = await getCachedEventBySlug(slug);

  if (!event) {
    return { title: 'Event Not Found — PCYC Space' };
  }

  return {
    title: `${event.title} — PCYC Space`,
    description: event.theme || event.description,
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const [event, profile] = await Promise.all([
    getCachedEventBySlug(slug),
    getCurrentUserProfile(),
  ]);

  if (!event) {
    notFound();
  }

  const existingRegistration = profile
    ? await getUserEventRegistration(profile.id, event.id)
    : null;

  return (
    <div className="flex flex-col w-full">
      {/* Top Breadcrumb Header */}
      <div className="bg-[#1b2117] text-[#fefcf1] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#e0a861] hover:text-[#f0be7c] transition-colors"
          >
            <ArrowLeft weight="bold" className="h-3.5 w-3.5" />
            <span>All Gatherings</span>
          </Link>
        </div>
      </div>

      {/* Editorial Event Hero */}
      <section className="bg-[#2c3324] text-[#fefcf1] pt-12 pb-24 sm:pb-32 border-b border-[#3d4632] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#e0a861]/15 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal className="max-w-4xl space-y-8">
            <Badge variant="gold" size="md" className="rounded-full">
              {event.status}
            </Badge>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight text-[#fefcf1]">
              {event.title}
            </h1>
            {event.theme && (
              <p className="text-xl sm:text-2xl text-[#e0a861] font-serif italic max-w-2xl leading-relaxed">
                "{event.theme}"
              </p>
            )}
          </ScrollReveal>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-[#fefcf1] dark:bg-[#131710] -mt-12 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left Main Content */}
            <div className="lg:col-span-8 space-y-12">
              
              {/* Event Hero Banner Image (Editorial full-bleed style within container) */}
              {event.bannerUrl && (
                <ScrollReveal>
                  <div className="relative aspect-[21/9] w-full rounded-[2rem] overflow-hidden bg-[#2c3324] shadow-2xl">
                    <Image
                      src={event.bannerUrl}
                      alt={event.title}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 1024px) 100vw, 66vw"
                    />
                  </div>
                </ScrollReveal>
              )}

              {/* Event Overview */}
              <ScrollReveal className="space-y-6">
                <h2 className="font-serif text-3xl font-bold text-[#2c3324] dark:text-[#fefcf1]">
                  About This Gathering
                </h2>
                <div className="text-lg text-[#5a634e] dark:text-[#a3ab98] leading-relaxed space-y-4">
                  <p>{event.description}</p>
                </div>
              </ScrollReveal>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Event Details Grid (Bento Style) */}
                <StaggerItem className="md:col-span-2 p-8 rounded-3xl bg-[#f8f4e3] dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b] space-y-6 shadow-sm">
                  <h4 className="font-serif font-bold text-2xl text-[#2c3324] dark:text-[#fefcf1]">
                    Logistics & Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-base text-[#5a634e] dark:text-[#a3ab98]">
                    
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-xl bg-white dark:bg-[#252e1f] border border-[#e6dfcb] dark:border-[#3d4632] flex items-center justify-center shrink-0">
                        <Calendar weight="duotone" className="h-5 w-5 text-[#9a6423] dark:text-[#e0a861]" />
                      </div>
                      <div className="space-y-1 pt-1">
                        <strong className="block text-[#2c3324] dark:text-[#fefcf1] font-semibold">Schedule</strong>
                        <span className="text-sm">{formatEventSchedule(event.startDate, event.endDate)}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-xl bg-white dark:bg-[#252e1f] border border-[#e6dfcb] dark:border-[#3d4632] flex items-center justify-center shrink-0">
                        <MapPin weight="duotone" className="h-5 w-5 text-[#9a6423] dark:text-[#e0a861]" />
                      </div>
                      <div className="space-y-1 pt-1">
                        <strong className="block text-[#2c3324] dark:text-[#fefcf1] font-semibold">Location</strong>
                        <span className="text-sm">{event.location}</span>
                      </div>
                    </div>

                    {event.maxAttendees && (
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-xl bg-white dark:bg-[#252e1f] border border-[#e6dfcb] dark:border-[#3d4632] flex items-center justify-center shrink-0">
                          <Users weight="duotone" className="h-5 w-5 text-[#9a6423] dark:text-[#e0a861]" />
                        </div>
                        <div className="space-y-1 pt-1">
                          <strong className="block text-[#2c3324] dark:text-[#fefcf1] font-semibold">Capacity</strong>
                          <span className="text-sm">Limited to {event.maxAttendees}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-xl bg-[#2c3324] flex items-center justify-center shrink-0">
                        <CheckCircle weight="fill" className="h-5 w-5 text-[#e0a861]" />
                      </div>
                      <div className="space-y-1 pt-1">
                        <strong className="block text-[#2c3324] dark:text-[#fefcf1] font-semibold">Fee</strong>
                        <span className="font-bold text-[#2c3324] dark:text-[#fefcf1] text-sm">
                          {Number(event.registrationFee || 0) === 0
                            ? 'Free Fellowship'
                            : formatPHP(Number(event.registrationFee))}
                        </span>
                      </div>
                    </div>
                  </div>
                </StaggerItem>

                {/* What to Bring / Notes */}
                <StaggerItem className="md:col-span-2 p-8 rounded-3xl bg-white dark:bg-[#131710] border border-[#e6dfcb] dark:border-[#323d2b] space-y-6 shadow-sm">
                  <h4 className="font-serif font-bold text-2xl text-[#2c3324] dark:text-[#fefcf1]">
                    Camp Guidelines
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-[#5a634e] dark:text-[#a3ab98]">
                    <li className="flex items-start gap-3">
                      <CheckCircle weight="fill" className="h-5 w-5 text-[#e0a861] shrink-0 mt-0.5" />
                      <span>Holy Bible, notebook, pens, and hymnal</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle weight="fill" className="h-5 w-5 text-[#e0a861] shrink-0 mt-0.5" />
                      <span>Modest clothing for study sessions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle weight="fill" className="h-5 w-5 text-[#e0a861] shrink-0 mt-0.5" />
                      <span>Toiletries and personal medications</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle weight="fill" className="h-5 w-5 text-[#e0a861] shrink-0 mt-0.5" />
                      <span>A joyful heart ready for fellowship</span>
                    </li>
                  </ul>
                </StaggerItem>
              </StaggerContainer>
            </div>

            {/* Right Sticky Registration Sidebar */}
            <div className="lg:col-span-4">
              <ScrollReveal className="sticky top-24 space-y-6">
                {/* Event Registration Box */}
                <EventRegistrationBox
                  event={event}
                  user={profile}
                  registration={existingRegistration}
                />

                {/* Subsidies & Questions */}
                <div className="p-6 rounded-3xl bg-[#f8f4e3] dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b] space-y-3 shadow-sm">
                  <strong className="font-serif text-lg text-[#2c3324] dark:text-[#fefcf1] block">
                    Travel Assistance
                  </strong>
                  <p className="text-sm text-[#707666] dark:text-[#a3ab98] leading-relaxed">
                    Traveling from distant islands? Don't let funds stop you from joining. Email the PCYC committee at{' '}
                    <a href="mailto:bumadillal@gmail.com" className="text-[#9a6423] dark:text-[#f0be7c] hover:underline font-semibold">
                      bumadillal@gmail.com
                    </a>{' '}
                    for subsidy details.
                  </p>
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
