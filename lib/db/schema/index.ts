import { relations } from 'drizzle-orm';
import { profiles } from './users';
import { events, eventRegistrations } from './events';
import { products } from './products';
import { orders, orderItems, paymentReceipts } from './orders';
import { notifications } from './notifications';
import { auditLogs } from './audit-logs';
import { productReviews } from './reviews';

export * from './users';
export * from './events';
export * from './products';
export * from './orders';
export * from './ecclesias';
export * from './settings';
export * from './notifications';
export * from './audit-logs';
export * from './reviews';

// ==========================================
// DRIZZLE RELATIONS DEFINITIONS
// ==========================================

export const profilesRelations = relations(profiles, ({ many }) => ({
  orders: many(orders),
  eventRegistrations: many(eventRegistrations),
  createdEvents: many(events),
  verifiedReceipts: many(paymentReceipts),
  notifications: many(notifications),
  auditLogs: many(auditLogs),
  reviews: many(productReviews),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  actor: one(profiles, {
    fields: [auditLogs.actorId],
    references: [profiles.id],
  }),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  createdBy: one(profiles, {
    fields: [events.createdById],
    references: [profiles.id],
  }),
  registrations: many(eventRegistrations),
}));

export const eventRegistrationsRelations = relations(eventRegistrations, ({ one }) => ({
  event: one(events, {
    fields: [eventRegistrations.eventId],
    references: [events.id],
  }),
  user: one(profiles, {
    fields: [eventRegistrations.userId],
    references: [profiles.id],
  }),
}));

export const productsRelations = relations(products, ({ many }) => ({
  orderItems: many(orderItems),
  reviews: many(productReviews),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(profiles, {
    fields: [orders.userId],
    references: [profiles.id],
  }),
  items: many(orderItems),
  receipt: one(paymentReceipts, {
    fields: [orders.id],
    references: [paymentReceipts.orderId],
  }),
  reviews: many(productReviews),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const paymentReceiptsRelations = relations(paymentReceipts, ({ one }) => ({
  order: one(orders, {
    fields: [paymentReceipts.orderId],
    references: [orders.id],
  }),
  verifiedBy: one(profiles, {
    fields: [paymentReceipts.verifiedById],
    references: [profiles.id],
  }),
}));

export const productReviewsRelations = relations(productReviews, ({ one }) => ({
  product: one(products, {
    fields: [productReviews.productId],
    references: [products.id],
  }),
  user: one(profiles, {
    fields: [productReviews.userId],
    references: [profiles.id],
  }),
  order: one(orders, {
    fields: [productReviews.orderId],
    references: [orders.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(profiles, {
    fields: [notifications.userId],
    references: [profiles.id],
  }),
}));
