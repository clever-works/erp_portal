"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Megaphone, Plus } from "lucide-react";
import { avatarTints, demoUsers, employeeNavLabels, legacyLogins, legacyPeople, nav, navGroups, seedAnnouncements, seedDepartments, seedEmployees, seedLeaves, seedNotices, seedPersonalLeave, seedWfhRequests, withEmployeeDefaults } from "@/lib/data";
import type { Announcement, Department, DemoUser, Employee, EmployeeAttendance, InboxNotice, Leave, NewEmployee, PersonalLeave, ProfileTarget, WfhRequest } from "@/lib/types";
import { formatRange, remoteOverrides } from "@/lib/wfh";
import { setRemoteDays } from "@/lib/attendance";
import WfhRequestsPanel from "@/components/wfh/WfhRequestsPanel";
import MyWfhPanel, { type WfhDraft } from "@/components/wfh/MyWfhPanel";
import { audienceLabel, noticeVisibleTo, reaches } from "@/lib/audience";
import AddDepartmentModal from "@/components/departments/AddDepartmentModal";
import AnnouncementComposer, { type AnnouncementDraft } from "@/components/announcements/AnnouncementComposer";
import AnnouncementFeed from "@/components/announcements/AnnouncementFeed";
import { formatAttendanceTime, initialsOf, localDateKey, migratePerson, pageDescription } from "@/lib/utils";
import SalaryPanel from "@/components/payroll/SalaryPanel";
import MySkillsPanel from "@/components/skills/MySkillsPanel";

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { MobileDrawer, MobileTabBar } from "@/components/layout/MobileNav";
import SectionTabs from "@/components/layout/SectionTabs";
import PageHeader from "@/components/ui/PageHeader";
import Toast from "@/components/ui/Toast";
import LoginScreen from "@/components/auth/LoginScreen";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import EmployeeDashboard from "@/components/dashboard/EmployeeDashboard";
import EmployeeDirectory from "@/components/employees/EmployeeDirectory";
import AddEmployeeModal from "@/components/employees/AddEmployeeModal";
import ProfileModal from "@/components/employees/ProfileModal";
import LeaveRequestsPanel from "@/components/leave/LeaveRequestsPanel";
import EmployeeLeavePanel from "@/components/leave/EmployeeLeavePanel";
import TeamAttendancePanel from "@/components/attendance/TeamAttendancePanel";
import EmployeeAttendancePanel from "@/components/attendance/EmployeeAttendancePanel";
import SettingsPanel from "@/components/settings/SettingsPanel";
import ResetDataModal from "@/components/settings/ResetDataModal";
import ModulePanel from "@/components/modules/ModulePanel";

type SavedState = { employees?: Employee[]; leaves?: Leave[]; dark?: boolean; checkedIn?: boolean; employeeCheckedIn?: boolean; employeeAttendance?: EmployeeAttendance | null; employeeLeave?: PersonalLeave[]; notices?: InboxNotice[]; departments?: Department[]; announcements?: Announcement[]; wfhRequests?: WfhRequest[] };

/**
 * App shell: holds the portal state (saved to localStorage), handles sign-in,
 * and decides which page component to show. All UI lives in the imported components.
 */
