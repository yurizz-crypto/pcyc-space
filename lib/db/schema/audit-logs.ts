import { pgTable, uuid, text, timestamp, jsonb, index } from 'drizzle-orm/pg-core';
import { profiles } from './users';

export const auditActionType = [
  'USER_CREATED',
  'USER_UPDATED',
  'USER_ROLE_CHANGED',
  'USER_STATUS_CHANGED',
  'USER_ANONYMIZED',
  'PII_REVEALED',
  'RECEIPT_VERIFIED',
  'EVENT_MUTATED',
  'PRODUCT_MUTATED',
  'SECURITY_SETTING_CHANGED',
] as const;

export type AuditActionType = (typeof auditActionType)[number];

/**
 * Enterprise Audit Logs Table
 * Tracks all security-critical administrative actions for compliance and non-repudiation.
 */
export const auditLogs = pgTable(
  'audit_logs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    actorId: uuid('actor_id').references(() => profiles.id, { onDelete: 'set null' }),
    actorEmail: text('actor_email').notNull(),
    action: text('action').notNull(),
    targetId: text('target_id'),
    targetType: text('target_type').notNull().default('USER'),
    details: jsonb('details').$type<Record<string, any>>().default({}),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_audit_logs_actor_id').on(table.actorId),
    index('idx_audit_logs_target_id').on(table.targetId),
    index('idx_audit_logs_action').on(table.action),
    index('idx_audit_logs_created_at').on(table.createdAt),
  ]
);

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
