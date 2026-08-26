'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  speed?: number; // duration in seconds
}

export function Marquee({
  children,
  className,
  reverse = false,
  pauseOnHover = true,
  speed = 35,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        'group flex overflow-hidden p-2 [--gap:1.5rem] [gap:var(--gap)] select-none',
        className
      )}
    >
      <div
        className={cn(
          'flex shrink-0 justify-around [gap:var(--gap)] min-w-full animate-marquee flex-row',
          reverse && 'direction-reverse',
          pauseOnHover && 'group-hover:[animation-play-state:paused]'
        )}
        style={{
          animationDuration: `${speed}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        className={cn(
          'flex shrink-0 justify-around [gap:var(--gap)] min-w-full animate-marquee flex-row',
          reverse && 'direction-reverse',
          pauseOnHover && 'group-hover:[animation-play-state:paused]'
        )}
        style={{
          animationDuration: `${speed}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {children}
      </div>
    </div>
  );
}
