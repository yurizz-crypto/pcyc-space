import { createClient } from '@supabase/supabase-js';
import postgres from 'postgres';

async function syncProfiles() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const databaseUrl = process.env.DATABASE_URL || process.env.DIRECT_URL || '';

  if (!supabaseUrl || !serviceRoleKey || !databaseUrl) {
    console.error('❌ Missing database or Supabase configuration in environment variables.');
    process.exit(1);
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const client = postgres(databaseUrl, { prepare: false });

  console.log('🔄 Synchronizing PostgreSQL profiles with Supabase Auth users...');

  try {
    // 1. Fetch all active auth users
    const { data: usersData, error: listErr } = await supabaseAdmin.auth.admin.listUsers();
    if (listErr) {
      throw new Error(`Failed to list auth users: ${listErr.message}`);
    }

    const activeUserIds = new Set(usersData.users.map((u) => u.id));
    console.log(`Active Supabase Auth Users: ${activeUserIds.size}`);

    // 2. Fetch all profiles in PostgreSQL
    const dbProfiles = await client`SELECT id, email, first_name, last_name FROM "profiles"`;
    console.log(`PostgreSQL Profiles Count: ${dbProfiles.length}`);

    // 3. Identify and delete orphaned profiles
    let deletedCount = 0;
    for (const profile of dbProfiles) {
      if (!activeUserIds.has(profile.id)) {
        console.log(`🗑️ Deleting orphaned profile: ${profile.id} (${profile.email} - ${profile.first_name} ${profile.last_name})`);
        await client`DELETE FROM "profiles" WHERE "id" = ${profile.id}::uuid`;
        deletedCount++;
      }
    }

    console.log(`✅ Cleanup complete: ${deletedCount} orphaned profile(s) removed.`);

    // 4. Ensure foreign key / trigger with cascade exists if possible
    try {
      await client.unsafe(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'profiles_id_auth_users_fkey'
          ) THEN
            ALTER TABLE "profiles"
            ADD CONSTRAINT "profiles_id_auth_users_fkey"
            FOREIGN KEY ("id")
            REFERENCES auth.users("id")
            ON DELETE CASCADE;
          END IF;
        END $$;
      `);
      console.log('✅ Foreign key ON DELETE CASCADE linked between profiles and auth.users.');
    } catch (fkErr: any) {
      console.log('ℹ️ Foreign key constraint notice:', fkErr?.message);
    }

    const finalProfiles = await client`SELECT COUNT(*)::int as count FROM "profiles"`;
    console.log(`📊 Final Profiles Count in PostgreSQL: ${finalProfiles[0].count}`);

    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Profile sync failed:', error);
    await client.end();
    process.exit(1);
  }
}

syncProfiles();
