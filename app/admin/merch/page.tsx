import React from 'react';
import Link from 'next/link';
import { getAllProducts } from '@/lib/db/queries/products';
import { AdminMerchList } from './admin-merch-list';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Merchandise Inventory — PCYC Space Admin',
  description: 'Manage PCYC apparel, camp shirts, accessories, and stock quantities.',
};

export default async function AdminMerchPage() {
  const productsList = await getAllProducts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2c3324]">
            Merchandise & Fundraising Inventory
          </h1>
          <p className="text-xs sm:text-sm text-[#707666]">
            Manage PCYC apparel, camp shirts, accessories, and stock quantities.
          </p>
        </div>

        <Link href="/admin/merch/new">
          <Button variant="primary" size="md" className="gap-2 shadow-xs">
            <Plus className="h-4 w-4" />
            <span>Add Merchandise Item</span>
          </Button>
        </Link>
      </div>

      {/* Inventory List with Search, Filters & Pagination */}
      <AdminMerchList products={productsList} />
    </div>
  );
}
