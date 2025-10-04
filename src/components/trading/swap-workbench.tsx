"use client";

import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowDownUp,
  ArrowLeftRight,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Signal,
  SlidersHorizontal,
  TrendingUp,
  Waves,
} from "lucide-react";

import type {
  FluxaPool,
  FluxaPricePoint,
  FluxaSwapSide,
  SwapGuardrailSignal,
} from "@/lib/data/fluxa";
import { useFluxaPools } from "@/lib/hooks/use-fluxa-pools";
import {
  useFluxaLiquidityProfile,
  useFluxaPriceHistory,
  useFluxaSwapQuote,
} from "@/lib/hooks/use-fluxa-market";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const guardrailTone: Record<SwapGuardrailSignal["status"], string> = {
  pass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-200",
  watch: "bg-amber-500/15 text-amber-700 dark:text-amber-200",
  halt: "bg-red-500/15 text-red-600 dark:text-red-200",
};

const guardrailIcon: Record<SwapGuardrailSignal["status"], ReactNode> = {
  pass: <ShieldCheck className="size-4" aria-hidden="true" />,
  watch: <AlertCircle className="size-4" aria-hidden="true" />,
  halt: <AlertTriangle className="size-4" aria-hidden="true" />,
};

export function SwapWorkbench() {
  const poolsQuery = useFluxaPools();
  const [poolId, setPoolId] = useState("sol-usdc");
  const [side, setSide] = useState<FluxaSwapSide>("buy");
  const [amountInput, setAmountInput] = useState<string>("1000");
  const [slippageBps, setSlippageBps] = useState<number>(30);

  const poolOptions = useMemo(() => poolsQuery.data ?? [], [poolsQuery.data]);

  useEffect(() => {
    if (poolOptions.length === 0) {
      return;
    }
    const exists = poolOptions.some((pool) => pool.id === poolId);
    if (!exists) {
      setPoolId(poolOptions[0]?.id ?? "sol-usdc");
    }
  }, [poolId, poolOptions]);

  const selectedPool: FluxaPool | undefined = useMemo(
    () => poolOptions.find((pool) => pool.id === poolId),
    [poolOptions, poolId]
  );

  const [baseToken, quoteToken] = useMemo(() => {
    const tokens = selectedPool?.pair?.split(" · ") ?? [];
    return [tokens[0] ?? "SOL", tokens[1] ?? "USDC"];
  }, [selectedPool]);

  const numericAmount = useMemo(() => {
    const parsed = Number(amountInput.replace(/[^0-9.]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }, [amountInput]);

  const priceHistoryQuery = useFluxaPriceHistory(poolId, { points: 48 });
  const liquidityProfileQuery = useFluxaLiquidityProfile(poolId);

  const quoteRequest = useMemo(
    () => ({
      poolId,
      side,
      inputToken: side === "buy" ? quoteToken : baseToken,
      outputToken: side === "buy" ? baseToken : quoteToken,
      inputAmount: numericAmount,
      slippageToleranceBps: slippageBps,
    }),
    [baseToken, poolId, quoteToken, side, numericAmount, slippageBps]
  );

  const quoteEnabled = numericAmount > 0 && Boolean(selectedPool);
  const swapQuoteQuery = useFluxaSwapQuote(quoteRequest, quoteEnabled);
  const quote = swapQuoteQuery.data;

  const priceHistory = priceHistoryQuery.data ?? [];
  const latestPrice = priceHistory[priceHistory.length - 1]?.value ?? null;
  const earliestPrice = priceHistory[0]?.value ?? null;
  const priceDelta =
    latestPrice !== null && earliestPrice ? latestPrice - earliestPrice : null;
  const priceDeltaPct =
    priceDelta !== null && earliestPrice ? priceDelta / earliestPrice : null;

  const liquidityBands = liquidityProfileQuery.data ?? [];
  const maxLiquidity = liquidityBands.reduce(
    (max, band) => Math.max(max, band.liquidityUsd),
    0
  );

  const amountLabel = side === "buy" ? quoteToken : baseToken;

  const handleAmountChange = (value: string) => {
    if (/^[0-9]*\.?[0-9]{0,6}$/.test(value) || value === "") {
      setAmountInput(value);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[color:var(--foreground)]">
            Fluxa swap workbench
          </h1>
          <p className="max-w-3xl text-sm text-[color:var(--text-subtle)]">
            Prototype your rebalance and migration flows with live guardrail
            feedback. AI agents preview execution confidence, price impact, and
            hedging recipes before you approve a single transaction.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border-soft)] bg-[color:var(--surface-card)] px-4 py-1.5 text-xs font-semibold text-[color:var(--brand)]">
          <ArrowDownUp className="size-4" aria-hidden="true" />
          Preview mode · mock data
        </span>
      </header>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface-card)] p-6 shadow-[0_20px_45px_rgba(10,19,40,0.18)]">
            <div className="flex flex-col gap-6 lg:flex-row">
              <div className="flex-1 space-y-4">
                <label className="flex flex-col gap-2 text-sm font-medium text-[color:var(--foreground)]">
                  Pool selection
                  <select
                    className="rounded-lg border border-[color:var(--border-soft)] bg-[color:var(--surface-muted)] px-3 py-2 text-sm text-[color:var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)]"
                    value={poolId}
                    onChange={(event) => setPoolId(event.target.value)}
                    aria-label="Select trading pool"
                  >
                    {poolOptions.map((pool) => (
                      <option key={pool.id} value={pool.id}>
                        {pool.name}
                      </option>
                    ))}
                  </select>
                </label>

                <fieldset className="space-y-2">
                  <legend className="text-sm font-medium text-[color:var(--foreground)]">
                    Trade direction
                  </legend>
                  <div className="inline-flex rounded-lg border border-[color:var(--border-soft)] bg-[color:var(--surface-muted)] p-1 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setSide("buy")}
                      className={`flex items-center gap-2 rounded-md px-3 py-1.5 transition ${
                        side === "buy"
                          ? "bg-[color:var(--surface-card)] text-[color:var(--brand)] shadow"
                          : "text-[color:var(--text-subtle)] hover:text-[color:var(--brand)]"
                      }`}
                    >
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                      Buy {baseToken}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSide("sell")}
                      className={`flex items-center gap-2 rounded-md px-3 py-1.5 transition ${
                        side === "sell"
                          ? "bg-[color:var(--surface-card)] text-[color:var(--brand)] shadow"
                          : "text-[color:var(--text-subtle)] hover:text-[color:var(--brand)]"
                      }`}
                    >
                      <ArrowLeftRight className="size-3.5" aria-hidden="true" />
                      Sell {baseToken}
                    </button>
                  </div>
                </fieldset>

                <label className="flex flex-col gap-2 text-sm font-medium text-[color:var(--foreground)]">
                  Input amount ({amountLabel})
                  <input
                    type="text"
                    inputMode="decimal"
                    value={amountInput}
                    onChange={(event) => handleAmountChange(event.target.value)}
                    placeholder="0.00"
                    className="rounded-lg border border-[color:var(--border-soft)] bg-[color:var(--surface-card)] px-3 py-2 text-sm text-[color:var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)]"
                    aria-label="Input trade amount"
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-[color:var(--foreground)]">
                  Slippage tolerance ({(slippageBps / 100).toFixed(2)}%)
                  <input
                    type="range"
                    min={10}
                    max={150}
                    step={5}
                    value={slippageBps}
                    onChange={(event) =>
                      setSlippageBps(Number(event.target.value))
                    }
                    className="accent-[color:var(--brand)]"
                    aria-label="Slippage tolerance"
                  />
                </label>
              </div>

              <div className="flex-1 space-y-4">
                <QuoteSummaryCard
                  quote={quote}
                  isLoading={swapQuoteQuery.isFetching && quoteEnabled}
                  isError={swapQuoteQuery.isError}
                  error={swapQuoteQuery.error}
                  side={side}
                  baseToken={baseToken}
                  quoteToken={quoteToken}
                  numericAmount={numericAmount}
                />
              </div>
            </div>
            <p className="mt-6 flex items-center gap-2 text-xs text-[color:var(--text-subtle)]">
              <SlidersHorizontal className="size-3.5" aria-hidden="true" />
              Fluxa agents dry-run the trade, enforcing guardrails before any
              signature is required.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface-card)] p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--text-subtle)]">
                  Price telemetry
                </h2>
                <p className="text-sm text-[color:var(--text-muted)]">
                  Confidence bands and 24h drift for{" "}
                  {selectedPool?.name ?? poolId}.
                </p>
              </div>
              <TrendingUp
                className="size-5 text-[color:var(--brand)]"
                aria-hidden="true"
              />
            </div>
            <div className="mt-4 h-36">
              <PriceSparkline points={priceHistory} color="rgba(76,93,255,1)" />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <MetricChip
                label="Spot"
                value={latestPrice ? numberFormatter.format(latestPrice) : "-"}
                helper={`${baseToken}/${quoteToken}`}
              />
              <MetricChip
                label="Δ 24h"
                value={
                  priceDelta !== null && priceDeltaPct !== null
                    ? `${priceDelta > 0 ? "+" : ""}${priceDelta.toFixed(2)} (${percentFormatter.format(priceDeltaPct)})`
                    : "-"
                }
                helper="Agent-adjusted drift"
              />
              <MetricChip
                label="Confidence"
                value={
                  priceHistory.length > 0
                    ? `${Math.round((priceHistory[priceHistory.length - 1]?.confidence ?? 0.92) * 100)}%`
                    : "-"
                }
                helper="Derived from telemetry"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface-card)] p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-smкара font-semibold uppercase tracking-[0.18em] text-[color:var(--text-subtle)]">
                  Liquidity heatmap
                </h2>
                <p className="text-sm text-[color:var(--text-muted)]">
                  Agent-visible depth snapshot across current ticks.
                </p>
              </div>
              <Waves
                className="size-5 text-[color:var(--brand)]"
                aria-hidden="true"
              />
            </div>
            <div className="mt-4 space-y-3">
              {liquidityProfileQuery.isPending ? (
                <div className="flex items-center gap-2 text-sm text-[color:var(--text-subtle)]">
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Loading liquidity profile…
                </div>
              ) : liquidityBands.length === 0 ? (
                <p className="text-sm text-[color:var(--text-muted)]">
                  No liquidity data available in the preview dataset.
                </p>
              ) : (
                liquidityBands.map((band) => (
                  <div key={band.price} className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-[color:var(--text-muted)]">
                      <span>{band.price}</span>
                      <span>{formatter.format(band.liquidityUsd)}</span>
                    </div>
                    <svg
                      className="h-2 w-full"
                      viewBox="0 0 100 4"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <rect
                        width="100"
                        height="4"
                        rx="4"
                        fill="var(--surface-muted)"
                      />
                      {maxLiquidity > 0 ? (
                        <rect
                          width={Math.min(
                            100,
                            Math.max(
                              4,
                              (band.liquidityUsd / maxLiquidity) * 100
                            )
                          )}
                          height="4"
                          rx="4"
                          fill={
                            band.active ? "var(--brand)" : "var(--border-soft)"
                          }
                        />
                      ) : null}
                    </svg>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

type QuoteSummaryCardProps = {
  quote: ReturnType<typeof useFluxaSwapQuote>["data"];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  side: FluxaSwapSide;
  baseToken: string;
  quoteToken: string;
  numericAmount: number;
};

function QuoteSummaryCard({
  quote,
  isLoading,
  isError,
  error,
  side,
  baseToken,
  quoteToken,
  numericAmount,
}: QuoteSummaryCardProps) {
  if (isLoading) {
    return (
      <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-3 rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface-muted)]/70 p-6 text-sm text-[color:var(--text-subtle)]">
        <Loader2 className="size-5 animate-spin" aria-hidden="true" />
        Simulating guardrails…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full min-h-[220px] flex-col justify-between rounded-xl border border-red-200 bg-red-50/60 p-6 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="size-4" aria-hidden="true" />
            Unable to project swap
          </div>
          <p className="text-xs opacity-80">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
        <p className="text-xs text-[color:var(--text-subtle)]">
          Retry once telemetry refresh completes.
        </p>
      </div>
    );
  }

  if (!quote || numericAmount === 0) {
    return (
      <div className="flex h-full min-h-[220px] flex-col justify-center gap-3 rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface-card)] p-6 text-sm text-[color:var(--text-muted)]">
        <p>
          Enter an amount to preview execution confidence, guardrail signals,
          and worst-case outcomes. AI guardrails never submit transactions
          without your consent.
        </p>
      </div>
    );
  }

  const executionConfidence = `${Math.round(quote.executionConfidence * 100)}%`;
  const priceImpact = `${quote.priceImpactBps.toFixed(1)} bps`;
  const worstCase = quote.worstCaseOutputAmount;
  const guardrails = quote.guardrails ?? [];

  return (
    <div className="flex h-full min-h-[220px] flex-col justify-between rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface-card)] p-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--text-subtle)]">
            Execution outlook
          </h3>
          <Signal
            className="size-5 text-[color:var(--brand)]"
            aria-hidden="true"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-[color:var(--border-soft)] bg-[color:var(--surface-muted)]/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-subtle)]">
              Projected output
            </p>
            <p className="mt-2 text-2xl font-semibold text-[color:var(--foreground)]">
              {numberFormatter.format(quote.outputAmount)}{" "}
              {side === "buy" ? baseToken : quoteToken}
            </p>
            <p className="mt-1 text-xs text-[color:var(--text-muted)]">
              Worst case {numberFormatter.format(worstCase)}{" "}
              {side === "buy" ? baseToken : quoteToken}
            </p>
          </div>
          <div className="rounded-lg border border-[color:var(--border-soft)] bg-[color:var(--surface-muted)]/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-subtle)]">
              Confidence & impact
            </p>
            <p className="mt-2 text-lg font-semibold text-[color:var(--foreground)]">
              {executionConfidence} confidence
            </p>
            <p className="mt-1 text-xs text-[color:var(--text-muted)]">
              Price impact {priceImpact}, fees{" "}
              {formatter.format(quote.estimatedFeesUsd)}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-subtle)]">
          Guardrail signals
        </p>
        <div className="flex flex-wrap gap-2">
          {guardrails.length === 0 ? (
            <span className="text-xs text-[color:var(--text-muted)]">
              No guardrail warnings triggered.
            </span>
          ) : (
            guardrails.map((signal) => (
              <span
                key={signal.id}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${guardrailTone[signal.status]}`}
              >
                {guardrailIcon[signal.status]}
                {signal.label}
                <span className="text-[color:var(--text-muted)]">
                  · {signal.helper}
                </span>
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

type MetricChipProps = {
  label: string;
  value: string;
  helper: string;
};

function MetricChip({ label, value, helper }: MetricChipProps) {
  return (
    <div className="rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface-muted)]/80 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-subtle)]">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-[color:var(--foreground)]">
        {value}
      </p>
      <p className="mt-1 text-xs text-[color:var(--text-muted)]">{helper}</p>
    </div>
  );
}

type PriceSparklineProps = {
  points: FluxaPricePoint[];
  color?: string;
};

function PriceSparkline({
  points,
  color = "rgba(76,93,255,1)",
}: PriceSparklineProps) {
  const gradientId = useId();
  const width = 320;
  const height = 140;

  if (!points || points.length < 2) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-[color:var(--text-muted)]">
        Waiting for telemetry…
      </div>
    );
  }

  const values = points.map((point) => point.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const linePath = points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * width;
      const y = height - ((point.value - min) / range) * height;
      const command = index === 0 ? "M" : "L";
      return `${command}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.35} />
          <stop offset="100%" stopColor={color} stopOpacity={0.05} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} opacity={0.8} />
      <path d={linePath} fill="none" stroke={color} strokeWidth={2} />
    </svg>
  );
}
