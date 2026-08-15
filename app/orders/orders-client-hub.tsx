'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OrderCard } from '@/components/domain/orders/order-card';
import type { OrderWithDetails } from '@/lib/db/queries/orders';
import type { ProductReview } from '@/lib/db/schema/reviews';
import {
  ShoppingBag,
  Search,
  Clock,
  CheckCircle2,
  Truck,
  Package,
  XCircle,
  ArrowRight,
} from 'lucide-react';

interface OrdersClientHubProps {
  initialOrders: OrderWithDetails[];
  userReviews: ProductReview[];
}

type FilterTab = 'ALL' | 'UNPAID' | 'VERIFYING' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';

export function OrdersClientHub({ initialOrders, userReviews }: OrdersClientHubProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Map user reviews into a lookup table keyed by `${orderId}:${productId}`
  const reviewMap: Record<string, ProductReview> = {};
  for (const rev of userReviews) {
    reviewMap[`${rev.orderId}:${rev.productId}`] = rev;
  }

  // Counts for each tab
  const unpaidCount = initialOrders.filter((o) => o.status === 'PENDING_PAYMENT').length;
  const verifyingCount = initialOrders.filter((o) => o.status === 'VERIFICATION_QUEUED').length;
  const inTransitCount = initialOrders.filter(
    (o) => o.status === 'PAID' || o.status === 'PREPARING' || o.status === 'SHIPPED'
  ).length;
  const completedCount = initialOrders.filter((o) => o.status === 'COMPLETED').length;
  const cancelledCount = initialOrders.filter((o) => o.status === 'CANCELLED').length;

  // Filter orders
  const filteredOrders = initialOrders.filter((order) => {
    // 1. Tab filtering
    if (activeTab === 'UNPAID' && order.status !== 'PENDING_PAYMENT') return false;
    if (activeTab === 'VERIFYING' && order.status !== 'VERIFICATION_QUEUED') return false;
    if (
      activeTab === 'IN_TRANSIT' &&
      order.status !== 'PAID' &&
      order.status !== 'PREPARING' &&
      order.status !== 'SHIPPED'
    )
      return false;
    if (activeTab === 'COMPLETED' && order.status !== 'COMPLETED') return false;
    if (activeTab === 'CANCELLED' && order.status !== 'CANCELLED') return false;

    // 2. Search query filtering
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const num = order.orderNumber.toLowerCase();
      const matchItem = order.items.some((item) =>
        (item.product?.name || '').toLowerCase().includes(q)
      );
      return num.includes(q) || matchItem;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Search & Tabs Filter Bar */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a9180]" />
          <Input
            type="text"
            placeholder="Search by order # or product name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 bg-white dark:bg-[#1b2117] border-[#e6dfcb] dark:border-[#323d2b]"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('ALL')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'ALL'
                ? 'bg-[#2c3324] text-[#fefcf1] dark:bg-[#e0a861] dark:text-[#131710] shadow-xs'
                : 'bg-white dark:bg-[#1b2117] text-[#505748] dark:text-[#a3ab98] border border-[#e6dfcb] dark:border-[#323d2b] hover:bg-[#f8f4e3] dark:hover:bg-[#20271c]'
            }`}
          >
            <span>All Orders</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-black/20">
              {initialOrders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('UNPAID')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'UNPAID'
                ? 'bg-[#c62828] text-white shadow-xs'
                : 'bg-white dark:bg-[#1b2117] text-[#505748] dark:text-[#a3ab98] border border-[#e6dfcb] dark:border-[#323d2b] hover:bg-[#f8f4e3] dark:hover:bg-[#20271c]'
            }`}
          >
            <Clock className="h-3 w-3" />
            <span>Unpaid / Needs Action</span>
            {unpaidCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-red-800 text-white font-bold animate-pulse">
                {unpaidCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('VERIFYING')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'VERIFYING'
                ? 'bg-[#e0a861] text-[#131710] font-bold shadow-xs'
                : 'bg-white dark:bg-[#1b2117] text-[#505748] dark:text-[#a3ab98] border border-[#e6dfcb] dark:border-[#323d2b] hover:bg-[#f8f4e3] dark:hover:bg-[#20271c]'
            }`}
          >
            <Clock className="h-3 w-3" />
            <span>Verification Queue</span>
            {verifyingCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10">
                {verifyingCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('IN_TRANSIT')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'IN_TRANSIT'
                ? 'bg-[#2c3324] text-[#e0a861] dark:bg-[#e0a861] dark:text-[#131710] shadow-xs'
                : 'bg-white dark:bg-[#1b2117] text-[#505748] dark:text-[#a3ab98] border border-[#e6dfcb] dark:border-[#323d2b] hover:bg-[#f8f4e3] dark:hover:bg-[#20271c]'
            }`}
          >
            <Truck className="h-3 w-3" />
            <span>In Transit & Preparing</span>
            {inTransitCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10">
                {inTransitCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('COMPLETED')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'COMPLETED'
                ? 'bg-[#2e7d32] text-white shadow-xs'
                : 'bg-white dark:bg-[#1b2117] text-[#505748] dark:text-[#a3ab98] border border-[#e6dfcb] dark:border-[#323d2b] hover:bg-[#f8f4e3] dark:hover:bg-[#20271c]'
            }`}
          >
            <CheckCircle2 className="h-3 w-3" />
            <span>Completed</span>
            {completedCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10">
                {completedCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('CANCELLED')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'CANCELLED'
                ? 'bg-[#505748] text-white shadow-xs'
                : 'bg-white dark:bg-[#1b2117] text-[#505748] dark:text-[#a3ab98] border border-[#e6dfcb] dark:border-[#323d2b] hover:bg-[#f8f4e3] dark:hover:bg-[#20271c]'
            }`}
          >
            <XCircle className="h-3 w-3" />
            <span>Cancelled</span>
            {cancelledCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10">
                {cancelledCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Orders List / Empty State */}
      {filteredOrders.length === 0 ? (
        <Card className="bg-white dark:bg-[#1b2117] border-[#e6dfcb] dark:border-[#323d2b] p-12 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="h-16 w-16 rounded-2xl bg-[#f8f4e3] dark:bg-[#131710] text-[#e0a861] mx-auto flex items-center justify-center">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#2c3324] dark:text-[#fefcf1]">
              {activeTab === 'ALL'
                ? 'No merchandise orders yet'
                : `No ${activeTab.toLowerCase().replace('_', ' ')} orders`}
            </h3>
            <p className="text-xs sm:text-sm text-[#707666] dark:text-[#a3ab98] leading-relaxed">
              {activeTab === 'ALL'
                ? 'Explore the PCYC Merch Catalog to support our annual youth camps and wear the message of hope!'
                : 'You have no orders currently in this status.'}
            </p>
            <Link href="/merch">
              <Button variant="primary" size="md" className="gap-2 mt-2">
                <span>Browse Merch Store</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} userReviews={reviewMap} />
          ))}
        </div>
      )}
    </div>
  );
}
