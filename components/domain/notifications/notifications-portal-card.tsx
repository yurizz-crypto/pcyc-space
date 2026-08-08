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
    <div className="rounded-3xl border border-stone-200 dark:border-forest-800/60 bg-white/80 dark:bg-forest-950/60 backdrop-blur-xl shadow-lg overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-6 border-b border-stone-100 dark:border-forest-800/60 bg-stone-50/50 dark:bg-forest-900/30">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gold-500/10 text-gold-600 dark:text-gold-400">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-forest-950 dark:text-cream-50">
              Activity & Notifications
            </h3>
            <p className="text-xs text-forest-900/60 dark:text-cream-200/60">
              Updates on your event tickets, merch orders, and GCash payments
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            disabled={isPending}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gold-500/30 bg-gold-500/10 text-xs font-semibold text-gold-800 dark:text-gold-300 hover:bg-gold-500/20 transition-all disabled:opacity-50"
          >
            <CheckCheck className="h-4 w-4" />
            <span>Mark all as read ({unreadCount})</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 px-6 py-3 border-b border-stone-100 dark:border-forest-800/40 overflow-x-auto text-xs">
        <span className="flex items-center gap-1 font-semibold text-forest-900/40 dark:text-cream-300/40 mr-2 shrink-0">
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
                ? 'bg-forest-900 dark:bg-cream-100 text-cream-50 dark:text-forest-950 font-bold shadow-sm'
                : 'text-forest-900/70 dark:text-cream-200/70 hover:bg-stone-100 dark:hover:bg-forest-900/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Feed List */}
      <div className="divide-y divide-stone-100 dark:divide-forest-800/40">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 dark:bg-forest-900/40 text-forest-900/40 dark:text-cream-300/40 mb-3">
              <Bell className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-forest-950 dark:text-cream-50">
              No notifications found
            </p>
            <p className="text-xs text-forest-900/50 dark:text-cream-300/50 mt-1">
              You are all caught up on your PCYC Space updates!
            </p>
          </div>
        ) : (
          filteredNotifications.map((item) => (
            <div
              key={item.id}
              className={`p-5 transition-colors flex gap-4 items-start ${
                item.isRead
                  ? 'bg-transparent hover:bg-stone-50/50 dark:hover:bg-forest-900/20'
                  : 'bg-forest-900/[0.02] dark:bg-gold-500/[0.04] hover:bg-forest-900/[0.04]'
              }`}
            >
              <div className="p-2.5 rounded-2xl bg-forest-900/5 dark:bg-forest-900/50 shrink-0">
                {getIcon(item.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-forest-950 dark:text-cream-50">
                    {item.title}
                  </h4>
                  {!item.isRead && (
                    <span className="px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-800 dark:text-gold-300 text-[10px] font-bold uppercase tracking-wider">
                      New
                    </span>
                  )}
                </div>

                <p className="text-xs text-forest-900/70 dark:text-cream-200/70 leading-relaxed">
                  {item.message}
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-2.5 text-xs">
                  <span className="text-[11px] text-forest-900/40 dark:text-cream-300/40">
                    {formatTimeAgo(item.createdAt)}
                  </span>

                  {item.linkUrl && (
                    <Link
                      href={item.linkUrl}
                      onClick={() => !item.isRead && handleMarkAsRead(item.id)}
                      className="inline-flex items-center gap-1 font-semibold text-gold-700 dark:text-gold-400 hover:underline"
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
                      className="text-[11px] text-forest-900/60 dark:text-cream-300/60 hover:text-forest-950 dark:hover:text-cream-50 underline"
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
                className="p-1.5 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-stone-100 dark:hover:bg-forest-900/40 transition-colors shrink-0"
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
