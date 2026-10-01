import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getTenant } from "@/lib/tenant";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenant();
  return {
    title: tenant?.name ?? "Dropship Store",
    description: tenant?.theme_json.copy?.tagline ?? "Multi-tenant dropship storefront",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const tenant = await getTenant();
  const bg = tenant?.theme_json.colors?.background ?? "#f8fafc";
  const text = tenant?.theme_json.colors?.text ?? "#0f172a";

  return (
    <html
      lang="pl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col"
        style={{ backgroundColor: bg, color: text }}
      >
        {children}
      </body>
    </html>
  );
}
