import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { evaluateRateLimit, getClientIp } from '@/lib/security/rate-limiter';
import { classifyRouteZone } from '@/lib/security/zones';
import { logSecurityEventNonBlocking } from '@/lib/security/telemetry';

/**
 * High-Performance Security & Routing Middleware
 *
 * Architecture:
 * 1. Early-Termination Rate Limiting (O(1) sliding window)
 * 2. Zero-Database Stateless Auth Verification (JWT via cookies)
 * 3. Strict Zone Routing (Public, Restricted-Public, Private Member, Private Admin)
 * 4. Non-Blocking Telemetry & Header Enrichment
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname;
  const clientIp = getClientIp(request);
  const method = request.method;

  // =========================================================================
  // STEP 1: Early-Termination Rate Limiter (0 database / 0 downstream CPU)
  // =========================================================================
  const rateLimit = evaluateRateLimit(request);

  if (!rateLimit.allowed) {
    logSecurityEventNonBlocking({
      eventType: 'RATE_LIMIT_EXCEEDED',
      clientIp,
      method,
      path: pathname,
      statusCode: 429,
      reason: `Exceeded max requests limit (${rateLimit.limit}). Retry after ${rateLimit.retryAfterSeconds}s.`,
      userAgent: request.headers.get('user-agent') || undefined,
    });

    return new NextResponse(
      JSON.stringify({
        error: 'Too Many Requests',
        message: `You have exceeded the request rate limit for ${pathname}. Please wait ${rateLimit.retryAfterSeconds} seconds before retrying.`,
        retryAfter: rateLimit.retryAfterSeconds,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(rateLimit.retryAfterSeconds),
          'X-RateLimit-Limit': String(rateLimit.limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(rateLimit.resetTimeMs),
        },
      }
    );
  }

  // =========================================================================
  // STEP 2: Zero-Database Auth Session Inspection
  // =========================================================================

  // INTERCEPT: If URL has a 'code' query param (from Supabase Auth email links),
  // immediately forward it to our auth callback handler to exchange for a session.
  if (request.nextUrl.searchParams.has('code') && pathname !== '/api/auth/callback') {
    const callbackUrl = request.nextUrl.clone();
    callbackUrl.pathname = '/api/auth/callback';
    return NextResponse.redirect(callbackUrl);
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  // Attach Rate-Limiting headers to valid downstream requests
  supabaseResponse.headers.set('X-RateLimit-Limit', String(rateLimit.limit));
  supabaseResponse.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining));
  supabaseResponse.headers.set('X-RateLimit-Reset', String(rateLimit.resetTimeMs));

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Stateless JWT claims inspection without querying primary DB
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const zone = classifyRouteZone(pathname);

  // =========================================================================
  // STEP 3: Route Zone Enforcement & Early Redirections
  // =========================================================================

  // ZONE A: Restricted-Public (Guest Only: /login, /register, /reset-password)
  // If user is ALREADY authenticated -> Redirect to Dashboard/Portal
  if (zone === 'RESTRICTED_PUBLIC' && user) {
    const userRole = user.user_metadata?.role || user.app_metadata?.role || 'MEMBER';
    const targetDashboard = (userRole === 'ADMIN' || userRole === 'SUPERADMIN') ? '/admin' : '/portal';

    logSecurityEventNonBlocking({
      eventType: 'AUTH_REDIRECT',
      clientIp,
      method,
      path: pathname,
      statusCode: 307,
      userId: user.id,
      reason: `Authenticated user redirected from guest route ${pathname} to ${targetDashboard}`,
    });

    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = targetDashboard;
    redirectUrl.search = ''; // Strip login query params

    const redirectResponse = NextResponse.redirect(redirectUrl);
    redirectResponse.headers.set('X-RateLimit-Limit', String(rateLimit.limit));
    redirectResponse.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining));
    return redirectResponse;
  }

  // ZONE B: Private Member Zone (/portal/*)
  // If user is NOT authenticated -> Redirect to /login
  if (zone === 'PRIVATE_MEMBER' && !user) {
    logSecurityEventNonBlocking({
      eventType: 'UNAUTHORIZED_ACCESS',
      clientIp,
      method,
      path: pathname,
      statusCode: 401,
      reason: `Unauthenticated access blocked for protected member route ${pathname}`,
      userAgent: request.headers.get('user-agent') || undefined,
    });

    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // ZONE C: Private Admin Zone (/admin/*)
  // If user is NOT authenticated -> Redirect to /login
  if (zone === 'PRIVATE_ADMIN' && !user) {
    logSecurityEventNonBlocking({
      eventType: 'UNAUTHORIZED_ACCESS',
      clientIp,
      method,
      path: pathname,
      statusCode: 401,
      reason: `Unauthenticated access blocked for protected admin route ${pathname}`,
      userAgent: request.headers.get('user-agent') || undefined,
    });

    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // ZONE D: Public Zone (/, /about, /events, /merch)
  return supabaseResponse;
}
