import { NextRequest } from 'next/server';

interface RateLimitBucket {
  count: number;
  resetAt: number; // Unix timestamp in ms
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTimeMs: number;
  retryAfterSeconds: number;
}

/**
 * Route-Specific Rate Limit Policies
 */
const ROUTE_POLICIES: Record<string, RateLimitConfig> = {
  '/login': { maxRequests: 10, windowMs: 60 * 1000 }, // 10 attempts per minute to prevent brute-force
  '/register': { maxRequests: 6, windowMs: 60 * 1000 }, // 6 attempts per minute
  '/reset-password': { maxRequests: 4, windowMs: 60 * 1000 }, // 4 attempts per minute
  '/admin/users': { maxRequests: 40, windowMs: 60 * 1000 }, // 40 requests per minute
  '/api/': { maxRequests: 60, windowMs: 60 * 1000 }, // 60 API calls per minute
  default: { maxRequests: 120, windowMs: 60 * 1000 }, // 120 page views per minute
};

/**
 * In-Memory O(1) Sliding Window Store
 * Uses Map with automatic TTL cleanup to maintain fixed memory footprint.
 */
class MemoryRateLimiter {
  private store = new Map<string, RateLimitBucket>();
  private lastCleanup = Date.now();
  private readonly cleanupIntervalMs = 60 * 1000; // Sweep every 60s

  /**
   * Evaluates incoming request against rate limit policy in O(1) time.
   */
  public check(identifier: string, path: string, customConfig?: RateLimitConfig): RateLimitResult {
    const now = Date.now();

    // Trigger non-blocking periodic memory sweep if interval reached
    if (now - this.lastCleanup > this.cleanupIntervalMs) {
      this.evictExpired(now);
    }

    const policy = customConfig || this.resolvePolicy(path);
    const key = `${identifier}:${this.resolvePolicyKey(path)}`;
    let bucket = this.store.get(key);

    if (!bucket || now >= bucket.resetAt) {
      // New or expired window
      bucket = {
        count: 1,
        resetAt: now + policy.windowMs,
      };
      this.store.set(key, bucket);

      return {
        allowed: true,
        limit: policy.maxRequests,
        remaining: policy.maxRequests - 1,
        resetTimeMs: bucket.resetAt,
        retryAfterSeconds: Math.ceil(policy.windowMs / 1000),
      };
    }

    // Existing active window
    bucket.count += 1;
    const isAllowed = bucket.count <= policy.maxRequests;
    const remaining = Math.max(0, policy.maxRequests - bucket.count);
    const retryAfterSeconds = Math.ceil((bucket.resetAt - now) / 1000);

    return {
      allowed: isAllowed,
      limit: policy.maxRequests,
      remaining,
      resetTimeMs: bucket.resetAt,
      retryAfterSeconds,
    };
  }

  private resolvePolicy(path: string): RateLimitConfig {
    for (const [routePrefix, config] of Object.entries(ROUTE_POLICIES)) {
      if (routePrefix !== 'default' && (path === routePrefix || path.startsWith(`${routePrefix}/`))) {
        return config;
      }
    }
    return ROUTE_POLICIES.default;
  }

  private resolvePolicyKey(path: string): string {
    for (const routePrefix of Object.keys(ROUTE_POLICIES)) {
      if (routePrefix !== 'default' && (path === routePrefix || path.startsWith(`${routePrefix}/`))) {
        return routePrefix;
      }
    }
    return 'default';
  }

  private evictExpired(now: number): void {
    this.lastCleanup = now;
    for (const [key, bucket] of this.store.entries()) {
      if (now >= bucket.resetAt) {
        this.store.delete(key);
      }
    }
  }
}

// Global Singleton Rate Limiter Instance
const globalRateLimiter = new MemoryRateLimiter();

/**
 * Extracts Client IP address from standard Edge / Reverse Proxy headers.
 */
export function getClientIp(request: NextRequest): string {
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp.trim();

  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    const firstIp = xForwardedFor.split(',')[0];
    if (firstIp) return firstIp.trim();
  }

  const xRealIp = request.headers.get('x-real-ip');
  if (xRealIp) return xRealIp.trim();

  return '127.0.0.1';
}

/**
 * High-performance edge rate limiter evaluation.
 */
export function evaluateRateLimit(request: NextRequest): RateLimitResult {
  const clientIp = getClientIp(request);
  const path = request.nextUrl.pathname;
  return globalRateLimiter.check(clientIp, path);
}

/**
 * Action-level rate limiter for server actions (e.g., checkout, login attempts, user creation).
 */
export function enforceActionRateLimit(
  identifier: string,
  actionKey: string,
  maxRequests: number = 10,
  windowMs: number = 60 * 1000
): RateLimitResult {
  return globalRateLimiter.check(identifier, actionKey, { maxRequests, windowMs });
}
