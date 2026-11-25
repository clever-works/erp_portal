import type { ReactNode } from "react";
import LiveClock from "./LiveClock";

/** Gradient hero tile at the top of a bento dashboard: greeting, date, live clock and actions. */
export default function HeroTile({ eyebrow, title, subtitle, actions, className = "" }: { eyebrow: string; title: string; subtitle: ReactNode; actions?: ReactNode; className?: string }) {
  return <section className={`card hero-tile ${className}`}>
    <div className="hero-top">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 tabIndex={-1}>{title}</h1>
        <p className="hero-sub">{subtitle}</p>
      </div>
      <LiveClock />
    </div>
    {actions && <div className="hero-actions">{actions}</div>}
  </section>;
}