export default function ERPPortal() {
  /* ---------- state ---------- */
  const [hydrated, setHydrated] = useState(false);
  const [authUser, setAuthUser] = useState<DemoUser | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [page, setPage] = useState("Dashboard");
  const [menu, setMenu] = useState(false);
  const [dark, setDark] = useState(false);
  const [toast, setToast] = useState("");
  const [addingEmployee, setAddingEmployee] = useState(false);
  const [addingDepartment, setAddingDepartment] = useState(false);
  const [composing, setComposing] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [profileView, setProfileView] = useState<ProfileTarget | null>(null);
  const [departments, setDepartments] = useState(seedDepartments);
  const [announcements, setAnnouncements] = useState(seedAnnouncements);
  const [wfhRequests, setWfhRequests] = useState<WfhRequest[]>(seedWfhRequests);

  const [employees, setEmployees] = useState(seedEmployees);
  const [leaves, setLeaves] = useState(seedLeaves);
  const [notices, setNotices] = useState(seedNotices);
  const [checkedIn, setCheckedIn] = useState(false);
  const [employeeLeave, setEmployeeLeave] = useState(seedPersonalLeave);
  const [employeeCheckedIn, setEmployeeCheckedIn] = useState(false);
  const [employeeAttendance, setEmployeeAttendance] = useState<EmployeeAttendance | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  /* ---------- persistence ---------- */
  useEffect(() => {
    try {
      const stored = localStorage.getItem("nexus-erp");
      if (stored) {
        const state = JSON.parse(stored) as SavedState;
        if (state.employees) {
          // Rename old demo names, fill in new fields (phone, salary, insurance…), and add new seed people.
          const saved = state.employees.map((person) => withEmployeeDefaults(migratePerson(person, legacyPeople)));
          const missing = seedEmployees.filter((seed) => !saved.some((person) => person.id === seed.id));
          setEmployees([...missing, ...saved]);
        }
        if (state.leaves) {
          // Older saves held demo requests without ids (so approvals couldn't reach the employee); swap those for the current demo list.
          const tracked = state.leaves.filter((leave) => leave.id).map((leave) => migratePerson(leave, legacyPeople));
          setLeaves(tracked.length === state.leaves.length ? tracked : [...tracked, ...seedLeaves.filter((seed) => !tracked.some((leave) => leave.id === seed.id))]);
        }
        const savedTheme = localStorage.getItem("nexus-theme");
        setDark(savedTheme ? savedTheme === "dark" : !!state.dark);
        setCheckedIn(!!state.checkedIn);
        const today = localDateKey(new Date());
        const attendance = state.employeeAttendance ?? (state.employeeCheckedIn ? { date: today, checkInAt: `${today}T09:14:00`, checkOutAt: null } : null);
        setEmployeeAttendance(attendance);
        setEmployeeCheckedIn(!!attendance && attendance.date === today && !attendance.checkOutAt);
        if (state.employeeLeave) {
          // Older saves stored demo requests without real dates; swap those for the current demo requests.
          const dated = state.employeeLeave.filter((leave) => leave.start && leave.end)
            .map((leave) => leave.id ? leave : { ...leave, id: seedPersonalLeave.find((seed) => seed.kind === leave.kind && seed.start === leave.start)?.id });
          setEmployeeLeave(dated.length === state.employeeLeave.length ? dated : [...dated, ...seedPersonalLeave.filter((seed) => !dated.some((leave) => leave.kind === seed.kind && leave.start === seed.start))]);
        }
        if (state.departments) setDepartments(state.departments);
        if (state.announcements) setAnnouncements(state.announcements);
        if (state.wfhRequests) setWfhRequests(state.wfhRequests);
        if (state.notices) setNotices(state.notices.map((notice) => ({ ...notice, body: Object.entries(legacyPeople).reduce((body, [oldName, person]) => body.replaceAll(oldName, person.name), notice.body) })));
      } else {
        setDark(localStorage.getItem("nexus-theme") === "dark");
      }
      const savedEmail = localStorage.getItem("nexus-auth");
      const signedInEmail = savedEmail ? legacyLogins[savedEmail] ?? savedEmail : null;
      if (signedInEmail) { setAuthUser(demoUsers.find((user) => user.email === signedInEmail) ?? null); localStorage.setItem("nexus-auth", signedInEmail); }
    } catch { /* use demo defaults */ } finally { setHydrated(true); }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    // Uploaded certificate files live here too; if the browser's storage is full, keep working and say so.
    try { localStorage.setItem("nexus-erp", JSON.stringify({ employees, leaves, dark, checkedIn, employeeCheckedIn, employeeAttendance, employeeLeave, notices, departments, announcements, wfhRequests })); }
    catch { setToast("Browser storage is full: remove a large certificate file so changes can be saved"); }
  }, [employees, leaves, dark, checkedIn, employeeCheckedIn, employeeAttendance, employeeLeave, notices, departments, announcements, wfhRequests, hydrated]);

  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(""), 2600); return () => clearTimeout(timer); }, [toast]);
  useEffect(() => { if (!addingEmployee && !addingDepartment && !composing && !profileView && returnFocusRef.current) { returnFocusRef.current.focus(); returnFocusRef.current = null; } }, [addingEmployee, addingDepartment, composing, profileView]);
  useEffect(() => { document.documentElement.classList.toggle("dark-root", dark); }, [dark]);

  /* ---------- actions ---------- */
  const notify = (message: string) => setToast(message);
  const employeeMode = authUser?.role === "employee";

  const signIn = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const account = demoUsers.find((user) => user.email.toLowerCase() === loginEmail.trim().toLowerCase() && user.password === loginPassword);
    if (!account) { setLoginError("Email or password is incorrect."); return; }
    setAuthUser(account); setPage("Dashboard"); setLoginError(""); setLoginPassword("");
    localStorage.setItem("nexus-auth", account.email);
  };
  const signOut = () => { localStorage.removeItem("nexus-auth"); setAuthUser(null); setProfileView(null); setPage("Dashboard"); setLoginPassword(""); };

  const saveTheme = (nextDark: boolean) => { try { localStorage.setItem("nexus-theme", nextDark ? "dark" : "light"); } catch { /* theme still changes for this session */ } setDark(nextDark); };

  const switchPage = (value: string) => {
    if (employeeMode ? !employeeNavLabels.includes(value) : nav.find((item) => item.label === value)?.employeeOnly) return;
    setPage(value); setMenu(false);
    requestAnimationFrame(() => document.querySelector<HTMLElement>(".content h1")?.focus());
  };

  const createEmployee = (draft: NewEmployee) => {
    const nextNumber = Math.max(1050, ...employees.map((e) => Number(e.id.replace(/\D/g, "")) || 0)) + 1;
    setEmployees([{ ...draft, id: `EMP-${nextNumber}`, email: `${draft.name.toLowerCase().replace(/\s+/g, ".")}@acme.co`, status: "Active", initials: initialsOf(draft.name), color: avatarTints[employees.length % avatarTints.length], skills: [], certificates: [] }, ...employees]);
    setAddingEmployee(false); notify("Employee added successfully");
  };
  const createDepartment = (department: Department) => {
    setDepartments([...departments, department]); setAddingDepartment(false);
    notify(`${department.name} department added`);
  };
  const publishAnnouncement = (draft: AnnouncementDraft) => {
    const now = new Date().toISOString();
    const id = Date.now();
    setAnnouncements([{ ...draft, id, publishedAt: now, author: authUser?.name ?? "Admin" }, ...announcements]);
    setNotices([{ id, title: draft.title, body: draft.body.length > 110 ? `${draft.body.slice(0, 107)}…` : draft.body, time: "Just now", createdAt: now, page: "Announcements", read: false, audience: draft.audience, fromAnnouncement: true }, ...notices]);
    setComposing(false);
    notify(`Announcement sent to ${audienceLabel(draft.audience)}`);
  };
  const submitWfh = (draft: WfhDraft) => {
    const me = employees.find((e) => e.id === authUser?.employeeId);
    if (!me) return;
    const now = new Date().toISOString(); const id = Date.now();
    setWfhRequests([{ ...draft, id, employeeId: me.id, name: me.name, initials: me.initials, color: me.color, status: "Pending", requestedAt: now }, ...wfhRequests]);
    setNotices([{ id, title: "Work from home request", body: `${me.name} asked to work from home ${formatRange(draft.start, draft.end)}.`, time: "Just now", createdAt: now, page: "Work from home", read: false, audience: "admin" }, ...notices]);
    notify("Work from home request sent");
  };
  const decideWfh = (id: number, status: "Approved" | "Rejected") => {
    const request = wfhRequests.find((r) => r.id === id);
    if (!request) return;
    setWfhRequests(wfhRequests.map((r) => (r.id === id ? { ...r, status } : r)));
    const now = new Date().toISOString();
    setNotices([{ id: Date.now(), title: `Work from home ${status.toLowerCase()}`, body: `Your request for ${formatRange(request.start, request.end)} was ${status.toLowerCase()}.`, time: "Just now", createdAt: now, page: "Work from home", read: false, employeeId: request.employeeId }, ...notices]);
    notify(`${request.name}'s request ${status.toLowerCase()}`);
  };
  const updateLeave = (index: number, status: string) => {
    const target = leaves[index];
    setLeaves(leaves.map((item, i) => i === index ? { ...item, status } : item));
    // Requests an employee sent from their portal carry an id: update their own copy too.
    if (target?.id) setEmployeeLeave(employeeLeave.map((item) => item.id === target.id ? { ...item, status } : item));
    notify(`Leave request ${status.toLowerCase()}`);
  };
  const submitLeave = (request: PersonalLeave) => {
    const me = employees.find((e) => e.id === authUser?.employeeId);
    const id = Date.now();
    setEmployeeLeave([{ ...request, id }, ...employeeLeave]);
    if (me) {
      setLeaves([{ id, name: me.name, kind: request.kind, dates: request.dates, initials: me.initials, color: me.color, status: "Pending", late: request.late, reason: request.reason }, ...leaves]);
      setNotices([{ id, title: request.late ? "Late sick leave submitted" : "New leave request", body: `${me.name} requested ${request.kind.toLowerCase()} for ${request.dates}.`, time: "Just now", createdAt: new Date().toISOString(), page: "Leave management", read: false, audience: "admin" }, ...notices]);
    }
    notify(request.late ? "Sick leave submitted (marked as late)" : "Your leave request was submitted");
  };

  const toggleEmployeeAttendance = () => {
    const now = new Date();
    const today = localDateKey(now);
    const session = employeeAttendance?.date === today ? employeeAttendance : null;
    if (employeeCheckedIn && session) {
      const completed = { ...session, checkOutAt: now.toISOString() };
      setEmployeeAttendance(completed); setEmployeeCheckedIn(false);
      notify(`Checked out at ${formatAttendanceTime(completed.checkOutAt)}`);
      return;
    }
    if (session?.checkOutAt) { notify("Your workday is already complete"); return; }
    setEmployeeAttendance({ date: today, checkInAt: now.toISOString(), checkOutAt: null });
    setEmployeeCheckedIn(true);
    notify(`Checked in at ${formatAttendanceTime(now.toISOString())}`);
  };

  /* ---------- signed-out / loading ---------- */
  if (!hydrated) return <div className="auth-loading" aria-label="Loading workspace"><span className="spinner" aria-hidden="true" />Loading workspace…</div>;
  if (!authUser) return <LoginScreen dark={dark} email={loginEmail} password={loginPassword} error={loginError} onEmailChange={setLoginEmail} onPasswordChange={setLoginPassword} onSubmit={signIn} onDemoFill={(user) => { setLoginEmail(user.email); setLoginPassword(user.password); setLoginError(""); }} />;

  /* ---------- derived ---------- */
  const title = page === "Leave management" ? "Leave Management" : page === "My salary" ? "My Salary" : page === "My skills" ? "My Skills" : page;
  const allowed = (item: { label: string; employeeOnly?: boolean }) => employeeMode ? employeeNavLabels.includes(item.label) : !item.employeeOnly;
  const navItems = nav.filter(allowed);
  const visibleGroups = navGroups.map((group) => ({ ...group, items: group.items.filter(allowed) })).filter((group) => group.items.length);
  const myRecord = employees.find((person) => person.id === authUser.employeeId) ?? withEmployeeDefaults({ id: authUser.employeeId, name: authUser.name });
  const pendingCount = leaves.filter((leave) => leave.status === "Pending").length;
  const badges = employeeMode ? {} : { leave: pendingCount, wfh: wfhRequests.filter((r) => r.status === "Pending").length };
  const visibleNotices = notices.filter((notice) => noticeVisibleTo(notice, authUser.role, myRecord.department, myRecord.id));
  setRemoteDays(remoteOverrides(wfhRequests));
  const myAnnouncements = employeeMode ? announcements.filter((item) => reaches(item.audience, myRecord.department)) : announcements;
  const departmentNames = departments.map((dept) => dept.name);
  const departmentDataset = {
    columns: ["Department", "Department head", "Team size", "Annual budget", "Status"],
    rows: departments.map((dept) => [dept.name, dept.head, String(dept.headcount + employees.filter((e) => e.department === dept.name && !seedEmployees.some((s) => s.id === e.id)).length), `SAR ${dept.budget.toLocaleString("en-US")}`, dept.status]),
  };
  const todayAttendance = employeeAttendance?.date === localDateKey(new Date()) ? employeeAttendance : null;
  const myProfile: ProfileTarget = employeeMode ? myRecord : "admin";
  const goToSettings = authUser.role === "admin" ? () => switchPage("Settings") : undefined;

  const renderPageBody = () => {
    switch (page) {
      case "Employees": return <EmployeeDirectory employees={employees} onSelect={setProfileView} onExported={(n) => notify(`${n} employee${n === 1 ? "" : "s"} exported`)} />;
      case "Leave management": return employeeMode
        ? <EmployeeLeavePanel leaves={employeeLeave} onSubmit={submitLeave} />
        : <LeaveRequestsPanel leaves={leaves} onUpdate={updateLeave} />;
      case "Attendance": return <TeamAttendancePanel employees={employees.filter((e) => e.status !== "Inactive")} />;
      case "My salary": return <SalaryPanel employee={myRecord} notify={notify} />;
      case "My skills": return <MySkillsPanel employee={myRecord} notify={notify}
        onChange={(skills, certificates) => setEmployees(employees.map((e) => (e.id === myRecord.id ? { ...e, skills, certificates } : e)))} />;
      case "Departments": return <ModulePanel key={page} page={page} notify={notify} dataset={departmentDataset} />;
      case "Work from home": return employeeMode
        ? <MyWfhPanel requests={wfhRequests.filter((r) => r.employeeId === myRecord.id)} onSubmit={submitWfh} />
        : <WfhRequestsPanel requests={wfhRequests} onDecide={decideWfh} />;
      case "Announcements": return <AnnouncementFeed announcements={myAnnouncements} showAudience={!employeeMode} emptyText={employeeMode ? "No announcements for your department yet." : "No announcements yet. Publish one with New announcement."} />;
      case "Settings": return <SettingsPanel dark={dark} notify={notify} onThemeChange={(mode) => saveTheme(mode === "Dark" || (mode === "System default" && window.matchMedia("(prefers-color-scheme: dark)").matches))} />;
      default: return <ModulePanel key={page} page={page} notify={notify} employeeMode={employeeMode} />;
    }
  };

  const renderPage = () => {
    if (page === "Dashboard") return employeeMode
      ? <EmployeeDashboard user={authUser} checkedIn={employeeCheckedIn} attendance={todayAttendance} onToggleAttendance={toggleEmployeeAttendance} leaves={employeeLeave} announcements={myAnnouncements} onNavigate={switchPage} />
      : <AdminDashboard user={authUser} employees={employees} leaves={leaves} pendingCount={pendingCount} onUpdateLeave={updateLeave} onNavigate={switchPage} onSelectEmployee={setProfileView} />;
    if (page === "Attendance" && employeeMode) return <EmployeeAttendancePanel user={authUser} employee={myRecord} checkedIn={employeeCheckedIn} attendance={todayAttendance} onToggle={toggleEmployeeAttendance} />;
    // Only pages with a real "create" action get a header button (no placeholder buttons).
    const headerActions: Record<string, { label: string; open: (el: HTMLElement) => void }> = {
      Employees: { label: "Add employee", open: (el) => { returnFocusRef.current = el; setAddingEmployee(true); } },
      Departments: { label: "New department", open: (el) => { returnFocusRef.current = el; setAddingDepartment(true); } },
      Announcements: { label: "New announcement", open: (el) => { returnFocusRef.current = el; setComposing(true); } },
    };
    const action = employeeMode ? undefined : headerActions[page];
    return <>
      <PageHeader title={title} description={pageDescription(page)} actions={action && <button className="primary" onClick={(event) => action.open(event.currentTarget)}>{page === "Announcements" ? <Megaphone size={15} /> : <Plus size={15} />} {action.label}</button>} />
      {renderPageBody()}
    </>;
  };

  /* ---------- layout ---------- */
  return <div className={`app ${dark ? "dark" : ""} ${employeeMode ? "employee-mode" : "admin-mode"}`}>
    <Sidebar groups={visibleGroups} page={page} onNavigate={switchPage} badges={badges} user={authUser} onSignOut={signOut} />
    <main className="main">
      <Topbar title={title} menuOpen={menu} onToggleMenu={() => setMenu(!menu)} onCloseMenu={() => setMenu(false)} navItems={navItems} onNavigate={switchPage}
        notices={visibleNotices}
        onMarkAllRead={() => setNotices(notices.map((item) => visibleNotices.some((visible) => visible.id === item.id) ? { ...item, read: true } : item))}
        onOpenNotice={(notice) => { setNotices(notices.map((item) => item.id === notice.id ? { ...item, read: true } : item)); switchPage(notice.page); }}
        dark={dark} onToggleTheme={() => saveTheme(!dark)}
        user={authUser} onViewProfile={(trigger) => { returnFocusRef.current = trigger; setProfileView(myProfile); }} onOpenSettings={goToSettings} onResetData={() => setConfirmingReset(true)} onSignOut={signOut} />
      {menu && <MobileDrawer groups={visibleGroups} page={page} onNavigate={switchPage} badges={badges} onClose={() => setMenu(false)} />}
      <MobileTabBar labels={employeeMode ? ["Dashboard", "Attendance", "Leave management", "My salary"] : ["Dashboard", "Employees", "Attendance", "Leave management"]} items={navItems} page={page} onNavigate={switchPage} menuOpen={menu} onToggleMenu={() => setMenu(!menu)} />
      <div className="content">
        {page !== "Dashboard" && <SectionTabs groups={visibleGroups} page={page} onNavigate={switchPage} />}
        {renderPage()}
        <footer className="design-credit">Designed by <strong>Clever Works</strong></footer>
      </div>
    </main>
    <Toast message={toast} />
    {addingEmployee && <AddEmployeeModal departments={departmentNames} onCreate={createEmployee} onClose={() => setAddingEmployee(false)} />}
    {addingDepartment && <AddDepartmentModal existing={departments} people={[authUser.name, ...employees.map((e) => e.name)]} onCreate={createDepartment} onClose={() => setAddingDepartment(false)} />}
    {confirmingReset && <ResetDataModal onClose={() => setConfirmingReset(false)} />}
    {composing && <AnnouncementComposer departments={departmentNames} onPublish={publishAnnouncement} onClose={() => setComposing(false)} />}
    {profileView && <ProfileModal profile={profileView} onClose={() => setProfileView(null)} onOpenSettings={goToSettings && (() => { setProfileView(null); goToSettings(); })}
      onSetStatus={employeeMode ? undefined : (id, status) => {
        setEmployees(employees.map((e) => (e.id === id ? { ...e, status } : e)));
        setProfileView(profileView === "admin" ? profileView : { ...profileView, status });
        notify(status === "Inactive" ? "Employee marked as inactive" : "Employee reactivated");
      }} />}
  </div>;
}
