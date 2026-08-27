import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PriceTag } from '@/components/molecules/price-tag';
import { getCachedProductBySlug, getCachedProductRatingSummary, getCachedProductReviews } from '@/lib/db/queries/cached';
import { getCurrentUserProfile } from '@/lib/db/queries/users';
import { ProductOrderForm } from '@/components/domain/merch/product-order-form';
import { ProductReviewsSection } from '@/components/domain/reviews/product-reviews-section';
import { ProductImageShowcase } from '@/components/merch/product-image-showcase';
import { ProductSizeGuideModal } from '@/components/merch/product-size-guide-modal';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Tote, QrCode, Truck, ShieldCheck, PencilSimple, UserCirclePlus, SignIn, Sparkle, HandHeart, Package } from '@phosphor-icons/react/dist/ssr';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ui/scroll-reveal';
import { InteractiveCard } from '@/components/ui/interactive-card';

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

  const [profile, ratingSummary, reviews] = await Promise.all([
    getCurrentUserProfile(),
    getCachedProductRatingSummary(product.id),
    getCachedProductReviews(product.id),
  ]);

  const isAdmin = profile?.role === 'ADMIN' || profile?.role === 'SUPERADMIN';
  if (!product.isAvailable && !isAdmin) {
    notFound();
  }

  const sizes = (product.availableSizes as string[]) || [];

  return (
    <div className="flex flex-col w-full bg-[#fefcf1] dark:bg-[#131710] min-h-screen overflow-hidden">
      {/* Top Navigation Strip */}
      <div className="bg-[#f8f4e3] dark:bg-[#1b2117] py-4 border-b border-[#e6dfcb] dark:border-[#323d2b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/merch"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#2c3324] dark:text-[#fefcf1] hover:text-[#9a6423] dark:hover:text-[#f0be7c] transition-colors"
          >
            <ArrowLeft weight="bold" className="h-3.5 w-3.5" />
            <span>Store Catalog & Youth Ministry Fund</span>
          </Link>
        </div>
      </div>

      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-start">
            
            {/* Left Product Presentation (Showcase & Details) */}
            <div className="lg:col-span-6 space-y-10">
              
              {/* Interactive 3D Image Showcase */}
              <ScrollReveal>
                <ProductImageShowcase
                  imageUrls={product.imageUrls as string[]}
                  productName={product.name}
                  isPreorder={product.isPreorder}
                  category={product.category}
                />
              </ScrollReveal>

              {/* Product Info & Highlights */}
              <ScrollReveal delay={0.1} className="space-y-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Badge variant="gold" size="md">
                      {product.category}
                    </Badge>
                    {product.isAvailable ? (
                      <Badge variant="success" size="md">
                        Available for Orders
                      </Badge>
                    ) : (
                      <Badge variant="cream" size="md">
                        Made-to-Order Batch
                      </Badge>
                    )}
                  </div>
                  
                  <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2c3324] dark:text-[#fefcf1] leading-[1.15]">
                    {product.name}
                  </h1>
                  
                  <div className="flex items-baseline gap-3">
                    <PriceTag price={product.price} className="text-3xl sm:text-4xl text-[#9a6423] dark:text-[#f0be7c] font-serif font-bold" />
                    <span className="text-xs text-[#707666] dark:text-[#a3ab98] font-medium">
                      (100% Proceeds Support PCYC Events)
                    </span>
                  </div>
                </div>

                {/* Description Markdown */}
                <div className="border-t border-[#e6dfcb] dark:border-[#323d2b] pt-6">
                  <div className="prose prose-sm sm:prose-base dark:prose-invert prose-p:leading-relaxed prose-li:my-1 text-[#5a634e] dark:text-[#a3ab98] font-serif">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {product.description}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* 3D Bento Features Pods */}
                <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  
                  {/* Mission Impact Pod */}
                  <StaggerItem>
                    <InteractiveCard className="h-full p-5 rounded-3xl bg-white dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b] shadow-xs hover:border-[#e0a861]/60 transition-all space-y-2">
                      <div className="h-10 w-10 rounded-2xl bg-[#fbf1e2] dark:bg-[#252e1f] text-[#e0a861] flex items-center justify-center shadow-xs">
                        <HandHeart weight="duotone" className="h-5 w-5 text-[#9a6423] dark:text-[#f0be7c]" />
                      </div>
                      <strong className="block font-serif text-base text-[#2c3324] dark:text-[#fefcf1]">
                        100% Mission Funded
                      </strong>
                      <p className="text-xs text-[#707666] dark:text-[#a3ab98] leading-relaxed">
                        Every purchase directly subsidizes boat & bus fares for provincial youth delegates.
                      </p>
                    </InteractiveCard>
                  </StaggerItem>

                  {/* Fulfillment Pod */}
                  <StaggerItem>
                    <InteractiveCard className="h-full p-5 rounded-3xl bg-white dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b] shadow-xs hover:border-[#e0a861]/60 transition-all space-y-2">
                      <div className="h-10 w-10 rounded-2xl bg-[#fbf1e2] dark:bg-[#252e1f] text-[#e0a861] flex items-center justify-center shadow-xs">
                        <Truck weight="duotone" className="h-5 w-5 text-[#9a6423] dark:text-[#f0be7c]" />
                      </div>
                      <strong className="block font-serif text-base text-[#2c3324] dark:text-[#fefcf1]">
                        Camp Pickup or Door Ship
                      </strong>
                      <p className="text-xs text-[#707666] dark:text-[#a3ab98] leading-relaxed">
                        Free pickup at nationwide camp check-in, or door-to-door courier anywhere in PH.
                      </p>
                    </InteractiveCard>
                  </StaggerItem>

                </StaggerContainer>
              </ScrollReveal>
            </div>

            {/* Right Ordering Panel (Sticky) */}
            <div className="lg:col-span-6">
              <ScrollReveal delay={0.2} className="sticky top-24">
                {profile && (profile.role === 'ADMIN' || profile.role === 'SUPERADMIN') ? (
                  /* Admin View */
                  <div className="p-8 sm:p-10 rounded-[2.5rem] bg-[#f8f4e3] dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b] space-y-8 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-[#2c3324] text-[#e0a861] flex items-center justify-center shadow-md">
                        <ShieldCheck weight="duotone" className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-serif text-2xl font-bold text-[#2c3324] dark:text-[#fefcf1]">
                          Admin Product CMS
                        </h3>
                        <p className="text-xs text-[#707666] dark:text-[#a3ab98]">
                          Logged in as {profile.email}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-[#5a634e] dark:text-[#a3ab98] leading-relaxed">
                      You are previewing this product as an administrator. To purchase this item for yourself, please use a standard member account.
                    </p>

                    <div className="flex flex-col gap-3">
                      <Link href={`/admin/merch/${product.id}/edit`}>
                        <Button variant="primary" size="lg" className="w-full gap-2 rounded-full py-5 text-sm shadow-md">
                          <PencilSimple weight="bold" className="h-4 w-4" />
                          <span>Edit Product Listing</span>
                        </Button>
                      </Link>
                      <Link href="/admin/orders">
                        <Button variant="outline" size="lg" className="w-full gap-2 rounded-full py-5 text-sm">
                          <span>View Orders Dashboard</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : profile ? (
                  /* Authenticated Member View */
                  <div className="rounded-[2.5rem] bg-white dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b] shadow-2xl shadow-[#e0a861]/10 overflow-hidden">
                    <ProductOrderForm product={product} user={profile} />
                  </div>
                ) : (
                  /* Guest View */
                  <div className="p-8 sm:p-10 rounded-[2.5rem] bg-[#f8f4e3] dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b] shadow-xl text-center space-y-6">
                    <div className="h-16 w-16 rounded-2xl bg-[#2c3324] text-[#e0a861] mx-auto flex items-center justify-center shadow-lg">
                      <Tote weight="duotone" className="h-8 w-8" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2c3324] dark:text-[#fefcf1]">
                        Member Checkout
                      </h3>
                      <p className="text-xs text-[#5a634e] dark:text-[#a3ab98] max-w-sm mx-auto leading-relaxed">
                        Please sign in with your PCYC member account to choose sizes, pick delivery options, and submit GCash verification.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                      <Link href={`/login?redirectTo=/merch/${product.slug}`} className="w-full">
                        <Button variant="primary" size="lg" className="w-full gap-2 rounded-full py-5 shadow-md bg-[#2c3324] text-white hover:bg-[#3d4632] dark:bg-[#e0a861] dark:text-[#131710]">
                          <SignIn weight="bold" className="h-4 w-4" />
                          <span className="text-sm">Sign In to Order</span>
                        </Button>
                      </Link>

                      <Link href="/register" className="w-full">
                        <Button variant="outline" size="lg" className="w-full gap-2 rounded-full py-5">
                          <UserCirclePlus weight="bold" className="h-4 w-4" />
                          <span className="text-sm">Register New Account</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </ScrollReveal>
            </div>
          </div>

          {/* Product Ratings & Verified Customer Reviews Section */}
          <ProductReviewsSection
            productId={product.id}
            productName={product.name}
            ratingSummary={ratingSummary}
            reviews={reviews}
            isAuthenticated={!!profile}
          />
        </div>
      </section>
    </div>
  );
}

