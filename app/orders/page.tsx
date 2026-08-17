import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUserProfile } from '@/lib/db/queries/users';
import { getUserOrders } from '@/lib/db/queries/orders';
import { getUserReviews } from '@/lib/db/queries/reviews';
import { OrdersClientHub } from './orders-client-hub';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowLeft, Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'My Orders & Purchases — PCYC Space',
  description: 'Track your fundraising merchandise orders, verify payments, cancel pending orders, and submit product reviews.',
};

export default async function MemberOrdersPage() {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    redirect('/login?redirectTo=/orders');
  }

  const [ordersList, userReviews] = await Promise.all([
    getUserOrders(profile.id),
    getUserReviews(profile.id),
  ]);

  return (
    <div className="min-h-screen bg-[#fefcf1] dark:bg-[#131710] py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6dfcb] dark:border-[#323d2b] pb-6">
          <div>
            <Link
              href="/portal"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#e0a861] hover:text-[#f0be7c] transition-colors mb-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Member Space</span>
            </Link>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2c3324] dark:text-[#fefcf1] flex items-center gap-3">
              <ShoppingBag className="h-8 w-8 text-[#e0a861]" />
              <span>My Orders & Purchases</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#707666] dark:text-[#a3ab98] mt-1">
              Track fulfillment status, upload payment slips, manage cancellations, and leave reviews on completed items.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/merch">
              <Button variant="primary" size="md" className="gap-2 shadow-xs">
                <Plus className="h-4 w-4" />
                <span>Order More Merch</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Client Interactive Hub */}
        <OrdersClientHub initialOrders={ordersList} userReviews={userReviews} />
      </div>
    </div>
  );
}
