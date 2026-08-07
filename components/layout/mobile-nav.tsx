'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { X, Calendar, ShoppingBag, Info, User, LogIn, Heart, Shield, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/molecules/user-avatar';
import { signOutAction } from '@/app/actions/auth';
import type { Profile } from '@/lib/db/schema/users';

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: Profile | null;
}

export function MobileNav({ isOpen, onClose, profile }: MobileNavProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  const isAdmin = profile?.role === 'ADMIN' || profile?.role === 'SUPERADMIN';
  const prefix =
    profile?.designation === 'BROTHER'
      ? 'Bro.'
      : profile?.designation === 'SISTER'
      ? 'Sis.'
      : 'Friend';

  const navLinks = [
    { href: '/', label: 'Home', icon: Heart },
    { href: '/about', label: 'About PCYC', icon: Info },
    { href: '/events', label: 'Events & Camps', icon: Calendar },
    { href: '/merch', label: 'Merch Shop', icon: ShoppingBag },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#2c3324]/70 dark:bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-[#fefcf1] dark:bg-[#131710] border-l border-[#e6dfcb] dark:border-[#323d2b] p-6 shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-[#e6dfcb] dark:border-[#323d2b]">
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center gap-2.5 font-serif font-bold text-lg text-[#2c3324] dark:text-[#fefcf1]"
            >
              <div className="relative h-9 w-9 rounded-xl overflow-hidden bg-[#2c3324] dark:bg-[#1f271a] p-1 flex items-center justify-center border border-transparent dark:border-[#38452f]">
                <Image
                  src="/images/logo/pcyc-transparent-logo.png"
                  alt="PCYC Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <span>PCYC Space</span>
            </Link>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-[#707666] dark:text-[#a3ab98] hover:bg-[#2c3324]/10 dark:hover:bg-white/10 hover:text-[#2c3324] dark:hover:text-[#fefcf1]"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Profile Badge (Mobile) */}
          {profile && (
            <div className="mt-4 p-3 rounded-2xl bg-[#f8f4e3] dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b] flex items-center gap-3">
              <UserAvatar
                firstName={profile.firstName}
                lastName={profile.lastName}
                designation={profile.designation}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#2c3324] dark:text-[#fefcf1] truncate">
                  {prefix} {profile.firstName} {profile.lastName}
                </p>
                <p className="text-[10px] text-[#707666] dark:text-[#a3ab98] truncate">
                  {profile.ecclesia || 'PCYC Member'}
                </p>
              </div>
            </div>
          )}

          {/* Links */}
          <nav className="mt-6 flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.href !== '/' && pathname?.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#e0a861]/20 dark:bg-[#e0a861]/15 text-[#2c3324] dark:text-[#e0a861] font-semibold'
                      : 'text-[#505748] dark:text-[#a3ab98] hover:bg-[#2c3324]/5 dark:hover:bg-white/5 hover:text-[#2c3324] dark:hover:text-[#fefcf1]'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? 'text-[#ca914a] dark:text-[#e0a861]' : 'text-[#707666] dark:text-[#a3ab98]'
                    }`}
                  />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* If Member Logged In */}
            {profile && (
              <>
                <div className="my-2 border-t border-[#e6dfcb] dark:border-[#323d2b]" />
                {isAdmin ? (
                  <Link
                    href="/admin"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#2c3324] dark:text-[#fefcf1] hover:bg-[#2c3324]/5 dark:hover:bg-white/5"
                  >
                    <Shield className="h-4 w-4 text-[#e0a861]" />
                    <span>Admin Dashboard</span>
                  </Link>
                ) : (
                  <Link
                    href="/portal"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#2c3324] dark:text-[#fefcf1] hover:bg-[#2c3324]/5 dark:hover:bg-white/5"
                  >
                    <User className="h-4 w-4 text-[#e0a861]" />
                    <span>Member Space</span>
                  </Link>
                )}

                <Link
                  href="/settings"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#2c3324] dark:text-[#fefcf1] hover:bg-[#2c3324]/5 dark:hover:bg-white/5"
                >
                  <Settings className="h-4 w-4 text-[#e0a861]" />
                  <span>Account Settings</span>
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Footer CTAs / Auth */}
        <div className="pt-6 border-t border-[#e6dfcb] dark:border-[#323d2b] space-y-2.5">
          {profile ? (
            <form action={signOutAction}>
              <Button
                type="submit"
                variant="outline"
                size="md"
                className="w-full gap-2 border-[#c0392b]/30 text-[#c0392b] dark:text-rose-400 hover:bg-[#fdf2f2] dark:hover:bg-rose-950/30"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </form>
          ) : (
            <>
              <Link href="/login" onClick={onClose} className="block w-full">
                <Button variant="outline" size="md" className="w-full gap-2">
                  <LogIn className="h-4 w-4" />
                  <span>Log In</span>
                </Button>
              </Link>
              <Link href="/register" onClick={onClose} className="block w-full">
                <Button variant="primary" size="md" className="w-full gap-2">
                  <User className="h-4 w-4" />
                  <span>Join / Register</span>
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
