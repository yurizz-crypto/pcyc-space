import { db } from '@/lib/db';
import { products, type Product } from '@/lib/db/schema/products';
import { eq, desc, and, or } from 'drizzle-orm';
import { logger } from '@/lib/logger';

/**
 * Fetches all available products for the public merch store.
 * Includes items in active stock (isAvailable: true) or open for Pre-Order (isPreorder: true).
 */
export async function getAvailableProducts(category?: string): Promise<Product[]> {
  try {
    const isStoreVisible = or(eq(products.isAvailable, true), eq(products.isPreorder, true));

    if (category && category !== 'All') {
      return await db
        .select()
        .from(products)
        .where(and(isStoreVisible, eq(products.category, category)))
        .orderBy(desc(products.createdAt));
    }

    return await db
      .select()
      .from(products)
      .where(isStoreVisible)
      .orderBy(desc(products.createdAt));
  } catch (error) {
    logger.error({ error, category }, 'Failed to fetch available products');
    return [];
  }
}

/**
 * Fetches all products (including archived or unavailable items) for Admin inventory.
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    return await db.select().from(products).orderBy(desc(products.createdAt));
  } catch (error) {
    logger.error({ error }, 'Failed to fetch all products for admin');
    return [];
  }
}

/**
 * Fetches a single product by slug for product detail view.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const results = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1);

    return results[0] || null;
  } catch (error) {
    logger.error({ error, slug }, 'Failed to fetch product by slug');
    return null;
  }
}

/**
 * Fetches a single product by ID for admin editor.
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const results = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    return results[0] || null;
  } catch (error) {
    logger.error({ error, id }, 'Failed to fetch product by id');
    return null;
  }
}
