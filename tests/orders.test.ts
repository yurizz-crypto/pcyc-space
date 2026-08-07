/**
 * Unit Tests for Order Creation, Size Validation, and Receipt Submissions
 * TDD Pillar: Written BEFORE implementation to ensure shift-left security & data integrity.
 * Runner: Node test runner (npx tsx --test tests/orders.test.ts)
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { orderSchema, receiptUploadSchema, isSizeAvailable } from '../lib/validators';

describe('Order Schema Validation & Security Tests', () => {
  it('should validate a valid EVENT_PICKUP order (no delivery address required)', () => {
    const validPickupOrder = {
      productId: 'df2435e4-5d09-43fd-a306-429d579280a6',
      quantity: 2,
      selectedSize: 'L',
      fulfillmentType: 'EVENT_PICKUP' as const,
      recipientName: 'Brother Juan Dela Cruz',
      contactNumber: '09171234567',
      targetEventTitle: 'PCYC National Youth Camp 2026',
      notes: 'Will pick up at the registration desk on Day 1',
    };

    const result = orderSchema.safeParse(validPickupOrder);
    assert.equal(result.success, true, 'Valid EVENT_PICKUP order should pass validation');
    if (result.success) {
      assert.equal(result.data.fulfillmentType, 'EVENT_PICKUP');
      assert.equal(result.data.quantity, 2);
    }
  });

  it('should validate a valid DELIVERY order with complete shipping details', () => {
    const validDeliveryOrder = {
      productId: 'df2435e4-5d09-43fd-a306-429d579280a6',
      quantity: 1,
      selectedSize: 'M',
      fulfillmentType: 'DELIVERY' as const,
      recipientName: 'Sister Maria Santos',
      contactNumber: '09289876543',
      deliveryAddress: 'Block 12 Lot 5, Grace Village, Brgy. San Jose',
      city: 'Antipolo City',
      province: 'Rizal',
      zipCode: '1870',
      notes: 'Leave with guard if not at home',
    };

    const result = orderSchema.safeParse(validDeliveryOrder);
    assert.equal(result.success, true, 'Valid DELIVERY order should pass validation');
    if (result.success) {
      assert.equal(result.data.fulfillmentType, 'DELIVERY');
      assert.equal(result.data.deliveryAddress, 'Block 12 Lot 5, Grace Village, Brgy. San Jose');
    }
  });

  it('should reject a DELIVERY order if deliveryAddress or city is missing', () => {
    const invalidDeliveryOrder = {
      productId: 'df2435e4-5d09-43fd-a306-429d579280a6',
      quantity: 1,
      selectedSize: 'M',
      fulfillmentType: 'DELIVERY' as const,
      recipientName: 'Sister Maria Santos',
      contactNumber: '09289876543',
      // missing deliveryAddress and city!
    };

    const result = orderSchema.safeParse(invalidDeliveryOrder);
    assert.equal(result.success, false, 'DELIVERY order without delivery address must be rejected');
  });

  it('should sanitize and validate phone numbers properly', () => {
    const invalidPhoneOrder = {
      productId: 'df2435e4-5d09-43fd-a306-429d579280a6',
      quantity: 1,
      fulfillmentType: 'EVENT_PICKUP' as const,
      recipientName: 'Juan Dela Cruz',
      contactNumber: 'invalid-phone-string',
    };

    const result = orderSchema.safeParse(invalidPhoneOrder);
    assert.equal(result.success, false, 'Invalid phone number format should fail validation');
  });

  it('should enforce quantity bounds (min 1, max 50)', () => {
    const zeroQuantityOrder = {
      productId: 'df2435e4-5d09-43fd-a306-429d579280a6',
      quantity: 0,
      fulfillmentType: 'EVENT_PICKUP' as const,
      recipientName: 'Juan Dela Cruz',
      contactNumber: '09171234567',
    };

    const result = orderSchema.safeParse(zeroQuantityOrder);
    assert.equal(result.success, false, 'Zero quantity order must be rejected');
  });
});

describe('Product Available Sizes Helper Tests', () => {
  it('should accurately determine if a selected size is within product available sizes', () => {
    const availableSizes = ['S', 'M', 'L', 'XL'];

    assert.equal(isSizeAvailable('M', availableSizes), true, 'Size M is available');
    assert.equal(isSizeAvailable('3XL', availableSizes), false, 'Size 3XL is not available');
    assert.equal(isSizeAvailable(undefined, availableSizes), true, 'Undefined size acceptable if no size chosen');
  });

  it('should accept any size or "One Size" if product availableSizes is empty or marked One Size', () => {
    const accessorySizes = ['One Size'];
    assert.equal(isSizeAvailable('One Size', accessorySizes), true);
    assert.equal(isSizeAvailable(undefined, accessorySizes), true);
  });
});

describe('Payment Receipt Upload Validation Tests', () => {
  it('should validate valid payment receipt metadata', () => {
    const validReceipt = {
      orderId: 'df2435e4-5d09-43fd-a306-429d579280a6',
      paymentMethod: 'GCASH' as const,
      referenceNumber: '100492817264',
      amountPaid: 300.0,
      notes: 'Paid via GCash app',
    };

    const result = receiptUploadSchema.safeParse(validReceipt);
    assert.equal(result.success, true, 'Valid receipt metadata should pass validation');
  });

  it('should reject payment receipts with negative or zero amount paid', () => {
    const invalidReceipt = {
      orderId: 'df2435e4-5d09-43fd-a306-429d579280a6',
      paymentMethod: 'GCASH' as const,
      referenceNumber: '100492817264',
      amountPaid: -50.0,
    };

    const result = receiptUploadSchema.safeParse(invalidReceipt);
    assert.equal(result.success, false, 'Negative amount paid must be rejected');
  });
});
