import { db } from '@/lib/db';
import { profiles, type Profile } from '@/lib/db/schema/users';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { eq, desc } from 'drizzle-orm';
import { logger } from '@/lib/logger';

/**
 * Fetches the authenticated user's profile from Drizzle by verifying the Supabase SSR session.
 */
export async function getCurrentUserProfile(): Promise<Profile | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    const userProfiles = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, user.id))
      .limit(1);

    return userProfiles[0] || null;
  } catch (error: any) {
    // Re-throw Next.js dynamic prerender bailouts
    if (
      error?.digest === 'DYNAMIC_SERVER_USAGE' ||
      error?.message?.includes('DYNAMIC_SERVER_USAGE') ||
      error?.digest?.startsWith('NEXT_')
    ) {
      throw error;
    }
    logger.error({ error: error?.message || error }, 'Failed to fetch current user profile');
    return null;
  }
}

/**
 * Verifies that the current user is authenticated and possesses one of the allowed roles.
 */
export async function verifyCurrentUserRole(
  allowedRoles: ('MEMBER' | 'ADMIN' | 'SUPERADMIN')[]
): Promise<{ profile: Profile | null; authorized: boolean }> {
  const profile = await getCurrentUserProfile();
  if (!profile || !allowedRoles.includes(profile.role as any)) {
    return { profile: null, authorized: false };
  }
  return { profile, authorized: true };
}

/**
 * Fetches all registered youth members for the Admin directory.
 */
export async function getAllMembers(): Promise<Profile[]> {
  try {
    return await db.select().from(profiles).orderBy(desc(profiles.createdAt));
  } catch (error: any) {
    if (
      error?.digest === 'DYNAMIC_SERVER_USAGE' ||
      error?.message?.includes('DYNAMIC_SERVER_USAGE') ||
      error?.digest?.startsWith('NEXT_')
    ) {
      throw error;
    }
    logger.error({ error: error?.message || error }, 'Failed to fetch all members for admin');
    return [];
  }
}
