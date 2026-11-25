import { CalendarDays, CheckCheck } from "lucide-react";
import MiniDonut from "@/components/ui/MiniDonut";
import type { Announcement, DemoUser, EmployeeAttendance, PersonalLeave } from "@/lib/types";
import { greeting, todayLabel } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Bento from "@/components/ui/Bento";
import { Card, PanelHeader } from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import AttendanceCard, { attendanceStatus } from "@/components/attendance/AttendanceCard";
import HeroTile from "./HeroTile";
import TaskList from "./TaskList";
import QuickLinks from "./QuickLinks";

/* Demo figures: Saudi labour law gives 21 days' annual leave in the first five years. */
const LEAVE_ENTITLEMENT = 21;
const LEAVE_LEFT = 12;
const TASKS_IN_PROGRESS = 2;
const TASKS_DONE = 5;

const myTasks = [{ name: "Design system review", detail: "Due Oct 29", status: "In progress" }, { name: "Mobile prototype feedback", detail: "Due Oct 30", status: "In progress" }];

/** Employee home as a bento grid: hero, attendance, balances, tasks and announcements. */
export default function EmployeeDashboard({ user, checkedIn, attendance, onToggleAttendance, leaves, announcements, onNavigate }: { user: DemoUser; checkedIn: boolean; attendance: EmployeeAttendance | null; onToggleAttendance: () => void; leaves: PersonalLeave[]; announcements: Announcement[]; onNavigate: (page: string) => void }) {
  const count = (status: string) => leaves.filter((item) => item.status === status).length;
  const pending = count("Pending");
  return <Bento>
    <HeroTile className="span-7" eyebrow={todayLabel()} title={`${greeting()}, ${user.name.split(" ")[0]}`}
      subtitle={<>You have <b>2 tasks</b> in progress and <b>12 days</b> of leave left this year.</>}
      actions={<><button className="primary" onClick={() => onNavigate("Leave management")}><CalendarDays size={15} /> Request time off</button><button className="outline" onClick={() => onNavigate("Tasks")}><CheckCheck size={15} /> My tasks</button></>} />
    <AttendanceCard className="span-5 employee-dashboard-attendance" attendance={attendance} checkedIn={checkedIn} onToggle={onToggleAttendance}
      header={<PanelHeader title="My attendance" subtitle="Today's check-in and work hours" action={<Badge value={attendanceStatus(attendance, checkedIn)} />} />} />

    <StatCard className="span-4" label="Annual leave balance" value={`${LEAVE_LEFT} days`} hint={`of ${LEAVE_ENTITLEMENT} days this year`}
      chart={<MiniDonut label="Annual leave" center={`${Math.round((LEAVE_LEFT / LEAVE_ENTITLEMENT) * 100)}%`} segments={[{ label: "Left", value: LEAVE_LEFT, color: "var(--primary)" }, { label: "Used", value: LEAVE_ENTITLEMENT - LEAVE_LEFT, color: "var(--chart-warm)" }]} />} />
    <StatCard className="span-4" label="Leave requests" value={`${pending} pending`} hint={`${leaves.length} requests in your history`}
      chart={<MiniDonut label="Leave requests" center={String(leaves.length)} segments={[{ label: "Approved", value: count("Approved"), color: "var(--accent)" }, { label: "Pending", value: pending, color: "var(--chart-warm)" }, { label: "Rejected", value: count("Rejected"), color: "var(--alert)" }]} />} />
    <StatCard className="span-4" label="My tasks" value={`${TASKS_IN_PROGRESS} in progress`} hint="1 due this week"
      chart={<MiniDonut label="Tasks this month" center={String(TASKS_IN_PROGRESS + TASKS_DONE)} segments={[{ label: "In progress", value: TASKS_IN_PROGRESS, color: "var(--primary)" }, { label: "Done", value: TASKS_DONE, color: "var(--accent)" }]} />} />

    <Card className="span-4">
      <PanelHeader title="My upcoming tasks" subtitle="Assigned to you" action={<button className="linkbtn" onClick={() => onNavigate("Tasks")}>View tasks</button>} />
      <TaskList tasks={myTasks} />
    </Card>
    <Card className="span-4">
      <PanelHeader title="Company announcements" subtitle="Updates for your workspace" action={<button className="linkbtn" onClick={() => onNavigate("Announcements")}>View all</button>} />
      {announcements.length === 0 && <div className="employee-news"><span>No announcements for your department yet.</span></div>}
      {[...announcements].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 2).map((item) => <div className="employee-news" key={item.id}><strong>{item.title}</strong><span>{item.body.length > 80 ? `${item.body.slice(0, 77)}…` : item.body}</span></div>)}
    </Card>
    <QuickLinks className="span-4" labels={["My salary", "Attendance", "Leave management", "Documents"]} onNavigate={onNavigate} />
  </Bento>;
}
