import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

/**
 * Singleton database connection pool for PostgreSQL (Supabase).
 * Uses Postgres.js with connection pooling in serverless environments.
 */
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres';

// Disable prefetch as it is not supported for "Transaction" pool mode in Supabase
const client = postgres(connectionString, {
  prepare: false,
  ssl: process.env.NODE_ENV === 'production' ? 'require' : undefined,
});

export const db = drizzle(client, { schema });
export type DB = typeof db;
