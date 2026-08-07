/**
 * Application Routing Zones Configuration
 * Enforces strict architectural separation between Public, Restricted-Public (Guest-only),
 * and Private (Protected Member & Admin) surfaces.
 */

export const ROUTE_ZONES = {
  /**
   * Public Zone: Fully open to unauthenticated and authenticated traffic.
   */
  PUBLIC: ['/', '/about', '/events', '/merch', '/api/health'],

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

  // 3. Check Restricted-Public (Guest Only)
  if (ROUTE_ZONES.RESTRICTED_PUBLIC.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    return 'RESTRICTED_PUBLIC';
  }

  // 4. Default: Public Zone
  return 'PUBLIC';
}
