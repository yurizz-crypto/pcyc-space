'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { X, Calendar, ShoppingBag, Info, User, LogIn, Heart, Shield, LogOut } from 'lucide-react';
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
        className="fixed inset-0 bg-[#2c3324]/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-[#fefcf1] border-l border-[#e6dfcb] p-6 shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-[#e6dfcb]">
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center gap-2.5 font-serif font-bold text-lg text-[#2c3324]"
            >
              <div className="relative h-9 w-9 rounded-xl overflow-hidden bg-[#2c3324] p-1 flex items-center justify-center">
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
              className="rounded-xl p-2 text-[#707666] hover:bg-[#2c3324]/10 hover:text-[#2c3324]"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Profile Badge (Mobile) */}
          {profile && (
            <div className="mt-4 p-3 rounded-2xl bg-[#f8f4e3] border border-[#e6dfcb] flex items-center gap-3">
              <UserAvatar
                firstName={profile.firstName}
                lastName={profile.lastName}
                designation={profile.designation}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#2c3324] truncate">
                  {prefix} {profile.firstName} {profile.lastName}
                </p>
                <p className="text-[10px] text-[#707666] truncate">
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
                      ? 'bg-[#e0a861]/20 text-[#2c3324] font-semibold'
                      : 'text-[#505748] hover:bg-[#2c3324]/5 hover:text-[#2c3324]'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? 'text-[#ca914a]' : 'text-[#707666]'
                    }`}
                  />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* If Member Logged In */}
            {profile && (
              <>
                <div className="my-2 border-t border-[#e6dfcb]" />
                <Link
                  href="/portal"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#2c3324] hover:bg-[#2c3324]/5"
                >
                  <User className="h-4 w-4 text-[#e0a861]" />
                  <span>Member Space</span>
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#2c3324] hover:bg-[#2c3324]/5"
                  >
                    <Shield className="h-4 w-4 text-[#e0a861]" />
                    <span>Admin Panel</span>
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>

        {/* Footer CTAs / Auth */}
        <div className="pt-6 border-t border-[#e6dfcb] space-y-2.5">
          {profile ? (
            <form action={signOutAction}>
              <Button
                type="submit"
                variant="outline"
                size="md"
                className="w-full gap-2 border-[#c0392b]/30 text-[#c0392b] hover:bg-[#fdf2f2]"
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
