import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAllEvents } from '@/lib/db/queries/events';
import { deleteEventAction } from '@/app/actions/events';
import { formatDate } from '@/lib/utils';
import { Plus, Calendar, MapPin, Trash2, ExternalLink, Pencil } from 'lucide-react';

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
            Create, publish, and manage youth camps, study weekends, and ecclesia circles.
          </p>
        </div>

        <Link href="/admin/events/new">
          <Button variant="primary" size="md" className="gap-2 shadow-xs">
            <Plus className="h-4 w-4" />
            <span>Create New Event</span>
          </Button>
        </Link>
      </div>

      {/* Events Table / Cards */}
      <Card className="border-[#e6dfcb]">
        <CardHeader>
          <CardTitle className="text-lg">All Registered Events ({eventsList.length})</CardTitle>
          <CardDescription>All events currently stored in the PostgreSQL database.</CardDescription>
        </CardHeader>
        <CardContent>
          {eventsList.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Calendar className="h-10 w-10 text-[#8a9180] mx-auto" />
              <p className="text-sm font-semibold text-[#2c3324]">No events recorded</p>
              <p className="text-xs text-[#707666]">
                Click &ldquo;Create New Event&rdquo; to add your first camp schedule.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#e6dfcb]">
              {eventsList.map((evt) => (
                <div
                  key={evt.id}
                  className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#f8f4e3]/50 transition-colors px-2 rounded-xl"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-base text-[#2c3324]">
                        {evt.title}
                      </span>
                      <Badge variant={evt.isPublished ? 'success' : 'cream'} size="sm">
                        {evt.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                      <Badge variant="gold" size="sm">
                        {evt.status}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#707666]">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-[#e0a861]" />
                        <span>{formatDate(evt.startDate)}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-[#e0a861]" />
                        <span>{evt.location}</span>
                      </span>
                      <span>•</span>
                      <span className="text-[#9a6423] font-mono">/events/{evt.slug}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Link
                      href={`/admin/events/${evt.id}/edit`}
                      className="p-2 rounded-lg text-[#505748] hover:bg-white hover:text-[#2c3324] border border-transparent hover:border-[#e6dfcb] transition-all"
                      title="Edit Event"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>

                    <Link
                      href={`/events/${evt.slug}`}
                      target="_blank"
                      className="p-2 rounded-lg text-[#505748] hover:bg-white hover:text-[#2c3324] border border-transparent hover:border-[#e6dfcb] transition-all"
                      title="Preview public page"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>

                    <form action={deleteEventAction}>
                      <input type="hidden" name="eventId" value={evt.id} />
                      <button
                        type="submit"
                        className="p-2 rounded-lg text-[#c0392b] hover:bg-[#fdf2f2] border border-transparent hover:border-[#f5c6cb] transition-all cursor-pointer"
                        title="Delete Event"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
