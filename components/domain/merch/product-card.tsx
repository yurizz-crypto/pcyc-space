import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PriceTag } from '@/components/molecules/price-tag';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import type { Product } from '@/lib/db/schema/products';

export interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.stockQuantity <= 0 && !product.isPreorder;
  const primaryImage = product.imageUrls?.[0] || '/images/logo/pcyc-transparent-logo.png';

  return (
    <Card className="flex flex-col h-full border-[#e6dfcb] dark:border-[#323d2b] hover:border-[#2c3324] dark:hover:border-[#e0a861] hover:shadow-md transition-all group overflow-hidden">
      {/* Product Image Container */}
      <div className="relative aspect-square w-full bg-[#f8f4e3] dark:bg-[#1b2117] flex items-center justify-center overflow-hidden p-6">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <Badge variant="cream" size="sm">
            {product.category}
          </Badge>
        </div>

        <div className="absolute top-3 right-3">
          {isOutOfStock ? (
            <Badge variant="error" size="sm">
              Out of Stock
            </Badge>
          ) : product.isPreorder ? (
            <Badge variant="gold" size="sm">
              Pre-Order
            </Badge>
          ) : (
            <Badge variant="success" size="sm">
              In Stock
            </Badge>
          )}
        </div>
      </div>

      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="text-base group-hover:text-[#9a6423] dark:group-hover:text-[#f0be7c] transition-colors line-clamp-1">
          {product.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 flex-1 pb-4">
        <p className="text-xs text-[#707666] dark:text-[#a3ab98] line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {product.availableSizes && product.availableSizes.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[11px] text-[#8a9180] dark:text-[#8a9180] font-medium">Sizes:</span>
            {product.availableSizes.map((size) => (
              <span
                key={size}
                className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#f8f4e3] dark:bg-[#252e1f] border border-[#e6dfcb] dark:border-[#323d2b] text-[#505748] dark:text-[#a3ab98] font-semibold"
              >
                {size}
              </span>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 border-t border-[#e6dfcb]/50 dark:border-[#323d2b]/50 flex items-center justify-between">
        <PriceTag price={product.price} isPreorder={product.isPreorder} />
        <Link
          href={`/merch/${product.slug}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#2c3324] dark:text-[#fefcf1] group-hover:text-[#9a6423] dark:group-hover:text-[#f0be7c] transition-colors"
        >
          <span>Order</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </CardFooter>
    </Card>
  );
}
