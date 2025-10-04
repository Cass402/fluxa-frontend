"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { AlertTriangle, BadgeCheck, ShieldCheck, Wallet } from "lucide-react";

import { AIGuardrailPanel } from "@/components/trading/ai-guardrail-panel";
import { GuardrailDetailDialog } from "@/components/trading/guardrail-detail-dialog";
import { SwapWorkbench } from "@/components/trading/swap-workbench";
import type { GuardrailInsight } from "@/lib/data/fluxa";
import { isMockDataEnabled } from "@/lib/config/feature-flags";
import { useFluxaGuardrailInsights } from "@/lib/hooks/use-fluxa-positions";

export default function SwapPage() {
  const { connected } = useWallet();
  const [guardrailOpen, setGuardrailOpen] = useState(false);
  const [selectedGuardrail, setSelectedGuardrail] =
    useState<GuardrailInsight | null>(null);
  const isMocking = isMockDataEnabled();

  const guardrailQuery = useFluxaGuardrailInsights();
  const guardrails = guardrailQuery.data ?? [];

  useEffect(() => {
    if (!guardrailOpen) {
      setSelectedGuardrail(null);
    }
  }, [guardrailOpen]);

  const handleGuardrailSelect = (insight: GuardrailInsight) => {
    setSelectedGuardrail(insight);
    setGuardrailOpen(true);
  };

  if (!connected) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[color:var(--brand-soft)]">
            <Wallet className="size-8 text-[color:var(--brand)]" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-[color:var(--foreground)]">
              Connect to open the workbench
            </h1>
            <p className="text-sm text-[color:var(--text-subtle)]">
              Fluxa runs all swap simulations client-side. We never request
              signatures—we only read public blockchain data to dry-run your
              liquidity moves.
            </p>
          </div>
          <div className="rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--surface-card)] p-4 text-left">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[color:var(--text-subtle)]">
              Why connect?
            </h2>
            <ul className="space-y-2 text-sm text-[color:var(--foreground)]">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-[color:var(--brand)]">✓</span>
                <span>
                  Preview price impact and execution confidence in real time
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-[color:var(--brand)]">✓</span>
                <span>
                  AI guardrails narrate every recommendation before you act
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-[color:var(--brand)]">✓</span>
                <span>
                  Roadmap: submit to mainnet straight from the workbench
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-[color:var(--brand)]">✓</span>
                <span>No transaction approvals requested—ever</span>
              </li>
            </ul>
          </div>
          <WalletMultiButton className="!h-12 !w-full !rounded-lg !bg-[color:var(--brand)] !text-base !font-semibold !text-white !transition-all hover:!bg-[color:var(--brand-hover)] focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-[color:var(--brand)] focus-visible:!ring-offset-2" />
          <p className="text-xs text-[color:var(--text-subtle)]">
            Fluxa is read-only today. Full execution unlocks once compliance
            review clears.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[color:var(--foreground)]">
            Fluxa swap workbench
          </h1>
          <p className="max-w-3xl text-sm text-[color:var(--text-subtle)]">
            Simulate rebalances and migrations with real guardrail telemetry.
            Agents explain price impact, execution probability, and hedge
            recipes before you authorize anything.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border-soft)] bg-[color:var(--surface-card)] px-4 py-1.5 text-xs font-semibold text-[color:var(--brand)]">
          <BadgeCheck className="size-4" aria-hidden="true" />
          {isMocking ? "Preview mode · mock data" : "Live Solana data"}
        </span>
      </section>

      {guardrailQuery.isError ? (
        <div
          role="alert"
          aria-live="assertive"
          className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-700 shadow-[0_14px_35px_rgba(10,19,40,0.08)] dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-5" aria-hidden="true" />
            <div className="space-y-1">
              <p className="font-semibold">
                Guardrail telemetry is delayed. Showing the latest cached
                callouts.
              </p>
              {guardrailQuery.error instanceof Error ? (
                <p className="text-xs opacity-80">
                  {guardrailQuery.error.message}
                </p>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              void guardrailQuery.refetch();
            }}
            disabled={guardrailQuery.isFetching}
            className="inline-flex w-fit items-center gap-2 self-start rounded-lg border border-[color:var(--border-soft)] bg-white/90 px-3 py-1.5 text-xs font-semibold text-[color:var(--brand)] transition hover:border-[color:var(--brand)] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[color:var(--surface-card)]"
          >
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            Retry guardrail sync
          </button>
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <section aria-label="Swap simulator" className="space-y-6">
          <SwapWorkbench />
          <div className="rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-card)] p-4 text-xs text-[color:var(--text-subtle)]">
            <p>
              {isMocking
                ? "Roadmap: approve transactions directly from the workbench once guardrail audits complete. Until then, use exported recipes to execute via your preferred venue."
                : "Workbench is pointed at live Solana endpoints. Guardrail audits remain mandatory before enabling direct execution from this screen."}
            </p>
          </div>
        </section>

        <section
          aria-label="Guardrail coverage"
          className="flex flex-col gap-4"
        >
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--text-subtle)]">
                Guardrail callouts
              </h2>
              <p className="text-sm text-[color:var(--text-muted)]">
                AI agents monitor the same guardrails across positions and
                swaps.
              </p>
            </div>
            <Link
              href="/positions"
              className="text-xs font-semibold text-[color:var(--brand)] hover:underline"
            >
              View positions
            </Link>
          </header>

          {guardrailQuery.isPending ? (
            <GuardrailSkeleton />
          ) : guardrails.length > 0 ? (
            <AIGuardrailPanel
              insights={guardrails}
              onSelect={handleGuardrailSelect}
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-[color:var(--border-soft)] bg-[color:var(--surface-card)] p-6 text-sm text-[color:var(--text-muted)]">
              No active guardrail alerts right now. Agents will surface context
              here once thresholds are met.
            </div>
          )}
        </section>
      </div>

      <GuardrailDetailDialog
        open={guardrailOpen}
        onOpenChange={setGuardrailOpen}
        insight={selectedGuardrail}
      />
    </div>
  );
}

function GuardrailSkeleton() {
  return (
    <div className="rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface-raised)] p-6">
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <div className="h-4 w-48 animate-pulse rounded bg-[color:var(--border-soft)]" />
          <div className="h-3 w-64 animate-pulse rounded bg-[color:var(--border-subtle)]" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex h-full animate-pulse flex-col justify-between rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface-card)] p-4"
            >
              <div className="h-3 w-24 rounded bg-[color:var(--border-subtle)]" />
              <div className="mt-4 space-y-2">
                <div className="h-4 w-36 rounded bg-[color:var(--border-soft)]" />
                <div className="h-3 w-40 rounded bg-[color:var(--border-subtle)]" />
              </div>
              <div className="mt-4 h-8 w-28 rounded bg-[color:var(--border-soft)]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
