import React from 'react';
import { ProductCard } from './product-card';
import { EmptyState } from '@/components/molecules/empty-state';
import { ShoppingBag } from 'lucide-react';
import type { Product } from '@/lib/db/schema/products';

export interface ProductGridProps {
  products: Product[];
  emptyTitle?: string;
  emptyDescription?: string;
}

export function ProductGrid({
  products,
  emptyTitle = 'No merchandise found',
  emptyDescription = 'There are currently no items available in this category. New fundraising merchandise will be released soon!',
}: ProductGridProps) {
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
