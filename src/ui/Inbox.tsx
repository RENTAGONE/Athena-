import type { ReactNode } from "react";
import { ArrowRight, Clock, Inbox as InboxIcon, ShieldCheck } from "lucide-react";
import { buildInbox, type InboxKind } from "../app/engines/inbox.ts";
import { PageBack } from "./PageBack.tsx";
import { useApp } from "./context.ts";
import { useEngineInput } from "./use-engine-input.ts";
import { PageHead } from "./ui.tsx";

const KIND_LABEL: Record<InboxKind, string> = {
  safety: "Review flag",
  import: "Import",
  revision: "Retry",
  retention: "Retention",
  draft: "Draft",
};

export function InboxScreen(): ReactNode {
  const { state } = useApp();
  const input = useEngineInput();
  const inbox = buildInbox(input, state.receipts);
  const total = inbox.items.length;

  return (
    <div className="page page-inbox">
      <PageBack href="#/today" label="Today" />
      <PageHead
        label="Derived from your store"
        title="Inbox"
        meta={<>{total === 0 ? "Nothing is waiting on you." : <><b>{total}</b> item{total === 1 ? "" : "s"} between retry, retention, drafts and review flags.</>} Reading an item never clears it; recording an outcome does.</>}
        glyph={<InboxIcon strokeWidth={1.4} />}
      />
      <div className="triage">
        {([
          ["Retry", inbox.counts.revision, "var(--insight-amber)"],
          ["Retention", inbox.counts.retention, "var(--growth-teal)"],
          ["Draft", inbox.counts.draft, "var(--signal-blue)"],
          ["Review", inbox.counts.safety, "var(--danger-red)"],
        ] as [string, number, string][]).map(([name, n, tone]) => (
          <div className="triage-cell" key={name} style={{ ["--tone" as string]: tone }}>
            <b>{n}</b>
            <span>{name}</span>
          </div>
        ))}
      </div>
      <div className="bento">
        <section className="panel span-8">
          <div className="row between wrap">
            <span className="label">Waiting on you · <span className="num">{total}</span></span>
            <span className="row" style={{ gap: 8 }}>
              <span className="tag draft"><span className="num">{inbox.counts.revision}</span> retry</span>
              <span className="tag ok"><span className="num">{inbox.counts.retention}</span> retention</span>
              <span className="tag"><span className="num">{inbox.counts.draft}</span> draft</span>
            </span>
          </div>
          <p className="empty" style={{ marginTop: 8 }}>{inbox.note}</p>

          {total === 0 ? (
            <div className="inbox-empty">
              <InboxIcon size={26} strokeWidth={1.3} aria-hidden="true" />
              <h2>Nothing to answer</h2>
              <p>No retry, retention or review flag is waiting. The routine on Today is still the next useful move.</p>
              <a className="btn primary" href="#/today">Open today’s routine<ArrowRight size={15} strokeWidth={1.5} aria-hidden="true" /></a>
            </div>
          ) : (
            <ul className="inbox-list">
              {inbox.items.map((item) => (
                <li key={item.id}>
                  <a className={`inbox-item tone-${item.tone}`} href={item.href}>
                    <span className="inbox-kind">{KIND_LABEL[item.kind]}</span>
                    <span className="inbox-body">
                      <strong>{item.title}</strong>
                      <span>{item.detail}</span>
                      <span className="inbox-meta mono">{item.meta}</span>
                    </span>
                    <ArrowRight size={15} strokeWidth={1.5} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="span-4 stack">
          <section className="panel">
            <span className="label">How this inbox works</span>
            <div className="stack" style={{ marginTop: 10 }}>
              <p><Clock size={14} strokeWidth={1.5} aria-hidden="true" /> Retry items come from the latest scored outcome on the record.</p>
              <p>Retention items appear only after a demonstration is more than seven days old.</p>
              <p><ShieldCheck size={14} strokeWidth={1.5} aria-hidden="true" /> Safety items are records the package itself flagged for human review.</p>
            </div>
            <p className="empty" style={{ marginTop: 10 }}>Reading an item never clears it. Recording an outcome does.</p>
          </section>
          <section className="panel">
            <span className="label">Store</span>
            <dl className="kv" style={{ marginTop: 10 }}>
              <dt>Records</dt><dd className="num">{Object.keys(state.nodes).length.toLocaleString()}</dd>
              <dt>Links</dt><dd className="num">{Object.keys(state.edges).length.toLocaleString()}</dd>
              <dt>Evidence</dt><dd className="num">{Object.keys(state.evidence).length.toLocaleString()}</dd>
              <dt>Receipts</dt><dd className="num">{Object.keys(state.receipts).length.toLocaleString()}</dd>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
