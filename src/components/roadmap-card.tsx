"use client";

import { motion } from "motion/react";
import { CalendarDays, Clock, Users } from "lucide-react";
import { StatusPill, type Stage } from "./status-pill";

interface RoadmapCardProps {
  stage: Stage;
  title: string;
  description: string;
  eta: string;
  cohortSize?: number;
  focus?: string;
  step?: number;
}

const transition = {
  duration: 0.36,
  ease: [0.16, 1, 0.3, 1] as const,
};

export function RoadmapCard({
  stage,
  title,
  description,
  eta,
  cohortSize,
  focus,
  step,
}: RoadmapCardProps) {
  const isVision = stage === "vision";
  const isRoadmap = stage === "roadmap";
  const cardTone = isVision
    ? "border-[color:var(--status-vision-ring)]/60 bg-gradient-to-br from-[color:var(--surface-card)]/75 via-[color:var(--surface-muted)]/70 to-[color:var(--surface-card)]/35"
    : isRoadmap
      ? "border-[color:var(--status-roadmap-ring)]/60 bg-[color:var(--surface-muted)]/75"
      : "border-[color:var(--border-soft)] bg-[color:var(--surface-card)]/85";

  return (
    <motion.li
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={transition}
      className={`group relative flex flex-col gap-4 rounded-3xl p-6 backdrop-blur-sm transition-shadow duration-300 hover:shadow-[0_18px_45px_rgba(15,23,42,0.28)] ${cardTone}`}
    >
      <div className="flex items-center gap-3">
        {typeof step === "number" ? (
          <span className="inline-flex size-10 items-center justify-center rounded-full border border-[color:var(--border-soft)] bg-[color:var(--surface-card)] text-sm font-semibold text-[color:var(--brand)] shadow-[0_10px_28px_rgba(15,23,42,0.12)]">
            {step.toString().padStart(2, "0")}
          </span>
        ) : null}
        <StatusPill stage={stage} className="self-start" />
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-xl font-semibold text-[color:var(--foreground)]">
          {title}
        </h3>
        <p className="text-sm text-[color:var(--text-muted)]">{description}</p>
      </div>
      <dl className="grid gap-2 text-xs text-[color:var(--text-subtle)] sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4" aria-hidden="true" />
          <dt className="font-medium uppercase tracking-[0.14em]">Target</dt>
          <dd className="text-[color:var(--foreground)]">{eta}</dd>
        </div>
        {cohortSize ? (
          <div className="flex items-center gap-2">
            <Users className="size-4" aria-hidden="true" />
            <dt className="font-medium uppercase tracking-[0.14em]">Cohort</dt>
            <dd className="text-[color:var(--foreground)]">
              {new Intl.NumberFormat().format(cohortSize)} members
            </dd>
          </div>
        ) : null}
        {focus ? (
          <div className="flex items-center gap-2 sm:col-span-2">
            <Clock className="size-4" aria-hidden="true" />
            <dt className="font-medium uppercase tracking-[0.14em]">Focus</dt>
            <dd className="text-[color:var(--foreground)]">{focus}</dd>
          </div>
        ) : null}
      </dl>
      {isVision ? (
        <>
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[calc(theme(borderRadius.3xl)+6px)]"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background:
                "radial-gradient(120% 120% at 0% 0%, rgba(76,93,255,0.24), transparent), radial-gradient(120% 120% at 100% 100%, rgba(14,165,233,0.22), transparent)",
            }}
          />
          <div className="pointer-events-none absolute inset-px rounded-[calc(theme(borderRadius.3xl)+4px)] bg-gradient-to-b from-[color:var(--brand-soft)]/12 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </>
      ) : (
        <div className="pointer-events-none absolute inset-px rounded-[calc(theme(borderRadius.3xl)+4px)] bg-gradient-to-b from-[color:var(--brand-soft)]/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      )}
    </motion.li>
  );
}
