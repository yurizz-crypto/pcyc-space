import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEventById } from '@/lib/db/queries/events';
import { EditEventForm } from './edit-form';
import { ArrowLeft } from 'lucide-react';

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/admin/events"
        className="inline-flex items-center gap-1.5 text-xs text-[#505748] dark:text-[#a3ab98] hover:text-[#2c3324] dark:hover:text-[#fefcf1] font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Events Management</span>
      </Link>

      <EditEventForm event={event} />
    </div>
  );
}
