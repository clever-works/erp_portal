import type { Audience, InboxNotice } from "./types";

/** Older saved notices have no audience: keep their previous behaviour. */
export function noticeAudience(notice: InboxNotice): Audience {
  if (notice.audience) return notice.audience;
  return ["Projects", "Announcements"].includes(notice.page) ? "everyone" : "admin";
}

/** Whether an announcement (or department-targeted item) reaches someone in this department. */
export function reaches(audience: Audience, department: string) {
  return audience === "everyone" || (Array.isArray(audience) && audience.includes(department));
}

/**
 * Whether a notice belongs in this user's bell.
 * Admins see admin and company-wide notices, but not copies of announcements they sent themselves.
 */
export function noticeVisibleTo(notice: InboxNotice, role: "admin" | "employee", department: string, employeeId?: string) {
  if (notice.employeeId) return role === "employee" && notice.employeeId === employeeId;
  const audience = noticeAudience(notice);
  if (role === "admin") return !notice.fromAnnouncement && (audience === "admin" || audience === "everyone");
  return audience !== "admin" && reaches(audience, department);
}

export function audienceLabel(audience: Audience) {
  if (audience === "everyone") return "Everyone";
  if (audience === "admin") return "Admins";
  return audience.join(", ");
}

/** "Just now", "5 min ago", "3 hours ago", "Yesterday", or a date. */
export function timeAgo(iso: string, now = Date.now()) {
  const minutes = Math.round((now - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  if (hours < 48) return "Yesterday";
  return new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}
