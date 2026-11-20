import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { BookOpen, CircleDot, ShieldCheck } from "lucide-react";
import { buildCapabilityCards, pclAudit, type PclCard } from "../app/engines/pcl.ts";
import { useApp } from "./context.ts";
import { PageHead, SectionHead } from "./ui.tsx";

const DISPOSITION_TONE: Record<PclCard["disposition"], string> = {
  REUSE: "var(--growth-teal)",
  EXTEND: "var(--atlas-cyan)",
  NEW: "var(--insight-amber)",
  DEFER: "var(--text-muted)",
};

export function LibraryScreen(): ReactNode {
  const { state } = useApp();
  const cards = useMemo(() => buildCapabilityCards(state), [state]);
  const audit = useMemo(() => pclAudit(state), [state]);
  const [selected, setSelected] = useState<string>(cards[0]?.id ?? "social_fluency");
  const card = cards.find((c) => c.id === selected) ?? cards[0];
  const withCanonical = audit.filter((a) => a.matches > 0).length;

  return (
    <div className="page page-record page-library">
      <PageHead
        label="Practise · Capability library"
        title="Practical capability"
        meta={
          <>
            Ten cross-cutting tracks that index records already in your atlas. <b>{withCanonical}</b> of <b>{audit.length}</b> tracks resolve to canonical
            records; the rest are reported as gaps instead of being invented.
          </>
        }
        glyph={<BookOpen strokeWidth={1.4} />}
      />

      <div className="workspace">
        <nav className="panel span-4 library-rail" aria-label="Capability tracks">
          <SectionHead label="Tracks" aside={<span className="num">{cards.length}</span>} />
          <ul className="list">
            {cards.map((c) => (
              <li key={c.id}>
                <button
                  className="library-track"
                  aria-pressed={c.id === selected}
                  onClick={() => setSelected(c.id)}
                >
                  <span className="t">{c.track.title}</span>
                  <span className="num" style={{ color: DISPOSITION_TONE[c.disposition] }}>{c.disposition}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {card && (
          <article className="panel span-8">
            <SectionHead label={card.track.title} aside={<span className="tag" style={{ borderColor: DISPOSITION_TONE[card.disposition], color: DISPOSITION_TONE[card.disposition] }}>{card.disposition}</span>} />
            <h2 className="library-outcome">{card.sections.outcome}</h2>

            <div className="library-grid">
              <section>
                <h3><CircleDot size={14} strokeWidth={1.5} aria-hidden="true" /> Why it matters</h3>
                <ul className="list compact">{card.sections.why.map((w) => <li key={w}>{w}</li>)}</ul>
              </section>
              <section>
                <h3>Foundations and gates</h3>
                {card.sections.foundations.length === 0 && card.sections.gates.length === 0 ? (
                  <p className="hint">No canonical record matched this track yet. The card is marked {card.disposition}; nothing was created automatically.</p>
                ) : (
                  <ul className="list compact">
                    {card.sections.foundations.map((f) => (
                      <li key={f.code}><a href={`#/knowledge/${encodeURIComponent(f.code)}`}>{f.title}</a> <span className="mono">{f.code}</span></li>
                    ))}
                    {card.sections.gates.map((g) => (
                      <li key={g.code}><a href={`#/knowledge/${encodeURIComponent(g.code)}`}>{g.title}</a> <span className="mono">{g.code}</span></li>
                    ))}
                  </ul>
                )}
              </section>

              <section>
                <h3>Teaching sequence</h3>
                <ol className="list compact ordered">{card.sections.sequence.map((s) => <li key={s}>{s}</li>)}</ol>
              </section>
              <section>
                <h3>Worked example</h3>
                <p>{card.sections.workedExample}</p>
              </section>

              <section>
                <h3>Practice</h3>
                <ul className="list compact">{card.sections.practice.map((p) => <li key={p}>{p}</li>)}</ul>
              </section>
              <section>
                <h3>Common errors and corrections</h3>
                <ul className="list compact">
                  {card.sections.errors.map((e) => (
                    <li key={e.wrong}><span className="error-line">{e.wrong}</span> <span className="correction">{e.correction}</span></li>
                  ))}
                </ul>
              </section>

              <section>
                <h3>Observable demonstration</h3>
                <p>{card.sections.demonstration}</p>
              </section>
              <section>
                <h3>Rubric</h3>
                <ul className="list compact">
                  {card.sections.rubric.map((r) => (
                    <li key={r.criterion}><strong>{r.criterion}</strong><span className="hint">{r.levels.join(" → ")}</span></li>
                  ))}
                </ul>
              </section>

              <section>
                <h3>Transfer</h3>
                <p>{card.sections.transfer}</p>
              </section>
              <section>
                <h3>Progression and time</h3>
                <p>{card.sections.progression}</p>
                <p className="hint">Estimated practice: <span className="num">{card.sections.estimateMinutes}</span> min. An estimate, not a deadline.</p>
              </section>
            </div>

            <section className="library-safety">
              <h3><ShieldCheck size={14} strokeWidth={1.5} aria-hidden="true" /> Safety, privacy and accessibility</h3>
              <ul className="list compact">{card.sections.safety.map((s) => <li key={s}>{s}</li>)}</ul>
            </section>

            <footer className="library-links">
              <span className="label">Canonical links</span>
              {card.sections.links.length === 0 ? (
                <p className="hint">No canonical links for this track in the current store.</p>
              ) : (
                <ul className="row wrap">
                  {card.sections.links.map((l) => (
                    <li key={l.code}><a className="chip" href={`#/knowledge/${encodeURIComponent(l.code)}`}>{l.title}<span className="mono">{l.type.replace(/_/g, " ")}</span></a></li>
                  ))}
                </ul>
              )}
              <p className="hint">{card.sections.provenance}</p>
            </footer>
          </article>
        )}
      </div>
    </div>
  );
}
