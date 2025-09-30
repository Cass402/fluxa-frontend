import Link from "next/link";

import { FeatureCard } from "@/components/feature-card";
import { MetricCard } from "@/components/metric-card";
import { RoadmapCard } from "@/components/roadmap-card";
import { SectionHeading } from "@/components/section-heading";
import { StatusPill } from "@/components/status-pill";
import { TrustIndicator } from "@/components/trust-indicator";

const heroMetrics = [
  {
    value: "$128M",
    label: "Capital stress-tested",
    annotation:
      "Simulated across 14,200 market regimes with Solana-native data",
    badge: <span>+12% vs. peer survival</span>,
  },
  {
    value: "97%",
    label: "Landing probability",
    annotation:
      "Priority fee guidance + compute budgeting keeps vault actions inside target risk bands.",
  },
  {
    value: "3s",
    label: "Trust checkpoint",
    annotation:
      "Average time to reveal costs, slippage, and worst-case outcomes before confirm.",
  },
];

const featureHighlights = [
  {
    stage: "live" as const,
    kicker: "Risk-first trading",
    title: "Trust-first CLMM terminal",
    description:
      "Preview, simulate, and confirm in one cohesive flow. Every slider, toggle, and range change updates risk, fees, and execution probability instantly.",
    highlights: [
      "Worst-case PnL surfaced before you sign, not after.",
      "Decode Solana program IDs, compute units, and fee impact in human language.",
      "Accessibility-first UI built to WCAG 2.2 AA from the start.",
    ],
    cta: { label: "Enter the trading desk", href: "#trading" },
  },
  {
    stage: "comingSoon" as const,
    kicker: "Intelligence",
    title: "Smart order routing with guardrails",
    description:
      "Route capital across pools with explainable execution plans. Fluxa scores venues on depth, latency, and counterparty risk, then shows how each affects your outcome.",
    highlights: [
      "Helius-powered order book preview (read-only until launch).",
      "Scenario comparisons for passive, active, and hybrid strategies.",
      "Goal-linked nudges keep cognitive load under three concurrent gamified cues.",
    ],
    cta: { label: "Join routing beta", href: "#waitlist" },
  },
  {
    stage: "roadmap" as const,
    kicker: "Advanced strategies",
    title: "Institutional automations, without the bloat",
    description:
      "Unlock stop-loss, take-profit ladders, and rebalancing presets once you demonstrate mastery. Every unlock is contextual, transparent, and reversible.",
    highlights: [
      "Audit-grade exports mapped to compliance-ready CSV/JSON.",
      "Backtesting overlays with impermanent loss projections.",
      "Progress tracker keeps streaks ≤3 gamified signals to preserve focus.",
    ],
    cta: { label: "Review the roadmap", href: "#roadmap" },
  },
];

const roadmap = [
  {
    stage: "live" as const,
    title: "Phase I · Foundation",
    description:
      "Core CLMM desk with decoded transactions, fee transparency, and educational micro-moments across every action.",
    eta: "Today",
    cohortSize: 1120,
    focus:
      "Risk-first trade confirmations, real-time simulations, WCAG 2.2 AA baselines.",
  },
  {
    stage: "comingSoon" as const,
    title: "Phase II · Intelligence",
    description:
      "AI-guided risk scoring, behavioral nudges, and adaptive tutorials tailored to your strategy confidence.",
    eta: "Q1 2025",
    cohortSize: 420,
    focus:
      "Goal reinforcement loops, yield path comparisons, contextual coaching.",
  },
  {
    stage: "roadmap" as const,
    title: "Phase III · Mastery",
    description:
      "Enterprise automation suite—bulk ops, strategy templates, and audit trails—with explainable guardrails at every step.",
    eta: "H2 2025",
    focus:
      "Cross-venue orchestration, compliance-ready reporting, delegated controls.",
  },
];

const trustSignals = [
  {
    label: "Security",
    title: "Plain-language transaction decoding",
    description:
      "See compute units, fee impact, and program IDs translated into everyday language before you approve. Emergency exit and global pause controls are always one tap away.",
    emphasis:
      "Priority fee guardrails and MEV protections activate automatically for high-risk actions.",
    icon: "shield" as const,
  },
  {
    label: "Behavioral intelligence",
    title: "Micro-learning at the moment of decision",
    description:
      "Nudges follow the Savings → Risk → Learning → Goals hierarchy so you stay ahead without feeling pressured. No dark patterns, ever.",
    emphasis:
      "Research-driven prompts lifted engagement by 40% in closed beta.",
    icon: "analytics" as const,
  },
  {
    label: "Observability",
    title: "Telemetry that earns trust",
    description:
      "Sentry, OpenTelemetry, and Web Vitals unify into a transparent reliability score surfaced right in the interface.",
    emphasis:
      "If performance dips beyond 50 ms, we tell you before you notice.",
    icon: "circuit" as const,
  },
];

