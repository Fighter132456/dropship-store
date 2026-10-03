import type { Tenant } from "@/types/store";

export function isE2eMockTenant(): boolean {
  return process.env.E2E_MOCK_TENANT === "1";
}

export const E2E_MOCK_TENANT: Tenant = {
  id: "00000000-0000-4000-8000-000000000001",
  slug: "store1",
  domain: "localhost",
  name: "E2E Store",
  theme_json: {
    colors: { primary: "#2563eb" },
    copy: { tagline: "E2E smoke", footer: "E2E" },
  },
  status: "active",
};
