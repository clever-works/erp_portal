import type { KeyboardEvent } from "react";
import { Bell, Megaphone, X } from "lucide-react";
import type { InboxNotice } from "@/lib/types";
import { timeAgo } from "@/lib/audience";

/** Bell button with an unread dot and a dropdown list of notices. */
export default function NotificationsMenu({ notices, open, onToggle, onClose, onMarkAllRead, onOpenNotice }: { notices: InboxNotice[]; open: boolean; onToggle: () => void; onClose: () => void; onMarkAllRead: () => void; onOpenNotice: (notice: InboxNotice) => void }) {
  const unread = notices.filter((item) => !item.read).length;
  const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
  return <div className="panel-anchor">
    <button className="topaction" aria-label={`Notifications, ${unread} unread`} title="Notifications" aria-expanded={open} onKeyDown={closeOnEscape} onClick={onToggle}>
      <Bell size={18} aria-hidden="true" />{unread > 0 && <i className="dot" aria-hidden="true" />}
    </button>
    {open && <section id="notifications-panel" className="dropdown-panel notifications-panel" aria-label="Notifications" onKeyDown={closeOnEscape}>
      <div className="dropdown-head">
        <div><h2>Notifications</h2><small aria-live="polite">{unread} unread</small></div>
        <div className="notification-controls">
          <button className="linkbtn" onClick={onMarkAllRead}>Mark all read</button>
          <button className="iconbtn" aria-label="Close notifications" title="Close notifications" onClick={onClose}><X size={16} aria-hidden="true" /></button>
        </div>
      </div>
      <div className="notice-list">{notices.map((item) => <button key={item.id} className={`notice-item ${item.read ? "read" : "unread"}`} onClick={() => onOpenNotice(item)}>
        <span className="notice-mark" aria-hidden="true" />
        <span className="notice-copy">
          <strong>{item.fromAnnouncement && <Megaphone size={13} className="notice-kind" aria-label="Announcement" />}{item.title}{Array.isArray(item.audience) && <span className="notice-tag">{item.audience.join(", ")}</span>}</strong>
          <small>{item.body}</small>
          <em>{item.createdAt ? timeAgo(item.createdAt) : item.time}</em>
        </span>
      </button>)}</div>
    </section>}
  </div>;
}
