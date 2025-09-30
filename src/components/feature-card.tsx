"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { StatusPill, type Stage } from "./status-pill";

interface FeatureCardProps {
  stage: Stage;
  kicker: string;
  title: string;
  description: string;
  highlights?: string[];
  cta?: {
    label: string;
    href: string;
  };
  icon?: ReactNode;
}

const cardTransition = {
  duration: 0.32,
  ease: [0.25, 0.1, 0.25, 1] as const,
};

export function FeatureCard({
  stage,
  kicker,
  title,
  description,
  highlights,
  cta,
  icon,
}: FeatureCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={cardTransition}
      className="flex h-full flex-col justify-between gap-6 rounded-3xl border border-[color:var(--border-soft)] bg-[color:var(--surface-card)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.16)]"
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {icon ? (
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-[color:var(--brand-soft)]/30 text-[color:var(--brand)]">
                {icon}
              </span>
            ) : null}
            <StatusPill stage={stage} />
          </div>
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--text-subtle)]">
            {kicker}
          </span>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-2xl font-semibold text-[color:var(--foreground)]">
            {title}
          </h3>
          <p className="text-sm leading-relaxed text-[color:var(--text-muted)]">
            {description}
          </p>
          {highlights && highlights.length ? (
            <ul className="mt-2 flex list-disc flex-col gap-2 pl-5 text-sm text-[color:var(--text-muted)]">
              {highlights.map((item) => (
                <li key={item} className="marker:text-[color:var(--brand)]">
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
      {cta ? (
        <motion.a
          href={cta.href}
          className="group inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--brand)]"
          whileHover={{ x: 4 }}
          transition={cardTransition}
        >
          {cta.label}
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
        </motion.a>
      ) : null}
    </motion.article>
  );
}
