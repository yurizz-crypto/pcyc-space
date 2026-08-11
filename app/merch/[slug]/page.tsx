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
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Tote, QrCode, Truck, ShieldCheck, PencilSimple, UserCirclePlus, SignIn } from '@phosphor-icons/react/dist/ssr';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ui/scroll-reveal';

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
    <div className="flex flex-col w-full bg-[#fefcf1] dark:bg-[#131710] min-h-screen">
      {/* Top Navigation Strip */}
      <div className="bg-[#f8f4e3] dark:bg-[#1b2117] py-4 border-b border-[#e6dfcb] dark:border-[#323d2b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/merch"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#2c3324] dark:text-[#fefcf1] hover:text-[#9a6423] dark:hover:text-[#f0be7c] transition-colors"
          >
            <ArrowLeft weight="bold" className="h-3.5 w-3.5" />
            <span>Store Catalog</span>
          </Link>
        </div>
      </div>

      <section className="py-12 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Product Presentation */}
            <div className="lg:col-span-6 space-y-12">
              <ScrollReveal>
                <div className="relative aspect-square w-full rounded-[2.5rem] bg-[#f8f4e3] dark:bg-[#1b2117] flex items-center justify-center overflow-hidden shadow-2xl">
                  {/* Atmospheric Glow */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent dark:from-[#2c3324]/20 pointer-events-none" />
                  
                  <div className="relative h-[70%] w-[70%] transition-transform duration-700 hover:scale-105">
                    <Image
                      src={primaryImage}
                      alt={product.name}
                      fill
                      className="object-contain drop-shadow-xl"
                      priority
                    />
                  </div>
                  
                  {product.isPreorder && (
                    <div className="absolute top-6 right-6">
                      <Badge variant="warning" size="lg" className="shadow-sm">
                        Pre-Order
                      </Badge>
                    </div>
                  )}
                </div>
              </ScrollReveal>

              {/* Product Info & Highlights */}
              <ScrollReveal delay={0.1} className="space-y-8">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="gold" size="md">
                      {product.category}
                    </Badge>
                    {product.isAvailable ? (
                      <Badge variant="success" size="md">
                        Available Now
                      </Badge>
                    ) : (
                      <Badge variant="cream" size="md">
                        Made-to-Order
                      </Badge>
                    )}
                  </div>
                  
                  <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2c3324] dark:text-[#fefcf1] leading-tight">
                    {product.name}
                  </h1>
                  
                  <PriceTag price={product.price} className="text-3xl text-[#9a6423] dark:text-[#e0a861]" />
                </div>

                <div className="border-t border-[#e6dfcb] dark:border-[#323d2b] pt-8">
                  <div className="prose prose-lg dark:prose-invert prose-p:leading-relaxed prose-li:my-1 text-[#5a634e] dark:text-[#a3ab98] font-serif">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {product.description}
                    </ReactMarkdown>
                  </div>
                </div>

                <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {/* Sizing Info */}
                  {sizes.length > 0 && (
                    <StaggerItem className="p-6 rounded-3xl bg-[#f8f4e3] dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b]">
                      <span className="text-xs font-bold text-[#2c3324] dark:text-[#fefcf1] uppercase tracking-wider block mb-4">
                        Available Sizes
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {sizes.map((sz) => (
                          <span
                            key={sz}
                            className="h-10 px-4 rounded-xl flex items-center justify-center text-sm font-bold bg-white dark:bg-[#131710] text-[#2c3324] dark:text-[#fefcf1] border border-[#e6dfcb] dark:border-[#3d4632] shadow-sm"
                          >
                            {sz}
                          </span>
                        ))}
                      </div>
                    </StaggerItem>
                  )}

                  {/* Logistics Badges */}
                  <StaggerItem className="p-6 rounded-3xl bg-white dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b] space-y-4">
                    <span className="text-xs font-bold text-[#2c3324] dark:text-[#fefcf1] uppercase tracking-wider block">
                      Fulfillment
                    </span>
                    <div className="space-y-3 text-sm text-[#5a634e] dark:text-[#a3ab98] font-medium">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-[#fbf1e2] dark:bg-[#252e1f] flex items-center justify-center">
                          <QrCode weight="duotone" className="h-4 w-4 text-[#9a6423] dark:text-[#e0a861]" />
                        </div>
                        <span>GCash Direct Payment</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-[#fbf1e2] dark:bg-[#252e1f] flex items-center justify-center">
                          <Truck weight="duotone" className="h-4 w-4 text-[#9a6423] dark:text-[#e0a861]" />
                        </div>
                        <span>Camp Pickup or Courier</span>
                      </div>
                    </div>
                  </StaggerItem>
                </StaggerContainer>
              </ScrollReveal>
            </div>

            {/* Right Ordering Panel (Sticky) */}
            <div className="lg:col-span-6">
              <ScrollReveal delay={0.2} className="sticky top-24">
                {profile && (profile.role === 'ADMIN' || profile.role === 'SUPERADMIN') ? (
                  /* Admin View */
                  <div className="p-10 rounded-[2rem] bg-[#f8f4e3] dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b] space-y-8 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-[#2c3324] text-[#e0a861] flex items-center justify-center shadow-md">
                        <ShieldCheck weight="duotone" className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-serif text-2xl font-bold text-[#2c3324] dark:text-[#fefcf1]">
                          Admin CMS
                        </h3>
                        <p className="text-sm text-[#707666] dark:text-[#a3ab98]">
                          {profile.email}
                        </p>
                      </div>
                    </div>

                    <p className="text-[#5a634e] dark:text-[#a3ab98] leading-relaxed">
                      You are viewing this product as an administrator. To purchase this item for yourself, please use a standard member account. Use the controls below to manage this listing.
                    </p>

                    <div className="flex flex-col gap-4">
                      <Link href={`/admin/merch/${product.id}/edit`}>
                        <Button variant="primary" size="lg" className="w-full gap-2 rounded-full py-6 text-base shadow-md">
                          <PencilSimple weight="bold" className="h-5 w-5" />
                          <span>Edit Product Details</span>
                        </Button>
                      </Link>
                      <Link href="/admin/orders">
                        <Button variant="outline" size="lg" className="w-full gap-2 rounded-full py-6 text-base">
                          <span>View Order Queue</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : profile ? (
                  /* Authenticated Member View */
                  <div className="p-10 rounded-[2rem] bg-white dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b] shadow-xl shadow-[#e0a861]/5">
                    <ProductOrderForm product={product} user={profile} />
                  </div>
                ) : (
                  /* Guest View */
                  <div className="p-10 rounded-[2rem] bg-[#f8f4e3] dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b] shadow-sm text-center space-y-8">
                    <div className="h-20 w-20 rounded-3xl bg-[#2c3324] text-[#e0a861] mx-auto flex items-center justify-center shadow-lg">
                      <Tote weight="duotone" className="h-10 w-10" />
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-serif text-3xl font-bold text-[#2c3324] dark:text-[#fefcf1]">
                        Member Checkout
                      </h3>
                      <p className="text-[#5a634e] dark:text-[#a3ab98] max-w-sm mx-auto leading-relaxed">
                        Please log in to your PCYC account to select your size, delivery options, and upload your proof of payment.
                      </p>
                    </div>

                    <div className="flex flex-col gap-4 pt-4">
                      <Link href={`/login?redirectTo=/merch/${product.slug}`} className="w-full">
                        <Button variant="primary" size="lg" className="w-full gap-2 rounded-full py-6 shadow-md bg-[#2c3324] text-white hover:bg-[#3d4632] dark:bg-[#e0a861] dark:text-[#131710] dark:hover:bg-[#ca914a]">
                          <SignIn weight="bold" className="h-5 w-5" />
                          <span className="text-base">Sign In to Continue</span>
                        </Button>
                      </Link>

                      <Link href="/register" className="w-full">
                        <Button variant="outline" size="lg" className="w-full gap-2 rounded-full py-6">
                          <UserCirclePlus weight="bold" className="h-5 w-5" />
                          <span className="text-base">Create an Account</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
