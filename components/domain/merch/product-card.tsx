import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PriceTag } from '@/components/molecules/price-tag';
import { InteractiveCard } from '@/components/ui/interactive-card';
import { ArrowRight, Sparkle } from '@phosphor-icons/react/dist/ssr';
import { Star } from 'lucide-react';
import type { Product } from '@/lib/db/schema/products';

export interface ProductCardProps {
  product: Product;
  rating?: {
    averageRating: number;
    totalReviews: number;
  };
}

export function ProductCard({ product, rating }: ProductCardProps) {
  const isOutOfStock = product.stockQuantity <= 0 && !product.isPreorder;
  const primaryImage = product.imageUrls?.[0] || '/images/logo/pcyc-transparent-logo.png';

  return (
    <InteractiveCard className="flex flex-col h-full rounded-3xl border border-[#e6dfcb] dark:border-[#323d2b] hover:border-[#e0a861]/60 hover:shadow-2xl transition-all duration-300 group overflow-hidden bg-white dark:bg-[#1b2117]">
      {/* Product Image Container */}
      <div className="relative aspect-square w-full bg-[#f8f4e3] dark:bg-[#131710] flex items-center justify-center overflow-hidden p-6">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          className="object-contain p-6 group-hover:scale-110 transition-transform duration-700 ease-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <Badge variant="cream" size="sm" className="rounded-full shadow-xs">
            {product.category}
          </Badge>
        </div>

        <div className="absolute top-3 right-3">
          {isOutOfStock ? (
            <Badge variant="error" size="sm" className="rounded-full shadow-xs">
              Out of Stock
            </Badge>
          ) : product.isPreorder ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#fbf1e2] dark:bg-[#2b2315] text-[#9a6423] dark:text-[#f0be7c] border border-[#e0a861]/40 shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#e0a861] animate-ping" />
              <span>Pre-Order</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              <span>In Stock</span>
            </span>
          )}
        </div>
      </div>

      <CardHeader className="space-y-1.5 pb-2">
        <CardTitle className="font-serif text-lg group-hover:text-[#9a6423] dark:group-hover:text-[#f0be7c] transition-colors line-clamp-1 leading-snug">
          {product.name}
        </CardTitle>
        {rating && rating.totalReviews > 0 && (
          <div className="flex items-center gap-1 text-[11px] text-[#707666] dark:text-[#a3ab98]">
            <Star className="h-3.5 w-3.5 fill-[#e0a861] text-[#e0a861]" />
            <span className="font-bold text-[#2c3324] dark:text-[#fefcf1]">
              {rating.averageRating.toFixed(1)}
            </span>
            <span>({rating.totalReviews})</span>
          </div>
        )}
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
                className="text-[10px] px-2 py-0.5 rounded-lg bg-[#f8f4e3] dark:bg-[#252e1f] border border-[#e6dfcb] dark:border-[#323d2b] text-[#505748] dark:text-[#a3ab98] font-semibold"
              >
                {size}
              </span>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3.5 border-t border-[#e6dfcb]/60 dark:border-[#323d2b]/60 flex items-center justify-between">
        <PriceTag price={product.price} isPreorder={product.isPreorder} />
        <Link
          href={`/merch/${product.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2c3324] dark:text-[#fefcf1] group-hover:text-[#9a6423] dark:group-hover:text-[#f0be7c] transition-colors"
        >
          <span>Order Now</span>
          <ArrowRight weight="bold" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1.5" />
        </Link>
      </CardFooter>
    </InteractiveCard>
  );
}
