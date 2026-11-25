"use client";

import { useEffect, useState } from "react";
import type { EmployeeAttendance } from "@/lib/types";
import { formatAttendanceTime } from "@/lib/utils";

/** Check-in / check-out / total hours tiles. The timer ticks live while checked in. */
export default function AttendanceSummary({ attendance, checkedIn }: { attendance: EmployeeAttendance | null; checkedIn: boolean }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!checkedIn) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [checkedIn]);

  const startedAt = attendance ? new Date(attendance.checkInAt).getTime() : 0;
  const endedAt = attendance?.checkOutAt ? new Date(attendance.checkOutAt).getTime() : checkedIn ? now : startedAt;
  const workedSeconds = attendance ? Math.max(0, Math.floor((endedAt - startedAt) / 1000)) : 0;
  const hours = Math.floor(workedSeconds / 3600);
  const minutes = Math.floor((workedSeconds % 3600) / 60);
  const seconds = workedSeconds % 60;

  return <div className="attendance-summary">
    <div><span>Check-in</span><strong>{attendance ? formatAttendanceTime(attendance.checkInAt) : "—"}</strong></div>
    <div><span>Check-out</span><strong>{attendance?.checkOutAt ? formatAttendanceTime(attendance.checkOutAt) : "—"}</strong></div>
    <div><span>Total hours</span><strong>{attendance ? `${hours}h ${String(minutes).padStart(2, "0")}m${checkedIn ? ` ${String(seconds).padStart(2, "0")}s` : ""}` : "—"}</strong></div>
  </div>;
}
