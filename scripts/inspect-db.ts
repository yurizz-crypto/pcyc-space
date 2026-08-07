import postgres from 'postgres';

async function inspect() {
  const databaseUrl = process.env.DATABASE_URL || process.env.DIRECT_URL || '';
  const client = postgres(databaseUrl, { prepare: false });

  try {
    console.log('--- TABLES IN PUBLIC SCHEMA ---');
    const tables = await client`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log(tables.map((t) => t.table_name));

    console.log('\n--- ORDER_ITEMS COLUMNS ---');
    const orderItemCols = await client`SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_name = 'order_items'`;
    console.log(orderItemCols);

    console.log('\n--- ORDER_ITEMS CONSTRAINTS ---');
    const constraints = await client`SELECT conname, contype, pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid = 'order_items'::regclass`;
    console.log(constraints);

    console.log('\n--- EVENTS COLUMNS ---');
    const eventCols = await client`SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_name = 'events'`;
    console.log(eventCols);

    console.log('\n--- EVENT_REGISTRATIONS COLUMNS ---');
    const eventRegCols = await client`SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_name = 'event_registrations'`;
    console.log(eventRegCols);

    await client.end();
  } catch (err) {
    console.error('Error during inspect:', err);
    await client.end();
  }
}

inspect();
