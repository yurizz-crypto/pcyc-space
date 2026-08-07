'use server';

import { db } from '@/lib/db';
import { products } from '@/lib/db/schema/products';
import { getCurrentUserProfile } from '@/lib/db/queries/users';
import { productSchema } from '@/lib/validators';
import { logger } from '@/lib/logger';
import { saveUploadedImage } from '@/lib/storage';
import { revalidatePath } from 'next/cache';
import { CACHE_TAGS, invalidateCacheTag } from '@/lib/db/queries/cached';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';

export interface AdminProductActionState {
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * Server Action for Admins to add new Merchandise to PostgreSQL database.
 */
export async function createProductAction(
  prevState: AdminProductActionState,
  formData: FormData
): Promise<AdminProductActionState> {
  const profile = await getCurrentUserProfile();
  if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'SUPERADMIN')) {
    return {
      success: false,
      error: 'Unauthorized: Admin privileges required to manage merchandise.',
    };
  }

  // Handle Image File from Device Upload
  let imageUrl = '/images/logo/pcyc-transparent-logo.png';
  const imageFile = formData.get('imageFile') as File | null;

  if (imageFile && imageFile.size > 0) {
    const slugPrefix = (formData.get('slug') as string) || 'product';
    const uploadResult = await saveUploadedImage(imageFile, 'merch', slugPrefix);

    if (!uploadResult.success) {
      return {
        success: false,
        error: uploadResult.error || 'Failed to upload merchandise image.',
      };
    }

    imageUrl = uploadResult.url!;
  }

  const rawSizes = formData.getAll('sizes');
  const sizes = rawSizes.length > 0 ? (rawSizes as string[]) : ['XS', 'S', 'M', 'L', 'XL', '2XL'];

  const rawData = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    price: formData.get('price') ? Number(formData.get('price')) : 0,
    category: formData.get('category') || 'Apparel',
    stockQuantity: formData.get('stockQuantity') ? Number(formData.get('stockQuantity')) : 0,
    imageUrls: [imageUrl],
    availableSizes: sizes,
    isAvailable: formData.get('isAvailable') === 'on' || formData.get('isAvailable') === 'true',
    isPreorder: formData.get('isPreorder') === 'on' || formData.get('isPreorder') === 'true',
  };

  const parsed = productSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Please correct the highlighted errors in the form.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await db.insert(products).values({
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description,
      price: parsed.data.price.toFixed(2),
      category: parsed.data.category,
      stockQuantity: parsed.data.stockQuantity,
      imageUrls: parsed.data.imageUrls,
      availableSizes: parsed.data.availableSizes,
      isAvailable: parsed.data.isAvailable ?? true,
      isPreorder: parsed.data.isPreorder ?? false,
    });

    logger.info({ slug: parsed.data.slug, adminId: profile.id }, 'New product created by admin');
  } catch (error: any) {
    logger.error({ error: error?.message }, 'Failed to insert product into database');
    return {
      success: false,
      error: error?.message?.includes('duplicate key')
        ? 'A product with this URL slug already exists. Please choose a unique slug.'
        : 'Failed to create merchandise item. Please try again.',
    };
  }

  invalidateCacheTag(CACHE_TAGS.products, CACHE_TAGS.productsAvailable);
  revalidatePath('/merch');
  revalidatePath('/admin/merch');
  revalidatePath('/');
  redirect('/admin/merch');
}

/**
 * Server Action for Admins to update an existing Merchandise Product in PostgreSQL.
 * 
 * DevSecOps & Security Considerations:
 * 1. RBAC Guard: Confirms session user has ADMIN or SUPERADMIN privileges.
 * 2. Input Sanitization: Zod schema (productSchema) ensures positive price, valid inventory count, and sanitized slug.
 * 3. File Security: Enforces 5MB max, MIME whitelist, and isolated storage namespace.
 * 4. Observability: Emits structured logs for telemetry monitoring on inventory mutations.
 * 5. Parameterized Queries: Prevents SQL injection attacks via Drizzle ORM.
 */
