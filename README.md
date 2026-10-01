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

## Tenant routing

| Environment | Resolution |
|-------------|------------|
| Local | `?tenant=store1` or `store1.localhost:3000` |
| Production | `Host` → lookup `tenants.domain` |

Middleware sets `tenant-id` cookie and `x-tenant-id` header. Server queries call `set_tenant` RPC before RLS-scoped reads.

## Database

Migrations live in `supabase/migrations/`. Applied to Supabase project ref **`ugzpgkxdemcthsmetvon`**.

Tables: `tenants`, `products`, `orders`, `order_items`, `cj_sync_log`

## Checkout flow (S36)

1. Cart stored in `localStorage`
2. `POST /api/checkout` validates products server-side (tenant-scoped, DB prices)
3. Redirect to Stripe Checkout Session (test mode)
4. Success → `/checkout/success`

**S37:** Stripe webhook → `orders` → n8n WF26 → CJ fulfill

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

## Related

- VPS agent-stack: `docs/CUSTOM-STORE-STACK-PLAN.md`
- Team T10 Stores: `agent-stack/config/teams/stores.yaml`
