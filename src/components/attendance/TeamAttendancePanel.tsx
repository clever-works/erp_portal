"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, CalendarDays, Clock3, Laptop } from "lucide-react";
import type { Employee } from "@/lib/types";
import { formatHours, isWorkday, recordsBetween, summarize } from "@/lib/attendance";
import { shortToday, todayLabel } from "@/lib/utils";
import { Card, PanelHeader } from "@/components/ui/Card";
import StatCard, { StatGrid } from "@/components/ui/StatCard";
import AttendanceTable from "./AttendanceTable";
import AttendanceHistory from "./AttendanceHistory";

/** Admin attendance page: today's summary and table, then the filterable history. */
export default function TeamAttendancePanel({ employees }: { employees: Employee[] }) {
  // Refresh "today" every minute so live hours keep moving.
  const [tick, setTick] = useState(0);
  useEffect(() => { const timer = window.setInterval(() => setTick((t) => t + 1), 60000); return () => window.clearInterval(timer); }, []);
  // Show today once anyone has checked in; before that (early morning or a weekend) show the latest workday.
  const view = useMemo(() => {
    void tick;
    const now = new Date();
    const today = recordsBetween(employees, now, now, undefined, now);
    if (today.some((r) => r.checkIn !== null)) return { records: today, title: "Today's attendance", subtitle: todayLabel(), hint: `Today · ${shortToday()}` };
    let day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    while (!isWorkday(day)) day = new Date(day.getFullYear(), day.getMonth(), day.getDate() - 1);
    const label = day.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
    return { records: recordsBetween(employees, day, day, undefined, now), title: "Latest workday", subtitle: `${label} · nobody has checked in yet today`, hint: day.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" }) };
  }, [employees, tick]);
  const sum = summarize(view.records);

  return <>
    <StatGrid>
      <StatCard label="In office" value={String(sum.office)} hint={view.hint} icon={Building2} tone="indigo" />
      <StatCard label="Remote" value={String(sum.remote)} hint={view.hint} icon={Laptop} tone="violet" />
      <StatCard label="On leave" value={String(sum.leave)} hint={view.hint} icon={CalendarDays} tone="amber" />
      <StatCard label="Average hours" value={formatHours(sum.averageMinutes)} hint="Per person working" icon={Clock3} tone="emerald" />
    </StatGrid>
    <Card flush>
      <PanelHeader padded title={view.title} subtitle={view.subtitle} />
      <AttendanceTable records={view.records} showDate={false} />
    </Card>
    <div className="section-gap" />
    <AttendanceHistory employees={employees} />
  </>;
}
