import Link from "next/link";
import { Header } from "@/components/Header";
import { getTenant } from "@/lib/tenant";

export default async function CheckoutSuccessPage() {
  const tenant = await getTenant();
  const primary = tenant?.theme_json.colors?.primary ?? "#2563eb";

  return (
    <>
      {tenant ? <Header tenant={tenant} /> : null}
      <main className="mx-auto max-w-xl flex-1 px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Payment successful</h1>
        <p className="mt-4 text-slate-600">
          Thank you! Order fulfillment will be wired in S37 (Stripe webhook → Supabase → CJ).
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-lg px-6 py-3 text-sm font-semibold text-white"
          style={{ backgroundColor: primary }}
        >
          Back to shop
        </Link>
      </main>
    </>
  );
}
