'use client';

import React, { useState, useMemo } from 'react';
import { ProductCard } from './product-card';
import { EmptyState } from '@/components/molecules/empty-state';
import { Pagination } from '@/components/ui/pagination';
import { ShoppingBag, Search, X } from 'lucide-react';
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
  pageSize = 8,
}: ProductGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Filter products based on search query and category filter
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (categoryFilter !== 'ALL' && product.category !== categoryFilter) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc) {
          return false;
        }
      }

      return true;
    });
  }, [products, searchQuery, categoryFilter]);

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

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);

  const categories = [
    { value: 'ALL', label: 'All Merchandise' },
    { value: 'APPAREL', label: 'Apparel & Shirts' },
    { value: 'ACCESSORIES', label: 'Accessories' },
    { value: 'BAGS', label: 'Bags & Totes' },
    { value: 'OTHER', label: 'Other Items' },
  ];

  return (
    <div className="space-y-8">
      {/* Search and Category Filter Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#f8f4e3] border border-[#e6dfcb]">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => {
                setCategoryFilter(cat.value);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                categoryFilter === cat.value
                  ? 'bg-[#2c3324] text-[#fefcf1] shadow-xs'
                  : 'bg-white/80 text-[#505748] hover:bg-white border border-[#e6dfcb]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#707666]" />
          <input
            type="text"
            placeholder="Search merchandise..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-8 py-1.5 text-xs sm:text-sm rounded-xl border border-[#e6dfcb] bg-white text-[#2c3324] placeholder:text-[#8a9180] focus:outline-none focus:ring-2 focus:ring-[#2c3324]/20 focus:border-[#2c3324]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#707666] hover:text-[#2c3324]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Grid of Results */}
      {filteredProducts.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#f8f4e3]/50 border border-dashed border-[#e6dfcb] space-y-3">
          <ShoppingBag className="h-8 w-8 text-[#9a6423] mx-auto opacity-70" />
          <h3 className="font-serif font-bold text-base text-[#2c3324]">
            No merchandise matching your search
          </h3>
          <p className="text-xs sm:text-sm text-[#707666] max-w-md mx-auto">
            We couldn&apos;t find any merchandise items matching &ldquo;{searchQuery}&rdquo;. Try clearing your search or selecting a different category.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('ALL');
              setCurrentPage(1);
            }}
            className="text-xs font-bold text-[#9a6423] hover:underline"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {filteredProducts.length > pageSize && (
        <div className="pt-4 flex justify-center">
          <Pagination
            currentPage={activePage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 200, behavior: 'smooth' });
            }}
            totalItems={filteredProducts.length}
            pageSize={pageSize}
            showCount={true}
          />
        </div>
      )}
    </div>
  );
}
