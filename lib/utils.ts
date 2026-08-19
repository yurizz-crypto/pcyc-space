import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges class names cleanly with Tailwind CSS conflict resolution.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a numeric currency value into Philippine Peso (PHP).
 * @example formatPHP(1500) => "₱1,500.00"
 */
export function formatPHP(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(num || 0);
}

export const formatCurrency = formatPHP;

/**
 * Formats a Date object or ISO string into a human-readable Philippine date & time format.
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-PH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d);
}

/**
 * Formats only the date portion (e.g. "Aug 15, 2026").
 */
export function formatDateOnly(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-PH', {
    dateStyle: 'medium',
  }).format(d);
}

/**
 * Formats only the time portion (e.g. "8:00 AM").
 */
export function formatTimeOnly(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-PH', {
    timeStyle: 'short',
  }).format(d);
}

/**
 * Formats a full event schedule with start and end times cleanly.
 * @example Same day: "Aug 15, 2026 • 8:00 AM – 5:00 PM"
 * @example Multi day: "Aug 15, 2026, 8:00 AM – Aug 17, 2026, 5:00 PM"
 */
export function formatEventSchedule(startDate: Date | string, endDate: Date | string): string {
  const s = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const e = typeof endDate === 'string' ? new Date(endDate) : endDate;

  const isSameDay =
    s.getFullYear() === e.getFullYear() &&
    s.getMonth() === e.getMonth() &&
    s.getDate() === e.getDate();

  if (isSameDay) {
    return `${formatDateOnly(s)} • ${formatTimeOnly(s)} – ${formatTimeOnly(e)}`;
  }

  return `${formatDate(s)} – ${formatDate(e)}`;
}

/**
 * Helper for HTML date inputs (YYYY-MM-DD)
 */
export function formatDateForDateInput(d: Date | string): string {
  const date = typeof d === 'string' ? new Date(d) : d;
  return isNaN(date.getTime()) ? '' : date.toLocaleDateString('en-CA');
}

/**
 * Helper for HTML time inputs (HH:mm)
 */
export function formatTimeForTimeInput(d: Date | string): string {
  const date = typeof d === 'string' ? new Date(d) : d;
  return isNaN(date.getTime()) ? '08:00' : date.toTimeString().slice(0, 5);
}

/**
 * Formats a Date into a human-friendly relative time string (e.g. "just now", "5m ago", "2h ago", "3d ago").
 */
export function formatTimeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const sec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (sec < 60) return 'just now';
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  if (sec < 2592000) return `${Math.floor(sec / 86400)}d ago`;
  return formatDateOnly(d);
}

