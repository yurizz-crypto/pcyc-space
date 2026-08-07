import { createClient } from '@supabase/supabase-js';

async function checkStorage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error('Error listing buckets:', error);
    return;
  }

  console.log('Current Supabase Storage Buckets:', buckets.map(b => ({ name: b.name, public: b.public })));
}

checkStorage().catch(console.error);
