"use client";

import { useState, type FormEvent } from "react";
import { CalendarDays } from "lucide-react";
import type { PersonalLeave } from "@/lib/types";
import { localDateKey } from "@/lib/utils";
import { formatRange, workdaysIn } from "@/lib/wfh";
import Badge from "@/components/ui/Badge";
import { Card, PanelHeader } from "@/components/ui/Card";
import ListRow from "@/components/ui/ListRow";

const SICK = "Sick leave";

/**
 * Employee self-service: request time off and see request history.
 * Rules: only sick leave may be for past dates (it is then marked "Late submission");
 * requests must include at least one workday and may not overlap an open request.
 */
export default function EmployeeLeavePanel({ leaves, onSubmit }: { leaves: PersonalLeave[]; onSubmit: (request: PersonalLeave) => void }) {
  const today = localDateKey(new Date());
  const [kind, setKind] = useState("Annual leave");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [dateError, setDateError] = useState("");

  const sick = kind === SICK;
  const days = start && end && end >= start ? workdaysIn(start, end).length : 0;
  const late = sick && !!start && start < today;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!start || !end) { setDateError("Choose a start and end date."); return; }
    if (end < start) { setDateError("End date must be on or after the start date."); return; }
    if (!sick && start < today) { setDateError("Annual leave and personal days must start today or later. Only sick leave can be for past dates."); return; }
    if (days === 0) { setDateError("Those dates fall on a weekend (Friday or Saturday)."); return; }
    if (leaves.some((l) => l.status !== "Rejected" && l.start && l.end && l.start <= end && l.end >= start)) { setDateError("You already have a leave request covering some of these days."); return; }
    setDateError("");
    onSubmit({ kind, dates: formatRange(start, end), start, end, status: "Pending", late });
    setStart(""); setEnd("");
  };

  return <>
    <Card>
      <PanelHeader title="Request time off" subtitle="Your request will be sent to your manager for review." />
      <form className="leave-request-form" onSubmit={submit} noValidate>
        <label>Leave type<select value={kind} onChange={(event) => { setKind(event.target.value); setDateError(""); }}><option>Annual leave</option><option>{SICK}</option><option>Personal day</option></select></label>
        <label>Start date<input type="date" min={sick ? undefined : today} value={start} onChange={(event) => { setStart(event.target.value); if (!end || end < event.target.value) setEnd(event.target.value); setDateError(""); }} /></label>
        <label>End date<input type="date" min={start || (sick ? undefined : today)} value={end} aria-invalid={!!dateError} aria-describedby={dateError ? "leave-date-error" : undefined} onChange={(event) => { setEnd(event.target.value); setDateError(""); }} /></label>
        <button className="primary" type="submit">Submit request</button>
        <p className="form-hint leave-hint">
          {days > 0 ? <>That&apos;s <b>{days} workday{days === 1 ? "" : "s"}</b> (Sun–Thu).</> : sick ? "Sick leave can be for past days if you were unable to request it in time." : "Annual leave and personal days must start today or later."}
          {late && <> <span className="late-tag">Late submission</span> Past sick days are flagged for your manager.</>}
        </p>
        {dateError && <p id="leave-date-error" className="auth-error" role="alert">{dateError}</p>}
      </form>
    </Card>
    <Card className="employee-leave-history">
      <PanelHeader title="My leave requests" subtitle="Your personal request history" />
      <div className="list">{leaves.map((leave, index) => <ListRow key={leave.id ?? `${leave.kind}-${leave.dates}-${index}`} leading={<span className="staticon sky small"><CalendarDays size={15} /></span>} title={leave.kind} subtitle={leave.dates}>
        {leave.late && <span className="late-tag">Late submission</span>}<Badge value={leave.status} />
      </ListRow>)}</div>
    </Card>
  </>;
}
