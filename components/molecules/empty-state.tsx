import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'text-center py-16 px-6 rounded-3xl bg-white border border-[#e6dfcb] shadow-xs max-w-lg mx-auto space-y-4',
        className
      )}
    >
      <div className="h-16 w-16 rounded-2xl bg-[#f8f4e3] text-[#9a6423] border border-[#e6dfcb] mx-auto flex items-center justify-center">
        <Icon className="h-8 w-8" />
      </div>
      <div className="space-y-1.5">
        <h3 className="font-serif font-bold text-xl text-[#2c3324]">{title}</h3>
        <p className="text-xs sm:text-sm text-[#707666] leading-relaxed max-w-sm mx-auto">
          {description}
        </p>
      </div>
      {actionLabel && (
        <div className="pt-2">
          {actionHref ? (
            <Link href={actionHref}>
              <Button variant="primary" size="md">
                {actionLabel}
              </Button>
            </Link>
          ) : (
            <Button variant="primary" size="md" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
