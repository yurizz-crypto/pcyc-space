import { pgTable, uuid, text, timestamp, date, pgEnum, index } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['MEMBER', 'ADMIN', 'SUPERADMIN']);
export const userDesignationEnum = pgEnum('user_designation', ['BROTHER', 'SISTER', 'FRIEND']);

/**
 * User Profiles Table
 * Links 1:1 with Supabase `auth.users` on `id`.
 */
export const profiles = pgTable(
  'profiles',
  {
    id: uuid('id').primaryKey(), // Matches auth.users.id
    email: text('email').notNull(),
    firstName: text('first_name').notNull(),
    middleName: text('middle_name'),
    lastName: text('last_name').notNull(),
    designation: userDesignationEnum('designation').notNull().default('FRIEND'),
    baptismDate: date('baptism_date'), // Conditional: required for Brother/Sister
    ecclesia: text('ecclesia'), // Christadelphian Ecclesia (e.g. Manila, Davao, etc.)
    phoneNumber: text('phone_number'),
    avatarUrl: text('avatar_url'),
    role: userRoleEnum('role').notNull().default('MEMBER'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_profiles_role').on(table.role),
    index('idx_profiles_ecclesia').on(table.ecclesia),
    index('idx_profiles_email').on(table.email),
    index('idx_profiles_designation').on(table.designation),
  ]
);

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
