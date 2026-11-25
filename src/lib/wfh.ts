import type { WfhRequest } from "./types";
import { isWorkday } from "./attendance";
import { localDateKey } from "./utils";

const toDate = (key: string) => new Date(`${key}T00:00:00`);

/** Workdays (Sun–Thu) between two yyyy-mm-dd dates, inclusive. */
export function workdaysIn(start: string, end: string): string[] {
  const days: string[] = [];
  for (let d = toDate(start); d <= toDate(end); d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)) if (isWorkday(d)) days.push(localDateKey(d));
  return days;
}

/** "Nov 26, 2026" or "Nov 26 – 27, 2026" or "Nov 30 – Dec 2, 2026". */
export function formatRange(start: string, end: string) {
  const a = toDate(start); const b = toDate(end);
  const md = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  if (start === end) return `${md(a)}, ${a.getFullYear()}`;
  if (a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()) return `${md(a)} – ${b.getDate()}, ${b.getFullYear()}`;
  return `${md(a)} – ${md(b)}, ${b.getFullYear()}`;
}

/** Approved WFH days per employee, used to mark those days as Remote in attendance. */
export function remoteOverrides(requests: WfhRequest[]): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const r of requests) if (r.status === "Approved") out[r.employeeId] = [...(out[r.employeeId] ?? []), ...workdaysIn(r.start, r.end)];
  return out;
}
