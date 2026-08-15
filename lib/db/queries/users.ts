import { cache } from 'react';
import { db } from '@/lib/db';
import { profiles, type Profile } from '@/lib/db/schema/users';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { eq, desc, or, and, sql } from 'drizzle-orm';
import { logger } from '@/lib/logger';

/**
 * Fetches the authenticated user's profile from Drizzle by verifying the Supabase SSR session.
 * Memoized per server request lifecycle using React.cache().
 */
export const getCurrentUserProfile = cache(async function getCurrentUserProfile(): Promise<Profile | null> {
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
});

/**
 * Fetches a user's profile by ID.
 * Memoized per server request lifecycle.
 */
export const getUserProfileById = cache(async function getUserProfileById(
  userId: string
): Promise<Profile | null> {
  try {
    const userProfiles = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, userId))
      .limit(1);

    return userProfiles[0] || null;
  } catch (error: any) {
    if (
      error?.digest === 'DYNAMIC_SERVER_USAGE' ||
      error?.message?.includes('DYNAMIC_SERVER_USAGE') ||
      error?.digest?.startsWith('NEXT_')
    ) {
      throw error;
    }
    logger.error({ error: error?.message || error, userId }, 'Failed to fetch user profile by ID');
    return null;
  }
});

/**
 * Verifies that the current user is authenticated and possesses one of the allowed roles.
 * Leverages cached getCurrentUserProfile() within the same request lifecycle.
 */
export const verifyCurrentUserRole = cache(async function verifyCurrentUserRole(
  allowedRoles: ('MEMBER' | 'ADMIN' | 'SUPERADMIN')[]
): Promise<{ profile: Profile | null; authorized: boolean }> {
  const profile = await getCurrentUserProfile();
  if (!profile || !allowedRoles.includes(profile.role as any)) {
    return { profile: null, authorized: false };
  }
  return { profile, authorized: true };
});

/**
 * Fetches all registered youth members for the Admin directory.
 * Memoized per server request lifecycle.
 */
export const getAllMembers = cache(async function getAllMembers(): Promise<Profile[]> {
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
});

/**
 * Fetches all platform administrators (ADMIN and SUPERADMIN).
 * Memoized per server request lifecycle.
 */
export const getAdminProfiles = cache(async function getAdminProfiles(): Promise<Profile[]> {
  try {
    return await db
      .select()
      .from(profiles)
      .where(or(eq(profiles.role, 'ADMIN'), eq(profiles.role, 'SUPERADMIN')));
  } catch (error: any) {
    if (
      error?.digest === 'DYNAMIC_SERVER_USAGE' ||
      error?.message?.includes('DYNAMIC_SERVER_USAGE') ||
      error?.digest?.startsWith('NEXT_')
    ) {
      throw error;
    }
    logger.error({ error: error?.message || error }, 'Failed to fetch admin profiles');
    return [];
  }
});

export interface PaginatedUsersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
  designation?: string;
  ecclesia?: string;
  status?: string;
}

export interface PaginatedUsersResult {
  users: Profile[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Enterprise Paginated & Filtered Member/User Query for the Admin Directory.
 * Leverages indexed columns, SQL count(*), limit and offset.
 */
export const getPaginatedUsersForAdmin = cache(async function getPaginatedUsersForAdmin(
  params: PaginatedUsersParams = {}
): Promise<PaginatedUsersResult> {
  const {
    page = 1,
    pageSize = 15,
    search,
    role,
    designation,
    ecclesia,
    status,
  } = params;

  try {
    const conditions = [];

    // Filter by Role
    if (role && role !== 'ALL') {
      conditions.push(eq(profiles.role, role as any));
    }

    // Filter by Designation
    if (designation && designation !== 'ALL') {
      conditions.push(eq(profiles.designation, designation as any));
    }

    // Filter by Ecclesia
    if (ecclesia && ecclesia !== 'ALL') {
      conditions.push(eq(profiles.ecclesia, ecclesia));
    }

    // Filter by Account Status
    if (status && status !== 'ALL') {
      conditions.push(eq(profiles.status, status as any));
    }

    // Search by Name or Email
    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      const searchCondition = or(
        sql`concat(${profiles.firstName}, ' ', ${profiles.lastName}) ILIKE ${term}`,
        sql`${profiles.email} ILIKE ${term}`,
        sql`${profiles.ecclesia} ILIKE ${term}`
      );
      if (searchCondition) conditions.push(searchCondition);
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // 1. Get filtered total count
    const countRes = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(profiles)
      .where(whereClause);

    const totalCount = countRes[0]?.count ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const validPage = Math.max(1, Math.min(page, totalPages));
    const offset = (validPage - 1) * pageSize;

    // 2. Fetch page items with order
    const users = await db
      .select()
      .from(profiles)
      .where(whereClause)
      .orderBy(desc(profiles.createdAt))
      .limit(pageSize)
      .offset(offset);

    return {
      users,
      totalCount,
      page: validPage,
      pageSize,
      totalPages,
    };
  } catch (error: any) {
    if (
      error?.digest === 'DYNAMIC_SERVER_USAGE' ||
      error?.message?.includes('DYNAMIC_SERVER_USAGE') ||
      error?.digest?.startsWith('NEXT_')
    ) {
      throw error;
    }
    logger.error({ error: error?.message || error, params }, 'Failed to fetch paginated users');
    return {
      users: [],
      totalCount: 0,
      page: 1,
      pageSize,
      totalPages: 1,
    };
  }
});

/**
 * Fetch audit logs for a specific user.
 */
export const getUserAuditHistory = cache(async function getUserAuditHistory(
  userId: string,
  limit: number = 20
) {
  try {
    const { auditLogs } = await import('@/lib/db/schema/audit-logs');
    return await db
      .select()
      .from(auditLogs)
      .where(or(eq(auditLogs.targetId, userId), eq(auditLogs.actorId, userId)))
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit);
  } catch (error: any) {
    if (
      error?.digest === 'DYNAMIC_SERVER_USAGE' ||
      error?.message?.includes('DYNAMIC_SERVER_USAGE') ||
      error?.digest?.startsWith('NEXT_')
    ) {
      throw error;
    }
    logger.error({ error: error?.message || error, userId }, 'Failed to fetch user audit history');
    return [];
  }
});

