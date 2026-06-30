# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**LUXE Store** — a full-stack e-commerce platform (Vietnamese market) with NestJS backend and Next.js frontend, supporting VNPay payments, GHN shipping, and Gemini AI chatbot.

## Essential Commands

### Backend (`servers/`)
```bash
npm run start:dev        # Watch mode (port 5000)
npm run build && npm run start:prod
npm test                 # Jest unit tests
npm run test:e2e
npm run lint             # ESLint with auto-fix
npx prisma migrate dev --name <name>
npx prisma studio        # Visual DB editor
npx prisma generate      # Regenerate client after schema changes
```

### Frontend (`client-next/`)
```bash
npm run dev              # Dev server (port 3000)
npm run build
npm run lint
```

### Docker (root)
```bash
docker-compose up --build   # All services: server, client, postgres, redis
docker-compose up db redis  # DB only (for local dev without Docker app servers)
```

API docs (dev only): `http://localhost:5000/api-docs`  
Health check: `GET /api/health`

## Architecture

### Monorepo Structure
- `servers/` — NestJS 11 + Prisma + PostgreSQL + Redis
- `client-next/` — Next.js 15 App Router + React 19 + Zustand + TanStack Query

### Backend (`servers/src/`)

Feature-based NestJS modules. Each module follows: `controller → service → repository` pattern.

Key cross-cutting infrastructure:
- **Auth**: JWT + Refresh tokens (stored in Redis) + Google OAuth2 (Passport)
- **Guards**: `JwtAuthGuard` (global), `RolesGuard`, `MaintenanceGuard`
- **Interceptors**: Audit logging, request timeout, response transform, logging
- **Rate limiting**: 3-tier throttler (short/medium/long)
- **Queue**: BullMQ for async tasks (email, notifications, exports)
- **Cache**: Redis via `CacheService` — wraps `cache-manager`
- **Validation**: `class-validator` + `class-transformer` on all DTOs

Domain modules: `auth`, `user`, `product`, `category`, `brand`, `cart`, `order`, `payment`, `discount`, `review`, `wishlist`, `chat`, `chatbot`, `notification`, `address`, `ghn`, `return`, `dashboard`, `report`, `banner`, `mail`, `upload`.

`common/` holds shared guards, interceptors, filters, decorators, and health checks.

### Frontend (`client-next/src/`)

- **Route groups**: `(auth)/` — login/register flows; `(customer)/` — storefront; `admin/` — dashboard
- **`features/`** — Feature modules each containing `api/`, `components/`, `hooks/`, `store/`, `schemas/`, `types/`
- **State**: Zustand for client state (auth, cart, UI); TanStack Query for server state
- **UI**: Radix UI primitives in `components/ui/`; Tailwind CSS 4
- **Forms**: React Hook Form + Zod schemas
- **Real-time**: Socket.io-client (chat, order updates)

### Database (Prisma)

Schema at `servers/prisma/schema.prisma`. Key entities: `User`, `Product`, `ProductVariant`, `Order`, `Cart`, `Payment`, `Discount`, `Review`, `Address`, `ReturnRequest`, `Notification`, `ChatMessage`, `AuditLog`.

Soft deletes used on most entities (`deletedAt`). Indexed on `userId`, `productId`, `status`, timestamps.

## Environment Variables

Copy `.env.example` → `.env` in both `servers/` and `client-next/`.

Critical backend vars: `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `REDIS_PASSWORD`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `VNP_TMN_CODE`, `VNP_HASH_SECRET`, `GHN_TOKEN`, `GEMINI_API_KEY`, `CLOUDINARY_CLOUD_NAME`.

Critical frontend vars: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SOCKET_URL`, `NEXT_PUBLIC_APP_URL`.

## Key Integration Notes

- **VNPay**: IPN webhook at `/api/payment/vnpay-ipn`; test against sandbox URL
- **GHN**: Shipping fee calculation + shipment creation; webhook for status updates; address lookup via province/district/ward codes
- **Google OAuth**: Callback URL must be registered in Google Console
- **Cloudinary**: Used for all image uploads (products, reviews, banners)
- **Gemini**: Chatbot uses multi-turn conversation with cart context for product recommendations
- **BullMQ**: Queues for email delivery, push notifications, data export jobs

## Common Pitfalls

- After changing `prisma/schema.prisma`, always run `npx prisma generate` before `migrate dev`
- `REDIS_PASSWORD` in `.env` must match the password in `docker-compose.yml`
- Swagger is disabled in production (`NODE_ENV !== 'development'`)
- Google OAuth callback URL must match exactly what's configured in Google Console
