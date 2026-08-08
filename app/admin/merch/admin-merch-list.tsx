'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PriceTag } from '@/components/molecules/price-tag';
import { Pagination } from '@/components/ui/pagination';
import { deleteProductAction } from '@/app/actions/products';
import type { Product } from '@/lib/db/schema/products';
import { ShoppingBag, Trash2, ExternalLink, Pencil, Search, Plus } from 'lucide-react';

interface AdminMerchListProps {
  products: Product[];
}

const PAGE_SIZE = 8;

export function AdminMerchList({ products }: AdminMerchListProps) {
  const [filterTab, setFilterTab] = useState<'ALL' | 'ACTIVE' | 'PREORDER' | 'APPAREL' | 'ACCESSORIES'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Compute counts
  const totalCount = products.length;
  const activeCount = products.filter((p) => p.isAvailable).length;
  const preorderCount = products.filter((p) => p.isPreorder).length;
  const apparelCount = products.filter((p) => (p.category || '').trim().toLowerCase() === 'apparel').length;
  const accessoriesCount = products.filter((p) => (p.category || '').trim().toLowerCase() === 'accessories').length;

  // Filter list
  const filteredProducts = products.filter((prod) => {
    const cat = (prod.category || '').trim().toLowerCase();
    if (filterTab === 'ACTIVE' && !prod.isAvailable) return false;
    if (filterTab === 'PREORDER' && !prod.isPreorder) return false;
    if (filterTab === 'APPAREL' && cat !== 'apparel') return false;
    if (filterTab === 'ACCESSORIES' && cat !== 'accessories') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = prod.name.toLowerCase();
      const slug = prod.slug.toLowerCase();
      const desc = (prod.description || '').toLowerCase();
      return name.includes(q) || slug.includes(q) || desc.includes(q);
    }

    return true;
  });

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * PAGE_SIZE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + PAGE_SIZE);

  const handleTabChange = (tab: 'ALL' | 'ACTIVE' | 'PREORDER' | 'APPAREL' | 'ACCESSORIES') => {
    setFilterTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Tabs & Search Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#1b2117] p-2.5 rounded-2xl border border-[#e6dfcb] dark:border-[#323d2b] shadow-2xs">
        <div className="flex items-center gap-1.5 p-1 bg-[#f8f4e3] dark:bg-[#252e1f] rounded-xl overflow-x-auto">
          <button
            type="button"
            onClick={() => handleTabChange('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              filterTab === 'ALL'
                ? 'bg-[#2c3324] dark:bg-[#e0a861] text-white dark:text-[#1b2117] shadow-xs'
                : 'text-[#505748] dark:text-[#a3ab98] hover:text-[#2c3324] dark:hover:text-[#fefcf1] hover:bg-[#e6dfcb]/50 dark:hover:bg-[#323d2b]'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('ACTIVE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              filterTab === 'ACTIVE'
                ? 'bg-[#2c3324] dark:bg-[#e0a861] text-white dark:text-[#1b2117] shadow-xs'
                : 'text-[#505748] dark:text-[#a3ab98] hover:text-[#2c3324] dark:hover:text-[#fefcf1] hover:bg-[#e6dfcb]/50 dark:hover:bg-[#323d2b]'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('PREORDER')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              filterTab === 'PREORDER'
                ? 'bg-[#2c3324] dark:bg-[#e0a861] text-white dark:text-[#1b2117] shadow-xs'
                : 'text-[#505748] dark:text-[#a3ab98] hover:text-[#2c3324] dark:hover:text-[#fefcf1] hover:bg-[#e6dfcb]/50 dark:hover:bg-[#323d2b]'
            }`}
          >
            Pre-Order ({preorderCount})
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('APPAREL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              filterTab === 'APPAREL'
                ? 'bg-[#2c3324] dark:bg-[#e0a861] text-white dark:text-[#1b2117] shadow-xs'
                : 'text-[#505748] dark:text-[#a3ab98] hover:text-[#2c3324] dark:hover:text-[#fefcf1] hover:bg-[#e6dfcb]/50 dark:hover:bg-[#323d2b]'
            }`}
          >
            Apparel ({apparelCount})
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('ACCESSORIES')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              filterTab === 'ACCESSORIES'
                ? 'bg-[#2c3324] dark:bg-[#e0a861] text-white dark:text-[#1b2117] shadow-xs'
                : 'text-[#505748] dark:text-[#a3ab98] hover:text-[#2c3324] dark:hover:text-[#fefcf1] hover:bg-[#e6dfcb]/50 dark:hover:bg-[#323d2b]'
            }`}
          >
            Accessories ({accessoriesCount})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#707666] dark:text-[#a3ab98]" />
          <input
            type="text"
            placeholder="Search merchandise..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#e6dfcb] dark:border-[#323d2b] bg-[#f8f4e3]/50 dark:bg-[#131710] focus:bg-white dark:focus:bg-[#1b2117] dark:text-[#fefcf1] focus:outline-none focus:ring-1 focus:ring-[#2c3324] dark:focus:ring-[#e0a861]"
          />
        </div>
      </div>

      {/* Inventory List Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">
            Catalog Inventory ({filteredProducts.length})
          </CardTitle>
          <CardDescription>
            Manage item pricing, size availability, pre-order tags, and stock counts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <ShoppingBag className="h-10 w-10 text-[#8a9180] mx-auto opacity-70" />
              <p className="text-sm font-semibold text-[#2c3324] dark:text-[#fefcf1]">
                {searchQuery ? 'No merchandise matches your search' : 'No items in this category'}
              </p>
              <p className="text-xs text-[#707666] dark:text-[#a3ab98]">
                {searchQuery ? 'Try searching another keyword.' : 'Click "Add Merchandise Item" to add new catalog products.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="divide-y divide-[#e6dfcb] dark:divide-[#323d2b]">
                {paginatedProducts.map((prod) => {
                  const img =
                    prod.imageUrls && prod.imageUrls.length > 0
                      ? prod.imageUrls[0]
                      : '/images/logo/pcyc-transparent-logo.png';

                  return (
                    <div
                      key={prod.id}
                      className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#f8f4e3]/50 dark:hover:bg-[#252e1f]/50 transition-colors px-2 rounded-xl"
                    >
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="relative h-14 w-14 rounded-xl bg-[#f8f4e3] dark:bg-[#252e1f] border border-[#e6dfcb] dark:border-[#323d2b] p-1 shrink-0 flex items-center justify-center overflow-hidden">
                          <Image
                            src={img}
                            alt={prod.name}
                            fill
                            className="object-contain"
                          />
                        </div>

                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-serif font-bold text-base text-[#2c3324] dark:text-[#fefcf1] truncate">
                              {prod.name}
                            </span>
                            <Badge variant="gold" size="sm">
                              {prod.category}
                            </Badge>
                            {prod.isPreorder && (
                              <Badge variant="warning" size="sm">
                                Pre-Order
                              </Badge>
                            )}
                            <Badge variant={prod.isAvailable ? 'forest' : 'cream'} size="sm">
                              {prod.isAvailable ? 'Active' : 'Hidden'}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-[#707666] dark:text-[#a3ab98]">
                            <PriceTag price={prod.price} />
                            <span>•</span>
                            <span>Stock: {prod.stockQuantity} units</span>
                            <span>•</span>
                            <span className="text-[#9a6423] dark:text-[#f0be7c] font-mono">/merch/{prod.slug}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <Link
                          href={`/admin/merch/${prod.id}/edit`}
                          className="p-2 rounded-lg text-[#505748] dark:text-[#a3ab98] hover:bg-white dark:hover:bg-[#1b2117] hover:text-[#2c3324] dark:hover:text-[#fefcf1] border border-transparent hover:border-[#e6dfcb] dark:hover:border-[#323d2b] transition-all"
                          title="Edit Merchandise Item"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>

                        <Link
                          href={`/merch/${prod.slug}`}
                          target="_blank"
                          className="p-2 rounded-lg text-[#505748] dark:text-[#a3ab98] hover:bg-white dark:hover:bg-[#1b2117] hover:text-[#2c3324] dark:hover:text-[#fefcf1] border border-transparent hover:border-[#e6dfcb] dark:hover:border-[#323d2b] transition-all"
                          title="Preview product page"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>

                        <form action={deleteProductAction}>
                          <input type="hidden" name="productId" value={prod.id} />
                          <button
                            type="submit"
                            className="p-2 rounded-lg text-[#c0392b] dark:text-[#ef5350] hover:bg-[#fdf2f2] dark:hover:bg-[#2d1815] border border-transparent hover:border-[#f5c6cb] dark:hover:border-[#4d201b] transition-all cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </form>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Universal Pagination */}
              <Pagination
                currentPage={activePage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
                totalItems={filteredProducts.length}
                pageSize={PAGE_SIZE}
                showCount={true}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
