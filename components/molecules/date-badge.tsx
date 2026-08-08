import React from 'react';
import { cn } from '@/lib/utils';

export interface DateBadgeProps {
  date: Date | string;
  className?: string;
}

export function DateBadge({ date, className }: DateBadgeProps) {
  const d = typeof date === 'string' ? new Date(date) : date;
  const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const day = d.getDate();

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center h-12 w-12 rounded-xl bg-white dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b] text-center shadow-xs overflow-hidden shrink-0',
        className
      )}
    >
      <span className="w-full bg-[#2c3324] dark:bg-[#20271c] text-[10px] font-bold text-[#fefcf1] py-0.5 tracking-wider">
        {month}
      </span>
      <span className="text-sm font-bold text-[#2c3324] dark:text-[#fefcf1] leading-none py-1">
        {day}
      </span>
    </div>
  );
}
