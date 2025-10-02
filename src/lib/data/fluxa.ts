export type FluxaPositionStatus = "inRange" | "edge" | "outRange";

export interface FluxaPosition {
  id: string;
  pool: string;
  pair: string;
  liquidityUsd: number;
  fees24hUsd: number;
  totalFeesUsd: number;
  apr: number;
  priceRange: {
    lower: number;
    upper: number;
    current: number;
  };
  rangeCoverage: number;
  status: FluxaPositionStatus;
  aiSummary: string;
  aiAction?: "adjust" | "harvest" | "hold";
  protocolShare: number;
  unclaimedFeesUsd: number;
  timeInRangeHours: number;
}

export interface GuardrailInsight {
  id: string;
  title: string;
  description: string;
  urgency: "monitor" | "soon" | "now";
  impact: string;
  cta: string;
}

export interface TrustMetric {
  label: string;
  value: string;
  trend: "up" | "down" | "steady";
  helper: string;
}

export type FluxaPoolStage = "live" | "beta" | "preview";

export interface FluxaPool {
  id: string;
  name: string;
  pair: string;
  tvlUsd: number;
  apr: number;
  depthScore: string;
  status: FluxaPoolStage;
  badge?: string;
  description: string;
}

export function getMockFluxaPositions(): FluxaPosition[] {
  return [
    {
      id: "sol-usdc-main",
      pool: "Fluxa SOL/USDC",
      pair: "SOL · USDC",
      liquidityUsd: 248_500,
      fees24hUsd: 612,
      totalFeesUsd: 18_420,
      apr: 34.2,
      priceRange: {
        lower: 121.4,
        upper: 138.9,
        current: 133.2,
      },
      rangeCoverage: 0.78,
      status: "edge",
      aiSummary:
        "Price drifted +3.1% toward the upper tick. AI suggests nudging range +6bps to stay centered.",
      aiAction: "adjust",
      protocolShare: 42,
      unclaimedFeesUsd: 934,
      timeInRangeHours: 142,
    },
    {
      id: "jup-usdc-main",
      pool: "Fluxa JUP/USDC",
      pair: "JUP · USDC",
      liquidityUsd: 96_200,
      fees24hUsd: 318,
      totalFeesUsd: 6_012,
      apr: 41.8,
      priceRange: {
        lower: 1.02,
        upper: 1.31,
        current: 1.21,
      },
      rangeCoverage: 0.92,
      status: "inRange",
      aiSummary:
        "Liquidity is well-centered. AI recommends harvesting fees in 18 hours once target threshold crosses $750.",
      aiAction: "harvest",
      protocolShare: 33,
      unclaimedFeesUsd: 512,
      timeInRangeHours: 208,
    },
    {
      id: "bonk-sol",
      pool: "Fluxa BONK/SOL",
      pair: "BONK · SOL",
      liquidityUsd: 54_900,
      fees24hUsd: 154,
      totalFeesUsd: 3_640,
      apr: 58.5,
      priceRange: {
        lower: 0.000021,
        upper: 0.000031,
        current: 0.000033,
      },
      rangeCoverage: 0.12,
      status: "outRange",
      aiSummary:
        "Pair exited range 46 minutes ago. AI queued a suggested redeploy 4 ticks higher with hedged delta.",
      aiAction: "adjust",
      protocolShare: 19,
      unclaimedFeesUsd: 198,
      timeInRangeHours: 67,
    },
  ];
}

export function getGuardrailInsights(): GuardrailInsight[] {
  return [
    {
      id: "sol-usdc-upper",
      title: "SOL/USDC nearing upper bound",
      description:
        "Range coverage fell to 78%. Shift the upper tick +6bps to maintain capture if volatility persists.",
      urgency: "soon",
      impact: "Prevents fee decay and maintains AI confidence band",
      cta: "Review reposition",
    },
    {
      id: "bonk-sol-redeploy",
      title: "BONK/SOL exited range",
      description:
        "AI prepared a redeploy recipe with hedged delta using mini-perp. Approve to restore coverage.",
      urgency: "now",
      impact: "Restores 58% projected APR and limits downside drift",
      cta: "Open recipe",
    },
    {
      id: "jup-usdc-harvest",
      title: "JUP/USDC harvest window",
      description:
        "Unclaimed fees crossed $500. Harvest in the next cycle to keep AI agent within treasury mandate.",
      urgency: "monitor",
      impact: "Locks accrued yield before auto-compound triggers",
      cta: "Schedule harvest",
    },
  ];
}

export function getTrustMetrics(): TrustMetric[] {
  return [
    {
      label: "Reliability score",
      value: "99.2%",
      trend: "up",
      helper: "Streaming telemetry across RPC, CU budget, and AI agent uptime",
    },
    {
      label: "Median landing",
      value: "3.1s",
      trend: "steady",
      helper: "Median time-to-execute across last 500 routed transactions",
    },
    {
      label: "AI confidence",
      value: "96%",
      trend: "up",
      helper: "Agent policy adherence across live vaults",
    },
  ];
}

export function getFluxaPools(): FluxaPool[] {
  return [
    {
      id: "sol-usdc",
      name: "Fluxa SOL/USDC",
      pair: "SOL · USDC",
      tvlUsd: 523_000,
      apr: 34.2,
      depthScore: "Tier 1 depth · spreads <6bps",
      status: "live",
      badge: "Institutional",
      description:
        "Primary yield venue with AI-managed range clustering and liquidity protection rails.",
    },
    {
      id: "jup-usdc",
      name: "Fluxa JUP/USDC",
      pair: "JUP · USDC",
      tvlUsd: 212_400,
      apr: 41.8,
      depthScore: "Tier 2 depth · spreads <12bps",
      status: "beta",
      badge: "Agent managed",
      description:
        "Adaptive agent vault with transparent guardrails. Includes fee target automation and IL shielding.",
    },
    {
      id: "bonk-sol",
      name: "Fluxa BONK/SOL",
      pair: "BONK · SOL",
      tvlUsd: 132_900,
      apr: 58.5,
      depthScore: "Tier 3 depth · spreads <18bps",
      status: "preview",
      badge: "AI supervised",
      description:
        "High-volatility experimental pool with AI supervised reposition recipes and optional hedging.",
    },
  ];
}
