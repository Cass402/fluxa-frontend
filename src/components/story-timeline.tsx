"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

import { StatusPill, type Stage } from "@/components/status-pill";

interface StoryTimelinePhase {
  stage: Stage;
  title: string;
  summary: string;
  icon: ReactNode;
}

interface StoryTimelineProps {
  phases: StoryTimelinePhase[];
}

const cardTransition = {
  duration: 0.45,
  ease: [0.22, 0.5, 0.15, 1] as const,
};

export function StoryTimeline({ phases }: StoryTimelineProps) {
  return (
    <div className="flex flex-col gap-3.5 rounded-3xl border border-[color:var(--border-soft)] bg-[color:var(--surface-muted)]/70 p-5 sm:gap-4 sm:p-6">
      <h3 className="text-base font-semibold text-[color:var(--foreground)] sm:text-lg">
        The phased vision
      </h3>
      <div className="relative">
        <motion.div
          className="pointer-events-none absolute left-4 right-4 top-7 hidden h-px bg-gradient-to-r from-[color:var(--border-soft)] via-[color:var(--brand-soft)] to-[color:var(--border-soft)] md:left-6 md:right-6 md:top-8 md:block"
          initial={{ opacity: 0, scaleX: 0.5 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          style={{ transformOrigin: "0% 50%" }}
        />
        <ol className="grid list-none gap-3 md:grid-cols-2 md:gap-4">
          {phases.map((phase, index) => (
            <li key={phase.title}>
              <motion.article
                className="group relative flex h-full flex-col gap-2.5 overflow-hidden rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface-card)]/85 p-4 shadow-[0_10px_26px_rgba(15,23,42,0.1)] transition-shadow duration-300 hover:shadow-[0_18px_38px_rgba(15,23,42,0.22)] sm:gap-3 sm:p-5"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ delay: index * 0.08, ...cardTransition }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-9 items-center justify-center rounded-full bg-[color:var(--brand-soft)]/35 text-[color:var(--brand)] sm:size-10">
                    {phase.icon}
                  </span>
                  <StatusPill stage={phase.stage} />
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-sm font-semibold text-[color:var(--foreground)] sm:text-base">
                    {phase.title}
                  </h4>
                  <p className="text-sm text-[color:var(--text-muted)]">
                    {phase.summary}
                  </p>
                </div>
                <span className="pointer-events-none absolute inset-0 rounded-[calc(theme(borderRadius.2xl)+6px)] bg-gradient-to-br from-[color:var(--brand-soft)]/12 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </motion.article>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
