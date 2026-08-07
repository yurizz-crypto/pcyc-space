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
import { getUserOrders } from '@/lib/db/queries/orders';
import { Calendar, ShoppingBag, MapPin, Shield } from 'lucide-react';

export const metadata = {
  title: 'Member Space — PCYC Space',
  description: 'Your PCYC member space for event registrations, orders, and ecclesia fellowship.',
};

export default async function PortalPage() {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    redirect('/login');
  }

  const orders = await getUserOrders(profile.id);
  const isAdmin = profile.role === 'ADMIN' || profile.role === 'SUPERADMIN';
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
                  {isAdmin && (
                    <Badge variant="forest" size="sm">
                      ADMIN
                    </Badge>
                  )}
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
              {isAdmin && (
                <Link href="/admin">
                  <Button variant="outline" size="md" className="gap-2">
                    <Shield className="h-4 w-4 text-[#e0a861]" />
                    <span>Admin CMS</span>
                  </Button>
                </Link>
              )}
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
                  <CardTitle className="text-xl">My Camp Registrations</CardTitle>
                  <CardDescription>Events you are currently signed up for.</CardDescription>
                </div>
                <Calendar className="h-5 w-5 text-[#e0a861]" />
              </CardHeader>
              <CardContent className="space-y-4">
                <EmptyState
                  icon={Calendar}
                  title="No active registrations"
                  description="You are not registered for any upcoming camp yet. Check out our scheduled events!"
                  actionLabel="Browse Camp Schedules"
                  actionHref="/events"
                />
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
                    {orders.map((ord) => (
                      <ReceiptCard
                        key={ord.id}
                        orderNumber={ord.orderNumber}
                        amount={ord.totalAmount}
                        status={ord.status}
                        paymentMethod={ord.receipt?.paymentMethod || 'GCASH'}
                        referenceNumber={ord.receipt?.referenceNumber || undefined}
                        receiptUrl={ord.receipt?.receiptImageUrl || undefined}
                        createdAt={ord.createdAt}
                      />
                    ))}
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
