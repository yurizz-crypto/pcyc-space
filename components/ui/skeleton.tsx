import React from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-[#e6dfcb]/50 dark:bg-[#2c3324]/20',
        className
      )}
      {...props}
    />
  );
}
