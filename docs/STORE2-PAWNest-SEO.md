# PawNest (store2) — SEO · F4 seo_specialist

**Project:** `dropship_store_2` · **Tenant:** `store2` · **Domain:** `store2.fighter132456.pl`  
**Brand:** PawNest · Forest & Amber · 7 SKU (GPS, slow-feeder, legowiska, fontanny, półki, szczotki, szelki LED)

## Kanoniczne URL (indeksowanie)

| Typ | URL |
|-----|-----|
| Strona główna | `https://store2.fighter132456.pl/` |
| Produkt | `https://store2.fighter132456.pl/products/{uuid}` |
| Polityka prywatności | `https://store2.fighter132456.pl/privacy-policy` |
| Regulamin | `https://store2.fighter132456.pl/terms-of-service` |
| Zwroty | `https://store2.fighter132456.pl/refund-policy` |
| Cookies | `https://store2.fighter132456.pl/cookie-policy` |
| Impressum | `https://store2.fighter132456.pl/impressum` |
| Sitemap | `https://store2.fighter132456.pl/sitemap.xml` |
| Robots | `https://store2.fighter132456.pl/robots.txt` |

**Noindex (celowo):** `/cart`, `/checkout/success`, `/api/*`, `/tenant-not-found`.

## Meta (homepage)

- **Title:** `theme_json.copy.meta_home_title` → domyślnie „PawNest — akcesoria dla psów i kotów”.
- **Description:** `meta_home_description` (7 kategorii + wysyłka PL/UE).
- **H1:** `copy.hero.subheadline` (unikalny, opisowy — nie samo „Products”).
- **OG/Twitter:** logo SVG z `/tenants/store2/logo.svg` (absolute URL przez `metadataBase`).

## Schema.org (w kodzie)

| Strona | Typy JSON-LD |
|--------|----------------|
| Layout | `Organization` (+ logo), `WebSite` (`inLanguage: pl-PL`) |
| `/` | `FAQPage`, `ItemList` (7 produktów) |
| `/products/[id]` | `Product` + `Offer`, `BreadcrumbList` |

### Product / Offer (Merchant-ready baseline)

- Wymagane: `name`, `image[]`, `offers` (`Offer`: `price`, `priceCurrency`, `availability`).
- Dodane (recommended): `sku`, `description`, `brand`, `seller`, `itemCondition`, `shippingDetails`, `hasMerchantReturnPolicy` (14 dni, link `/refund-policy`).
- **Brak:** `gtin`/`mpn`, `aggregateRating`, `review` — dopiero po realnych opiniach lub danych CJ (inaczej ryzyko rich-result penalty).

### Walidacja po deploy

1. [Rich Results Test](https://search.google.com/test/rich-results) — URL produktu + homepage.
2. Schema Markup Validator — opcjonalnie drugi check.

## Obrazy i alt

| Źródło | Alt |
|--------|-----|
| `products.images_json[].alt` | Z migracji 007 (np. „Obroża GPS dla psa PawNest”) |
| `theme_json.categories[].image_alt` | Dla kafelków hero (UI) |
| Logo w headerze | `tenant.name` |

**Google Shopping / Merchant:** docelowo min. **800×800 px**, WebP/JPEG, brak placeholder text on image dla produkcji. Do czasu CJ / Twojego TAK na batch AI — placehold.co OK na staging, **nie** na feedzie produkcyjnym.

## Google Search Console

1. **Property:** dodaj `sc-domain:store2.fighter132456.pl` (domain) lub prefix `https://store2.fighter132456.pl/` — jedna właściwość na sklep.
2. **Weryfikacja:** DNS TXT (zalecane przy domain property) lub plik HTML / meta tag na hoście reverse proxy.
3. **Sitemap:** prześlij `https://store2.fighter132456.pl/sitemap.xml`.
4. **Po impressum go-live:** URL Inspection na `/impressum` — upewnij się, że nie ma placeholderów `[DO UZUPEŁNIENIA…]` przed masowym linkowaniem.
5. **Monitoring:** strony `/products/*` (tytuły PL, duplicate meta), błędy „Product” w Enhancements po włączeniu schema.

## Google Merchant Center (kiedy przejdziesz z testów)

**Stan:** sklep Stripe TEST, dropship CJ — feed można przygotować technicznie, kampanie Shopping po LIVE + danych sprzedawcy.

| Krok | Akcja |
|------|--------|
| Konto | Nowe MC lub multi-client; kraj sprzedaży: **Polska** + UE wg wysyłki |
| Domena | Zweryfikuj `store2.fighter132456.pl` + claim w MC |
| Feed | Suplement: **Product schema na stronie** + opcjonalnie XML/Content API (sunset Content API 2026-08-18 — preferuj Merchant API / feed plik) |
| Polityki | Linki kanoniczne: zwroty, regulamin, prywatność (już w stopce) |
| Shipping | Zgodne z `theme_json.shipping` (5–14 dni) — ustaw też w MC |
| Returns | 14 dni UE — spójne ze schema `merchantReturnDays: 14` |
| Identifiers | Po CJ: uzupełnij GTIN/MPN w DB → rozszerz `buildProductSchema` |
| GPS / subskrypcja | Oznacz ograniczenia odstąpienia w opisie feedu zgodnie z regulaminem |

**Free listings:** wymagają poprawnego `Offer` na stronie docelowej (mamy) i zgodności ceny checkout ↔ landing.

## Umami (store_engineer)

| Pole | Wartość |
|------|---------|
| Website ID | `aff7de94-597b-41df-afc8-3d81fab4f609` |
| Base URL | `NEXT_PUBLIC_UMAMI_BASE_URL` (domyślnie `https://analytics.fighter132456.pl`) |
| Skrypt | `UmamiScript` + zgoda cookies (`CookieConsent`) |

### Zdarzenie `purchase` (checkout success)

- **Gdzie:** `PurchaseTracker` na `/checkout/success?session_id=…`
- **Kiedy:** po GET `/api/checkout/session?session_id=` (suma z Stripe TEST)
- **Payload:**

```json
{
  "revenue": 123.45,
  "currency": "PLN",
  "checkout_session": "cs_test_..."
}
```

- **Dedup:** `sessionStorage` klucz `umami_purchase_{session_id}` — odświeżenie strony nie podwaja revenue.
- **W panelu Umami:** Events → `purchase` → włącz **revenue** jako metrykę celu.
- **Nie** duplikować tego samego zakupu w GA4, dopóki GA4 nie jest osobno podpięte dla store2.

### Opcjonalne eventy (nie zaimplementowane — backlog)

- `add_to_cart`, `begin_checkout` — jeśli potrzebne lejki, dodać w `AddToCartButton` / checkout API z cookie consent gate.

## UCP (opcjonalnie, po MC + LIVE)

Profil `/.well-known/ucp` — dopiero gdy checkout produkcyjny i polityki bez placeholderów. Na razie brak profilu = brak błędu.

## Checklist przed publish_store

- [ ] `legal_entity` w Supabase uzupełnione → impressum bez placeholderów
- [ ] Migracja 007 na prod + `meta_home_title` w theme
- [ ] GSC sitemap + 1–2 produkty „URL submitted”
- [ ] Rich Results Test na 1 produkcie
- [ ] CJ zdjęcia ≥800 px + alt w `images_json`
- [ ] Umami: test purchase w Stripe TEST → event z revenue w dashboardzie
