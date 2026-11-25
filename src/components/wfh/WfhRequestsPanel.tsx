"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import type { WfhRequest } from "@/lib/types";
import { formatRange, workdaysIn } from "@/lib/wfh";
import { timeAgo } from "@/lib/audience";
import Badge from "@/components/ui/Badge";
import { Card, PanelHeader } from "@/components/ui/Card";
import { MiniAvatar } from "@/components/ui/Avatar";

/** Admin view: every work-from-home request, filterable by status, with Approve / Reject. */
export default function WfhRequestsPanel({ requests, onDecide }: { requests: WfhRequest[]; onDecide: (id: number, status: "Approved" | "Rejected") => void }) {
  const [filter, setFilter] = useState("Pending");
  const shown = [...requests].filter((r) => filter === "All" || r.status === filter).sort((a, b) => b.requestedAt.localeCompare(a.requestedAt));
  const pending = requests.filter((r) => r.status === "Pending").length;

  return <Card>
    <PanelHeader title="Work from home requests" subtitle={`${pending} waiting for approval`}
      action={<select className="filterselect" aria-label="Filter requests by status" value={filter} onChange={(e) => setFilter(e.target.value)}><option>Pending</option><option>Approved</option><option>Rejected</option><option>All</option></select>} />
    {shown.length === 0 && <div className="emptystate">No {filter === "All" ? "" : filter.toLowerCase() + " "}requests.</div>}
    <div className="list">{shown.map((r) => {
      const days = workdaysIn(r.start, r.end).length;
      return <div className="leaveitem wfh-item" key={r.id}>
        <MiniAvatar initials={r.initials} color={r.color} />
        <div className="leave-identity">
          <strong>{r.name}</strong>
          <small>{formatRange(r.start, r.end)} · {days} workday{days === 1 ? "" : "s"} · requested {timeAgo(r.requestedAt)}</small>
          <p className="wfh-reason">{r.reason}</p>
        </div>
        <Badge value={r.status} />
        {r.status === "Pending" && <div className="leave-buttons">
          <button className="outline success" onClick={() => onDecide(r.id, "Approved")}><Check size={14} /> Approve</button>
          <button className="outline danger" onClick={() => onDecide(r.id, "Rejected")}><X size={14} /> Reject</button>
        </div>}
      </div>;
    })}</div>
  </Card>;
}
