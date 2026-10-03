import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { E2E_MOCK_TENANT } from "@/lib/e2e-mock";
import { resolveTenantLookup } from "@/lib/tenant";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/tenant-not-found") {
    return NextResponse.next();
  }

  if (process.env.E2E_MOCK_TENANT === "1") {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-tenant-id", E2E_MOCK_TENANT.id);
    requestHeaders.set("x-tenant-slug", E2E_MOCK_TENANT.slug);
    requestHeaders.set("x-tenant-domain", E2E_MOCK_TENANT.domain);
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.cookies.set("tenant-id", E2E_MOCK_TENANT.id, { path: "/" });
    response.cookies.set("tenant-slug", E2E_MOCK_TENANT.slug, { path: "/" });
    return response;
  }

  const host = request.headers.get("host") ?? "localhost";
  const tenantParam = request.nextUrl.searchParams.get("tenant");
  const lookup = resolveTenantLookup(host, tenantParam);

  if (!lookup) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const query = supabase
    .from("tenants")
    .select("id, slug, domain, name, status")
    .eq("status", "active")
    .eq(lookup.field, lookup.value)
    .maybeSingle();

  const { data: tenant, error } = await query;

  if (error || !tenant) {
    const url = request.nextUrl.clone();
    url.pathname = "/tenant-not-found";
    url.searchParams.set("host", lookup.value);
    return NextResponse.rewrite(url, { status: 404 });
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-tenant-id", tenant.id);
  requestHeaders.set("x-tenant-slug", tenant.slug);
  requestHeaders.set("x-tenant-domain", tenant.domain);

  supabaseResponse = NextResponse.next({
    request: { headers: requestHeaders },
  });

  supabaseResponse.cookies.set("tenant-id", tenant.id, { path: "/" });
  supabaseResponse.cookies.set("tenant-slug", tenant.slug, { path: "/" });

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
