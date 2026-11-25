"use client";

import { useState, type FormEvent } from "react";
import { CalendarDays } from "lucide-react";
import type { PersonalLeave } from "@/lib/types";
import { localDateKey } from "@/lib/utils";
import { formatRange, workdaysIn } from "@/lib/wfh";
import Badge from "@/components/ui/Badge";
import { Card, PanelHeader } from "@/components/ui/Card";
import ListRow from "@/components/ui/ListRow";
import DateRangeCalendar from "@/components/ui/DateRangeCalendar";

const SICK = "Sick leave";
const KINDS = ["Annual leave", SICK, "Personal day"];

/**
 * Employee self-service: request time off on a calendar that shows Saudi weekends (Fri, Sat),
 * then browse the request history with filters.
 * Rules: only sick leave may be for past dates (marked "Late submission"); requests must include
 * at least one business day and may not overlap an open request.
 */
export default function EmployeeLeavePanel({ leaves, onSubmit }: { leaves: PersonalLeave[]; onSubmit: (request: PersonalLeave) => void }) {
  const today = localDateKey(new Date());
  const [kind, setKind] = useState("Annual leave");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [reason, setReason] = useState("");
  const [dateError, setDateError] = useState("");

  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [typeFilter, setTypeFilter] = useState("All types");
  const [yearFilter, setYearFilter] = useState("All years");

  const sick = kind === SICK;
  const until = end || start;
  const days = start ? workdaysIn(start, until).length : 0;
  const late = sick && !!start && start < today;
  // Business days already covered by an open request (shown on the calendar).
  const blocked = leaves.filter((l) => l.status !== "Rejected" && l.start && l.end).flatMap((l) => workdaysIn(l.start!, l.end!));

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!start) { setDateError("Pick your first day off on the calendar."); return; }
    if (!sick && start < today) { setDateError("Annual leave and personal days must start today or later. Only sick leave can be for past dates."); return; }
    if (days === 0) { setDateError("Those dates fall on a weekend (Friday or Saturday)."); return; }
    if (leaves.some((l) => l.status !== "Rejected" && l.start && l.end && l.start <= until && l.end >= start)) { setDateError("You already have a leave request covering some of these days."); return; }
    if (reason.trim().length < 3) { setDateError("Add a short reason so your manager knows why."); return; }
    setDateError("");
    onSubmit({ kind, dates: formatRange(start, until), start, end: until, status: "Pending", late, reason: reason.trim() });
    setStart(""); setEnd(""); setReason("");
  };

  const years = [...new Set(leaves.map((l) => l.start?.slice(0, 4)).filter(Boolean) as string[])].sort().reverse();
  const shown = leaves.filter((l) => (statusFilter === "All statuses" || l.status === statusFilter)
    && (typeFilter === "All types" || l.kind === typeFilter)
    && (yearFilter === "All years" || l.start?.startsWith(yearFilter)))
    .sort((a, b) => (b.start ?? "").localeCompare(a.start ?? ""));

  return <>
    <Card>
      <PanelHeader title="Request time off" subtitle="Pick your days on the calendar. Weekends (Friday and Saturday) aren't counted." />
      <form className="leave-request-form calendar-layout" onSubmit={submit} noValidate>
        <div className="leave-form-fields">
          <label>Leave type<select value={kind} onChange={(event) => { setKind(event.target.value); setDateError(""); if (event.target.value !== SICK && start && start < today) { setStart(""); setEnd(""); } }}>{KINDS.map((k) => <option key={k}>{k}</option>)}</select></label>
          <div className="picked-range">
            <span>Selected</span>
            <strong>{start ? formatRange(start, until) : "No days picked yet"}</strong>
            <small>{start ? `${days} business day${days === 1 ? "" : "s"} (Sun–Thu)` : "Click a start day, then an end day"}</small>
            {late && <span className="late-tag">Late submission</span>}
          </div>
          <label className="leave-reason">Reason<textarea rows={3} maxLength={300} placeholder="e.g. Family wedding in Jeddah" value={reason} onChange={(event) => { setReason(event.target.value); setDateError(""); }} /></label>
          <p className="form-hint">{sick ? "Sick leave can be for past days if you couldn't request it in time; it will be flagged for your manager." : "Annual leave and personal days must start today or later."}</p>
          {dateError && <p id="leave-date-error" className="auth-error" role="alert">{dateError}</p>}
          <button className="primary" type="submit">Submit request</button>
        </div>
        <DateRangeCalendar start={start} end={end} minDate={sick ? undefined : today} blocked={blocked}
          onChange={(s, e) => { setStart(s); setEnd(e); setDateError(""); }} />
      </form>
    </Card>
    <Card className="employee-leave-history">
      <PanelHeader title="My leave history" subtitle="Every request you've made, newest first, with its status"
        action={<div className="panel-tools">
          <select className="filterselect" aria-label="Filter by status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option>All statuses</option><option>Pending</option><option>Approved</option><option>Rejected</option></select>
          <select className="filterselect" aria-label="Filter by leave type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}><option>All types</option>{KINDS.map((k) => <option key={k}>{k}</option>)}</select>
          <select className="filterselect" aria-label="Filter by year" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}><option>All years</option>{years.map((y) => <option key={y}>{y}</option>)}</select>
        </div>} />
      <div className="leave-summary">{(["Pending", "Approved", "Rejected"] as const).map((s) => <span key={s}><b>{shown.filter((l) => l.status === s).length}</b> {s.toLowerCase()}</span>)}</div>
      {shown.length === 0 && <div className="emptystate">{leaves.length ? "No requests match these filters." : "You haven't requested any leave yet."}</div>}
      <div className="list">{shown.map((leave, index) => <ListRow key={leave.id ?? `${leave.kind}-${leave.dates}-${index}`} leading={<span className="staticon sky small"><CalendarDays size={15} /></span>} title={leave.kind} subtitle={leave.reason ? `${leave.dates} · ${leave.reason}` : leave.dates}>
        {leave.late && <span className="late-tag">Late submission</span>}<Badge value={leave.status} />
      </ListRow>)}</div>
    </Card>
  </>;
}
