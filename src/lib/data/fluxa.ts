import {
  ensureMockDataEnabled,
  isMockDataEnabled,
} from "@/lib/config/feature-flags";

const DEFAULT_LATENCY = { min: 120, max: 260 } as const;

function simulateLatency(
  min: number = DEFAULT_LATENCY.min,
  max: number = DEFAULT_LATENCY.max
) {
  if (!isMockDataEnabled()) {
    return Promise.resolve();
  }
  const duration = Math.random() * (max - min) + min;
  return new Promise((resolve) => setTimeout(resolve, duration));
}

function requireMocks(featureName: string) {
  ensureMockDataEnabled(featureName);
}

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
  positionId: string;
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

export interface FluxaPricePoint {
  timestamp: string;
  value: number;
  upperBand: number;
  lowerBand: number;
  confidence: number;
}

export interface FluxaLiquidityBand {
  price: number;
  liquidityUsd: number;
  active: boolean;
}

export type FluxaSwapSide = "buy" | "sell";

export interface FluxaSwapQuoteRequest {
  poolId: string;
  side: FluxaSwapSide;
  inputToken: string;
  outputToken: string;
  inputAmount: number;
  slippageToleranceBps: number;
}

export type SwapGuardrailStatus = "pass" | "watch" | "halt";

export interface SwapGuardrailSignal {
  id: string;
  label: string;
  status: SwapGuardrailStatus;
  helper: string;
}

export interface FluxaSwapQuote {
  request: FluxaSwapQuoteRequest;
  spotPrice: number;
  executionConfidence: number;
  priceImpactBps: number;
  outputAmount: number;
  worstCaseOutputAmount: number;
  estimatedFeesUsd: number;
  guardrails: SwapGuardrailSignal[];
  aiNarrative: string;
}

export type PositionEventType = "harvest" | "rebalance" | "alert" | "message";

export interface FluxaPositionEvent {
  id: string;
  positionId: string;
  timestamp: string;
  type: PositionEventType;
  title: string;
  description: string;
  impact: string;
  aiActor: string;
}

const mockFluxaPositions: FluxaPosition[] = [
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
  {
    id: "msol-sol-stability",
    pool: "Fluxa mSOL/SOL",
    pair: "mSOL · SOL",
    liquidityUsd: 186_400,
    fees24hUsd: 284,
    totalFeesUsd: 7_940,
    apr: 22.6,
    priceRange: {
      lower: 0.965,
      upper: 1.025,
      current: 0.998,
    },
    rangeCoverage: 0.96,
    status: "inRange",
    aiSummary:
      "mSOL is trading tightly around peg. AI will only rebalance if validator risk premium widens past 1.5%.",
    aiAction: "hold",
    protocolShare: 51,
    unclaimedFeesUsd: 412,
    timeInRangeHours: 312,
  },
  {
    id: "mngo-usdc-stress",
    pool: "Fluxa MNGO/USDC",
    pair: "MNGO · USDC",
    liquidityUsd: 41_300,
    fees24hUsd: 196,
    totalFeesUsd: 2_980,
    apr: 72.4,
    priceRange: {
      lower: 0.125,
      upper: 0.188,
      current: 0.118,
    },
    rangeCoverage: 0.08,
    status: "outRange",
    aiSummary:
      "MNGO drew down 24% during overnight volatility. AI paused recipes pending liquidity stress-test replay.",
    aiAction: "adjust",
    protocolShare: 14,
    unclaimedFeesUsd: 142,
    timeInRangeHours: 24,
  },
];

