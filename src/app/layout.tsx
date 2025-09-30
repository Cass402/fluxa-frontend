import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AppProviders } from "@/components/app-providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "Fluxa — Concentrated Liquidity Without Compromise";
const description =
  "Fluxa delivers institutional-grade Solana liquidity management with trust-first design, real-time simulations, and progressive mastery.";

export const metadata: Metadata = {
  title: {
    default: title,
    template: "%s · Fluxa",
  },
  description,
  keywords: [
    "Fluxa",
    "Concentrated Liquidity",
    "Solana",
    "DeFi",
    "CLMM",
    "Risk Management",
  ],
  category: "finance",
  openGraph: {
    title,
    description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[color:var(--background)] text-[color:var(--foreground)]`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
