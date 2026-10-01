import Link from "next/link";
import type { Tenant } from "@/types/store";

type FooterProps = {
  tenant: Tenant;
};

export function Footer({ tenant }: FooterProps) {
  const primary = tenant.theme_json.colors?.primary ?? "#2563eb";
  const supportEmail =
    tenant.theme_json.support_email ??
    `support-${tenant.slug}@fighter132456.pl`;

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white/80 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <p>{tenant.theme_json.copy?.footer ?? `© ${new Date().getFullYear()} ${tenant.name}`}</p>
        <nav className="flex flex-wrap gap-x-4 gap-y-2">
          <Link href="/privacy-policy" className="hover:underline" style={{ color: primary }}>
            Privacy
          </Link>
          <Link href="/terms-of-service" className="hover:underline" style={{ color: primary }}>
            Terms
          </Link>
          <Link href="/refund-policy" className="hover:underline" style={{ color: primary }}>
            Refunds
          </Link>
          <a
            href={`mailto:${supportEmail}`}
            className="hover:underline"
            style={{ color: primary }}
          >
            {supportEmail}
          </a>
        </nav>
      </div>
    </footer>
  );
}
