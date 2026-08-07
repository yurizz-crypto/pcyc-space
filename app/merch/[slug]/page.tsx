import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PriceTag } from '@/components/molecules/price-tag';
import { getProductBySlug } from '@/lib/db/queries/products';
import { ArrowLeft, ShoppingBag, QrCode, Truck } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: 'Product Not Found — PCYC Space' };
  }

  return {
    title: `${product.name} — PCYC Space Merch`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const primaryImage =
    product.imageUrls && product.imageUrls.length > 0
      ? product.imageUrls[0]
      : '/images/logo/pcyc-transparent-logo.png';

  const sizes = (product.availableSizes as string[]) || [];

  return (
    <div className="flex flex-col w-full">
      {/* Top Breadcrumb */}
      <div className="bg-[#2c3324] text-[#fefcf1] py-4 border-b border-[#3d4632]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/merch"
            className="inline-flex items-center gap-2 text-xs text-[#e0a861] hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Merch Store</span>
          </Link>
        </div>
      </div>

      <section className="py-12 sm:py-16 bg-[#fefcf1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Product Image Gallery */}
            <div className="lg:col-span-6">
              <div className="relative aspect-square w-full rounded-3xl bg-[#f8f4e3] border border-[#e6dfcb] p-12 flex items-center justify-center overflow-hidden shadow-sm">
                <div className="relative h-72 w-72 sm:h-96 sm:w-96">
                  <Image
                    src={primaryImage}
                    alt={product.name}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                {product.isPreorder && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="warning" size="md">
                      Pre-Order
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Right Product Options & Purchase */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <Badge variant="gold" size="sm">
                  {product.category}
                </Badge>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2c3324]">
                  {product.name}
                </h1>
                <div className="pt-1">
                  <PriceTag price={product.price} className="text-2xl" />
                </div>
              </div>

              <div className="border-t border-b border-[#e6dfcb] py-4">
                <p className="text-sm sm:text-base text-[#505748] leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Sizes Display */}
              {sizes.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#2c3324]">
                    Available Sizes
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((sz) => (
                      <span
                        key={sz}
                        className="h-10 min-w-12 px-3 rounded-xl text-xs font-semibold flex items-center justify-center bg-white text-[#2c3324] border border-[#e6dfcb]"
                      >
                        {sz}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div className="space-y-1">
                <span className="text-xs text-[#707666]">
                  Available stock: <strong className="text-[#2c3324]">{product.stockQuantity} units</strong>
                </span>
              </div>

              {/* Purchase Call to Action */}
              <div className="space-y-4 pt-2">
                <Link href="/register" className="block w-full">
                  <Button variant="primary" size="lg" className="w-full gap-2 shadow-lg">
                    <ShoppingBag className="h-5 w-5" />
                    <span>Order via Member Portal</span>
                  </Button>
                </Link>
                <p className="text-[11px] text-center text-[#8a9180]">
                  Log in or register to submit your order and attach GCash payment receipt.
                </p>
              </div>

              {/* Direct Community Payment Info */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#e6dfcb] text-xs text-[#505748]">
                <div className="flex items-center gap-2">
                  <QrCode className="h-4 w-4 text-[#e0a861]" />
                  <span>GCash Direct Payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-[#e0a861]" />
                  <span>Nationwide Distribution</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
