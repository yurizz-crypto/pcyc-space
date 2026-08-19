import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'gold-subtle';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 active:transition-none focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer active:scale-[0.97] select-none';

    const variants = {
      primary:
        'bg-[#e0a861] text-[#2c3324] font-semibold hover:bg-[#ca914a] shadow-sm hover:shadow-md focus:ring-[#e0a861]',
      secondary:
        'bg-[#2c3324] dark:bg-[#e0a861] text-[#fefcf1] dark:text-[#131710] hover:bg-[#3d4632] dark:hover:bg-[#f0be7c] shadow-sm hover:shadow-md focus:ring-[#2c3324] dark:focus:ring-[#e0a861]',
      outline:
        'border-2 border-[#2c3324]/20 dark:border-[#e6dfcb]/30 text-[#2c3324] dark:text-[#fefcf1] hover:bg-[#2c3324]/5 dark:hover:bg-[#fefcf1]/10 hover:border-[#2c3324]/40 dark:hover:border-[#e6dfcb]/50 focus:ring-[#2c3324] dark:focus:ring-[#e0a861]',
      ghost:
        'text-[#2c3324] dark:text-[#fefcf1] hover:bg-[#2c3324]/8 dark:hover:bg-[#fefcf1]/10 focus:ring-[#2c3324] dark:focus:ring-[#e0a861]',
      destructive:
        'bg-[#c0392b] dark:bg-[#ef5350] text-white hover:bg-[#a93226] dark:hover:bg-[#e53935] focus:ring-[#c0392b]',
      'gold-subtle':
        'bg-[#fbf1e2] dark:bg-[#2b2315] text-[#915e21] dark:text-[#f0be7c] border border-[#e0a861]/30 dark:border-[#e0a861]/30 hover:bg-[#f5e3ca] dark:hover:bg-[#352c1a] focus:ring-[#e0a861]',
    };

    const sizes = {
      sm: 'text-xs px-3.5 py-1.5 gap-1.5 tracking-normal',
      md: 'text-sm px-5 py-2.5 gap-2 tracking-tight',
      lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold tracking-tight',
      icon: 'p-2.5 rounded-xl aspect-square',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
