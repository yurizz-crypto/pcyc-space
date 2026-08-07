'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, label, helperText, error, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[#2c3324]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <input
            type={showPassword ? 'text' : 'password'}
            id={inputId}
            ref={ref}
            className={cn(
              'flex h-11 w-full rounded-xl border border-[#e6dfcb] bg-[#fefcf1]/70 pl-3.5 pr-11 py-2 text-sm text-[#2c3324] placeholder:text-[#8a9180] transition-colors focus:border-[#e0a861] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e0a861]/20 disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-[#c0392b] focus:border-[#c0392b] focus:ring-[#c0392b]/20 bg-[#fdf2f2]',
              className
            )}
            {...props}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 p-1 text-[#707666] hover:text-[#2c3324] transition-colors focus:outline-none"
            title={showPassword ? 'Hide password' : 'Show password'}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {error && <p className="text-xs font-medium text-[#c0392b]">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-[#707666]">{helperText}</p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
