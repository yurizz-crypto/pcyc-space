# PCYC Space – Developer & Architecture Documentation

This document serves as the comprehensive technical guide for the **PCYC Space** project. It details the system architecture, database schema, component structure, security model, and styling principles.

---

## 1. System Architecture

PCYC Space is a modern, serverless Next.js 16 (App Router) application. It bridges a React frontend with a scalable backend using Supabase and PostgreSQL. 

### Core Pillars
- **Framework:** Next.js 16.3 with React 19.
- **Data Layer:** PostgreSQL (via Supabase), interfaced safely with Drizzle ORM.
- **Auth Layer:** Supabase Auth with granular JWT session tracking.
- **Styling:** Tailwind CSS v4 featuring native CSS variables and glassmorphism tokenization.
- **Motion:** Framer Motion (`motion/react`) for purposeful scroll reveals, layout animations, and interactive spring physics.

### Request Lifecycle
1. **Middleware (`middleware.ts`):** All requests hit the middleware first. It performs O(1) sliding-window rate limiting, establishes the Supabase session, checks the user's role/zone authorization (Public, Member, Admin, Superadmin), and rewrites/redirects appropriately.
2. **Server Components:** Pages are Server Components by default. They fetch data securely using typed `lib/db/queries` utilizing Next.js' `unstable_cache` with tag-based on-demand revalidation.
3. **Server Actions (`app/actions/`):** Mutations (e.g., registering for an event, updating inventory, modifying user roles) are handled by Server Actions. Recent updates wrap crucial steps in robust Drizzle transactions to guarantee concurrency safety and data integrity.
4. **Client Components:** Components needing interactivity (e.g., Leaflet interactive maps, dynamic forms, `motion` animations) are decoupled into isolated Client Components (`"use client"`).

---

## 2. Database Schema (Drizzle ORM)

The relational schema is built to scale community operations with strict foreign key constraints and transactional integrity.

### Tables Overview

* **`profiles`**: The central user entity. Synced from Supabase Auth via Webhooks/API. Stores names, `designation` (BROTHER | SISTER | FRIEND), `role` (MEMBER | ADMIN | SUPERADMIN), `status`, and `ecclesia` affiliations.
* **`ecclesias`**: Regional gathering spots (Luzon, Visayas, Mindanao) containing coordinates, meeting schedules, and visibility (`isDisplayed`). Used to dynamically plot pins on the interactive Leaflet map.
* **`events`**: Scheduled youth camps, classes, and gatherings. Supports max capacity restrictions and publish states.
* **`event_registrations`**: Junction table mapping `profiles` to `events`.
* **`products`**: Merch catalog items. Tracks inventory `stockQty` and live availability.
* **`orders` & `order_items`**: User-placed merch orders with tracking statuses (PENDING, VERIFIED, SHIPPED, COMPLETED).
* **`payment_receipts`**: Records of manual payment screenshots (GCash, Maya, PalawanPay). Validated by admins before order fulfillment.
* **`product_reviews`**: Verified buyers can rate purchases (1-5 stars) and leave comments. Includes moderation controls (`isHidden`).
* **`audit_logs`**: Immutable enterprise-grade ledger logging all admin interactions (PII reveal, role modification, data mutation).

---

## 3. Directory & Codebase Structure

Understanding the layout is crucial for extending features:

* **`app/`**: Route definitions utilizing the App Router. Grouped logically (`/admin`, `/portal`, `/merch`, etc.).
  * **`app/actions/`**: Concurrency-safe Next.js server actions.
  * **`app/api/`**: Route handlers for webhooks and background processing.
* **`components/`**: 
  * **`ui/`**: Reusable generic primitive components (Buttons, Inputs, Modals, Accordions, Marquee).
  * **`layout/`**: Structural elements (Navbars, Footers).
  * **`domain/`**: Feature-specific components grouped by entity (e.g., `ecclesias-interactive-map.tsx` under `domain/ecclesias/`).
* **`lib/`**:
  * **`db/`**: Connection pooling, Drizzle schemas, migrations, and strongly-typed queries.
  * **`security/`**: Rate limiters, PII maskers, and Role-Based Access Guards.
  * **`validators/`**: Zod schemas used to validate form inputs and server action payloads.
  * **`geo/`**: Hardcoded coordinates and utilities for the Leaflet maps logic.
* **`tests/`**: Suite of Playwright and native Node.js tests for E2E validation, security, and component integrity.

---

## 4. Design System & Motion

The UI represents the warmth and unity of the PCYC. 

### Theming
- **Colors**: Based on Forest Green (`#2c3324`), Warm Gold (`#e0a861`), and Cream (`#fefcf1`).
- **Typography**: A mix of `Outfit` (sans-serif, highly legible for interfaces) and `EB Garamond` (serif, authoritative for headers).

### Motion & Interactivity
- **Scroll Reveals**: Sections use `ScrollReveal` wrappers to gently fade and slide up into view.
- **Interactive Maps**: Utilizing `Leaflet.js` integrated cleanly via `next/dynamic` to sidestep SSR mismatches. It renders custom glowing map pins dynamically fueled by the database cache.
- **Card Physics**: Hover states utilize scale transitions, while newly introduced `Marquee` and `Accordion` primitives provide modern, dense data displays.

---

## 5. Backend Reliability & Concurrency

When updating critical rows (like inventory decrementing on purchase, or max attendees decrement on registration), we rely on PostgreSQL row-level locks within Drizzle transactions.
```typescript
await tx.update(products).set({ stockQty: sql`${products.stockQty} - 1` })
```
This safeguards against race conditions during high-demand event releases or limited-stock merch drops.

---

## 6. Email Delivery Pipeline
We implement a zero-cost transactional email gateway using **Nodemailer** through standard Gmail SMTP. HTML templates are dynamically compiled and sent for:
- Payment verifications.
- Event registration confirmations.
- Password resets & welcome onboarding.

---

## Conclusion
The PCYC Space codebase embraces "Ponytail minimalism" coupled with high UX polish. Before adding new dependencies or complex abstractions, always check standard platform capabilities, Next.js built-in features, and existing UI primitives.
