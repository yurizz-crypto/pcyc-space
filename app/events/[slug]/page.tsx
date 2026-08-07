import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getEventBySlug } from '@/lib/db/queries/events';
import { formatPHP, formatDate } from '@/lib/utils';
import { Calendar, MapPin, Users, CheckCircle2, ArrowLeft } from 'lucide-react';

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

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
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

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

      <section className="py-12 sm:py-16 bg-[#fefcf1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Main Content */}
            <div className="lg:col-span-8 space-y-10">
              {/* Event Overview */}
              <div className="space-y-4">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2c3324]">
                  About This Gathering
                </h2>
                <div className="text-sm sm:text-base text-[#505748] leading-relaxed space-y-4">
                  <p>{event.description}</p>
                </div>
              </div>

              {/* What to Bring / Notes */}
              <div className="p-6 rounded-2xl bg-[#f8f4e3] border border-[#e6dfcb] space-y-3">
                <h4 className="font-serif font-bold text-lg text-[#2c3324]">
                  What to Bring & Camp Guidelines
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-[#505748]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2e7d32] shrink-0" />
                    <span>Holy Bible, notebook, pens, and hymnal</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2e7d32] shrink-0" />
                    <span>Modest clothing suitable for study sessions and fellowship activities</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2e7d32] shrink-0" />
                    <span>Personal toiletries, water bottle, and any personal medications</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2e7d32] shrink-0" />
                    <span>A joyful and prayerful heart ready for fellowship</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Sticky Registration Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                <Card className="border-[#e0a861]/40 shadow-lg">
                  <CardHeader className="bg-[#2c3324] text-[#fefcf1] p-6 space-y-2 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#e0a861] uppercase tracking-wider">
                        Registration
                      </span>
                      <Badge variant="gold" size="sm">
                        {event.status}
                      </Badge>
                    </div>
                    <div className="font-serif font-bold text-2xl sm:text-3xl text-white">
                      Open Fellowship
                    </div>
                    <p className="text-[11px] text-[#f8f4e3]/75">
                      Includes camp materials, accommodations & meals.
                    </p>
                  </CardHeader>

                  <CardContent className="p-6 space-y-4 text-xs sm:text-sm text-[#505748]">
                    <div className="space-y-3 border-b border-[#f0ebd3] pb-4">
                      <div className="flex items-start gap-2.5">
                        <Calendar className="h-4 w-4 text-[#e0a861] shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-[#2c3324]">Dates:</strong>
                          <span>{formatDate(event.startDate)} &ndash; {formatDate(event.endDate)}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <MapPin className="h-4 w-4 text-[#e0a861] shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-[#2c3324]">Location:</strong>
                          <span>{event.location}</span>
                        </div>
                      </div>

                      {event.maxAttendees && (
                        <div className="flex items-start gap-2.5">
                          <Users className="h-4 w-4 text-[#e0a861] shrink-0 mt-0.5" />
                          <div>
                            <strong className="block text-[#2c3324]">Capacity:</strong>
                            <span>Limited to {event.maxAttendees} attendees</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 pt-2">
                      <Link href="/register" className="block w-full">
                        <Button variant="primary" size="lg" className="w-full shadow-md">
                          <span>Register for this Event</span>
                        </Button>
                      </Link>
                      <p className="text-[11px] text-center text-[#8a9180]">
                        Log in or create a PCYC account to manage your event registrations.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Subsidies & Questions */}
                <div className="p-5 rounded-2xl bg-[#f8f4e3] border border-[#e6dfcb] text-xs text-[#707666] space-y-2">
                  <strong className="block text-[#2c3324] font-medium">Need Travel Subsidy?</strong>
                  <p>
                    If you are traveling from distant islands or in need of financial assistance,
                    please email the PCYC committee at{' '}
                    <a href="mailto:contact@pcyc.ph" className="text-[#9a6423] underline font-medium">
                      contact@pcyc.ph
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
