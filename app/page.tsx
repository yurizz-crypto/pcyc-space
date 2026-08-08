import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  ShoppingBag,
  ArrowRight,
  BookOpen,
  Users,
  Sparkles,
  AlertTriangle,
  Info,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EventGrid } from '@/components/domain/events/event-grid';
import { ProductGrid } from '@/components/domain/merch/product-grid';
import {
  getCachedPublishedEvents,
  getCachedAvailableProducts,
  getCachedEcclesiaCount,
  getCachedYouthAndFriendsCount,
} from '@/lib/db/queries/cached';

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
      <div className="w-full bg-[#fbf1e2] dark:bg-[#2b2315] border-b border-[#e0a861]/40 text-[#422e1b] dark:text-[#f0be7c] py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-[#e0a861]/20 dark:bg-[#e0a861]/15 flex items-center justify-center shrink-0 text-[#9a6423] dark:text-[#f0be7c]">
              <AlertTriangle className="h-4 w-4" />
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
            <Clock className="h-3.5 w-3.5" />
            <span>Full Launch Coming Soon</span>
          </div>
        </div>
      </div>

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-[#2c3324] text-[#fefcf1] py-16 sm:py-24 lg:py-32 border-b border-[#3d4632]">
        {/* Background Atmospheric Lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#e0a861]/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#e0a861]/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#e0a861]/30 backdrop-blur-xs">
                  <Sparkles className="h-4 w-4 text-[#e0a861]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#e0a861]">
                    Official Portal of PCYC
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e0a861]/20 border border-[#e0a861]/40 text-[#e0a861] text-xs font-medium">
                  <span>🚧 Preview & Testing Mode</span>
                </div>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#fefcf1] leading-[1.12]">
                United in Faith.{' '}
                <span className="text-[#e0a861] italic font-serif">Growing</span> in Christ.
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-[#f8f4e3]/85 max-w-2xl leading-relaxed">
                Welcome to the digital home of the{' '}
                <strong className="text-white font-semibold">
                  Philippine Christadelphian Youth Circle
                </strong>
                . We connect brothers, sisters, and friends across nationwide ecclesias
                through Bible study camps, fellowship, and faith-driven fundraising.
              </p>

              {/* Status Notice Callout Box */}
              <div className="p-4 rounded-2xl bg-white/5 border border-[#e0a861]/30 backdrop-blur-xs text-left">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-[#e0a861] shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm text-[#f8f4e3]/90 leading-relaxed">
                    <strong className="text-[#e0a861] font-semibold">Public Testing Preview:</strong> You
                    can browse upcoming camps and preview merchandise items. Registration and ordering features
                    will officially open upon committee announcement.
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link href="/events" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2 shadow-lg">
                    <Calendar className="h-5 w-5" />
                    <span>Explore Youth Camps</span>
                  </Button>
                </Link>
                <Link href="/merch" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto gap-2 border-white/30 text-[#fefcf1] hover:bg-white/10 hover:border-white/50"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    <span>Browse Merch Store</span>
                  </Button>
                </Link>
              </div>

              {/* Trust/Identity Highlights */}
              <div className="pt-6 border-t border-[#3d4632]/80 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <div className="font-serif font-bold text-2xl text-[#e0a861]">
                    {ecclesiaCount > 0 ? `${ecclesiaCount}+` : '0'}
                  </div>
                  <div className="text-xs text-[#f8f4e3]/70">Philippine Ecclesias</div>
                </div>
                <div>
                  <div className="font-serif font-bold text-2xl text-[#e0a861]">
                    {youthCount}+
                  </div>
                  <div className="text-xs text-[#f8f4e3]/70">Youth & Friends</div>
                </div>
                <div>
                  <div className="font-serif font-bold text-2xl text-[#e0a861]">100%</div>
                  <div className="text-xs text-[#f8f4e3]/70">Scripture-Rooted</div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden bg-gradient-to-b from-[#353d2c] to-[#22281c] border-2 border-[#e0a861]/40 shadow-2xl p-8 flex flex-col items-center justify-center text-center group">
                <div className="relative h-44 w-44 sm:h-52 sm:w-52 transition-transform duration-500 group-hover:scale-105">
                  <Image
                    src="/images/logo/pcyc-transparent-logo.png"
                    alt="PCYC Emblem"
                    fill
                    className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
                    priority
                  />
                </div>
                <div className="mt-6 space-y-1">
                  <span className="font-serif font-bold text-xl text-[#fefcf1]">
                    Philippine Christadelphian Youth Circle
                  </span>
                  <p className="text-xs text-[#e0a861] tracking-widest uppercase font-medium">
                    Est. for Fellowship & Faith
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PILLARS / MISSION SECTION */}
      <section className="py-20 bg-[#fefcf1] dark:bg-[#131710]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <Badge variant="gold" size="md">
              Our Core Purpose
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2c3324] dark:text-[#fefcf1]">
              What We Stand For in PCYC
            </h2>
            <p className="text-base sm:text-lg text-[#707666] dark:text-[#a3ab98]">
              PCYC is a Christ-centered brotherhood circle dedicated to encouraging one
              another in the truth of God’s Word until the return of our Lord.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="rounded-2xl border border-[#e6dfcb] dark:border-[#323d2b] bg-white dark:bg-[#1b2117] p-8 space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-2xl bg-[#fbf1e2] dark:bg-[#252e1f] text-[#e0a861] flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-[#9a6423] dark:text-[#f0be7c]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#2c3324] dark:text-[#fefcf1]">
                Faithful Bible Study
              </h3>
              <p className="text-sm text-[#707666] dark:text-[#a3ab98] leading-relaxed">
                We believe the Holy Scriptures are the inspired Word of God. Our camps
                and monthly circles focus on deep, practical study of Biblical truth and
                the Gospel of the Kingdom.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-2xl border border-[#e6dfcb] dark:border-[#323d2b] bg-white dark:bg-[#1b2117] p-8 space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-2xl bg-[#fbf1e2] dark:bg-[#252e1f] text-[#e0a861] flex items-center justify-center">
                <Users className="h-6 w-6 text-[#9a6423] dark:text-[#f0be7c]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#2c3324] dark:text-[#fefcf1]">
                Island-Wide Fellowship
              </h3>
              <p className="text-sm text-[#707666] dark:text-[#a3ab98] leading-relaxed">
                Uniting young believers across Luzon, Visayas, and Mindanao. We foster
                genuine, lifelong bonds of mutual encouragement, prayer, and hospitality.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-2xl border border-[#e6dfcb] dark:border-[#323d2b] bg-white dark:bg-[#1b2117] p-8 space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-2xl bg-[#fbf1e2] dark:bg-[#252e1f] text-[#e0a861] flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-[#9a6423] dark:text-[#f0be7c]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#2c3324] dark:text-[#fefcf1]">
                Ministry & Service
              </h3>
              <p className="text-sm text-[#707666] dark:text-[#a3ab98] leading-relaxed">
                Empowering the next generation of Christadelphians to serve in their
                local ecclesias, teach Sunday school, and support preaching the Gospel in the Philippines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED UPCOMING EVENTS (LIVE DB) */}
      <section className="py-20 bg-[#f8f4e3] dark:bg-[#1b2117] border-y border-[#e6dfcb] dark:border-[#323d2b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pb-8">
            <div className="space-y-2">
              <Badge variant="forest" size="md">
                Gatherings & Camps
              </Badge>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2c3324] dark:text-[#fefcf1]">
                Upcoming Youth Events
              </h2>
              <p className="text-sm sm:text-base text-[#707666] dark:text-[#a3ab98]">
                Mark your calendars and preview upcoming camp and fellowship schedules.
              </p>
            </div>
            <Link href="/events">
              <Button variant="outline" size="md" className="gap-2">
                <span>View All Events</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Testing Notice inside Events section */}
          <div className="mb-8 p-3.5 rounded-xl bg-amber-50/80 dark:bg-[#2b2315] border border-amber-200/80 dark:border-[#5c4936] text-amber-900 dark:text-amber-200 flex items-center gap-3 text-xs sm:text-sm">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong>Registration Notice:</strong> Camp registration is currently in testing mode and not yet accepting submissions. Dates and details are for preview purposes.
            </span>
          </div>

          <EventGrid
            events={featuredEvents}
            emptyTitle="New Camp Schedules Coming Soon"
            emptyDescription="PCYC youth committee is currently preparing the next upcoming national camp and study circles. Check back soon for registration dates!"
          />
        </div>
      </section>

      {/* 4. MERCHANDISE & FUNDRAISING HIGHLIGHT (LIVE DB) */}
      <section className="py-20 bg-[#fefcf1] dark:bg-[#131710]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pb-8">
            <div className="space-y-2">
              <Badge variant="gold" size="md">
                PCYC Merch Shop
              </Badge>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2c3324] dark:text-[#fefcf1]">
                Wear the Message. Support the Mission.
              </h2>
              <p className="text-sm sm:text-base text-[#707666] dark:text-[#a3ab98]">
                100% of merchandise proceeds go towards youth camp travel subsidies and study materials.
              </p>
            </div>
            <Link href="/merch">
              <Button variant="outline" size="md" className="gap-2">
                <span>View Full Store</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Testing Notice inside Merch section */}
          <div className="mb-8 p-3.5 rounded-xl bg-amber-50/80 dark:bg-[#2b2315] border border-amber-200/80 dark:border-[#5c4936] text-amber-900 dark:text-amber-200 flex items-center gap-3 text-xs sm:text-sm">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong>Store Preview Notice:</strong> Merchandise catalog is currently in preview mode. Checkout and order fulfillment are temporarily paused during website testing.
            </span>
          </div>

          <ProductGrid
            products={featuredProducts}
            emptyTitle="Merch Catalog Updating"
            emptyDescription="New PCYC apparel, camp shirts, and study accessories will be added shortly. Thank you for supporting our youth ministry!"
          />
        </div>
      </section>

      {/* 5. SCRIPTURAL CALL TO ACTION */}
      <section className="bg-[#2c3324] text-[#fefcf1] py-16 border-t border-[#3d4632] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#e0a861]/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 text-center space-y-6">
          <Badge variant="gold" size="md">
            Join the Brotherhood
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#fefcf1]">
            Are you a Christadelphian youth or looking to study the Bible?
          </h2>
          <p className="text-base sm:text-lg text-[#f8f4e3]/85 max-w-2xl mx-auto">
            Whether you are baptized, unbaptized, or exploring the Scriptures as a friend,
            there is a place for you in the Philippine Christadelphian Youth Circle.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button variant="primary" size="lg" className="gap-2">
                <Users className="h-5 w-5" />
                <span>Create Your PCYC Account</span>
              </Button>
            </Link>
            <Link href="/about">
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-[#fefcf1] hover:bg-white/10"
              >
                <span>Read About Our Faith</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
