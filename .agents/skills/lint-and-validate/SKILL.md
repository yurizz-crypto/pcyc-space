---
name: lint-and-validate
version: 1.0.0
description: Strict static analysis, TypeScript compiler type soundness, ESLint rules enforcement, and enterprise security guardrails.
triggers:
  - "lint"
  - "typecheck"
  - "validate code"
  - "security check"
  - "static analysis"
  - "tsc"
  - "eslint"
  - "audit code"
stack:
  - "eslint"
  - "typescript"
  - "tsc"
  - "security"
category: "quality"
---

# Strict Static Analysis, Type Soundness & Security Guard

Enforces complete compile-time type soundness, code style compliance, and runtime security guardrails across the codebase.

---

## Toolchain Commands

| Action | Command | Purpose |
| :--- | :--- | :--- |
| **Compiler Type Check** | `npx tsc --noEmit` | Strict zero-error TypeScript type checking |
| **Lint Full Project** | `npm run lint` | Runs ESLint across all project files |
| **Lint Targeted File** | `npx eslint <path/to/file.ts>` | Fast lint on specific changed file |
| **Autofix Lint Issues** | `npx eslint --fix <path/to/file.ts>` | Automatically fixes formatting and imports |

---

## Static Analysis Execution Playbook

Execute these validation phases before every commit or merge:

### Phase 1: TypeScript Compiler Soundness (`tsc`)
Run the compiler in strict non-emitting mode:
```powershell
npx tsc --noEmit
```
- **Zero Errors Allowed**: Any error reported by `tsc` breaks the build immediately.
- Never use `@ts-ignore` without explicit peer rationale. Use `@ts-expect-error` with an explanatory comment if testing failure boundaries.

### Phase 2: ESLint Flat Config Validation
Run ESLint against modified files:
```powershell
npx eslint app/ components/ lib/
```
Key project lint rules to uphold:
1. **No Untyped `any`**: Explicit types must be declared for all function parameters, return values, and query results.
2. **Unused Imports & Variables**: Remove unused imports or prefix intentionally unused arguments with an underscore (e.g. `_req`).
3. **React Hooks Compliance**: Ensure all dependencies are captured in `useEffect`, `useCallback`, and `useMemo`.

---

## Security Verification Guardrails

This project enforces three deterministic security standards:

### 1. PII Masking & Data Sanitization
All public-facing views of user records must utilize the privacy utilities in `lib/security/privacy.ts`:
- Use `maskEmail(email)` for non-admin user displays (`j***@example.com`).
- Use `maskPhoneNumber(phone)` to hide sensitive mobile digits.
- Run `sanitizeUserForDisplay(profile)` before returning profile objects to client components.

### 2. File Upload Magic Byte Signature Verification
Never trust MIME types reported by the client `Content-Type` header alone. When receiving uploads (e.g. payment receipts, avatars):
```ts
import { validateImageMagicBytes } from '@/lib/storage';

const buffer = await file.arrayBuffer();
const isValid = validateImageMagicBytes(Buffer.from(buffer));
if (!isValid) {
  throw new Error('Invalid file format. Only verified PNG, JPEG, and WebP images are permitted.');
}
```

### 3. Action-Level Rate Limiting
Sensitive server actions and API routes (e.g. login attempts, password resets, payment uploads) must invoke the rate limiter in `lib/security/rate-limiter.ts`:
```ts
import { enforceActionRateLimit } from '@/lib/security/rate-limiter';

const isAllowed = await enforceActionRateLimit({
  key: `reset-password:${ip}`,
  limit: 5,
  windowSeconds: 900,
});
if (!isAllowed) {
  return Response.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
}
```
