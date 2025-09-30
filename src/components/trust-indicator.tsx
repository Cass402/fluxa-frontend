"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { ShieldCheck, BarChart3, CircuitBoard } from "lucide-react";

type TrustIcon = "shield" | "analytics" | "circuit";

const iconMap: Record<TrustIcon, ReactNode> = {
  shield: <ShieldCheck className="size-5" aria-hidden="true" />,
  analytics: <BarChart3 className="size-5" aria-hidden="true" />,
  circuit: <CircuitBoard className="size-5" aria-hidden="true" />,
};

interface TrustIndicatorProps {
  title: string;
  description: string;
  label: string;
  icon: TrustIcon;
  emphasis?: string;
}

export function TrustIndicator({
  title,
  description,
  label,
  icon,
  emphasis,
}: TrustIndicatorProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.28, ease: [0.2, 0.55, 0.25, 1] }}
      className="flex flex-col gap-4 rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface-muted)] p-5"
    >
      <span className="inline-flex size-10 items-center justify-center rounded-full bg-[color:var(--brand-soft)]/40 text-[color:var(--brand)]">
        {iconMap[icon]}
      </span>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--text-subtle)]">
          {label}
        </span>
        <h3 className="text-lg font-semibold text-[color:var(--foreground)]">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-[color:var(--text-muted)]">
          {description}
        </p>
        {emphasis ? (
          <p className="text-sm font-medium text-[color:var(--accent)]">
            {emphasis}
          </p>
        ) : null}
      </div>
    </motion.article>
  );
}
