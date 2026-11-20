import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

/** Back control for any page reached from another one. Falls back to a parent route on a cold link. */
export function PageBack({ href, label }: { href: string; label: string }): ReactNode {
  return (
    <a
      className="page-back"
      href={href}
      onClick={(e: { preventDefault: () => void }) => {
        if (window.history.length > 1) {
          e.preventDefault();
          window.history.back();
        }
      }}
    >
      <ArrowLeft size={15} strokeWidth={1.6} aria-hidden="true" />
      {label}
    </a>
  );
}
