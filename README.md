# 🛒 Makara Store

An online store for digital products (AI tool subscriptions, top-ups, card keys and accounts) with Bakong KHQR and Stripe payments and an admin panel.

## Features
- Product catalog, categories, cart, favorites and checkout
- Payments with **Bakong KHQR** (with receipt verification) and **Stripe**
- Order tracking, order lookup and purchase history
- Top-up services and automated delivery logs
- Floating AI chat assistant
- Email/password auth with password reset (NextAuth)
- Khmer / English translations
- Admin panel: products, orders, Bakong queue, card keys, account inventory, receipts, announcements, settings
- Background worker (`apps/worker`)

## Tech stack
Next.js 14 · React · TypeScript · Tailwind CSS · Prisma (MongoDB) · NextAuth · Stripe · bakong-khqr · Zustand · Framer Motion · Nodemailer

## Run locally
```bash
npm install
cp .env.example .env   # fill in MongoDB, Stripe, Bakong and email settings
npx prisma generate
npm run dev
```
