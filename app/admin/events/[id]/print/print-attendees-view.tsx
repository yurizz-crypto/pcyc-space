'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatDate, formatCurrency, formatPHP, formatEventSchedule } from '@/lib/utils';
import type { Event } from '@/lib/db/schema/events';
import type { AttendeeWithProfile } from '@/lib/db/queries/events';
import { Printer, ArrowLeft, Users, CheckCircle2, Clock, Search, MapPin, Calendar } from 'lucide-react';

interface PrintAttendeesViewProps {
  event: Event;
  attendees: AttendeeWithProfile[];
}

export function PrintAttendeesView({ event, attendees }: PrintAttendeesViewProps) {
  const [filterMode, setFilterMode] = useState<'ALL' | 'PAID' | 'UNPAID'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const feeNum = Number(event.registrationFee || 0);

  // Filter list
  const filteredAttendees = attendees.filter(({ registration: reg, profile }) => {
    const isPaid = reg.status === 'CONFIRMED' || reg.paymentOption === 'FREE';

    if (filterMode === 'PAID' && !isPaid) return false;
    if (filterMode === 'UNPAID' && isPaid) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = `${profile.firstName} ${profile.lastName}`.toLowerCase();
      const ecclesia = (profile.ecclesia || '').toLowerCase();
      const email = profile.email.toLowerCase();
      const ref = (reg.referenceNumber || '').toLowerCase();
      return name.includes(q) || ecclesia.includes(q) || email.includes(q) || ref.includes(q);
    }

    return true;
  });

  // Calculate statistics
  const totalCount = attendees.length;
  const paidCount = attendees.filter(
    (a) => a.registration.status === 'CONFIRMED' || a.registration.paymentOption === 'FREE'
  ).length;
  const unpaidCount = totalCount - paidCount;

  const totalCollected = paidCount * feeNum;
  const totalToCollect = unpaidCount * feeNum;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Screen-Only Controls */}
      <div className="print:hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1b2117] p-5 rounded-2xl border border-[#e6dfcb] dark:border-[#323d2b] shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/events/${event.id}/attendees`}
                className="text-xs text-[#707666] dark:text-[#a3ab98] hover:text-[#2c3324] dark:hover:text-[#fefcf1] inline-flex items-center gap-1 font-medium"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Attendees List</span>
              </Link>
            </div>
            <h1 className="font-serif text-xl font-bold text-[#2c3324] dark:text-[#fefcf1]">
              Printable Event Attendee & Signature Sheet
            </h1>
            <p className="text-xs text-[#707666] dark:text-[#a3ab98]">
              Print official check-in roster with signature lines for on-site registration desk validation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handlePrint}
              className="gap-2 shadow-sm font-bold"
            >
              <Printer className="h-4 w-4" />
              <span>Print Sheet (A4 / Letter)</span>
            </Button>
          </div>
        </div>

        {/* Filter Pills & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilterMode('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterMode === 'ALL'
                  ? 'bg-[#2c3324] dark:bg-[#e0a861] text-[#fefcf1] dark:text-[#1b2117]'
                  : 'bg-white dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b] text-[#505748] dark:text-[#a3ab98] hover:bg-[#f8f4e3] dark:hover:bg-[#252e1f]'
              }`}
            >
              📋 All Registered Attendees ({totalCount})
            </button>

            <button
              type="button"
              onClick={() => setFilterMode('PAID')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterMode === 'PAID'
                  ? 'bg-[#2c3324] dark:bg-[#e0a861] text-[#fefcf1] dark:text-[#1b2117]'
                  : 'bg-white dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b] text-[#505748] dark:text-[#a3ab98] hover:bg-[#f8f4e3] dark:hover:bg-[#252e1f]'
              }`}
            >
              💳 Verified Paid / Free ({paidCount})
            </button>

            <button
              type="button"
              onClick={() => setFilterMode('UNPAID')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterMode === 'UNPAID'
                  ? 'bg-[#2c3324] dark:bg-[#e0a861] text-[#fefcf1] dark:text-[#1b2117]'
                  : 'bg-white dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b] text-[#505748] dark:text-[#a3ab98] hover:bg-[#f8f4e3] dark:hover:bg-[#252e1f]'
              }`}
            >
              🏢 Venue Desk Collection / Unpaid ({unpaidCount})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#707666] dark:text-[#a3ab98]" />
            <input
              type="text"
              placeholder="Filter by name or ecclesia..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#e6dfcb] dark:border-[#323d2b] bg-white dark:bg-[#131710] dark:text-[#fefcf1] focus:outline-none focus:ring-1 focus:ring-[#2c3324] dark:focus:ring-[#e0a861]"
            />
          </div>
        </div>
      </div>

      {/* Printable Sheet */}
      <div className="bg-white dark:bg-[#1b2117] p-8 rounded-2xl border border-[#e6dfcb] dark:border-[#323d2b] shadow-sm print:shadow-none print:border-none print:p-0 space-y-5">
        {/* Printable Header */}
        <div className="border-b-2 border-[#2c3324] dark:border-[#e0a861] pb-4 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#9a6423] dark:text-[#f0be7c] tracking-widest uppercase block">
                PHILIPPINE CHRISTADELPHIAN YOUTH CIRCLE (PCYC) &bull; OFFICIAL REGISTRATION ROSTER
              </span>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#2c3324] dark:text-[#fefcf1]">
                {event.title}
              </h2>
              {event.theme && (
                <p className="text-xs italic text-[#505748] dark:text-[#a3ab98] font-serif">
                  &ldquo;{event.theme}&rdquo;
                </p>
              )}
            </div>
            <div className="text-right text-xs text-[#707666] dark:text-[#a3ab98] font-mono">
              <span className="block font-bold text-[#2c3324] dark:text-[#fefcf1]">REGISTRATION DESK MANIFEST</span>
              <span>Generated: {new Date().toLocaleDateString('en-PH', { dateStyle: 'medium' })}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#505748] dark:text-[#a3ab98] pt-2 border-t border-[#e6dfcb] dark:border-[#323d2b]">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-[#2c3324] dark:text-[#e0a861]" />
                <strong>{formatEventSchedule(event.startDate, event.endDate)}</strong>
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-[#2c3324] dark:text-[#e0a861]" />
                <strong>{event.location}</strong>
              </span>
              <span>&bull;</span>
              <span>
                Standard Fee: <strong>{feeNum === 0 ? 'Free Admission' : formatPHP(feeNum)}</strong>
              </span>
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex items-center gap-3 font-semibold text-xs">
              <span className="px-2 py-0.5 rounded bg-[#f8f4e3] dark:bg-[#252e1f] border border-[#e6dfcb] dark:border-[#323d2b] text-[#2c3324] dark:text-[#fefcf1]">
                Total: <strong>{filteredAttendees.length}</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-[#e8f5e9] dark:bg-[#1f3a23] border border-[#c8e6c9] dark:border-[#2e7d32]/40 text-[#2e7d32] dark:text-[#81c784]">
                Paid/Verified: <strong>{paidCount}</strong> ({formatCurrency(totalCollected)})
              </span>
              {unpaidCount > 0 && (
                <span className="px-2 py-0.5 rounded bg-[#fff8e1] dark:bg-[#3d2e08] border border-[#ffe082] dark:border-[#b78103]/40 text-[#b78103] dark:text-[#ffd54f]">
                  To Collect: <strong>{unpaidCount}</strong> ({formatCurrency(totalToCollect)})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Table of Attendees */}
        {filteredAttendees.length === 0 ? (
          <div className="text-center py-12 text-xs text-[#707666] dark:text-[#a3ab98]">
            No attendees found matching the selected filter criteria.
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-[#2c3324] dark:border-[#e0a861] text-[#2c3324] dark:text-[#fefcf1] uppercase tracking-wider font-bold text-[11px]">
                <th className="py-2.5 px-1.5 w-8 text-center">#</th>
                <th className="py-2.5 px-2 w-32 text-center">Signature / Check-in</th>
                <th className="py-2.5 px-2">Attendee Name & Designation</th>
                <th className="py-2.5 px-2">Ecclesia & Contact</th>
                <th className="py-2.5 px-2">Payment Option</th>
                <th className="py-2.5 px-2 text-center">Status</th>
                <th className="py-2.5 px-2 text-right">Fee</th>
                <th className="py-2.5 px-2">Notes / Dietary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6dfcb] dark:divide-[#323d2b]">
              {filteredAttendees.map(({ registration: reg, profile }, idx) => {
                const isPaid = reg.status === 'CONFIRMED' || reg.paymentOption === 'FREE';
                const isGcash = reg.paymentOption === 'GCASH';
                const isVenue = reg.paymentOption === 'VENUE_DESK';
                const isFree = reg.paymentOption === 'FREE';

                return (
                  <tr key={reg.id} className={idx % 2 === 0 ? 'bg-white dark:bg-[#1b2117]' : 'bg-[#fefcf1] dark:bg-[#252e1f]/60'}>
                    {/* Index Number */}
                    <td className="py-3 px-1.5 text-center font-mono text-[#707666] dark:text-[#a3ab98] align-middle">
                      {idx + 1}
                    </td>

                    {/* Signature Box */}
                    <td className="py-2 px-2 text-center align-middle">
                      <div className="h-10 w-28 border-2 border-dashed border-[#8a9180] dark:border-[#5a6350] rounded mx-auto print:border-black print:border-solid flex items-center justify-center text-[9px] text-[#8a9180] dark:text-[#a3ab98] print:text-transparent">
                        Sign Here
                      </div>
                    </td>

                    {/* Name & Designation */}
                    <td className="py-3 px-2 align-middle">
                      <strong className="text-[#2c3324] dark:text-[#fefcf1] block font-serif text-sm">
                        {profile.firstName} {profile.lastName}
                      </strong>
                      <span className="text-[10px] text-[#707666] dark:text-[#a3ab98] font-semibold uppercase">
                        {profile.designation}
                      </span>
                    </td>

                    {/* Ecclesia & Contact Number */}
                    <td className="py-3 px-2 align-middle text-[#505748] dark:text-[#a3ab98]">
                      <div className="font-medium text-[#2c3324] dark:text-[#fefcf1]">
                        {profile.ecclesia || 'Philippine Ecclesia'}
                      </div>
                      <div className="text-[10px] text-[#707666] dark:text-[#a3ab98]">
                        {profile.phoneNumber || profile.email}
                      </div>
                    </td>

                    {/* Payment Details */}
                    <td className="py-3 px-2 align-middle font-mono text-[11px]">
                      <div className="font-semibold text-[#2c3324] dark:text-[#fefcf1]">
                        {isFree ? 'FREE' : isGcash ? 'GCash' : 'Pay at Venue Desk'}
                      </div>
                      {reg.referenceNumber && (
                        <div className="text-[10px] text-[#2e7d32] dark:text-[#81c784] font-bold">
                          Ref: {reg.referenceNumber}
                        </div>
                      )}
                    </td>

                    {/* Payment Status */}
                    <td className="py-3 px-2 text-center align-middle whitespace-nowrap">
                      {isPaid ? (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#e8f5e9] dark:bg-[#1f3a23] text-[#2e7d32] dark:text-[#81c784] border border-[#c8e6c9] dark:border-[#2e7d32]/40 print:border-black print:text-black print:bg-transparent">
                          ✓ PAID
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#fff8e1] dark:bg-[#3d2e08] text-[#b78103] dark:text-[#ffd54f] border border-[#ffe082] dark:border-[#b78103]/40 print:border-black print:text-black print:bg-transparent">
                          ⚠ COLLECT AT DESK
                        </span>
                      )}
                    </td>

                    {/* Amount Due */}
                    <td className="py-3 px-2 text-right font-mono font-bold text-[#2c3324] dark:text-[#fefcf1] align-middle whitespace-nowrap">
                      {feeNum === 0 ? 'FREE' : formatPHP(feeNum)}
                    </td>

                    {/* Notes & Special Diet */}
                    <td className="py-3 px-2 align-middle text-[10px] text-[#707666] dark:text-[#a3ab98] max-w-[140px] truncate">
                      {reg.specialRequirements || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Printable Footer / Sign-off */}
        <div className="pt-6 border-t-2 border-[#2c3324] dark:border-[#e0a861] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs text-[#707666] dark:text-[#a3ab98]">
          <div className="space-y-1">
            <span className="font-bold text-[#2c3324] dark:text-[#fefcf1]">PCYC Event Registration & Finance Team</span>
            <p className="text-[10px]">
              Verified on-site check-in roster. Retain this signed document for ecclesial accounting records.
            </p>
          </div>

          <div className="flex items-center gap-8 text-right">
            <div className="border-t border-[#707666] dark:border-[#5a6350] pt-1 w-44 text-center">
              <span className="text-[10px] block">Registration Desk Officer</span>
              <span className="text-[9px] text-[#8a9180] dark:text-[#a3ab98]">Signature over Printed Name</span>
            </div>
            <div className="border-t border-[#707666] dark:border-[#5a6350] pt-1 w-44 text-center">
              <span className="text-[10px] block">Event Treasurer / Auditor</span>
              <span className="text-[9px] text-[#8a9180] dark:text-[#a3ab98]">Signature over Printed Name</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
