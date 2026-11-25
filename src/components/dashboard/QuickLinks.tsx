import { ArrowUpRight } from "lucide-react";
import { nav } from "@/lib/data";
import type { NavItem } from "@/lib/types";
import { Card, PanelHeader } from "@/components/ui/Card";

/** Grid of module shortcuts for the dashboard. */
export default function QuickLinks({ labels, onNavigate, className = "" }: { labels: string[]; onNavigate: (page: string) => void; className?: string }) {
  const items = labels.map((label) => nav.find((item) => item.label === label)).filter((item): item is NavItem => !!item);
  return <Card className={`quicklinks-tile ${className}`}>
    <PanelHeader title="Jump to" subtitle="Your most used modules" />
    <div className="quicklinks">{items.map(({ label, icon: Icon }) => <button key={label} onClick={() => onNavigate(label)}>
      <span className="ql-icon"><Icon size={18} aria-hidden="true" /></span>
      <span className="ql-label">{label === "Leave management" ? "Leave" : label === "My salary" ? "Salary" : label}</span>
      <ArrowUpRight size={14} className="ql-go" aria-hidden="true" />
    </button>)}</div>
  </Card>;
}
