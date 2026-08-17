'use server';

import { db } from '@/lib/db';
import { productReviews, type ProductReview } from '@/lib/db/schema/reviews';
import { orders, orderItems } from '@/lib/db/schema/orders';
import { getCurrentUserProfile, verifyCurrentUserRole } from '@/lib/db/queries/users';
import { productReviewSchema, updateProductReviewSchema } from '@/lib/validators';
import { CACHE_TAGS, invalidateCacheTag } from '@/lib/db/queries/cached';
import { enforceActionRateLimit } from '@/lib/security/rate-limiter';
import { revalidatePath } from 'next/cache';
import { eq, and } from 'drizzle-orm';
import { logger } from '@/lib/logger';
import { auditLogs } from '@/lib/db/schema/audit-logs';

export interface ReviewActionResult {
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  review?: ProductReview;
}

/**
 * Server Action for verified buyers to submit a 1 to 5 star review for a completed product order.
 */
export async function submitProductReviewAction(
  prevState: ReviewActionResult,
  formData: FormData
): Promise<ReviewActionResult> {
  try {
    const profile = await getCurrentUserProfile();
    if (!profile) {
      return {
        success: false,
        error: 'You must be logged in to leave a review.',
      };
    }

    // Rate Limit Check
    const rateLimit = enforceActionRateLimit(profile.id, 'submit_review', 10, 60 * 1000);
    if (!rateLimit.allowed) {
      return {
        success: false,
        error: `Please slow down. You can submit another review in ${rateLimit.retryAfterSeconds}s.`,
      };
    }

    const rawData = {
      productId: formData.get('productId'),
      orderId: formData.get('orderId'),
      rating: formData.get('rating'),
      comment: formData.get('comment'),
    };

    const validated = productReviewSchema.safeParse(rawData);
    if (!validated.success) {
      return {
        success: false,
        error: 'Please check your review input.',
        fieldErrors: validated.error.flatten().fieldErrors,
      };
    }

    const { productId, orderId, rating, comment } = validated.data;

    // 1. Verify Order Ownership and Completed Status
    const [order] = await db
      .select()
      .from(orders)
      .where(and(eq(orders.id, orderId), eq(orders.userId, profile.id)))
      .limit(1);

    if (!order) {
      return {
        success: false,
        error: 'Order record not found or does not belong to your account.',
      };
    }

    if (order.status !== 'COMPLETED') {
      return {
        success: false,
        error: 'You can only review merchandise from completed / delivered orders.',
      };
    }

    // 2. Verify Order actually contained this product
    const [item] = await db
      .select()
      .from(orderItems)
      .where(and(eq(orderItems.orderId, orderId), eq(orderItems.productId, productId)))
      .limit(1);

    if (!item) {
      return {
        success: false,
        error: 'This item was not found in the specified order.',
      };
    }

    // 3. Upsert / Insert Review
    const [existingReview] = await db
      .select()
      .from(productReviews)
      .where(and(eq(productReviews.orderId, orderId), eq(productReviews.productId, productId)))
      .limit(1);

    let savedReview: ProductReview;

    if (existingReview) {
      // Update existing review
      const [updated] = await db
        .update(productReviews)
        .set({
          rating,
          comment,
          updatedAt: new Date(),
        })
        .where(eq(productReviews.id, existingReview.id))
        .returning();

      savedReview = updated;
    } else {
      // Insert new review
      const [inserted] = await db
        .insert(productReviews)
        .values({
          productId,
          userId: profile.id,
          orderId,
          rating,
          comment,
          isHidden: false,
        })
        .returning();

      savedReview = inserted;
    }

    logger.info(
      { reviewId: savedReview.id, productId, orderId, userId: profile.id, rating },
      'Product review submitted successfully'
    );

    // 4. Invalidate Data Caches & Revalidate Paths
    invalidateCacheTag(
      CACHE_TAGS.reviews,
      CACHE_TAGS.productReviews(productId),
      CACHE_TAGS.products,
      CACHE_TAGS.productsAvailable
    );

    revalidatePath('/merch');
    revalidatePath(`/merch/[slug]`, 'page');
    revalidatePath('/orders');
    revalidatePath('/portal');

    return {
      success: true,
      message: 'Thank you! Your review and rating have been published.',
      review: savedReview,
    };
  } catch (error: any) {
    logger.error({ error: error?.message }, 'Failed to submit product review');
    return {
      success: false,
      error: error?.message || 'Failed to submit review. Please try again.',
    };
  }
}

/**
 * Server Action for members to edit an existing review they submitted.
 */
