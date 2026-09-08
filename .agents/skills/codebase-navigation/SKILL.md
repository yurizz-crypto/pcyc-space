---
name: codebase-navigation
version: 1.0.0
description: Structural code search, AST-aware pattern matching via ast-grep, symbol resolution, and Next.js App Router architecture navigation.
triggers:
  - "explore codebase"
  - "find usages"
  - "ast search"
  - "ast-grep"
  - "trace function"
  - "where is defined"
  - "navigate codebase"
  - "symbol search"
stack:
  - "ast-grep"
  - "typescript"
  - "nextjs"
  - "drizzle-orm"
category: "architecture"
---

# AST-Aware Codebase Navigation

A deterministic system for exploring, tracing, and refactoring code using Abstract Syntax Tree (AST) pattern matching and structural project topography. Bypasses naive string grepping to find syntactically exact code structures.

---

## Toolchain Commands

| Action | Command | Purpose |
| :--- | :--- | :--- |
| **AST Pattern Search** | `npx --package=@ast-grep/cli ast-grep --pattern '<pattern>' --lang <lang>` | Search code matching exact AST node structures |
| **Interactive AST Scan** | `npx --package=@ast-grep/cli ast-grep scan` | Run AST rule scans against configured rules |
| **Type Definition Check** | `npx tsc --noEmit` | Validate that all symbol resolutions and imports resolve |

---

## Project Architecture Topology

Understanding where responsibilities live in this Next.js 16 App Router repository:

```
pcyc-space/
├── app/                      # Next.js App Router
│   ├── (auth)/               # Auth route groups
│   ├── admin/                # Admin dashboards, users, orders, ecclesias
│   ├── api/                  # Route handlers (REST endpoints)
│   │   ├── auth/             # Supabase auth hooks & password resets
│   │   └── health/           # Health check endpoints
│   ├── events/               # Public events directory & registration
│   ├── merch/                # E-commerce store & checkout
│   └── profile/              # User profile settings
├── components/               # React components (Server & Client UI)
│   ├── ui/                   # Reusable atomic UI primitives
│   └── navigation/           # App navigation & headers
├── lib/                      # Core business logic & server-side singletons
│   ├── db/                   # Database access layer
│   │   ├── schema/           # Drizzle ORM schema definitions (single source of truth)
│   │   ├── queries/          # Reusable Drizzle database query helpers
│   │   └── migrations/       # Versioned SQL migration files
│   ├── validators/           # Zod validation schemas (API & form contracts)
│   ├── security/             # Rate limiters, privacy/PII masking, telemetry
│   ├── supabase/             # Supabase server & client connection utilities
│   └── storage.ts            # File storage upload & magic-byte signature validation
└── tests/                    # Test suites
    ├── *.test.ts             # Unit & integration tests (node:test runner)
    └── visual/               # Playwright E2E and visual regression specs
```

---

## AST-Grep Search Playbook

Use `ast-grep` when regex fails due to whitespace, multiline signatures, or JSX nesting variations.

### 1. Finding Component Usages with Specific Props
```powershell
npx --package=@ast-grep/cli ast-grep --pattern '<Button variant="$_">$CONTENT</Button>' --lang tsx
```

### 2. Locating Zod SafeParse Validation Sites
```powershell
npx --package=@ast-grep/cli ast-grep --pattern '$SCHEMA.safeParse($DATA)' --lang ts
```

### 3. Finding Drizzle Database Mutations
```powershell
npx --package=@ast-grep/cli ast-grep --pattern 'await db.insert($TABLE).values($VALS)' --lang ts
```

### 4. Tracing Server Actions
Find functions marked with `'use server'` or exported server action mutations:
```powershell
npx --package=@ast-grep/cli ast-grep --pattern 'export async function $FUNC($$$) { "use server"; $$$ }' --lang ts
```

---

## Deterministic Code Exploration Workflow

When tasked with investigating or modifying a feature:

1. **Locate the Entrypoint**:
   - UI interaction: Look in `app/<route>/page.tsx` or related `components/`.
   - API call: Look in `app/api/<route>/route.ts`.
2. **Trace the Validation Contract**:
   - Trace inputs into `lib/validators/index.ts` to locate the active Zod schema.
3. **Trace the Database Operation**:
   - Jump from the route/action handler into `lib/db/queries/<domain>.ts` or direct `db.query`.
   - Check the schema definitions in `lib/db/schema/<domain>.ts`.
4. **Identify Side Effects**:
   - Check audit log creation (`lib/db/schema/audit-logs.ts`).
   - Check notification dispatchers (`lib/notifications/dispatcher.ts`).
   - Check email triggers (`lib/email/mailer.ts`).