export default function Home() {
  return (
    <div className="relative isolate">
      <div className="pointer-events-none absolute inset-x-0 top-[-10rem] z-[-1] h-[32rem] bg-gradient-to-b from-[color:var(--brand-soft)]/40 via-transparent to-transparent" />
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-24 px-6 pb-24 pt-16 sm:px-8 lg:px-12">
        <section
          className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)] lg:items-center"
          id="hero"
        >
          <div className="flex flex-col gap-8">
            <StatusPill stage="beta" label="Private beta live" />
            <div className="flex flex-col gap-6">
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-5xl lg:text-6xl">
                DeFi without compromise: concentrated liquidity mastery with
                built-in trust.
              </h1>
              <p className="max-w-2xl text-pretty text-base text-[color:var(--text-muted)] sm:text-lg">
                Fluxa delivers the Bloomberg-grade control you expect with the
                calm confidence you need. Every action previews worst-case
                outcomes, explains the cost structure, and reinforces progress
                without noise.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="#waitlist"
                className="inline-flex items-center justify-center rounded-full bg-[color:var(--brand)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-glow)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:translate-y-0"
              >
                Join the private beta
              </Link>
              <Link
                href="#roadmap"
                className="inline-flex items-center justify-center rounded-full border border-[color:var(--border-soft)] bg-[color:var(--surface-card)]/60 px-6 py-3 text-sm font-semibold text-[color:var(--brand)] transition duration-200 hover:border-[color:var(--brand)]"
              >
                View the product roadmap
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {heroMetrics.map((metric) => (
              <MetricCard
                key={metric.label}
                value={metric.value}
                label={metric.label}
                annotation={metric.annotation}
                badge={metric.badge}
              />
            ))}
          </div>
        </section>

        <section id="trust" className="flex flex-col gap-12">
          <SectionHeading
            eyebrow="Trust-first design"
            title="Confidence in the first three seconds, intelligence for every choice after"
            description="We translated years of behavioral research into a Liquidity UX that respects cognitive load, avoids dark patterns, and keeps risk transparent."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trustSignals.map((signal) => (
              <TrustIndicator key={signal.title} {...signal} />
            ))}
          </div>
        </section>

        <section id="features" className="flex flex-col gap-12">
          <SectionHeading
            eyebrow="Product pillars"
            title="Purpose-built modules aligned with the Fluxa roadmap"
            description="Every module is labeled by availability so teams can plan adoption with clarity. Nothing ships without audit trails, accessibility, and measurable behavior change."
          />
          <div className="grid gap-8 lg:grid-cols-3">
            {featureHighlights.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </section>

        <section id="roadmap" className="flex flex-col gap-12">
          <SectionHeading
            eyebrow="Roadmap"
            title="A transparent path from foundation to mastery"
            description="Fluxa evolves in sequenced phases so you always know what is live, what’s coming, and how to participate in shaping it."
          />
          <ol className="grid gap-6 lg:grid-cols-3">
            {roadmap.map((item) => (
              <RoadmapCard key={item.title} {...item} />
            ))}
          </ol>
        </section>

        <section
          id="waitlist"
          className="flex flex-col gap-10 rounded-3xl border border-[color:var(--border-soft)] bg-[color:var(--surface-raised)] px-8 py-10 shadow-[0_35px_70px_rgba(12,18,36,0.32)]"
        >
          <div className="flex flex-col gap-4">
            <StatusPill stage="preview" label="Preview access" />
            <h2 className="text-3xl font-semibold text-[color:var(--foreground)]">
              Join the cohort shaping Fluxa’s institutional-grade Solana desk
            </h2>
            <p className="max-w-3xl text-pretty text-base text-[color:var(--text-muted)]">
              We onboard in waves to keep support and education personal.
              Request access and we’ll tailor an activation plan that aligns
              with your treasury goals.
            </p>
          </div>
          <form
            className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]"
            aria-label="Request beta invitation"
          >
            <label className="sr-only" htmlFor="email">
              Work email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@team.co"
              required
              className="h-12 rounded-full border border-[color:var(--border-soft)] bg-[color:var(--surface-card)]/90 px-5 text-sm text-[color:var(--foreground)] outline-none transition placeholder:text-[color:var(--text-subtle)] focus:border-[color:var(--brand)] focus-visible:border-[color:var(--brand)]"
            />
            <button
              type="submit"
              className="h-12 rounded-full bg-[color:var(--brand)] px-6 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 focus-visible:translate-y-0"
            >
              Request invite
            </button>
          </form>
          <p className="text-xs text-[color:var(--text-subtle)]">
            By requesting access you agree to receive product updates about
            Fluxa. We never sell data, and you can opt out at any time.
          </p>
        </section>
      </main>
    </div>
  );
}
