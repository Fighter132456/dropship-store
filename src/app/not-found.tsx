import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-3 text-slate-600">The page you requested does not exist.</p>
      <Link href="/" className="mt-6 text-sm font-medium text-blue-600 hover:underline">
        Back to store
      </Link>
    </main>
  );
}
