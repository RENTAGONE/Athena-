import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { ApertureMark } from "./ApertureMark.tsx";

/**
 * Opening sequence. It is presentation only: the store is already open when this renders, no data
 * depends on it, and any click or Escape skips it. Reduced motion and the boot preference remove it.
 */
export function Boot({ onDone }: { onDone: () => void }): ReactNode {
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    const a = window.setTimeout(() => setLeaving(true), 1150);
    const b = window.setTimeout(onDone, 1500);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [onDone]);
  return (
    <div className={`boot${leaving ? " leaving" : ""}`} role="presentation" onClick={onDone} onKeyDown={onDone}>
      <div className="boot-inner">
        <div className="boot-mark">
          <ApertureMark variant="primary" size={116} />
        </div>
        <span className="boot-word">ATHENA</span>
        <span className="boot-tag">Know · Learn · Achieve</span>
        <div className="boot-lines">
          <span style={{ animationDelay: "80ms" }}>Local store open</span>
          <span style={{ animationDelay: "260ms" }}>Reading the knowledge base</span>
          <span style={{ animationDelay: "440ms" }}>Framing the atlas</span>
        </div>
      </div>
      <span className="boot-skip">click to skip</span>
    </div>
  );
}
