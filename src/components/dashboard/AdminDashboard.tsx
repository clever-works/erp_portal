import type { MouseEvent } from "react";
import { BriefcaseBusiness, Building2, CalendarDays, Download, Plus, Users } from "lucide-react";
import { taskData } from "@/lib/data";
import type { DemoUser, Employee, Leave } from "@/lib/types";
import { greeting, todayLabel } from "@/lib/utils";
import Bento from "@/components/ui/Bento";
import { Card, PanelHeader } from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import EmployeeTable from "@/components/employees/EmployeeTable";
import HeroTile from "./HeroTile";
import WorkforceChart from "./WorkforceChart";
import AttendanceRing from "./AttendanceRing";
import LeaveRequestsCard from "./LeaveRequestsCard";
import TaskList from "./TaskList";
import QuickLinks from "./QuickLinks";

type AdminDashboardProps = {
  user: DemoUser;
  employees: Employee[];
  leaves: Leave[];
  pendingCount: number;
  onExport: () => void;
  onAddEmployee: (event: MouseEvent<HTMLButtonElement>) => void;
  onUpdateLeave: (index: number, status: string) => void;
  onNavigate: (page: string) => void;
  onSelectEmployee: (employee: Employee) => void;
};

/** Admin home as a bento command center. */
export default function AdminDashboard({ user, employees, leaves, pendingCount, onExport, onAddEmployee, onUpdateLeave, onNavigate, onSelectEmployee }: AdminDashboardProps) {
  const headcount = employees.length + 236;
  const onLeaveToday = leaves.filter((leave) => leave.status === "Approved").length + 8;
  const viewAll = (page: string) => <button className="linkbtn" onClick={() => onNavigate(page)}>View all</button>;

  return <Bento>
    <HeroTile className="span-6 rows-2" eyebrow={todayLabel()} title={`${greeting()}, ${user.name.split(" ")[0]}`}
      subtitle={<>{pendingCount > 0 ? <><b>{pendingCount} leave {pendingCount === 1 ? "request" : "requests"}</b> and </> : null}<b>2 project milestones</b> need your attention today.</>}
      actions={<>
        <button className="primary" onClick={onAddEmployee}><Plus size={15} /> Add employee</button>
        <button className="outline" onClick={onExport}><Download size={15} /> Export</button>
        {pendingCount > 0 && <button className="outline" onClick={() => onNavigate("Leave management")}><CalendarDays size={15} /> Review leave</button>}
      </>} />

    <StatCard className="span-3" label="Total employees" value={String(headcount)} change="+12.5%" hint="vs. last month" icon={Users} tone="indigo" />
    <StatCard className="span-3" label="Departments" value="12" change="+2" hint="new this quarter" icon={Building2} tone="sky" />
    <StatCard className="span-3" label="On leave today" value={String(onLeaveToday)} change="2 upcoming" hint="this week" icon={CalendarDays} tone="amber" />
    <StatCard className="span-3" label="Open positions" value="08" change="4 new" hint="this month" icon={BriefcaseBusiness} tone="emerald" />

    <WorkforceChart className="span-8" />
    <AttendanceRing className="span-4" total={headcount} onOpen={() => onNavigate("Attendance")}
      segments={[{ label: "Office", value: headcount - 28 - onLeaveToday, tone: "present" }, { label: "Remote", value: 28, tone: "remote" }, { label: "Leave", value: onLeaveToday, tone: "leave" }]} />

    <Card flush className="span-8">
      <PanelHeader padded title="Recently added employees" subtitle="Your newest team members" action={viewAll("Employees")} />
      <EmployeeTable employees={employees.slice(0, 4)} onSelect={onSelectEmployee} variant="compact" />
    </Card>
    <LeaveRequestsCard className="span-4" leaves={leaves} pendingCount={pendingCount} onUpdate={onUpdateLeave} onViewAll={() => onNavigate("Leave management")} />

    <Card className="span-6">
      <PanelHeader title="Team tasks" subtitle="Track your team's progress" action={viewAll("Tasks")} />
      <TaskList tasks={taskData.slice(0, 3).map((task) => ({ name: task.name, detail: task.group, status: task.status, done: task.done }))} />
    </Card>
    <QuickLinks className="span-6" labels={["Employees", "Leave management", "Projects", "Finance", "Inventory", "Reports"]} onNavigate={onNavigate} />
  </Bento>;
}
