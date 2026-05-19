# FoundersHub — Setup Guide

## Quick Start

```bash
npm install
cp .env.local.example .env.local
# Fill in your environment variables
npm run dev
```

---

## 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and paste the contents of `supabase-schema.sql`
3. Run it to create all tables, RLS policies, and triggers
4. Go to **Settings > API** — copy your URL and anon key to `.env.local`
5. Copy the service role key too
6. Enable **Google OAuth**: Authentication > Providers > Google
   - Create OAuth credentials in Google Cloud Console
   - Set redirect URL: `https://your-project.supabase.co/auth/v1/callback`

**Set yourself as admin:**
```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';
```

---

## 2. Stripe Setup

1. Create account at [stripe.com](https://stripe.com)
2. Create 3 products with recurring monthly prices:
   - **Starter**: €69/month → copy price ID to `STRIPE_STARTER_PRICE_ID`
   - **Pro**: €299/month → copy to `STRIPE_PRO_PRICE_ID`
   - **Pro + Consult**: €1,499/month → copy to `STRIPE_PRO_CONSULT_PRICE_ID`
3. Set up webhook at `https://yourdomain.com/api/billing/webhook`
   - Events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
   - Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`
4. Configure Customer Portal at Stripe Dashboard > Settings > Billing > Customer portal

---

## 3. Anthropic API

1. Get API key at [console.anthropic.com](https://console.anthropic.com)
2. Add to `ANTHROPIC_API_KEY`

---

## 4. Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or connect GitHub repo to Vercel dashboard and add all env vars.

**Important Vercel settings:**
- Framework: Next.js
- Node.js version: 18.x or 20.x
- Add all `.env.local` variables in Vercel > Settings > Environment Variables
- Update `NEXT_PUBLIC_APP_URL` to your production URL

---

## Project Structure

```
foundershub/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── callback/route.ts       # Supabase OAuth callback
│   │   └── check-email/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx              # Auth-protected layout
│   │   ├── page.tsx                # Overview
│   │   ├── ideas/
│   │   │   ├── page.tsx            # My ideas list
│   │   │   ├── new/page.tsx        # Submit new idea
│   │   │   └── [id]/page.tsx       # Idea + analysis view
│   │   ├── library/
│   │   │   ├── page.tsx            # Curated idea library
│   │   │   └── [id]/page.tsx       # Curated idea detail
│   │   └── billing/page.tsx        # Plans & Stripe checkout
│   ├── admin/
│   │   ├── layout.tsx              # Admin auth check
│   │   └── page.tsx                # Admin dashboard
│   └── api/
│       ├── analyze/route.ts        # Claude AI analysis
│       └── billing/
│           ├── checkout/route.ts   # Stripe checkout
│           ├── portal/route.ts     # Customer portal
│           └── webhook/route.ts    # Stripe webhooks
├── components/
│   ├── landing/                    # Landing page sections
│   └── dashboard/                  # Dashboard UI components
├── lib/supabase/
│   ├── client.ts                   # Browser client
│   └── server.ts                   # Server client + admin
├── types/index.ts                  # TypeScript types
├── supabase-schema.sql             # Database schema
└── middleware.ts                   # Route protection
```

---

## Plans & Pricing

| Plan | Price | Analyses | Notes |
|------|-------|----------|-------|
| Free Trial | €0 | 3 | 7-day trial, credit card required |
| Starter | €69/month | 20/month | |
| Pro | €299/month | Unlimited | Priority AI |
| Pro + Consult | €1,499/month | Unlimited | + Monthly call with Annie |

---

## Making Yourself Admin (Annie)

After signing up with your email, run this in Supabase SQL editor:

```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'your@email.com';
```

You'll then see the Admin Panel in the sidebar.
