'use client';

import React, { useActionState, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';
import { SizeSelector } from '@/components/domain/merch/size-selector';
import { createProductAction, AdminProductActionState } from '@/app/actions/products';
import {
  ShoppingBag,
  ArrowLeft,
  AlertCircle,
  Sparkles,
  Wand2,
  Tag,
  Package,
  FileText,
  Info,
} from 'lucide-react';

const initialState: AdminProductActionState = {
  success: false,
};

export default function NewMerchProductPage() {
  const [state, formAction, isPending] = useActionState(createProductAction, initialState);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isManuallyEdited, setIsManuallyEdited] = useState(false);

  // Helper to generate clean URL slug
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Auto-fill URL slug from Product Name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!isManuallyEdited) {
      setSlug(generateSlug(val));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
    setIsManuallyEdited(true);
  };

  const handleRegenerateSlug = () => {
    setSlug(generateSlug(name));
    setIsManuallyEdited(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/merch"
          className="inline-flex items-center gap-1.5 text-xs text-[#505748] dark:text-[#a3ab98] hover:text-[#2c3324] dark:hover:text-[#fefcf1] font-semibold transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Merch Inventory</span>
        </Link>

        <span className="text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider bg-[#e0a861]/15 text-[#9a6423] dark:text-[#f0be7c] border border-[#e0a861]/30">
          PCYC Store CMS
        </span>
      </div>

      <Card className="shadow-xl rounded-3xl border border-[#e6dfcb] dark:border-[#323d2b] overflow-hidden bg-white dark:bg-[#1b2117]">
        <form action={formAction}>
          {/* Header Banner */}
          <CardHeader className="border-b border-[#e6dfcb] dark:border-[#323d2b] bg-[#f8f4e3]/60 dark:bg-[#252e1f]/60 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-[#2c3324] text-[#e0a861] flex items-center justify-center shadow-xs">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="font-serif text-2xl sm:text-3xl font-bold text-[#2c3324] dark:text-[#fefcf1]">
                  Add New Merchandise Item
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-[#707666] dark:text-[#a3ab98] mt-1">
                  List official apparel, stickers, drinkware, or tote bags to support PCYC camp travel subsidies.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 sm:p-8 space-y-8">
            {/* Global Validation Error */}
            {state?.error && (
              <div className="p-4 rounded-2xl bg-[#fdf2f2] dark:bg-[#2d1815] border border-[#f5c6cb] dark:border-[#4d201b] text-[#c0392b] dark:text-[#ef5350] text-xs sm:text-sm flex items-start gap-3 animate-shake">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <strong className="block font-bold">Incomplete Product Form</strong>
                  <span>{state.error}</span>
                </div>
              </div>
            )}

            {/* SECTION 1: PRODUCT BASICS */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-2 border-b border-[#e6dfcb]/60 dark:border-[#323d2b]/60">
                <Tag className="h-4 w-4 text-[#e0a861]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#2c3324] dark:text-[#fefcf1]">
                  1. Product Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Input
                    label="Product Name"
                    name="name"
                    value={name}
                    onChange={handleNameChange}
                    placeholder="e.g. PCYC Emblem Heavyweight Tee"
                    required
                    error={state?.fieldErrors?.name?.[0]}
                  />
                  <p className="text-[11px] text-[#707666] dark:text-[#a3ab98]">
                    Displayed on the storefront and receipt invoices.
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-[#2c3324] dark:text-[#fefcf1] uppercase tracking-wider">
                      URL Permanent Slug <span className="text-[#c0392b]">*</span>
                    </label>
                    {isManuallyEdited && (
                      <button
                        type="button"
                        onClick={handleRegenerateSlug}
                        className="inline-flex items-center gap-1 text-[11px] text-[#9a6423] dark:text-[#f0be7c] hover:underline font-bold"
                      >
                        <Wand2 className="h-3 w-3" />
                        <span>Auto-sync with Name</span>
                      </button>
                    )}
                  </div>
                  <Input
                    name="slug"
                    value={slug}
                    onChange={handleSlugChange}
                    placeholder="e.g. pcyc-emblem-heavyweight-tee"
                    required
                    error={state?.fieldErrors?.slug?.[0]}
                  />
                  <p className="text-[11px] text-[#707666] dark:text-[#a3ab98] truncate">
                    Link: <span className="font-mono text-[#9a6423] dark:text-[#f0be7c]">/merch/{slug || '...'}</span>
                  </p>
                </div>
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Select
                    label="Merchandise Category"
                    name="category"
                    defaultValue="Apparel"
                    options={[
                      { value: 'Apparel', label: '👕 Apparel (Shirts & Hoodies)' },
                      { value: 'Accessories', label: '🎒 Accessories (Totes, Caps, Bags)' },
                      { value: 'Stationery', label: '📖 Stationery & Scripture Notebooks' },
                      { value: 'Drinkware', label: '🥤 Drinkware & Flasks' },
                    ]}
                  />
                  <p className="text-[11px] text-[#707666] dark:text-[#a3ab98]">
                    Organizes products into catalog filters.
                  </p>
                </div>

                <div className="space-y-1">
                  <Input
                    label="Price in Philippine Pesos (₱ PHP)"
                    name="price"
                    type="number"
                    step="0.01"
                    min="1"
                    placeholder="450.00"
                    required
                    error={state?.fieldErrors?.price?.[0]}
                  />
                  <p className="text-[11px] text-[#707666] dark:text-[#a3ab98]">
                    Unit price paid via GCash (100% proceeds fund youth ministry).
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 2: PRODUCT PHOTO */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-2 border-b border-[#e6dfcb]/60 dark:border-[#323d2b]/60">
                <Sparkles className="h-4 w-4 text-[#e0a861]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#2c3324] dark:text-[#fefcf1]">
                  2. Product Photography
                </h3>
              </div>

              <ImageUpload
                name="imageFile"
                label="Attach Product Photo"
                helperText="Square 1:1 or 4:3 photo recommended • Clean solid or transparent background • Max 10MB"
                error={state?.fieldErrors?.imageUrls?.[0]}
              />
            </div>

            {/* SECTION 3: DESCRIPTION */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-2 border-b border-[#e6dfcb]/60 dark:border-[#323d2b]/60">
                <FileText className="h-4 w-4 text-[#e0a861]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#2c3324] dark:text-[#fefcf1]">
                  3. Description & Material Specifications
                </h3>
              </div>

              <div className="space-y-1.5">
                <Textarea
                  label="Product Story & Fabric Specs"
                  name="description"
                  placeholder="Describe fabric composition (e.g. 100% 220 GSM combed cotton), fit details (regular/oversized), spiritual design inspiration, care instructions..."
                  required
                  rows={5}
                  error={state?.fieldErrors?.description?.[0]}
                />
                <p className="text-[11px] text-[#707666] dark:text-[#a3ab98]">
                  Markdown is supported: use <strong>- bullet</strong> for lists, <strong>**bold**</strong> for emphasis.
                </p>
              </div>
            </div>

            {/* SECTION 4: SIZES */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-2 border-b border-[#e6dfcb]/60 dark:border-[#323d2b]/60">
                <Package className="h-4 w-4 text-[#e0a861]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#2c3324] dark:text-[#fefcf1]">
                  4. Available Manufactured Sizes
                </h3>
              </div>

              <SizeSelector initialSizes={['XS', 'S', 'M', 'L', 'XL', '2XL']} />
            </div>

            {/* SECTION 5: INVENTORY & VISIBILITY */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-2 border-b border-[#e6dfcb]/60 dark:border-[#323d2b]/60">
                <Info className="h-4 w-4 text-[#e0a861]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#2c3324] dark:text-[#fefcf1]">
                  5. Stock & Store Visibility
                </h3>
              </div>

              <div className="space-y-1">
                <Input
                  label="Initial Available Stock Quantity"
                  name="stockQuantity"
                  type="number"
                  min="0"
                  defaultValue="50"
                  placeholder="50"
                  required
                  error={state?.fieldErrors?.stockQuantity?.[0]}
                />
                <p className="text-[11px] text-[#707666] dark:text-[#a3ab98]">
                  Available inventory units. (If Pre-Order is enabled, members can still place orders when stock is 0).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#f8f4e3] dark:bg-[#252e1f] border border-[#e6dfcb] dark:border-[#323d2b] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <strong className="block text-xs font-bold text-[#2c3324] dark:text-[#fefcf1]">
                      Display in Public Store
                    </strong>
                    <span className="text-[11px] text-[#707666] dark:text-[#a3ab98] block">
                      When ON, product is visible in the online catalog.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    name="isAvailable"
                    defaultChecked
                    className="h-5 w-5 rounded-lg border-[#e6dfcb] dark:border-[#323d2b] text-[#2c3324] dark:text-[#e0a861] focus:ring-[#e0a861] cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-[#f8f4e3] dark:bg-[#252e1f] border border-[#e6dfcb] dark:border-[#323d2b] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <strong className="block text-xs font-bold text-[#2c3324] dark:text-[#fefcf1]">
                      Pre-Order Batch Mode
                    </strong>
                    <span className="text-[11px] text-[#707666] dark:text-[#a3ab98] block">
                      Item is made-to-order for upcoming camp.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    name="isPreorder"
                    className="h-5 w-5 rounded-lg border-[#e6dfcb] dark:border-[#323d2b] text-[#2c3324] dark:text-[#e0a861] focus:ring-[#e0a861] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </CardContent>

          {/* Form Action Footer */}
          <CardFooter className="flex items-center justify-between gap-4 border-t border-[#e6dfcb] dark:border-[#323d2b] bg-[#f8f4e3]/40 dark:bg-[#252e1f]/40 p-6 sm:p-8">
            <Link href="/admin/merch">
              <Button type="button" variant="outline" size="md" className="rounded-xl px-5">
                <span>Cancel</span>
              </Button>
            </Link>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isPending}
              className="gap-2 rounded-xl px-7 shadow-md font-bold text-sm"
            >
              <Sparkles className="h-4 w-4" />
              <span>Add to Inventory</span>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
