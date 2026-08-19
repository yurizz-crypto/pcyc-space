import React from 'react';
import { ProductGrid } from '@/components/domain/merch/product-grid';
import { getCachedAvailableProducts } from '@/lib/db/queries/cached';
import { QrCode, Sparkle, WarningCircle, Clock } from '@phosphor-icons/react/dist/ssr';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

import { HeroGlow } from '@/components/ui/hero-glow';

export const metadata = {
  title: 'PCYC Merchandise & Apparel',
  description:
    'Wear the message of hope and support our annual youth camps. 100% of proceeds go directly towards subsidizing fellowship events and youth ministry.',
};

export default async function MerchPage() {
  const products = await getCachedAvailableProducts();

  return (
    <div className="flex flex-col w-full">
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
      <section className="relative bg-[#f8f4e3] dark:bg-[#1b2117] py-24 sm:py-32 border-b border-[#e6dfcb] dark:border-[#323d2b] overflow-hidden">
        <HeroGlow />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal className="space-y-6">
              <span className="font-bold text-[#e0a861] uppercase tracking-widest text-sm sm:text-base">
                Fundraising Store
              </span>
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-[#2c3324] dark:text-[#fefcf1] leading-tight">
                Wear the <br /> Message.
              </h1>
              <p className="text-lg sm:text-xl text-[#5a634e] dark:text-[#a3ab98] leading-relaxed max-w-md">
                100% of proceeds go directly towards subsidizing fellowship events, travel costs for island delegates, and youth ministry.
              </p>
            </ScrollReveal>
            
            {/* Elegant Ticket-like Payment Notice */}
            <ScrollReveal delay={0.1} className="lg:justify-self-end w-full max-w-md">
              <div className="relative bg-white dark:bg-[#131710] border border-[#e6dfcb] dark:border-[#323d2b] p-8 rounded-[2rem] shadow-sm">
                {/* Decorative Ticket Cutouts */}
                <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 bg-[#f8f4e3] dark:bg-[#1b2117] rounded-full border-r border-[#e6dfcb] dark:border-[#323d2b]" />
                <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 bg-[#f8f4e3] dark:bg-[#1b2117] rounded-full border-l border-[#e6dfcb] dark:border-[#323d2b]" />
                
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="h-16 w-16 rounded-full bg-[#2c3324] dark:bg-[#e0a861] flex items-center justify-center text-[#e0a861] dark:text-[#131710] shadow-inner">
                    <QrCode weight="duotone" className="h-8 w-8" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-serif font-bold text-2xl text-[#2c3324] dark:text-[#fefcf1]">
                      Zero-Fee Payment
                    </h3>
                    <p className="text-sm text-[#707666] dark:text-[#a3ab98] leading-relaxed">
                      To keep our merchandise prices low and completely fee-free, orders are paid directly via <strong className="text-[#2c3324] dark:text-[#fefcf1]">GCash</strong> (0912-734-1648, Yuri S.).
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#9a6423] dark:text-[#f0be7c] bg-[#fbf1e2] dark:bg-[#2b2315] px-4 py-2 rounded-full border border-[#e0a861]/30">
                    <Sparkle weight="fill" className="h-4 w-4" />
                    <span>100% Volunteer Managed</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Product Grid Section */}
      <section className="py-24 bg-[#fefcf1] dark:bg-[#131710]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <ProductGrid
              products={products}
              emptyTitle="Merch Catalog Updating"
              emptyDescription="We're currently designing the next batch of apparel and study accessories. Please check back later!"
            />
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
