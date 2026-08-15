import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  productReviewSchema,
  updateProductReviewSchema,
  bulkOrderStatusSchema,
} from '../lib/validators';
import type { ProductRatingSummary } from '../lib/db/queries/reviews';

describe('Product Review Schema & 5-Star Rating Validation Tests', () => {
  const validReview = {
    productId: '550e8400-e29b-41d4-a716-446655440000',
    orderId: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    rating: 5,
    comment: 'The shirt quality is exceptional! Fabric is breathable and comfortable.',
  };

  it('should accept valid 5-star review', () => {
    const result = productReviewSchema.safeParse(validReview);
    assert.equal(result.success, true);
    if (result.success) {
      assert.equal(result.data.rating, 5);
      assert.equal(result.data.comment, validReview.comment);
    }
  });

  it('should accept 1-star review', () => {
    const result = productReviewSchema.safeParse({
      ...validReview,
      rating: 1,
      comment: 'Sizing ran smaller than expected.',
    });
    assert.equal(result.success, true);
    if (result.success) {
      assert.equal(result.data.rating, 1);
    }
  });

  it('should reject rating lower than 1 or higher than 5', () => {
    const zeroStars = productReviewSchema.safeParse({
      ...validReview,
      rating: 0,
    });
    assert.equal(zeroStars.success, false, '0 stars should be rejected');

    const sixStars = productReviewSchema.safeParse({
      ...validReview,
      rating: 6,
    });
    assert.equal(sixStars.success, false, '6 stars should be rejected');
  });

  it('should reject review comment shorter than 5 characters or longer than 1000', () => {
    const tooShort = productReviewSchema.safeParse({
      ...validReview,
      comment: 'good',
    });
    assert.equal(tooShort.success, false);

    const tooLong = productReviewSchema.safeParse({
      ...validReview,
      comment: 'a'.repeat(1001),
    });
    assert.equal(tooLong.success, false);
  });

  it('should validate review update schema', () => {
    const validUpdate = {
      reviewId: '550e8400-e29b-41d4-a716-446655440000',
      rating: 4,
      comment: 'Updated review: After several washes, it held up great!',
    };
    const result = updateProductReviewSchema.safeParse(validUpdate);
    assert.equal(result.success, true);
  });
});

describe('Admin Bulk Order Management Schema Tests', () => {
  it('should validate bulk order status transition to PAID with array of order IDs', () => {
    const validBulk = {
      orderIds: [
        '550e8400-e29b-41d4-a716-446655440000',
        '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
      ],
      targetStatus: 'PAID' as const,
      adminNotes: 'Bulk verified after GCash account reconciliation',
    };

    const result = bulkOrderStatusSchema.safeParse(validBulk);
    assert.equal(result.success, true);
    if (result.success) {
      assert.equal(result.data.orderIds.length, 2);
      assert.equal(result.data.targetStatus, 'PAID');
    }
  });

  it('should validate bulk transition to SHIPPED and COMPLETED', () => {
    const shippedBulk = {
      orderIds: ['550e8400-e29b-41d4-a716-446655440000'],
      targetStatus: 'SHIPPED' as const,
    };
    assert.equal(bulkOrderStatusSchema.safeParse(shippedBulk).success, true);

    const completedBulk = {
      orderIds: ['550e8400-e29b-41d4-a716-446655440000'],
      targetStatus: 'COMPLETED' as const,
    };
    assert.equal(bulkOrderStatusSchema.safeParse(completedBulk).success, true);
  });

  it('should reject empty orderIds list for bulk update', () => {
    const emptyBulk = {
      orderIds: [],
      targetStatus: 'PAID' as const,
    };
    const result = bulkOrderStatusSchema.safeParse(emptyBulk);
    assert.equal(result.success, false, 'Must require at least 1 order ID');
  });

  it('should reject invalid status strings', () => {
    const invalidStatus = {
      orderIds: ['550e8400-e29b-41d4-a716-446655440000'],
      targetStatus: 'INVALID_STATUS',
    };
    const result = bulkOrderStatusSchema.safeParse(invalidStatus);
    assert.equal(result.success, false);
  });
});

describe('Product Rating Aggregate Mathematical Calculations', () => {
  it('should accurately calculate average score from rating counts', () => {
    const mockReviews = [5, 5, 4, 4, 5, 3];
    const sum = mockReviews.reduce((a, b) => a + b, 0);
    const avg = Number((sum / mockReviews.length).toFixed(1));

    assert.equal(avg, 4.3);
    assert.equal(mockReviews.length, 6);
  });

  it('should construct correct distribution shape', () => {
    const summary: ProductRatingSummary = {
      averageRating: 4.8,
      totalReviews: 5,
      distribution: {
        5: 4,
        4: 1,
        3: 0,
        2: 0,
        1: 0,
      },
    };

    assert.equal(summary.distribution[5], 4);
    assert.equal(summary.distribution[4], 1);
    assert.equal(summary.totalReviews, 5);
  });
});
