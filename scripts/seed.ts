import { createClient } from '@supabase/supabase-js';
import postgres from 'postgres';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const databaseUrl = process.env.DATABASE_URL || process.env.DIRECT_URL!;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const client = postgres(databaseUrl, { prepare: false });

async function seed() {
  console.log('🌱 Starting PCYC Space database initialization (ZERO MOCK / ZERO AUTO-POPULATION)...');

  try {
    // 0. Ensure tables exist in Postgres
    console.log('📦 Ensuring tables exist...');

    await client.unsafe(`
      CREATE TABLE IF NOT EXISTS "profiles" (
        "id" uuid PRIMARY KEY,
        "email" text NOT NULL,
        "first_name" text NOT NULL,
        "middle_name" text,
        "last_name" text NOT NULL,
        "designation" text NOT NULL DEFAULT 'FRIEND',
        "baptism_date" date,
        "ecclesia" text,
        "phone_number" text,
        "avatar_url" text,
        "role" text NOT NULL DEFAULT 'MEMBER',
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "updated_at" timestamp with time zone NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS "events" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "title" text NOT NULL,
        "slug" text NOT NULL UNIQUE,
        "description" text NOT NULL,
        "theme" text,
        "banner_url" text,
        "start_date" timestamp with time zone NOT NULL,
        "end_date" timestamp with time zone NOT NULL,
        "location" text NOT NULL,
        "is_published" boolean NOT NULL DEFAULT false,
        "status" text NOT NULL DEFAULT 'UPCOMING',
        "max_attendees" integer,
        "registration_deadline" timestamp with time zone,
        "created_by_id" uuid REFERENCES "profiles"("id"),
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "updated_at" timestamp with time zone NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS "products" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" text NOT NULL,
        "slug" text NOT NULL UNIQUE,
        "description" text NOT NULL,
        "price" numeric(10, 2) NOT NULL,
        "category" text NOT NULL DEFAULT 'Apparel',
        "stock_quantity" integer NOT NULL DEFAULT 0,
        "image_urls" text[] NOT NULL DEFAULT '{"/images/logo/pcyc-transparent-logo.png"}',
        "available_sizes" text[] NOT NULL DEFAULT '{"XS","S","M","L","XL","2XL"}',
        "is_available" boolean NOT NULL DEFAULT true,
        "is_preorder" boolean NOT NULL DEFAULT false,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "updated_at" timestamp with time zone NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS "orders" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL REFERENCES "profiles"("id") ON DELETE CASCADE,
        "order_number" text NOT NULL UNIQUE,
        "total_amount" numeric(10, 2) NOT NULL,
        "status" text NOT NULL DEFAULT 'PENDING_PAYMENT',
        "shipping_info" jsonb NOT NULL,
        "notes" text,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "updated_at" timestamp with time zone NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS "payment_receipts" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "order_id" uuid NOT NULL UNIQUE REFERENCES "orders"("id") ON DELETE CASCADE,
        "receipt_image_url" text NOT NULL,
        "payment_method" text NOT NULL,
        "reference_number" text,
        "amount_paid" numeric(10, 2),
        "verification_status" text NOT NULL DEFAULT 'PENDING',
        "verification_notes" text,
        "verified_by_id" uuid REFERENCES "profiles"("id"),
        "verified_at" timestamp with time zone,
        "created_at" timestamp with time zone NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS "ecclesias" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" text NOT NULL,
        "region" text NOT NULL,
        "city" text NOT NULL,
        "address" text NOT NULL,
        "contact_person" text,
        "meeting_schedule" text NOT NULL,
        "is_displayed" boolean NOT NULL DEFAULT true,
        "order_index" integer NOT NULL DEFAULT 0,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "updated_at" timestamp with time zone NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS "site_settings" (
        "key" text PRIMARY KEY,
        "value" text NOT NULL,
        "description" text,
        "updated_at" timestamp with time zone NOT NULL DEFAULT now()
      );
    `);
    console.log('✅ PostgreSQL tables verified.');

    // 1. Provision Admin Account
    const adminEmail = 'admin@pcyc.ph';
    const adminPassword = 'PcycAdmin2026!';
    console.log(`🔐 Provisioning Admin Account: ${adminEmail}...`);

    let adminUserId: string | null = null;

    const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = usersData.users.find((u) => u.email === adminEmail);

    if (existingUser) {
      adminUserId = existingUser.id;
      await supabaseAdmin.auth.admin.updateUserById(adminUserId, {
        password: adminPassword,
        email_confirm: true,
        user_metadata: {
          firstName: 'PCYC',
          lastName: 'Administrator',
          designation: 'BROTHER',
          ecclesia: 'Cubao Ecclesia',
        },
      });
      console.log(`✅ Existing admin auth user updated: ${adminUserId}`);
    } else {
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: {
          firstName: 'PCYC',
          lastName: 'Administrator',
          designation: 'BROTHER',
          ecclesia: 'Cubao Ecclesia',
        },
      });

      if (createError || !newUser.user) {
        throw new Error(`Failed to create admin user in Supabase: ${createError?.message}`);
      }
      adminUserId = newUser.user.id;
      console.log(`✅ New admin auth user created: ${adminUserId}`);
    }

    // Upsert into `profiles` table
    await client`
      INSERT INTO "profiles" (
        "id", "email", "first_name", "last_name", "designation", "role", "updated_at"
      ) VALUES (
        ${adminUserId}::uuid,
        ${adminEmail},
        'PCYC',
        'Administrator',
        'BROTHER',
        'SUPERADMIN',
        now()
      )
      ON CONFLICT ("id") DO UPDATE SET
        "email" = EXCLUDED."email",
        "first_name" = EXCLUDED."first_name",
        "last_name" = EXCLUDED."last_name",
        "designation" = EXCLUDED."designation",
        "role" = 'SUPERADMIN',
        "updated_at" = now();
    `;
    console.log('✅ Admin profile secured with SUPERADMIN privileges.');

    // 2. Initialize Site Settings (Default Youth & Friends count)
    console.log('⚙️ Ensuring Site Settings...');
    await client`
      INSERT INTO "site_settings" ("key", "value", "description", "updated_at")
      VALUES ('youth_and_friends_count', '1', 'Number of youth & friends displayed on Home Page', now())
      ON CONFLICT ("key") DO NOTHING;
    `;
    console.log('✅ Site Settings ensured.');

    console.log('\n✨ ZERO AUTO-POPULATION: Database ready for live Admin data entry!');
    console.log(`\n========================================`);
    console.log(`🔑 ADMIN LOGIN CREDENTIALS:`);
    console.log(`Email:    ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`Role:     SUPERADMIN`);
    console.log(`========================================\n`);

    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    await client.end();
    process.exit(1);
  }
}

seed();
