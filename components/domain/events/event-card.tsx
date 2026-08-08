import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DateBadge } from '@/components/molecules/date-badge';
import { formatDate } from '@/lib/utils';
import { MapPin, Users, ArrowRight } from 'lucide-react';
import type { Event } from '@/lib/db/schema/events';

export interface EventCardProps {
  event: Event;
  showStatusBadge?: boolean;
}

export function EventCard({ event, showStatusBadge = true }: EventCardProps) {
  const statusVariant = {
    UPCOMING: 'gold',
    ONGOING: 'success',
    COMPLETED: 'cream',
    CANCELLED: 'error',
    ARCHIVED: 'slate',
  } as const;

  return (
    <Card className="flex flex-col h-full border-[#e6dfcb] dark:border-[#323d2b] hover:border-[#2c3324] dark:hover:border-[#e0a861] hover:shadow-md transition-all group overflow-hidden">
      {/* Banner / Cover */}
      {event.bannerUrl ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#2c3324]/5">
          <Image
            src={event.bannerUrl}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {showStatusBadge && (
            <div className="absolute top-3 right-3">
              <Badge variant={statusVariant[event.status] || 'cream'} size="sm">
                {event.status}
              </Badge>
            </div>
          )}
        </div>
      ) : (
        <div className="h-3 bg-[#e0a861]/20 w-full" />
      )}

      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-start gap-3">
          <DateBadge date={event.startDate} />
          <div className="space-y-1 min-w-0">
            {event.theme && (
              <span className="text-[11px] font-bold text-[#9a6423] dark:text-[#f0be7c] uppercase tracking-wider block truncate">
                {event.theme}
              </span>
            )}
            <CardTitle className="text-lg group-hover:text-[#9a6423] dark:group-hover:text-[#f0be7c] transition-colors line-clamp-2">
              {event.title}
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 flex-1 pb-4">
        <p className="text-xs sm:text-sm text-[#505748] dark:text-[#a3ab98] line-clamp-2 leading-relaxed">
          {event.description}
        </p>

        <div className="space-y-1.5 pt-1 text-xs text-[#707666] dark:text-[#a3ab98]">
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-[#e0a861] shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          {event.maxAttendees && (
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-[#e0a861] shrink-0" />
              <span>Capacity: {event.maxAttendees} attendees</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-2 border-t border-[#e6dfcb]/50 dark:border-[#323d2b]/50 flex items-center justify-between text-xs font-semibold">
        <span className="text-[#8a9180] dark:text-[#8a9180]">
          {formatDate(event.startDate)}
        </span>
        <Link
          href={`/events/${event.slug}`}
          className="text-[#2c3324] dark:text-[#fefcf1] group-hover:text-[#9a6423] dark:group-hover:text-[#f0be7c] flex items-center gap-1 transition-colors"
        >
          <span>View Details</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </CardFooter>
    </Card>
  );
}
