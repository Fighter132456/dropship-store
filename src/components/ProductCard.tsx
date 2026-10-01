import Link from "next/link";
import type { Product } from "@/types/store";
import { formatPrice } from "@/lib/format";

type ProductCardProps = {
  product: Product;
  primaryColor?: string;
};

export function ProductCard({ product, primaryColor = "#2563eb" }: ProductCardProps) {
  const image = product.images_json[0];

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="aspect-square overflow-hidden bg-slate-100">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image.url}
            alt={image.alt ?? product.title}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">No image</div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h2 className="font-semibold text-slate-900">{product.title}</h2>
        <p className="text-lg font-bold" style={{ color: primaryColor }}>
          {formatPrice(product.price_cents)}
        </p>
      </div>
    </Link>
  );
}
