import { db } from '../lib/db';
import { products } from '../lib/db/schema/products';
import { eq } from 'drizzle-orm';
import { getAvailableProducts } from '../lib/db/queries/products';

async function patchMerch() {
  // Update all products in DB to ensure isAvailable is true
  const updated = await db
    .update(products)
    .set({ isAvailable: true })
    .returning();

  console.log(`Updated ${updated.length} products to isAvailable: true`);

  const available = await getAvailableProducts();
  console.log('\n--- VERIFY getAvailableProducts() ---');
  console.log(JSON.stringify(available, null, 2));
}

patchMerch().catch(console.error);
