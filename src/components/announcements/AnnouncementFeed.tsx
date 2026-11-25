import { Megaphone, Users } from "lucide-react";
import type { Announcement } from "@/lib/types";
import { audienceLabel, timeAgo } from "@/lib/audience";
import Badge from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

/** List of announcement cards, newest first. Admins also see who each one went to. */
export default function AnnouncementFeed({ announcements, showAudience = false, emptyText = "No announcements yet." }: { announcements: Announcement[]; showAudience?: boolean; emptyText?: string }) {
  const sorted = [...announcements].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  if (!sorted.length) return <Card><div className="emptystate">{emptyText}</div></Card>;
  return <div className="announcement-feed">{sorted.map((item) => <Card key={item.id} className={`announcement-card${item.priority === "Important" ? " important" : ""}`}>
    <div className="announcement-head">
      <span className="announcement-icon"><Megaphone size={17} aria-hidden="true" /></span>
      <div className="announcement-title"><h2>{item.title}</h2><small>{item.author} · {timeAgo(item.publishedAt)}</small></div>
      {item.priority === "Important" && <Badge value="Important" />}
    </div>
    <p>{item.body}</p>
    {showAudience && <div className="announcement-audience"><Users size={14} aria-hidden="true" /> Sent to <b>{audienceLabel(item.audience)}</b></div>}
  </Card>)}</div>;
}
