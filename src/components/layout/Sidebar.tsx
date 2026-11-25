import { LogOut } from "lucide-react";
import type { DemoUser, NavGroup } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import Brand from "./Brand";
import NavGroups, { type NavBadges } from "./NavGroups";

/** Fixed desktop sidebar: logo, grouped navigation and the signed-in user. */
export default function Sidebar({ groups, page, onNavigate, badges, user, onSignOut }: { groups: NavGroup[]; page: string; onNavigate: (page: string) => void; badges: NavBadges; user: DemoUser; onSignOut: () => void }) {
  return <aside className="sidebar">
    <Brand />
    <nav className="nav" aria-label="Workspace navigation"><NavGroups groups={groups} page={page} onNavigate={onNavigate} badges={badges} /></nav>
    <div className="sidebarbottom">
      <div className="sidebar-user">
        <Avatar initials={user.initials} />
        <div className="sidebar-user-copy"><strong>{user.name}</strong><small>{user.jobTitle}</small></div>
        <button className="signout" aria-label="Sign out" title="Sign out" onClick={onSignOut}><LogOut size={16} aria-hidden="true" /></button>
      </div>
    </div>
  </aside>;
}
