import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PriceTag } from '@/components/molecules/price-tag';
import { getCachedProductBySlug } from '@/lib/db/queries/cached';
import { getCurrentUserProfile } from '@/lib/db/queries/users';
import { ProductOrderForm } from '@/components/domain/merch/product-order-form';
import { ArrowLeft, ShoppingBag, QrCode, Truck, ShieldCheck, Edit3, UserCheck, LogIn } from 'lucide-react';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getCachedProductBySlug(slug);

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
  const product = await getCachedProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const profile = await getCurrentUserProfile();

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
            <div className="lg:col-span-6 space-y-6">
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

              {/* Product Info & Highlights */}
              <div className="p-6 rounded-2xl bg-white border border-[#e6dfcb] space-y-4 shadow-2xs">
                <div className="flex items-center gap-2">
                  <Badge variant="gold" size="sm">
                    {product.category}
                  </Badge>
                  {product.isAvailable ? (
                    <Badge variant="success" size="sm">
                      Available
                    </Badge>
                  ) : (
                    <Badge variant="cream" size="sm">
                      Made-to-Order
                    </Badge>
                  )}
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2c3324]">
                  {product.name}
                </h1>
                <PriceTag price={product.price} className="text-2xl" />

                <div className="border-t border-[#e6dfcb] pt-4">
                  <p className="text-xs sm:text-sm text-[#505748] leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Available Sizes List */}
                {sizes.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-xs font-bold text-[#2c3324] uppercase tracking-wider block">
                      Manufactured Sizes
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {sizes.map((sz) => (
                        <span
                          key={sz}
                          className="px-3 py-1 rounded-lg text-xs font-medium bg-[#f8f4e3] text-[#2c3324] border border-[#e6dfcb]"
                        >
                          {sz}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Logistics Badges */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#e6dfcb] text-xs text-[#505748]">
                  <div className="flex items-center gap-2">
                    <QrCode className="h-4 w-4 text-[#e0a861] shrink-0" />
                    <span>GCash Direct Verification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-[#e0a861] shrink-0" />
                    <span>Camp Pickup or Courier</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Ordering / Role Segregation Container */}
            <div className="lg:col-span-6">
              {profile && (profile.role === 'ADMIN' || profile.role === 'SUPERADMIN') ? (
                /* Admin View: CMS Controls instead of Member Ordering */
                <div className="p-8 rounded-3xl bg-[#f8f4e3] border border-[#e6dfcb] space-y-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#2c3324] text-[#e0a861] flex items-center justify-center">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#2c3324]">
                        Administrator CMS Access
                      </h3>
                      <p className="text-xs text-[#707666]">
                        Logged in as {profile.email} ({profile.role})
                      </p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#505748] leading-relaxed">
                    Administrators have elevated management privileges. To edit this product&apos;s details, update available sizing, or manage inventory, use the Admin CMS.
                  </p>

                  <div className="flex flex-col gap-3 pt-2">
                    <Link href={`/admin/merch/${product.id}/edit`}>
                      <Button variant="primary" size="lg" className="w-full gap-2 shadow-sm">
                        <Edit3 className="h-4 w-4" />
                        <span>Edit This Product & Sizes</span>
                      </Button>
                    </Link>
                    <Link href="/admin/orders">
                      <Button variant="outline" size="md" className="w-full gap-2">
                        <span>View Orders & Receipts Queue</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : profile ? (
                /* Authenticated Member View: Full Interactive Order Form */
                <ProductOrderForm product={product} user={profile} />
              ) : (
                /* Guest View: Sign In / Register Prompt */
                <div className="p-8 rounded-3xl bg-[#f8f4e3] border border-[#e6dfcb] space-y-6 shadow-sm text-center">
                  <div className="h-14 w-14 rounded-2xl bg-[#2c3324] text-[#e0a861] mx-auto flex items-center justify-center shadow-md">
                    <ShoppingBag className="h-7 w-7" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl font-bold text-[#2c3324]">
                      Sign In to Order
                    </h3>
                    <p className="text-xs sm:text-sm text-[#505748] max-w-sm mx-auto">
                      Please log in with your PCYC member account to select your size, choose event pickup or delivery, and upload your payment proof.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <Link href={`/login?redirectTo=/merch/${product.slug}`} className="block w-full">
                      <Button variant="primary" size="lg" className="w-full gap-2 shadow-md">
                        <LogIn className="h-4 w-4" />
                        <span>Sign In to Place Order</span>
                      </Button>
                    </Link>

                    <Link href="/register" className="block w-full">
                      <Button variant="outline" size="lg" className="w-full gap-2">
                        <UserCheck className="h-4 w-4" />
                        <span>Create PCYC Member Account</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
