import postgres from 'postgres';

async function migrate() {
  const databaseUrl = process.env.DATABASE_URL || process.env.DIRECT_URL || '';
  if (!databaseUrl) {
    console.error('DATABASE_URL not found');
    process.exit(1);
  }

  const sql = postgres(databaseUrl, { prepare: false });

  console.log('--- Starting Database Migration ---');

  try {
    // 1. Ensure order_items table exists
    console.log('Creating order_items table if not exists...');
    await sql`
      CREATE TABLE IF NOT EXISTS order_items (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        product_id uuid NOT NULL REFERENCES products(id),
        quantity integer NOT NULL,
        unit_price numeric(10, 2) NOT NULL,
        selected_size text,
        created_at timestamp with time zone DEFAULT now() NOT NULL
      );
    `;
    console.log('✓ order_items table ready.');

    // 2. Add registration_fee to events table if missing
    console.log('Checking registration_fee column on events table...');
    await sql`
      ALTER TABLE events
      ADD COLUMN IF NOT EXISTS registration_fee numeric(10, 2) DEFAULT 0.00 NOT NULL;
    `;
    console.log('✓ events table updated with registration_fee.');

    // 3. Create or update event_registrations table
    console.log('Creating event_registrations table if not exists...');
    await sql`
      CREATE TABLE IF NOT EXISTS event_registrations (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        status text DEFAULT 'CONFIRMED' NOT NULL,
        payment_option text DEFAULT 'VENUE_DESK' NOT NULL,
        payment_status text DEFAULT 'UNPAID' NOT NULL,
        reference_number text,
        receipt_image_url text,
        amount_paid numeric(10, 2),
        special_requirements text,
        registered_at timestamp with time zone DEFAULT now() NOT NULL,
        CONSTRAINT unique_event_user_reg UNIQUE (event_id, user_id)
      );
    `;
    console.log('✓ event_registrations table ready.');

    // 4. Ensure payment_receipts table has ON DELETE CASCADE on order_id
    console.log('Ensuring payment_receipts foreign keys...');
    await sql`
      ALTER TABLE payment_receipts
      DROP CONSTRAINT IF EXISTS payment_receipts_order_id_orders_id_fk;
    `;
    await sql`
      ALTER TABLE payment_receipts
      ADD CONSTRAINT payment_receipts_order_id_orders_id_fk
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;
    `;
    console.log('✓ payment_receipts foreign keys configured.');

    console.log('\n--- Migration Successfully Completed! ---');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await sql.end();
  }
}

migrate();
