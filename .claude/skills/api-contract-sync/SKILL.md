---
name: api-contract-sync
version: 1.0.0
description: Enforce contract-driven synchronization across Drizzle database schemas, Zod validation contracts, Next.js route handlers, and client mutations.
triggers:
  - "api contract"
  - "sync schema"
  - "schema drift"
  - "api types"
  - "validate contract"
  - "zod schema sync"
  - "endpoint contract"
stack:
  - "zod"
  - "drizzle-orm"
  - "typescript"
  - "nextjs"
category: "architecture"
---

# Contract-Driven Schema & Endpoint Synchronization

Prevents contract drift between the PostgreSQL database layer, runtime validation contracts, server endpoints, and frontend client invocations. Ensures type safety flows continuously end-to-end.

---

## The Contract Flow Pipeline

```
[PostgreSQL Table] (lib/db/schema/*.ts)
         │
         ▼  (Field constraints & data types)
[Zod Contract] (lib/validators/index.ts)
         │
         ├───► [Static Type Extraction] (z.infer<T>, $inferSelect)
         │
         ├───► [Server Boundary] (app/api/**/route.ts & Server Actions)
         │
         └───► [Client Forms & Mutations] (components/**)
```

---

## Toolchain Commands

| Action | Command | Purpose |
| :--- | :--- | :--- |
| **Verify Type Parity** | `npx tsc --noEmit` | Compiles entire repository without emit to detect type mismatches |
| **Test Validator Schemas** | `npx tsx --test tests/**/*.test.ts` | Exercises Zod validation schemas against real payloads |
| **Verify Schema Drift** | `npx drizzle-kit check` | Checks Drizzle schema files against database migration history |

---

## Standard Type Derivation Patterns

Never duplicate manual TypeScript interfaces when schemas already define them.

### 1. Drizzle ORM Schema Inferences
In `lib/db/schema/<domain>.ts`:
```ts
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  priceInCents: integer('price_in_cents').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Infer select and insert contracts directly from DB definition
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
```

### 2. Zod Validation Contracts
In `lib/validators/index.ts`:
```ts
import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  priceInCents: z.number().int().positive('Price must be greater than zero'),
});

// Infer request payload contract directly from validation schema
export type CreateProductInput = z.infer<typeof createProductSchema>;
```

---

## Step-by-Step Contract Synchronization Playbook

When modifying or adding any database column, API parameter, or form input:

### Step 1: Update Drizzle Schema
Modify `lib/db/schema/<domain>.ts` to reflect the database structure.
- Define nullability (`.notNull()` vs optional).
- Define defaults and constraints.

### Step 2: Synchronize Zod Validator
Modify or add the validation schema in `lib/validators/index.ts`.
- Ensure constraints mirror or exceed DB limits (e.g. `z.string().max(255)`).
- Provide human-readable validation error messages.

### Step 3: Author/Update Validator Unit Tests
Add a test case in `tests/<domain>.test.ts` checking:
- Valid payload parses successfully (`schema.safeParse(validPayload).success === true`).
- Missing or malformed fields return descriptive errors.
- Run the test harness:
  ```powershell
  npx tsx --test tests/<domain>.test.ts
  ```

### Step 4: Update Route Handler or Server Action
In `app/api/<endpoint>/route.ts` or `app/**/actions.ts`:
```ts
import { createProductSchema } from '@/lib/validators';

export async function POST(req: Request) {
  const json = await req.json();
  const result = createProductSchema.safeParse(json);

  if (!result.success) {
    return Response.json(
      { error: 'Invalid payload', details: result.error.flatten() },
      { status: 400 }
    );
  }

  const newProduct = await createProduct(result.data);
  return Response.json({ data: newProduct }, { status: 201 });
}
```

### Step 5: Full Verification Check
Verify static soundness across the repository:
```powershell
npx tsc --noEmit
```

---

## Anti-Drift Guardrails

- **NO Loose Types**: Never type request bodies or query returns as `any` or `Record<string, unknown>`.
- **Single Source of Truth**: All form inputs must validate through `lib/validators/index.ts`.
- **Fail Fast at Boundaries**: Never pass unvalidated `req.json()` or `FormData` directly to database queries.