const mockGuardrailInsights: GuardrailInsight[] = [
  {
    id: "sol-usdc-upper",
    positionId: "sol-usdc-main",
    title: "SOL/USDC nearing upper bound",
    description:
      "Range coverage fell to 78%. Shift the upper tick +6bps to maintain capture if volatility persists.",
    urgency: "soon",
    impact: "Prevents fee decay and maintains AI confidence band",
    cta: "Review reposition",
  },
  {
    id: "bonk-sol-redeploy",
    positionId: "bonk-sol",
    title: "BONK/SOL exited range",
    description:
      "AI prepared a redeploy recipe with hedged delta using mini-perp. Approve to restore coverage.",
    urgency: "now",
    impact: "Restores 58% projected APR and limits downside drift",
    cta: "Open recipe",
  },
  {
    id: "jup-usdc-harvest",
    positionId: "jup-usdc-main",
    title: "JUP/USDC harvest window",
    description:
      "Unclaimed fees crossed $500. Harvest in the next cycle to keep AI agent within treasury mandate.",
    urgency: "monitor",
    impact: "Locks accrued yield before auto-compound triggers",
    cta: "Schedule harvest",
  },
  {
    id: "msol-sol-peg",
    positionId: "msol-sol-stability",
    title: "Peg deviation within safe band",
    description:
      "Validator health looks solid but AI is tracking a minor spread widening. Hold unless premium breaches 1.5%.",
    urgency: "monitor",
    impact: "Keeps staking yield flowing while avoiding churn",
    cta: "Review validator mix",
  },
  {
    id: "mngo-usdc-halt",
    positionId: "mngo-usdc-stress",
    title: "MNGO stress replay active",
    description:
      "Circuit breaker engaged after drawdown. AI recommends waiting for liquidity replay before redeploying capital.",
    urgency: "now",
    impact: "Prevents redeploy during thin order books and elevated MEV",
    cta: "Inspect stress log",
  },
];

