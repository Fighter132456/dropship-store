import type { ReactNode } from "react";
import type { Tenant } from "@/types/store";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

type StoreShellProps = {
  tenant: Tenant;
  cartCount?: number;
  children: ReactNode;
};

export function StoreShell({ tenant, cartCount, children }: StoreShellProps) {
  return (
    <>
      <Header tenant={tenant} cartCount={cartCount} />
      {children}
      <Footer tenant={tenant} />
    </>
  );
}
