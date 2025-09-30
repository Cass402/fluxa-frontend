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
}: RoadmapCardProps) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={transition}
      className="group relative flex flex-col gap-4 rounded-3xl border border-[color:var(--border-soft)] bg-[color:var(--surface-muted)]/70 p-6 backdrop-blur-sm"
    >
      <StatusPill stage={stage} className="self-start" />
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
      <div className="pointer-events-none absolute inset-px rounded-[calc(theme(borderRadius.3xl)+4px)] bg-gradient-to-b from-[color:var(--brand-soft)]/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </motion.li>
  );
}
