import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { EmptyState } from '@/components/molecules/empty-state';
import { ReceiptCard } from '@/components/domain/orders/receipt-card';
import { getCurrentUserProfile } from '@/lib/db/queries/users';
import { getUserEventRegistrations } from '@/lib/db/queries/events';
import { getUserOrders } from '@/lib/db/queries/orders';
import { formatDate, formatPHP } from '@/lib/utils';
import { Calendar, ShoppingBag, MapPin, CheckCircle2, Clock, QrCode, Building2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Member Space — PCYC Space',
  description: 'Your PCYC member space for event registrations, orders, and ecclesia fellowship.',
};

export default async function PortalPage() {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    redirect('/login');
  }

  // Administrators should manage the platform from Admin Space
  if (profile.role === 'ADMIN' || profile.role === 'SUPERADMIN') {
    redirect('/admin');
  }

  const [orders, registrations] = await Promise.all([
    getUserOrders(profile.id),
    getUserEventRegistrations(profile.id),
  ]);

  const prefix =
    profile.designation === 'BROTHER'
      ? 'Bro.'
      : profile.designation === 'SISTER'
      ? 'Sis.'
      : 'Friend';

  return (
    <div className="flex flex-col w-full">
      <PageHeader
        badge="Member Space"
        title={`Welcome, ${prefix} ${profile.firstName}!`}
        description="Manage your camp registrations, view merchandise order receipts, and connect with your ecclesia."
      />

      <section className="py-12 sm:py-16 bg-[#fefcf1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Profile Summary Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e6dfcb] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-[#2c3324] text-[#e0a861] border border-[#e0a861]/40 flex items-center justify-center font-serif font-bold text-2xl shadow-sm">
                {profile.firstName.charAt(0)}
                {profile.lastName.charAt(0)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#2c3324]">
                    {prefix} {profile.firstName} {profile.lastName}
                  </h2>
                  <Badge variant={profile.designation === 'FRIEND' ? 'cream' : 'gold'} size="sm">
                    {profile.designation}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#707666]">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-[#e0a861]" />
                    <span>{profile.ecclesia || 'Philippine Ecclesias'}</span>
                  </span>
                  <span>•</span>
                  <span>{profile.email}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/events">
                <Button variant="primary" size="md" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Explore Camps</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Grid of Sections: Active Registrations & Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Event Registrations */}
            <Card className="border-[#e6dfcb]">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="text-xl">My Gathering Registrations</CardTitle>
                  <CardDescription>Camps and fellowship gatherings you are registered for.</CardDescription>
                </div>
                <Calendar className="h-5 w-5 text-[#e0a861]" />
              </CardHeader>
              <CardContent className="space-y-4">
                {registrations.length === 0 ? (
                  <EmptyState
                    icon={Calendar}
                    title="No active registrations"
                    description="You are not registered for any upcoming camp yet. Check out our scheduled gatherings!"
                    actionLabel="Browse Gathering Schedules"
                    actionHref="/events"
                  />
                ) : (
                  <div className="space-y-3">
                    {registrations.map(({ registration: reg, event }) => {
                      const isGcash = reg.paymentOption === 'GCASH';
                      const isVenue = reg.paymentOption === 'VENUE_DESK';
                      const isFree = reg.paymentOption === 'FREE';

                      return (
                        <div
                          key={reg.id}
                          className="p-4 rounded-2xl bg-white border border-[#e6dfcb] shadow-xs space-y-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <Link
                                href={`/events/${event.slug}`}
                                className="font-serif font-bold text-base text-[#2c3324] hover:text-[#e0a861] transition-colors line-clamp-1"
                              >
                                {event.title}
                              </Link>
                              <div className="flex items-center gap-2 text-xs text-[#707666]">
                                <Calendar className="h-3.5 w-3.5 text-[#e0a861]" />
                                <span>
                                  {formatDate(event.startDate)} &ndash; {formatDate(event.endDate)}
                                </span>
                              </div>
                            </div>

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
                              {reg.status === 'VERIFICATION_QUEUED' ? 'Pending Review' : reg.status}
                            </Badge>
                          </div>

                          <div className="p-3 rounded-xl bg-[#f8f4e3] border border-[#e6dfcb] text-xs space-y-1.5 text-[#505748]">
                            <div className="flex justify-between items-center">
                              <span className="text-[#707666]">Payment Status:</span>
                              <span className="font-semibold text-[#2c3324] flex items-center gap-1">
                                {isGcash && <QrCode className="h-3.5 w-3.5 text-[#9a6423]" />}
                                {isVenue && <Building2 className="h-3.5 w-3.5 text-[#9a6423]" />}
                                {isFree
                                  ? 'Free Admission'
                                  : isGcash
                                  ? 'GCash (Under Verification)'
                                  : 'Pay at Venue Desk'}
                              </span>
                            </div>

                            {reg.referenceNumber && (
                              <div className="flex justify-between items-center border-t border-[#e6dfcb]/60 pt-1.5">
                                <span className="text-[#707666]">GCash Ref #:</span>
                                <span className="font-mono font-medium text-[#2c3324]">
                                  {reg.referenceNumber}
                                </span>
                              </div>
                            )}

                            <div className="flex justify-between items-center border-t border-[#e6dfcb]/60 pt-1.5">
                              <span className="text-[#707666]">Registration Fee:</span>
                              <span className="font-bold text-[#2c3324]">
                                {Number(reg.amountPaid || 0) === 0 ? 'Free' : formatPHP(Number(reg.amountPaid))}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Merchandise Orders & Receipts */}
            <Card className="border-[#e6dfcb]">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="text-xl">Merch Orders & Receipts</CardTitle>
                  <CardDescription>Status of your fundraising apparel orders.</CardDescription>
                </div>
                <ShoppingBag className="h-5 w-5 text-[#e0a861]" />
              </CardHeader>
              <CardContent className="space-y-4">
                {orders.length === 0 ? (
                  <EmptyState
                    icon={ShoppingBag}
                    title="No merchandise orders"
                    description="You haven't placed any merchandise orders yet. Support youth fellowship by ordering official PCYC merch!"
                    actionLabel="Visit Merch Store"
                    actionHref="/merch"
                  />
                ) : (
                  <div className="space-y-3">
                    {orders.map((ord) => {
                      const summary = ord.items
                        .map(
                          (item) =>
                            `${item.product?.name || 'Item'} (${item.quantity}x${item.selectedSize ? ` - ${item.selectedSize}` : ''})`
                        )
                        .join(', ');

                      return (
                        <ReceiptCard
                          key={ord.id}
                          orderId={ord.id}
                          orderNumber={ord.orderNumber}
                          amount={ord.totalAmount}
                          status={ord.status}
                          paymentMethod={ord.receipt?.paymentMethod || 'GCASH'}
                          referenceNumber={ord.receipt?.referenceNumber || undefined}
                          receiptUrl={ord.receipt?.receiptImageUrl || undefined}
                          verificationNotes={ord.receipt?.verificationNotes || undefined}
                          createdAt={ord.createdAt}
                          itemsSummary={summary}
                        />
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
