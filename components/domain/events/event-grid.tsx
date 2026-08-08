'use client';

import React, { useState, useMemo } from 'react';
import { EventCard } from './event-card';
import { EmptyState } from '@/components/molecules/empty-state';
import { Pagination } from '@/components/ui/pagination';
import { Calendar, Search, Filter, X } from 'lucide-react';
import type { Event } from '@/lib/db/schema/events';

export interface EventGridProps {
  events: Event[];
  emptyTitle?: string;
  emptyDescription?: string;
  pageSize?: number;
}

export function EventGrid({
  events,
  emptyTitle = 'No events scheduled yet',
  emptyDescription = 'There are currently no events listed under this category. Please check back soon or browse other fellowship gatherings.',
  pageSize = 6,
}: EventGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Filter events based on search query and status filter
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // Status filter
      if (statusFilter !== 'ALL' && event.status !== statusFilter) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(query);
        const matchesTheme = event.theme?.toLowerCase().includes(query);
        const matchesLocation = event.location.toLowerCase().includes(query);
        const matchesDesc = event.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesTheme && !matchesLocation && !matchesDesc) {
          return false;
        }
      }

      return true;
    });
  }, [events, searchQuery, statusFilter]);

  if (!events || events.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title={emptyTitle}
        description={emptyDescription}
        actionLabel="View All Events"
        actionHref="/events"
      />
    );
  }

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * pageSize;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + pageSize);

  const filterOptions = [
    { value: 'ALL', label: 'All Gatherings' },
    { value: 'UPCOMING', label: 'Upcoming' },
    { value: 'REGISTRATION_OPEN', label: 'Open for Registration' },
    { value: 'COMPLETED', label: 'Past Events' },
  ];

  return (
    <div className="space-y-8">
      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#f8f4e3] dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b]">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                setStatusFilter(opt.value);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === opt.value
                  ? 'bg-[#2c3324] text-[#fefcf1] shadow-xs'
                  : 'bg-white/80 dark:bg-[#1b2117]/80 text-[#505748] dark:text-[#a3ab98] hover:bg-white dark:hover:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#707666] dark:text-[#a3ab98]" />
          <input
            type="text"
            placeholder="Search by title, location, theme..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-8 py-1.5 text-xs sm:text-sm rounded-xl border border-[#e6dfcb] dark:border-[#323d2b] bg-white dark:bg-[#1b2117] text-[#2c3324] dark:text-[#fefcf1] placeholder:text-[#8a9180] focus:outline-none focus:ring-2 focus:ring-[#2c3324]/20 focus:border-[#2c3324]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#707666] dark:text-[#a3ab98] hover:text-[#2c3324] dark:hover:text-[#fefcf1]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Grid of Results */}
      {filteredEvents.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#f8f4e3]/50 dark:bg-[#1b2117]/50 border border-dashed border-[#e6dfcb] dark:border-[#323d2b] space-y-3">
          <Calendar className="h-8 w-8 text-[#9a6423] dark:text-[#f0be7c] mx-auto opacity-70" />
          <h3 className="font-serif font-bold text-base text-[#2c3324] dark:text-[#fefcf1]">
            No matching events found
          </h3>
          <p className="text-xs sm:text-sm text-[#707666] dark:text-[#a3ab98] max-w-md mx-auto">
            We couldn&apos;t find any events matching &ldquo;{searchQuery}&rdquo;. Try clearing your search or selecting a different filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('ALL');
              setCurrentPage(1);
            }}
            className="text-xs font-bold text-[#9a6423] dark:text-[#f0be7c] hover:underline"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {filteredEvents.length > pageSize && (
        <div className="pt-4 flex justify-center">
          <Pagination
            currentPage={activePage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 200, behavior: 'smooth' });
            }}
            totalItems={filteredEvents.length}
            pageSize={pageSize}
            showCount={true}
          />
        </div>
      )}
    </div>
  );
}
