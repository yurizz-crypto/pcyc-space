'use client';

import React, { useState } from 'react';
import { ProductCard } from './product-card';
import { EmptyState } from '@/components/molecules/empty-state';
import { Pagination } from '@/components/ui/pagination';
import { ShoppingBag } from 'lucide-react';
import type { Product } from '@/lib/db/schema/products';

export interface ProductGridProps {
  products: Product[];
  emptyTitle?: string;
  emptyDescription?: string;
  pageSize?: number;
}

export function ProductGrid({
  products,
  emptyTitle = 'No merchandise found',
  emptyDescription = 'There are currently no items available in this category. New fundraising merchandise will be released soon!',
  pageSize = 12,
}: ProductGridProps) {
  const [currentPage, setCurrentPage] = useState(1);

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title={emptyTitle}
        description={emptyDescription}
        actionLabel="View All Merch"
        actionHref="/merch"
      />
    );
  }

  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * pageSize;
  const paginatedProducts = products.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {paginatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length > pageSize && (
        <div className="pt-4 flex justify-center">
          <Pagination
            currentPage={activePage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            totalItems={products.length}
            pageSize={pageSize}
            showCount={true}
          />
        </div>
      )}
    </div>
  );
}
