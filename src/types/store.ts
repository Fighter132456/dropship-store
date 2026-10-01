export type TenantStatus = "active" | "inactive" | "suspended";

export type TenantTheme = {
  logo?: string;
  colors?: {
    primary?: string;
    secondary?: string;
    background?: string;
    text?: string;
  };
  copy?: {
    tagline?: string;
    footer?: string;
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
