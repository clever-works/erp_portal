"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { localDateKey } from "@/lib/utils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
/** Saudi weekend. */
export const isWeekend = (d: Date) => d.getDay() === 5 || d.getDay() === 6;

/**
 * Month calendar for picking a date range. Business days (Sun–Thu) are clickable;
 * Friday and Saturday are shaded as the weekend. Click a start day, then an end day.
 * `minDate` (yyyy-mm-dd) disables earlier days, e.g. today for annual leave.
 */
export default function DateRangeCalendar({ start, end, onChange, minDate, blocked = [] }: { start: string; end: string; onChange: (start: string, end: string) => void; minDate?: string; blocked?: string[] }) {
  const first = start ? new Date(`${start}T00:00:00`) : new Date();
  const [view, setView] = useState(new Date(first.getFullYear(), first.getMonth(), 1));
  const today = localDateKey(new Date());

  const days: (Date | null)[] = [];
  for (let i = 0; i < view.getDay(); i++) days.push(null);
  const last = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  for (let d = 1; d <= last; d++) days.push(new Date(view.getFullYear(), view.getMonth(), d));

  const pick = (key: string) => {
    if (!start || end) { onChange(key, ""); return; }          // first click, or start over
    if (key < start) { onChange(key, start); return; }           // clicked before the start: swap
    onChange(start, key);
  };

  const move = (n: number) => setView(new Date(view.getFullYear(), view.getMonth() + n, 1));

  return <div className="range-cal">
    <div className="range-cal-head">
      <button type="button" className="iconbtn" aria-label="Previous month" onClick={() => move(-1)}><ChevronLeft size={16} /></button>
      <strong>{view.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</strong>
      <button type="button" className="iconbtn" aria-label="Next month" onClick={() => move(1)}><ChevronRight size={16} /></button>
    </div>
    <div className="range-cal-grid" role="grid">
      {WEEKDAYS.map((w, i) => <span key={w} className={`range-cal-dow${i >= 5 ? " weekend" : ""}`}>{w}</span>)}
      {days.map((d, i) => {
        if (!d) return <span key={`b${i}`} />;
        const key = localDateKey(d);
        const weekend = isWeekend(d);
        const disabled = weekend || (!!minDate && key < minDate) || blocked.includes(key);
        const inRange = start && (end ? key >= start && key <= end : key === start);
        const edge = key === start || key === end;
        return <button type="button" key={key} disabled={disabled} onClick={() => pick(key)}
          className={["range-cal-day", weekend && "weekend", inRange && "in-range", edge && "edge", key === today && "today", blocked.includes(key) && "blocked"].filter(Boolean).join(" ")}
          aria-pressed={!!inRange} aria-label={`${d.toDateString()}${weekend ? ", weekend" : ""}${blocked.includes(key) ? ", already requested" : ""}`}>
          {d.getDate()}
        </button>;
      })}
    </div>
    <div className="range-cal-key">
      <span><i className="k-work" /> Business day</span>
      <span><i className="k-weekend" /> Weekend (Fri, Sat)</span>
      <span><i className="k-picked" /> Selected</span>
      {blocked.length > 0 && <span><i className="k-blocked" /> Already requested</span>}
    </div>
  </div>;
}
