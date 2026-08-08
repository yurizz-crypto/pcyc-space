'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCheck,
  Trash2,
  Ticket,
  Package,
  CreditCard,
  Sparkles,
  AlertCircle,
  ExternalLink,
  Filter,
} from 'lucide-react';
import type { Notification } from '@/lib/db/schema/notifications';
import {
  markNotificationAsReadAction,
  markAllNotificationsAsReadAction,
  deleteNotificationAction,
} from '@/app/actions/notifications';
import { formatTimeAgo } from '@/lib/utils';

interface NotificationsPortalCardProps {
  notifications: Notification[];
  unreadCount: number;
}

export function NotificationsPortalCard({
  notifications: initialNotifications,
  unreadCount: initialUnreadCount,
}: NotificationsPortalCardProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [unreadCount, setUnreadCount] = useState<number>(initialUnreadCount);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [isPending, startTransition] = useTransition();

  const handleMarkAsRead = (id: string) => {
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
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);

    startTransition(async () => {
      await markAllNotificationsAsReadAction();
    });
  };

  const handleDelete = (id: string, wasUnread: boolean) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (wasUnread) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append('notificationId', id);
      await deleteNotificationAction(formData);
    });
  };

  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'UNREAD') return !item.isRead;
    return item.type === activeFilter;
  });

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
    <div className="rounded-3xl border border-[#e6dfcb] dark:border-[#323d2b] bg-white dark:bg-[#1b2117] shadow-sm overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-6 border-b border-[#e6dfcb] dark:border-[#323d2b] bg-[#f8f4e3]/60 dark:bg-[#20271c]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e0a861]/15 text-[#9a6423] dark:text-[#f0be7c]">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[#2c3324] dark:text-[#fefcf1]">
              Activity & Notifications
            </h3>
            <p className="text-xs text-[#707666] dark:text-[#a3ab98]">
              Updates on your event tickets, merch orders, and GCash payments
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            disabled={isPending}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#e0a861]/40 bg-[#fbf1e2] dark:bg-[#2b2315] text-xs font-semibold text-[#9a6423] dark:text-[#f0be7c] hover:bg-[#f5e3ca] dark:hover:bg-[#352c1a] transition-all disabled:opacity-50"
          >
            <CheckCheck className="h-4 w-4" />
            <span>Mark all as read ({unreadCount})</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 px-6 py-3 border-b border-[#e6dfcb] dark:border-[#323d2b] overflow-x-auto text-xs bg-white dark:bg-[#1b2117]">
        <span className="flex items-center gap-1 font-semibold text-[#707666] dark:text-[#a3ab98] mr-2 shrink-0">
          <Filter className="h-3 w-3" /> Filter:
        </span>
        {[
          { id: 'ALL', label: 'All' },
          { id: 'UNREAD', label: `Unread (${unreadCount})` },
          { id: 'EVENT_REGISTRATION', label: 'Events' },
          { id: 'ORDER_STATUS', label: 'Merch' },
          { id: 'PAYMENT_VERIFICATION', label: 'Payments' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3 py-1.5 rounded-full font-medium transition-all shrink-0 ${
              activeFilter === tab.id
                ? 'bg-[#2c3324] dark:bg-[#e0a861] text-[#fefcf1] dark:text-[#131710] font-bold shadow-sm'
                : 'text-[#505748] dark:text-[#a3ab98] hover:bg-[#f8f4e3] dark:hover:bg-[#252e1f]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Feed List */}
      <div className="divide-y divide-[#e6dfcb] dark:divide-[#323d2b]">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f8f4e3] dark:bg-[#20271c] text-[#707666] dark:text-[#a3ab98] mb-3">
              <Bell className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-[#2c3324] dark:text-[#fefcf1]">
              No notifications found
            </p>
            <p className="text-xs text-[#707666] dark:text-[#a3ab98] mt-1">
              You are all caught up on your PCYC Space updates!
            </p>
          </div>
        ) : (
          filteredNotifications.map((item) => (
            <div
              key={item.id}
              className={`p-5 transition-colors flex gap-4 items-start ${
                item.isRead
                  ? 'bg-transparent hover:bg-[#f8f4e3]/40 dark:hover:bg-[#20271c]/50'
                  : 'bg-[#fbf1e2]/40 dark:bg-[#2b2315]/40 hover:bg-[#fbf1e2]/70 dark:hover:bg-[#2b2315]/60'
              }`}
            >
              <div className="p-2.5 rounded-2xl bg-[#f8f4e3] dark:bg-[#252e1f] border border-[#e6dfcb] dark:border-[#323d2b] shrink-0">
                {getIcon(item.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-[#2c3324] dark:text-[#fefcf1]">
                    {item.title}
                  </h4>
                  {!item.isRead && (
                    <span className="px-2 py-0.5 rounded-full bg-[#fbf1e2] dark:bg-[#2b2315] border border-[#e0a861]/40 text-[#9a6423] dark:text-[#f0be7c] text-[10px] font-bold uppercase tracking-wider">
                      New
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#505748] dark:text-[#a3ab98] leading-relaxed">
                  {item.message}
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-2.5 text-xs">
                  <span className="text-[11px] text-[#707666] dark:text-[#8a9180]">
                    {formatTimeAgo(item.createdAt)}
                  </span>

                  {item.linkUrl && (
                    <Link
                      href={item.linkUrl}
                      onClick={() => !item.isRead && handleMarkAsRead(item.id)}
                      className="inline-flex items-center gap-1 font-semibold text-[#9a6423] dark:text-[#f0be7c] hover:underline"
                    >
                      <span>View Details</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  )}

                  {!item.isRead && (
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(item.id)}
                      disabled={isPending}
                      className="text-[11px] text-[#707666] dark:text-[#a3ab98] hover:text-[#2c3324] dark:hover:text-[#fefcf1] underline"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>

              {/* Delete / Dismiss */}
              <button
                type="button"
                onClick={() => handleDelete(item.id, !item.isRead)}
                disabled={isPending}
                aria-label="Delete notification"
                className="p-1.5 text-[#707666] dark:text-[#a3ab98] hover:text-[#c0392b] dark:hover:text-[#ef5350] rounded-lg hover:bg-[#f8f4e3] dark:hover:bg-[#252e1f] transition-colors shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
