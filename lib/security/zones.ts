/**
 * Application Routing Zones Configuration
 * Enforces strict architectural separation between Public, Restricted-Public (Guest-only),
 * and Private (Protected Member & Admin) surfaces.
 */

export const ROUTE_ZONES = {
  /**
   * Public Zone: Fully open to unauthenticated and authenticated traffic.
   * Includes API routes and auth callback endpoints.
   */
  PUBLIC: ['/', '/about', '/events', '/merch', '/api/health', '/api/auth'],

  /**
   * Auth Recovery Zone: Pages that need to be accessible by authenticated
   * users during auth flows (e.g., password reset after clicking email link).
   * These are NOT redirected even if the user has an active session.
   */
  AUTH_RECOVERY: ['/reset-password/update'],

  /**
   * Restricted-Public (Guest-Only) Zone:
   * Accessible ONLY by unauthenticated guests.
   * If an authenticated user visits, they are immediately redirected to /portal or /admin.
   */
  RESTRICTED_PUBLIC: ['/login', '/register', '/reset-password'],

  /**
   * Private Member Zone:
   * Requires valid authenticated session (Brother, Sister, Friend, Admin).
   */
  PRIVATE_MEMBER_PREFIX: '/portal',

  /**
   * Private Admin Zone:
   * Requires authenticated session with ADMIN or SUPERADMIN privileges.
   */
  PRIVATE_ADMIN_PREFIX: '/admin',
} as const;

export type RouteZoneType = 'PUBLIC' | 'RESTRICTED_PUBLIC' | 'PRIVATE_MEMBER' | 'PRIVATE_ADMIN';

/**
 * Fast O(1) determination of the route zone for a given URL pathname.
 */
export function classifyRouteZone(pathname: string): RouteZoneType {
  // 1. Check Admin prefix
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return 'PRIVATE_ADMIN';
  }

  // 2. Check Member Portal prefix
  if (pathname === '/portal' || pathname.startsWith('/portal/')) {
    return 'PRIVATE_MEMBER';
  }

  // 3. Check Auth Recovery routes (must come BEFORE RESTRICTED_PUBLIC check)
  // These pages need to be accessible even when the user has a valid session
  // (e.g., /reset-password/update after clicking a recovery email link)
  if (ROUTE_ZONES.AUTH_RECOVERY.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    return 'PUBLIC';
  }

  // 4. Check Public zone (API routes, static pages)
  if (ROUTE_ZONES.PUBLIC.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    return 'PUBLIC';
  }

  // 5. Check Restricted-Public (Guest Only) — exact match only, not sub-paths
  if (ROUTE_ZONES.RESTRICTED_PUBLIC.some((route) => pathname === route)) {
    return 'RESTRICTED_PUBLIC';
  }

  // 6. Default: Public Zone
  return 'PUBLIC';
}
