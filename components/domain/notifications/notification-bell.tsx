'use client';

import React, { useState, useRef, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { Bell, CheckCheck, Ticket, Package, CreditCard, Sparkles, AlertCircle, ExternalLink } from 'lucide-react';
import type { Notification } from '@/lib/db/schema/notifications';
import { markNotificationAsReadAction, markAllNotificationsAsReadAction } from '@/app/actions/notifications';
import { formatTimeAgo } from '@/lib/utils';

interface NotificationBellProps {
  initialNotifications: Notification[];
  initialUnreadCount: number;
}

export function NotificationBell({ initialNotifications, initialUnreadCount }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [unreadCount, setUnreadCount] = useState<number>(initialUnreadCount);
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync props on re-renders
  useEffect(() => {
    setNotifications(initialNotifications);
    setUnreadCount(initialUnreadCount);
  }, [initialNotifications, initialUnreadCount]);

  // Click outside listener to dismiss popover
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkAsRead = (id: string) => {
    // Optimistic UI update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    startTransition(async () => {
      const formData = new FormData();
      formData.append('notificationId', id);
      await markNotificationAsReadAction(formData);
    });
  };

  const handleMarkAllAsRead = () => {
    // Optimistic UI update
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);

    startTransition(async () => {
      await markAllNotificationsAsReadAction();
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'EVENT_REGISTRATION':
        return <Ticket className="h-4 w-4 text-forest-600 dark:text-forest-400" />;
      case 'ORDER_STATUS':
        return <Package className="h-4 w-4 text-gold-600 dark:text-gold-400" />;
      case 'PAYMENT_VERIFICATION':
        return <CreditCard className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
      case 'ACCOUNT':
        return <Sparkles className="h-4 w-4 text-gold-600 dark:text-gold-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-zinc-500" />;
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="View notifications"
        aria-expanded={isOpen}
        className="relative p-2 rounded-xl text-forest-900/80 dark:text-cream-100/80 hover:text-forest-950 dark:hover:text-cream-50 hover:bg-forest-900/5 dark:hover:bg-cream-100/10 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500/40"
      >
        <Bell className="h-5 w-5 transition-transform duration-200 hover:scale-105" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-cream-50 dark:ring-forest-950 animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-80 sm:w-96 rounded-2xl border border-stone-200 dark:border-forest-800 bg-white/95 dark:bg-forest-950/95 backdrop-blur-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          
          {/* Popover Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100 dark:border-forest-800/80 bg-stone-50/50 dark:bg-forest-900/40">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm text-forest-950 dark:text-cream-50">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-forest-900/10 dark:bg-gold-500/20 px-2 py-0.5 text-[11px] font-semibold text-forest-800 dark:text-gold-300">
                  {unreadCount} unread
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                disabled={isPending}
                className="flex items-center gap-1 text-xs font-medium text-gold-700 dark:text-gold-400 hover:text-gold-800 dark:hover:text-gold-300 transition-colors disabled:opacity-50"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-stone-100 dark:divide-forest-800/40">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-forest-900/5 dark:bg-cream-100/5 text-forest-700/60 dark:text-cream-300/60 mb-2">
                  <Bell className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium text-forest-900/60 dark:text-cream-200/60">
                  No notifications right now
                </p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => !item.isRead && handleMarkAsRead(item.id)}
                  className={`p-3.5 transition-colors cursor-pointer flex gap-3 items-start ${
                    item.isRead
                      ? 'bg-transparent hover:bg-stone-50/80 dark:hover:bg-forest-900/20 opacity-75'
                      : 'bg-forest-900/[0.03] dark:bg-gold-500/[0.05] hover:bg-forest-900/[0.06] dark:hover:bg-gold-500/[0.08]'
                  }`}
                >
                  <div className="mt-0.5 p-2 rounded-xl bg-forest-900/5 dark:bg-forest-800/60 shrink-0">
                    {getIcon(item.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h5 className="text-xs font-semibold text-forest-950 dark:text-cream-50 truncate">
                        {item.title}
                      </h5>
                      {!item.isRead && (
                        <span className="h-1.5 w-1.5 rounded-full bg-gold-600 dark:bg-gold-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-[12px] text-forest-900/70 dark:text-cream-200/70 leading-snug line-clamp-2">
                      {item.message}
                    </p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] text-forest-900/50 dark:text-cream-300/50">
                        {formatTimeAgo(item.createdAt)}
                      </span>
                      {item.linkUrl && (
                        <Link
                          href={item.linkUrl}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!item.isRead) handleMarkAsRead(item.id);
                            setIsOpen(false);
                          }}
                          className="flex items-center gap-1 text-[11px] font-semibold text-gold-700 dark:text-gold-400 hover:underline"
                        >
                          <span>View</span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Popover Footer */}
          <div className="p-2.5 text-center border-t border-stone-100 dark:border-forest-800/80 bg-stone-50/50 dark:bg-forest-900/40">
            <Link
              href="/portal"
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-forest-800 dark:text-gold-400 hover:underline"
            >
              View all in Member Space &rarr;
            </Link>
          </div>

        </div>
      )}
    </div>
  );
}
