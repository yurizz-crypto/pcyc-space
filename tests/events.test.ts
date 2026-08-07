/**
 * Unit Tests for Events & Event Registrations (GCash, Desk Payment, Free Admission)
 * Runner: Node test runner (npx tsx --test tests/events.test.ts)
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { eventSchema, eventRegistrationSchema } from '../lib/validators';

describe('Event Creation & Update Schema Tests', () => {
  it('should validate an event with registrationFee', () => {
    const validEvent = {
      title: 'PCYC National Youth Camp 2026',
      slug: 'pcyc-national-youth-camp-2026',
      description: 'Annual gathering of Christadelphian young people from across the Philippines.',
      location: 'Cubao Ecclesial Hall, Quezon City',
      startDate: '2026-12-26',
      endDate: '2026-12-30',
      registrationFee: 500,
      isPublished: true,
      maxAttendees: 150,
      status: 'UPCOMING' as const,
    };

    const result = eventSchema.safeParse(validEvent);
    assert.equal(result.success, true, 'Event with registration fee should be valid');
    if (result.success) {
      assert.equal(result.data.registrationFee, 500);
      assert.equal(result.data.title, 'PCYC National Youth Camp 2026');
    }
  });

  it('should allow 0 for Free fellowship events', () => {
    const freeEvent = {
      title: 'Metro Manila Youth Bible Fellowship',
      slug: 'metro-manila-youth-bible-fellowship',
      description: 'Monthly study circle and psalm praise afternoon.',
      location: 'Manila Ecclesia',
      startDate: '2026-09-15',
      endDate: '2026-09-15',
      registrationFee: 0,
      isPublished: true,
      status: 'UPCOMING' as const,
    };

    const result = eventSchema.safeParse(freeEvent);
    assert.equal(result.success, true, 'Free event (fee = 0) should be valid');
    if (result.success) {
      assert.equal(result.data.registrationFee, 0);
    }
  });

  it('should reject events with negative registration fees', () => {
    const invalidFeeEvent = {
      title: 'Invalid Fee Camp',
      slug: 'invalid-fee-camp',
      description: 'Some description about the camp fellowship.',
      location: 'Cebu City',
      startDate: '2026-10-01',
      endDate: '2026-10-03',
      registrationFee: -100,
    };

    const result = eventSchema.safeParse(invalidFeeEvent);
    assert.equal(result.success, false, 'Negative fee must be rejected');
  });

  it('should accept ARCHIVED status for historical events', () => {
    const archivedEvent = {
      title: 'PCYC National Youth Camp 2024',
      slug: 'pcyc-national-youth-camp-2024',
      description: 'Historical archive of the 2024 national youth gathering.',
      location: 'Baguio City',
      startDate: '2024-12-26',
      endDate: '2024-12-30',
      registrationFee: 0,
      status: 'ARCHIVED' as const,
    };

    const result = eventSchema.safeParse(archivedEvent);
    assert.equal(result.success, true, 'ARCHIVED status should be valid');
    if (result.success) {
      assert.equal(result.data.status, 'ARCHIVED');
    }
  });
});

describe('Event Registration Schema Tests', () => {
  it('should validate GCash registration when referenceNumber is provided', () => {
    const validGcashReg = {
      eventId: 'df2435e4-5d09-43fd-a306-429d579280a6',
      paymentOption: 'GCASH' as const,
      referenceNumber: '100489201827',
      specialRequirements: 'Vegetarian meals preferred',
    };

    const result = eventRegistrationSchema.safeParse(validGcashReg);
    assert.equal(result.success, true, 'GCash registration with reference number should pass');
    if (result.success) {
      assert.equal(result.data.paymentOption, 'GCASH');
      assert.equal(result.data.referenceNumber, '100489201827');
    }
  });

  it('should reject GCash registration if referenceNumber is missing or too short', () => {
    const invalidGcashReg = {
      eventId: 'df2435e4-5d09-43fd-a306-429d579280a6',
      paymentOption: 'GCASH' as const,
      referenceNumber: '1', // too short
    };

    const result = eventRegistrationSchema.safeParse(invalidGcashReg);
    assert.equal(result.success, false, 'GCash registration without valid ref number must be rejected');
  });

  it('should validate VENUE_DESK (Pay at Venue) registration without reference number', () => {
    const validDeskReg = {
      eventId: 'df2435e4-5d09-43fd-a306-429d579280a6',
      paymentOption: 'VENUE_DESK' as const,
      specialRequirements: 'Arriving by bus in the afternoon',
    };

    const result = eventRegistrationSchema.safeParse(validDeskReg);
    assert.equal(result.success, true, 'Venue desk payment registration should pass without reference number');
    if (result.success) {
      assert.equal(result.data.paymentOption, 'VENUE_DESK');
    }
  });

  it('should validate FREE admission registration', () => {
    const validFreeReg = {
      eventId: 'df2435e4-5d09-43fd-a306-429d579280a6',
      paymentOption: 'FREE' as const,
    };

    const result = eventRegistrationSchema.safeParse(validFreeReg);
    assert.equal(result.success, true, 'Free event registration should pass');
  });
});
