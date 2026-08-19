import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  Tote,
  ArrowRight,
  BookOpen,
  Users,
  Sparkle,
  WarningCircle,
  Info,
  Clock,
} from '@phosphor-icons/react/dist/ssr';
import { Button } from '@/components/ui/button';
import { EventGrid } from '@/components/domain/events/event-grid';
import { ProductGrid } from '@/components/domain/merch/product-grid';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ui/scroll-reveal';
import { InteractiveCard } from '@/components/ui/interactive-card';
import {
  getCachedPublishedEvents,
  getCachedAvailableProducts,
  getCachedEcclesiaCount,
  getCachedYouthAndFriendsCount,
} from '@/lib/db/queries/cached';

import { HeroGlow } from '@/components/ui/hero-glow';
import { AnimatedCounter } from '@/components/ui/animated-counter';

export const metadata = {
  title: 'PCYC Space — Philippine Christadelphian Youth Circle',
  description:
    'Official website for the Philippine Christadelphian Youth Circle. Connecting youth across Luzon, Visayas, and Mindanao for Bible camps, fellowship, and faith-driven merchandise.',
};

export default async function HomePage() {
  const [allEvents, allProducts, ecclesiaCount, youthCount] = await Promise.all([
    getCachedPublishedEvents(),
    getCachedAvailableProducts(),
    getCachedEcclesiaCount(),
    getCachedYouthAndFriendsCount(),
  ]);

  const featuredEvents = allEvents.slice(0, 3);
  const featuredProducts = allProducts.slice(0, 4);

  return (
    <div className="flex flex-col w-full">
      {/* TESTING PHASE ANNOUNCEMENT BANNER */}
      <div className="w-full bg-[#fbf1e2] dark:bg-[#2b2315] border-b border-[#e0a861]/40 text-[#422e1b] dark:text-[#f0be7c] py-3.5 px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-[#e0a861]/20 dark:bg-[#e0a861]/15 flex items-center justify-center shrink-0 text-[#9a6423] dark:text-[#f0be7c]">
              <WarningCircle weight="bold" className="h-4 w-4" />
            </div>
            <div className="text-xs sm:text-sm">
              <span className="font-bold text-[#2c3324] dark:text-[#fefcf1] uppercase tracking-wide mr-1.5 px-2 py-0.5 bg-[#e0a861]/20 dark:bg-[#e0a861]/15 rounded-md">
                Testing Phase
              </span>
              <span className="text-[#5c4936] dark:text-[#d4b896]">
                This website is currently in its active development and testing phase.{' '}
                <strong className="font-semibold text-[#2c3324] dark:text-[#fefcf1]">
                  Event registration and merchandise ordering are currently disabled.
                </strong>
              </span>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#9a6423] dark:text-[#f0be7c] shrink-0">
            <Clock weight="bold" className="h-3.5 w-3.5" />
            <span>Full Launch Coming Soon</span>
          </div>
        </div>
      </div>

      {/* 1. HERO SECTION (Asymmetric Split with Dynamic Atmospheric Glow) */}
      <section className="relative overflow-hidden bg-[#fefcf1] dark:bg-[#131710] py-20 sm:py-28 lg:py-36">
        <HeroGlow />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-8 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e0a861]/15 border border-[#e0a861]/30 text-xs font-bold text-[#9a6423] dark:text-[#f0be7c]">
                <Sparkle weight="fill" className="h-3.5 w-3.5" />
                <span>Philippine Christadelphian Youth Ministry</span>
              </div>

              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#2c3324] dark:text-[#fefcf1] leading-[1.05]">
                United in Faith.<br />
                <span className="text-[#e0a861] italic">Growing</span> in Christ.
              </h1>

              <p className="text-lg sm:text-xl text-[#5a634e] dark:text-[#a3ab98] max-w-lg leading-relaxed">
                The digital home of the Philippine Christadelphian Youth Circle. Connecting brothers, sisters, and friends across nationwide ecclesias.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link href="/events" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2 bg-[#2c3324] hover:bg-[#3d4632] text-white dark:bg-[#e0a861] dark:hover:bg-[#ca914a] dark:text-[#131710] shadow-md hover:shadow-lg transition-all">
                    <Calendar weight="bold" className="h-5 w-5" />
                    <span>Explore Youth Camps</span>
                  </Button>
                </Link>
                <Link href="/merch" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto gap-2 border-[#e6dfcb] hover:bg-[#f8f4e3] dark:border-[#323d2b] dark:hover:bg-[#1b2117]"
                  >
                    <Tote weight="bold" className="h-5 w-5" />
                    <span>Browse Merch Store</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Hero Visual Showcase */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-lg aspect-[4/5] rounded-3xl overflow-hidden bg-radial from-[#38432e] to-[#20271b] border border-[#445037] p-8 flex flex-col items-center justify-center text-center group shadow-2xl">
                {/* Background Atmospheric Lighting */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#e0a861]/25 via-transparent to-transparent pointer-events-none" />
                <div className="relative h-64 w-64 transition-transform duration-700 ease-out group-hover:scale-108">
                  <Image
                    src="/images/logo/pcyc-transparent-logo.png"
                    alt="PCYC Emblem"
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION (Animated Counter Numbers) */}
      <section className="bg-[#2c3324] text-[#fefcf1] py-12 border-y border-[#3d4632] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-[#3d4632]">
            <StaggerItem className="pt-8 md:pt-0">
              <div className="font-serif font-semibold text-4xl sm:text-5xl text-[#e0a861] mb-2">
                <AnimatedCounter value={ecclesiaCount} suffix="+" />
              </div>
              <div className="text-sm font-medium tracking-wide text-[#f8f4e3]/70 uppercase">Philippine Ecclesias</div>
            </StaggerItem>
            <StaggerItem className="pt-8 md:pt-0">
              <div className="font-serif font-semibold text-4xl sm:text-5xl text-[#e0a861] mb-2">
                <AnimatedCounter value={youthCount} suffix="+" />
              </div>
              <div className="text-sm font-medium tracking-wide text-[#f8f4e3]/70 uppercase">Youth & Friends</div>
            </StaggerItem>
            <StaggerItem className="pt-8 md:pt-0">
              <div className="font-serif font-semibold text-4xl sm:text-5xl text-[#e0a861] mb-2">
                <AnimatedCounter value={100} suffix="%" />
              </div>
              <div className="text-sm font-medium tracking-wide text-[#f8f4e3]/70 uppercase">Scripture-Rooted</div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* 2. PILLARS / MISSION SECTION (Asymmetric Bento Grid) */}
      <section className="py-24 bg-[#f8f4e3] dark:bg-[#1b2117]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-[#2c3324] dark:text-[#fefcf1] mb-12 max-w-2xl">
              What We Stand For
            </h2>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Pillar 1 (Hero Cell) */}
            <StaggerItem className="lg:col-span-8">
              <InteractiveCard className="h-full rounded-3xl border border-[#e6dfcb] dark:border-[#323d2b] bg-white dark:bg-[#131710] p-10 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-[#e0a861]/40 transition-all duration-300">
                <div className="h-14 w-14 rounded-2xl bg-[#fbf1e2] dark:bg-[#252e1f] text-[#e0a861] flex items-center justify-center mb-8">
                  <BookOpen weight="duotone" className="h-7 w-7 text-[#9a6423] dark:text-[#f0be7c]" />
                </div>
                <div>
                  <h3 className="font-serif text-3xl font-semibold text-[#2c3324] dark:text-[#fefcf1] mb-4">
                    Faithful Bible Study
                  </h3>
                  <p className="text-lg text-[#5a634e] dark:text-[#a3ab98] leading-relaxed max-w-xl">
                    We believe the Holy Scriptures are the inspired Word of God. Our camps
                    and monthly circles focus on deep, practical study of Biblical truth and
                    the Gospel of the Kingdom.
                  </p>
                </div>
              </InteractiveCard>
            </StaggerItem>

            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Pillar 2 */}
              <StaggerItem className="flex-1">
                <InteractiveCard className="h-full rounded-3xl border border-[#e6dfcb] dark:border-[#323d2b] bg-[#e0a861]/10 dark:bg-[#e0a861]/5 p-8 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-[#e0a861]/40 transition-all duration-300">
                  <div className="h-12 w-12 rounded-xl bg-white/50 dark:bg-[#252e1f] text-[#e0a861] flex items-center justify-center mb-6">
                    <Users weight="duotone" className="h-6 w-6 text-[#9a6423] dark:text-[#f0be7c]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-[#2c3324] dark:text-[#fefcf1] mb-3">
                      Island-Wide Fellowship
                    </h3>
                    <p className="text-base text-[#5a634e] dark:text-[#a3ab98] leading-relaxed">
                      Uniting young believers across Luzon, Visayas, and Mindanao for mutual encouragement.
                    </p>
                  </div>
                </InteractiveCard>
              </StaggerItem>

              {/* Pillar 3 */}
              <StaggerItem className="flex-1">
                <InteractiveCard className="h-full rounded-3xl border border-[#e6dfcb] dark:border-[#323d2b] bg-white dark:bg-[#131710] p-8 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-[#e0a861]/40 transition-all duration-300">
                  <div className="h-12 w-12 rounded-xl bg-[#fbf1e2] dark:bg-[#252e1f] text-[#e0a861] flex items-center justify-center mb-6">
                    <Sparkle weight="duotone" className="h-6 w-6 text-[#9a6423] dark:text-[#f0be7c]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-[#2c3324] dark:text-[#fefcf1] mb-3">
                      Ministry & Service
                    </h3>
                    <p className="text-base text-[#5a634e] dark:text-[#a3ab98] leading-relaxed">
                      Empowering the next generation to serve in local ecclesias and preach the Gospel.
                    </p>
                  </div>
                </InteractiveCard>
              </StaggerItem>
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* 3. FEATURED UPCOMING EVENTS (LIVE DB) */}
      <section className="py-24 bg-[#fefcf1] dark:bg-[#131710]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pb-12">
            <div className="space-y-4 max-w-2xl">
              <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-[#2c3324] dark:text-[#fefcf1]">
                Upcoming Gatherings
              </h2>
              <p className="text-lg text-[#5a634e] dark:text-[#a3ab98]">
                Mark your calendars and preview upcoming camp and fellowship schedules.
              </p>
            </div>
            <Link href="/events">
              <Button variant="outline" size="md" className="gap-2 rounded-full px-6">
                <span>View All Events</span>
                <ArrowRight weight="bold" className="h-4 w-4" />
              </Button>
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="mb-10 p-4 rounded-2xl bg-[#fbf1e2] dark:bg-[#2b2315] border border-[#e0a861]/30 text-[#5c4936] dark:text-[#d4b896] flex items-start gap-4">
              <Info weight="fill" className="h-5 w-5 text-[#9a6423] dark:text-[#e0a861] shrink-0 mt-0.5" />
              <div className="text-sm leading-relaxed">
                <strong className="text-[#2c3324] dark:text-[#fefcf1] font-medium block mb-1">Registration Notice</strong>
                Camp registration is currently in testing mode and not yet accepting submissions. Dates and details are for preview purposes.
              </div>
            </div>

            <EventGrid
              events={featuredEvents}
              emptyTitle="New Camp Schedules Coming Soon"
              emptyDescription="PCYC youth committee is currently preparing the next upcoming national camp and study circles. Check back soon for registration dates!"
            />
          </ScrollReveal>
        </div>
      </section>

      {/* 4. MERCHANDISE & FUNDRAISING HIGHLIGHT (LIVE DB) */}
      <section className="py-24 bg-[#f8f4e3] dark:bg-[#1b2117] border-y border-[#e6dfcb] dark:border-[#323d2b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pb-12">
            <div className="space-y-4 max-w-2xl">
              <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-[#2c3324] dark:text-[#fefcf1]">
                Wear the Message
              </h2>
              <p className="text-lg text-[#5a634e] dark:text-[#a3ab98]">
                100% of merchandise proceeds go towards youth camp travel subsidies and study materials.
              </p>
            </div>
            <Link href="/merch">
              <Button variant="outline" size="md" className="gap-2 rounded-full px-6 bg-white dark:bg-[#131710]">
                <span>View Full Store</span>
                <ArrowRight weight="bold" className="h-4 w-4" />
              </Button>
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="mb-10 p-4 rounded-2xl bg-[#fbf1e2] dark:bg-[#2b2315] border border-[#e0a861]/30 text-[#5c4936] dark:text-[#d4b896] flex items-start gap-4">
              <Info weight="fill" className="h-5 w-5 text-[#9a6423] dark:text-[#e0a861] shrink-0 mt-0.5" />
              <div className="text-sm leading-relaxed">
                <strong className="text-[#2c3324] dark:text-[#fefcf1] font-medium block mb-1">Store Preview Notice</strong>
                Merchandise catalog is currently in preview mode. Checkout and order fulfillment are temporarily paused during website testing.
              </div>
            </div>

            <ProductGrid
              products={featuredProducts}
              emptyTitle="Merch Catalog Updating"
              emptyDescription="New PCYC apparel, camp shirts, and study accessories will be added shortly. Thank you for supporting our youth ministry!"
            />
          </ScrollReveal>
        </div>
      </section>

      {/* 5. SCRIPTURAL CALL TO ACTION */}
      <section className="bg-[#2c3324] text-[#fefcf1] py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#e0a861]/15 via-transparent to-transparent pointer-events-none" />
        <ScrollReveal className="relative max-w-4xl mx-auto px-4 text-center space-y-8">
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#fefcf1] leading-tight">
            Are you a Christadelphian youth or looking to study the Bible?
          </h2>
          <p className="text-lg sm:text-xl text-[#f8f4e3]/80 max-w-2xl mx-auto font-light leading-relaxed">
            Whether you are baptized, unbaptized, or exploring the Scriptures as a friend,
            there is a place for you in the Philippine Christadelphian Youth Circle.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button variant="primary" size="lg" className="gap-2 bg-[#e0a861] text-[#2c3324] hover:bg-[#f0be7c] rounded-full px-8">
                <Users weight="bold" className="h-5 w-5" />
                <span>Create Your Account</span>
              </Button>
            </Link>
            <Link href="/about">
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-[#fefcf1] hover:bg-white/10 hover:text-white rounded-full px-8"
              >
                <span>Read About Our Faith</span>
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
