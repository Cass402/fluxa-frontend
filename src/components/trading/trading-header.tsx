"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { WalletButton } from "@/components/wallet/wallet-button";

const navigation = [
  { name: "Positions", href: "/positions", badge: null },
  { name: "Pools", href: "/pools", badge: "Beta" },
  { name: "Swap", href: "/swap", badge: "Soon" },
] as const;

/**
 * Trading app header with wallet connection and navigation.
 * Trust-first design with prominent security indicators and clear navigation.
 */
export function TradingHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--border-soft)] bg-[color:var(--surface-card)]/95 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--surface-card)]/80">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-semibold text-[color:var(--brand)] transition-opacity hover:opacity-80"
        >
          Fluxa
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const isDisabled = item.badge === "Soon";

            return (
              <Link
                key={item.name}
                href={isDisabled ? "#" : item.href}
                className={`relative flex items-center gap-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-[color:var(--brand)]"
                    : isDisabled
                      ? "cursor-not-allowed text-[color:var(--text-subtle)] opacity-50"
                      : "text-[color:var(--foreground)] hover:text-[color:var(--brand)]"
                }`}
                aria-disabled={isDisabled}
                onClick={(e) => isDisabled && e.preventDefault()}
              >
                {item.name}
                {item.badge ? (
                  <span className="rounded-full bg-[color:var(--status-soon-bg)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--status-soon-fg)]">
                    {item.badge}
                  </span>
                ) : null}
                {isActive ? (
                  <span
                    className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-[color:var(--brand)]"
                    aria-hidden="true"
                  />
                ) : null}
              </Link>
            );
          })}
        </div>

        {/* Wallet Button */}
        <div className="hidden md:block">
          <WalletButton />
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden rounded-lg p-2 text-[color:var(--foreground)] hover:bg-[color:var(--surface-muted)]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="size-6" aria-hidden="true" />
          ) : (
            <Menu className="size-6" aria-hidden="true" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen ? (
        <div className="border-t border-[color:var(--border-subtle)] bg-[color:var(--surface-card)] md:hidden">
          <div className="space-y-1 px-4 pb-4 pt-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const isDisabled = item.badge === "Soon";

              return (
                <Link
                  key={item.name}
                  href={isDisabled ? "#" : item.href}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive
                      ? "bg-[color:var(--brand-soft)] text-[color:var(--brand)]"
                      : isDisabled
                        ? "cursor-not-allowed text-[color:var(--text-subtle)] opacity-50"
                        : "text-[color:var(--foreground)] hover:bg-[color:var(--surface-muted)]"
                  }`}
                  onClick={(e) => {
                    if (isDisabled) {
                      e.preventDefault();
                    } else {
                      setMobileMenuOpen(false);
                    }
                  }}
                >
                  <span>{item.name}</span>
                  {item.badge ? (
                    <span className="rounded-full bg-[color:var(--status-soon-bg)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--status-soon-fg)]">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
            <div className="pt-4">
              <WalletButton />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
