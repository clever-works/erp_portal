import type { KeyboardEvent, MouseEvent } from "react";
import { ChevronDown, LogOut, RotateCcw, Settings, Users } from "lucide-react";
import type { DemoUser } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";

/** Avatar button in the top bar with the account dropdown. */
export default function ProfileMenu({ user, open, onToggle, onClose, onViewProfile, onOpenSettings, onResetData, onSignOut }: { user: DemoUser; open: boolean; onToggle: () => void; onClose: () => void; onViewProfile: (event: MouseEvent<HTMLButtonElement>) => void; onOpenSettings?: () => void; onResetData?: () => void; onSignOut: () => void }) {
  const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
  return <div className="panel-anchor profile-anchor">
    <button className="topavatar" aria-label={`Open ${user.name} profile`} aria-expanded={open} onKeyDown={closeOnEscape} onClick={onToggle}>
      <Avatar initials={user.initials} />
      <span className="topavatar-copy"><strong>{user.name}</strong><small>{user.jobTitle}</small></span>
      <ChevronDown size={14} aria-hidden="true" />
    </button>
    {open && <section id="profile-menu" className="dropdown-panel profile-panel" aria-label="User profile menu" onKeyDown={closeOnEscape}>
      <div className="profile-summary"><Avatar initials={user.initials} /><div><strong>{user.name}</strong><small>{user.email}</small></div></div>
      <button onClick={onViewProfile}><Users size={15} aria-hidden="true" /> View full profile</button>
      {onOpenSettings && <button onClick={onOpenSettings}><Settings size={15} aria-hidden="true" /> Account settings</button>}
      {onResetData && <button onClick={onResetData}><RotateCcw size={15} aria-hidden="true" /> Reset demo data</button>}
      <button className="danger-item" onClick={onSignOut}><LogOut size={15} aria-hidden="true" /> Sign out</button>
    </section>}
  </div>;
}
