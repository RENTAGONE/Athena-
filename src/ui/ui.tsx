import type { ReactNode } from "react";
import { disciplineColor } from "./disciplines.ts";

/**
 * Page header. One primitive for every screen, so the eyebrow, title and side slot land in the same
 * optical position everywhere; each page can still give the block its own accent through `tone`.
 */
export function PageHead({
  label,
  title,
  meta,
  actions,
  glyph,
  tone,
}: {
  label: string;
  title: string;
  meta?: ReactNode;
  actions?: ReactNode;
  glyph?: ReactNode;
  tone?: string;
}): ReactNode {
  return (
    <header className="page-head" style={tone ? ({ ["--tone" as string]: tone } as Record<string, string>) : undefined}>
      <div className="page-head-main">
        <span className="eyebrow">
          <i aria-hidden="true" />
          {label}
        </span>
        <h1 className="page-title">{title}</h1>
        {meta && <p className="page-meta">{meta}</p>}
      </div>
      {(actions || glyph) && (
        <div className="page-head-side">
          {glyph && <span className="page-glyph" aria-hidden="true">{glyph}</span>}
          {actions}
        </div>
      )}
    </header>
  );
}

export function Head({ label, title }: { label: string; title: string }): ReactNode {
  return <PageHead label={label} title={title} />;
}

/** A small labelled heading used inside a pane: eyebrow on the left, a count or action on the right. */
export function SectionHead({ label, aside }: { label: ReactNode; aside?: ReactNode }): ReactNode {
  return (
    <div className="section-head">
      <span className="eyebrow"><i aria-hidden="true" />{label}</span>
      {aside && <span className="section-aside">{aside}</span>}
    </div>
  );
}

/**
 * Hairline gauge for a real ratio. `value` and `total` are always shown as text by the caller, so the
 * bar never implies a precision the data does not have.
 */
export function Meter({
  value,
  total,
  tone = "var(--atlas-cyan)",
  label,
}: {
  value: number;
  total: number;
  tone?: string;
  label?: string;
}): ReactNode {
  const pct = total > 0 ? Math.max(0, Math.min(1, value / total)) : 0;
  return (
    <div
      className="meter"
      role="img"
      aria-label={label ?? `${value} of ${total}`}
      style={{ ["--tone" as string]: tone, ["--fill" as string]: `${(pct * 100).toFixed(2)}%` }}
    >
      <span className="meter-fill" />
    </div>
  );
}

/** Donut for a count of satisfied clauses. Centre shows the count; nothing is invented. */
export function Ring({
  value,
  total,
  caption,
  tone = "var(--atlas-cyan)",
  size = 128,
}: {
  value: number;
  total: number;
  caption?: string;
  tone?: string;
  size?: number;
}): ReactNode {
  const r = 44;
  const c = 2 * Math.PI * r;
  const frac = total > 0 ? Math.max(0, Math.min(1, value / total)) : 0;
  return (
    <div className="ring" style={{ ["--tone" as string]: tone, width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
        <circle className="ring-track" cx="50" cy="50" r={r} />
        <circle
          className="ring-arc"
          cx="50"
          cy="50"
          r={r}
          strokeDasharray={`${(c * frac).toFixed(2)} ${c.toFixed(2)}`}
        />
        <circle className="ring-core" cx="50" cy="50" r={2.4} />
      </svg>
      <span className="ring-label">
        <b>{value}<em>/{total}</em></b>
        {caption && <small>{caption}</small>}
      </span>
    </div>
  );
}

export function StatusTag({ status }: { status: string }): ReactNode {
  const cls = status === "draft" ? "draft" : status === "approved" ? "ok" : "";
  return <span className={`tag ${cls}`}>{status}</span>;
}
export function disciplineVar(ownerCode: string | null): string {
  return disciplineColor(ownerCode);
}
export function Empty({ title, children }: { title: string; children?: ReactNode }): ReactNode {
  return (
    <section className="panel">
      <h2>{title}</h2>
      <div style={{ marginTop: 12 }}>{children}</div>
    </section>
  );
}
