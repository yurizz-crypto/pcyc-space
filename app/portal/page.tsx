import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { EmptyState } from '@/components/molecules/empty-state';
import { ReceiptCard } from '@/components/domain/orders/receipt-card';
import { NotificationsPortalCard } from '@/components/domain/notifications/notifications-portal-card';
import { getCurrentUserProfile } from '@/lib/db/queries/users';
import { getUserEventRegistrations } from '@/lib/db/queries/events';
import { getUserOrders } from '@/lib/db/queries/orders';
import { getCurrentUserNotifications, getUnreadNotificationCount } from '@/lib/db/queries/notifications';
import { formatDate, formatPHP, formatEventSchedule } from '@/lib/utils';
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

  const [orders, registrations, notifications, unreadCount] = await Promise.all([
    getUserOrders(profile.id),
    getUserEventRegistrations(profile.id),
    getCurrentUserNotifications(30),
    getUnreadNotificationCount(profile.id),
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

      <section className="py-12 sm:py-16 bg-[#fefcf1] dark:bg-[#131710]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Profile Summary Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-[#2c3324] dark:bg-[#252e1f] text-[#e0a861] border border-[#e0a861]/40 flex items-center justify-center font-serif font-bold text-2xl shadow-sm">
                {profile.firstName.charAt(0)}
                {profile.lastName.charAt(0)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#2c3324] dark:text-[#fefcf1]">
                    {prefix} {profile.firstName} {profile.lastName}
                  </h2>
                  <Badge variant={profile.designation === 'FRIEND' ? 'cream' : 'gold'} size="sm">
                    {profile.designation}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#707666] dark:text-[#a3ab98]">
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

          {/* Activity & Notifications Feed */}
          <NotificationsPortalCard
            notifications={notifications}
            unreadCount={unreadCount}
          />

          {/* Grid of Sections: Active Registrations & Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Event Registrations */}
            <Card className="border-[#e6dfcb] dark:border-[#323d2b] bg-white dark:bg-[#1b2117]">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="text-xl text-[#2c3324] dark:text-[#fefcf1]">My Gathering Registrations</CardTitle>
                  <CardDescription className="text-[#707666] dark:text-[#a3ab98]">Upcoming youth conferences and fellowship camps.</CardDescription>
                </div>
                <Calendar className="h-5 w-5 text-[#e0a861]" />
              </CardHeader>
              <CardContent className="space-y-4">
                {registrations.length === 0 ? (
                  <EmptyState
                    icon={Calendar}
                    title="No registrations yet"
                    description="You haven't registered for any PCYC gatherings. View our upcoming camps across Luzon, Visayas, and Mindanao!"
                    actionLabel="Browse Gatherings"
                    actionHref="/events"
                  />
                ) : (
                  <div className="space-y-3">
                    {registrations.map((item) => {
                      const { registration: reg, event } = item;
                      if (!event) return null;

                      return (
                        <div
                          key={reg.id}
                          className="p-4 rounded-2xl border border-[#e6dfcb] dark:border-[#323d2b] bg-[#f8f4e3]/50 dark:bg-[#20271c] hover:bg-[#f8f4e3] dark:hover:bg-[#252e1f] transition-colors space-y-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <Link
                                href={`/events/${event.slug}`}
                                className="font-serif font-bold text-base text-[#2c3324] dark:text-[#fefcf1] hover:text-[#ca914a] transition-colors"
                              >
                                {event.title}
                              </Link>
                              <p className="text-xs text-[#707666] dark:text-[#a3ab98] flex items-center gap-1.5 mt-0.5">
                                <Clock className="h-3.5 w-3.5 text-[#e0a861]" />
                                <span>{formatEventSchedule(event.startDate, event.endDate)}</span>
                              </p>
                            </div>
                            <Badge
                              variant={
                                reg.paymentStatus === 'CONFIRMED' || reg.paymentStatus === 'PAID'
                                  ? 'gold'
                                  : reg.paymentStatus === 'VERIFICATION_QUEUED'
                                  ? 'gold'
                                  : 'destructive'
                              }
                              size="sm"
                            >
                              {reg.paymentStatus === 'CONFIRMED' || reg.paymentStatus === 'PAID'
                                ? 'Confirmed'
                                : reg.paymentStatus === 'VERIFICATION_QUEUED'
                                ? 'GCash Queued'
                                : 'Payment Due at Desk'}
                            </Badge>
                          </div>

                          <div className="pt-2 border-t border-[#e6dfcb]/60 dark:border-[#323d2b] flex items-center justify-between text-xs">
                            <span className="text-[#707666] dark:text-[#a3ab98] flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-[#e0a861]" />
                              <span>{event.location}</span>
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[#707666] dark:text-[#a3ab98]">Registration Fee:</span>
                              <span className="font-bold text-[#2c3324] dark:text-[#fefcf1]">
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
            <Card className="border-[#e6dfcb] dark:border-[#323d2b] bg-white dark:bg-[#1b2117]">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="text-xl text-[#2c3324] dark:text-[#fefcf1]">Merch Orders & Receipts</CardTitle>
                  <CardDescription className="text-[#707666] dark:text-[#a3ab98]">Status of your fundraising apparel orders.</CardDescription>
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
