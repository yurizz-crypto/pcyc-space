import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getAllEvents } from '@/lib/db/queries/events';
import { AdminEventsList } from './admin-events-list';
import { Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminEventsPage() {
  const eventsList = await getAllEvents();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2c3324]">
            Events & Camps Management
          </h1>
          <p className="text-xs sm:text-sm text-[#707666]">
            Create, publish, archive, and manage youth camps, study weekends, and attendees.
          </p>
        </div>

        <Link href="/admin/events/new">
          <Button variant="primary" size="md" className="gap-2 shadow-xs">
            <Plus className="h-4 w-4" />
            <span>Create New Event</span>
          </Button>
        </Link>
      </div>

      {/* Interactive Events Management Table & Modals */}
      <AdminEventsList events={eventsList} />
    </div>
  );
}
