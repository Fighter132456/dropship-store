import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { Header } from "@/components/Header";
import { formatPrice } from "@/lib/format";
import { getProductForCurrentTenant } from "@/lib/products";
import { getTenant } from "@/lib/tenant";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const tenant = await getTenant();

  if (!tenant) {
    notFound();
  }

  const product = await getProductForCurrentTenant(id);
  if (!product) {
    notFound();
  }

  const primary = tenant.theme_json.colors?.primary ?? "#2563eb";
  const image = product.images_json[0];

  return (
    <>
      <Header tenant={tenant} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Link href="/" className="mb-6 inline-block text-sm text-slate-600 hover:text-slate-900">
          ← Back to products
        </Link>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="aspect-square overflow-hidden rounded-xl bg-slate-100">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image.url}
                alt={image.alt ?? product.title}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <p className="text-2xl font-bold" style={{ color: primary }}>
              {formatPrice(product.price_cents)}
            </p>
            {product.description ? (
              <p className="leading-relaxed text-slate-700">{product.description}</p>
            ) : null}
            <p className="text-sm text-slate-500">SKU: {product.sku}</p>
            <AddToCartButton productId={product.id} primaryColor={primary} />
          </div>
        </div>
      </main>
    </>
  );
}
