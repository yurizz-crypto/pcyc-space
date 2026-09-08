---
name: git-advanced
version: 1.0.0
description: Atomic Git orchestration, Conventional Commits formatting, safe branch rebasing, and disciplined repository hygiene.
triggers:
  - "git"
  - "commit"
  - "conventional commit"
  - "atomic commit"
  - "git rebase"
  - "git stash"
  - "clean history"
  - "branch workflow"
stack:
  - "git"
  - "powershell"
category: "vcs"
---

# Atomic Git Orchestration & Conventional Commit Workflows

Ensures all repository history is atomic, bisectable, descriptive, and safe. Enforces Conventional Commits standards and eliminates messy, monolithic commits.

---

## Toolchain Commands

| Action | Command | Purpose |
| :--- | :--- | :--- |
| **Inspect Clean Status** | `git status --short` | Concise status of staged and unstaged changes |
| **Stage Specific File** | `git add <path/to/file>` | Precise staging avoiding accidental catch-all staging |
| **Conventional Commit** | `git commit -m "<type>(<scope>): <subject>"` | Atomic commit with semantic header |
| **Review Commit History** | `git log --oneline -n 10` | Formatted log of recent atomic commits |
| **Safe Stash with Label** | `git stash push -m "<label>"` | Saves working directory state safely with message |
| **Sync with Main Branch** | `git pull --rebase origin main` | Replays local commits cleanly on top of upstream |

---

## Conventional Commit Standard

Commit messages must follow the standard specification:

```
<type>(<scope>): <short imperative summary>

[optional body explaining rationale and trade-offs]

[optional footer, e.g. Closes #123]
```

### Recognized Types
- `feat`: A new user-facing feature or enhancement.
- `fix`: A bug fix or error correction.
- `refactor`: Code change that neither fixes a bug nor adds a feature.
- `test`: Adding missing tests or correcting existing tests.
- `perf`: A code change that improves performance.
- `docs`: Documentation updates only.
- `style`: Formatting, semicolons, whitespace (no code logic changes).
- `chore`: Maintenance tasks, dependency updates, configuration tweaks.

### Standard Scopes for This Repository
- `auth`: Authentication, sessions, permissions, Supabase auth.
- `admin`: Admin portal, member approvals, ecclesia management.
- `orders`: Merch orders, payments, receipts, statuses.
- `events`: Event schedules, registration, ticketing.
- `db`: Drizzle schemas, migrations, seeds, SQL queries.
- `security`: PII masking, rate limiting, magic byte verification.
- `motion`: Animation physics, springs, UI transitions.
- `skills`: Agent skills and development guardrails.

### Examples
- `feat(orders): add payment receipt image upload validation`
- `fix(auth): enforce baptism date requirement for brothers and sisters`
- `test(security): add test coverage for pii phone masking`
- `refactor(db): extract shared ecclesia query helper`

---

## Atomic Commit Workflow Playbook

### Step 1: Status Inspection & Diff Review
Never commit blindly. Review exact changes:
```powershell
git status --short
git diff
```

### Step 2: Verification Before Staging
Before any commit is formed, verify that the code compiles and tests pass:
```powershell
npx tsc --noEmit
npx tsx --test tests/<relevant-test>.test.ts
```

### Step 3: Precise Staging
Stage only the files that belong to the single atomic unit of work:
```powershell
git add lib/security/privacy.ts tests/admin-users-security.test.ts
```
Avoid using `git add .` or `git add -A` when working across multiple concerns.

### Step 4: Author the Conventional Commit
```powershell
git commit -m "fix(security): sanitize user profile before public display"
```

---

## Stash & Worktree Hygiene

When switching contexts or testing a clean state:
```powershell
# Stash with descriptive message
git stash push -m "WIP: order status transition email styling"

# Inspect stashes
git stash list

# Re-apply when ready
git stash pop
```

---

## Golden Rules

1. **Every Commit Must Build**: Never commit code that breaks `npx tsc --noEmit`.
2. **One Logical Change Per Commit**: Do not mix a bugfix with a refactor, or a feature with unrelated documentation.
3. **No Generated Artifacts**: Never commit `.next/`, `node_modules/`, or temporary test output.
