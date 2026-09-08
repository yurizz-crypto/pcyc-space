---
name: database-migration
version: 1.0.0
description: Safe, reversible PostgreSQL database migrations, schema diffing, and zero-downtime evolution using Drizzle ORM and Supabase.
triggers:
  - "database migration"
  - "migrate db"
  - "drizzle migration"
  - "schema diff"
  - "new column"
  - "alter table"
  - "drizzle-kit"
  - "revert migration"
stack:
  - "drizzle-orm"
  - "drizzle-kit"
  - "postgresql"
  - "supabase"
category: "database"
---

# Safe Reversible Database Migration & Schema Diffing

Deterministic guidelines for evolving the PostgreSQL schema using Drizzle ORM and Supabase without data loss, locks, or downtime.

---

## Toolchain Commands

| Action | Command | Purpose |
| :--- | :--- | :--- |
| **Generate Migration SQL** | `npx drizzle-kit generate` | Generates versioned SQL migration from TypeScript schema |
| **Check Schema Integrity** | `npx drizzle-kit check` | Validates migration history against active schema |
| **Inspect DB via Studio** | `npx drizzle-kit studio` | Launches local web UI to inspect tables and rows |
| **Check Type Soundness** | `npx tsc --noEmit` | Validates that TypeScript query callers match updated schemas |

---

## Zero-Downtime Migration Pattern (Expand & Contract)

Destructive schema changes (e.g. dropping columns, renaming columns, or adding non-null columns without defaults) can crash running application instances. Always apply the **Expand and Contract** pattern:

### 1. Adding a Column
- Always declare new columns as either nullable (`timestamp(...)`) or with a deterministic database default (`.default(0)` or `.defaultNow()`).
- **NEVER** add a `.notNull()` column without a database default on an existing non-empty table.

### 2. Renaming a Column
1. **Phase 1 (Expand)**: Add the new column alongside the old column.
2. **Phase 2 (Dual-Write)**: Update `lib/db/queries/` to write to both columns, reading from the new column.
3. **Phase 3 (Backfill)**: Run a background script to copy existing data from old to new.
4. **Phase 4 (Contract)**: Remove old column references and issue a subsequent migration to drop the old column.

---

## Migration Execution Playbook

### Step 1: Update the Drizzle Schema
Navigate to `lib/db/schema/<domain>.ts` (e.g. `orders.ts`, `users.ts`, `products.ts`) and apply schema modifications:
```ts
export const orders = pgTable('orders', {
  // ... existing columns
  trackingNumber: text('tracking_number'), // Safe: nullable addition
});
```
Ensure all tables are properly re-exported in `lib/db/schema/index.ts`.

### Step 2: Generate Versioned SQL
Execute Drizzle Kit generator:
```powershell
npx drizzle-kit generate
```
This generates a new SQL file under `lib/db/migrations/` (e.g. `0002_add_tracking_number.sql`) and updates `lib/db/migrations/meta/`.

### Step 3: Peer Review Generated SQL
Open and inspect the generated `.sql` file in `lib/db/migrations/`:
- Verify no accidental `DROP TABLE` or unintended column drops.
- Check that index creations specify `CREATE INDEX IF NOT EXISTS`.
- Check table alterations for lock-safety on production.

### Step 4: Validate Migration Consistency
Run Drizzle Kit check to confirm schema integrity:
```powershell
npx drizzle-kit check
```

### Step 5: Verify Query Callers
Verify that existing queries, actions, and tests remain type-sound:
```powershell
npx tsc --noEmit
npm test
```

---

## Rollback & Safety Checklist

- **Migration Files are Immutable**: Once committed to Git, never manually edit a past migration file. Always create a new forward migration to rectify or revert changes.
- **Foreign Keys**: Ensure cascading behavior (`onDelete: 'cascade'`, `'set null'`) is explicitly declared.
- **Audit Logs**: When adding critical domain entities, ensure corresponding audit log entries are defined in `lib/db/schema/audit-logs.ts`.
