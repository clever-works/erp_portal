import { MoreHorizontal } from "lucide-react";
import type { NavGroup, NavItem } from "@/lib/types";
import NavGroups, { type NavBadges } from "./NavGroups";

/** Bottom tab bar shown on phones, with a "More" button for the drawer. */
export function MobileTabBar({ labels, items, page, onNavigate, menuOpen, onToggleMenu }: { labels: string[]; items: NavItem[]; page: string; onNavigate: (page: string) => void; menuOpen: boolean; onToggleMenu: () => void }) {
  return <nav className="mobile-nav" aria-label="Mobile shortcuts">
    {labels.map((label) => {
      const item = items.find((entry) => entry.label === label);
      if (!item) return null;
      const Icon = item.icon;
      return <button key={label} className={page === label ? "active" : ""} aria-current={page === label ? "page" : undefined} onClick={() => onNavigate(label)}><Icon size={19} /><span>{label === "Leave management" ? "Leave" : label === "My salary" ? "Salary" : label}</span></button>;
    })}
    <button className={menuOpen ? "active" : ""} aria-expanded={menuOpen} onClick={onToggleMenu}><MoreHorizontal size={19} /><span>More</span></button>
  </nav>;
}

/** Slide-out navigation drawer for phones. */
export function MobileDrawer({ groups, page, onNavigate, badges, onClose }: { groups: NavGroup[]; page: string; onNavigate: (page: string) => void; badges: NavBadges; onClose: () => void }) {
  return <>
    <button className="mobile-backdrop" aria-label="Close navigation" onClick={onClose} />
    <nav className="mobile-drawer" id="mobile-navigation" aria-label="Mobile workspace navigation" onKeyDown={(event) => { if (event.key === "Escape") onClose(); }}>
      <NavGroups groups={groups} page={page} onNavigate={onNavigate} badges={badges} />
    </nav>
  </>;
}
