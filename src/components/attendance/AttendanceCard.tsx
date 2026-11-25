import type { ReactNode } from "react";
import type { EmployeeAttendance } from "@/lib/types";
import AttendanceSummary from "./AttendanceSummary";

/** Today's attendance tiles plus a Check in / Check out button. Shared by the employee dashboard and attendance page. */
export default function AttendanceCard({ header, attendance, checkedIn, onToggle, className }: { header: ReactNode; attendance: EmployeeAttendance | null; checkedIn: boolean; onToggle: () => void; className: string }) {
  const complete = !!attendance?.checkOutAt;
  return <section className={`card panel ${className}`}>
    {header}
    <AttendanceSummary attendance={attendance} checkedIn={checkedIn} />
    {!complete && <button className="primary" onClick={onToggle}>{checkedIn ? "Check out" : "Check in"}</button>}
    {complete && <p className="attendance-complete-note">Your completed work hours are saved for today.</p>}
  </section>;
}

/** Status text for today's attendance. */
export function attendanceStatus(attendance: EmployeeAttendance | null, checkedIn: boolean, presentLabel = "Checked in") {
  return checkedIn ? presentLabel : attendance?.checkOutAt ? "Workday complete" : "Not checked in";
}
