'use client';

import React, { useState } from 'react';
import { User, Lock, Palette, ChevronRight } from 'lucide-react';
import { ProfileSettingsForm } from './profile-settings-form';
import { SecuritySettingsForm } from './security-settings-form';
import { AppearanceSettingsForm } from './appearance-settings-form';
import type { Profile } from '@/lib/db/schema/users';
import type { Ecclesia } from '@/lib/db/schema/ecclesias';

export interface SettingsClientViewProps {
  profile: Profile;
  ecclesias: Ecclesia[];
}

type TabType = 'profile' | 'security' | 'appearance';

export function SettingsClientView({ profile, ecclesias }: SettingsClientViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  const tabs: {
    id: TabType;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      id: 'profile',
      label: 'Profile & Personal Info',
      description: 'Update name, ecclesia, designation, and phone number',
      icon: User,
    },
    {
      id: 'security',
      label: 'Security & Password',
      description: 'Manage your password and account credentials',
      icon: Lock,
    },
    {
      id: 'appearance',
      label: 'Appearance & Theme',
      description: 'Switch between light, dark, or system color modes',
      icon: Palette,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Sidebar Navigation Tabs */}
      <div className="lg:col-span-4 space-y-2 bg-[#f8f4e3] dark:bg-[#1b2117] p-3 sm:p-4 rounded-3xl border border-[#e6dfcb] dark:border-[#323d2b]">
        <div className="px-3 py-2">
          <h3 className="font-serif font-bold text-base text-[#2c3324] dark:text-[#fefcf1]">
            Account Settings
          </h3>
          <p className="text-xs text-[#707666] dark:text-[#a3ab98]">
            Manage your personal details and app preferences
          </p>
        </div>

        <nav className="space-y-1.5 pt-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all ${
                  isActive
                    ? 'bg-white dark:bg-[#232c1e] text-[#2c3324] dark:text-[#fefcf1] shadow-xs border border-[#e6dfcb] dark:border-[#38452f]'
                    : 'text-[#505748] dark:text-[#a3ab98] hover:bg-white/60 dark:hover:bg-[#20271c] hover:text-[#2c3324] dark:hover:text-[#fefcf1]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl ${
                      isActive
                        ? 'bg-[#2c3324] text-[#e0a861] dark:bg-[#e0a861] dark:text-[#131710]'
                        : 'bg-[#e6dfcb]/50 dark:bg-[#2c3725] text-[#505748] dark:text-[#a3ab98]'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-xs sm:text-sm font-bold leading-tight">
                      {tab.label}
                    </span>
                    <span className="hidden sm:block text-[11px] text-[#707666] dark:text-[#a3ab98] leading-tight">
                      {tab.description}
                    </span>
                  </div>
                </div>

                <ChevronRight
                  className={`h-4 w-4 transition-transform ${
                    isActive
                      ? 'text-[#e0a861] translate-x-0.5'
                      : 'text-[#707666] dark:text-[#a3ab98] opacity-50'
                  }`}
                />
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right Content Panel */}
      <div className="lg:col-span-8 bg-white dark:bg-[#1b2117] p-6 sm:p-8 rounded-3xl border border-[#e6dfcb] dark:border-[#323d2b] shadow-xs">
        <div className="mb-6 pb-4 border-b border-[#e6dfcb] dark:border-[#323d2b]">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#2c3324] dark:text-[#fefcf1]">
            {tabs.find((t) => t.id === activeTab)?.label}
          </h2>
          <p className="text-xs sm:text-sm text-[#707666] dark:text-[#a3ab98]">
            {tabs.find((t) => t.id === activeTab)?.description}
          </p>
        </div>

        {activeTab === 'profile' && (
          <ProfileSettingsForm profile={profile} ecclesias={ecclesias} />
        )}

        {activeTab === 'security' && <SecuritySettingsForm />}

        {activeTab === 'appearance' && <AppearanceSettingsForm />}
      </div>
    </div>
  );
}
