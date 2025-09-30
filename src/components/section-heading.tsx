import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const alignment =
    align === "center" ? "items-center text-center mx-auto" : "items-start";

  return (
    <header className={`flex w-full max-w-4xl flex-col gap-3 ${alignment}`}>
      {eyebrow ? (
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-subtle)]">
          <span
            className="h-px w-6 bg-[color:var(--border-subtle)]"
            aria-hidden="true"
          />
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-balance text-3xl font-semibold text-[color:var(--foreground)] sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-3xl text-pretty text-base text-[color:var(--text-muted)] sm:text-lg">
          {description}
        </p>
      ) : null}
    </header>
  );
}
