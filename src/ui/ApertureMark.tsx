import type { ReactNode } from "react";

export type ApertureVariant = "primary" | "compact" | "monochrome" | "app-icon" | "small";

interface MarkProps {
  variant?: ApertureVariant;
  size?: number;
  className?: string;
  title?: string;
}

/** Geometry shared by every variant: geometric capital A, one restrained orbital arc, 4-point aperture star. */
function glyph(strokeWidth: number, starFill: boolean): ReactNode {
  return (
    <>
      <path d="M32 12.5 16 51.5M32 12.5 48 51.5M22.6 39.2h18.8" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" strokeLinejoin="miter" />
      <path d="M7.5 41.5A31 13.5 -22 0 1 56.5 29.5" fill="none" stroke="currentColor" strokeWidth={strokeWidth * 0.62} strokeLinecap="round" opacity="0.85" />
      <path d="M32 23.4 34.1 29.9 40.6 32 34.1 34.1 32 40.6 29.9 34.1 23.4 32 29.9 29.9Z" fill={starFill ? "currentColor" : "none"} stroke="currentColor" strokeWidth={starFill ? 0.6 : 1.2} strokeLinejoin="miter" />
    </>
  );
}

function Symbol({ size, monochrome, appIcon, small }: { size: number; monochrome: boolean; appIcon: boolean; small: boolean }): ReactNode {
  if (small) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" role="img" aria-label="ATHENA" fill="none">
        <path d="M12 4 4.4 20M12 4l7.6 16M7.4 14.6h9.2" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
        <path d="M1.8 16.2A11 5 -20 0 1 22.2 11.4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.85" />
        <circle cx="12" cy="12.4" r="1.9" fill="currentColor" />
      </svg>
    );
  }
  const stroke = monochrome ? 2.4 : 2.6;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="ATHENA" fill="none">
      {appIcon && <rect x="0" y="0" width="64" height="64" fill="#070B18" />}
      {monochrome ? (
        <g color="currentColor">{glyph(stroke, true)}</g>
      ) : (
        <g color="var(--atlas-cyan, #35d9ff)">{glyph(stroke, true)}</g>
      )}
    </svg>
  );
}

/**
 * Aperture brand mark.
 * primary    symbol + separate ATHENA wordmark
 * compact    symbol only
 * monochrome inherits currentColor
 * app-icon   mark centred in a #070B18 square (matches public/icon.svg)
 * small      simplified 24x24 silhouette for tight chrome
 */
export function ApertureMark({ variant = "primary", size = 44, className, title }: MarkProps): ReactNode {
  const monochrome = variant === "monochrome";
  const appIcon = variant === "app-icon";
  const small = variant === "small";
  const px = small ? Math.min(size, 28) : appIcon ? Math.max(size, 48) : size;
  const mark = (
    <span className={`mark-symbol${monochrome ? " mark-mono" : ""}`} style={monochrome ? { color: "inherit" } : undefined}>
      <Symbol size={px} monochrome={monochrome} appIcon={appIcon} small={small} />
    </span>
  );
  if (variant === "compact" || variant === "monochrome" || variant === "small") {
    return (
      <span className={className ? `mark ${className}` : "mark"} title={title} data-variant={variant}>
        {mark}
      </span>
    );
  }
  if (appIcon) {
    return (
      <span className={className ? `mark mark-appicon ${className}` : "mark mark-appicon"} title={title} data-variant="app-icon">
        {mark}
      </span>
    );
  }
  return (
    <span className={className ? `mark mark-primary ${className}` : "mark mark-primary"} title={title} data-variant="primary">
      {mark}
      <span className="mark-word">
        <span className="mark-name">ATHENA</span>
        <span className="mark-tagline">Know · Learn · Achieve</span>
      </span>
    </span>
  );
}
