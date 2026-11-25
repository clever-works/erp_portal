import type { ReactNode } from "react";
import { ArrowUpRight, type LucideIcon } from "lucide-react";

export type StatTone = "indigo" | "sky" | "amber" | "emerald" | "violet";

/** KPI tile: label, big value, optional icon, trend chip and hint. */
export default function StatCard({ label, value, icon: Icon, tone = "indigo", change, hint, className = "", chart }: { label: string; value: string; icon?: LucideIcon; tone?: StatTone; change?: string; hint?: string; className?: string; chart?: ReactNode }) {
  const figure = <>
    <div className="statvalue">{value}</div>
    <div className="trend">
      {change && <span className="trend-chip"><ArrowUpRight size={12} aria-hidden="true" />{change}</span>}
      {hint && <span>{hint}</span>}
    </div>
  </>;
  return <article className={`card stat${chart ? " with-chart" : ""}${className ? ` ${className}` : ""}`}>
    <div className="stathead"><span>{label}</span>{Icon && !chart && <span className={`staticon ${tone}`} aria-hidden="true"><Icon size={18} /></span>}</div>
    {chart ? <div className="stat-body"><div>{figure}</div>{chart}</div> : figure}
  </article>;
}

/** Grid wrapper for a row of stat cards. */
export function StatGrid({ children, compact = false }: { children: ReactNode; compact?: boolean }) {
  return <section className={`stats${compact ? " employee-stats" : ""}`}>{children}</section>;
}
