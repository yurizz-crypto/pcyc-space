'use client';

import React from 'react';
import { ThemeSelector } from './theme-selector';
import { Palette, Sparkles } from 'lucide-react';

export function AppearanceSettingsForm() {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-[#f8f4e3] dark:bg-[#1d2419] border border-[#e6dfcb] dark:border-[#323d2b] flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-[#2c3324] text-[#e0a861] dark:bg-[#e0a861] dark:text-[#131710] shrink-0 mt-0.5">
          <Palette className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h4 className="font-serif font-bold text-sm text-[#2c3324] dark:text-[#fefcf1]">
            Theme & Visual Preferences
          </h4>
          <p className="text-xs text-[#707666] dark:text-[#a3ab98] leading-relaxed">
            Customize the visual appearance of the PCYC Space across all devices. Your selection will be remembered automatically for your browser session.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#505748] dark:text-[#a3ab98]">
          Interface Color Scheme
        </label>
        <ThemeSelector />
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b] flex items-center gap-3">
        <Sparkles className="h-5 w-5 text-[#e0a861] shrink-0" />
        <p className="text-xs text-[#707666] dark:text-[#a3ab98]">
          <strong className="text-[#2c3324] dark:text-[#fefcf1]">Instant Switch:</strong> You can also use the quick Sun/Moon toggle in the navigation bar at any time to swiftly switch between light and dark modes.
        </p>
      </div>
    </div>
  );
}
