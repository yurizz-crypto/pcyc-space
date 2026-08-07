import postgres from 'postgres';

const databaseUrl = process.env.DATABASE_URL || process.env.DIRECT_URL!;
const client = postgres(databaseUrl, { prepare: false });

async function clearData() {
  console.log('🧹 Clearing all auto-populated Events, Ecclesias, and Merchandise Products from database...');

  try {
    await client`DELETE FROM "payment_receipts";`;
    await client`DELETE FROM "orders";`;
    await client`DELETE FROM "products";`;
    await client`DELETE FROM "events";`;
    await client`DELETE FROM "ecclesias";`;

    console.log('✅ Successfully cleared:');
    console.log('   - 0 Events');
    console.log('   - 0 Ecclesias');
    console.log('   - 0 Products / Merchandise');
    console.log('   - 0 Orders');

    const [eventsCount] = await client`SELECT count(*) FROM "events"`;
    const [ecclesiasCount] = await client`SELECT count(*) FROM "ecclesias"`;
    const [productsCount] = await client`SELECT count(*) FROM "products"`;

    console.log(`\nVerified DB state:`);
    console.log(`Events in DB:    ${eventsCount.count}`);
    console.log(`Ecclesias in DB: ${ecclesiasCount.count}`);
    console.log(`Products in DB:  ${productsCount.count}`);

    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to clear tables:', error);
    await client.end();
    process.exit(1);
  }
}

clearData();
