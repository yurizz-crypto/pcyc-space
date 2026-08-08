<p align="center">
  <img src="public/readme-banner.jpg" alt="PCYC Space Banner" width="100%" />
</p>

<h1 align="center">🌿 PCYC Space</h1>

<p align="center">
  <strong>The digital home of the Philippine Christadelphian Youth Circle</strong><br/>
  <em>United in Faith · Growing in Christ · Connected Across Islands</em>
</p>

<p align="center">
  <a href="#-features"><img src="https://img.shields.io/badge/features-full%20stack-e0a861?style=for-the-badge&labelColor=2c3324" alt="Features" /></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/next.js-16.3-fefcf1?style=for-the-badge&logo=nextdotjs&labelColor=2c3324" alt="Next.js" /></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/react-19-fefcf1?style=for-the-badge&logo=react&labelColor=2c3324" alt="React" /></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/supabase-auth%20%2B%20db-e0a861?style=for-the-badge&logo=supabase&labelColor=2c3324" alt="Supabase" /></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/tailwind-v4-fefcf1?style=for-the-badge&logo=tailwindcss&labelColor=2c3324" alt="Tailwind" /></a>
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> ·
  <a href="#-features">Features</a> ·
  <a href="#-architecture">Architecture</a> ·
  <a href="#-project-structure">Structure</a> ·
  <a href="#-deployment">Deploy</a>
</p>

---

## 📖 About

**PCYC Space** is the canonical digital platform for the **Philippine Christadelphian Youth Circle** — the only Christadelphian youth circle in the Philippines. It serves as the central hub where members across ecclesias in Manila, Davao, Cebu, and beyond can connect, register for fellowship events, browse and order fundraising merchandise, and stay rooted in their shared faith.

> *"Success means the site is the first place members check for PCYC updates and the first thing a curious visitor finds when looking for Christadelphian youth community in the Philippines."*

### 🎯 Three Core Functions

| | Function | Description |
|---|---|---|
| 🕊️ | **Inform & Welcome** | Present PCYC's mission, history, leadership, and faith to members and newcomers alike |
| 📅 | **Organize & Connect** | Publish and manage youth events — bible camps, fellowship gatherings, study circles — with online registration |
| 🛍️ | **Fund & Sustain** | Sell branded merchandise with zero-fee manual payment verification (GCash, Maya, PalawanPay) to raise funds for the community |

---

## ✨ Features

### 🌐 Public Experience
- **Rich Landing Page** — Animated hero with trust statistics, three faith pillars, event previews, and merchandise highlights
- **About & History** — PCYC's story, mission statement, leadership team, and statement of faith
- **Events Showcase** — Browse upcoming camps and gatherings with dates, locations, and registration details
- **Merch Catalog** — Browse branded products with multi-image galleries, size variants, and live stock availability

### 🔐 Authentication & Membership
- **Supabase Auth** — Secure email/password authentication with session management
- **Identity Designations** — Register as *Brother*, *Sister*, or *Friend* with optional baptism date and ecclesia affiliation
- **Role-Based Access Control** — Granular permissions for Member, Admin, and Superadmin roles
- **Protected Route Zones** — Middleware-enforced access control with zero-database JWT validation

### 👤 Member Portal
- **Personal Dashboard** — View profile, upcoming registrations, and notification feed
- **Order History** — Track merchandise orders through the full lifecycle
- **Receipt Upload** — Submit GCash/Maya/PalawanPay payment screenshots for admin verification
- **In-App Notifications** — Real-time updates on event registrations, order status, and payment verification

### 🛡️ Admin Dashboard
- **Overview & Analytics** — Live metric cards for ecclesias, events, merch, pending receipts, and member count
- **Events CRUD** — Create, edit, publish events with banner uploads and registration management
- **Merch Management** — Full product lifecycle with size variants, stock tracking, and availability toggles
- **Order Verification Queue** — Review uploaded payment receipts, approve/reject with notes, update shipping status
- **Member Management** — View, search, and manage member roles and profiles
- **Ecclesia Directory** — Maintain the Philippine ecclesia directory by region (Luzon, Visayas, Mindanao)

### 💳 Zero-Fee Payment Flow
```
Buyer places order → Sends payment via GCash/Maya/PalawanPay
    → Uploads receipt screenshot → Admin verifies in dashboard
        → Order marked as paid → Fulfillment & shipping
```
> No payment gateway fees. Every peso goes to the community.

