"use client";

import { useState, type FormEvent } from "react";
import { Laptop, Send } from "lucide-react";
import type { WfhRequest } from "@/lib/types";
import { formatRange, workdaysIn } from "@/lib/wfh";
import { localDateKey } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import { Card, PanelHeader } from "@/components/ui/Card";
import ListRow from "@/components/ui/ListRow";

export type WfhDraft = Pick<WfhRequest, "start" | "end" | "reason">;

/** Employee view: request work from home, then see past requests and their status. */
export default function MyWfhPanel({ requests, onSubmit }: { requests: WfhRequest[]; onSubmit: (draft: WfhDraft) => void }) {
  const today = localDateKey(new Date());
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const days = start && end && end >= start ? workdaysIn(start, end).length : 0;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!start || !end) { setError("Choose a start and end date."); return; }
    if (end < start) { setError("The end date must be on or after the start date."); return; }
    if (start < today) { setError("Requests can only be for today or later."); return; }
    if (days === 0) { setError("Those dates fall on a weekend (Friday or Saturday)."); return; }
    if (!reason.trim()) { setError("Add a short reason for your manager."); return; }
    if (requests.some((r) => r.status !== "Rejected" && r.start <= end && r.end >= start)) { setError("You already have a request covering some of these days."); return; }
    setError("");
    onSubmit({ start, end, reason: reason.trim() });
    setStart(""); setEnd(""); setReason("");
  };

  const sorted = [...requests].sort((a, b) => b.start.localeCompare(a.start));

  return <>
    <Card>
      <PanelHeader title="Request work from home" subtitle="Your manager will be notified and can approve or reject it." />
      <form className="wfh-form" onSubmit={submit} noValidate>
        <label>Start date<input type="date" min={today} value={start} onChange={(e) => { setStart(e.target.value); if (!end || end < e.target.value) setEnd(e.target.value); setError(""); }} /></label>
        <label>End date<input type="date" min={start || today} value={end} onChange={(e) => { setEnd(e.target.value); setError(""); }} /></label>
        <label className="wide">Reason<textarea rows={3} placeholder="e.g. Waiting for a delivery at home" value={reason} onChange={(e) => { setReason(e.target.value); setError(""); }} /></label>
        <div className="wfh-form-foot wide">
          <span className="form-hint">{days > 0 ? <>That's <b>{days} workday{days === 1 ? "" : "s"}</b> (Sun–Thu).</> : "Pick your dates to see how many workdays this covers."}</span>
          <button className="primary" type="submit"><Send size={15} /> Send request</button>
        </div>
        {error && <p className="auth-error wide" role="alert">{error}</p>}
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
