import { pgTable, uuid, text, timestamp, integer, numeric, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { profiles } from './users';
import { products } from './products';

export const orderStatusEnum = pgEnum('order_status', [
  'PENDING_PAYMENT',
  'VERIFICATION_QUEUED',
  'PAID',
  'PREPARING',
  'SHIPPED',
  'COMPLETED',
  'CANCELLED',
]);

export const paymentMethodEnum = pgEnum('payment_method', [
  'GCASH',
  'PALAWAN_PAY',
  'BANK_TRANSFER',
  'MAYA',
  'OTHER',
]);

export const paymentVerificationStatusEnum = pgEnum('payment_verification_status', [
  'PENDING',
  'APPROVED',
  'REJECTED',
]);

/**
 * Orders Table
 */
export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  orderNumber: text('order_number').notNull().unique(), // e.g. PCYC-2026-0001
  totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
  status: orderStatusEnum('status').default('PENDING_PAYMENT').notNull(),
  shippingInfo: jsonb('shipping_info').$type<{
    recipientName: string;
    contactNumber: string;
    deliveryAddress: string;
    city: string;
    province: string;
    zipCode?: string;
    notes?: string;
  }>().notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Order Items Table
 */
export const orderItems = pgTable('order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').notNull().references(() => products.id),
  quantity: integer('quantity').notNull(),
  unitPrice: numeric('unit_price', { precision: 10, scale: 2 }).notNull(),
  selectedSize: text('selected_size'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Payment Receipts Table
 * Stores manual proof-of-payment screenshots (GCash / PalawanPay / Bank)
 */
export const paymentReceipts = pgTable('payment_receipts', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }).unique(),
  receiptImageUrl: text('receipt_image_url').notNull(),
  paymentMethod: paymentMethodEnum('payment_method').notNull(),
  referenceNumber: text('reference_number'),
  amountPaid: numeric('amount_paid', { precision: 10, scale: 2 }),
  verificationStatus: paymentVerificationStatusEnum('verification_status').default('PENDING').notNull(),
  verificationNotes: text('verification_notes'),
  verifiedById: uuid('verified_by_id').references(() => profiles.id),
  verifiedAt: timestamp('verified_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
export type PaymentReceipt = typeof paymentReceipts.$inferSelect;
export type NewPaymentReceipt = typeof paymentReceipts.$inferInsert;
export type PaymentMethod = (typeof paymentMethodEnum.enumValues)[number];
export type OrderStatus = (typeof orderStatusEnum.enumValues)[number];
export type PaymentVerificationStatus = (typeof paymentVerificationStatusEnum.enumValues)[number];
