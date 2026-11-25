import type { KeyboardEvent } from "react";
import { legacyTints, pageDescriptions } from "./data";

/* Dates and times */
export function todayLabel() { return new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }); }
export function shortToday() { return new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" }); }
export function greeting() { const hour = new Date().getHours(); return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"; }
export function localDateKey(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
export function formatAttendanceTime(value: string) { return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }

/* Display */
export function tint(color: string) { return legacyTints[color.toLowerCase()] ?? color; }
/** Two-letter initials: first letters of two words, or the first two letters of a single name. */
export function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0]?.slice(0, 2) ?? "").toUpperCase();
}

/** Renames people saved under earlier demo names (keeps everything else the user changed). */
export function migratePerson<T extends { name: string; initials: string; email?: string }>(person: T, legacy: Record<string, { name: string; email: string; initials: string }>): T {
  const next = legacy[person.name];
  if (!next) return person;
  return { ...person, name: next.name, initials: next.initials, ...(person.email !== undefined ? { email: next.email } : {}) };
}
export function pageDescription(page: string) { return pageDescriptions[page] ?? "Your workspace, all in one place."; }

/* Clipboard and files */
export async function copyValue(value: string) {
  try { await navigator.clipboard.writeText(value); } catch {
    const input = document.createElement("textarea");
    input.value = value; input.style.position = "fixed"; input.style.opacity = "0";
    document.body.appendChild(input); input.select(); document.execCommand("copy"); input.remove();
  }
}

export function downloadCsv(filename: string, columns: string[], rows: string[][]) {
  const quote = (value: string) => `"${value.replaceAll('"', '""')}"`;
  const csv = [columns, ...rows].map((row) => row.map(quote).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const anchor = document.createElement("a");
  anchor.href = url; anchor.download = filename; anchor.click();
  URL.revokeObjectURL(url);
}

/** Lower-case, dash-separated piece for a file name ("Human Resources" → "human-resources"). */
export function fileSlug(text: string) { return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }

/* Accessibility: Escape closes, Tab stays inside the dialog */
export function handleDialogKeyDown(event: KeyboardEvent<HTMLElement>, close: () => void) {
  if (event.key === "Escape") { event.preventDefault(); close(); return; }
  if (event.key !== "Tab") return;
  const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'));
  if (!controls.length) { event.preventDefault(); return; }
  const first = controls[0]; const last = controls[controls.length - 1];
  if (event.shiftKey && (document.activeElement === first || !event.currentTarget.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && (document.activeElement === last || !event.currentTarget.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
}
