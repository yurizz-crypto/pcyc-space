import { pgTable, uuid, text, timestamp, boolean, integer, numeric } from 'drizzle-orm/pg-core';

/**
 * Merchandise Products Table
 * Manages fundraising merch (shirts, hoodies, mugs, tote bags, stickers).
 */
export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(), // PHP price
  category: text('category').default('Apparel').notNull(),
  stockQuantity: integer('stock_quantity').default(0).notNull(),
  imageUrls: text('image_urls').array().notNull().default([]),
  availableSizes: text('available_sizes').array().default(['XS', 'S', 'M', 'L', 'XL', '2XL']),
  isAvailable: boolean('is_available').default(true).notNull(),
  isPreorder: boolean('is_preorder').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
