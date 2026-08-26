import React from 'react';
import Link from 'next/link';
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
  Heart,
  HandsClapping,
  Quotes,
} from '@phosphor-icons/react/dist/ssr';
import { Button } from '@/components/ui/button';
import { EventGrid } from '@/components/domain/events/event-grid';
import { ProductGrid } from '@/components/domain/merch/product-grid';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ui/scroll-reveal';
import { InteractiveCard } from '@/components/ui/interactive-card';
import { Marquee } from '@/components/ui/marquee';
import { HeroEmblemShowcase } from '@/components/home/hero-emblem-showcase';
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

  const marqueeItems = [
    { text: 'Let no man despise thy youth', ref: '1 Timothy 4:12' },
    { text: 'Remember now thy Creator in the days of thy youth', ref: 'Ecclesiastes 12:1' },
    { text: 'Brethren dwelling together in unity', ref: 'Psalm 133:1' },
    { text: 'Iron sharpeneth iron; so a friend sharpeneth a friend', ref: 'Proverbs 27:17' },
    { text: 'Luzon • Visayas • Mindanao Ecclesias', ref: 'Nationwide Circle' },
  ];

  return (
    <div className="flex flex-col w-full overflow-hidden">
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

      {/* 1. HERO SECTION (Asymmetric Split with Dynamic Atmospheric Glow & 3D Showcase) */}
      <section className="relative overflow-hidden bg-[#fefcf1] dark:bg-[#131710] py-20 sm:py-28 lg:py-36">
        <HeroGlow />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-6 space-y-8 text-left">
              <ScrollReveal>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e0a861]/15 border border-[#e0a861]/35 text-xs font-bold text-[#9a6423] dark:text-[#f0be7c] shadow-xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e0a861] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e0a861]"></span>
                  </span>
                  <span>Philippine Christadelphian Youth Ministry</span>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#2c3324] dark:text-[#fefcf1] leading-[1.05]">
                  United in Faith.<br />
                  <span className="text-[#e0a861] italic shimmer-text">Growing</span> in Christ.
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <p className="text-lg sm:text-xl text-[#5a634e] dark:text-[#a3ab98] max-w-lg leading-relaxed">
                  The digital home of the Philippine Christadelphian Youth Circle. Connecting brothers, sisters, and friends across nationwide ecclesias for Bible camps, fellowship, and faith.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <div className="flex flex-col sm:flex-row items-start gap-4 pt-2">
                  <Link href="/events" className="w-full sm:w-auto">
                    <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2.5 bg-[#2c3324] hover:bg-[#3d4632] text-white dark:bg-[#e0a861] dark:hover:bg-[#ca914a] dark:text-[#131710] shadow-md hover:shadow-xl hover:scale-[1.02] transition-all rounded-2xl px-7">
                      <Calendar weight="bold" className="h-5 w-5" />
                      <span>Explore Youth Camps</span>
                    </Button>
                  </Link>
                  <Link href="/merch" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto gap-2.5 border-[#e6dfcb] hover:bg-[#f8f4e3] dark:border-[#323d2b] dark:hover:bg-[#1b2117] rounded-2xl px-7"
                    >
                      <Tote weight="bold" className="h-5 w-5" />
                      <span>Browse Merch Store</span>
                    </Button>
                  </Link>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Hero 3D Visual Showcase */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <ScrollReveal delay={0.2} yOffset={30}>
                <HeroEmblemShowcase />
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* INFINITE SCRIPTURE & FELLOWSHIP MARQUEE RIBBON */}
      <div className="bg-[#23291c] text-[#fefcf1] py-4 border-y border-[#3d4632] overflow-hidden relative z-10 shadow-inner">
        <Marquee speed={40} className="[--gap:3rem]">
          {marqueeItems.map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-xs sm:text-sm font-serif tracking-wide whitespace-nowrap">
              <Sparkle weight="fill" className="h-3.5 w-3.5 text-[#e0a861] shrink-0" />
              <span className="text-[#f8f4e3] italic">&ldquo;{item.text}&rdquo;</span>
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#e0a861] px-2 py-0.5 rounded-md bg-white/10">
                {item.ref}
              </span>
            </div>
          ))}
        </Marquee>
      </div>

      {/* STATS SECTION (Glassmorphic Animated Counter Numbers) */}
      <section className="bg-[#2c3324] text-[#fefcf1] py-14 border-b border-[#3d4632] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-[#3d4632]">
            <StaggerItem className="pt-8 md:pt-0 group">
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="h-10 w-10 rounded-full bg-[#e0a861]/15 text-[#e0a861] flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <HandsClapping weight="duotone" className="h-5 w-5" />
                </div>
                <div className="font-serif font-bold text-4xl sm:text-5xl text-[#e0a861] tracking-tight">
                  <AnimatedCounter value={ecclesiaCount} suffix="+" />
                </div>
                <div className="text-xs font-bold tracking-widest text-[#f8f4e3]/80 uppercase">Philippine Ecclesias</div>
              </div>
            </StaggerItem>

            <StaggerItem className="pt-8 md:pt-0 group">
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="h-10 w-10 rounded-full bg-[#e0a861]/15 text-[#e0a861] flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <Users weight="duotone" className="h-5 w-5" />
                </div>
                <div className="font-serif font-bold text-4xl sm:text-5xl text-[#e0a861] tracking-tight">
                  <AnimatedCounter value={youthCount} suffix="+" />
                </div>
                <div className="text-xs font-bold tracking-widest text-[#f8f4e3]/80 uppercase">Youth & Friends</div>
              </div>
            </StaggerItem>

            <StaggerItem className="pt-8 md:pt-0 group">
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="h-10 w-10 rounded-full bg-[#e0a861]/15 text-[#e0a861] flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <BookOpen weight="duotone" className="h-5 w-5" />
                </div>
                <div className="font-serif font-bold text-4xl sm:text-5xl text-[#e0a861] tracking-tight">
                  <AnimatedCounter value={100} suffix="%" />
                </div>
                <div className="text-xs font-bold tracking-widest text-[#f8f4e3]/80 uppercase">Scripture-Rooted</div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* 2. PILLARS / MISSION SECTION (Asymmetric 3D Bento Grid) */}
      <section className="py-28 bg-[#f8f4e3] dark:bg-[#1b2117] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="space-y-4 mb-14 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-[#9a6423] dark:text-[#f0be7c] px-3 py-1 rounded-full bg-[#e0a861]/15 border border-[#e0a861]/30">
              Our Core Foundations
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-[#2c3324] dark:text-[#fefcf1] max-w-2xl leading-tight">
              What We Stand For
            </h2>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Pillar 1 (Hero Cell) */}
            <StaggerItem className="lg:col-span-8">
              <InteractiveCard className="h-full rounded-3xl border border-[#e6dfcb] dark:border-[#323d2b] bg-white dark:bg-[#131710] p-8 sm:p-10 flex flex-col justify-between shadow-sm hover:shadow-2xl hover:border-[#e0a861]/60 transition-all duration-300">
                <div className="flex items-center justify-between gap-4 mb-8">
                  <div className="h-14 w-14 rounded-2xl bg-[#fbf1e2] dark:bg-[#252e1f] text-[#e0a861] flex items-center justify-center shadow-xs">
                    <BookOpen weight="duotone" className="h-7 w-7 text-[#9a6423] dark:text-[#f0be7c]" />
                  </div>
                  <span className="text-xs font-bold text-[#9a6423] dark:text-[#f0be7c] uppercase tracking-wider bg-[#fbf1e2] dark:bg-[#252e1f] px-3 py-1 rounded-full border border-[#e0a861]/30">
                    Pillar 01
                  </span>
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
                <InteractiveCard className="h-full rounded-3xl border border-[#e6dfcb] dark:border-[#323d2b] bg-[#e0a861]/10 dark:bg-[#e0a861]/5 p-8 flex flex-col justify-between shadow-sm hover:shadow-2xl hover:border-[#e0a861]/60 transition-all duration-300">
                  <div className="h-12 w-12 rounded-xl bg-white/60 dark:bg-[#252e1f] text-[#e0a861] flex items-center justify-center mb-6 shadow-xs">
                    <Users weight="duotone" className="h-6 w-6 text-[#9a6423] dark:text-[#f0be7c]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-[#2c3324] dark:text-[#fefcf1] mb-2">
                      Island-Wide Fellowship
                    </h3>
                    <p className="text-sm text-[#5a634e] dark:text-[#a3ab98] leading-relaxed">
                      Uniting young believers across Luzon, Visayas, and Mindanao for mutual encouragement and spiritual growth.
                    </p>
                  </div>
                </InteractiveCard>
              </StaggerItem>

              {/* Pillar 3 */}
              <StaggerItem className="flex-1">
                <InteractiveCard className="h-full rounded-3xl border border-[#e6dfcb] dark:border-[#323d2b] bg-white dark:bg-[#131710] p-8 flex flex-col justify-between shadow-sm hover:shadow-2xl hover:border-[#e0a861]/60 transition-all duration-300">
                  <div className="h-12 w-12 rounded-xl bg-[#fbf1e2] dark:bg-[#252e1f] text-[#e0a861] flex items-center justify-center mb-6 shadow-xs">
                    <Sparkle weight="duotone" className="h-6 w-6 text-[#9a6423] dark:text-[#f0be7c]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-[#2c3324] dark:text-[#fefcf1] mb-2">
                      Ministry & Service
                    </h3>
                    <p className="text-sm text-[#5a634e] dark:text-[#a3ab98] leading-relaxed">
                      Empowering the next generation to serve in local ecclesias and preach the Gospel of the Kingdom.
                    </p>
                  </div>
                </InteractiveCard>
              </StaggerItem>
            </div>

            {/* Daily Scripture of Hope (Bonus Bento Feature) */}
            <StaggerItem className="lg:col-span-12">
              <InteractiveCard className="rounded-3xl border border-[#e0a861]/40 bg-gradient-to-r from-[#2c3324] via-[#38432e] to-[#20271b] text-[#fefcf1] p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-[#e0a861]/20 flex items-center justify-center text-[#e0a861] shrink-0">
                    <Quotes weight="fill" className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#e0a861]">Scripture of Hope</span>
                    <p className="font-serif text-lg sm:text-xl italic text-[#f8f4e3] leading-relaxed">
                      &ldquo;Let no man despise thy youth; but be thou an example of the believers, in word, in conversation, in charity, in spirit, in faith, in purity.&rdquo;
                    </p>
                    <span className="text-xs text-[#e0a861] font-bold block pt-1">— 1 Timothy 4:12</span>
                  </div>
                </div>
                <Link href="/about" className="shrink-0">
                  <Button variant="outline" size="sm" className="rounded-full border-white/30 text-[#fefcf1] hover:bg-white/10 hover:text-white px-5">
                    <span>Learn About Our Faith</span>
                  </Button>
                </Link>
              </InteractiveCard>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* 3. FEATURED UPCOMING EVENTS (LIVE DB) */}
      <section className="py-28 bg-[#fefcf1] dark:bg-[#131710]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pb-12">
            <div className="space-y-4 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-[#9a6423] dark:text-[#f0be7c] px-3 py-1 rounded-full bg-[#e0a861]/15 border border-[#e0a861]/30">
                Nationwide Gatherings
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-[#2c3324] dark:text-[#fefcf1]">
                Upcoming Gatherings
              </h2>
              <p className="text-lg text-[#5a634e] dark:text-[#a3ab98]">
                Mark your calendars and preview upcoming camp and fellowship schedules across Philippine ecclesias.
              </p>
            </div>
            <Link href="/events">
              <Button variant="outline" size="md" className="gap-2 rounded-full px-6 hover:scale-105 transition-all">
                <span>View All Events</span>
                <ArrowRight weight="bold" className="h-4 w-4" />
              </Button>
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="mb-10 p-4 rounded-2xl bg-[#fbf1e2] dark:bg-[#2b2315] border border-[#e0a861]/30 text-[#5c4936] dark:text-[#d4b896] flex items-start gap-4 shadow-xs">
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
      <section className="py-28 bg-[#f8f4e3] dark:bg-[#1b2117] border-y border-[#e6dfcb] dark:border-[#323d2b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pb-12">
            <div className="space-y-4 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-[#9a6423] dark:text-[#f0be7c] px-3 py-1 rounded-full bg-[#e0a861]/15 border border-[#e0a861]/30">
                Youth Mission Store
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-[#2c3324] dark:text-[#fefcf1]">
                Wear the Message
              </h2>
              <p className="text-lg text-[#5a634e] dark:text-[#a3ab98]">
                100% of merchandise proceeds go towards youth camp travel subsidies and study materials for island delegates.
              </p>
            </div>
            <Link href="/merch">
              <Button variant="outline" size="md" className="gap-2 rounded-full px-6 bg-white dark:bg-[#131710] hover:scale-105 transition-all">
                <span>View Full Store</span>
                <ArrowRight weight="bold" className="h-4 w-4" />
              </Button>
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="mb-10 p-4 rounded-2xl bg-[#fbf1e2] dark:bg-[#2b2315] border border-[#e0a861]/30 text-[#5c4936] dark:text-[#d4b896] flex items-start gap-4 shadow-xs">
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

      {/* 5. SCRIPTURAL CALL TO ACTION (Atmospheric Glowing Portal) */}
      <section className="bg-[#2c3324] text-[#fefcf1] py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#e0a861]/20 via-transparent to-transparent pointer-events-none" />
        <ScrollReveal className="relative max-w-4xl mx-auto px-4 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e0a861]/15 border border-[#e0a861]/30 text-xs font-bold text-[#e0a861]">
            <Heart weight="fill" className="h-4 w-4" />
            <span>Open to All Youth & Seekers of Truth</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#fefcf1] leading-tight">
            Are you a Christadelphian youth or looking to study the Bible?
          </h2>
          <p className="text-lg sm:text-xl text-[#f8f4e3]/80 max-w-2xl mx-auto font-light leading-relaxed">
            Whether you are baptized, unbaptized, or exploring the Scriptures as a friend,
            there is a place for you in the Philippine Christadelphian Youth Circle.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button variant="primary" size="lg" className="gap-2 bg-[#e0a861] text-[#2c3324] hover:bg-[#f0be7c] hover:scale-105 transition-all rounded-full px-8 shadow-lg shadow-[#e0a861]/20">
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