const mockTrustMetrics: TrustMetric[] = [
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

const mockFluxaPools: FluxaPool[] = [
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
  {
    id: "msol-sol",
    name: "Fluxa mSOL/SOL",
    pair: "mSOL · SOL",
    tvlUsd: 364_800,
    apr: 22.6,
    depthScore: "Tier 1 depth · peg-protected",
    status: "live",
    badge: "Staking",
    description:
      "Validator-diversified staking pair with AI peg monitors and automatic validator rotation alerts.",
  },
  {
    id: "mngo-usdc",
    name: "Fluxa MNGO/USDC",
    pair: "MNGO · USDC",
    tvlUsd: 88_500,
    apr: 72.4,
    depthScore: "Tier 3 depth · high-vol stress",
    status: "preview",
    badge: "Stress lab",
    description:
      "Stress-test venue that replays 2022-style cascades so agents can practice halting and redeploying liquidity.",
  },
];

function generatePriceSeries(
  basePrice: number,
  amplitude: number,
  length: number
): FluxaPricePoint[] {
  const now = Date.now();
  const stepMinutes = 30;

  return Array.from({ length }).map((_, index) => {
    const progress = index / length;
    const wave = Math.sin(progress * Math.PI * 1.5) * amplitude;
    const drift = Math.cos(progress * Math.PI * 0.7) * (amplitude * 0.35);
    const value = Number((basePrice + wave + drift).toFixed(4));
    const variance = amplitude * 0.65;
    const upperBand = Number((value + variance).toFixed(4));
    const lowerBand = Number((value - variance).toFixed(4));
    const confidence = Math.max(0.9, 0.99 - progress * 0.06);
    const timestamp = new Date(
      now - (length - index) * stepMinutes * 60 * 1000
    ).toISOString();

    return { timestamp, value, upperBand, lowerBand, confidence };
  });
}

const mockPriceHistory: Record<string, FluxaPricePoint[]> = {
  "sol-usdc": generatePriceSeries(132.4, 4.8, 48),
  "jup-usdc": generatePriceSeries(1.17, 0.06, 48),
  "bonk-sol": generatePriceSeries(0.000026, 0.000005, 48),
  "msol-sol": generatePriceSeries(1.0, 0.012, 48),
  "mngo-usdc": generatePriceSeries(0.16, 0.05, 48),
};

function generateLiquidityBands(
  midPrice: number,
  scale: number
): FluxaLiquidityBand[] {
  return Array.from({ length: 9 }).map((_, index) => {
    const offset = index - 4;
    const price = Number((midPrice + offset * scale).toFixed(6));
    const liquidityUsd = Math.max(
      12_000,
      Math.round((Math.cos(offset / 2) + 1.2) * 40_000)
    );
    const active = Math.abs(offset) <= 1;
    return { price, liquidityUsd, active };
  });
}

const mockLiquidityProfiles: Record<string, FluxaLiquidityBand[]> = {
  "sol-usdc": generateLiquidityBands(133.2, 1.4),
  "jup-usdc": generateLiquidityBands(1.21, 0.02),
  "bonk-sol": generateLiquidityBands(0.000028, 0.000003),
  "msol-sol": generateLiquidityBands(1.0, 0.01),
  "mngo-usdc": generateLiquidityBands(0.15, 0.01),
};

const mockPositionEvents: FluxaPositionEvent[] = [
  {
    id: "evt-sol-001",
    positionId: "sol-usdc-main",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    type: "alert",
    title: "Latency spike resolved",
    description:
      "RPC jitter detected at 11:14 UTC. AI diverted flows to backup provider and restored within 90s.",
    impact: "Reliability score sustained at 99%",
    aiActor: "Guardian v2.4",
  },
  {
    id: "evt-sol-002",
    positionId: "sol-usdc-main",
    timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
    type: "rebalance",
    title: "Range nudged +4bps",
    description:
      "Recentered ticks after SOL impulse move. Maintained 82% projected capture with hedged delta.",
    impact: "+0.6% APR delta",
    aiActor: "Fluxa Flow AI",
  },
  {
    id: "evt-jup-001",
    positionId: "jup-usdc-main",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    type: "harvest",
    title: "Fees harvested to treasury",
    description:
      "Auto-compounded $486 of fees back into mid-range following mandate target crossing.",
    impact: "Treasury cashflow updated",
    aiActor: "Fluxa Yield AI",
  },
  {
    id: "evt-bonk-001",
    positionId: "bonk-sol",
    timestamp: new Date(Date.now() - 50 * 60 * 60 * 1000).toISOString(),
    type: "alert",
    title: "Volatility circuit breaker tripped",
    description:
      "BONK flash crash triggered guardrail. Orders paused until spread risk returned below 22bps.",
    impact: "Protected downside during 14% move",
    aiActor: "Risk Sentinel",
  },
  {
    id: "evt-msol-001",
    positionId: "msol-sol-stability",
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    type: "message",
    title: "Validator rotation notice",
    description:
      "Stake redistribution triggered after validator score dipped. AI deferred rebalance due to low premium drift.",
    impact: "Maintained peg while optimizing staking yield",
    aiActor: "Fluxa Yield AI",
  },
  {
    id: "evt-mngo-001",
    positionId: "mngo-usdc-stress",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    type: "alert",
    title: "Stress replay in progress",
    description:
      "Replaying Nov 2022 cascade to validate guardrail response. Orders halted until test completes.",
    impact: "Prevents false positives when redeploying liquidity",
    aiActor: "Risk Sentinel",
  },
];

export function getMockFluxaPositions() {
  requireMocks("getMockFluxaPositions");
  return mockFluxaPositions;
}

export function getGuardrailInsights() {
  requireMocks("getGuardrailInsights");
  return mockGuardrailInsights;
}

export function getTrustMetrics() {
  requireMocks("getTrustMetrics");
  return mockTrustMetrics;
}

export function getFluxaPools() {
  requireMocks("getFluxaPools");
  return mockFluxaPools;
}

export async function fetchMockFluxaPositions(): Promise<FluxaPosition[]> {
  requireMocks("fetchMockFluxaPositions");
  await simulateLatency();
  return mockFluxaPositions;
}

export async function fetchGuardrailInsights(): Promise<GuardrailInsight[]> {
  requireMocks("fetchGuardrailInsights");
  await simulateLatency();
  return mockGuardrailInsights;
}

export async function fetchTrustMetrics(): Promise<TrustMetric[]> {
  requireMocks("fetchTrustMetrics");
  await simulateLatency();
  return mockTrustMetrics;
}

export async function fetchFluxaPools(): Promise<FluxaPool[]> {
  requireMocks("fetchFluxaPools");
  await simulateLatency();
  return mockFluxaPools;
}

export interface PriceHistoryOptions {
  points?: number;
  resolutionMinutes?: number;
}

export async function fetchFluxaPriceHistory(
  poolId: string,
  options: PriceHistoryOptions = {}
): Promise<FluxaPricePoint[]> {
  requireMocks("fetchFluxaPriceHistory");
  await simulateLatency(90, 180);
  const { points = 48, resolutionMinutes = 30 } = options;
  const existing = mockPriceHistory[poolId];

  if (!existing) {
    return generatePriceSeries(1, 0.02, points);
  }

  if (existing.length === points && resolutionMinutes === 30) {
    return existing;
  }

  // Re-sample for variant resolutions
  const factor = Math.max(1, Math.floor((resolutionMinutes ?? 30) / 30));
  const sampled = existing.filter((_, index) => index % factor === 0);

  if (sampled.length >= points) {
    return sampled.slice(sampled.length - points);
  }

  return sampled;
}

export async function fetchFluxaLiquidityProfile(
  poolId: string
): Promise<FluxaLiquidityBand[]> {
  requireMocks("fetchFluxaLiquidityProfile");
  await simulateLatency(80, 140);
  return mockLiquidityProfiles[poolId] ?? generateLiquidityBands(1, 0.01);
}

export async function fetchFluxaPositionEvents(
  positionId: string
): Promise<FluxaPositionEvent[]> {
  requireMocks("fetchFluxaPositionEvents");
  await simulateLatency(60, 120);
  return mockPositionEvents.filter((event) => event.positionId === positionId);
}

export async function fetchFluxaSwapQuote(
  request: FluxaSwapQuoteRequest
): Promise<FluxaSwapQuote> {
  requireMocks("fetchFluxaSwapQuote");
  await simulateLatency(110, 180);

  const history =
    mockPriceHistory[request.poolId] ?? generatePriceSeries(1, 0.02, 12);
  const currentPrice = history[history.length - 1]?.value ?? 1;
  const notionalInputUsd =
    request.side === "buy"
      ? request.inputAmount
      : request.inputAmount * currentPrice;
  const basePriceImpact = Math.min(120, Math.log10(notionalInputUsd + 1) * 18);
  const priceImpactBps = Number(
    (basePriceImpact + (request.side === "sell" ? 6 : 3)).toFixed(2)
  );
  const feeBps = 4;
  const feeUsd = Number(((notionalInputUsd * feeBps) / 10_000).toFixed(2));

  const priceImpactFactor = 1 - priceImpactBps / 10_000;
  const worstCaseFactor = 1 - request.slippageToleranceBps / 10_000;

  const outputAmountRaw =
    request.side === "buy"
      ? (request.inputAmount / currentPrice) * priceImpactFactor
      : request.inputAmount * currentPrice * priceImpactFactor;

  const worstCaseOutputAmount = Number(
    (outputAmountRaw * worstCaseFactor).toFixed(request.side === "buy" ? 6 : 2)
  );

  const outputAmount = Number(
    outputAmountRaw.toFixed(request.side === "buy" ? 6 : 2)
  );

  const guardrails: SwapGuardrailSignal[] = [
    {
      id: "slippage",
      label: "Slippage window",
      status:
        request.slippageToleranceBps < priceImpactBps + 8 ? "watch" : "pass",
      helper: `Projected impact ${priceImpactBps.toFixed(1)}bps vs tolerance ${request.slippageToleranceBps}bps`,
    },
    {
      id: "inventory",
      label: "Inventory drift",
      status:
        request.side === "sell" && request.inputAmount > 5_000
          ? "watch"
          : "pass",
      helper: "Delta hedge queued if imbalance exceeds mandate",
    },
    {
      id: "circuit",
      label: "Circuit breakers",
      status:
        request.poolId === "bonk-sol" && request.inputAmount > 50_000
          ? "halt"
          : "pass",
      helper: "High-volatility pool enforces tighter guardrails",
    },
  ];

  const executionConfidence = request.poolId === "bonk-sol" ? 0.82 : 0.94;

  return {
    request,
    spotPrice: currentPrice,
    executionConfidence,
    priceImpactBps,
    outputAmount,
    worstCaseOutputAmount,
    estimatedFeesUsd: feeUsd,
    guardrails,
    aiNarrative:
      request.side === "buy"
        ? "AI projects range staying centered post-purchase. Recommend staggering entries to cap slippage."
        : "De-risking sell will stay within treasury delta band. AI prepared hedge recipe if follow-on trade approved.",
  };
}
