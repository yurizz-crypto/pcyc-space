import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getUserEventRegistration } from '@/lib/db/queries/events';
import { getCachedEventBySlug } from '@/lib/db/queries/cached';
import { getCurrentUserProfile } from '@/lib/db/queries/users';
import { formatPHP, formatDate, formatEventSchedule } from '@/lib/utils';
import { Calendar, MapPin, Users, CheckCircle2, ArrowLeft } from 'lucide-react';
import { EventRegistrationBox } from '@/components/domain/events/event-registration-box';

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
      <div className="bg-[#2c3324] text-[#fefcf1] py-4 border-b border-[#3d4632]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-xs text-[#e0a861] hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to All Events</span>
          </Link>
        </div>
      </div>

      <PageHeader
        badge={event.status}
        title={event.title}
        description={event.theme || event.description}
      />

      <section className="py-12 sm:py-16 bg-[#fefcf1] dark:bg-[#131710]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Main Content */}
            <div className="lg:col-span-8 space-y-10">
              {/* Event Hero Banner Image */}
              {event.bannerUrl && (
                <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-[#2c3324]/5 border border-[#e6dfcb] dark:border-[#323d2b] shadow-md">
                  <Image
                    src={event.bannerUrl}
                    alt={event.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                </div>
              )}

              {/* Event Overview */}
              <div className="space-y-4">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2c3324] dark:text-[#fefcf1]">
                  About This Gathering
                </h2>
                <div className="text-sm sm:text-base text-[#505748] dark:text-[#a3ab98] leading-relaxed space-y-4">
                  <p>{event.description}</p>
                </div>
              </div>

              {/* Event Details Grid */}
              <div className="p-6 rounded-2xl bg-[#f8f4e3] dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b] space-y-4">
                <h4 className="font-serif font-bold text-lg text-[#2c3324] dark:text-[#fefcf1]">
                  Gathering Logistics
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-[#505748] dark:text-[#a3ab98]">
                  <div className="flex items-start gap-2.5">
                    <Calendar className="h-4 w-4 text-[#e0a861] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#2c3324] dark:text-[#fefcf1]">Schedule & Times:</strong>
                      <span>{formatEventSchedule(event.startDate, event.endDate)}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-[#e0a861] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#2c3324] dark:text-[#fefcf1]">Location:</strong>
                      <span>{event.location}</span>
                    </div>
                  </div>

                  {event.maxAttendees && (
                    <div className="flex items-start gap-2.5">
                      <Users className="h-4 w-4 text-[#e0a861] shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-[#2c3324] dark:text-[#fefcf1]">Capacity:</strong>
                        <span>Limited to {event.maxAttendees} attendees</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#2e7d32] dark:text-[#66bb6a] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#2c3324] dark:text-[#fefcf1]">Registration Fee:</strong>
                      <span className="font-bold text-[#2c3324] dark:text-[#fefcf1]">
                        {Number(event.registrationFee || 0) === 0
                          ? 'Free Fellowship'
                          : formatPHP(Number(event.registrationFee))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* What to Bring / Notes */}
              <div className="p-6 rounded-2xl bg-[#f8f4e3] dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b] space-y-3">
                <h4 className="font-serif font-bold text-lg text-[#2c3324] dark:text-[#fefcf1]">
                  What to Bring & Camp Guidelines
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-[#505748] dark:text-[#a3ab98]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2e7d32] dark:text-[#66bb6a] shrink-0" />
                    <span>Holy Bible, notebook, pens, and hymnal</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2e7d32] dark:text-[#66bb6a] shrink-0" />
                    <span>Modest clothing suitable for study sessions and fellowship activities</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2e7d32] dark:text-[#66bb6a] shrink-0" />
                    <span>Personal toiletries, water bottle, and any personal medications</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2e7d32] dark:text-[#66bb6a] shrink-0" />
                    <span>A joyful and prayerful heart ready for fellowship</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Sticky Registration Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                {/* Event Registration Box */}
                <EventRegistrationBox
                  event={event}
                  user={profile}
                  registration={existingRegistration}
                />

                {/* Subsidies & Questions */}
                <div className="p-5 rounded-2xl bg-[#f8f4e3] dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b] text-xs text-[#707666] dark:text-[#a3ab98] space-y-2">
                  <strong className="block text-[#2c3324] dark:text-[#fefcf1] font-medium">Need Travel Subsidy?</strong>
                  <p>
                    If you are traveling from distant islands or in need of financial assistance,
                    please email the PCYC committee at{' '}
                    <a href="mailto:bumadillal@gmail.com" className="text-[#9a6423] dark:text-[#f0be7c] underline font-medium">
                      bumadillal@gmail.com
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
