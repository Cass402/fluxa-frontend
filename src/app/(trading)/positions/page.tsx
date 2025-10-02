"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Wallet } from "lucide-react";

/**
 * Positions dashboard - shows all CLMM positions for connected wallet.
 * Implements progressive disclosure: empty state → first position → advanced features.
 */
export default function PositionsPage() {
  const { connected } = useWallet();

  if (!connected) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6 text-center">
          {/* Icon */}
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[color:var(--brand-soft)]">
            <Wallet className="size-8 text-[color:var(--brand)]" />
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-[color:var(--foreground)]">
              Connect Your Wallet
            </h1>
            <p className="text-sm text-[color:var(--text-subtle)]">
              Access your Fluxa CLMM positions with full telemetry and AI
              guardrails. External protocol visibility arrives right after
              launch.
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--surface-card)] p-4">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[color:var(--text-subtle)]">
              Why Connect?
            </h2>
            <ul className="space-y-2 text-left text-sm text-[color:var(--foreground)]">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-[color:var(--brand)]">✓</span>
                <span>Live Fluxa pool telemetry with risk-first reporting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-[color:var(--brand)]">✓</span>
                <span>AI guardrails that explain every recommendation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-[color:var(--brand)]">✓</span>
                <span>Roadmap: read-only Orca/Raydium views post launch</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-[color:var(--brand)]">✓</span>
                <span>We never request transaction signatures</span>
              </li>
            </ul>
          </div>

          {/* Connect Button */}
          <WalletMultiButton className="!h-12 !w-full !rounded-lg !bg-[color:var(--brand)] !text-base !font-semibold !text-white !transition-all hover:!bg-[color:var(--brand-hover)] focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-[color:var(--brand)] focus-visible:!ring-offset-2" />

          {/* Security Note */}
          <p className="text-xs text-[color:var(--text-subtle)]">
            Fluxa is read-only. We only fetch public blockchain data—no
            permissions, no signatures, no risk.
          </p>
        </div>
      </div>
    );
  }

  // Connected but no positions yet (we'll implement position fetching next)
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[color:var(--foreground)]">
          Your Positions
        </h1>
        <p className="mt-2 text-sm text-[color:var(--text-subtle)]">
          Manage your Fluxa CLMM positions today. External protocol visibility
          lands in Phase 1.5 right after launch.
        </p>
      </div>

      {/* Empty State */}
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-[color:var(--border-subtle)] bg-[color:var(--surface-card)] p-12 text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-[color:var(--surface-muted)]">
          <svg
            className="size-8 text-[color:var(--text-subtle)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h2 className="mb-2 text-xl font-semibold text-[color:var(--foreground)]">
          No positions found
        </h2>
        <p className="mb-6 max-w-md text-sm text-[color:var(--text-subtle)]">
          We couldn&apos;t find any Fluxa CLMM positions for this wallet yet.
          Your existing Orca/Raydium positions become visible in the dashboard
          once Phase 1.5 ships.
        </p>
        <div className="flex gap-3">
          <a
            href="https://docs.fluxa.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--surface-card)] px-4 py-2 text-sm font-medium text-[color:var(--foreground)] transition-all hover:border-[color:var(--brand-soft)] hover:bg-[color:var(--surface-muted)]"
          >
            Read launch playbook ↗
          </a>
          <a
            href="https://app.fluxa.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--surface-card)] px-4 py-2 text-sm font-medium text-[color:var(--foreground)] transition-all hover:border-[color:var(--brand-soft)] hover:bg-[color:var(--surface-muted)]"
          >
            Create Fluxa position ↗
          </a>
        </div>
      </div>
    </div>
  );
}
