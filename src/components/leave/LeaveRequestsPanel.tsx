"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import type { Leave } from "@/lib/types";
import Badge from "@/components/ui/Badge";
import { Card, PanelHeader } from "@/components/ui/Card";
import { MiniAvatar } from "@/components/ui/Avatar";

/** Admin view of every leave request, with the employee's reason, a status filter and Approve / Reject. */
export default function LeaveRequestsPanel({ leaves, onUpdate }: { leaves: Leave[]; onUpdate: (index: number, status: string) => void }) {
  const [filter, setFilter] = useState("All statuses");
  const [person, setPerson] = useState("All employees");
  const people = [...new Set(leaves.map((l) => l.name))].sort((a, b) => a.localeCompare(b));
  // Keep each request's position in the full list: approve/reject works by that index.
  const shown = leaves.map((leave, index) => ({ leave, index }))
    .filter(({ leave }) => (filter === "All statuses" || leave.status === filter) && (person === "All employees" || leave.name === person));
  const count = (s: string) => shown.filter(({ leave }) => leave.status === s).length;

  return <Card>
    <PanelHeader title="Leave history" subtitle={person === "All employees" ? "Every leave request across the organization" : `${person}'s leave requests`}
      action={<div className="panel-tools">
        <select className="filterselect" aria-label="Filter by employee" value={person} onChange={(e) => setPerson(e.target.value)}><option>All employees</option>{people.map((p) => <option key={p}>{p}</option>)}</select>
        <select className="filterselect" aria-label="Filter leave requests by status" value={filter} onChange={(e) => setFilter(e.target.value)}><option>All statuses</option><option>Pending</option><option>Approved</option><option>Rejected</option></select>
      </div>} />
    <div className="leave-summary"><span><b>{count("Pending")}</b> pending</span><span><b>{count("Approved")}</b> approved</span><span><b>{count("Rejected")}</b> rejected</span></div>
    {shown.length === 0 && <div className="emptystate">No {filter === "All statuses" ? "" : `${filter.toLowerCase()} `}leave requests.</div>}
    <div className="list">{shown.map(({ leave, index }) => <div className="leave-row" key={leave.id ?? `${leave.name}-${index}`}>
      <MiniAvatar initials={leave.initials} color={leave.color} />
      <div className="leave-identity">
        <strong>{leave.name}</strong>
        <small><span className="nowrap">{leave.kind}</span> · <span className="nowrap">{leave.dates}</span></small>
        {leave.reason && <p className="wfh-reason">{leave.reason}</p>}
        {leave.late && <span className="late-tag" title="Sick leave filed after the dates had passed">Late submission</span>}
      </div>
      <div className="leave-side">
        <Badge value={leave.status} />
        {leave.status === "Pending" && <div className="leave-buttons">
          <button className="outline success" aria-label={`Approve ${leave.name}'s leave`} title="Approve" onClick={() => onUpdate(index, "Approved")}><Check size={15} /><span className="btn-text">Approve</span></button>
          <button className="outline danger" aria-label={`Reject ${leave.name}'s leave`} title="Reject" onClick={() => onUpdate(index, "Rejected")}><X size={15} /><span className="btn-text">Reject</span></button>
        </div>}
      </div>
    </div>)}</div>
  </Card>;
}
