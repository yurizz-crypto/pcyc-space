import { db } from '../lib/db';
import { products } from '../lib/db/schema/products';
import { getAvailableProducts, getAllProducts } from '../lib/db/queries/products';

async function checkProducts() {
  const allInDb = await db.select().from(products);
  console.log('--- ALL PRODUCTS IN DATABASE (Direct SQL) ---');
  console.log(JSON.stringify(allInDb, null, 2));

  const available = await getAvailableProducts();
  console.log('\n--- AVAILABLE PRODUCTS QUERY (`getAvailableProducts()`) ---');
  console.log(JSON.stringify(available, null, 2));
}

checkProducts().catch(console.error);
