# CoreInventory — Inventory Management System
## Detailed Implementation Plan
> **Version:** 1.0 | **Date:** March 2025 | **Stack:** React 18 · Node.js · Express · Prisma · PostgreSQL 15

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Architecture Overview](#2-architecture-overview)
3. [Project Structure](#3-project-structure)
4. [Phase 1 — Foundation & Infrastructure](#4-phase-1--foundation--infrastructure)
5. [Phase 2 — Authentication Module](#5-phase-2--authentication-module)
6. [Phase 3 — Database & API Core](#6-phase-3--database--api-core)
7. [Phase 4 — Operations Modules](#7-phase-4--operations-modules)
8. [Phase 5 — Frontend SPA](#8-phase-5--frontend-spa)
9. [Phase 6 — Reporting & Notifications](#9-phase-6--reporting--notifications)
10. [Phase 7 — Settings & Admin](#10-phase-7--settings--admin)
11. [Testing Strategy](#11-testing-strategy)
12. [Deployment Architecture](#12-deployment-architecture)
13. [Milestones & Timeline](#13-milestones--timeline)
14. [Risk Register](#14-risk-register)

---

## 1. Project Overview

**CoreInventory** is a cloud-ready, role-based Inventory Management System (IMS) that replaces manual stock tracking with a real-time, digitized platform. It supports two roles:

| Role | Access | Primary Device |
|---|---|---|
| **Inventory Manager** | Full control: dashboards, approvals, settings, reports | Desktop Browser |
| **Warehouse Staff** | Operational: receipts, deliveries, transfers | Tablet / Mobile |

### Key Capabilities (v1.0 Scope)
- Real-time stock visibility across multiple warehouses and sub-locations
- Document lifecycle management: Receipts, Delivery Orders, Internal Transfers, Adjustments
- Immutable stock ledger (audit trail) with CSV/PDF export
- Role-based access control (RBAC)
- Low-stock alerts and KPI dashboard
- Configurable reorder rules per product

### Out of Scope for v1.0
- ERP / e-commerce integration
- Barcode / QR scanner hardware
- Automated purchase order generation
- Financial accounting / costing / invoicing
- Supplier or customer portal access

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser / Tablet)                 │
│   React 18 SPA  ·  TypeScript  ·  Tailwind CSS  ·  shadcn/ui   │
│   React Query (server state)  ·  Zustand (UI state)             │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTPS / REST JSON:API
┌───────────────────────────────▼─────────────────────────────────┐
│                  BACKEND (Node.js + Express.js)                  │
│   /api/v1  ·  Zod Validation  ·  JWT Auth  ·  Helmet.js        │
│   Layered MVC: Routes → Controllers → Services → Repositories   │
└───────────────────────────────┬─────────────────────────────────┘
                                │ Prisma ORM
┌───────────────────────────────▼─────────────────────────────────┐
│                      DATABASE (PostgreSQL 15)                    │
│   ACID Transactions  ·  UUID PKs  ·  Soft Deletes               │
│   Append-only stock_ledger  ·  Indexed query paths              │
└─────────────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions
- **All stock mutations** are wrapped in a single DB transaction (begin → validate → mutate stock_levels → append ledger → update document status → commit). On any failure: full rollback.
- **stock_ledger is append-only** — no UPDATE or DELETE ever allowed on this table.
- **Optimistic locking** to handle concurrent stock mutations.
- **API prefix**: all routes under `/api/v1`.
- **Response envelope**: `{ data, meta, errors }` (JSON:API style).
- **Auth**: Bearer JWT (access token, 15 min TTL) + httpOnly cookie (refresh token, 7 days).

---

## 3. Project Structure

```
coreinventory/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma         # Full DB schema
│   │   └── migrations/           # Auto-generated Prisma migrations
│   ├── src/
│   │   ├── config/               # env, database, constants
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts        # JWT verification
│   │   │   ├── rbac.middleware.ts        # Role-based access guard
│   │   │   └── error.middleware.ts       # Global error handler
│   │   ├── modules/
│   │   │   ├── auth/             # register, login, OTP, reset
│   │   │   ├── products/         # CRUD + stock per location
│   │   │   ├── categories/       # Category CRUD
│   │   │   ├── warehouses/       # Warehouse CRUD
│   │   │   ├── locations/        # Location CRUD
│   │   │   ├── receipts/         # Receipt lifecycle
│   │   │   ├── deliveries/       # Delivery lifecycle
│   │   │   ├── transfers/        # Internal transfer lifecycle
│   │   │   ├── adjustments/      # Stock adjustment
│   │   │   └── ledger/           # Stock ledger + export
│   │   ├── shared/
│   │   │   ├── stock.service.ts  # Core stock mutation engine
│   │   │   └── validators/       # Zod schemas
│   │   ├── utils/                # helpers, logger, mailer
│   │   └── app.ts                # Express app factory
│   ├── tests/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/                  # React Query hooks + Axios client
    │   ├── components/           # Shared UI components
    │   │   ├── KPICard/
    │   │   ├── OperationsTable/
    │   │   ├── StatusBadge/
    │   │   ├── DocumentForm/
    │   │   ├── LineItemRow/
    │   │   ├── StockLedgerTable/
    │   │   ├── AlertBanner/
    │   │   └── FilterBar/
    │   ├── pages/                # Route-level page components
    │   ├── store/                # Zustand stores
    │   ├── types/                # TypeScript interfaces
    │   ├── utils/                # Formatters, helpers
    │   └── main.tsx
    └── package.json
```

---

## 4. Phase 1 — Foundation & Infrastructure

### 4.1 Backend Setup
**Goal:** Bootstrapped Express server with TypeScript, environment config, database connection, and health check.

**Tasks:**
- [ ] Initialize Node.js project with TypeScript (`tsconfig.json`, `ts-node-dev`)
- [ ] Install core dependencies: `express`, `prisma`, `@prisma/client`, `jsonwebtoken`, `bcrypt`, `zod`, `helmet`, `cors`, `dotenv`, `winston`
- [ ] Configure `helmet.js` (CSP, HSTS, X-Frame-Options headers)
- [ ] Configure `cors` — allow only frontend origin
- [ ] Set up structured logging with `winston` (JSON format, log levels)
- [ ] Create environment config module (`config/env.ts`) — validate all required env vars at startup
- [ ] Create `GET /api/health` endpoint returning `{ status: 'ok', timestamp }` 
- [ ] Set up global error handler middleware with standardized error response envelope
- [ ] Configure `nodemon` / `ts-node-dev` for development hot-reload
- [ ] Set up `.env.example` documenting all required variables

**Environment Variables Required:**
```
DATABASE_URL=postgresql://user:pass@host:5432/coreinventory
JWT_SECRET=<strong-secret>
JWT_REFRESH_SECRET=<strong-secret>
JWT_ACCESS_TTL=900        # 15 minutes in seconds
JWT_REFRESH_TTL=604800    # 7 days in seconds
OTP_EXPIRY_SEC=600        # 10 minutes
BCRYPT_ROUNDS=12
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASS=...
```

### 4.2 Frontend Setup
**Goal:** Vite + React 18 + TypeScript project with routing, Tailwind CSS, shadcn/ui, and API client.

**Tasks:**
- [ ] Initialize with Vite: `npm create vite@latest frontend -- --template react-ts`
- [ ] Install and configure Tailwind CSS + `shadcn/ui`
- [ ] Install: `@tanstack/react-query`, `zustand`, `axios`, `react-router-dom v6`, `react-virtual`
- [ ] Set up Axios instance with base URL, JWT interceptor (attach token), 401 → redirect to login
- [ ] Configure React Query `QueryClient` with defaults (staleTime, retry logic)
- [ ] Set up React Router with `<PrivateRoute>` guard (checks auth state)
- [ ] Create base layout: `<Sidebar>` + `<TopBar>` + `<MainContent>` shell
- [ ] Define TypeScript types/interfaces mirroring all API response shapes

### 4.3 Database Initialization
**Tasks:**
- [ ] Install PostgreSQL 15 (local dev) and create `coreinventory_db`
- [ ] Initialize Prisma: `npx prisma init`
- [ ] Write full `prisma/schema.prisma` (see Section 6.1)
- [ ] Run initial migration: `npx prisma migrate dev --name init`
- [ ] Seed script with at least one manager user and sample data for testing
- [ ] Confirm Prisma Client generation works

### 4.4 CI/CD Pipeline (GitHub Actions)
**Tasks:**
- [ ] Create `.github/workflows/ci.yml`:
  - Triggers: `push` to `main`, PRs targeting `main`
  - Steps: checkout → install deps → lint → type-check → unit tests → integration tests → build
- [ ] Create `.github/workflows/deploy.yml` for staging/prod deployment (Docker build + push)
- [ ] Configure branch protection on `main` (require CI pass)

---

## 5. Phase 2 — Authentication Module

### 5.1 Backend — Auth Endpoints

| Method | Endpoint | Body | Response |
|---|---|---|---|
| POST | `/api/v1/auth/register` | `{ name, email, password, role }` | `{ data: { user, accessToken } }` |
| POST | `/api/v1/auth/login` | `{ email, password }` | `{ data: { user, accessToken } }` |
| POST | `/api/v1/auth/logout` | — (cookie) | `{ data: { message } }` |
| POST | `/api/v1/auth/request-otp` | `{ email }` | `{ data: { message } }` |
| POST | `/api/v1/auth/reset-password` | `{ email, otp, newPassword }` | `{ data: { message } }` |
| POST | `/api/v1/auth/refresh` | — (httpOnly cookie) | `{ data: { accessToken } }` |

**Implementation Details:**

**Register:**
- Validate body with Zod: `name` (min 2), `email` (valid), `password` (min 8), `role` (`manager|staff`)
- Check email uniqueness → 409 if duplicate
- Hash password: `bcrypt.hash(password, 12)`
- Create `users` record
- Issue access JWT + set refresh token as httpOnly cookie
- Return `{ user: { id, name, email, role }, accessToken }`

**Login:**
- Validate body; look up user by email
- `bcrypt.compare(password, hash)` → generic 401 if mismatch (no enumeration)
- Issue tokens same as register

**Password Reset (OTP):**
- `request-otp`: generate 6-digit OTP, store hash + expiry in `otp_codes` table (or Redis), send via SMTP
- `reset-password`: validate OTP hash, check expiry (10 min); if valid, hash new password, update user, invalidate OTP

**JWT Middleware:**
```typescript
// middleware/auth.middleware.ts
// 1. Extract Bearer token from Authorization header
// 2. jwt.verify(token, JWT_SECRET) → decoded payload { userId, role, iat, exp }
// 3. Attach req.user = { id, role }
// 4. Any error → 401 Unauthorized
```

**RBAC Middleware:**
```typescript
// middleware/rbac.middleware.ts
const requireRole = (...roles: string[]) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
  next();
};
// Usage: router.post('/adjust', requireRole('manager'), adjustmentController.create);
```

### 5.2 Frontend — Auth Screens

**`/login`** — `LoginPage.tsx`
- Email + password fields with client-side validation
- "Forgot Password?" link → OTP flow modal or page
- On success: store accessToken in memory (Zustand); redirect to `/dashboard`
- On error: show inline "Invalid email or password"
- Auto-redirect to `/dashboard` if already logged in

**`/signup`** — `SignupPage.tsx`
- Name, email, password, role selector (Manager / Staff)
- Client-side validation (email format, password ≥ 8 chars)
- On error 409: "An account with this email already exists"
- On success: auto-login + redirect to Dashboard

**OTP Reset Flow:**
- Step 1: Email entry → send OTP
- Step 2: 6-digit OTP input with 10-min countdown
- Step 3: New password + confirm fields

**Auth Zustand Store (`store/auth.store.ts`):**
```typescript
interface AuthState {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}
```

**Axios Token Interceptor:**
```typescript
api.interceptors.request.use(config => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
// Response interceptor: on 401 → attempt refresh → retry; on failure → clearAuth + redirect /login
```

---

## 6. Phase 3 — Database & API Core

### 6.1 Prisma Schema (Full)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(uuid())
  name         String
  email        String   @unique
  passwordHash String   @map("password_hash")
  role         Role     @default(staff)
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  receipts     Receipt[]
  deliveries   Delivery[]
  transfers    Transfer[]
  adjustments  Adjustment[]
  ledgerEntries StockLedger[]

  @@map("users")
}

enum Role {
  manager
  staff
}

model OtpCode {
  id        String   @id @default(uuid())
  email     String
  codeHash  String   @map("code_hash")
  expiresAt DateTime @map("expires_at")
  used      Boolean  @default(false)
  createdAt DateTime @default(now()) @map("created_at")

  @@map("otp_codes")
}

model Warehouse {
  id        String     @id @default(uuid())
  name      String
  shortCode String     @unique @map("short_code")
  address   String?
  deletedAt DateTime?  @map("deleted_at")
  createdAt DateTime   @default(now()) @map("created_at")

  locations Location[]

  @@map("warehouses")
}

model Location {
  id          String    @id @default(uuid())
  warehouseId String    @map("warehouse_id")
  name        String
  shortCode   String    @map("short_code")
  deletedAt   DateTime? @map("deleted_at")
  createdAt   DateTime  @default(now()) @map("created_at")

  warehouse       Warehouse     @relation(fields: [warehouseId], references: [id])
  stockLevels     StockLevel[]
  fromTransfers   Transfer[]    @relation("TransferSource")
  toTransfers     Transfer[]    @relation("TransferDest")
  adjustments     Adjustment[]
  ledgerEntries   StockLedger[]

  @@unique([warehouseId, shortCode])
  @@map("locations")
}

model Category {
  id        String    @id @default(uuid())
  name      String    @unique
  deletedAt DateTime? @map("deleted_at")
  createdAt DateTime  @default(now()) @map("created_at")

  products  Product[]

  @@map("categories")
}

model Product {
  id          String    @id @default(uuid())
  name        String
  sku         String    @unique
  categoryId  String?   @map("category_id")
  uom         String    // Unit of Measure e.g. "pcs", "kg", "box"
  reorderMin  Decimal   @default(0) @map("reorder_min") @db.Decimal(12, 4)
  reorderQty  Decimal   @default(0) @map("reorder_qty") @db.Decimal(12, 4)
  deletedAt   DateTime? @map("deleted_at")
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  category      Category?     @relation(fields: [categoryId], references: [id])
  stockLevels   StockLevel[]
  receiptLines  ReceiptLine[]
  deliveryLines DeliveryLine[]
  transferLines TransferLine[]
  adjustments   Adjustment[]
  ledgerEntries StockLedger[]

  @@map("products")
}

model StockLevel {
  id         String  @id @default(uuid())
  productId  String  @map("product_id")
  locationId String  @map("location_id")
  quantity   Decimal @default(0) @db.Decimal(12, 4)

  product  Product  @relation(fields: [productId], references: [id])
  location Location @relation(fields: [locationId], references: [id])

  @@unique([productId, locationId])
  @@map("stock_levels")
}

model Receipt {
  id          String        @id @default(uuid())
  reference   String        @unique
  supplier    String
  status      DocumentStatus @default(draft)
  createdBy   String        @map("created_by")
  validatedAt DateTime?     @map("validated_at")
  createdAt   DateTime      @default(now()) @map("created_at")
  updatedAt   DateTime      @updatedAt @map("updated_at")

  creator     User          @relation(fields: [createdBy], references: [id])
  lines       ReceiptLine[]
  ledgerEntries StockLedger[]

  @@map("receipts")
}

model ReceiptLine {
  id          String  @id @default(uuid())
  receiptId   String  @map("receipt_id")
  productId   String  @map("product_id")
  expectedQty Decimal @map("expected_qty") @db.Decimal(12, 4)
  receivedQty Decimal @default(0) @map("received_qty") @db.Decimal(12, 4)

  receipt Receipt @relation(fields: [receiptId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id])

  @@map("receipt_lines")
}

model Delivery {
  id          String        @id @default(uuid())
  reference   String        @unique
  customer    String
  status      DocumentStatus @default(draft)
  createdBy   String        @map("created_by")
  validatedAt DateTime?     @map("validated_at")
  createdAt   DateTime      @default(now()) @map("created_at")
  updatedAt   DateTime      @updatedAt @map("updated_at")

  creator       User           @relation(fields: [createdBy], references: [id])
  lines         DeliveryLine[]
  ledgerEntries StockLedger[]

  @@map("deliveries")
}

model DeliveryLine {
  id         String  @id @default(uuid())
  deliveryId String  @map("delivery_id")
  productId  String  @map("product_id")
  qty        Decimal @db.Decimal(12, 4)
  locationId String? @map("location_id") // source location

  delivery Delivery @relation(fields: [deliveryId], references: [id], onDelete: Cascade)
  product  Product  @relation(fields: [productId], references: [id])

  @@map("delivery_lines")
}

model Transfer {
  id             String        @id @default(uuid())
  reference      String        @unique
  fromLocationId String        @map("from_location_id")
  toLocationId   String        @map("to_location_id")
  status         DocumentStatus @default(draft)
  createdBy      String        @map("created_by")
  createdAt      DateTime      @default(now()) @map("created_at")
  updatedAt      DateTime      @updatedAt @map("updated_at")

  fromLocation  Location       @relation("TransferSource", fields: [fromLocationId], references: [id])
  toLocation    Location       @relation("TransferDest", fields: [toLocationId], references: [id])
  creator       User           @relation(fields: [createdBy], references: [id])
  lines         TransferLine[]
  ledgerEntries StockLedger[]

  @@map("transfers")
}

model TransferLine {
  id         String  @id @default(uuid())
  transferId String  @map("transfer_id")
  productId  String  @map("product_id")
  qty        Decimal @db.Decimal(12, 4)

  transfer Transfer @relation(fields: [transferId], references: [id], onDelete: Cascade)
  product  Product  @relation(fields: [productId], references: [id])

  @@map("transfer_lines")
}

model Adjustment {
  id          String   @id @default(uuid())
  reference   String   @unique
  productId   String   @map("product_id")
  locationId  String   @map("location_id")
  countedQty  Decimal  @map("counted_qty") @db.Decimal(12, 4)
  delta       Decimal  @db.Decimal(12, 4)  // counted - recorded (can be negative)
  reason      AdjustmentReason
  createdBy   String   @map("created_by")
  createdAt   DateTime @default(now()) @map("created_at")

  product   Product  @relation(fields: [productId], references: [id])
  location  Location @relation(fields: [locationId], references: [id])
  creator   User     @relation(fields: [createdBy], references: [id])

  @@map("adjustments")
}

model StockLedger {
  id           String       @id @default(uuid())
  productId    String       @map("product_id")
  locationId   String       @map("location_id")
  documentType DocumentType
  documentId   String       @map("document_id")  // UUID of receipt/delivery/transfer/adjustment
  delta        Decimal      @db.Decimal(12, 4)   // + for increase, - for decrease
  balanceAfter Decimal      @map("balance_after") @db.Decimal(12, 4)
  createdBy    String       @map("created_by")
  createdAt    DateTime     @default(now()) @map("created_at")

  product   Product  @relation(fields: [productId], references: [id])
  location  Location @relation(fields: [locationId], references: [id])
  creator   User     @relation(fields: [createdBy], references: [id])

  // Optional FK relations for receipt/delivery (for join convenience)
  receipt  Receipt?  @relation(fields: [documentId], references: [id])
  delivery Delivery? @relation(fields: [documentId], references: [id])
  transfer Transfer? @relation(fields: [documentId], references: [id])

  @@index([productId, locationId, createdAt])
  @@map("stock_ledger")
}

enum DocumentStatus {
  draft
  waiting
  ready
  done
  canceled
}

enum DocumentType {
  receipt
  delivery
  transfer
  adjustment
}

enum AdjustmentReason {
  damage
  loss
  counting_error
  found_goods
  other
}
```

**Additional Indexes (in migration):**
```sql
CREATE INDEX idx_receipts_status_date ON receipts(status, created_at DESC);
CREATE INDEX idx_deliveries_status_date ON deliveries(status, created_at DESC);
CREATE INDEX idx_transfers_status_date ON transfers(status, created_at DESC);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_ledger_doc ON stock_ledger(document_type, document_id);
```

### 6.2 Core Stock Mutation Service

This is the heart of the system. All stock changes go through this service:

```typescript
// src/shared/stock.service.ts

/**
 * Atomically:
 *  1. Validate document is in correct state
 *  2. For each line: update stock_levels
 *  3. Write stock_ledger rows
 *  4. Update document status
 *  5. Check low-stock thresholds and trigger alerts
 */
async function processStockMutation(
  tx: PrismaTransaction,        // Prisma transactional client
  documentType: DocumentType,
  documentId: string,
  lines: StockMutationLine[],   // [{ productId, locationId, delta }]
  newStatus: DocumentStatus,
  userId: string
): Promise<void>

interface StockMutationLine {
  productId:  string;
  locationId: string;
  delta:      Decimal;  // positive = increase, negative = decrease
}
```

**Stock Constraint Enforcement:**
- Before applying negative delta: verify `stock_levels.quantity + delta >= 0`, else throw `InsufficientStockError` with product details
- After mutation: check `quantity <= reorder_min` → trigger low-stock notification

**Optimistic Locking:**
- Use `SELECT ... FOR UPDATE` on `stock_levels` rows before updating to prevent race conditions with concurrent mutations

### 6.3 Reference Number Generation

Auto-incrementing, human-readable reference numbers per document type:
```
REC-20250314-0001   (Receipt)
DEL-20250314-0042   (Delivery)
TRF-20250314-0007   (Transfer)
ADJ-20250314-0003   (Adjustment)
```

Implementation: PostgreSQL sequence per document type, formatted at insert time.

### 6.4 API Module Structure

Each module (`receipts`, `deliveries`, etc.) follows this layered pattern:

```
modules/receipts/
├── receipt.router.ts      # Route definitions + middleware
├── receipt.controller.ts  # Request parsing, response formatting
├── receipt.service.ts     # Business logic, calls stock.service
├── receipt.repository.ts  # Prisma queries
└── receipt.validator.ts   # Zod schemas for request bodies
```

---

## 7. Phase 4 — Operations Modules

### 7.1 Product Management

**Endpoints:**
| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/api/v1/products` | Both | Paginated list; filter by category, search by name/SKU |
| POST | `/api/v1/products` | Manager | Create product |
| GET | `/api/v1/products/:id` | Both | Detail + stock by location |
| PUT | `/api/v1/products/:id` | Manager | Update |
| DELETE | `/api/v1/products/:id` | Manager | Soft-delete (`deletedAt = now()`) |
| GET | `/api/v1/products/:id/stock` | Both | Stock qty per location |
| GET | `/api/v1/categories` | Both | List categories |
| POST | `/api/v1/categories` | Manager | Create category |
| PUT | `/api/v1/categories/:id` | Manager | Rename category |
| DELETE | `/api/v1/categories/:id` | Manager | Soft-delete (only if no active products) |

**Product Create Validation (Zod):**
```typescript
z.object({
  name:       z.string().min(1).max(200),
  sku:        z.string().min(1).max(50),
  categoryId: z.string().uuid().optional(),
  uom:        z.string().min(1).max(20),
  reorderMin: z.number().nonnegative().optional().default(0),
  reorderQty: z.number().nonnegative().optional().default(0),
})
```

**Business Rules:**
- SKU must be globally unique → 409 on duplicate
- Soft-deleted products cannot be referenced in new documents
- `GET /products` filters: `?category=uuid&search=text&page=1&limit=50`

### 7.2 Receipts (Incoming Stock)

**Status Machine:**
```
draft → waiting → ready → done
  └──────────────────────────→ canceled
```
- `draft`: editable, lines can be added/removed
- `waiting`: locked header, quantities editable
- `ready`: ready to validate
- `done`: IMMUTABLE after validation
- `canceled`: IMMUTABLE

**Key Endpoint — Validate Receipt:**
```
POST /api/v1/receipts/:id/validate
Role: Both
```
Transaction sequence:
1. Fetch receipt + lines (ensure status != `done`/`canceled`)
2. Validate all `receivedQty > 0`
3. `BEGIN` transaction
4. For each line: `UPSERT stock_levels` (increase by `receivedQty`)
5. INSERT `stock_ledger` rows (delta = +receivedQty)
6. UPDATE receipt status → `done`, set `validatedAt`
7. `COMMIT` (or `ROLLBACK` on any error)
8. Check low-stock alerts

### 7.3 Delivery Orders (Outgoing Stock)

**Status Machine:** Same as Receipt.

**Key Endpoint — Validate Delivery:**
```
POST /api/v1/deliveries/:id/validate
Role: Both
```
Transaction sequence:
1. Fetch delivery + lines
2. For each line: check `stock_levels.quantity >= line.qty` → 422 with details if insufficient
3. `BEGIN` transaction
4. For each line: `UPDATE stock_levels SET quantity = quantity - qty`
5. INSERT `stock_ledger` rows (delta = -qty)
6. UPDATE delivery status → `done`
7. `COMMIT`
8. Check low-stock alerts

**Insufficient Stock Response (422):**
```json
{
  "error": "Insufficient stock",
  "details": [
    { "productId": "uuid", "productName": "Item A", "requested": 10, "available": 3 }
  ]
}
```

### 7.4 Internal Transfers

**Status Machine:**
```
draft → ready → done
  └─────────────→ canceled
```

**Key Endpoint — Validate Transfer:**
```
POST /api/v1/transfers/:id/validate
Role: Both
```
Transaction sequence:
1. Verify `fromLocationId != toLocationId`
2. Check stock at source location for each line
3. `BEGIN` transaction
4. For each line:
   - Decrease `stock_levels` at `from_location_id`
   - Increase (or UPSERT) `stock_levels` at `to_location_id`
   - INSERT 2 ledger rows (negative for source, positive for destination)
5. UPDATE transfer status → `done`
6. `COMMIT`
7. Check low-stock alerts for source location

### 7.5 Stock Adjustments

**Single-step operation** — no draft state.

```
POST /api/v1/adjustments
Role: Manager only
```
Request body:
```typescript
{
  productId:  string (uuid),
  locationId: string (uuid),
  countedQty: number (≥ 0),
  reason:     'damage' | 'loss' | 'counting_error' | 'found_goods' | 'other'
}
```
Transaction sequence:
1. Fetch current `stock_levels.quantity` for product + location
2. Calculate `delta = countedQty - currentQty`
3. Validate `countedQty >= 0` (cannot set negative stock)
4. `BEGIN` transaction
5. UPDATE `stock_levels` to `countedQty`
6. INSERT `adjustments` record (with `delta`)
7. INSERT `stock_ledger` row
8. `COMMIT`

### 7.6 Move History (Stock Ledger)

**Endpoints:**
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/ledger` | Paginated ledger; filters: productId, locationId, documentType, dateFrom, dateTo |
| GET | `/api/v1/ledger/export` | Query params: format=csv\|pdf; triggers async export |

**Default View:** Today's movements, sorted newest first.

**Pagination:** `?page=1&limit=50` (max 200). Returns total count in `meta`.

**Export Flow:**
1. `GET /ledger/export?format=csv&...filters` — server generates file asynchronously
2. Returns `202 Accepted` with `{ jobId }` immediately
3. Client polls `GET /ledger/export/:jobId` until `{ status: 'ready', downloadUrl }`
4. File served as signed URL or streamed directly

Tools: `csv-writer` for CSV; `PDFKit` for PDF.

---

## 8. Phase 5 — Frontend SPA

### 8.1 Route Map

| Route | Component | Role Guard | Description |
|---|---|---|---|
| `/login` | `LoginPage` | Public | Login form |
| `/signup` | `SignupPage` | Public | Registration |
| `/dashboard` | `DashboardPage` | Both | KPI cards + operation list |
| `/receipts` | `ReceiptListPage` | Both | Paginated receipt list |
| `/receipts/:id` | `ReceiptDetailPage` | Both | Receipt form + validate |
| `/deliveries` | `DeliveryListPage` | Both | Paginated delivery list |
| `/deliveries/:id` | `DeliveryDetailPage` | Both | Delivery form + validate |
| `/transfers` | `TransferListPage` | Both | Transfer list |
| `/transfers/:id` | `TransferDetailPage` | Both | Transfer form + validate |
| `/adjustments` | `AdjustmentPage` | Manager | Stock adjustment form |
| `/move-history` | `MoveHistoryPage` | Both | Ledger table + export |
| `/products` | `ProductListPage` | Manager | Product catalog |
| `/products/:id` | `ProductDetailPage` | Manager | Product detail + stock |
| `/settings/warehouses` | `WarehouseSettingsPage` | Manager | Warehouse CRUD |
| `/settings/locations` | `LocationSettingsPage` | Manager | Location CRUD |
| `/profile` | `ProfilePage` | Both | Profile + password change |

### 8.2 Shared UI Components

**`<KPICard />`**
```
Props: { label, count, trend?, icon, linkTo?, filter? }
Behavior: Clickable → navigates to linked list with pre-applied filter
Colors: neutral bg with accent border per card type
```

**`<OperationsTable />`**
```
Props: { rows, columns, isLoading, onRowClick, sortable? }
Features: skeleton loading state, status badge per row, clickable rows
```

**`<StatusBadge />`**
```
draft    → gray pill
waiting  → yellow pill
ready    → blue pill
done     → green pill
canceled → red pill
```

**`<DocumentForm />`** (Generic wrapper for Receipt/Delivery/Transfer)
```
Props: { document, onSave, onValidate, onCancel, mode: 'create'|'view' }
Layout: Header section (supplier/customer, reference) + Line items table + Action bar
Action bar: [Cancel] [Save Draft] [Validate] — buttons disabled based on status
```

**`<LineItemRow />`** (within DocumentForm)
```
Cols: Product (searchable dropdown), [UoM], [Current Stock], Qty (number input), [Delete]
Validation: qty > 0, product required
Show current stock level inline to help user avoid over-committing
```

**`<StockLedgerTable />`** (Move History)
```
Virtualized via react-virtual for 10,000+ rows
Cols: Date/Time, Product, Location, Document Type, Document Ref, Delta (+/-), Balance After, Operator
```

**`<FilterBar />`**
```
Props: { filters: FilterConfig[], onChange }
Controls: Date range picker, multi-select dropdowns for type/status/location/category
URL sync: filter state reflected in URL query params for shareability
```

**`<AlertBanner />`**
```
Rendered in top of dashboard if low-stock items exist
Shows count + list of products below threshold, links to product detail
Dismissable per session (not persistent)
```

### 8.3 State Architecture

**React Query Keys:**
```typescript
const QUERY_KEYS = {
  dashboard:   ['dashboard', 'kpis'],
  receipts:    (filters) => ['receipts', filters],
  receipt:     (id) => ['receipts', id],
  deliveries:  (filters) => ['deliveries', filters],
  products:    (filters) => ['products', filters],
  ledger:      (filters) => ['ledger', filters],
  // ... etc
};
```

**Zustand Stores:**
```typescript
// store/auth.store.ts   → user, accessToken, setAuth, clearAuth
// store/ui.store.ts     → sidebarOpen, activeFilters, modals
```

**Optimistic Updates:**
- Status transitions (e.g., validate receipt) show new status immediately; rollback on error
- Line item add/remove applied optimistically in document form

### 8.4 Mobile & Tablet Responsiveness

- Sidebar collapses to hamburger menu on mobile (< 768px)
- Tables scroll horizontally on small screens
- Document forms use stacked layout on mobile
- Primary actions (Validate button) always visible at bottom of screen
- Touch-friendly input sizes (min 44px tap targets per WCAG)

---

## 9. Phase 6 — Reporting & Notifications

### 9.1 Dashboard KPI API

```
GET /api/v1/dashboard/kpis
```
Response:
```json
{
  "data": {
    "totalProducts":        150,
    "lowStockCount":        12,
    "outOfStockCount":       3,
    "pendingReceiptsCount":  4,
    "pendingDeliveriesCount": 2,
    "pendingTransfersCount": 1,
    "lowStockProducts": [
      { "id": "uuid", "name": "Item A", "sku": "SKU001", "currentQty": 5, "reorderMin": 10 }
    ]
  }
}
```

Implementation: Use PostgreSQL materialized view or aggregated query with 60-second result cache (in-memory or Redis). Refresh triggered by any stock mutation.

### 9.2 Low-Stock Alert System

**Trigger:** After every successful stock mutation, check:
```sql
SELECT p.id, p.name, sl.quantity, p.reorder_min
FROM stock_levels sl
JOIN products p ON p.id = sl.product_id
WHERE p.deleted_at IS NULL
  AND sl.quantity <= p.reorder_min
  AND sl.product_id IN (mutated_product_ids)
```

**In-app notification:**
- Store alerts in memory or short-lived cache
- `GET /api/v1/alerts` returns current low-stock items
- Frontend polls this endpoint every 60 seconds
- Badge count shown on nav sidebar

### 9.3 Export Generation

**CSV Export** (using `csv-writer`):
```
Fields: date, product_sku, product_name, location, document_type, document_ref,
        delta, balance_after, operator_name
```

**PDF Export** (using `PDFKit`):
- Company header: "CoreInventory — Stock Ledger Report"
- Applied filters summary
- Table with same fields as CSV
- Footer: generated timestamp, page numbers

---

## 10. Phase 7 — Settings & Admin

### 10.1 Warehouse Management

| Endpoint | Method | Role | Body |
|---|---|---|---|
| `/api/v1/warehouses` | GET | Both | — |
| `/api/v1/warehouses` | POST | Manager | `{ name, shortCode, address? }` |
| `/api/v1/warehouses/:id` | PUT | Manager | `{ name, address? }` |
| `/api/v1/warehouses/:id` | DELETE | Manager | Soft-delete |
| `/api/v1/warehouses/:id/locations` | GET | Both | All locations under warehouse |

**Business Rules:**
- `shortCode` must be unique across all warehouses
- Cannot delete a warehouse that has active stock (stock_levels.quantity > 0)

### 10.2 Location Management

| Endpoint | Method | Role | Body |
|---|---|---|---|
| `/api/v1/locations` | POST | Manager | `{ warehouseId, name, shortCode }` |
| `/api/v1/locations/:id` | PUT | Manager | `{ name }` |
| `/api/v1/locations/:id` | DELETE | Manager | Soft-delete |

**Business Rules:**
- `shortCode` must be unique within a warehouse
- Cannot delete a location that has active stock

### 10.3 User Profile

| Endpoint | Method | Description |
|---|---|---|
| `GET /api/v1/profile` | GET | Current logged-in user data |
| `PUT /api/v1/profile` | PUT | Update name |
| `PUT /api/v1/profile/password` | PUT | Change password (requires current password) |

---

## 11. Testing Strategy

### 11.1 Unit Tests (Jest)
**Target coverage: 80%+**

Focus areas:
- `stock.service.ts` — all mutation scenarios (increase, decrease, insufficient stock, adjustment)
- Document status machine transitions (valid and invalid transitions)
- Zod schema validators (valid, invalid, edge cases)
- Reference number generation
- OTP generation and expiry logic
- Low-stock alert trigger logic

**Run:**
```bash
cd backend
npm run test:unit
# or for watch mode:
npm run test:unit -- --watch
```

### 11.2 Integration Tests (Supertest + Test DB)
**Target coverage: 70%+ of all API endpoints**

Setup:
- Separate test PostgreSQL DB (`coreinventory_test`)
- `beforeAll`: run migrations, seed base data
- `afterEach`: clean mutated data (transactions or truncate)
- `afterAll`: close DB connection

Critical flows to test per module:
- Auth: register, login, duplicate email, wrong password, OTP reset
- Products: create, list with filters, soft-delete, duplicate SKU
- Receipts: full lifecycle draft → validate, insufficient guard, cancel
- Deliveries: full lifecycle, insufficient stock 422
- Transfers: validate, source=destination guard, insufficient stock
- Adjustments: apply delta, negative prevention, mandatory reason
- Ledger: filter combinations, export trigger

**Run:**
```bash
cd backend
npm run test:integration
```

### 11.3 E2E Tests (Playwright)
**Critical paths to automate:**

1. **Login → Dashboard**: Login with valid credentials; assert KPI cards loaded
2. **Create & Validate Receipt**: Create receipt, add 2 products, validate; assert status = Done, stock increased
3. **Create & Validate Delivery (sufficient stock)**: Create delivery; validate; assert stock decreased
4. **Delivery — Insufficient Stock**: Try to validate delivery with more qty than available; assert 422 error shown
5. **Stock Adjustment**: Apply adjustment with reason; assert ledger entry created
6. **Move History Filter**: Apply product + date filter; assert table shows only matching rows
7. **Low-stock Alert**: Configure reorder threshold; trigger alert; assert banner visible

**Run:**
```bash
cd frontend
npx playwright test
# With UI:
npx playwright test --ui
```

### 11.4 Load Tests (k6)
**Target endpoints:** `/dashboard/kpis` and `/ledger` at 100 concurrent users.

```bash
# From project root
k6 run tests/load/dashboard.k6.js
k6 run tests/load/ledger.k6.js
```

**Acceptance criteria:**
- p95 latency < 2s for dashboard
- p95 latency < 3s for filtered ledger (10,000+ rows)
- Error rate < 0.1% under 100 VUs

### 11.5 Manual Verification Checklist

Before each release, verify manually:
- [ ] Sign up as Manager; sign up as Staff; both can log in
- [ ] Password reset via OTP works end-to-end (check email received)
- [ ] Manager can access Settings; Staff sees 403 on Settings routes
- [ ] Create 3 products with different categories
- [ ] Create a warehouse + 2 locations
- [ ] Process a receipt; verify stock increases in product stock view
- [ ] Process a delivery; verify stock decreases; test insufficient stock case
- [ ] Run internal transfer; verify source decreases, destination increases
- [ ] Apply adjustment; verify ledger shows before/after values
- [ ] Export ledger as CSV and PDF; open both and verify content
- [ ] Low-stock alert visible on dashboard when qty ≤ reorder_min
- [ ] Mobile: open on 375px viewport; sidebar hamburger works; forms are usable

---

## 12. Deployment Architecture

### 12.1 Environments

| Environment | Purpose | Trigger |
|---|---|---|
| `development` | Local dev | Manual |
| `staging` | Pre-production QA | PR merge to `develop` |
| `production` | Live | PR merge to `main` after staging sign-off |

### 12.2 Infrastructure

```
Frontend:
  - Build: Vite → static files
  - Host: Vercel or AWS CloudFront + S3
  - Config: env vars via hosting platform

Backend:
  - Containerized: Docker image (multi-stage build)
  - Host: AWS ECS Fargate or GCP Cloud Run
  - Port: 4000
  - Health check: GET /api/health

Database:
  - AWS RDS PostgreSQL 15 (or GCP Cloud SQL)
  - Daily automated snapshots
  - Point-in-time recovery enabled
  - SSL-only connections
```

### 12.3 Docker Configuration

**Backend Dockerfile (multi-stage):**
```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
EXPOSE 4000
CMD ["node", "dist/app.js"]
```

### 12.4 GitHub Actions CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env: { POSTGRES_DB: coreinventory_test, ... }
    steps:
      - checkout
      - npm ci
      - npm run lint
      - npm run type-check
      - npm run test:unit
      - npm run test:integration

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - checkout
      - npm ci
      - npm run lint
      - npm run type-check
      - npm run build

  deploy-staging:
    needs: [test-backend, test-frontend]
    if: github.ref == 'refs/heads/develop'
    # Docker build + push + deploy to staging
```

---

## 13. Milestones & Timeline

| Phase | Milestone | Estimated Duration |
|---|---|---|
| **Phase 1** | Foundation & Infrastructure (both backend + frontend scaffolded, DB connected) | 3–4 days |
| **Phase 2** | Authentication (register, login, OTP reset, RBAC) | 3–4 days |
| **Phase 3** | DB Schema + Core Stock Mutation Engine | 2–3 days |
| **Phase 4 — Products** | Product & Category CRUD API + frontend | 2–3 days |
| **Phase 4 — Receipts** | Full receipt lifecycle API + UI | 3–4 days |
| **Phase 4 — Deliveries** | Full delivery lifecycle API + UI | 2–3 days |
| **Phase 4 — Transfers** | Internal transfer API + UI | 2–3 days |
| **Phase 4 — Adjustments** | Adjustment API + UI | 1–2 days |
| **Phase 5 — Dashboard** | KPI cards + operations list + filter bar | 2–3 days |
| **Phase 5 — Move History** | Ledger table, filters, virtualization | 2–3 days |
| **Phase 6 — Reporting** | CSV + PDF export, low-stock alerts | 2–3 days |
| **Phase 7 — Settings** | Warehouse + Location CRUD, Profile | 2–3 days |
| **Testing & QA** | Unit, integration, E2E, load tests, manual checklist | 4–5 days |
| **Deployment** | Docker, CI/CD, staging, production | 2–3 days |
| **Total Estimate** | | **~32–44 working days** |

---

## 14. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Resistance to adoption by warehouse staff | Medium | High | Simple UI; role-specific views; onboarding sessions; champion users |
| Data migration from Excel sheets | Medium | Medium | Provide CSV import template with field mapping guide |
| Multi-warehouse concurrent stock conflicts | Low | High | `SELECT FOR UPDATE` optimistic locking + full DB transaction rollback |
| Low-stock threshold misconfiguration | Medium | Medium | Default thresholds (0) + admin test-alert feature |
| Export performance for large ledgers | Medium | Medium | Async generation + polling; stream PDF via chunks |
| JWT token theft | Low | High | Short TTL (15 min); httpOnly refresh cookie; HTTPS enforced |
| Database connection exhaustion | Low | High | Prisma connection pool tuning; PgBouncer for production |
| CI/CD pipeline failure blocking deployment | Medium | Medium | Manual deployment runbook documented; rollback scripts ready |

---

*End of Implementation Plan — CoreInventory v1.0*
