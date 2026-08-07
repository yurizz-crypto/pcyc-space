import React from 'react';
import { cn } from '@/lib/utils';

export interface UserAvatarProps {
  firstName: string;
  lastName: string;
  designation?: 'BROTHER' | 'SISTER' | 'FRIEND' | string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function UserAvatar({
  firstName,
  lastName,
  designation,
  size = 'md',
  className,
}: UserAvatarProps) {
  const initials = `${firstName?.[0] || 'P'}${lastName?.[0] || 'C'}`.toUpperCase();

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-lg',
  };

  return (
    <div
      className={cn(
        'rounded-2xl bg-[#2c3324] text-[#fefcf1] font-semibold flex items-center justify-center border border-[#e0a861]/30 shadow-xs shrink-0',
        sizeClasses[size],
        className
      )}
      title={`${designation ? designation + ' ' : ''}${firstName} ${lastName}`}
      aria-label={`${firstName} ${lastName}`}
    >
      {initials}
    </div>
  );
}
