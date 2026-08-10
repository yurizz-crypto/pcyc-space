'use client';

import React, { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { updateThemeAction, type ThemeSettings } from '@/app/actions/settings';
import { Paintbrush, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const PRESET_THEMES: Record<string, ThemeSettings> = {
  default: {
    primary: '#e0a861',
    background: '#fefcf1',
    surface: '#ffffff',
    text: '#2c3324',
    primaryDark: '#e0a861',
    backgroundDark: '#131710',
    surfaceDark: '#1b2117',
    textDark: '#fefcf1',
  },
  ocean: {
    primary: '#3b82f6',
    background: '#f0f9ff',
    surface: '#ffffff',
    text: '#0f172a',
    primaryDark: '#60a5fa',
    backgroundDark: '#020617',
    surfaceDark: '#0f172a',
    textDark: '#f8fafc',
  },
  sunset: {
    primary: '#f97316',
    background: '#fff7ed',
    surface: '#ffffff',
    text: '#431407',
    primaryDark: '#fb923c',
    backgroundDark: '#2a0a03',
    surfaceDark: '#431407',
    textDark: '#ffedd5',
  },
  royal: {
    primary: '#8b5cf6',
    background: '#faf5ff',
    surface: '#ffffff',
    text: '#2e1065',
    primaryDark: '#a78bfa',
    backgroundDark: '#170a2c',
    surfaceDark: '#2e1065',
    textDark: '#f3e8ff',
  },
  monochrome: {
    primary: '#475569',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a',
    primaryDark: '#94a3b8',
    backgroundDark: '#020617',
    surfaceDark: '#0f172a',
    textDark: '#f8fafc',
  },
};

export default function AdminThemeSettingsPage() {
  const [selectedPreset, setSelectedPreset] = useState<string>('default');
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const router = useRouter();

  const handleSave = () => {
    setStatus(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append('themeConfig', JSON.stringify(PRESET_THEMES[selectedPreset]));
      const res = await updateThemeAction(formData);
      if (res.success) {
        setStatus({ type: 'success', msg: 'Theme applied globally.' });
        router.refresh();
      } else {
        setStatus({ type: 'error', msg: res.error || 'Failed to update theme.' });
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-[#2c3324] dark:bg-[#e0a861]/20 text-[#e0a861] flex items-center justify-center">
          <Paintbrush className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#2c3324] dark:text-[#fefcf1]">
            Global Theme Settings
          </h1>
          <p className="text-sm text-[#707666] dark:text-[#a3ab98]">
            Customize the colors of the entire website. Changes apply immediately to all users.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select a Color Theme</CardTitle>
          <CardDescription>Choose from the curated presets below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {status && (
            <div
              className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
                status.type === 'success'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}
            >
              {status.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <span>{status.msg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(PRESET_THEMES).map(([key, theme]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedPreset(key)}
                className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                  selectedPreset === key
                    ? 'border-[#e0a861] ring-2 ring-[#e0a861]/20'
                    : 'border-[#e6dfcb] dark:border-[#323d2b] hover:border-[#c5ccc0]'
                }`}
                style={{ backgroundColor: theme.background }}
              >
                {selectedPreset === key && (
                  <div className="absolute -top-3 -right-3 h-6 w-6 rounded-full bg-[#e0a861] text-white flex items-center justify-center shadow-md">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                )}
                <div className="flex gap-2 mb-3">
                  <div className="h-6 w-6 rounded-full shadow-sm" style={{ backgroundColor: theme.primary }} />
                  <div className="h-6 w-6 rounded-full shadow-sm" style={{ backgroundColor: theme.surface }} />
                  <div className="h-6 w-6 rounded-full shadow-sm" style={{ backgroundColor: theme.text }} />
                </div>
                <h3 className="font-semibold capitalize" style={{ color: theme.text }}>
                  {key === 'default' ? 'PCYC Earth (Default)' : `${key} Theme`}
                </h3>
              </button>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 border-t border-[#e6dfcb] dark:border-[#323d2b] pt-4">
          <Button
            type="button"
            variant="primary"
            onClick={handleSave}
            disabled={isPending}
            className="gap-2"
          >
            {isPending ? 'Saving...' : 'Apply Theme'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
