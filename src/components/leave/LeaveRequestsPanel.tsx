import { Check, X } from "lucide-react";
import type { Leave } from "@/lib/types";
import Badge from "@/components/ui/Badge";
import { Card, PanelHeader } from "@/components/ui/Card";
import { MiniAvatar } from "@/components/ui/Avatar";
import ListRow from "@/components/ui/ListRow";

/** Admin view of every leave request with Approve / Reject buttons. */
export default function LeaveRequestsPanel({ leaves, onUpdate }: { leaves: Leave[]; onUpdate: (index: number, status: string) => void }) {
  return <Card>
    <PanelHeader title="All leave requests" subtitle="Review requests from across your organization"
      action={<select className="filterselect" aria-label="Filter leave requests by status"><option>All statuses</option><option>Pending</option><option>Approved</option><option>Rejected</option></select>} />
    <div className="list">{leaves.map((leave, i) => <ListRow key={`${leave.name}-${i}`} leading={<MiniAvatar initials={leave.initials} color={leave.color} />} title={leave.name} subtitle={`${leave.kind} · ${leave.dates}`}>
      {leave.late && <span className="late-tag" title="Sick leave filed after the dates had passed">Late submission</span>}
      <Badge value={leave.status} />
      {leave.status === "Pending" && <div className="leave-buttons">
        <button className="outline success" onClick={() => onUpdate(i, "Approved")}><Check size={14} /> Approve</button>
        <button className="outline danger" onClick={() => onUpdate(i, "Rejected")}><X size={14} /> Reject</button>
      </div>}
    </ListRow>)}</div>
  </Card>;
}
