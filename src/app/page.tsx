import type { Metadata } from "next";
import {
  Bot,
  Brain,
  CandlestickChart,
  Droplet,
  Layers,
  Gauge,
  Link2,
  Sparkles,
} from "lucide-react";

import { CtaLink } from "@/components/cta-link";
import { FeatureCard } from "@/components/feature-card";
import { MetricCard } from "@/components/metric-card";
import { RoadmapCard } from "@/components/roadmap-card";
import { SectionHeading } from "@/components/section-heading";
import { StatusPill } from "@/components/status-pill";
import { StoryTimeline } from "@/components/story-timeline";
import { TradingPreview } from "@/components/trading-preview";
import { TrustIndicator } from "@/components/trust-indicator";
import { WaitlistForm } from "@/components/waitlist-form";

export const dynamic = "force-static";
export const revalidate = 1800;

export async function generateMetadata(): Promise<Metadata> {
  const title = "Fluxa — Autonomous Liquidity Network on Solana";
  const description =
    "Fluxa blends CLMM and CLOB intelligence so teams manage liquidity with trust-first telemetry, explainable AI, and derivative-ready rails.";

  return {
    title,
    description,
    alternates: {
      canonical: "https://app.fluxa.xyz",
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: "https://app.fluxa.xyz",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

const heroMetrics = [
  {
    value: "-18 bps",
    label: "Testnet IL delta vs. Orca",
    annotation:
      "30-day Fluxa agent vault vs. Orca static range strategy (lower is better).",
    badge: <span>Raydium delta: -11 bps</span>,
    sparkline: [0.32, 0.3, 0.28, 0.26, 0.25, 0.23, 0.22, 0.21],
    sparklineLabel: "Testnet impermanent-loss delta over 30 days",
    sparklineColor: "var(--accent)",
  },
  {
    value: "97%",
    label: "Autonomous landing rate",
    annotation:
      "AI agents stayed inside target risk bands across 1,420 simulated bursts.",
  },
  {
    value: "3s",
    label: "Transparency checkpoint",
    annotation:
      "Average time to surface costs, slippage, and worst-case outcomes before confirm.",
  },
];

const proofMetrics = [
  {
    value: "$128M",
    label: "Capital stress-tested",
    annotation:
      "Simulated across 14,200 Solana regimes with guardrails benchmarked to peers.",
    badge: <span>+12% survival lift</span>,
  },
  {
    value: "24/7",
    label: "Telemetry coverage",
    annotation:
      "Sentry, OpenTelemetry, and Web Vitals stream into a live reliability score.",
  },
  {
    value: "4",
    label: "Audits in flight",
    annotation:
      "Security partners cover smart contracts, agent policies, API surfaces, and UX flows.",
  },
];

const storyPainPoints = [
  "LPs lose billions each year to impermanent loss, volatility, and MEV.",
  "Perps rely on funding payments that create inefficiencies.",
  "Traders suffer from fragmented liquidity.",
];

const storyTimeline = [
  {
    stage: "live" as const,
    title: "CLMM foundation",
    summary: "Live today with trust-first controls on Solana.",
    icon: <Droplet className="size-5" aria-hidden="true" />,
  },
  {
    stage: "comingSoon" as const,
    title: "AI LP agents",
    summary: "Adaptive vaults rebalance from on-chain and market telemetry.",
    icon: <Bot className="size-5" aria-hidden="true" />,
  },
  {
    stage: "roadmap" as const,
    title: "Hybrid CLMM + CLOB",
    summary: "Unified routing bridges AMM depth with high-touch order flow.",
    icon: <Link2 className="size-5" aria-hidden="true" />,
  },
  {
    stage: "vision" as const,
    title: "Perps & options rails",
    summary: "Risk-free LPing underpins perps, options, and structured flows.",
    icon: <CandlestickChart className="size-5" aria-hidden="true" />,
  },
];

const featureHighlights = [
  {
    stage: "live" as const,
    kicker: "Execution",
    title: "CLMM terminal with instant guardrails",
    description:
      "Every adjustment refreshes risk, fees, and execution probability before you sign.",
    highlights: [
      "Sub-second simulations surface IL, fees, and MEV exposure.",
      "Readable Solana program decoding keeps compliance teams aligned.",
    ],
    cta: {
      label: "Launch trading preview",
      href: "#closing",
      featureFlag: "cta-trading-preview",
    },
    icon: <Gauge className="size-5" aria-hidden="true" />,
  },
  {
    stage: "comingSoon" as const,
    kicker: "Phase 1.5",
    title: "External portfolio lens",
    description:
      "Right after Fluxa mainnet launch, plug in read-only Orca and Raydium positions without leaving the Fluxa desk.",
    highlights: [
      "Surface existing CLMM positions in a single trust-first dashboard.",
      "Zero-signature, read-only access keeps acquisition frictionless.",
      "Migration prompts and AI subscriptions arrive once Fluxa liquidity deepens.",
    ],
    cta: {
      label: "See roadmap",
      href: "#roadmap",
      featureFlag: "cta-phase15-roadmap",
    },
    icon: <Layers className="size-5" aria-hidden="true" />,
  },
  {
    stage: "comingSoon" as const,
    kicker: "Autonomy",
    title: "AI LP agents that defend capital",
    description:
      "Policy-driven bots rebalance ranges and fees with explainable playbooks.",
    highlights: [
      "Agent intents show why a move triggers—no black boxes.",
      "Treasury limits, SLAs, and pausing stay under human override.",
    ],
    cta: {
      label: "Join agent beta",
      href: "#closing",
      featureFlag: "cta-join-agent-beta",
    },
    icon: <Brain className="size-5" aria-hidden="true" />,
  },
  {
    stage: "roadmap" as const,
    kicker: "Liquidity intelligence",
    title: "Hybrid CLMM + CLOB routing",
    description:
      "A single venue scores depth, latency, and counterparty risk in real time.",
    highlights: [
      "Smart order slicing balances pool health with best execution.",
      "Cross-market telemetry feeds routing without fragmenting UX.",
    ],
    cta: {
      label: "Preview hybrid models",
      href: "#roadmap",
      featureFlag: "cta-preview-hybrid",
    },
    icon: <Link2 className="size-5" aria-hidden="true" />,
  },
  {
    stage: "vision" as const,
    kicker: "Derivatives",
    title: "Perps, options, and structured flows",
    description:
      "Risk-neutral LP rails power derivative markets without funding drag.",
    highlights: [
      "Unified margin engine targets risk-free LPing.",
      "AI hedging co-pilots keep treasury posture balanced in real time.",
    ],
    cta: {
      label: "See the north star",
      href: "#roadmap",
      featureFlag: "cta-see-north-star",
    },
    icon: <CandlestickChart className="size-5" aria-hidden="true" />,
  },
];

const trustSignals = [
  {
    label: "Proof",
    title: "$128M stress-tested in Solana regimes",
    description:
      "Scenario library pressure-tests fees, MEV pressure, and latency shocks before mainnet.",
    emphasis: "Audit briefs ready for partners and regulators.",
    icon: "shield" as const,
  },
  {
    label: "Explainable AI",
    title: "Agents narrate every rebalance",
    description:
      "Risk, treasury posture, and market signals render in plain language next to each action.",
    emphasis:
      "Human override, emergency pause, and review trails stay one tap away.",
    icon: "analytics" as const,
  },
  {
    label: "Reliability",
    title: "Telemetry streams into a live trust score",
    description:
      "Sentry, OpenTelemetry, and Web Vitals combine into a surfaced reliability indicator.",
    emphasis: "If performance drifts >50 ms, users hear it before impact.",
    icon: "circuit" as const,
  },
];

const proofLogos = [
  "Built on Solana",
  "Powered by Anchor",
  "Engineered in Rust",
  "Helius telemetry",
];

const roadmap = [
  {
    stage: "live" as const,
    title: "Phase 1 · CLMM foundation",
    description:
      "Risk-first CLMM desk with decoded transactions and transparent fees.",
    eta: "Live",
    cohortSize: 1120,
    focus: "Education-first onboarding and audit-ready reporting.",
  },
  {
    stage: "comingSoon" as const,
    title: "Phase 1.5 · External portfolio lens",
    description:
      "Read-only Orca and Raydium visibility to fuel acquisition while Fluxa liquidity scales.",
    eta: "Post-launch",
    cohortSize: 800,
    focus:
      "Zero-friction wallet sync, migration insights, and AI teaser flows.",
  },
  {
    stage: "comingSoon" as const,
    title: "Phase 2 · AI LP agents",
    description:
      "Policy-driven bots manage ranges, fees, and hedges with human override.",
    eta: "Q1 2025",
    cohortSize: 420,
    focus: "Explainable intents, treasury limits, and safety pause flows.",
  },
  {
    stage: "roadmap" as const,
    title: "Phase 3 · Hybrid CLMM + CLOB",
    description:
      "Unified routing engine bridges AMMs with institutional order flow.",
    eta: "H2 2025",
    focus: "Cross-market depth scoring and smart order slicing.",
  },
  {
    stage: "vision" as const,
    title: "Phase 4 · Derivatives stack",
    description:
      "Perps, options, and structured products powered by risk-neutral LP rails.",
    eta: "2026",
    focus: "Unified margin engine and AI hedging co-pilots.",
  },
];

export default function Home() {
  return (
    <div className="relative isolate">
      <div className="pointer-events-none absolute inset-x-0 top-[-10rem] z-[-1] h-[32rem] bg-gradient-to-b from-[color:var(--brand-soft)]/40 via-transparent to-transparent" />
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-16 px-5 pb-20 pt-14 sm:px-8 sm:pb-24 sm:pt-16 lg:gap-24 lg:px-12">
        <section
          className="grid gap-8 sm:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)] lg:items-center lg:gap-12"
          id="hero"
        >
          <div className="flex flex-col gap-6 sm:gap-8">
            <StatusPill stage="beta" label="Autonomous testnet in preview" />
            <div className="flex flex-col gap-5 sm:gap-6">
              <h1 className="text-balance text-3xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-4xl lg:text-6xl">
                Fluxa: The First Autonomous Liquidity Network on Solana
              </h1>
              <p className="max-w-2xl text-pretty text-sm text-[color:var(--text-muted)] sm:text-base">
                AI-powered CLMM + CLOB hybrid, evolving into the foundation for
                perps, options, and risk-free LPing.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5 sm:gap-3">
              <CtaLink
                eventId="hero-launch-app"
                label="Launch App"
                location="hero"
                href="https://app.fluxa.xyz"
                prefetch={false}
                target="_blank"
                className="inline-flex items-center justify-center rounded-full bg-[color:var(--brand)] px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-glow)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:translate-y-0 sm:px-6 sm:py-3"
                rel="noreferrer"
                featureFlag="cta-hero-launch-app"
              >
                Launch App
              </CtaLink>
              <CtaLink
                eventId="hero-view-roadmap"
                label="View Roadmap"
                location="hero"
                href="#roadmap"
                className="inline-flex items-center justify-center rounded-full border border-[color:var(--border-soft)] bg-[color:var(--surface-card)]/60 px-5 py-2.5 text-sm font-semibold text-[color:var(--brand)] transition duration-200 hover:border-[color:var(--brand)] sm:px-6 sm:py-3"
                featureFlag="cta-hero-view-roadmap"
              >
                View Roadmap
              </CtaLink>
            </div>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3.5">
            {heroMetrics.map((metric) => (
              <MetricCard
                key={metric.label}
                value={metric.value}
                label={metric.label}
                annotation={metric.annotation}
                badge={metric.badge}
                sparkline={metric.sparkline}
                sparklineLabel={metric.sparklineLabel}
                sparklineColor={metric.sparklineColor}
              />
            ))}
          </div>
        </section>

        <TradingPreview />

        <section id="story" className="flex flex-col gap-10 sm:gap-12">
          <SectionHeading
            eyebrow="Why Fluxa"
            title="Liquidity today is fragmented, fragile, and expensive"
            description="We build a staged network that fixes the core pain points before layering autonomy and derivatives."
          />
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <div className="flex flex-col gap-5 rounded-3xl border border-[color:var(--border-soft)] bg-[color:var(--surface-card)] p-6 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
              <h3 className="text-lg font-semibold text-[color:var(--foreground)]">
                The problem we are solving
              </h3>
              <ul className="flex flex-col gap-3 text-sm text-[color:var(--text-muted)]">
                {storyPainPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex size-5 items-center justify-center rounded-full bg-[color:var(--brand-soft)]/40 text-[color:var(--brand)]">
                      <Sparkles className="size-3" aria-hidden="true" />
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <StoryTimeline phases={storyTimeline} />
          </div>
        </section>

        <section id="features" className="flex flex-col gap-12">
          <SectionHeading
            eyebrow="Key features & functionality"
            title="We label every capability so teams know what is live, coming, and visionary"
            description="Progressive disclosure keeps ambition clear without overwhelming first-touch visitors."
          />
          <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-4">
            {featureHighlights.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </section>

        <section id="trust" className="flex flex-col gap-10">
          <SectionHeading
            eyebrow="Proof & trust"
            title="Stress tests, explainable AI, and observability are foundational"
            description="We publish the data, surface the why behind automation, and keep reliability transparent."
          />
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-5">
              {proofMetrics.map((metric) => (
                <MetricCard
                  key={`proof-${metric.label}`}
                  value={metric.value}
                  label={metric.label}
                  annotation={metric.annotation}
                  badge={metric.badge}
                />
              ))}
            </div>
            <div className="flex flex-col gap-4 rounded-3xl border border-[color:var(--border-soft)] bg-[color:var(--surface-card)] p-6">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-subtle)]">
                Built with confidence
              </span>
              <div className="flex flex-wrap gap-3">
                {proofLogos.map((logo) => (
                  <span
                    key={logo}
                    className="inline-flex items-center rounded-full border border-[color:var(--border-soft)] bg-[color:var(--surface-muted)] px-4 py-1 text-xs font-medium text-[color:var(--text-muted)]"
                  >
                    {logo}
                  </span>
                ))}
              </div>
              <p className="text-sm text-[color:var(--text-muted)]">
                Audits, backers, and user testimonials slot in next—this section
                grows as we do.
              </p>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trustSignals.map((signal) => (
              <TrustIndicator key={signal.title} {...signal} />
            ))}
          </div>
        </section>

        <section id="roadmap" className="flex flex-col gap-10 lg:gap-12">
          <SectionHeading
            eyebrow="Roadmap"
            title="Four phases take Fluxa from trusted CLMM to autonomous derivatives"
            description="The north-star graphic doubles as your planning tool—see what is live, what’s next, and where we are headed."
          />
          <div className="relative">
            <div className="pointer-events-none absolute left-6 right-6 top-10 hidden lg:block h-px bg-gradient-to-r from-[color:var(--border-soft)] via-[color:var(--brand-soft)] to-[color:var(--border-soft)]" />
            <ol className="grid gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
              {roadmap.map((item, index) => (
                <RoadmapCard key={item.title} step={index + 1} {...item} />
              ))}
            </ol>
          </div>
        </section>

        <section
          id="closing"
          className="flex flex-col gap-10 rounded-3xl border border-[color:var(--border-soft)] bg-[color:var(--surface-raised)] px-8 py-10 shadow-[0_35px_70px_rgba(12,18,36,0.32)]"
        >
          <div className="flex flex-col gap-4">
            <StatusPill stage="vision" label="Vision in motion" />
            <h2 className="text-3xl font-semibold text-[color:var(--foreground)]">
              Fluxa isn’t just another AMM—it’s Solana’s financial operating
              system for autonomous liquidity.
            </h2>
            <p className="max-w-3xl text-pretty text-base text-[color:var(--text-muted)]">
              Join early, follow along, or launch straight into the desk. Every
              path keeps you close to the future of decentralized markets.
            </p>
          </div>
          <WaitlistForm />
          <div className="flex flex-wrap gap-3">
            <CtaLink
              eventId="closing-launch-app"
              label="Launch App"
              location="closing"
              href="https://app.fluxa.xyz"
              prefetch={false}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--border-soft)] bg-[color:var(--surface-card)]/70 px-5 py-2 text-sm font-semibold text-[color:var(--brand)] transition duration-200 hover:border-[color:var(--brand)]"
              featureFlag="cta-closing-launch-app"
            >
              Launch App
            </CtaLink>
            <CtaLink
              eventId="closing-follow-x"
              label="Follow on X"
              location="closing"
              href="https://x.com/FluxaAmm"
              prefetch={false}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--border-soft)] bg-[color:var(--surface-card)]/70 px-5 py-2 text-sm font-semibold text-[color:var(--brand)] transition duration-200 hover:border-[color:var(--brand)]"
              featureFlag="cta-closing-follow-x"
            >
              Follow on X
            </CtaLink>
          </div>
          <p className="text-xs text-[color:var(--text-subtle)]">
            By signing up you agree to receive Fluxa updates. Opt out anytime—we
            protect your inbox the way we protect liquidity.
          </p>
        </section>
      </main>
    </div>
  );
}
