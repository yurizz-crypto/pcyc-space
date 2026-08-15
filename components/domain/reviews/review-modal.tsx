'use client';

import React, { useState, useActionState, useEffect } from 'react';
import Image from 'next/image';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  submitProductReviewAction,
  updateProductReviewAction,
  type ReviewActionResult,
} from '@/app/actions/reviews';
import type { ProductReview } from '@/lib/db/schema/reviews';
import { Star, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  productImageUrl?: string;
  orderId: string;
  orderNumber: string;
  existingReview?: ProductReview | null;
}

const initialState: ReviewActionResult = {
  success: false,
};

export function ReviewModal({
  isOpen,
  onClose,
  productId,
  productName,
  productImageUrl,
  orderId,
  orderNumber,
  existingReview,
}: ReviewModalProps) {
  const [rating, setRating] = useState<number>(existingReview?.rating || 5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>(existingReview?.comment || '');

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment);
    } else {
      setRating(5);
      setComment('');
    }
  }, [existingReview, isOpen]);

  const isEditing = !!existingReview?.id;

  const [state, formAction, isPending] = useActionState(
    async (prev: ReviewActionResult, formData: FormData) => {
      const result = isEditing
        ? await updateProductReviewAction(prev, formData)
        : await submitProductReviewAction(prev, formData);

      if (result.success) {
        setTimeout(() => {
          onClose();
        }, 1200);
      }
      return result;
    },
    initialState
  );

  const displayRating = hoverRating !== null ? hoverRating : rating;

  const getRatingLabel = (stars: number) => {
    switch (stars) {
      case 5:
        return 'Excellent! Loved everything about it (5/5)';
      case 4:
        return 'Very Good! High quality product (4/5)';
      case 3:
        return 'Average / Met basic expectations (3/5)';
      case 2:
        return 'Below Expectations (2/5)';
      case 1:
        return 'Poor Experience (1/5)';
      default:
        return '';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Your Product Review' : 'Leave a Product Review'}
    >
      <div className="space-y-5">
        {/* Product preview card */}
        <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#f8f4e3] dark:bg-[#131710] border border-[#e6dfcb] dark:border-[#323d2b]">
          <div className="relative h-12 w-12 rounded-xl bg-white dark:bg-[#1b2117] overflow-hidden shrink-0 border border-[#e6dfcb]/60 dark:border-[#323d2b]">
            <Image
              src={productImageUrl || '/images/logo/pcyc-transparent-logo.png'}
              alt={productName}
              fill
              className="object-contain p-1"
            />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#2c3324] dark:text-[#fefcf1] line-clamp-1">
              {productName}
            </h4>
            <p className="text-xs text-[#707666] dark:text-[#a3ab98]">
              Order #{orderNumber} &bull; Verified Purchase
            </p>
          </div>
        </div>

        {state.error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        {state.success && (
          <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800/40 text-green-700 dark:text-green-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
            <span>{state.message}</span>
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="productId" value={productId} />
          <input type="hidden" name="orderId" value={orderId} />
          {isEditing && <input type="hidden" name="reviewId" value={existingReview.id} />}
          <input type="hidden" name="rating" value={rating} />

          {/* Star Rating Picker */}
          <div className="space-y-1.5 text-center py-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#707666] dark:text-[#a3ab98]">
              Your Star Rating
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="p-1 focus:outline-none transition-transform hover:scale-125 active:scale-95"
                  aria-label={`${star} star`}
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= displayRating
                        ? 'fill-[#e0a861] text-[#e0a861] drop-shadow-sm'
                        : 'text-[#d6ceb8] dark:text-[#3d4632]'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-medium text-[#e0a861] min-h-[1.25rem]">
              {getRatingLabel(displayRating)}
            </p>
          </div>

          {/* Comment Textarea */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-[#2c3324] dark:text-[#fefcf1]">
                Your Review & Feedback <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-[#8a9180] font-mono">
                {comment.length}/1000
              </span>
            </div>
            <Textarea
              name="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was the shirt quality, sizing fit, or fabric feel? Share your thoughts with the brethren!"
              rows={4}
              required
              maxLength={1000}
              className="resize-none"
            />
            {state.fieldErrors?.comment && (
              <p className="text-[11px] text-red-500">{state.fieldErrors.comment[0]}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#e6dfcb] dark:border-[#323d2b]">
            <Button type="button" variant="outline" size="md" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isPending || comment.trim().length < 5}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isPending ? 'Publishing...' : isEditing ? 'Update Review' : 'Submit Review'}</span>
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
