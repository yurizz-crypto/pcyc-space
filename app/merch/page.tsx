import React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { ProductGrid } from '@/components/domain/merch/product-grid';
import { getCachedAvailableProducts } from '@/lib/db/queries/cached';
import { QrCode, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'PCYC Merchandise & Apparel',
  description:
    'Wear the message of hope and support our annual youth camps. 100% of proceeds go directly towards subsidizing fellowship events and youth ministry.',
};

export default async function MerchPage() {
  const products = await getCachedAvailableProducts();

  return (
    <div className="flex flex-col w-full">
      <PageHeader
        badge="Fundraising Store"
        title="PCYC Merchandise & Apparel"
        description="Wear the message of hope and support our annual youth camps. 100% of proceeds go directly towards subsidizing fellowship events and youth ministry."
      />

      <section className="py-12 sm:py-16 bg-[#fefcf1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Zero Fee / Manual GCash Banner */}
          <div className="p-6 rounded-2xl bg-[#f8f4e3] border border-[#e6dfcb] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-[#2c3324] text-[#e0a861] flex items-center justify-center shrink-0">
                <QrCode className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-base sm:text-lg text-[#2c3324]">
                  Zero-Fee Direct Community Payment
                </h4>
                <p className="text-xs sm:text-sm text-[#707666] max-w-2xl">
                  To keep our merchandise prices low and completely fee-free, orders are paid directly via{' '}
                  <strong className="text-[#2c3324]">GCash (0912-734-1648, Yuri S.)</strong>. Simply upload
                  your receipt screenshot upon ordering.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#9a6423] bg-[#fbf1e2] px-3.5 py-2 rounded-xl border border-[#e0a861]/30 whitespace-nowrap">
              <Sparkles className="h-3.5 w-3.5" />
              <span>100% Volunteer Managed</span>
            </div>
          </div>

          {/* Product Grid Organism */}
          <ProductGrid
            products={products}
            emptyTitle="Merch Catalog Updating"
            emptyDescription="There are currently no items in stock. Please check back later or reach out to the PCYC committee!"
          />
        </div>
      </section>
    </div>
  );
}
