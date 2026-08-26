import React from 'react';
import { ProductGrid } from '@/components/domain/merch/product-grid';
import { FundraisingImpactCalculator } from '@/components/merch/fundraising-impact-calculator';
import { MerchStepGuide } from '@/components/merch/merch-step-guide';
import { getCachedAvailableProducts } from '@/lib/db/queries/cached';
import { QrCode, Sparkle, WarningCircle, Clock, ShoppingBag, ShieldCheck, Heart } from '@phosphor-icons/react/dist/ssr';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { InteractiveCard } from '@/components/ui/interactive-card';
import { HeroGlow } from '@/components/ui/hero-glow';

export const metadata = {
  title: 'PCYC Merchandise & Apparel',
  description:
    'Wear the message of hope and support our annual youth camps. 100% of proceeds go directly towards subsidizing fellowship events and youth ministry.',
};

export default async function MerchPage() {
  const products = await getCachedAvailableProducts();

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Editorial Testing Notice */}
      <div className="w-full bg-[#fbf1e2] dark:bg-[#2b2315] border-b border-[#e0a861]/40 text-[#422e1b] dark:text-[#f0be7c] py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs sm:text-sm">
          <div className="flex items-center gap-3">
            <WarningCircle weight="fill" className="h-4 w-4 text-[#9a6423] dark:text-[#e0a861] shrink-0" />
            <span>
              <strong className="text-[#2c3324] dark:text-[#fefcf1] font-semibold tracking-wide uppercase mr-1">Preview Mode:</strong>
              Merchandise catalog is in preview mode. Checkout is temporarily disabled.
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 font-medium text-[#9a6423] dark:text-[#f0be7c] shrink-0 uppercase tracking-widest text-[10px] sm:text-xs">
            <Clock weight="bold" className="h-3.5 w-3.5" />
            <span>Store Opening Soon</span>
          </div>
        </div>
      </div>

      {/* Boutique E-Commerce Header */}
      <section className="relative bg-[#f8f4e3] dark:bg-[#1b2117] py-28 sm:py-36 border-b border-[#e6dfcb] dark:border-[#323d2b] overflow-hidden">
        <HeroGlow />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <ScrollReveal className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e0a861]/20 border border-[#e0a861]/40 text-xs font-bold text-[#9a6423] dark:text-[#f0be7c]">
                <ShoppingBag weight="fill" className="h-3.5 w-3.5" />
                <span>PCYC Youth Mission Fundraising Store</span>
              </div>
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-[#2c3324] dark:text-[#fefcf1] leading-[1.08] tracking-tight">
                Wear the <br />
                <span className="text-[#e0a861] italic shimmer-text">Message.</span>
              </h1>
              <p className="text-lg sm:text-xl text-[#5a634e] dark:text-[#a3ab98] leading-relaxed max-w-lg font-light">
                100% of merchandise proceeds go directly towards subsidizing youth camps, inter-island travel fares for provincial delegates, and study materials.
              </p>
            </ScrollReveal>
            
            {/* Right Elegant Ticket-like GCash Card */}
            <ScrollReveal delay={0.15} className="lg:col-span-5 lg:justify-self-end w-full max-w-md">
              <InteractiveCard className="relative bg-white dark:bg-[#131710] border border-[#e6dfcb] dark:border-[#323d2b] p-8 sm:p-9 rounded-[2.5rem] shadow-xl">
                {/* Decorative Ticket Cutouts */}
                <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 bg-[#f8f4e3] dark:bg-[#1b2117] rounded-full border-r border-[#e6dfcb] dark:border-[#323d2b]" />
                <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 bg-[#f8f4e3] dark:bg-[#1b2117] rounded-full border-l border-[#e6dfcb] dark:border-[#323d2b]" />
                
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="h-16 w-16 rounded-2xl bg-[#2c3324] dark:bg-[#e0a861] flex items-center justify-center text-[#e0a861] dark:text-[#131710] shadow-md">
                    <QrCode weight="duotone" className="h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif font-bold text-2xl text-[#2c3324] dark:text-[#fefcf1]">
                      Zero-Fee Payment
                    </h3>
                    <p className="text-xs sm:text-sm text-[#707666] dark:text-[#a3ab98] leading-relaxed">
                      To keep prices accessible and completely fee-free, orders are paid directly via <strong className="text-[#2c3324] dark:text-[#fefcf1]">GCash</strong> (0912-734-1648, Yuri S.).
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#9a6423] dark:text-[#f0be7c] bg-[#fbf1e2] dark:bg-[#2b2315] px-4 py-2 rounded-full border border-[#e0a861]/30 shadow-xs">
                    <Sparkle weight="fill" className="h-3.5 w-3.5" />
                    <span>100% Volunteer Managed</span>
                  </div>
                </div>
              </InteractiveCard>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* Interactive Fundraising Impact Calculator Section */}
      <section className="py-20 bg-[#fefcf1] dark:bg-[#131710]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <FundraisingImpactCalculator />
          </ScrollReveal>
        </div>
      </section>

      {/* Product Grid Section */}
      <section className="py-24 bg-[#fefcf1] dark:bg-[#131710]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <ScrollReveal className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#9a6423] dark:text-[#f0be7c] px-3 py-1 rounded-full bg-[#e0a861]/15 border border-[#e0a861]/30">
              Official Collection
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#2c3324] dark:text-[#fefcf1]">
              Apparel & Study Essentials
            </h2>
            <p className="text-sm sm:text-base text-[#707666] dark:text-[#a3ab98] max-w-xl">
              Quality shirts, tote bags, hoodies, and scripture accessories designed for fellowship and daily life.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <ProductGrid
              products={products}
              emptyTitle="Merch Catalog Updating"
              emptyDescription="We're currently designing the next batch of apparel and study accessories. Please check back later!"
            />
          </ScrollReveal>
        </div>
      </section>

      {/* How Ordering Works (Step-by-step Guide) */}
      <section className="py-28 bg-[#f8f4e3] dark:bg-[#1b2117] border-t border-[#e6dfcb] dark:border-[#323d2b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MerchStepGuide />
        </div>
      </section>
    </div>
  );
}

