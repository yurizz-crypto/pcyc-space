import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEventById, getEventAttendees } from '@/lib/db/queries/events';
import { AttendeesClientView } from './attendees-client-view';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate, formatPHP, formatEventSchedule } from '@/lib/utils';
import { ArrowLeft, Calendar, MapPin, Printer } from 'lucide-react';

interface EventAttendeesPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: EventAttendeesPageProps) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    return { title: 'Attendees Not Found — PCYC Space Admin' };
  }

  return {
    title: `${event.title} Attendees (${event.status}) — PCYC Space Admin`,
    description: `Manage registered attendees, verify GCash payment receipts, and print registration manifests for ${event.title}.`,
  };
}

export default async function EventAttendeesPage({ params }: EventAttendeesPageProps) {
  const { id } = await params;
  const [event, attendees] = await Promise.all([
    getEventById(id),
    getEventAttendees(id),
  ]);

  if (!event) {
    notFound();
  }

  const feeNum = Number(event.registrationFee || 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/admin/events"
            className="inline-flex items-center gap-1.5 text-xs text-[#505748] hover:text-[#2c3324] font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Events Management</span>
          </Link>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2c3324]">
            {event.title} &mdash; Registered Attendees
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#707666]">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-[#e0a861]" />
              <span>{formatEventSchedule(event.startDate, event.endDate)}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-[#e0a861]" />
              <span>{event.location}</span>
            </span>
            <span>•</span>
            <span>Fee: <strong>{feeNum === 0 ? 'Free Admission' : formatPHP(feeNum)}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="gold" size="md">
            {attendees.length} Registered
          </Badge>
          <Link href={`/admin/events/${event.id}/print`}>
            <Button variant="primary" size="sm" className="gap-1.5 shadow-xs">
              <Printer className="h-3.5 w-3.5" />
              <span>Print Sheet</span>
            </Button>
          </Link>
          <Link href={`/admin/events/${event.id}/edit`}>
            <Button variant="outline" size="sm">
              <span>Edit Event</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Interactive Attendees Directory with Search, Filter Tabs & Pagination */}
      <AttendeesClientView event={event} attendees={attendees} />
    </div>
  );
}
