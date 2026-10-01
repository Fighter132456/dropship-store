import type { ReactNode } from "react";
import type { Tenant } from "@/types/store";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

type StoreShellProps = {
  tenant: Tenant;
  children: ReactNode;
};

export function StoreShell({ tenant, children }: StoreShellProps) {
  return (
    <>
      <Header tenant={tenant} />
      {children}
      <Footer tenant={tenant} />
    </>
  );
}
