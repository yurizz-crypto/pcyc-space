import postgres from 'postgres';

const databaseUrl = process.env.DATABASE_URL || process.env.DIRECT_URL;

if (!databaseUrl) {
  console.error('❌ Missing DATABASE_URL / DIRECT_URL environment variable.');
  process.exit(1);
}

const sql = postgres(databaseUrl, { prepare: false });

async function migrateReviewsAndNormalization() {
  console.log('🚀 Migrating product_reviews schema & normalization...\n');

  try {
    // 1. Create product_reviews Table
    console.log('1️⃣ Creating product_reviews table...');
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS public.product_reviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
        order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT NOT NULL,
        is_hidden BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT uq_order_product_review UNIQUE (order_id, product_id)
      );
    `);
    console.log('   ✅ Table product_reviews created or verified.');

    // 2. Create Performance & Lookup Indexes
    console.log('\n2️⃣ Creating performance indexes on product_reviews...');
    await sql.unsafe(`
      CREATE INDEX IF NOT EXISTS idx_product_reviews_product_hidden ON public.product_reviews (product_id, is_hidden);
      CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON public.product_reviews (user_id);
      CREATE INDEX IF NOT EXISTS idx_product_reviews_order_id ON public.product_reviews (order_id);
      CREATE INDEX IF NOT EXISTS idx_product_reviews_created_at ON public.product_reviews (created_at DESC);
    `);
    console.log('   ✅ Performance indexes applied.');

    // 3. Enable RLS and Configure Policies
    console.log('\n3️⃣ Configuring Row Level Security (RLS) on product_reviews...');
    await sql.unsafe(`
      ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

      DROP POLICY IF EXISTS "Allow public to read visible product reviews" ON public.product_reviews;
      DROP POLICY IF EXISTS "Allow users to view own reviews" ON public.product_reviews;
      DROP POLICY IF EXISTS "Allow users to insert own review" ON public.product_reviews;
      DROP POLICY IF EXISTS "Allow users to update own review" ON public.product_reviews;
      DROP POLICY IF EXISTS "Allow admins to manage all reviews" ON public.product_reviews;

      -- 1. Public can read visible reviews
      CREATE POLICY "Allow public to read visible product reviews"
        ON public.product_reviews FOR SELECT
        TO anon, authenticated
        USING (is_hidden = false);

      -- 2. Authors can read their own reviews even if hidden
      CREATE POLICY "Allow users to view own reviews"
        ON public.product_reviews FOR SELECT
        TO authenticated
        USING (auth.uid() = user_id);

      -- 3. Users can insert review for themselves
      CREATE POLICY "Allow users to insert own review"
        ON public.product_reviews FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid() = user_id);

      -- 4. Users can update their own reviews
      CREATE POLICY "Allow users to update own review"
        ON public.product_reviews FOR UPDATE
        TO authenticated
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);

      -- 5. Admins can view and manage all reviews
      CREATE POLICY "Allow admins to manage all reviews"
        ON public.product_reviews FOR ALL
        TO authenticated
        USING (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role IN ('ADMIN', 'SUPERADMIN')
          )
        );
    `);
    console.log('   ✅ RLS policies for product_reviews successfully configured.');

    // 4. Verify Catalog
    console.log('\n4️⃣ Verifying product_reviews in PostgreSQL catalog...');
    const result = await sql`
      SELECT tablename, rowsecurity
      FROM pg_tables
      WHERE schemaname = 'public' AND tablename = 'product_reviews';
    `;
    console.table(result);

    await sql.end();
    console.log('\n🎉 Product Reviews Migration Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    await sql.end();
    process.exit(1);
  }
}

migrateReviewsAndNormalization();
