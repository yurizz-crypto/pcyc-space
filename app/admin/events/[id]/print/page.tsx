import React from 'react';
import { notFound } from 'next/navigation';
import { getEventById, getEventAttendees } from '@/lib/db/queries/events';
import { PrintAttendeesView } from './print-attendees-view';

export const dynamic = 'force-dynamic';

interface AdminPrintAttendeesPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: AdminPrintAttendeesPageProps) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    return { title: 'Print Attendees — PCYC Space Admin' };
  }

  return {
    title: `Print Attendees: ${event.title} — PCYC Space Admin`,
  };
}

export default async function AdminPrintAttendeesPage({ params }: AdminPrintAttendeesPageProps) {
  const { id } = await params;
  const [event, attendees] = await Promise.all([
    getEventById(id),
    getEventAttendees(id),
  ]);

  if (!event) {
    notFound();
  }

  return <PrintAttendeesView event={event} attendees={attendees} />;
}