### 📧 Transactional Email
- Order confirmations with payment instructions
- Receipt verification notifications (approved/rejected)
- Event registration confirmations
- Welcome emails for new members
- Custom Supabase auth templates (verification, password reset)

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | [Next.js 16.3](https://nextjs.org/) | App Router, Server Components, Server Actions |
| **UI** | [React 19](https://react.dev/) | Component architecture with latest concurrent features |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Custom `@theme` design tokens with glassmorphism |
| **Database** | [PostgreSQL](https://www.postgresql.org/) + [Drizzle ORM](https://orm.drizzle.team/) | Type-safe schema, relational queries, migrations |
| **Auth & Storage** | [Supabase](https://supabase.com/) | Authentication, file storage, Row Level Security |
| **Email** | [Resend](https://resend.com/) | Transactional email delivery with HTML templates |
| **Validation** | [Zod 4](https://zod.dev/) | Runtime schema validation for forms and environment |
| **Icons** | [Lucide React](https://lucide.dev/) | Beautiful, consistent icon library |
| **Logging** | [Pino](https://getpino.io/) | Structured JSON logging with pretty-print dev mode |
| **Testing** | [Playwright](https://playwright.dev/) + Node Test Runner | E2E, visual, and unit/integration tests |
| **CI/CD** | [GitHub Actions](https://github.com/features/actions) | Automated typecheck and build verification |
| **Hosting** | [Vercel](https://vercel.com/) | Edge deployment with zero-config Next.js support |

---

## 🎨 Design System

PCYC Space uses a custom design system built on Tailwind CSS v4 with brand-aligned tokens:

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   🟤 Forest Green  #2c3324  ← Primary / Dark base  │
│   🟡 Warm Gold     #e0a861  ← Accent / Interactive  │
│   ⬜ Cream         #fefcf1  ← Background / Light    │
│                                                     │
│   Typography:  Plus Jakarta Sans (body)             │
│                Playfair Display (headings)           │
│                                                     │
│   Effects:     Glassmorphism panels                  │
│                Radial hero glow                      │
│                Smooth card hover animations          │
│                Custom styled scrollbars              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
pcyc-space/
│
├── 📂 app/                          # Next.js App Router
│   ├── 📄 page.tsx                  # Landing page with hero & dynamic content
│   ├── 📄 layout.tsx                # Root layout, fonts, metadata, providers
│   ├── 🎨 globals.css               # Tailwind v4 theme & design tokens
│   ├── 📂 about/                    # About PCYC & faith statement
│   ├── 📂 events/                   # Event listing & [slug] detail pages
│   ├── 📂 merch/                    # Merch catalog & [slug] product pages
│   ├── 📂 login/                    # Authentication
│   ├── 📂 register/                 # Member registration
│   ├── 📂 reset-password/           # Password recovery
│   ├── 📂 portal/                   # Member dashboard & orders
│   ├── 📂 admin/                    # Admin CMS (events, merch, orders, ecclesias)
│   ├── 📂 actions/                  # Server Actions
│   └── 📂 api/                      # API routes (uploads, webhooks, callbacks)
│
├── 📂 components/
│   ├── 📂 ui/                       # Primitives (Button, Card, Modal, Input, Badge…)
│   ├── 📂 layout/                   # Navbar, Footer, MobileNav, PageHeader
│   ├── 📂 molecules/                # Date badges, empty states, avatars, price tags
│   ├── 📂 domain/                   # Feature components (auth, events, merch, orders…)
│   └── 📂 providers/                # Theme & Toast context providers
│
├── 📂 lib/
│   ├── 📂 db/                       # Drizzle schema, migrations, & query layer
│   │   ├── 📂 schema/               # Tables: profiles, events, products, orders, ecclesias…
│   │   └── 📂 queries/              # Type-safe data access functions
│   ├── 📂 supabase/                 # Client factories (browser, server, middleware)
│   ├── 📂 email/                    # Resend client & HTML email templates
│   ├── 📂 security/                 # Rate limiter, zone classifier, auth guards
│   ├── 📂 validators/               # Zod schemas for all domain entities
│   ├── 📂 constants/                # App-wide constants
│   ├── 📂 logger/                   # Pino structured logging
│   ├── 📂 notifications/            # In-app notification system
│   └── 📄 storage.ts                # Supabase Storage helpers
│
├── 📂 scripts/                      # CLI utilities (seed, admin setup, diagnostics)
├── 📂 tests/                        # Unit, integration & Playwright visual tests
├── 📂 public/                       # Static assets
├── 📄 middleware.ts                  # Auth + rate limiting + zone routing
├── 📄 drizzle.config.ts             # Drizzle ORM configuration
├── 📄 playwright.config.ts          # E2E test configuration
└── 📄 next.config.ts                # Next.js configuration
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 20
- **npm** (included with Node)
- A **Supabase** project ([create one free](https://supabase.com/dashboard))
- A **Resend** API key ([get one free](https://resend.com/api-keys))

### 1. Clone & Install

```bash
git clone https://github.com/yurizz-crypto/pcyc-space.git
cd pcyc-space
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Database (from Supabase → Settings → Database)
DATABASE_URL="postgresql://postgres.[ref]:[pass]@...pooler.supabase.com:6543/postgres"

# Email
RESEND_API_KEY="re_your_api_key"
EMAIL_FROM="PCYC Space <notifications@pcyc.ph>"
```

### 3. Set Up Database

```bash
npx drizzle-kit push      # Apply schema to your database
npm run create:admin       # Create your first admin account
```

### 4. Launch

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you're live! 🎉

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint checks |
| `npm run test` | Run unit & integration tests |
| `npm run create:admin` | Promote a user to admin role |
| `npm run sync:profiles` | Sync Supabase auth users to profiles table |

---

## 🚢 Deployment

PCYC Space is designed for **zero-cost deployment** on free tiers:

| Service | Tier | Purpose |
|---|---|---|
| **Vercel** | Hobby (Free) | Next.js hosting with edge functions |
| **Supabase** | Free | Auth, PostgreSQL database, file storage |
| **Resend** | Free (100/day) | Transactional email delivery |

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yurizz-crypto/pcyc-space)

1. Connect your GitHub repository
2. Add environment variables from `.env.example`
3. Deploy — Vercel auto-detects Next.js configuration

---

## 🧪 Testing

```bash
# Unit & Integration tests
npm run test

# E2E tests with Playwright
npx playwright install    # First time only
npx playwright test
```

### CI Pipeline

Every push and pull request to `main` triggers:
1. **TypeScript typecheck** — `tsc --noEmit`
2. **Production build** — `next build`

---

## 🏗 Architecture

```mermaid
graph TB
    subgraph Client["🌐 Browser"]
        UI[React 19 Components]
        TW[Tailwind CSS v4]
    end

    subgraph NextJS["⚡ Next.js 16.3 (Vercel)"]
        MW[Middleware<br/>Rate Limit · Auth · Zones]
        SC[Server Components]
        SA[Server Actions]
        API[API Routes]
    end

    subgraph Backend["🗄️ Backend Services"]
        SB_AUTH[Supabase Auth<br/>JWT Sessions]
        SB_STORAGE[Supabase Storage<br/>Receipts & Images]
        DB[(PostgreSQL<br/>Drizzle ORM)]
        RESEND[Resend<br/>Email Service]
    end

    UI --> MW
    MW --> SC
    MW --> SA
    SC --> DB
    SA --> DB
    SA --> SB_STORAGE
    SA --> RESEND
    API --> SB_AUTH
    UI -.->|Auth| SB_AUTH

    classDef client fill:#fefcf1,stroke:#2c3324,color:#2c3324
    classDef server fill:#e0a861,stroke:#2c3324,color:#2c3324
    classDef backend fill:#2c3324,stroke:#e0a861,color:#fefcf1

    class UI,TW client
    class MW,SC,SA,API server
    class SB_AUTH,SB_STORAGE,DB,RESEND backend
```

---

## 🌱 Product Principles

1. **🤝 Welcoming First** — Every page makes newcomers feel invited, never excluded by insider language
2. **🔓 Zero-Friction Access** — Public content requires no login; registration respects the Brother/Sister/Friend identity
3. **💰 Zero-Cost Sustainability** — Architecture choices keep operational costs at zero on free tiers
4. **❤️ Community, Not Commerce** — The merch store funds the mission; it feels like fellowship, not a retail operation
5. **✅ Admin Simplicity** — Volunteer admins manage everything from one dashboard without technical knowledge

---

## 🗄️ Database Schema

```mermaid
erDiagram
    profiles ||--o{ event_registrations : registers
    profiles ||--o{ orders : places
    profiles ||--o{ notifications : receives
    events ||--o{ event_registrations : has
    products ||--o{ order_items : contains
    orders ||--o{ order_items : includes
    orders ||--o{ payment_receipts : has

    profiles {
        uuid id PK
        string email
        string firstName
        string lastName
        enum designation "BROTHER | SISTER | FRIEND"
        enum role "MEMBER | ADMIN | SUPERADMIN"
        string ecclesia
        date baptismDate
    }

    events {
        uuid id PK
        string title
        string slug
        date startDate
        date endDate
        string location
        int maxAttendees
        boolean published
    }

    products {
        uuid id PK
        string name
        string slug
        int price
        string category
        int stockQty
        boolean available
    }

    orders {
        uuid id PK
        string orderNumber
        int totalAmount
        enum status "PENDING → VERIFIED → SHIPPED → COMPLETED"
        jsonb shippingInfo
    }

    payment_receipts {
        uuid id PK
        string imageUrl
        enum method "GCASH | MAYA | PALAWAN_PAY"
        enum status "PENDING | APPROVED | REJECTED"
    }
```

---

## 🤝 Contributing

Contributions are welcome! This is a community project serving the Philippine Christadelphian Youth Circle.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is private and maintained by the PCYC community.

---

<p align="center">
  <sub>Built with 🤎 for the Philippine Christadelphian Youth Circle</sub><br/>
  <sub><strong>PCYC Space</strong> — Where faith meets fellowship in the digital age</sub>
</p>
