'use client';

import React, { useActionState, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';
import { createProductAction, AdminProductActionState } from '@/app/actions/products';
import { ShoppingBag, ArrowLeft, AlertCircle, Sparkles, Wand2 } from 'lucide-react';

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
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/admin/merch"
        className="inline-flex items-center gap-1.5 text-xs text-[#505748] hover:text-[#2c3324] font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Merch Inventory</span>
      </Link>

      <Card className="border-[#e6dfcb] shadow-md">
        <form action={formAction}>
          <CardHeader className="border-b border-[#e6dfcb] pb-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-[#e0a861]" />
              <CardTitle className="text-xl">Add New Merchandise Item</CardTitle>
            </div>
            <CardDescription>
              List official apparel, stickers, or totes to support PCYC camp subsidies.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 pt-6">
            {state?.error && (
              <div className="p-3.5 rounded-xl bg-[#fdf2f2] border border-[#f5c6cb] text-[#c0392b] text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{state.error}</span>
              </div>
            )}

            {/* 1. Name & URL Slug (with Auto-Fill) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Product Name"
                name="name"
                value={name}
                onChange={handleNameChange}
                placeholder="e.g. PCYC Emblem Heavyweight Tee"
                required
                error={state?.fieldErrors?.name?.[0]}
              />

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-[#2c3324] uppercase tracking-wider">
                    URL Slug <span className="text-[#c0392b]">*</span>
                  </label>
                  {isManuallyEdited && (
                    <button
                      type="button"
                      onClick={handleRegenerateSlug}
                      className="inline-flex items-center gap-1 text-[11px] text-[#e0a861] hover:underline font-medium"
                    >
                      <Wand2 className="h-3 w-3" />
                      <span>Re-sync with Name</span>
                    </button>
                  )}
                </div>
                <Input
                  name="slug"
                  value={slug}
                  onChange={handleSlugChange}
                  placeholder="e.g. pcyc-emblem-heavyweight-tee"
                  required
                  helperText={slug ? `Preview: pcyc.ph/merch/${slug}` : 'Auto-filled as you type the name'}
                  error={state?.fieldErrors?.slug?.[0]}
                />
              </div>
            </div>

            {/* 2. Device Image Attachment */}
            <ImageUpload
              name="imageFile"
              label="Product Image"
              helperText="Attach product photo from device • Max 5MB • PNG or JPG/JPEG format"
              error={state?.fieldErrors?.imageUrls?.[0]}
            />

            {/* 3. Category & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Category"
                name="category"
                defaultValue="Apparel"
                options={[
                  { value: 'Apparel', label: 'Apparel (Shirts & Hoodies)' },
                  { value: 'Accessories', label: 'Accessories (Totes & Bags)' },
                  { value: 'Stationery', label: 'Stationery & Stickers' },
                  { value: 'Drinkware', label: 'Drinkware & Flasks' },
                ]}
              />

              <Input
                label="Price in Philippine Pesos (PHP)"
                name="price"
                type="number"
                step="0.01"
                placeholder="450"
                required
                error={state?.fieldErrors?.price?.[0]}
              />
            </div>

            {/* 4. Description */}
            <Textarea
              label="Product Description & Material Specs"
              name="description"
              placeholder="Describe the fabric quality, sizing details, inspiration..."
              required
              rows={4}
              error={state?.fieldErrors?.description?.[0]}
            />

            {/* 5. Stock Quantity */}
            <Input
              label="Initial Stock Quantity"
              name="stockQuantity"
              type="number"
              placeholder="50"
              required
              error={state?.fieldErrors?.stockQuantity?.[0]}
            />

            {/* 6. Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#f8f4e3] border border-[#e6dfcb] flex items-center justify-between">
                <div>
                  <strong className="block text-xs text-[#2c3324]">Available for Purchase</strong>
                  <span className="text-[11px] text-[#707666]">Display in public store.</span>
                </div>
                <input
                  type="checkbox"
                  name="isAvailable"
                  defaultChecked
                  className="h-5 w-5 rounded border-[#e6dfcb] text-[#2c3324] focus:ring-[#e0a861]"
                />
              </div>

              <div className="p-4 rounded-xl bg-[#f8f4e3] border border-[#e6dfcb] flex items-center justify-between">
                <div>
                  <strong className="block text-xs text-[#2c3324]">Pre-Order Item</strong>
                  <span className="text-[11px] text-[#707666]">Item will be made-to-order.</span>
                </div>
                <input
                  type="checkbox"
                  name="isPreorder"
                  className="h-5 w-5 rounded border-[#e6dfcb] text-[#2c3324] focus:ring-[#e0a861]"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-end gap-3 border-t border-[#e6dfcb] pt-4">
            <Link href="/admin/merch">
              <Button type="button" variant="outline" size="md">
                <span>Cancel</span>
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isPending}
              className="gap-2 shadow-xs"
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
