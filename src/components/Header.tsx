import Link from "next/link";
import { CartCountLink } from "@/components/CartCountLink";
import type { Tenant } from "@/types/store";

type HeaderProps = {
  tenant: Tenant;
};

export function Header({ tenant }: HeaderProps) {
  const primary = tenant.theme_json.colors?.primary ?? "#2563eb";

  return (
    <header
      className="border-b border-slate-200 bg-white"
      style={{ borderBottomColor: `${primary}20` }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div>
          <Link href="/" className="text-xl font-bold" style={{ color: primary }}>
            {tenant.name}
          </Link>
          {tenant.theme_json.copy?.tagline ? (
            <p className="text-sm text-slate-600">{tenant.theme_json.copy.tagline}</p>
          ) : null}
        </div>
        <CartCountLink primaryColor={primary} />
      </div>
    </header>
  );
}