export async function updateProductReviewAction(
  prevState: ReviewActionResult,
  formData: FormData
): Promise<ReviewActionResult> {
  try {
    const profile = await getCurrentUserProfile();
    if (!profile) {
      return {
        success: false,
        error: 'You must be logged in to update your review.',
      };
    }

    const rawData = {
      reviewId: formData.get('reviewId'),
      rating: formData.get('rating'),
      comment: formData.get('comment'),
    };

    const validated = updateProductReviewSchema.safeParse(rawData);
    if (!validated.success) {
      return {
        success: false,
        error: 'Please check your review input.',
        fieldErrors: validated.error.flatten().fieldErrors,
      };
    }

    const { reviewId, rating, comment } = validated.data;

    const [existing] = await db
      .select()
      .from(productReviews)
      .where(and(eq(productReviews.id, reviewId), eq(productReviews.userId, profile.id)))
      .limit(1);

    if (!existing) {
      return {
        success: false,
        error: 'Review not found or you do not have permission to edit it.',
      };
    }

    const [updated] = await db
      .update(productReviews)
      .set({
        rating,
        comment,
        updatedAt: new Date(),
      })
      .where(eq(productReviews.id, reviewId))
      .returning();

    logger.info({ reviewId, userId: profile.id }, 'Product review updated');

    invalidateCacheTag(
      CACHE_TAGS.reviews,
      CACHE_TAGS.productReviews(existing.productId),
      CACHE_TAGS.products,
      CACHE_TAGS.productsAvailable
    );

    revalidatePath('/merch');
    revalidatePath(`/merch/[slug]`, 'page');
    revalidatePath('/orders');
    revalidatePath('/portal');

    return {
      success: true,
      message: 'Your review has been successfully updated.',
      review: updated,
    };
  } catch (error: any) {
    logger.error({ error: error?.message }, 'Failed to update product review');
    return {
      success: false,
      error: error?.message || 'Failed to update review.',
    };
  }
}

/**
 * Server Action for Admins to toggle hiding/showing a review.
 */
export async function adminToggleHideReviewAction(formData: FormData): Promise<ReviewActionResult> {
  try {
    const auth = await verifyCurrentUserRole(['ADMIN', 'SUPERADMIN']);
    if (!auth.authorized || !auth.profile) {
      return { success: false, error: 'Unauthorized. Admin access required.' };
    }
    const admin = auth.profile;
    const reviewId = formData.get('reviewId') as string;
    const isHiddenRaw = formData.get('isHidden') === 'true';

    if (!reviewId) {
      return { success: false, error: 'Invalid review ID' };
    }

    const [review] = await db
      .select()
      .from(productReviews)
      .where(eq(productReviews.id, reviewId))
      .limit(1);

    if (!review) {
      return { success: false, error: 'Review not found' };
    }

    const [updated] = await db
      .update(productReviews)
      .set({
        isHidden: isHiddenRaw,
        updatedAt: new Date(),
      })
      .where(eq(productReviews.id, reviewId))
      .returning();

    await db.insert(auditLogs).values({
      actorId: admin.id,
      actorEmail: admin.email,
      action: isHiddenRaw ? 'SUSPEND_USER' : 'UPDATE_PROFILE',
      targetId: reviewId,
      targetType: 'PRODUCT_REVIEW',
      details: {
        productId: review.productId,
        isHidden: isHiddenRaw,
        moderatedBy: admin.email,
      },
    });

    invalidateCacheTag(
      CACHE_TAGS.reviews,
      CACHE_TAGS.productReviews(review.productId),
      CACHE_TAGS.productsAvailable
    );

    revalidatePath('/merch');
    revalidatePath('/admin/merch/reviews');

    return {
      success: true,
      message: isHiddenRaw ? 'Review has been hidden from public view.' : 'Review is now visible.',
      review: updated,
    };
  } catch (error: any) {
    logger.error({ error: error?.message }, 'Failed to toggle review visibility');
    return { success: false, error: error?.message || 'Moderation action failed.' };
  }
}

/**
 * Server Action for Admins to permanently delete an inappropriate review.
 */
export async function adminDeleteReviewAction(formData: FormData): Promise<ReviewActionResult> {
  try {
    const auth = await verifyCurrentUserRole(['ADMIN', 'SUPERADMIN']);
    if (!auth.authorized || !auth.profile) {
      return { success: false, error: 'Unauthorized. Admin access required.' };
    }
    const admin = auth.profile;
    const reviewId = formData.get('reviewId') as string;

    if (!reviewId) {
      return { success: false, error: 'Invalid review ID' };
    }

    const [review] = await db
      .select()
      .from(productReviews)
      .where(eq(productReviews.id, reviewId))
      .limit(1);

    if (!review) {
      return { success: false, error: 'Review not found' };
    }

    await db.delete(productReviews).where(eq(productReviews.id, reviewId));

    await db.insert(auditLogs).values({
      actorId: admin.id,
      actorEmail: admin.email,
      action: 'SUSPEND_USER',
      targetId: reviewId,
      targetType: 'PRODUCT_REVIEW_DELETION',
      details: {
        productId: review.productId,
        deletedBy: admin.email,
        originalComment: review.comment,
      },
    });

    invalidateCacheTag(
      CACHE_TAGS.reviews,
      CACHE_TAGS.productReviews(review.productId),
      CACHE_TAGS.productsAvailable
    );

    revalidatePath('/merch');
    revalidatePath('/admin/merch/reviews');

    return {
      success: true,
      message: 'Review permanently removed.',
    };
  } catch (error: any) {
    logger.error({ error: error?.message }, 'Failed to delete review');
    return { success: false, error: error?.message || 'Delete action failed.' };
  }
}
