/**
 * Simulated range statistics response produced by the Fluxa analytics worker.
 * This scaffolding will be swapped for the real Solana adapter once live data
 * streams through TanStack Query.
 */
export interface RangeStatPoint {
  /** Unix timestamp in seconds. */
  time: number;
  /** Mid-price expressed in SOL per USDC. */
  value: number;
}

export interface RiskBadge {
  label: string;
  tone: "positive" | "warning" | "informational";
  description: string;
}

export interface RangeStatsPayload {
  pool: string;
  windowLabel: string;
  liveStage: "live" | "preview";
  currentPrice: number;
  lowerBound: number;
  upperBound: number;
  concentration: string;
  projectedFees: string;
  hedgingStatus: "auto" | "manual";
  badges: RiskBadge[];
  sparkline: RangeStatPoint[];
}

/**
 * Placeholder fetcher that emulates a low-latency Solana range stats request.
 * Adds a short artificial delay so loading states are visible during testing.
 */
export async function fetchRangeStats(): Promise<RangeStatsPayload> {
  await new Promise((resolve) => setTimeout(resolve, 320));

  const now = Math.floor(Date.now() / 1000);
  const sparkline: RangeStatPoint[] = Array.from({ length: 48 }).map(
    (_, index) => {
      const time = now - (48 - index) * 300;
      const base = 23.42 + Math.sin(index / 6) * 0.18;
      const drift = index * 0.005;
      return { time, value: Number((base + drift).toFixed(3)) };
    }
  );

  return {
    pool: "Fluxa · SOL/USDC",
    windowLabel: "Last 4 hours",
    liveStage: "live",
    currentPrice: 25.18,
    lowerBound: 24.4,
    upperBound: 26.05,
    concentration: "68% inside target band",
    projectedFees: "42 bps / day",
    hedgingStatus: "auto",
    badges: [
      {
        label: "Guardrails on",
        tone: "positive",
        description: "Adaptive guardrails absorbing volatility shocks.",
      },
      {
        label: "Simulated slippage < 5 bps",
        tone: "informational",
        description: "Latest routing sim recorded sub-5 bps execution drift.",
      },
      {
        label: "Gamma neutral",
        tone: "warning",
        description: "Desk is neutral but monitoring for sustained skew.",
      },
    ],
    sparkline,
  };
}
