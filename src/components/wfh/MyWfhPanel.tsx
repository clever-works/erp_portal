"use client";

import { useState, type FormEvent } from "react";
import { Laptop, Send } from "lucide-react";
import type { WfhRequest } from "@/lib/types";
import { formatRange, workdaysIn } from "@/lib/wfh";
import { localDateKey } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import { Card, PanelHeader } from "@/components/ui/Card";
import ListRow from "@/components/ui/ListRow";
import DateRangeCalendar from "@/components/ui/DateRangeCalendar";

export type WfhDraft = Pick<WfhRequest, "start" | "end" | "reason">;

/**
 * Employee view: pick work-from-home days on the same calendar as leave requests
 * (Saudi weekend Fri/Sat shaded), then see past requests and their status.
 */
export default function MyWfhPanel({ requests, onSubmit }: { requests: WfhRequest[]; onSubmit: (draft: WfhDraft) => void }) {
  const today = localDateKey(new Date());
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const until = end || start;
  const days = start ? workdaysIn(start, until).length : 0;
  // Workdays already covered by an open request.
  const blocked = requests.filter((r) => r.status !== "Rejected").flatMap((r) => workdaysIn(r.start, r.end));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!start) { setError("Pick your first day at home on the calendar."); return; }
    if (start < today) { setError("Requests can only be for today or later."); return; }
    if (days === 0) { setError("Those dates fall on a weekend (Friday or Saturday)."); return; }
    if (requests.some((r) => r.status !== "Rejected" && r.start <= until && r.end >= start)) { setError("You already have a request covering some of these days."); return; }
    if (!reason.trim()) { setError("Add a short reason for your manager."); return; }
    setError("");
    onSubmit({ start, end: until, reason: reason.trim() });
    setStart(""); setEnd(""); setReason("");
  };

  const sorted = [...requests].sort((a, b) => b.start.localeCompare(a.start));

  return <>
    <Card>
      <PanelHeader title="Request work from home" subtitle="Pick your days on the calendar. Your manager will be notified and can approve or reject it." />
      <form className="leave-request-form calendar-layout" onSubmit={submit} noValidate>
        <div className="leave-form-fields">
          <div className="picked-range">
            <span>Selected</span>
            <strong>{start ? formatRange(start, until) : "No days picked yet"}</strong>
            <small>{start ? `${days} workday${days === 1 ? "" : "s"} (Sun–Thu)` : "Click a start day, then an end day"}</small>
          </div>
          <label className="leave-reason">Reason<textarea rows={3} maxLength={300} placeholder="e.g. Waiting for a delivery at home" value={reason} onChange={(e) => { setReason(e.target.value); setError(""); }} /></label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="primary" type="submit"><Send size={15} /> Send request</button>
        </div>
        <DateRangeCalendar start={start} end={end} minDate={today} blocked={blocked}
          onChange={(s, e) => { setStart(s); setEnd(e); setError(""); }} />
      </form>
    </Card>
    <Card className="employee-leave-history">
      <PanelHeader title="My work from home requests" subtitle="Approved days show as Remote in your attendance." />
      {sorted.length === 0 && <div className="emptystate">You haven't requested any work from home days yet.</div>}
      <div className="list">{sorted.map((r) => {
        const n = workdaysIn(r.start, r.end).length;
        return <ListRow key={r.id} leading={<span className="staticon violet small"><Laptop size={15} /></span>} title={formatRange(r.start, r.end)} subtitle={`${n} workday${n === 1 ? "" : "s"} · ${r.reason}`}><Badge value={r.status} /></ListRow>;
      })}</div>
    </Card>
  </>;
}
