import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { logger } from '@/lib/logger';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg'];

export interface SaveImageResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Validates and uploads an image to Supabase Storage (public bucket).
 * Falls back to local disk storage if Supabase credentials are not configured.
 * 
 * @param file Uploaded File object from FormData
 * @param bucket Bucket/Folder name ('events' | 'merch' | 'receipts')
 * @param prefix Identifier or slug prefix for unique naming
 */
export async function saveUploadedImage(
  file: File | null,
  bucket: 'events' | 'merch' | 'receipts' = 'merch',
  prefix: string = 'media'
): Promise<SaveImageResult> {
  if (!file || file.size === 0) {
    return { success: false, error: 'No file provided' };
  }

  // 1. Size Validation (Max 5MB)
  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: `File size exceeds the 5MB maximum limit (${(file.size / (1024 * 1024)).toFixed(2)}MB).`,
    };
  }

  // 2. MIME Type / Extension Validation
  const mimeType = file.type.toLowerCase();
  const originalExt = path.extname(file.name).toLowerCase();

  const isValidMime = ALLOWED_MIME_TYPES.includes(mimeType);
  const isValidExt = ALLOWED_EXTENSIONS.includes(originalExt);

  if (!isValidMime && !isValidExt) {
    return {
      success: false,
      error: 'Invalid file format. Only PNG and JPG/JPEG images are permitted.',
    };
  }

  const extension = isValidExt ? originalExt : mimeType === 'image/png' ? '.png' : '.jpg';
  const cleanPrefix = prefix.toLowerCase().replace(/[^a-z0-9_-]/g, '-').slice(0, 40);
  const fileName = `${cleanPrefix}-${Date.now()}${extension}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 3. Primary: Upload to Supabase Storage (Public Cloud Bucket)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && serviceKey && !supabaseUrl.includes('placeholder')) {
    try {
      const supabase = createClient(supabaseUrl, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, buffer, {
          contentType: mimeType || 'image/jpeg',
          upsert: true,
        });

      if (error) {
        logger.warn({ error: error.message, bucket, fileName }, 'Supabase Storage upload warning, falling back to local');
      } else {
        const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
        logger.info({ publicUrl: publicUrlData.publicUrl, bucket, fileName }, 'Image uploaded to Supabase Storage successfully');
        return {
          success: true,
          url: publicUrlData.publicUrl,
        };
      }
    } catch (supaErr: any) {
      logger.warn({ error: supaErr?.message }, 'Failed Supabase Storage upload, attempting local fallback');
    }
  }

  // 4. Fallback: Save to Local filesystem (public/uploads/[bucket]/[fileName])
  try {
    const targetDir = path.join(process.cwd(), 'public', 'uploads', bucket);
    await fs.mkdir(targetDir, { recursive: true });
    const targetPath = path.join(targetDir, fileName);
    await fs.writeFile(targetPath, buffer);

    const publicUrl = `/uploads/${bucket}/${fileName}`;
    logger.info({ publicUrl, size: file.size }, 'Image saved to local uploads directory fallback');

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error: any) {
    logger.error({ error: error?.message }, 'Failed to save image to storage');
    return {
      success: false,
      error: 'Server failed to store image file. Please try again.',
    };
  }
}
