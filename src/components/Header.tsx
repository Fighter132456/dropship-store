import Image from "next/image";
import Link from "next/link";
import { CartCountLink } from "@/components/CartCountLink";
import type { Tenant } from "@/types/store";

type HeaderProps = {
  tenant: Tenant;
};

export function Header({ tenant }: HeaderProps) {
  const primary = tenant.theme_json.colors?.primary ?? "#2563eb";
  const logoSrc = tenant.theme_json.logo;

  return (
    <header
      className="border-b border-slate-200 bg-white"
      style={{ borderBottomColor: `${primary}20` }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="min-w-0">
          <Link href="/" className="inline-flex max-w-full flex-col gap-0.5">
            {logoSrc ? (
              <Image
                src={logoSrc}
                alt={tenant.name}
                width={200}
                height={48}
                className="h-10 w-auto max-w-[min(200px,70vw)]"
                priority
              />
            ) : (
              <span className="text-xl font-bold" style={{ color: primary }}>
                {tenant.name}
              </span>
            )}
            {tenant.theme_json.copy?.tagline ? (
              <p className="truncate text-sm text-slate-600">{tenant.theme_json.copy.tagline}</p>
            ) : null}
          </Link>
        </div>
        <CartCountLink primaryColor={primary} />
      </div>
    </header>
  );
}
