import postgres from 'postgres';

/**
 * Enterprise Database Performance Index Applier
 * Applies all composite and B-Tree indexes idempotently to PostgreSQL.
 */
async function applyIndexes() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('❌ Error: DATABASE_URL is not defined in environment.');
    process.exit(1);
  }

  console.log('⚡ Connecting to PostgreSQL database...');
  const sql = postgres(connectionString, {
    prepare: false,
    ssl: 'require',
    max: 1,
    connect_timeout: 15,
  });

  const indexStatements = [
    // 1. Events Table Indexes
    {
      name: 'idx_events_public_status',
      sql: 'CREATE INDEX IF NOT EXISTS idx_events_public_status ON events (is_published, status);',
    },
    {
      name: 'idx_events_start_date',
      sql: 'CREATE INDEX IF NOT EXISTS idx_events_start_date ON events (start_date);',
    },
    {
      name: 'idx_events_created_at',
      sql: 'CREATE INDEX IF NOT EXISTS idx_events_created_at ON events (created_at DESC);',
    },

    // 2. Event Registrations Table Indexes
    {
      name: 'idx_event_registrations_event_user',
      sql: 'CREATE UNIQUE INDEX IF NOT EXISTS idx_event_registrations_event_user ON event_registrations (event_id, user_id);',
    },
    {
      name: 'idx_event_registrations_user_id',
      sql: 'CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON event_registrations (user_id);',
    },
    {
      name: 'idx_event_registrations_event_id',
      sql: 'CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations (event_id);',
    },
    {
      name: 'idx_event_registrations_payment_status',
      sql: 'CREATE INDEX IF NOT EXISTS idx_event_registrations_payment_status ON event_registrations (payment_status);',
    },

    // 3. Orders Table Indexes
    {
      name: 'idx_orders_user_id',
      sql: 'CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders (user_id);',
    },
    {
      name: 'idx_orders_status',
      sql: 'CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);',
    },
    {
      name: 'idx_orders_created_at',
      sql: 'CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);',
    },

    // 4. Order Items Table Indexes
    {
      name: 'idx_order_items_order_id',
      sql: 'CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items (order_id);',
    },
    {
      name: 'idx_order_items_product_id',
      sql: 'CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items (product_id);',
    },

    // 5. Payment Receipts Table Indexes
    {
      name: 'idx_payment_receipts_order_id',
      sql: 'CREATE INDEX IF NOT EXISTS idx_payment_receipts_order_id ON payment_receipts (order_id);',
    },
    {
      name: 'idx_payment_receipts_status',
      sql: 'CREATE INDEX IF NOT EXISTS idx_payment_receipts_status ON payment_receipts (verification_status);',
    },

    // 6. Products Table Indexes
    {
      name: 'idx_products_availability',
      sql: 'CREATE INDEX IF NOT EXISTS idx_products_availability ON products (is_available, is_preorder);',
    },
    {
      name: 'idx_products_category',
      sql: 'CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);',
    },
    {
      name: 'idx_products_created_at',
      sql: 'CREATE INDEX IF NOT EXISTS idx_products_created_at ON products (created_at DESC);',
    },

    // 7. Profiles Table Indexes
    {
      name: 'idx_profiles_role',
      sql: 'CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles (role);',
    },
    {
      name: 'idx_profiles_status',
      sql: 'CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles (status);',
    },
    {
      name: 'idx_profiles_ecclesia',
      sql: 'CREATE INDEX IF NOT EXISTS idx_profiles_ecclesia ON profiles (ecclesia);',
    },
    {
      name: 'idx_profiles_email',
      sql: 'CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles (email);',
    },
    {
      name: 'idx_profiles_designation',
      sql: 'CREATE INDEX IF NOT EXISTS idx_profiles_designation ON profiles (designation);',
    },

    // 8. Ecclesias Table Indexes
    {
      name: 'idx_ecclesias_display_region',
      sql: 'CREATE INDEX IF NOT EXISTS idx_ecclesias_display_region ON ecclesias (is_displayed, region);',
    },
    {
      name: 'idx_ecclesias_order_index',
      sql: 'CREATE INDEX IF NOT EXISTS idx_ecclesias_order_index ON ecclesias (order_index);',
    },

    // 9. Audit Logs Table Indexes
    {
      name: 'idx_audit_logs_actor_id',
      sql: 'CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON audit_logs (actor_id);',
    },
    {
      name: 'idx_audit_logs_target_id',
      sql: 'CREATE INDEX IF NOT EXISTS idx_audit_logs_target_id ON audit_logs (target_id);',
    },
    {
      name: 'idx_audit_logs_action',
      sql: 'CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs (action);',
    },
    {
      name: 'idx_audit_logs_created_at',
      sql: 'CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs (created_at DESC);',
    },
  ];

  console.log(`\n🚀 Applying ${indexStatements.length} PostgreSQL Performance Indexes...\n`);

  let appliedCount = 0;
  for (const indexDef of indexStatements) {
    const startTime = performance.now();
    try {
      await sql.unsafe(indexDef.sql);
      const duration = (performance.now() - startTime).toFixed(2);
      console.log(`  ✅ [${duration}ms] ${indexDef.name}`);
      appliedCount++;
    } catch (err: any) {
      console.warn(`  ⚠️ Warning on ${indexDef.name}:`, err.message);
    }
  }

  // Verify all indexes in PostgreSQL catalog
  console.log('\n🔍 Verifying indexes in pg_indexes system catalog...');
  const existingIndexes = await sql`
    SELECT tablename, indexname, indexdef
    FROM pg_indexes
    WHERE schemaname = 'public' AND indexname LIKE 'idx_%'
    ORDER BY tablename, indexname;
  `;

  console.log(`\n📊 Verified Active Custom Indexes (${existingIndexes.length} Total):`);
  for (const row of existingIndexes) {
    console.log(`  • [${row.tablename}] -> ${row.indexname}`);
  }

  await sql.end();
  console.log(`\n✨ Phase 1 Indexing Complete: ${appliedCount}/${indexStatements.length} applied successfully!`);
}

applyIndexes().catch((err) => {
  console.error('Fatal indexing error:', err);
  process.exit(1);
});
