type TenantNotFoundProps = {
  host?: string;
};

export function TenantNotFound({ host }: TenantNotFoundProps) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Store not found</h1>
      <p className="mt-3 text-slate-600">
        {host
          ? `No active store is configured for "${host}".`
          : "This domain is not linked to an active store."}
      </p>
      <p className="mt-4 text-sm text-slate-500">
        Local dev: use{" "}
        <code className="rounded bg-slate-100 px-1.5 py-0.5">?tenant=store1</code> or{" "}
        <code className="rounded bg-slate-100 px-1.5 py-0.5">store1.localhost:3000</code>
      </p>
    </main>
  );
}
