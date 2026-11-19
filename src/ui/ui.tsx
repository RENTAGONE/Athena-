import type { ReactNode } from "react";
import { disciplineColor } from "./disciplines.ts";

export function Head({ label, title }: { label: string; title: string }): ReactNode {
  return (
    <header className="head">
      <span className="label">{label}</span>
      <h1>{title}</h1>
    </header>
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
    <section className="panel atlas">
      <h2>{title}</h2>
      <div style={{ marginTop: 12 }}>{children}</div>
    </section>
  );
}
