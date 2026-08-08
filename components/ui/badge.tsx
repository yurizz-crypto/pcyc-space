import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'forest' | 'cream' | 'success' | 'warning' | 'error' | 'outline' | 'destructive' | 'slate';
  size?: 'sm' | 'md';
}

export function Badge({
  className,
  variant = 'gold',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    'inline-flex items-center font-medium rounded-full transition-colors whitespace-nowrap';

  const variants = {
    gold: 'bg-[#fbf1e2] dark:bg-[#2b2315] text-[#9a6423] dark:text-[#f0be7c] border border-[#e0a861]/40 dark:border-[#e0a861]/30 font-semibold',
    forest: 'bg-[#2c3324] dark:bg-[#20271b] text-[#fefcf1] border border-[#2c3324] dark:border-[#38452f]',
    cream: 'bg-[#f8f4e3] dark:bg-[#1d2419] text-[#2c3324] dark:text-[#fefcf1] border border-[#e6dfcb] dark:border-[#323d2b]',
    success: 'bg-[#e8f5e9] dark:bg-[#162917] text-[#2e7d32] dark:text-[#66bb6a] border border-[#c8e6c9] dark:border-[#1e4620]',
    warning: 'bg-[#fff8e1] dark:bg-[#2c2211] text-[#b78103] dark:text-[#ffb74d] border border-[#ffe082] dark:border-[#4d381c]',
    error: 'bg-[#fbe9e7] dark:bg-[#2d1815] text-[#c0392b] dark:text-[#ef5350] border border-[#ffccbc] dark:border-[#4d201b]',
    destructive: 'bg-[#fdf2f2] dark:bg-[#2d1815] text-[#c0392b] dark:text-[#ef5350] border border-[#f5c6cb] dark:border-[#4d201b]',
    slate: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
    outline: 'border border-[#2c3324]/30 dark:border-[#fefcf1]/30 text-[#2c3324] dark:text-[#fefcf1] bg-transparent',
  };

  const sizes = {
    sm: 'text-[11px] px-2.5 py-0.5 gap-1',
    md: 'text-xs px-3 py-1 gap-1.5',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
}
