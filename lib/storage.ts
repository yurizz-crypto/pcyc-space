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
 * Validates and saves an uploaded image file to the local public/uploads directory.
 * @param file Uploaded File object from FormData
 * @param folder Subfolder name within public/uploads (e.g. 'events' or 'merch')
 * @param prefix Slug or identifier prefix for unique naming
 */
export async function saveUploadedImage(
  file: File | null,
  folder: 'events' | 'merch',
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

  const targetDir = path.join(process.cwd(), 'public', 'uploads', folder);
  const targetPath = path.join(targetDir, fileName);

  try {
    // Ensure directory exists
    await fs.mkdir(targetDir, { recursive: true });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await fs.writeFile(targetPath, buffer);

    const publicUrl = `/uploads/${folder}/${fileName}`;
    logger.info({ publicUrl, size: file.size }, 'Image uploaded and saved successfully');

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error: any) {
    logger.error({ error: error?.message, targetPath }, 'Failed to save uploaded image');
    return {
      success: false,
      error: 'Server failed to store image file. Please try again.',
    };
  }
}
