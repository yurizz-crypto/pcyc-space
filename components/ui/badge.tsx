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
    gold: 'bg-[#fbf1e2] text-[#9a6423] border border-[#e0a861]/40 font-semibold',
    forest: 'bg-[#2c3324] text-[#fefcf1] border border-[#2c3324]',
    cream: 'bg-[#f8f4e3] text-[#2c3324] border border-[#e6dfcb]',
    success: 'bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9]',
    warning: 'bg-[#fff8e1] text-[#b78103] border border-[#ffe082]',
    error: 'bg-[#fbe9e7] text-[#c0392b] border border-[#ffccbc]',
    destructive: 'bg-[#fdf2f2] text-[#c0392b] border border-[#f5c6cb]',
    slate: 'bg-slate-100 text-slate-700 border border-slate-200',
    outline: 'border border-[#2c3324]/30 text-[#2c3324] bg-transparent',
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
