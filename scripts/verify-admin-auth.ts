import { createClient } from '@supabase/supabase-js';
import { db } from '../lib/db';
import { profiles } from '../lib/db/schema/users';
import { eq } from 'drizzle-orm';

async function check() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  console.log('--- SUPABASE CONFIG ---');
  console.log('URL:', supabaseUrl);
  console.log('Service Key Available:', !!serviceKey);
  console.log('Anon Key Available:', !!anonKey);

  const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: { users }, error: listErr } = await supabaseAdmin.auth.admin.listUsers();
  if (listErr) {
    console.error('Failed to list auth users:', listErr);
  } else {
    console.log(`Found ${users?.length || 0} users in Supabase Auth:`);
    users?.forEach((u) => {
      console.log(` - ID: ${u.id}, Email: ${u.email}, Role in metadata: ${u.user_metadata?.role || u.app_metadata?.role || 'NONE'}`);
    });
  }

  const dbProfiles = await db.select().from(profiles);
  console.log(`\nFound ${dbProfiles.length} profiles in PostgreSQL:`);
  dbProfiles.forEach((p) => {
    console.log(` - ID: ${p.id}, Email: ${p.email}, Role: ${p.role}, Name: ${p.firstName} ${p.lastName}`);
  });

  // Test sign in with password using anon client if environment credentials provided
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    const supabaseClient = createClient(supabaseUrl, anonKey);
    const { data: signInData, error: signInErr } = await supabaseClient.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });

    if (signInErr) {
      console.error('\n❌ Sign in test failed:', signInErr.message);
    } else {
      console.log(`\n✅ Sign in test succeeded for ${adminEmail}! User ID:`, signInData.user.id);
      console.log('User metadata:', signInData.user.user_metadata);
      console.log('App metadata:', signInData.user.app_metadata);
    }
  }
}

check().catch(console.error);
