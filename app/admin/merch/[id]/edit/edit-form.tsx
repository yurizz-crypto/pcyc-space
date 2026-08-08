'use client';

import React, { useActionState, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';
import { SizeSelector } from '@/components/domain/merch/size-selector';
import { updateProductAction, AdminProductActionState } from '@/app/actions/products';
import { type Product } from '@/lib/db/schema/products';
import { ShoppingBag, AlertCircle, Save, Wand2 } from 'lucide-react';

const initialState: AdminProductActionState = {
  success: false,
};

interface EditMerchFormProps {
  product: Product;
}

export function EditMerchForm({ product }: EditMerchFormProps) {
  const [state, formAction, isPending] = useActionState(updateProductAction, initialState);
  const [name, setName] = useState(product.name);
  const [slug, setSlug] = useState(product.slug);
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

  // Auto-fill URL slug from Name
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

  const currentImg =
    product.imageUrls && product.imageUrls.length > 0
      ? product.imageUrls[0]
      : '/images/logo/pcyc-transparent-logo.png';

  return (
    <Card className="shadow-md">
      <form action={formAction}>
        <input type="hidden" name="productId" value={product.id} />
        <input type="hidden" name="existingImageUrl" value={currentImg} />

        <CardHeader className="border-b border-[#e6dfcb] dark:border-[#323d2b] pb-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[#e0a861]" />
            <CardTitle className="text-xl">Edit Merchandise: {product.name}</CardTitle>
          </div>
          <CardDescription>
            Update pricing, stock levels, category, or product photos.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 pt-6">
          {state?.error && (
            <div className="p-3.5 rounded-xl bg-[#fdf2f2] dark:bg-[#2d1815] border border-[#f5c6cb] dark:border-[#4d201b] text-[#c0392b] dark:text-[#ef5350] text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          {/* 1. Name & URL Slug */}
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
                <label className="block text-xs font-semibold text-[#2c3324] dark:text-[#fefcf1] uppercase tracking-wider">
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

          {/* 2. Existing Image Preview & Device Image Attachment */}
          <div className="space-y-3">
            {currentImg && (
              <div className="p-3 rounded-xl bg-[#f8f4e3] dark:bg-[#252e1f] border border-[#e6dfcb] dark:border-[#323d2b] flex items-center gap-4">
                <div className="relative h-16 w-16 rounded-lg overflow-hidden border border-[#e6dfcb] dark:border-[#323d2b] bg-white dark:bg-[#131710] shrink-0">
                  <Image
                    src={currentImg}
                    alt="Current Product Image"
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div className="text-xs space-y-0.5">
                  <strong className="block text-[#2c3324] dark:text-[#fefcf1]">Current Product Photo</strong>
                  <p className="text-[#707666] dark:text-[#a3ab98]">Upload a new image below if you wish to replace it.</p>
                </div>
              </div>
            )}

            <ImageUpload
              name="imageFile"
              label="Replace Product Image (Optional)"
              helperText="Attach product photo from device • Max 5MB • PNG or JPG/JPEG format"
              error={state?.fieldErrors?.imageUrls?.[0]}
            />
          </div>

          {/* 3. Category & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Category"
              name="category"
              defaultValue={product.category}
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
              defaultValue={product.price}
              placeholder="450"
              required
              error={state?.fieldErrors?.price?.[0]}
            />
          </div>

          {/* 4. Description */}
          <Textarea
            label="Product Description & Material Specs"
            name="description"
            defaultValue={product.description}
            placeholder="Describe the fabric quality, sizing details, inspiration..."
            required
            rows={4}
            error={state?.fieldErrors?.description?.[0]}
          />

          {/* 5. Available Sizes */}
          <SizeSelector initialSizes={product.availableSizes || ['XS', 'S', 'M', 'L', 'XL', '2XL']} />

          {/* 6. Stock Quantity */}
          <Input
            label="Current Stock Quantity"
            name="stockQuantity"
            type="number"
            defaultValue={String(product.stockQuantity)}
            placeholder="50"
            required
            error={state?.fieldErrors?.stockQuantity?.[0]}
          />

          {/* 6. Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#f8f4e3] dark:bg-[#252e1f] border border-[#e6dfcb] dark:border-[#323d2b] flex items-center justify-between">
              <div>
                <strong className="block text-xs text-[#2c3324] dark:text-[#fefcf1]">Available for Purchase</strong>
                <span className="text-[11px] text-[#707666] dark:text-[#a3ab98]">Display in public store.</span>
              </div>
              <input
                type="checkbox"
                name="isAvailable"
                defaultChecked={product.isAvailable}
                className="h-5 w-5 rounded border-[#e6dfcb] dark:border-[#323d2b] text-[#2c3324] dark:text-[#e0a861] focus:ring-[#e0a861]"
              />
            </div>

            <div className="p-4 rounded-xl bg-[#f8f4e3] dark:bg-[#252e1f] border border-[#e6dfcb] dark:border-[#323d2b] flex items-center justify-between">
              <div>
                <strong className="block text-xs text-[#2c3324] dark:text-[#fefcf1]">Pre-Order Item</strong>
                <span className="text-[11px] text-[#707666] dark:text-[#a3ab98]">Item will be made-to-order.</span>
              </div>
              <input
                type="checkbox"
                name="isPreorder"
                defaultChecked={product.isPreorder}
                className="h-5 w-5 rounded border-[#e6dfcb] dark:border-[#323d2b] text-[#2c3324] dark:text-[#e0a861] focus:ring-[#e0a861]"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-end gap-3 border-t border-[#e6dfcb] dark:border-[#323d2b] pt-4">
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
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
