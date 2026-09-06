'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import { formatDate } from '@/lib/utils';
import {
  confirmEventRegistrationPaymentAction,
  declineEventRegistrationPaymentAction,
} from '@/app/actions/events';
import type { AttendeeWithProfile } from '@/lib/db/queries/events';
import {
  Users,
  QrCode,
  Building2,
  ExternalLink,
  Search,
} from 'lucide-react';

interface AttendeesClientViewProps {
  attendees: AttendeeWithProfile[];
  paymentPlatform: string;
}

const PAGE_SIZE = 10;

export function AttendeesClientView({ attendees, paymentPlatform }: AttendeesClientViewProps) {
  const router = useRouter();
  const [filterTab, setFilterTab] = useState<'ALL' | 'CONFIRMED' | 'QUEUED' | 'VENUE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  // Compute counts
  const totalCount = attendees.length;
  const confirmedCount = attendees.filter(
    (a) => a.registration.paymentOption === 'FREE' || a.registration.paymentStatus === 'PAID'
  ).length;
  const queuedCount = attendees.filter(
    (a) => a.registration.status === 'VERIFICATION_QUEUED'
  ).length;
  const venueCount = attendees.filter(
    (a) => a.registration.paymentOption === 'VENUE_DESK'
  ).length;

  // Filter list
  const filteredAttendees = attendees.filter(({ registration: reg, profile }) => {
    // Tab filter
    if (filterTab === 'CONFIRMED' && reg.paymentOption !== 'FREE' && reg.paymentStatus !== 'PAID') return false;
    if (filterTab === 'QUEUED' && reg.status !== 'VERIFICATION_QUEUED') return false;
    if (filterTab === 'VENUE' && reg.paymentOption !== 'VENUE_DESK') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = `${profile.firstName} ${profile.lastName}`.toLowerCase();
      const email = profile.email.toLowerCase();
      const phone = (profile.phoneNumber || '').toLowerCase();
      const ecc = (profile.ecclesia || '').toLowerCase();
      const ref = (reg.referenceNumber || '').toLowerCase();
      return name.includes(q) || email.includes(q) || phone.includes(q) || ecc.includes(q) || ref.includes(q);
    }

    return true;
  });

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredAttendees.length / PAGE_SIZE));
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * PAGE_SIZE;
  const paginatedAttendees = filteredAttendees.slice(startIndex, startIndex + PAGE_SIZE);

  const handleTabChange = (tab: 'ALL' | 'CONFIRMED' | 'QUEUED' | 'VENUE') => {
    setFilterTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleConfirmPayment = async (registrationId: string, eventId: string) => {
    setConfirmingId(registrationId);
    const formData = new FormData();
    formData.set('registrationId', registrationId);
    formData.set('eventId', eventId);
    const result = await confirmEventRegistrationPaymentAction(formData);
    setConfirmingId(null);
    if (!result.success) {
      window.alert(result.error || 'Unable to confirm payment.');
      return;
    }
    router.refresh();
  };

  const handleDeclinePayment = async (registrationId: string, eventId: string) => {
    const reviewNote = window.prompt(
      'Why is this payment being declined? This note will be sent to the attendee.',
      'The uploaded proof could not be verified.'
    );
    if (reviewNote === null) return;

    setConfirmingId(registrationId);
    const formData = new FormData();
    formData.set('registrationId', registrationId);
    formData.set('eventId', eventId);
    formData.set('reviewNote', reviewNote);
    const result = await declineEventRegistrationPaymentAction(formData);
    setConfirmingId(null);
    if (!result.success) {
      window.alert(result.error || 'Unable to decline payment.');
      return;
    }
    router.refresh();
  };

  return (
    <div className="space-y-4">
      {/* Action Bar: Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#1b2117] p-3 rounded-2xl border border-[#e6dfcb] dark:border-[#323d2b] shadow-2xs">
        <div className="flex items-center gap-1.5 p-1 bg-[#f8f4e3] dark:bg-[#252e1f] rounded-xl overflow-x-auto">
          <button
            type="button"
            onClick={() => handleTabChange('ALL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              filterTab === 'ALL'
                ? 'bg-[#2c3324] dark:bg-[#e0a861] text-white dark:text-[#1b2117] shadow-xs'
                : 'text-[#505748] dark:text-[#a3ab98] hover:text-[#2c3324] dark:hover:text-[#fefcf1] hover:bg-[#e6dfcb]/50 dark:hover:bg-[#323d2b]'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('CONFIRMED')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              filterTab === 'CONFIRMED'
                ? 'bg-[#2c3324] dark:bg-[#e0a861] text-white dark:text-[#1b2117] shadow-xs'
                : 'text-[#505748] dark:text-[#a3ab98] hover:text-[#2c3324] dark:hover:text-[#fefcf1] hover:bg-[#e6dfcb]/50 dark:hover:bg-[#323d2b]'
            }`}
          >
            Confirmed ({confirmedCount})
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('QUEUED')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              filterTab === 'QUEUED'
                ? 'bg-[#2c3324] dark:bg-[#e0a861] text-white dark:text-[#1b2117] shadow-xs'
                : 'text-[#505748] dark:text-[#a3ab98] hover:text-[#2c3324] dark:hover:text-[#fefcf1] hover:bg-[#e6dfcb]/50 dark:hover:bg-[#323d2b]'
            }`}
          >
            Review Queue ({queuedCount})
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('VENUE')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              filterTab === 'VENUE'
                ? 'bg-[#2c3324] dark:bg-[#e0a861] text-white dark:text-[#1b2117] shadow-xs'
                : 'text-[#505748] dark:text-[#a3ab98] hover:text-[#2c3324] dark:hover:text-[#fefcf1] hover:bg-[#e6dfcb]/50 dark:hover:bg-[#323d2b]'
            }`}
          >
            Pay at Venue ({venueCount})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#707666] dark:text-[#a3ab98]" />
            <input
              type="text"
              placeholder="Search attendees..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#e6dfcb] dark:border-[#323d2b] bg-[#f8f4e3]/50 dark:bg-[#131710] focus:bg-white dark:focus:bg-[#1b2117] dark:text-[#fefcf1] focus:outline-none focus:ring-1 focus:ring-[#2c3324] dark:focus:ring-[#e0a861]"
            />
          </div>

        </div>
      </div>

      {/* Attendees Card & Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                Attendee Directory ({filteredAttendees.length})
              </CardTitle>
              <CardDescription>
                Review registration details, contact numbers, and payment receipts.
              </CardDescription>
            </div>
            <Users className="h-5 w-5 text-[#e0a861]" />
          </div>
        </CardHeader>

        <CardContent>
          {filteredAttendees.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Users className="h-10 w-10 text-[#8a9180] mx-auto opacity-70" />
              <p className="text-sm font-semibold text-[#2c3324] dark:text-[#fefcf1]">
                {searchQuery ? 'No attendees match your search' : 'No attendees in this category'}
              </p>
              <p className="text-xs text-[#707666] dark:text-[#a3ab98]">
                {searchQuery ? 'Try clearing or modifying your search keyword.' : 'Registrations will appear here.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="divide-y divide-[#e6dfcb] dark:divide-[#323d2b]">
                {paginatedAttendees.map(({ registration: reg, profile }) => {
                  const isOnlinePayment = reg.paymentOption !== 'VENUE_DESK' && reg.paymentOption !== 'FREE';
                  const isVenue = reg.paymentOption === 'VENUE_DESK';
                  const isFree = reg.paymentOption === 'FREE';

                  return (
                    <div
                      key={reg.id}
                      className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#f8f4e3]/40 dark:hover:bg-[#252e1f]/40 transition-colors px-2 rounded-xl"
                    >
                      {/* Member Info */}
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-serif font-bold text-base text-[#2c3324] dark:text-[#fefcf1]">
                            {profile.firstName} {profile.lastName}
                          </span>
                          <Badge
                            variant={profile.designation === 'FRIEND' ? 'cream' : 'gold'}
                            size="sm"
                          >
                            {profile.designation}
                          </Badge>
                          <Badge
                            variant={
                              reg.status === 'CONFIRMED'
                                ? 'success'
                                : reg.status === 'VERIFICATION_QUEUED'
                                ? 'gold'
                                : 'cream'
                            }
                            size="sm"
                          >
                            {reg.paymentOption !== 'FREE' && reg.paymentStatus === 'PAID'
                              ? 'Payment Verified'
                              : reg.status === 'VERIFICATION_QUEUED'
                              ? 'Receipt Under Review'
                              : reg.status}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#707666] dark:text-[#a3ab98]">
                          <span>{profile.email}</span>
                          {profile.phoneNumber && (
                            <>
                              <span>•</span>
                              <span className="font-mono text-[#2c3324] dark:text-[#fefcf1] font-medium">{profile.phoneNumber}</span>
                            </>
                          )}
                          <span>•</span>
                          <span>{profile.ecclesia || 'Philippine Ecclesias'}</span>
                          <span>•</span>
                          <span>Registered {formatDate(reg.registeredAt)}</span>
                        </div>

                        {reg.specialRequirements && (
                          <p className="text-xs text-[#9a6423] dark:text-[#f0be7c] bg-[#f8f4e3] dark:bg-[#252e1f] p-2 rounded-lg border border-[#e6dfcb] dark:border-[#323d2b] mt-1 max-w-2xl">
                            <strong>Special Notes:</strong> {reg.specialRequirements}
                          </p>
                        )}
                      </div>

                      {/* Payment Details & Receipt Link */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs shrink-0 self-end md:self-center">
                        <div className="p-3 rounded-xl bg-[#f8f4e3] dark:bg-[#252e1f] border border-[#e6dfcb] dark:border-[#323d2b] space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-[#2c3324] dark:text-[#fefcf1]">
                            {isOnlinePayment && <QrCode className="h-3.5 w-3.5 text-[#9a6423] dark:text-[#f0be7c]" />}
                            {isVenue && <Building2 className="h-3.5 w-3.5 text-[#9a6423] dark:text-[#f0be7c]" />}
                            <span>
                              {isFree
                                ? 'Free Admission'
                                : isOnlinePayment
                                ? `${paymentPlatform} Payment`
                                : 'Pay at Venue Desk'}
                            </span>
                          </div>

                          {reg.referenceNumber && (
                            <div className="text-[11px] text-[#707666] dark:text-[#a3ab98]">
                              Ref #: <strong className="font-mono text-[#2c3324] dark:text-[#fefcf1]">{reg.referenceNumber}</strong>
                            </div>
                          )}
                          {reg.paymentOption !== 'FREE' && reg.paymentStatus === 'PAID' && (
                            <div className="text-[11px] font-bold text-[#2e7d32] dark:text-[#81c784]">
                              Verified by admin
                            </div>
                          )}
                        </div>

                        {reg.receiptImageUrl && (
                          <a
                            href={reg.receiptImageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b] hover:border-[#e0a861] dark:hover:border-[#e0a861] transition-all shadow-xs group"
                            title={`View Full ${paymentPlatform} Receipt`}
                          >
                            <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-[#e6dfcb] dark:border-[#323d2b] bg-[#f8f4e3] dark:bg-[#252e1f]">
                              <Image
                                src={reg.receiptImageUrl}
                                alt={`${paymentPlatform} Proof`}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <span className="text-[11px] text-[#9a6423] dark:text-[#f0be7c] font-medium flex items-center gap-1">
                              <span>Proof</span>
                              <ExternalLink className="h-3 w-3" />
                            </span>
                          </a>
                        )}

                        {reg.paymentOption !== 'FREE' && reg.paymentStatus !== 'PAID' && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={confirmingId === reg.id}
                              onClick={() => handleConfirmPayment(reg.id, reg.eventId)}
                              className="px-3 py-2 rounded-xl bg-[#2c3324] dark:bg-[#e0a861] text-white dark:text-[#1b2117] text-[11px] font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
                            >
                              {confirmingId === reg.id
                                ? 'Reviewing...'
                                : isVenue
                                ? 'Confirm Venue Payment'
                                : 'Confirm Receipt'}
                            </button>
                            <button
                              type="button"
                              disabled={confirmingId === reg.id}
                              onClick={() => handleDeclinePayment(reg.id, reg.eventId)}
                              className="px-3 py-2 rounded-xl border border-[#c0392b]/40 text-[#c0392b] dark:text-[#ef5350] text-[11px] font-bold hover:bg-[#fdf2f2] dark:hover:bg-[#2d1815] disabled:opacity-50 transition-colors"
                            >
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Universal Pagination */}
              <Pagination
                currentPage={activePage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
                totalItems={filteredAttendees.length}
                pageSize={PAGE_SIZE}
                showCount={true}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
