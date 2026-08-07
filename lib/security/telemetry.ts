import { logger } from '@/lib/logger';

export interface SecurityEvent {
  eventType: 'RATE_LIMIT_EXCEEDED' | 'UNAUTHORIZED_ACCESS' | 'FORBIDDEN_ZONE' | 'AUTH_REDIRECT';
  clientIp: string;
  method: string;
  path: string;
  statusCode: number;
  reason: string;
  userAgent?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

/**
 * Non-blocking, asynchronous security logger.
 * Dispatches structured telemetry logs out-of-band so request-response latency is 0ms.
 */
export function logSecurityEventNonBlocking(event: SecurityEvent): void {
  // Use queueMicrotask / Promise.resolve to detach from current execution loop
  queueMicrotask(() => {
    try {
      const payload = {
        timestamp: new Date().toISOString(),
        security: true,
        ...event,
      };

      if (event.statusCode === 429) {
        logger.warn(payload, `[SECURITY 429] Rate limit triggered for IP ${event.clientIp} on ${event.path}`);
      } else if (event.statusCode === 401 || event.statusCode === 403) {
        logger.warn(payload, `[SECURITY ${event.statusCode}] ${event.eventType} on ${event.path}`);
      } else {
        logger.info(payload, `[SECURITY] ${event.eventType} on ${event.path}`);
      }
    } catch (err) {
      // Telemetry failure must NEVER crash or block request handling
      console.error('[TELEMETRY_ERROR]', err);
    }
  });
}
