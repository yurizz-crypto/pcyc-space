'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, User, LogIn, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileNav } from '@/components/layout/mobile-nav';
import { NavUserMenu } from '@/components/layout/nav-user-menu';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import type { Profile } from '@/lib/db/schema/users';

export interface NavbarClientProps {
  profile: Profile | null;
}

export function NavbarClient({ profile }: NavbarClientProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/events', label: 'Events' },
    { href: '/merch', label: 'Merch' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#fefcf1]/90 dark:bg-[#131710]/90 backdrop-blur-md border-b border-[#e6dfcb] dark:border-[#323d2b] shadow-sm py-3'
            : 'bg-[#fefcf1] dark:bg-[#131710] py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group focus:outline-none"
            >
              <div className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-2xl overflow-hidden bg-[#2c3324] dark:bg-[#1f271a] p-1.5 flex items-center justify-center shadow-sm border border-transparent dark:border-[#38452f] group-hover:scale-105 transition-transform duration-200">
                <Image
                  src="/images/logo/pcyc-transparent-logo.png"
                  alt="PCYC Logo"
                  width={36}
                  height={36}
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-lg sm:text-xl text-[#2c3324] dark:text-[#fefcf1] leading-tight tracking-tight">
                  PCYC Space
                </span>
                <span className="text-[10px] sm:text-[11px] font-medium text-[#707666] dark:text-[#a3ab98] tracking-wider uppercase">
                  Philippine Christadelphians
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 bg-[#f8f4e3] dark:bg-[#1b2117] px-3 py-1.5 rounded-2xl border border-[#e6dfcb] dark:border-[#323d2b]">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== '/' && pathname?.startsWith(link.href));

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-white dark:bg-[#252e1f] text-[#2c3324] dark:text-[#fefcf1] shadow-xs font-semibold'
                        : 'text-[#5f6654] dark:text-[#a3ab98] hover:text-[#2c3324] dark:hover:text-[#fefcf1] hover:bg-white/50 dark:hover:bg-[#20271c]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Right Actions */}
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />

              <Link
                href="/merch"
                className="relative p-2 rounded-xl text-[#2c3324] dark:text-[#fefcf1] hover:bg-[#2c3324]/5 dark:hover:bg-white/5 transition-colors"
                title="PCYC Merch Catalog"
              >
                <ShoppingBag className="h-5 w-5" />
                <span className="sr-only">Merchandise</span>
              </Link>

              <div className="h-5 w-px bg-[#e6dfcb] dark:bg-[#323d2b]" />

              {/* Dynamic Auth State */}
              {profile ? (
                <NavUserMenu profile={profile} />
              ) : (
                <div className="flex items-center gap-2.5">
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="gap-1.5">
                      <LogIn className="h-4 w-4" />
                      <span>Log In</span>
                    </Button>
                  </Link>

                  <Link href="/register">
                    <Button variant="primary" size="sm" className="gap-1.5 shadow-xs">
                      <User className="h-4 w-4" />
                      <span>Join PCYC</span>
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Trigger & Actions */}
            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle size="sm" />
              <Link href="/merch" className="p-2 rounded-xl text-[#2c3324] dark:text-[#fefcf1]">
                <ShoppingBag className="h-5 w-5" />
              </Link>
              <button
                onClick={() => setIsMobileOpen(true)}
                className="p-2 rounded-xl text-[#2c3324] dark:text-[#fefcf1] hover:bg-[#2c3324]/10 dark:hover:bg-white/10 transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer with Auth Awareness */}
      <MobileNav
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        profile={profile}
      />
    </>
  );
}
