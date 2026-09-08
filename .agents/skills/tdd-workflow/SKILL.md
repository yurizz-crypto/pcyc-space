---
name: tdd-workflow
version: 1.0.0
description: Deterministic Test-Driven Development (TDD) execution harness for Next.js App Router and TypeScript using Node.js native test runner and strict assertions.
triggers:
  - "tdd"
  - "test driven"
  - "red green refactor"
  - "unit test"
  - "write test"
  - "regression test"
  - "test harness"
stack:
  - "node:test"
  - "node:assert/strict"
  - "tsx"
  - "typescript"
  - "nextjs"
category: "testing"
---

# Deterministic TDD Execution Harness

A disciplined, deterministic test-driven development workflow tailored specifically to this Next.js TypeScript project. Enforces the strict **Red-Green-Refactor** cycle before any implementation code is authored.

---

## Core Principles

1. **No Production Code Without a Failing Test**: Never write or modify application logic without an accompanying test that reproduces a bug or asserts a new requirement.
2. **Deterministic Assertions**: Use `node:assert/strict`. Avoid loose equality or non-deterministic assertions (e.g. uncontrolled timestamps or random generators).
3. **Ponytail Rule of Minimal Code**: In the Green phase, implement only the simplest code necessary to make the test pass. Avoid speculative generalization.
4. **Native Node Test Runner**: Standardized on Node.js built-in `node:test` executed via `tsx`. Zero heavy test runner overhead.

---

## Toolchain Commands

| Action | Command | Purpose |
| :--- | :--- | :--- |
| **Run All Unit Tests** | `npm test` | Runs all `tests/**/*.test.ts` suites |
| **Run Single Test File** | `npx tsx --test tests/<file>.test.ts` | Targeted execution during active TDD loop |
| **Filter by Test Name** | `npx tsx --test --test-name-pattern="<pattern>" tests/<file>.test.ts` | Isolated subtest execution |
| **Type Check Guard** | `npx tsc --noEmit` | Validate type soundness across tests and implementation |

---

## Step-by-Step TDD Execution Playbook

### Step 1: Red Phase (Assert Desired Behavior)

1. Identify the target unit or module to create or modify.
2. Create or open the corresponding test file in `tests/<feature>.test.ts`.
3. Import the native test primitives:
   ```ts
   import { describe, it, beforeEach } from 'node:test';
   import assert from 'node:assert/strict';
   ```
4. Define the behavioral test cases covering:
   - Happy path with explicit expected outputs.
   - Boundary conditions (empty strings, zero, boundary numbers, undefined optional fields).
   - Malformed inputs and schema rejections.
5. Execute the targeted test file:
   ```powershell
   npx tsx --test tests/<feature>.test.ts
   ```
6. **Verify the Failure**: Ensure the test fails with an expected `AssertionError` or missing symbol, **not** an unexpected syntax or import crash.

### Step 2: Green Phase (Make It Pass Minimally)

1. Write the minimum amount of code in `lib/`, `components/`, or `app/` to satisfy the failing test assertions.
2. Re-run the targeted test:
   ```powershell
   npx tsx --test tests/<feature>.test.ts
   ```
3. Iterate until the exit code is `0` and all subtests report `ok`.

### Step 3: Refactor Phase (Cleanse & Guard)

1. Clean up duplicate logic, improve variable naming, and remove temporary debug logs.
2. Run TypeScript compiler type checking:
   ```powershell
   npx tsc --noEmit
   ```
3. Run the complete test suite to guarantee zero regressions:
   ```powershell
   npm test
   ```

---

## Canonical Test Suite Template

```ts
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { myFeatureFunction } from '@/lib/my-feature';

describe('MyFeature Domain Logic', () => {
  it('should compute expected output given valid inputs', () => {
    const input = { amount: 100, discountPct: 10 };
    const result = myFeatureFunction(input);

    assert.equal(result.finalAmount, 90);
    assert.equal(result.isValid, true);
  });

  it('should reject negative amount values gracefully', () => {
    assert.throws(
      () => myFeatureFunction({ amount: -5, discountPct: 0 }),
      { message: /Amount must be positive/ }
    );
  });
});
```

---

## Guardrails & Anti-Patterns

- **NEVER** comment out failing tests to achieve a green build.
- **NEVER** mock internal domain functions unless isolating external I/O (e.g. third-party network calls, Supabase auth endpoints).
- **NEVER** leave untyped `any` in test files; tests define and lock the TypeScript contract.
