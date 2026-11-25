"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import type { Employee } from "@/lib/types";
import { formatClock, formatHours, periodOptions, recordsBetween, summarize, type LiveAttendance, type PeriodKind } from "@/lib/attendance";
import { downloadCsv } from "@/lib/utils";
import { Card, PanelHeader } from "@/components/ui/Card";
import AttendanceTable from "./AttendanceTable";

/**
 * Attendance history with filters: employee (admins only), period type (week / month / year)
 * and which week, month or year. Shows a summary and the matching records.
 */
export default function AttendanceHistory({ employees, showEmployeeFilter = true, live, title = "Attendance history" }: { employees: Employee[]; showEmployeeFilter?: boolean; live?: LiveAttendance; title?: string }) {
  const [person, setPerson] = useState("all");
  const [kind, setKind] = useState<PeriodKind>("month");
  const options = useMemo(() => periodOptions(kind), [kind]);
  const [periodValue, setPeriodValue] = useState(options[0].value);
  const period = options.find((option) => option.value === periodValue) ?? options[0];

  const people = useMemo(() => (person === "all" ? employees : employees.filter((e) => e.id === person)), [employees, person]);
  const records = useMemo(() => recordsBetween(people, period.start, period.end, live), [people, period, live]);
  const sum = summarize(records);

  const changeKind = (next: PeriodKind) => { setKind(next); setPeriodValue(periodOptions(next)[0].value); };
  const exportCsv = () => downloadCsv(`attendance-${period.value}${person === "all" ? "" : `-${people[0]?.name.toLowerCase()}`}.csv`,
    ["Date", "Employee", "Status", "Check in", "Check out", "Hours"],
    records.map((r) => [r.date, r.name, r.status, formatClock(r.checkIn), r.live ? "Working" : formatClock(r.checkOut), formatHours(r.minutes)]));

  return <Card flush>
    <PanelHeader padded title={title} subtitle={`${period.label}${person === "all" || !showEmployeeFilter ? "" : ` · ${people[0]?.name}`}`}
      action={<button className="outline" onClick={exportCsv}><Download size={15} /> Export</button>} />
    <div className="history-filters">
      {showEmployeeFilter && <label className="filter-field"><span>Employee</span>
        <select className="filterselect" value={person} onChange={(event) => setPerson(event.target.value)}><option value="all">All employees</option>{employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
      </label>}
      <div className="filter-field"><span>View by</span>
        <div className="role-switch period-switch" role="group" aria-label="Period type">{(["week", "month", "year"] as PeriodKind[]).map((value) => <button key={value} type="button" className={kind === value ? "active" : ""} aria-pressed={kind === value} onClick={() => changeKind(value)}>{value[0].toUpperCase() + value.slice(1)}</button>)}</div>
      </div>
      <label className="filter-field"><span>{kind === "week" ? "Week" : kind === "month" ? "Month" : "Year"}</span>
        <select className="filterselect" value={period.value} onChange={(event) => setPeriodValue(event.target.value)}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
      </label>
    </div>
    <div className="history-summary">
      <div><span>Office days</span><strong>{sum.office}</strong></div>
      <div><span>Remote days</span><strong>{sum.remote}</strong></div>
      <div><span>Leave days</span><strong>{sum.leave}</strong></div>
      <div><span>Total hours</span><strong>{formatHours(sum.totalMinutes)}</strong></div>
      <div><span>Average per day</span><strong>{formatHours(sum.averageMinutes)}</strong></div>
    </div>
    <AttendanceTable key={`${person}-${period.value}`} records={records} showEmployee={showEmployeeFilter && person === "all"} />
  </Card>;
}
