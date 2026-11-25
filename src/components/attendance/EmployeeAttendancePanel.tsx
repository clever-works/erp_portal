"use client";

import { useMemo } from "react";
import type { DemoUser, Employee, EmployeeAttendance } from "@/lib/types";
import { recordsBetween, summarize, formatHours, thisWeek } from "@/lib/attendance";
import Badge from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Card, PanelHeader } from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import AttendanceCard, { attendanceStatus } from "./AttendanceCard";
import AttendanceTable from "./AttendanceTable";
import AttendanceHistory from "./AttendanceHistory";

/** "My Attendance" page for employees: today's check-in, this week's table, then history. */
export default function EmployeeAttendancePanel({ user, employee, checkedIn, attendance, onToggle }: { user: DemoUser; employee: Employee; checkedIn: boolean; attendance: EmployeeAttendance | null; onToggle: () => void }) {
  const live = useMemo(() => ({ employeeId: employee.id, attendance }), [employee.id, attendance]);
  const week = thisWeek();
  const weekRecords = recordsBetween([employee], week.start, week.end, live);
  const weekSum = summarize(weekRecords);

  return <>
    <PageHeader title="My Attendance" description="Check in and out, and review your hours for this week and earlier." />
    <AttendanceCard className="employee-attendance-panel" attendance={attendance} checkedIn={checkedIn} onToggle={onToggle}
      header={<div className="employee-profile-row"><Avatar initials={user.initials} large /><div><h2>{user.name}</h2><p>{user.jobTitle} · {user.department} · {employee.workMode}</p></div><Badge value={attendanceStatus(attendance, checkedIn, "Working")} /></div>} />
    <div className="section-gap" />
    <Card flush>
      <PanelHeader padded title="This week" subtitle={`${week.label.replace(/^This week \((.*)\)$/, "$1")} · ${formatHours(weekSum.totalMinutes)} worked`} />
      <AttendanceTable records={weekRecords} showEmployee={false} emptyText="No workdays yet this week." />
    </Card>
    <div className="section-gap" />
    <AttendanceHistory employees={[employee]} showEmployeeFilter={false} live={live} title="Attendance history" />
  </>;
}
