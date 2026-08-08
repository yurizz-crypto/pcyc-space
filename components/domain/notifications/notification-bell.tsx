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
        return <Ticket className="h-4 w-4 text-[#e0a861]" />;
      case 'ORDER_STATUS':
        return <Package className="h-4 w-4 text-[#e0a861]" />;
      case 'PAYMENT_VERIFICATION':
        return <CreditCard className="h-4 w-4 text-[#2e7d32] dark:text-[#66bb6a]" />;
      case 'ACCOUNT':
        return <Sparkles className="h-4 w-4 text-[#e0a861]" />;
      default:
        return <AlertCircle className="h-4 w-4 text-[#707666] dark:text-[#a3ab98]" />;
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
        className="relative p-2 rounded-xl text-[#2c3324] dark:text-[#fefcf1] hover:bg-[#2c3324]/10 dark:hover:bg-[#fefcf1]/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#e0a861]/40"
      >
        <Bell className="h-5 w-5 transition-transform duration-200 hover:scale-105" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[#c0392b] px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-[#fefcf1] dark:ring-[#131710] animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-80 sm:w-96 rounded-2xl border border-[#e6dfcb] dark:border-[#323d2b] bg-white dark:bg-[#1b2117] shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          
          {/* Popover Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#e6dfcb] dark:border-[#323d2b] bg-[#f8f4e3]/60 dark:bg-[#20271c]">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm text-[#2c3324] dark:text-[#fefcf1]">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-[#fbf1e2] dark:bg-[#2b2315] border border-[#e0a861]/40 px-2 py-0.5 text-[11px] font-semibold text-[#9a6423] dark:text-[#f0be7c]">
                  {unreadCount} unread
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                disabled={isPending}
                className="flex items-center gap-1 text-xs font-medium text-[#9a6423] dark:text-[#f0be7c] hover:underline transition-colors disabled:opacity-50"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-[#e6dfcb] dark:divide-[#323d2b]">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#f8f4e3] dark:bg-[#20271c] text-[#707666] dark:text-[#a3ab98] mb-2">
                  <Bell className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium text-[#707666] dark:text-[#a3ab98]">
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
                      ? 'bg-transparent hover:bg-[#f8f4e3]/50 dark:hover:bg-[#20271c]/50 opacity-75'
                      : 'bg-[#fbf1e2]/40 dark:bg-[#2b2315]/40 hover:bg-[#fbf1e2]/70 dark:hover:bg-[#2b2315]/70'
                  }`}
                >
                  <div className="mt-0.5 p-2 rounded-xl bg-[#f8f4e3] dark:bg-[#252e1f] border border-[#e6dfcb] dark:border-[#323d2b] shrink-0">
                    {getIcon(item.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h5 className="text-xs font-semibold text-[#2c3324] dark:text-[#fefcf1] truncate">
                        {item.title}
                      </h5>
                      {!item.isRead && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#e0a861] shrink-0" />
                      )}
                    </div>
                    <p className="text-[12px] text-[#505748] dark:text-[#a3ab98] leading-snug line-clamp-2">
                      {item.message}
                    </p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] text-[#707666] dark:text-[#8a9180]">
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
                          className="flex items-center gap-1 text-[11px] font-semibold text-[#9a6423] dark:text-[#f0be7c] hover:underline"
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
          <div className="p-2.5 text-center border-t border-[#e6dfcb] dark:border-[#323d2b] bg-[#f8f4e3]/60 dark:bg-[#20271c]">
            <Link
              href="/portal"
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-[#2c3324] dark:text-[#f0be7c] hover:underline"
            >
              View all in Member Space &rarr;
            </Link>
          </div>

        </div>
      )}
    </div>
  );
}
