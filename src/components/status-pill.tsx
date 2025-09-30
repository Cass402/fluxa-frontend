import type { ReactNode } from "react";

export type Stage =
  | "live"
  | "comingSoon"
  | "roadmap"
  | "vision"
  | "preview"
  | "beta";

type StageDefinition = {
  label: string;
  description: string;
  className: string;
  icon?: ReactNode;
};

const stageMap: Record<Stage, StageDefinition> = {
  live: {
    label: "Live",
    description: "Available now in the production app",
    className:
      "bg-[color:var(--status-live-bg)] text-[color:var(--status-live-fg)] ring-1 ring-inset ring-[color:var(--status-live-ring)]",
  },
  comingSoon: {
    label: "Coming Soon",
    description: "Shipping this quarter with limited beta cohorts",
    className:
      "bg-[color:var(--status-soon-bg)] text-[color:var(--status-soon-fg)] ring-1 ring-inset ring-[color:var(--status-soon-ring)]",
  },
  roadmap: {
    label: "Roadmap",
    description: "Planned for later phases of the roadmap",
    className:
      "bg-[color:var(--status-roadmap-bg)] text-[color:var(--status-roadmap-fg)] ring-1 ring-inset ring-[color:var(--status-roadmap-ring)]",
  },
  vision: {
    label: "Vision",
    description: "North-star concepts guiding Fluxa’s evolution",
    className:
      "bg-[color:var(--status-vision-bg)] text-[color:var(--status-vision-fg)] ring-1 ring-inset ring-[color:var(--status-vision-ring)]",
  },
  preview: {
    label: "Preview",
    description: "In research mode with gated preview access",
    className:
      "bg-[color:var(--status-preview-bg)] text-[color:var(--status-preview-fg)] ring-1 ring-inset ring-[color:var(--status-preview-ring)]",
  },
  beta: {
    label: "Private Beta",
    description: "Invite-only cohort validating the experience",
    className:
      "bg-[color:var(--status-beta-bg)] text-[color:var(--status-beta-fg)] ring-1 ring-inset ring-[color:var(--status-beta-ring)]",
  },
};

export interface StatusPillProps {
  stage: Stage;
  label?: string;
  hint?: string;
  className?: string;
}

export function StatusPill({ stage, label, hint, className }: StatusPillProps) {
  const definition = stageMap[stage];
  const displayLabel = label ?? definition.label;
  const description = hint ?? definition.description;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${definition.className} ${className ?? ""}`.trim()}
      title={description}
      aria-label={`${displayLabel} – ${description}`}
    >
      <span
        className="h-1.5 w-1.5 rounded-full bg-current"
        aria-hidden="true"
      />
      {displayLabel}
    </span>
  );
}

export const stageLabel = (stage: Stage) => stageMap[stage].label;