export async function updateProductAction(
  prevState: AdminProductActionState,
  formData: FormData
): Promise<AdminProductActionState> {
  const productId = formData.get('productId') as string;
  if (!productId) {
    logger.warn('Update product attempt rejected: missing productId');
    return {
      success: false,
      error: 'Invalid request: Product ID is required.',
    };
  }

  // 1. RBAC Guard
  const profile = await getCurrentUserProfile();
  if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'SUPERADMIN')) {
    logger.warn({ productId, userId: profile?.id }, 'Unauthorized attempt to edit product');
    return {
      success: false,
      error: 'Unauthorized: Admin privileges required to manage merchandise.',
    };
  }

  // 2. Image Resolution (Preserve existing image unless replacement is uploaded)
  let imageUrl = (formData.get('existingImageUrl') as string) || '/images/logo/pcyc-transparent-logo.png';
  const imageFile = formData.get('imageFile') as File | null;

  if (imageFile && imageFile.size > 0) {
    const slugPrefix = (formData.get('slug') as string) || 'product';
    const uploadResult = await saveUploadedImage(imageFile, 'merch', slugPrefix);

    if (!uploadResult.success) {
      logger.warn({ error: uploadResult.error, productId }, 'Merchandise image upload rejected during edit');
      return {
        success: false,
        error: uploadResult.error || 'Failed to upload new merchandise image.',
      };
    }

    imageUrl = uploadResult.url!;
  }

  // 3. Extract and Sanitize Inputs
  const rawSizes = formData.getAll('sizes');
  const sizes = rawSizes.length > 0 ? (rawSizes as string[]) : ['XS', 'S', 'M', 'L', 'XL', '2XL'];

  const rawData = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    price: formData.get('price') ? Number(formData.get('price')) : 0,
    category: formData.get('category') || 'Apparel',
    stockQuantity: formData.get('stockQuantity') ? Number(formData.get('stockQuantity')) : 0,
    imageUrls: [imageUrl],
    availableSizes: sizes,
    isAvailable: formData.get('isAvailable') === 'on' || formData.get('isAvailable') === 'true',
    isPreorder: formData.get('isPreorder') === 'on' || formData.get('isPreorder') === 'true',
  };

  const parsed = productSchema.safeParse(rawData);
  if (!parsed.success) {
    logger.warn({ productId, fieldErrors: parsed.error.flatten().fieldErrors }, 'Product update failed schema validation');
    return {
      success: false,
      error: 'Please correct the highlighted errors in the form.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // 4. Parameterized Database Mutation
  try {
    await db
      .update(products)
      .set({
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description,
        price: parsed.data.price.toFixed(2),
        category: parsed.data.category,
        stockQuantity: parsed.data.stockQuantity,
        imageUrls: parsed.data.imageUrls,
        availableSizes: parsed.data.availableSizes,
        isAvailable: parsed.data.isAvailable ?? true,
        isPreorder: parsed.data.isPreorder ?? false,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId));

    logger.info(
      {
        productId,
        slug: parsed.data.slug,
        adminId: profile.id,
        price: parsed.data.price,
        stock: parsed.data.stockQuantity,
      },
      'Product successfully updated by administrator'
    );
  } catch (error: any) {
    logger.error({ error: error?.message, productId }, 'Failed to update product in database');
    return {
      success: false,
      error: error?.message?.includes('duplicate key')
        ? 'A product with this URL slug already exists. Please choose a unique slug.'
        : 'Failed to update merchandise item. Please try again.',
    };
  }

  // 5. Cache Revalidation & Navigation
  invalidateCacheTag(
    CACHE_TAGS.products,
    CACHE_TAGS.productsAvailable,
    CACHE_TAGS.product(parsed.data.slug)
  );
  revalidatePath('/merch');
  revalidatePath(`/merch/${parsed.data.slug}`);
  revalidatePath('/admin/merch');
  revalidatePath('/');
  redirect('/admin/merch');
}

/**
 * Server Action for Admins to delete a Product via form submission.
 */
export async function deleteProductAction(formData: FormData): Promise<void> {
  const productId = formData.get('productId') as string;
  if (!productId) return;

  const profile = await getCurrentUserProfile();
  if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'SUPERADMIN')) {
    logger.warn({ productId }, 'Unauthorized attempt to delete product');
    return;
  }

  try {
    await db.delete(products).where(eq(products.id, productId));
    logger.info({ productId, adminId: profile.id }, 'Product deleted by administrator');
    invalidateCacheTag(CACHE_TAGS.products, CACHE_TAGS.productsAvailable);
    revalidatePath('/merch');
    revalidatePath('/admin/merch');
    revalidatePath('/');
  } catch (error: any) {
    logger.error({ error: error?.message, productId }, 'Failed to delete product');
  }
}

