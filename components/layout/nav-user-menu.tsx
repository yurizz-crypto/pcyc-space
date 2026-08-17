'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { UserAvatar } from '@/components/molecules/user-avatar';
import { Badge } from '@/components/ui/badge';
import { signOutAction } from '@/app/actions/auth';
import { Shield, LayoutDashboard, LogOut, ChevronDown, User, Settings, ShoppingBag } from 'lucide-react';
import type { Profile } from '@/lib/db/schema/users';

export interface NavUserMenuProps {
  profile: Profile;
}

export function NavUserMenu({ profile }: NavUserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isAdmin = profile.role === 'ADMIN' || profile.role === 'SUPERADMIN';
  const prefix =
    profile.designation === 'BROTHER'
      ? 'Bro.'
      : profile.designation === 'SISTER'
      ? 'Sis.'
      : 'Friend';

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center gap-3" ref={menuRef}>
      {/* Admin Quick Action Pill */}
      {isAdmin && (
        <Link
          href="/admin"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2c3324] text-[#e0a861] text-xs font-semibold hover:bg-[#3d4632] dark:bg-[#1b2117] dark:hover:bg-[#252e1f] transition-colors border border-[#e0a861]/40 shadow-xs"
        >
          <Shield className="h-3.5 w-3.5" />
          <span>Admin Panel</span>
        </Link>
      )}

      {/* User Dropdown Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 rounded-2xl hover:bg-white/80 dark:hover:bg-[#1f271a] border border-transparent hover:border-[#e6dfcb] dark:hover:border-[#38452f] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e0a861]"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <UserAvatar
          firstName={profile.firstName}
          lastName={profile.lastName}
          designation={profile.designation}
          size="sm"
        />
        <div className="hidden md:flex flex-col text-left">
          <span className="text-xs font-bold text-[#2c3324] dark:text-[#fefcf1] leading-tight">
            {prefix} {profile.firstName}
          </span>
          <span className="text-[10px] text-[#707666] dark:text-[#a3ab98] leading-tight">
            {profile.ecclesia || 'PCYC Member'}
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-[#707666] dark:text-[#a3ab98] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b] shadow-lg py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-4 py-2.5 border-b border-[#e6dfcb]/60 dark:border-[#323d2b]">
            <p className="text-xs font-bold text-[#2c3324] dark:text-[#fefcf1]">
              {profile.firstName} {profile.lastName}
            </p>
            <p className="text-[11px] text-[#707666] dark:text-[#a3ab98] truncate">{profile.email}</p>
            {isAdmin && (
              <div className="mt-1.5">
                <Badge variant="forest" size="sm">
                  {profile.role}
                </Badge>
              </div>
            )}
          </div>

          <div className="py-1">
            {isAdmin ? (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#2c3324] dark:text-[#fefcf1] hover:bg-[#f8f4e3] dark:hover:bg-[#242c1e] transition-colors"
              >
                <LayoutDashboard className="h-4 w-4 text-[#e0a861]" />
                <span>Admin Dashboard</span>
              </Link>
            ) : (
              <Link
                href="/portal"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#2c3324] dark:text-[#fefcf1] hover:bg-[#f8f4e3] dark:hover:bg-[#242c1e] transition-colors"
              >
                <User className="h-4 w-4 text-[#e0a861]" />
                <span>Member Space & Portal</span>
              </Link>
            )}

            <Link
              href="/orders"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#2c3324] dark:text-[#fefcf1] hover:bg-[#f8f4e3] dark:hover:bg-[#242c1e] transition-colors"
            >
              <ShoppingBag className="h-4 w-4 text-[#e0a861]" />
              <span>My Orders & Reviews</span>
            </Link>

            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#2c3324] dark:text-[#fefcf1] hover:bg-[#f8f4e3] dark:hover:bg-[#242c1e] transition-colors"
            >
              <Settings className="h-4 w-4 text-[#e0a861]" />
              <span>Account Settings</span>
            </Link>
          </div>

          <div className="pt-1 border-t border-[#e6dfcb]/60 dark:border-[#323d2b]">
            <form action={signOutAction}>
              <button
                type="submit"
                className="flex items-center gap-2.5 w-full px-4 py-2 text-xs font-medium text-[#c0392b] dark:text-rose-400 hover:bg-[#fdf2f2] dark:hover:bg-rose-950/30 transition-colors text-left"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
