# dropship-store

Multi-tenant dropship storefront (Next.js App Router + Supabase + Stripe Checkout).

**MVP tenant:** `store1` · domain `store1.fighter132456.pl`

## Stack

- Next.js 16 App Router · TypeScript · Tailwind CSS
- Supabase project **`stores`** (multi-tenant RLS)
- Stripe Checkout (test mode)
- CJ Dropshipping (product sync — S37+)

## Local dev

```bash
pnpm install
cp .env.example .env.local
# Fill Supabase + Stripe test keys
pnpm dev
```

Open [http://localhost:3000?tenant=store1](http://localhost:3000?tenant=store1)

On plain `localhost`, middleware defaults to tenant `store1`.

Alternative: [http://store1.localhost:3000](http://store1.localhost:3000)

### Store 2 (QA — no prod DNS yet)

Store2 shares the same Supabase project and Vercel deployment. Use query param until `store2.fighter132456.pl` (Vercel Pro + DNS):

| Environment | URL |
|-------------|-----|
| Local | [http://localhost:3000?tenant=store2](http://localhost:3000?tenant=store2) |
| Prod (store1 host) | [https://store1.fighter132456.pl/?tenant=store2](https://store1.fighter132456.pl/?tenant=store2) |
| Vercel preview | `https://<preview-id>.vercel.app/?tenant=store2` |

Umami website_id for store2: `aff7de94-597b-41df-afc8-3d81fab4f609` (from `projects.yaml`).

## Tenant routing

| Environment | Resolution |
|-------------|------------|
| Local | `?tenant=store1` or `store1.localhost:3000` |
| Production | `Host` → lookup `tenants.domain` |

Middleware sets `tenant-id` cookie and `x-tenant-id` header. Server queries call `set_tenant` RPC before RLS-scoped reads.

## Database

Migrations live in `supabase/migrations/`. Applied to Supabase project ref **`ugzpgkxdemcthsmetvon`**.

Tables: `tenants`, `products`, `orders`, `order_items`, `cj_sync_log`

## Checkout flow (S36–S37)

1. Cart stored in `localStorage`
2. `POST /api/checkout` validates products server-side (tenant-scoped, DB prices)
3. Redirect to Stripe Checkout Session (test mode)
4. Stripe webhook `POST /api/webhooks/stripe` → `orders` + `order_items` (idempotent on `stripe_session_id`)
5. Webhook triggers n8n WF26 → CJ draft (DRY_RUN) + Resend stub
6. Success → `/checkout/success` + Umami `purchase` event

### Local webhook (Stripe CLI)

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# Copy whsec_… into .env.local as STRIPE_WEBHOOK_SECRET, restart dev
pnpm dev
```

Requires `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` for order persistence.

## Vercel deploy (Hobby — manual, not in S36)

1. Import repo `fighter132456/dropship-store`
2. Set env vars from `.env.example`
3. Add domain `store1.fighter132456.pl` (DNS CNAME → Vercel, T7)
4. Upgrade to Pro when adding tenant #2 or custom domains at scale

## Scripts

```bash
pnpm dev      # dev server
pnpm build    # production build
pnpm lint     # ESLint
pnpm typecheck
```

## Observability

- **Umami:** consent-gated via `AnalyticsLoader`
- **Sentry (optional):** set `NEXT_PUBLIC_SENTRY_DSN` — browser SDK via CDN, free tier only

## GSC

See [docs/GSC-STORE1-PREP.md](docs/GSC-STORE1-PREP.md) for Search Console steps (CEO DNS).

## Related

- VPS agent-stack: `docs/CUSTOM-STORE-STACK-PLAN.md`
- Team T10 Stores: `agent-stack/config/teams/stores.yaml`
