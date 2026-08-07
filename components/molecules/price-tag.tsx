import React from 'react';
import { formatPHP, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export interface PriceTagProps {
  price: number | string;
  isPreorder?: boolean;
  className?: string;
}

export function PriceTag({ price, isPreorder, className }: PriceTagProps) {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="font-serif font-bold text-base sm:text-lg text-[#2c3324]">
        {formatPHP(numericPrice)}
      </span>
      {isPreorder && (
        <Badge variant="gold" size="sm">
          Pre-Order
        </Badge>
      )}
    </div>
  );
}
