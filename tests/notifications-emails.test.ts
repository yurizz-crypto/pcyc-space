/**
 * Unit Tests for Custom Email Templates & Notification System
 * Runner: Node test runner (npx tsx --test tests/notifications-emails.test.ts)
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  renderBaseEmailLayout,
  renderWelcomeEmail,
  renderEventRegistrationEmail,
  renderAdminEventRegistrationAlert,
  renderOrderConfirmationEmail,
  renderAdminOrderAlert,
  renderPaymentVerificationEmail,
  renderOrderStatusEmail,
  SUPABASE_CONFIRM_SIGNUP_HTML,
  SUPABASE_RESET_PASSWORD_HTML,
} from '../lib/email/templates';

describe('Custom Email Templates & Design System Tests', () => {
  describe('Base Email Layout', () => {
    it('should generate valid responsive HTML with brand styling and footer', () => {
      const html = renderBaseEmailLayout({
        title: 'Test Notification',
        previewText: 'Preview summary text',
        badge: 'Official Alert',
        contentHtml: '<p>Main email body content</p>',
        ctaButton: {
          text: 'Open Portal',
          url: 'https://pcyc-space.vercel.app/portal',
        },
      });

      assert.ok(html.includes('<!DOCTYPE html>'), 'Must have HTML doctype');
      assert.ok(html.includes('PCYC Space'), 'Must include PCYC Space branding');
      assert.ok(html.includes('#2c3324'), 'Must use PCYC forest green color');
      assert.ok(html.includes('Official Alert'), 'Must display the badge');
      assert.ok(html.includes('bumadillal@gmail.com'), 'Must contain support contact email');
      assert.ok(html.includes('Open Portal'), 'Must render CTA button');
      assert.ok(html.includes('Preview summary text'), 'Must render preview text');
    });
  });

  describe('Welcome Email Template', () => {
    it('should render brother designation correctly', () => {
      const html = renderWelcomeEmail({
        name: 'Joshua Alcantara',
        designation: 'BROTHER',
        ecclesia: 'Cubao Ecclesia',
        email: 'joshua@test.com',
      });

      assert.ok(html.includes('Brother Joshua Alcantara'), 'Should address as Brother');
      assert.ok(html.includes('Cubao Ecclesia'), 'Should include ecclesia');
      assert.ok(html.includes('joshua@test.com'), 'Should include email address');
      assert.ok(html.includes('Visit Your Member Space'), 'Should have link to portal');
    });

    it('should render sister designation correctly', () => {
      const html = renderWelcomeEmail({
        name: 'Hannah Santos',
        designation: 'SISTER',
        ecclesia: 'Davao Ecclesia',
        email: 'hannah@test.com',
      });

      assert.ok(html.includes('Sister Hannah Santos'), 'Should address as Sister');
      assert.ok(html.includes('Davao Ecclesia'), 'Should include ecclesia');
    });
  });

  describe('Event Registration Email Template', () => {
    it('should render paid event with GCash reference number', () => {
      const html = renderEventRegistrationEmail({
        userName: 'Caleb Tan',
        userDesignation: 'BROTHER',
        eventTitle: 'PCYC National Youth Camp 2026',
        eventTheme: 'Walking in the Light',
        startDate: new Date('2026-12-26'),
        endDate: new Date('2026-12-30'),
        location: 'Cubao Hall, Quezon City',
        registrationFee: 500,
        paymentOption: 'GCASH',
        paymentStatus: 'VERIFICATION_QUEUED',
        referenceNumber: 'GCASH-998877',
      });

      assert.ok(html.includes('Brother Caleb Tan'), 'Must address attendee');
      assert.ok(html.includes('PCYC National Youth Camp 2026'), 'Must display event title');
      assert.ok(html.includes('Walking in the Light'), 'Must display event theme');
      assert.ok(html.includes('GCASH-998877'), 'Must include GCash reference number');
      assert.ok(html.includes('GCash Verification Queued'), 'Must show verification status');
      assert.ok(html.includes('What to Bring'), 'Must include packing checklist');
    });

    it('should render free event correctly without fee numbers', () => {
      const html = renderEventRegistrationEmail({
        userName: 'Maria Dela Cruz',
        userDesignation: 'SISTER',
        eventTitle: 'Metro Manila Youth Bible Study',
        startDate: new Date('2026-09-15'),
        endDate: new Date('2026-09-15'),
        location: 'Manila Hall',
        registrationFee: 0,
        paymentOption: 'FREE',
        paymentStatus: 'CONFIRMED',
      });

      assert.ok(html.includes('FREE (No Fee)'), 'Must indicate free admission');
      assert.ok(html.includes('Paid / Confirmed'), 'Must display confirmed badge');
    });

    it('should render admin registration alert with attendee contact', () => {
      const html = renderAdminEventRegistrationAlert({
        userName: 'Gideon Cruz',
        userEmail: 'gideon@test.com',
        userDesignation: 'BROTHER',
        userEcclesia: 'Cebu Ecclesia',
        eventTitle: 'Visayas Youth Conference 2026',
        startDate: new Date('2026-11-01'),
        endDate: new Date('2026-11-03'),
        location: 'Cebu Ecclesial Hall',
        registrationFee: 300,
        paymentOption: 'VENUE_DESK',
        paymentStatus: 'UNPAID',
      });

      assert.ok(html.includes('Admin Alert'), 'Must have Admin Alert badge');
      assert.ok(html.includes('Gideon Cruz'), 'Must include attendee name');
      assert.ok(html.includes('gideon@test.com'), 'Must include attendee email');
      assert.ok(html.includes('Cebu Ecclesia'), 'Must include ecclesia');
    });
  });

  describe('Merchandise Order Confirmation Email Template', () => {
    it('should render itemized product list with size and calculated totals', () => {
      const html = renderOrderConfirmationEmail({
        userName: 'Timothy David',
        userDesignation: 'BROTHER',
        orderNumber: 'PCYC-2026-88991',
        createdAt: new Date(),
        totalAmount: 670,
        items: [
          {
            name: 'PCYC 2026 Camp Official Shirt',
            size: 'L',
            quantity: 1,
            unitPrice: 550,
          },
        ],
        shippingInfo: {
          recipientName: 'Timothy David',
          contactNumber: '09171234567',
          deliveryAddress: 'Block 5 Lot 2',
          city: 'Quezon City',
          province: 'Metro Manila',
        },
        hasReceiptUploaded: true,
        referenceNumber: 'GCASH-112233',
      });

      assert.ok(html.includes('PCYC-2026-88991'), 'Must include order number');
      assert.ok(html.includes('PCYC 2026 Camp Official Shirt'), 'Must list item name');
      assert.ok(html.includes('Size: L'), 'Must display selected size');
      assert.ok(html.includes('GCASH-112233'), 'Must display GCash reference number');
      assert.ok(html.includes('GCash Verification Queued'), 'Must show queue status');
    });

    it('should render admin order alert', () => {
      const html = renderAdminOrderAlert({
        userName: 'Lydia Joy',
        userEmail: 'lydia@test.com',
        orderNumber: 'PCYC-2026-99001',
        createdAt: new Date(),
        totalAmount: 550,
        items: [
          {
            name: 'PCYC Tote Bag',
            quantity: 2,
            unitPrice: 275,
          },
        ],
        shippingInfo: {
          recipientName: 'Lydia Joy',
        },
        hasReceiptUploaded: false,
      });

      assert.ok(html.includes('New Merchandise Order'), 'Must have order alert header');
      assert.ok(html.includes('PCYC-2026-99001'), 'Must contain order number');
      assert.ok(html.includes('lydia@test.com'), 'Must contain customer email');
      assert.ok(html.includes('Awaiting Upload'), 'Must show pending receipt proof');
    });
  });

  describe('Payment Verification Decision Email Template', () => {
    it('should render payment APPROVED status', () => {
      const html = renderPaymentVerificationEmail({
        userName: 'Paul Silas',
        userDesignation: 'BROTHER',
        orderNumber: 'PCYC-2026-77889',
        decision: 'APPROVED',
        totalAmount: 550,
        referenceNumber: 'GCASH-778899',
        adminNotes: 'Payment verified via GCash SMS confirmation.',
      });

      assert.ok(html.includes('GCash Payment Approved!'), 'Must indicate payment approval');
      assert.ok(html.includes('PAID'), 'Must confirm PAID state');
      assert.ok(html.includes('Payment verified via GCash SMS confirmation.'), 'Must render admin note');
      assert.ok(html.includes('Next Steps'), 'Must explain next packaging steps');
    });

    it('should render payment REJECTED status with reason and re-upload link', () => {
      const html = renderPaymentVerificationEmail({
        userName: 'Paul Silas',
        userDesignation: 'BROTHER',
        orderNumber: 'PCYC-2026-77889',
        decision: 'REJECTED',
        totalAmount: 550,
        adminNotes: 'Reference number did not match transaction record. Please re-upload.',
      });

      assert.ok(html.includes('Payment Verification Update Needed'), 'Must indicate review needed');
      assert.ok(html.includes('Reference number did not match'), 'Must explain rejection reason');
      assert.ok(html.includes('Re-upload Receipt in Member Space'), 'Must provide re-upload button');
    });
  });

  describe('Order Status Lifecycle Email Template', () => {
    it('should render PREPARING state', () => {
      const html = renderOrderStatusEmail({
        userName: 'Daniel Reed',
        orderNumber: 'PCYC-2026-11223',
        newStatus: 'PREPARING',
      });

      assert.ok(html.includes('Preparing Order'), 'Must show preparing badge');
      assert.ok(html.includes('Your Items are Being Prepared'), 'Must show headline');
    });

    it('should render SHIPPED state with tracking info', () => {
      const html = renderOrderStatusEmail({
        userName: 'Daniel Reed',
        orderNumber: 'PCYC-2026-11223',
        newStatus: 'SHIPPED',
        notes: 'J&T Tracking Number: JT123456789PH',
      });

      assert.ok(html.includes('Order Dispatched'), 'Must show dispatched badge');
      assert.ok(html.includes('JT123456789PH'), 'Must render tracking details');
    });
  });

  describe('Supabase Auth Custom HTML Email Templates', () => {
    it('should contain the {{ .ConfirmationURL }} placeholder for Supabase Dashboard', () => {
      assert.ok(SUPABASE_CONFIRM_SIGNUP_HTML.includes('{{ .ConfirmationURL }}'), 'Confirm signup template must have placeholder');
      assert.ok(SUPABASE_CONFIRM_SIGNUP_HTML.includes('PCYC Space'), 'Confirm signup template must have branding');
      assert.ok(SUPABASE_RESET_PASSWORD_HTML.includes('{{ .ConfirmationURL }}'), 'Reset password template must have placeholder');
    });
  });
});
