import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUserProfile } from '@/lib/db/queries/users';
import { getCurrentUserNotifications, getUnreadNotificationCount } from '@/lib/db/queries/notifications';
import { NotificationBell } from '@/components/domain/notifications/notification-bell';
import { Badge } from '@/components/ui/badge';
import {
  SquaresFour,
  Calendar,
  Tote,
  Receipt,
  ShieldCheck,
  ArrowLeft,
  Buildings,
  Users,
} from '@phosphor-icons/react/dist/ssr';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'PCYC Admin CMS & Operations',
  description: 'Administrative command center for Philippine Christadelphian Youth Circle.',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentUserProfile();

  // Guard: Must be authenticated and have ADMIN or SUPERADMIN role
  if (!profile) {
    redirect('/login?redirect=/admin');
  }

  if (profile.role !== 'ADMIN' && profile.role !== 'SUPERADMIN') {
    redirect('/portal');
  }

  const [notifications, unreadCount] = await Promise.all([
    getCurrentUserNotifications(10),
    getUnreadNotificationCount(profile.id),
  ]);

  const adminNav = [
    { href: '/admin', label: 'Overview', icon: SquaresFour },
    { href: '/admin/users', label: 'User Directory & Access', icon: Users },
    { href: '/admin/ecclesias', label: 'Ecclesias Directory', icon: Buildings },
    { href: '/admin/events', label: 'Events & Camps', icon: Calendar },
    { href: '/admin/merch', label: 'Merch Inventory', icon: Tote },
    { href: '/admin/orders', label: 'Receipts & Orders', icon: Receipt },
  ];

  return (
    <div className="min-h-[85vh] bg-[#f8f4e3] dark:bg-[#131710] print:bg-transparent print:min-h-0 flex flex-col">
      {/* Admin Subheader Bar */}
      <div className="bg-[#2c3324] dark:bg-[#0f130d] text-[#fefcf1] border-b border-[#3d4632] dark:border-[#222b1c] px-4 sm:px-6 lg:px-8 py-3.5 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#e0a861]/20 border border-[#e0a861]/40 flex items-center justify-center text-[#e0a861] shadow-inner">
              <ShieldCheck weight="duotone" className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-sm text-[#fefcf1]">
                  PCYC Administration CMS
                </span>
                <Badge variant="gold" size="sm">
                  {profile.role}
                </Badge>
              </div>
              <span className="text-[11px] text-[#f8f4e3]/70">
                Logged in as {profile.firstName} {profile.lastName} ({profile.email})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center bg-[#1e2418] dark:bg-[#181d14] rounded-xl px-2 border border-[#3d4632]">
              <NotificationBell
                initialNotifications={notifications}
                initialUnreadCount={unreadCount}
              />
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#e0a861] hover:text-[#f0be7c] transition-colors"
            >
              <ArrowLeft weight="bold" className="h-3.5 w-3.5" />
              <span>Return to Website</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="bg-white dark:bg-[#1b2117] border-b border-[#e6dfcb] dark:border-[#323d2b] px-4 sm:px-6 lg:px-8 shadow-xs print:hidden">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2">
          {adminNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#505748] dark:text-[#a3ab98] hover:text-[#2c3324] dark:hover:text-[#fefcf1] hover:bg-[#f8f4e3] dark:hover:bg-[#252e1f] transition-all whitespace-nowrap"
              >
                <Icon weight="duotone" className="h-4 w-4 text-[#e0a861]" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Admin Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0 print:m-0 print:max-w-none">
        {children}
      </main>
    </div>
  );
}
