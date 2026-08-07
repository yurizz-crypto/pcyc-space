import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getEventById, getEventAttendees } from '@/lib/db/queries/events';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate, formatPHP } from '@/lib/utils';
import { ArrowLeft, Users, Calendar, MapPin, QrCode, Building2, ExternalLink } from 'lucide-react';

interface EventAttendeesPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

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
              <span>{formatDate(event.startDate)} &ndash; {formatDate(event.endDate)}</span>
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
          <Link href={`/admin/events/${event.id}/edit`}>
            <Button variant="outline" size="sm">
              <span>Edit Event</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Attendees List Card */}
      <Card className="border-[#e6dfcb]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Attendee Directory ({attendees.length})</CardTitle>
              <CardDescription>
                Review attendee information, GCash payment verification proofs, and dietary requirements.
              </CardDescription>
            </div>
            <Users className="h-5 w-5 text-[#e0a861]" />
          </div>
        </CardHeader>

        <CardContent>
          {attendees.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Users className="h-10 w-10 text-[#8a9180] mx-auto" />
              <p className="text-sm font-semibold text-[#2c3324]">No attendees registered yet</p>
              <p className="text-xs text-[#707666]">
                Members will appear here as they register on the event page.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#e6dfcb]">
              {attendees.map(({ registration: reg, profile }) => {
                const isGcash = reg.paymentOption === 'GCASH';
                const isVenue = reg.paymentOption === 'VENUE_DESK';
                const isFree = reg.paymentOption === 'FREE';

                return (
                  <div
                    key={reg.id}
                    className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#f8f4e3]/40 transition-colors px-2 rounded-xl"
                  >
                    {/* Member Info */}
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-base text-[#2c3324]">
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
                          {reg.status === 'VERIFICATION_QUEUED' ? 'Receipt Under Review' : reg.status}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#707666]">
                        <span>{profile.email}</span>
                        {profile.phoneNumber && (
                          <>
                            <span>•</span>
                            <span>{profile.phoneNumber}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>{profile.ecclesia || 'Philippine Ecclesias'}</span>
                        <span>•</span>
                        <span>Registered {formatDate(reg.registeredAt)}</span>
                      </div>

                      {reg.specialRequirements && (
                        <p className="text-xs text-[#9a6423] bg-[#f8f4e3] p-2 rounded-lg border border-[#e6dfcb] mt-1">
                          <strong>Notes:</strong> {reg.specialRequirements}
                        </p>
                      )}
                    </div>

                    {/* Payment Details & Receipt */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs shrink-0">
                      <div className="p-3 rounded-xl bg-[#f8f4e3] border border-[#e6dfcb] space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-[#2c3324]">
                          {isGcash && <QrCode className="h-3.5 w-3.5 text-[#9a6423]" />}
                          {isVenue && <Building2 className="h-3.5 w-3.5 text-[#9a6423]" />}
                          <span>
                            {isFree
                              ? 'Free Admission'
                              : isGcash
                              ? 'GCash Payment'
                              : 'Pay at Venue Desk'}
                          </span>
                        </div>

                        {reg.referenceNumber && (
                          <div className="text-[11px] text-[#707666]">
                            Ref #: <strong className="font-mono text-[#2c3324]">{reg.referenceNumber}</strong>
                          </div>
                        )}
                      </div>

                      {reg.receiptImageUrl && (
                        <a
                          href={reg.receiptImageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 rounded-xl bg-white border border-[#e6dfcb] hover:border-[#e0a861] transition-all shadow-xs group"
                          title="View Full GCash Receipt"
                        >
                          <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-[#e6dfcb] bg-[#f8f4e3]">
                            <Image
                              src={reg.receiptImageUrl}
                              alt="GCash Proof"
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <span className="text-[11px] text-[#9a6423] font-medium flex items-center gap-1">
                            <span>Proof</span>
                            <ExternalLink className="h-3 w-3" />
                          </span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
