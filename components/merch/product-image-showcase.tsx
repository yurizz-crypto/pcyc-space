'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { InteractiveCard } from '@/components/ui/interactive-card';
import { Sparkle, ShieldCheck, HandHeart, MagnifyingGlassPlus } from '@phosphor-icons/react';
import { Badge } from '@/components/ui/badge';

interface ProductImageShowcaseProps {
  imageUrls: string[];
  productName: string;
  isPreorder?: boolean;
  category: string;
}

export function ProductImageShowcase({
  imageUrls,
  productName,
  isPreorder,
  category,
}: ProductImageShowcaseProps) {
  const images = imageUrls && imageUrls.length > 0 ? imageUrls : ['/images/logo/pcyc-transparent-logo.png'];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main 3D Interactive Card Showcase */}
      <InteractiveCard className="relative aspect-square w-full rounded-[2.5rem] bg-[#f8f4e3] dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b] flex items-center justify-center overflow-hidden shadow-2xl group">
        {/* Atmospheric Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(224,168,97,0.18),transparent_70%)] pointer-events-none" />

        {/* Floating Category Badge */}
        <div className="absolute top-6 left-6 z-20 flex items-center gap-2">
          <Badge variant="cream" size="md" className="rounded-full shadow-md backdrop-blur-md">
            {category}
          </Badge>
          {isPreorder && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#fbf1e2] dark:bg-[#2b2315] text-[#9a6423] dark:text-[#f0be7c] border border-[#e0a861]/40 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#e0a861] animate-ping" />
              <span>Pre-Order</span>
            </span>
          )}
        </div>

        {/* Main Image with Animated Transition */}
        <div className="relative h-[75%] w-[75%] transition-transform duration-700 group-hover:scale-108">
          <AnimatePresence mode="wait">
            <motion.div
              key={images[selectedImageIndex]}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="relative w-full h-full"
            >
              <Image
                src={images[selectedImageIndex]}
                alt={productName}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain drop-shadow-2xl"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Floating Guarantee Pill */}
        <div className="absolute bottom-6 inset-x-6 z-20 flex items-center justify-between text-xs text-[#707666] dark:text-[#a3ab98] pointer-events-none">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-md border border-[#e6dfcb] dark:border-[#323d2b] shadow-xs">
            <HandHeart weight="duotone" className="h-3.5 w-3.5 text-[#e0a861]" />
            <span className="font-semibold text-[11px]">100% Proceeds to Youth Ministry</span>
          </div>
        </div>
      </InteractiveCard>

      {/* Multi-angle Thumbnails Carousel (if > 1 image) */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {images.map((img, idx) => {
            const isSelected = selectedImageIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative h-20 w-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-[#f8f4e3] dark:bg-[#1b2117] p-2 ${
                  isSelected
                    ? 'border-[#e0a861] ring-2 ring-[#e0a861]/40 scale-105 shadow-md'
                    : 'border-[#e6dfcb] dark:border-[#323d2b] opacity-70 hover:opacity-100'
                }`}
              >
                <Image src={img} alt={`${productName} thumbnail ${idx + 1}`} fill sizes="80px" className="object-contain p-2" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
