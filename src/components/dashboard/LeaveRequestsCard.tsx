import { Check, X } from "lucide-react";
import type { Leave } from "@/lib/types";
import Badge from "@/components/ui/Badge";
import { Card, PanelHeader } from "@/components/ui/Card";
import { MiniAvatar } from "@/components/ui/Avatar";
import ListRow from "@/components/ui/ListRow";

/** Dashboard card with the first few leave requests and quick approve/reject icons. */
export default function LeaveRequestsCard({ leaves, pendingCount, onUpdate, onViewAll, limit = 3, className = "" }: { leaves: Leave[]; pendingCount: number; onUpdate: (index: number, status: string) => void; onViewAll: () => void; limit?: number; className?: string }) {
  return <Card className={className}>
    <PanelHeader title="Leave requests" subtitle={`${pendingCount} awaiting your review`} action={<button className="linkbtn" onClick={onViewAll}>View all</button>} />
    <div className="list">{leaves.slice(0, limit).map((leave, i) => <ListRow key={`${leave.name}-${i}`} className="dashboard-leave-item" leading={<MiniAvatar initials={leave.initials} color={leave.color} />} title={leave.name} subtitle={leave.reason ? `${leave.kind} · ${leave.dates} · ${leave.reason}` : `${leave.kind} · ${leave.dates}`}>
      <div className="leave-controls">
        {leave.late && <span className="late-tag" title="Sick leave filed after the dates had passed">Late</span>}
        {leave.status === "Pending" ? <>
          <button className="iconbtn approve" aria-label={`Approve ${leave.name} leave request`} title="Approve" onClick={() => onUpdate(i, "Approved")}><Check size={15} /></button>
          <button className="iconbtn reject" aria-label={`Reject ${leave.name} leave request`} title="Reject" onClick={() => onUpdate(i, "Rejected")}><X size={15} /></button>
        </> : <Badge value={leave.status} />}
      </div>
    </ListRow>)}</div>
  </Card>;
}
