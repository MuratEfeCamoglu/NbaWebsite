import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import { tr } from "@/i18n/tr";
import "./globals.css";

// latin-ext carries the Turkish letters (ğ, ı, İ, ş).
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: tr.meta.title,
  description: tr.meta.description,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="tr"
      className={`${inter.variable} ${barlowCondensed.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
