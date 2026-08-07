import React from 'react';
import { Badge } from '@/components/ui/badge';

export interface PageHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  badge,
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-[#2c3324] text-[#fefcf1] py-16 sm:py-20 lg:py-24 border-b border-[#3d4632]">
      {/* Subtle background glow */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#e0a861] via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
        <div className="max-w-3xl space-y-4">
          {badge && (
            <Badge variant="gold" size="md">
              {badge}
            </Badge>
          )}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#fefcf1]">
            {title}
          </h1>
          {description && (
            <p className="text-base sm:text-lg text-[#f8f4e3]/80 leading-relaxed">
              {description}
            </p>
          )}
          {children && <div className="pt-2">{children}</div>}
        </div>
      </div>
    </div>
  );
}
