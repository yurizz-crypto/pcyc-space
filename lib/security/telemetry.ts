import { logger } from '@/lib/logger';

export interface SecurityEvent {
  eventType: 'RATE_LIMIT_EXCEEDED' | 'UNAUTHORIZED_ACCESS' | 'FORBIDDEN_ZONE' | 'AUTH_REDIRECT' | 'SYSTEM_ERROR';
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
 * Dispatches structured security telemetry logs.
 */
export function logSecurityEventNonBlocking(event: SecurityEvent): void {
  const level = event.statusCode === 429 || event.statusCode === 401 || event.statusCode === 403 ? 'warn' : 'info';
  logger[level]({ security: true, ...event }, `[SECURITY ${event.statusCode}] ${event.eventType} on ${event.path}`);
}

