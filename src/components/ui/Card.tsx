import type { ReactNode } from "react";

/** White panel with border and shadow. `flush` removes padding (for tables). */
export function Card({ children, flush = false, className = "" }: { children: ReactNode; flush?: boolean; className?: string }) {
  return <section className={`card panel${flush ? " flush" : ""}${className ? ` ${className}` : ""}`}>{children}</section>;
}

/** Title row at the top of a card, with an optional subtitle and action on the right. */
export function PanelHeader({ title, subtitle, action, padded = false, liveSubtitle = false }: { title: string; subtitle?: ReactNode; action?: ReactNode; padded?: boolean; liveSubtitle?: boolean }) {
  return <div className={`paneltitle${padded ? " padded" : ""}`}>
    <div><h2>{title}</h2>{subtitle && <p aria-live={liveSubtitle ? "polite" : undefined}>{subtitle}</p>}</div>
    {action}
  </div>;
}
