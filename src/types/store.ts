export type TenantStatus = "active" | "inactive" | "suspended";

export type TenantCategoryTheme = {
  slug: string;
  nav_pl: string;
  hero_title: string;
  hero_teaser: string;
  image_alt: string;
  placeholder_url: string;
};

export type TenantTrustItem = {
  id: string;
  label: string;
  detail: string;
};

export type TenantShippingRegion = {
  code: string;
  label: string;
  days_min: number;
  days_max: number;
  note_pl: string;
};

export type TenantTheme = {
  logo?: string;
  colors?: {
    primary?: string;
    secondary?: string;
    background?: string;
    text?: string;
    accent?: string;
    muted?: string;
  };
  typography?: {
    heading?: string;
    body?: string;
  };
  copy?: {
    tagline?: string;
    footer?: string;
    locale?: string;
    meta_home_title?: string;
    meta_home_description?: string;
    about_short?: string;
    contact_intro?: string;
    hero?: {
      eyebrow?: string;
      headline?: string;
      subheadline?: string;
      cta_primary?: string;
      cta_secondary?: string;
    };
  };
  categories?: TenantCategoryTheme[];
  trust_strip?: TenantTrustItem[];
  shipping?: {
    regions?: TenantShippingRegion[];
    free_shipping_threshold_cents?: number | null;
    display_pl?: string;
  };
  umami_website_id?: string;
  support_email?: string;
  /** Pre-launch seller identification — replace placeholders before go-live. */
  legal_entity?: {
    business_name?: string;
    address?: string;
    nip?: string;
    regon?: string;
    email?: string;
  };
};

export type Tenant = {
  id: string;
  slug: string;
  domain: string;
  name: string;
  theme_json: TenantTheme;
  status: TenantStatus;
};

export type ProductImage = {
  url: string;
  alt?: string;
};

export type Product = {
  id: string;
  tenant_id: string;
  sku: string;
  title: string;
  description: string | null;
  price_cents: number;
  cj_product_id: string | null;
  images_json: ProductImage[];
  active: boolean;
};

export type CartItem = {
  productId: string;
  qty: number;
};

export type CheckoutItem = {
  productId: string;
  qty: number;
};
