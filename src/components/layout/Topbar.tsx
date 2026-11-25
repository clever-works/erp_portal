"use client";

import { useState, type MouseEvent } from "react";
import { ChevronRight, Menu, Moon, Sun } from "lucide-react";
import type { DemoUser, InboxNotice, NavItem } from "@/lib/types";
import NotificationsMenu from "./NotificationsMenu";
import ProfileMenu from "./ProfileMenu";

type TopbarProps = {
  title: string;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  navItems: NavItem[];
  onNavigate: (page: string) => void;
  notices: InboxNotice[];
  onMarkAllRead: () => void;
  onOpenNotice: (notice: InboxNotice) => void;
  dark: boolean;
  onToggleTheme: () => void;
  user: DemoUser;
  onViewProfile: (trigger: HTMLElement) => void;
  onOpenSettings?: () => void;
  onResetData?: () => void;
  onSignOut: () => void;
};

/** Sticky top bar: breadcrumb, notifications, theme toggle and account menu. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- navItems/onNavigate are kept for the QuickSearch comeback
export default function Topbar({ title, menuOpen, onToggleMenu, onCloseMenu, navItems, onNavigate, notices, onMarkAllRead, onOpenNotice, dark, onToggleTheme, user, onViewProfile, onOpenSettings, onResetData, onSignOut }: TopbarProps) {
  const [openPanel, setOpenPanel] = useState<"notifications" | "profile" | null>(null);
  const toggle = (panel: "notifications" | "profile") => setOpenPanel(openPanel === panel ? null : panel);
  const close = () => setOpenPanel(null);

  return <header className="topbar">
    <button className="mobilemenu" onClick={onToggleMenu} onKeyDown={(event) => { if (event.key === "Escape") onCloseMenu(); }} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen}><Menu size={20} aria-hidden="true" /></button>
    <div className="crumb"><span>Workspace</span><ChevronRight size={14} aria-hidden="true" /><b>{title}</b></div>
    <div className="topbar-spacer" aria-hidden="true" />
    {/* Module search (QuickSearch.tsx, Ctrl+K) is switched off for now; render <QuickSearch items={navItems} onNavigate={onNavigate} /> here to bring it back. */}
    <NotificationsMenu notices={notices} open={openPanel === "notifications"} onToggle={() => toggle("notifications")} onClose={close} onMarkAllRead={onMarkAllRead} onOpenNotice={(notice) => { close(); onOpenNotice(notice); }} />
    <button className="topaction" aria-label={dark ? "Use light theme" : "Use dark theme"} aria-pressed={dark} title="Toggle theme" onClick={onToggleTheme}>{dark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}</button>
    <ProfileMenu user={user} open={openPanel === "profile"} onToggle={() => toggle("profile")} onClose={close}
      onViewProfile={(event: MouseEvent<HTMLButtonElement>) => { onViewProfile(event.currentTarget); close(); }}
      onOpenSettings={onOpenSettings && (() => { close(); onOpenSettings(); })}
      onResetData={onResetData && (() => { close(); onResetData(); })}
      onSignOut={onSignOut} />
  </header>;
}
