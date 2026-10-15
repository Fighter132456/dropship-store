import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/ProductCard";
import { FaqSection } from "@/components/FaqSection";
import type { Product, Tenant } from "@/types/store";

type PawNestHomeProps = {
  tenant: Tenant;
  products: Product[];
  homeH1: string;
  primary: string;
};

export function PawNestHome({ tenant, products, homeH1, primary }: PawNestHomeProps) {
  const hero = tenant.theme_json.copy?.hero;
  const bg = tenant.theme_json.colors?.background ?? "#F7F5F0";
  const categories = tenant.theme_json.categories ?? [];
  const trust = tenant.theme_json.trust_strip ?? [];

  return (
    <main className="flex-1" style={{ backgroundColor: bg }}>
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90"
          style={{ backgroundImage: "url(/tenants/store2/hero-banner.svg)" }}
        />
        <div
          className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20"
          style={{
            background:
              "linear-gradient(90deg, rgba(27,67,50,0.92) 0%, rgba(27,67,50,0.55) 55%, transparent 100%)",
          }}
        >
          {hero?.eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-widest text-[#D4A373]">
              {hero.eyebrow}
            </p>
          ) : null}
          <h1 className="mt-2 max-w-2xl text-3xl font-bold leading-tight text-[#F7F5F0] sm:text-4xl">
            {hero?.headline ?? homeH1}
          </h1>
          {hero?.subheadline ? (
            <p className="mt-4 max-w-xl text-base text-[#F7F5F0]/90">{hero.subheadline}</p>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#products"
              className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#1C1917]"
              style={{ backgroundColor: "#D4A373" }}
            >
              {hero?.cta_primary ?? "Zobacz produkty"}
            </Link>
            <Link
              href="/privacy-policy"
              className="rounded-full border border-[#F7F5F0]/40 px-5 py-2.5 text-sm font-semibold text-[#F7F5F0]"
            >
              {hero?.cta_secondary ?? "Polityka prywatności"}
            </Link>
          </div>
        </div>
      </section>

      {trust.length > 0 ? (
        <section className="border-b border-[#2D6A4F]/10 bg-white/60">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-6 sm:grid-cols-4">
            {trust.map((item) => (
              <div key={item.id} className="text-center sm:text-left">
                <p className="text-sm font-semibold" style={{ color: primary }}>
                  {item.label}
                </p>
                <p className="text-xs text-[#57534E]">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {categories.length > 0 ? (
        <section className="mx-auto max-w-6xl px-4 py-10">
          <h2 className="mb-6 text-2xl font-bold" style={{ color: primary }}>
            Kategorie
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat) => (
              <div
                key={cat.slug}
                className="rounded-xl border border-[#2D6A4F]/15 bg-white p-3 shadow-sm"
              >
                <Image
                  src={`/tenants/store2/icons/${cat.slug === "szelki-led" ? "szelki-led" : cat.slug}.svg`}
                  alt={cat.image_alt}
                  width={48}
                  height={48}
                  className="mb-2 h-10 w-10"
                />
                <p className="font-semibold text-[#1C1917]">{cat.nav_pl}</p>
                <p className="text-xs text-[#57534E]">{cat.hero_teaser}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section id="products" className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="mb-6 text-2xl font-bold" style={{ color: primary }}>
          Produkty
        </h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} primaryColor={primary} />
            ))}
          </div>
        ) : (
          <p className="text-[#57534E]">Brak produktów — sprawdź migrację 007 na Supabase.</p>
        )}
        <FaqSection tenant={tenant} />
      </section>
    </main>
  );
}
