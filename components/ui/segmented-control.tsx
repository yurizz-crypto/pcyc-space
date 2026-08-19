'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { springs } from '@/lib/motion';

export interface SegmentOption<T extends string = string> {
  value: T;
  label: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  layoutId?: string;
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  className,
  size = 'md',
  layoutId = 'segmented-control-active-pill',
}: SegmentedControlProps<T>) {
  const sizeStyles = {
    sm: 'p-0.5 text-xs rounded-xl gap-0.5',
    md: 'p-1 text-sm rounded-2xl gap-1',
    lg: 'p-1.5 text-base rounded-2xl gap-1.5',
  };

  const itemSizeStyles = {
    sm: 'px-2.5 py-1 rounded-[10px]',
    md: 'px-3.5 py-1.5 rounded-[12px]',
    lg: 'px-5 py-2 rounded-[14px]',
  };

  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex items-center bg-[#2c3324]/8 dark:bg-[#fefcf1]/10 border border-[#2c3324]/10 dark:border-[#fefcf1]/10 backdrop-blur-sm select-none',
        sizeStyles[size],
        className
      )}
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        const Icon = option.icon;

        return (
          <button
            key={option.value}
            role="tab"
            type="button"
            aria-selected={isSelected}
            disabled={option.disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              'relative flex items-center justify-center font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e0a861] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer',
              itemSizeStyles[size],
              isSelected
                ? 'text-[#2c3324] dark:text-[#131710] font-semibold'
                : 'text-[#5d6355] dark:text-[#c4ccbe] hover:text-[#2c3324] dark:hover:text-[#fefcf1]'
            )}
          >
            {/* Fluid sliding spring active pill indicator */}
            {isSelected && (
              <motion.div
                layoutId={layoutId}
                transition={springs.snappy}
                className="absolute inset-0 bg-[#fefcf1] dark:bg-[#e0a861] rounded-[inherit] shadow-sm z-0"
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5 tracking-tight">
              {Icon && <Icon className="h-4 w-4 shrink-0" />}
              <span>{option.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
