import { createClient } from '@supabase/supabase-js';
import postgres from 'postgres';
import crypto from 'crypto';

/**
 * CLI Utility to provision or reset an Admin account securely.
 * Credentials are generated randomly or read from process.env.
 * They are printed ONLY to the terminal and NEVER written into the git repository.
 */

function generateSecurePassword(): string {
  const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%^&*()_+-=';
  let password = '';
  const randomBytes = crypto.randomBytes(24);
  for (let i = 0; i < 24; i++) {
    password += chars[randomBytes[i] % chars.length];
  }
  return password;
}

async function createAdmin() {
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

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@pcyc.ph';
  const adminPassword = process.env.ADMIN_PASSWORD || generateSecurePassword();

  console.log(`\n🔐 Securely provisioning Admin User: ${adminEmail}...`);

  try {
    let adminUserId: string | null = null;

    const { data: usersData, error: listErr } = await supabaseAdmin.auth.admin.listUsers();
    if (listErr) {
      throw new Error(`Failed to list auth users: ${listErr.message}`);
    }

    const existingUser = usersData.users.find((u) => u.email === adminEmail);

    if (existingUser) {
      adminUserId = existingUser.id;
      const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(adminUserId, {
        password: adminPassword,
        email_confirm: true,
        user_metadata: {
          firstName: 'PCYC',
          lastName: 'Administrator',
          designation: 'BROTHER',
          ecclesia: 'Cubao Ecclesia',
          role: 'SUPERADMIN',
        },
        app_metadata: {
          role: 'SUPERADMIN',
        },
      });

      if (updateErr) {
        throw new Error(`Failed to update existing user: ${updateErr.message}`);
      }
      console.log(`✅ Existing admin auth user password updated (${adminUserId})`);
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
          role: 'SUPERADMIN',
        },
        app_metadata: {
          role: 'SUPERADMIN',
        },
      });

      if (createError || !newUser.user) {
        throw new Error(`Failed to create admin user in Supabase: ${createError?.message}`);
      }
      adminUserId = newUser.user.id;
      console.log(`✅ Created new admin auth user (${adminUserId})`);
    }

    // Upsert into Postgres profiles table
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

    console.log('✅ Admin database profile updated with SUPERADMIN role.');
    console.log('\n' + '='.repeat(60));
    console.log('🎉 ADMIN PROVISIONING COMPLETE');
    console.log('='.repeat(60));
    console.log(`Email:    ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`Role:     SUPERADMIN`);
    console.log('='.repeat(60));
    console.log('⚠️  Store this password in a secure password manager.');
    console.log('    This password is NOT stored in any git-tracked file.\n');

    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to provision admin:', error);
    await client.end();
    process.exit(1);
  }
}

createAdmin();
