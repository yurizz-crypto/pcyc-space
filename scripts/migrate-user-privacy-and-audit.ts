import postgres from 'postgres';

async function migrate() {
  const databaseUrl = process.env.DATABASE_URL || process.env.DIRECT_URL || '';
  if (!databaseUrl) {
    console.error('DATABASE_URL not found in environment');
    process.exit(1);
  }

  const sql = postgres(databaseUrl, { prepare: false });

  console.log('--- Starting User Privacy & Audit Log Migration ---');

  try {
    // 1. Create user_status enum
    console.log('Creating user_status enum if not exists...');
    await sql.unsafe(`
      DO $$ BEGIN
        CREATE TYPE user_status AS ENUM('ACTIVE', 'SUSPENDED', 'ANONYMIZED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    console.log('✓ user_status enum ready.');

    // 2. Add status, is_anonymized, last_active_at columns to profiles
    console.log('Updating profiles table with status and privacy flags...');
    await sql.unsafe(`
      ALTER TABLE profiles
      ADD COLUMN IF NOT EXISTS status user_status DEFAULT 'ACTIVE' NOT NULL,
      ADD COLUMN IF NOT EXISTS is_anonymized boolean DEFAULT false NOT NULL,
      ADD COLUMN IF NOT EXISTS last_active_at timestamp with time zone;
    `);
    console.log('✓ profiles table updated.');

    // 3. Create audit_logs table
    console.log('Creating audit_logs table if not exists...');
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        actor_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
        actor_email text NOT NULL,
        action text NOT NULL,
        target_id text,
        target_type text DEFAULT 'USER' NOT NULL,
        details jsonb DEFAULT '{}'::jsonb,
        ip_address text,
        user_agent text,
        created_at timestamp with time zone DEFAULT now() NOT NULL
      );
    `);
    console.log('✓ audit_logs table ready.');

    // 4. Create performance and compliance indexes on audit_logs and profiles
    console.log('Creating indexes on audit_logs and profiles...');
    await sql.unsafe(`
      CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON audit_logs (actor_id);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_target_id ON audit_logs (target_id);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs (action);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs (created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles (status);
      CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles (created_at DESC);
    `);
    console.log('✓ Indexes successfully applied.');

    // 5. Enable RLS on audit_logs
    console.log('Enabling RLS on audit_logs...');
    await sql.unsafe(`
      ALTER TABLE IF EXISTS public.audit_logs ENABLE ROW LEVEL SECURITY;

      DROP POLICY IF EXISTS "Allow admins to view audit logs" ON public.audit_logs;
      DROP POLICY IF EXISTS "Allow system/admins to insert audit logs" ON public.audit_logs;

      CREATE POLICY "Allow admins to view audit logs"
        ON public.audit_logs FOR SELECT
        TO authenticated
        USING (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role IN ('ADMIN', 'SUPERADMIN')
          )
        );

      CREATE POLICY "Allow system/admins to insert audit logs"
        ON public.audit_logs FOR INSERT
        TO authenticated
        WITH CHECK (true);
    `);
    console.log('✓ RLS policies for audit_logs applied.');

    console.log('\n--- Migration Successfully Completed! ---');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await sql.end();
  }
}

migrate();
