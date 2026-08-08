import React from 'react';
import Link from 'next/link';
import { getAllOrdersWithReceipts } from '@/lib/db/queries/orders';
import { AdminOrdersList } from './admin-orders-list';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Orders & Receipts Management — PCYC Space Admin',
  description: 'Verify GCash payments and manage member merchandise transactions.',
};

export default async function AdminOrdersPage() {
  const ordersList = await getAllOrdersWithReceipts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2c3324] dark:text-[#fefcf1]">
            Orders & Payment Receipts Queue
          </h1>
          <p className="text-xs sm:text-sm text-[#707666] dark:text-[#a3ab98]">
            Verify GCash screenshot references submitted by brethren for merchandise orders.
          </p>
        </div>

        <Link href="/admin/orders/print">
          <Button variant="outline" size="md" className="gap-2 shrink-0">
            <Printer className="h-4 w-4 text-[#e0a861]" />
            <span>Print Pre-Orders Manifest</span>
          </Button>
        </Link>
      </div>

      {/* Orders List with Search, Filter Tabs & Pagination */}
      <AdminOrdersList orders={ordersList} />
    </div>
  );
}
