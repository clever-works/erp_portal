import type { Employee, EmployeeAttendance } from "./types";
import { localDateKey } from "./utils";

/** Only three attendance statuses are used across the portal. */
export type AttendanceStatus = "Office" | "Remote" | "Leave";
export type AttendanceRecord = {
  date: string;            // yyyy-mm-dd
  employeeId: string;
  name: string;
  status: AttendanceStatus;
  checkIn: number | null;  // minutes after midnight
  checkOut: number | null;
  minutes: number;         // worked minutes (0 on leave / not checked in)
  live?: boolean;          // checked in, not yet out
};

/** Saudi work week: Sunday to Thursday (Friday and Saturday off). */
export const isWorkday = (date: Date) => date.getDay() !== 5 && date.getDay() !== 6;

const pad = (n: number) => String(n).padStart(2, "0");
export const formatClock = (minutes: number | null) => {
  if (minutes === null) return "—";
  const h = Math.floor(minutes / 60) % 24; const m = minutes % 60;
  return `${pad(((h + 11) % 12) + 1)}:${pad(m)} ${h >= 12 ? "PM" : "AM"}`;
};
export const formatHours = (minutes: number) => (minutes > 0 ? `${Math.floor(minutes / 60)}h ${pad(minutes % 60)}m` : "—");
export const formatDay = (key: string) => new Date(`${key}T00:00:00`).toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

/** Small deterministic hash so the demo history is the same on every visit. */
function seeded(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) / 4294967295;
}

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const minutesNow = (now: Date) => now.getHours() * 60 + now.getMinutes();

/** Demo record for one employee on one workday. */
function demoRecord(employee: Employee, date: Date, now: Date): AttendanceRecord {
  const key = localDateKey(date);
  const base = { date: key, employeeId: employee.id, name: employee.name };
  const daysAgo = Math.round((startOfDay(now).getTime() - startOfDay(date).getTime()) / 86400000);
  const onLeave = (employee.status === "On leave" && daysAgo < 8) || seeded(`${employee.id}${key}leave`) < 0.06;
  if (onLeave) return { ...base, status: "Leave", checkIn: null, checkOut: null, minutes: 0 };

  const flip = seeded(`${key}${employee.id}mode`);
  const status: AttendanceStatus = employee.workMode === "Remote" ? (flip < 0.15 ? "Office" : "Remote") : (flip < 0.12 ? "Remote" : "Office");
  const checkIn = 7 * 60 + 30 + Math.floor(seeded(`${key}${employee.id}in`) * 105);           // 7:30 – 9:15
  const checkOut = checkIn + 465 + Math.floor(seeded(`${key}${employee.id}out`) * 90);        // 7h45 – 9h15 later

  if (daysAgo === 0) {
    const nowMin = minutesNow(now);
    if (nowMin < checkIn) return { ...base, status, checkIn: null, checkOut: null, minutes: 0 };
    if (nowMin < checkOut) return { ...base, status, checkIn, checkOut: null, minutes: nowMin - checkIn, live: true };
  }
  return { ...base, status, checkIn, checkOut, minutes: checkOut - checkIn };
}

/** The signed-in employee's real check-in/out replaces the demo record for today. */
function liveRecord(employee: Employee, attendance: EmployeeAttendance | null, now: Date): AttendanceRecord {
  const base = { date: localDateKey(now), employeeId: employee.id, name: employee.name, status: employee.workMode as AttendanceStatus };
  if (!attendance) return { ...base, checkIn: null, checkOut: null, minutes: 0 };
  const toMin = (iso: string) => { const d = new Date(iso); return d.getHours() * 60 + d.getMinutes(); };
  const checkIn = toMin(attendance.checkInAt);
  const checkOut = attendance.checkOutAt ? toMin(attendance.checkOutAt) : null;
  return { ...base, checkIn, checkOut, minutes: Math.max(0, (checkOut ?? minutesNow(now)) - checkIn), live: !checkOut };
}

export type LiveAttendance = { employeeId: string; attendance: EmployeeAttendance | null };
/** employeeId → yyyy-mm-dd days with approved work-from-home (shown as Remote). */
export type RemoteDays = Record<string, string[]>;

/** All records between two dates (inclusive), newest first. Future days are never included. */
export function recordsBetween(employees: Employee[], start: Date, end: Date, live?: LiveAttendance, now = new Date(), remote: RemoteDays = currentRemoteDays): AttendanceRecord[] {
  const out: AttendanceRecord[] = [];
  const last = startOfDay(end > now ? now : end);
  for (let day = last; day >= startOfDay(start); day = new Date(day.getFullYear(), day.getMonth(), day.getDate() - 1)) {
    if (!isWorkday(day)) continue;
    const isToday = localDateKey(day) === localDateKey(now);
    for (const employee of employees) {
      const record = isToday && live && live.employeeId === employee.id ? liveRecord(employee, live.attendance, now) : demoRecord(employee, day, now);
      if (record.status !== "Leave" && remote[employee.id]?.includes(record.date)) record.status = "Remote";
      // Today only counts once someone has checked in (or is on leave).
      if (isToday && record.status !== "Leave" && record.checkIn === null) continue;
      out.push(record);
    }
  }
  return out;
}

/*
 * Approved WFH days, set once by the app shell whenever requests change.
 * (A module-level value keeps every attendance table in sync without threading a prop through each one.)
 */
let currentRemoteDays: RemoteDays = {};
export function setRemoteDays(days: RemoteDays) { currentRemoteDays = days; }

export type PeriodKind = "week" | "month" | "year";
export type Period = { value: string; label: string; start: Date; end: Date };

/** Selectable periods, newest first: 12 weeks, 12 months or 3 years. */
export function periodOptions(kind: PeriodKind, now = new Date()): Period[] {
  const today = startOfDay(now);
  if (kind === "week") {
    const sunday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    return Array.from({ length: 12 }, (_, i) => {
      const start = new Date(sunday.getFullYear(), sunday.getMonth(), sunday.getDate() - i * 7);
      const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
      const short = (d: Date) => d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
      return { value: localDateKey(start), label: i === 0 ? `This week (${short(start)} – ${short(end)})` : i === 1 ? `Last week (${short(start)} – ${short(end)})` : `${short(start)} – ${short(end)}, ${end.getFullYear()}`, start, end };
    });
  }
  if (kind === "month") {
    return Array.from({ length: 12 }, (_, i) => {
      const start = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
      return { value: localDateKey(start), label: start.toLocaleDateString("en-US", { month: "long", year: "numeric" }) + (i === 0 ? " (this month)" : ""), start, end };
    });
  }
  return Array.from({ length: 3 }, (_, i) => {
    const year = today.getFullYear() - i;
    return { value: String(year), label: `${year}${i === 0 ? " (this year)" : ""}`, start: new Date(year, 0, 1), end: new Date(year, 11, 31) };
  });
}

/** The current Sunday–Saturday week. */
export function thisWeek(now = new Date()) { return periodOptions("week", now)[0]; }

export function summarize(records: AttendanceRecord[]) {
  const count = (status: AttendanceStatus) => records.filter((r) => r.status === status).length;
  const worked = records.filter((r) => r.minutes > 0);
  const total = worked.reduce((sum, r) => sum + r.minutes, 0);
  return { office: count("Office"), remote: count("Remote"), leave: count("Leave"), totalMinutes: total, averageMinutes: worked.length ? Math.round(total / worked.length) : 0 };
}
