---
name: testing-admin-auth
description: Test the admin authentication flow end-to-end on makara-store. Use when verifying admin login, PIN verification, middleware redirects, or auth loop fixes.
---

# Testing Admin Auth Flow

## Overview
The admin auth flow has two layers:
1. **NextAuth session** (JWT strategy) — standard login via email+password or Google OAuth
2. **Admin PIN verification** — 6-digit PIN via `/admin/verify`, sets an HMAC-signed `admin-verified` cookie (24h TTL)

## Architecture
- **Middleware** (`src/middleware.ts`): Runs in Vercel Edge Runtime. Protects `/admin/*` routes.
  - `/admin/verify` is always allowed through (no JWT check)
  - Other admin routes require a valid `admin-verified` cookie (HMAC-verified with `NEXTAUTH_SECRET`)
  - `getToken()` from `next-auth/jwt` may fail intermittently in Edge Runtime — the middleware is designed to be resilient to this
- **Verify page** (`src/app/(admin)/admin/verify/page.tsx`): Checks session via `/api/admin/verify-status` (Node.js Runtime, reliable). Shows PIN form if authenticated, redirects to `/login` if not.
- **AdminRedirect** (`src/components/auth/AdminRedirect.tsx`): Global component that auto-redirects admin users from `/` or `/login` to `/admin/verify`. Has a 5-second sessionStorage cooldown to prevent loops.

## Devin Secrets Needed
- `ADMIN_EMAIL` — The admin email address
- `ADMIN_PASSWORD` — The admin password for credentials login
- `ADMIN_2FA_PIN` (optional) — The 6-digit PIN for full dashboard access. Without this, you can verify the auth flow reaches the PIN form but cannot complete dashboard entry.

## Test Environment
- **Preview**: Vercel auto-deploys PR branches. Preview URL format: `makara-store-git-<branch>-makarachan-dotcoms-projects.vercel.app`
- **Production**: `makaraservicestore.me` — auto-deploys from `main`
- Auth cookies are domain-scoped, so preview and production have separate sessions

## Key Test Scenarios

### 1. Admin Login → Verify Page (No Loop)
1. Navigate to `/login` on preview deployment
2. Enter admin email and password
3. Click login button
4. **Expected**: Redirects to `/admin/verify?callbackUrl=/admin/dashboard`
5. **Expected**: PIN form with 6 input boxes renders and stays stable (no auto-refresh)
6. **Fail signal**: URL rapidly changes between `/admin/verify`, `/`, `/login` — indicates redirect loop

### 2. Direct /admin/dashboard Access (Without PIN)
1. While logged in, navigate to `/admin/dashboard`
2. **Expected**: Redirects to `/admin/verify?callbackUrl=%2Fadmin%2Fdashboard`
3. **Expected**: PIN form loads, page stable

### 3. Unauthenticated Admin Route Access
1. Open incognito window
2. Navigate to `/admin/verify`
3. **Expected**: Redirects to `/login` (verify-status API returns 401)
4. **Expected**: No infinite loop — login page loads and stays

### 4. Full Flow with PIN (requires ADMIN_2FA_PIN)
1. Login as admin
2. Navigate to `/admin/verify`
3. Enter 6-digit PIN
4. **Expected**: Redirects to `/admin/dashboard`, dashboard loads fully
5. Navigate between admin pages (orders, products, settings)
6. **Expected**: No mid-navigation redirects or session loss

## Common Issues
- **`getToken()` returns null in Edge Runtime**: Known intermittent issue with NextAuth v4 on Vercel. The middleware uses `admin-verified` cookie as primary auth to work around this.
- **Redirect loops**: Usually caused by middleware rejecting a route that a client-side component then tries to redirect back to. Check `AdminRedirect`, login page `useEffect`, and verify page `useEffect` for competing redirects.
- **Cookie domain mismatch**: Preview deployments use a different domain than production. Auth cookies set on one won't work on the other.
