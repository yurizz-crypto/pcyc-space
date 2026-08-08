import React from 'react';
import { cn } from '@/lib/utils';

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options?: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      id,
      options,
      children,
      ...props
    },
    ref
  ) => {
    const selectId =
      id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-[#2c3324] dark:text-[#fefcf1]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'flex h-11 w-full appearance-none rounded-xl border border-[#e6dfcb] dark:border-[#323d2b] bg-[#fefcf1]/70 dark:bg-[#1b2117] px-3.5 py-2 pr-10 text-sm text-[#2c3324] dark:text-[#fefcf1] transition-colors focus:border-[#e0a861] dark:focus:border-[#e0a861] focus:bg-white dark:focus:bg-[#20271c] focus:outline-none focus:ring-2 focus:ring-[#e0a861]/20 disabled:cursor-not-allowed disabled:opacity-50',
              error &&
                'border-[#c0392b] dark:border-[#ef5350] focus:border-[#c0392b] focus:ring-[#c0392b]/20 bg-[#fdf2f2] dark:bg-[#2d1815]',
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#1b2117] text-[#2c3324] dark:text-[#fefcf1]">
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#707666] dark:text-[#a3ab98]">
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        {error && <p className="text-xs font-medium text-[#c0392b] dark:text-[#ef5350]">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-[#707666] dark:text-[#a3ab98]">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
