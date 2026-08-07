import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PriceTag } from '@/components/molecules/price-tag';
import { getAllProducts } from '@/lib/db/queries/products';
import { deleteProductAction } from '@/app/actions/products';
import { Plus, ShoppingBag, Trash2, ExternalLink, Pencil } from 'lucide-react';

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

      {/* Inventory List */}
      <Card className="border-[#e6dfcb]">
        <CardHeader>
          <CardTitle className="text-lg">All Merchandise Items ({productsList.length})</CardTitle>
          <CardDescription>Catalog items configured in PostgreSQL database.</CardDescription>
        </CardHeader>
        <CardContent>
          {productsList.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <ShoppingBag className="h-10 w-10 text-[#8a9180] mx-auto" />
              <p className="text-sm font-semibold text-[#2c3324]">No merchandise in inventory</p>
              <p className="text-xs text-[#707666]">
                Click &ldquo;Add Merchandise Item&rdquo; to list apparel, stickers, or camp totes.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#e6dfcb]">
              {productsList.map((prod) => {
                const img =
                  prod.imageUrls && prod.imageUrls.length > 0
                    ? prod.imageUrls[0]
                    : '/images/logo/pcyc-transparent-logo.png';

                return (
                  <div
                    key={prod.id}
                    className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#f8f4e3]/50 transition-colors px-2 rounded-xl"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="relative h-14 w-14 rounded-xl bg-[#f8f4e3] border border-[#e6dfcb] p-1 shrink-0 flex items-center justify-center overflow-hidden">
                        <Image
                          src={img}
                          alt={prod.name}
                          fill
                          className="object-contain"
                        />
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-base text-[#2c3324] truncate">
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

                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#707666]">
                          <PriceTag price={prod.price} />
                          <span>•</span>
                          <span>Stock: {prod.stockQuantity} units</span>
                          <span>•</span>
                          <span className="text-[#9a6423] font-mono">/merch/{prod.slug}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Link
                        href={`/admin/merch/${prod.id}/edit`}
                        className="p-2 rounded-lg text-[#505748] hover:bg-white hover:text-[#2c3324] border border-transparent hover:border-[#e6dfcb] transition-all"
                        title="Edit Merchandise Item"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>

                      <Link
                        href={`/merch/${prod.slug}`}
                        target="_blank"
                        className="p-2 rounded-lg text-[#505748] hover:bg-white hover:text-[#2c3324] border border-transparent hover:border-[#e6dfcb] transition-all"
                        title="Preview product page"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>

                      <form action={deleteProductAction}>
                        <input type="hidden" name="productId" value={prod.id} />
                        <button
                          type="submit"
                          className="p-2 rounded-lg text-[#c0392b] hover:bg-[#fdf2f2] border border-transparent hover:border-[#f5c6cb] transition-all cursor-pointer"
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
