import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, helperText, error, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[#2c3324] dark:text-[#fefcf1]"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          ref={ref}
          className={cn(
            'flex h-11 w-full rounded-xl border border-[#e6dfcb] dark:border-[#323d2b] bg-[#fefcf1]/70 dark:bg-[#1b2117] px-3.5 py-2 text-sm text-[#2c3324] dark:text-[#fefcf1] placeholder:text-[#8a9180] dark:placeholder:text-[#6e7564] transition-colors focus:border-[#e0a861] dark:focus:border-[#e0a861] focus:bg-white dark:focus:bg-[#20271c] focus:outline-none focus:ring-2 focus:ring-[#e0a861]/20 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-[#c0392b] dark:border-[#ef5350] focus:border-[#c0392b] focus:ring-[#c0392b]/20 bg-[#fdf2f2] dark:bg-[#2d1815]',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs font-medium text-[#c0392b] dark:text-[#ef5350]">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-[#707666] dark:text-[#a3ab98]">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
