import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { db } from '../lib/db';
import { products } from '../lib/db/schema/products';
import { events } from '../lib/db/schema/events';
import { eq } from 'drizzle-orm';

async function syncUploads() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // 1. Sync Merch Images
  const allProducts = await db.select().from(products);
  for (const prod of allProducts) {
    const newImageUrls: string[] = [];
    for (const imgUrl of prod.imageUrls || []) {
      if (imgUrl.startsWith('/uploads/merch/')) {
        const fileName = path.basename(imgUrl);
        const localFilePath = path.join(process.cwd(), 'public', 'uploads', 'merch', fileName);
        try {
          const fileBuffer = await fs.readFile(localFilePath);
          const { error } = await supabase.storage.from('merch').upload(fileName, fileBuffer, {
            contentType: 'image/jpeg',
            upsert: true,
          });

          if (error) {
            console.error(`Failed to upload ${fileName} to merch bucket:`, error);
            newImageUrls.push(imgUrl);
          } else {
            const { data: { publicUrl } } = supabase.storage.from('merch').getPublicUrl(fileName);
            console.log(`✅ Uploaded merch image to Supabase: ${publicUrl}`);
            newImageUrls.push(publicUrl);
          }
        } catch (err: any) {
          console.error(`Local file ${localFilePath} error:`, err?.message);
          newImageUrls.push(imgUrl);
        }
      } else {
        newImageUrls.push(imgUrl);
      }
    }

    await db.update(products).set({ imageUrls: newImageUrls }).where(eq(products.id, prod.id));
  }

  // 2. Sync Event Images
  const allEvents = await db.select().from(events);
  for (const evt of allEvents) {
    if (evt.imageUrl && evt.imageUrl.startsWith('/uploads/events/')) {
      const fileName = path.basename(evt.imageUrl);
      const localFilePath = path.join(process.cwd(), 'public', 'uploads', 'events', fileName);
      try {
        const fileBuffer = await fs.readFile(localFilePath);
        const { error } = await supabase.storage.from('events').upload(fileName, fileBuffer, {
          contentType: 'image/jpeg',
          upsert: true,
        });

        if (error) {
          console.error(`Failed to upload ${fileName} to events bucket:`, error);
        } else {
          const { data: { publicUrl } } = supabase.storage.from('events').getPublicUrl(fileName);
          console.log(`✅ Uploaded event image to Supabase: ${publicUrl}`);
          await db.update(events).set({ imageUrl: publicUrl }).where(eq(events.id, evt.id));
        }
      } catch (err: any) {
        console.error(`Local file ${localFilePath} error:`, err?.message);
      }
    }
  }

  console.log('✅ Sync completed!');
}

syncUploads().catch(console.error);
