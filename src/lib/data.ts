import { Activity, Banknote, Bell, Building2, CalendarDays, CheckCheck, Clock3, FileText, FolderKanban, Laptop, LayoutDashboard, Package, Settings, Users, Wallet } from "lucide-react";
import type { Announcement, Dataset, Department, DemoUser, Employee, InboxNotice, Insurance, Leave, NavGroup, NavItem, PersonalLeave, SalaryPackage, WfhRequest, WorkMode } from "./types";

/* Avatar tints from the brand palette */
export const avatarTints = ["#bbefff", "#befcff", "#fee9d5", "#fce2e0", "#fdfcdc"];
/* Older saved colours (previous themes) mapped onto the current palette */
const [t0, t1, t2, t3, t4] = avatarTints;
export const legacyTints: Record<string, string> = {
  "#f5e7e7": t0, "#ede5d8": t1, "#ddd6d2": t2, "#ebd0ce": t3, "#e7d9da": t4,
  "#ceddd1": t0, "#d0dae0": t1, "#dfe4dc": t2, "#b6cdc8": t3, "#d1e0e1": t4,
  "#e0e7ff": t0, "#fce7f3": t1, "#fef3c7": t2, "#d1fae5": t3, "#ede9fe": t4, "#e0f2fe": t0,
  "#e8effb": t0, "#f5eaf1": t1, "#f8eee1": t2, "#e9f2ed": t3, "#f2eafa": t4, "#e6eff6": t0,
};

export const seedNotices: InboxNotice[] = [
  { id: 1, title: "Leave requests need review", body: "Yahya and 2 others are waiting for approval.", time: "10 min ago", page: "Leave management", read: false, audience: "admin" },
  { id: 2, title: "Project milestone coming up", body: "Website redesign is due for review this Friday.", time: "1 hour ago", page: "Projects", read: false, audience: "everyone" },
  { id: 3, title: "Attendance needs attention", body: "6 team members arrived after the scheduled start.", time: "Today", page: "Attendance", read: false, audience: "admin" },
  { id: 4, title: "Q4 all-hands meeting", body: "Join us Thursday at 10:00 AM in the main hall.", time: "Yesterday", page: "Announcements", read: true, audience: "everyone" },
];

export const seedDepartments: Department[] = [
  { name: "Engineering", head: "Mansoor", headcount: 48, budget: 1240000, status: "Active" },
  { name: "Design", head: "Riyas", headcount: 16, budget: 420000, status: "Active" },
  { name: "Marketing", head: "Umar", headcount: 23, budget: 680000, status: "Active" },
  { name: "Human Resources", head: "Yahya", headcount: 12, budget: 320000, status: "Active" },
  { name: "Finance", head: "Ashik", headcount: 9, budget: 290000, status: "Active" },
  { name: "Sales", head: "—", headcount: 21, budget: 560000, status: "Active" },
  { name: "Operations", head: "Kamar", headcount: 14, budget: 380000, status: "Active" },
];

export const seedAnnouncements: Announcement[] = [
  { id: 4, title: "Q4 all-hands meeting", body: "Join us Thursday at 10:00 AM in the main hall. We'll review Q4 results and share plans for next year.", audience: "everyone", priority: "Important", publishedAt: "2026-10-22T09:00:00", author: "Kamar" },
  { id: 3, title: "Open enrollment starts soon", body: "Benefits and medical insurance enrollment opens next week. Check your family members' details before then.", audience: "everyone", priority: "Normal", publishedAt: "2026-10-18T09:00:00", author: "Kamar" },
  { id: 2, title: "Design team showcase", body: "Each designer will present one project from this quarter. Slides are due by Wednesday.", audience: ["Design"], priority: "Normal", publishedAt: "2026-10-16T09:00:00", author: "Kamar" },
];

/** Company details used on payslips and as the default insured company. */
export const company = { name: "Acme Arabia Trading Co.", crNumber: "1010 456 789", city: "Riyadh, Saudi Arabia", payday: 27 };

/** Saudi health insurers offered in the forms. */
export const insurers = ["Tawuniya", "Bupa Arabia", "Medgulf", "Al Rajhi Takaful", "Walaa Insurance", "Malath Insurance", "GIG Saudi"];
export const workModes: WorkMode[] = ["Office", "Remote"];

const pay = (basic: number, other: number): SalaryPackage => ({ basic, housing: basic * 0.25, transport: basic * 0.1, other });
const insured = (provider: string): Insurance => ({ provider, insuredCompany: company.name });

export const seedEmployees: Employee[] = [
  { id: "EMP-1048", name: "Ashik", email: "ashik@acme.co", department: "Finance", role: "Accountant", status: "Active", initials: "AK", color: avatarTints[0], phone: "+966 59 128 6605", extension: "2512", workMode: "Office", salary: pay(10000, 500), insurance: insured("Al Rajhi Takaful") },
  { id: "EMP-1046", name: "Nawas", email: "nawas@acme.co", department: "Design", role: "Product Designer", status: "Active", initials: "NA", color: avatarTints[1], phone: "+966 55 730 4418", extension: "2146", workMode: "Office", salary: pay(12000, 800), insurance: insured("Tawuniya") },
  { id: "EMP-1042", name: "Riyas", email: "riyas@acme.co", department: "Design", role: "Senior Product Designer", status: "Active", initials: "RI", color: avatarTints[2], phone: "+966 55 214 7830", extension: "2141", workMode: "Office", salary: pay(14000, 600), insurance: insured("Tawuniya") },
  { id: "EMP-1038", name: "Mansoor", email: "mansoor@acme.co", department: "Engineering", role: "Engineering Lead", status: "Active", initials: "MA", color: avatarTints[3], phone: "+966 50 381 2264", extension: "2310", workMode: "Office", salary: pay(22000, 1500), insurance: insured("Bupa Arabia") },
  { id: "EMP-1035", name: "Umar", email: "umar@acme.co", department: "Marketing", role: "Marketing Manager", status: "Active", initials: "UM", color: avatarTints[4], phone: "+966 54 902 1187", extension: "2420", workMode: "Remote", salary: pay(18000, 1000), insurance: insured("Medgulf") },
  { id: "EMP-1029", name: "Yahya", email: "yahya@acme.co", department: "Human Resources", role: "HR Specialist", status: "On leave", initials: "YA", color: avatarTints[0], phone: "+966 56 447 3019", extension: "2205", workMode: "Office", salary: pay(11000, 500), insurance: insured("Tawuniya") },
  { id: "EMP-1024", name: "Ashraf", email: "ashraf@acme.co", department: "Engineering", role: "Software Engineer", status: "Active", initials: "AF", color: avatarTints[1], phone: "+966 53 610 9952", extension: "2318", workMode: "Remote", salary: pay(15000, 750), insurance: insured("Bupa Arabia") },
];

/** Fills in fields that older saved employees (or quick-added ones) don't have yet. */
export function withEmployeeDefaults(person: Partial<Employee> & Pick<Employee, "id" | "name">): Employee {
  const seed = seedEmployees.find((entry) => entry.id === person.id);
  return {
    email: `${person.name.toLowerCase().replace(/\s+/g, ".")}@acme.co`, department: "Operations", role: "Team member", status: "Active", initials: person.name.slice(0, 2).toUpperCase(), color: avatarTints[0],
    phone: "—", extension: "—", workMode: "Office", salary: { basic: 0, housing: 0, transport: 0, other: 0 }, insurance: insured("Tawuniya"),
    ...seed,
    ...person,
    ...(seed && !person.salary ? { salary: seed.salary } : {}),
  } as Employee;
}

export const seedLeaves: Leave[] = [
  { name: "Yahya", kind: "Annual leave", dates: "Oct 24 – 26", initials: "YA", color: avatarTints[3], status: "Pending" },
  { name: "Ashraf", kind: "Sick leave", dates: "Oct 25", initials: "AF", color: avatarTints[4], status: "Pending" },
  { name: "Ashik", kind: "Annual leave", dates: "Oct 28 – Nov 1", initials: "AK", color: avatarTints[0], status: "Pending" },
];

/** Earlier demo names, so data already saved in the browser is renamed on load. */
export const legacyPeople: Record<string, { name: string; email: string; initials: string }> = {
  "Alex Rivera": { name: "Kamar", email: "admin@acme.co", initials: "KA" },
  "Jamie Chen": { name: "Nawas", email: "nawas@acme.co", initials: "NA" },
  "Olivia Rhye": { name: "Riyas", email: "riyas@acme.co", initials: "RI" },
  "Phoenix Baker": { name: "Mansoor", email: "mansoor@acme.co", initials: "MA" },
  "Lana Steiner": { name: "Umar", email: "umar@acme.co", initials: "UM" },
  "Demi Wilkinson": { name: "Yahya", email: "yahya@acme.co", initials: "YA" },
  "Candice Wu": { name: "Ashraf", email: "ashraf@acme.co", initials: "AF" },
  "Natali Craig": { name: "Ashik", email: "ashik@acme.co", initials: "AK" },
};
export const legacyLogins: Record<string, string> = { "jamie.chen@acme.co": "nawas@acme.co" };

/** Demo work-from-home requests (dates relative to today so they always look current). */
/** yyyy-mm-dd for the n-th Sun–Thu workday from today (negative = in the past). */
function workday(n: number) {
  const d = new Date(); const step = n >= 0 ? 1 : -1; let left = Math.abs(n);
  while (left > 0) { d.setDate(d.getDate() + step); if (d.getDay() !== 5 && d.getDay() !== 6) left--; }
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function seedWfhRequests(): WfhRequest[] {
  return [
    { id: 9001, employeeId: "EMP-1042", name: "Riyas", initials: "RI", color: avatarTints[2], start: workday(2), end: workday(3), reason: "Waiting for a furniture delivery at home.", status: "Pending", requestedAt: new Date().toISOString() },
    { id: 9002, employeeId: "EMP-1048", name: "Ashik", initials: "AK", color: avatarTints[0], start: workday(5), end: workday(5), reason: "Focus day to close the month-end reports.", status: "Pending", requestedAt: new Date().toISOString() },
    { id: 9003, employeeId: "EMP-1038", name: "Mansoor", initials: "MA", color: avatarTints[3], start: workday(-7), end: workday(-6), reason: "Car in for service.", status: "Approved", requestedAt: new Date(Date.now() - 12 * 86400000).toISOString() },
    { id: 9004, employeeId: "EMP-1046", name: "Nawas", initials: "NA", color: avatarTints[1], start: workday(-11), end: workday(-11), reason: "Doctor's appointment in the morning.", status: "Approved", requestedAt: new Date(Date.now() - 18 * 86400000).toISOString() },
  ];
}

export const seedPersonalLeave: PersonalLeave[] = [
  { kind: "Annual leave", dates: "Nov 18 – 20", status: "Approved" },
  { kind: "Personal day", dates: "Dec 04", status: "Pending" },
];

export const demoUsers: DemoUser[] = [
  { email: "admin@acme.co", password: "Admin123!", name: "Kamar", role: "admin", department: "Operations", jobTitle: "Super Admin", initials: "KA", employeeId: "EMP-1001" },
  { email: "nawas@acme.co", password: "Employee123!", name: "Nawas", role: "employee", department: "Design", jobTitle: "Product Designer", initials: "NA", employeeId: "EMP-1046" },
];


export const employeeNavLabels = ["Dashboard", "Attendance", "Leave management", "Work from home", "My salary", "Tasks", "Documents", "Announcements"];

export const navGroups: NavGroup[] = [
  { title: "Overview", items: [{ label: "Dashboard", icon: LayoutDashboard }, { label: "Reports", icon: Activity }] },
  { title: "People", items: [{ label: "Employees", icon: Users }, { label: "Departments", icon: Building2 }, { label: "Attendance", icon: Clock3 }, { label: "Leave management", icon: CalendarDays, count: "leave" }, { label: "Work from home", icon: Laptop, count: "wfh" }, { label: "My salary", icon: Banknote, employeeOnly: true }] },
  { title: "Work", items: [{ label: "Tasks", icon: CheckCheck }, { label: "Projects", icon: FolderKanban }, { label: "Documents", icon: FileText }, { label: "Announcements", icon: Bell }] },
  { title: "Operations", items: [{ label: "Inventory", icon: Package }, { label: "Finance", icon: Wallet }] },
  { title: "System", items: [{ label: "Settings", icon: Settings }] },
];
export const nav: NavItem[] = navGroups.flatMap((group) => group.items);

export const taskData = [
  { name: "Q4 brand guidelines", group: "Design team", done: 72, status: "In progress" },
  { name: "Mobile app redesign", group: "Product team", done: 48, status: "In progress" },
  { name: "October payroll review", group: "Finance team", done: 100, status: "Completed" },
  { name: "Website accessibility audit", group: "Engineering", done: 23, status: "In progress" },
];

export const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const headcountThisYear = [34, 49, 42, 61, 53, 68, 57, 76, 62, 83, 73, 94];
export const headcountLastYear = [25, 38, 31, 48, 43, 56, 49, 64, 55, 73, 65, 82];

export const toneByStatus: Record<string, string> = {
  Active: "success", Approved: "success", Completed: "success", Published: "success", "In stock": "success", Present: "success", "Checked in": "success", Everyone: "success",
  Pending: "warning", "Low stock": "warning", Late: "warning", "On leave": "warning", Medium: "warning", Important: "warning", Department: "warning",
  Rejected: "danger", Overdue: "danger", High: "danger", Restricted: "danger",
  "In progress": "info", "Workday complete": "info", Normal: "info",
  "Remote work": "violet", Remote: "violet", Office: "info", Paid: "success", Leave: "warning", Working: "success",
};

export const pageDescriptions: Record<string, string> = {
  Employees: "Manage your people, profiles, and employee records.",
  Departments: "Organize teams, department leads, and budgets.",
  Attendance: "Who is in the office, remote or on leave, with check-in times, hours and history.",
  "Leave management": "Review requests and keep time off moving smoothly.",
  Tasks: "Plan work, assign owners, and track what is moving.",
  Projects: "Keep project teams and milestones in sync.",
  Documents: "Find and organize your team's shared files.",
  Inventory: "Track stock levels and inventory movement.",
  Finance: "Manage expenses, budgets, and approvals.",
  Announcements: "Share updates with the people who need them.",
  Reports: "Understand the health of your organization.",
  "My salary": "Your monthly pay, how it is split up, and your payslips.",
  "Work from home": "Request days to work remotely and track their approval.",
  Settings: "Set up your workspace and organization preferences.",
};

export const moduleDatasets: Record<string, Dataset> = {
  Departments: { columns: ["Department", "Department head", "Employees", "Annual budget", "Status"], rows: [["Engineering", "Mansoor", "48", "$1,240,000", "Active"], ["Design", "Riyas", "16", "$420,000", "Active"], ["Marketing", "Umar", "23", "$680,000", "Active"], ["Human Resources", "Yahya", "12", "$320,000", "Active"]] },
  Tasks: { columns: ["Task", "Team", "Due date", "Priority", "Status"], rows: [["Q4 brand guidelines", "Design team", "Oct 28, 2024", "High", "In progress"], ["Mobile app redesign", "Product team", "Nov 04, 2024", "Medium", "In progress"], ["October payroll review", "Finance team", "Oct 24, 2024", "High", "Completed"], ["Website accessibility audit", "Engineering", "Nov 08, 2024", "Low", "In progress"]] },
  Projects: { columns: ["Project", "Owner", "Members", "Deadline", "Progress"], rows: [["Website redesign", "Riyas", "8 members", "Nov 15, 2024", "72%"], ["Mobile app v2", "Mansoor", "12 members", "Dec 04, 2024", "48%"], ["Q4 growth campaign", "Umar", "6 members", "Nov 01, 2024", "85%"]] },
  Documents: { columns: ["Document", "Category", "Last updated", "Owner", "Access"], rows: [["Employee handbook.pdf", "Company", "Oct 18, 2024", "Kamar", "Everyone"], ["Brand guidelines v3.fig", "Design", "Oct 17, 2024", "Riyas", "Department"], ["Q4 budget forecast.xlsx", "Finance", "Oct 16, 2024", "Kamar", "Restricted"]] },
  Inventory: { columns: ["Item", "Category", "Warehouse", "In stock", "Status"], rows: [["MacBook Pro 14-inch", "Electronics", "Main office", "12", "In stock"], ["Wireless keyboard", "Accessories", "Main office", "04", "Low stock"], ["USB-C docking station", "Accessories", "Warehouse A", "28", "In stock"]] },
  Finance: { columns: ["Expense", "Category", "Requested by", "Date", "Amount"], rows: [["Design software licenses", "Software", "Riyas", "Oct 22, 2024", "$2,480"], ["Team offsite travel", "Travel", "Mansoor", "Oct 21, 2024", "$1,250"], ["Office supplies", "Operations", "Umar", "Oct 20, 2024", "$384"]] },
  Announcements: { columns: ["Announcement", "Audience", "Published", "Priority", "Status"], rows: [["Q4 all-hands meeting", "Everyone", "Oct 22, 2024", "Important", "Published"], ["Open enrollment starts soon", "Everyone", "Oct 18, 2024", "Normal", "Published"], ["Design team showcase", "Design", "Oct 16, 2024", "Normal", "Published"]] },
  Reports: { columns: ["Report", "Category", "Last generated", "Owner"], rows: [["Headcount overview", "People", "Oct 23, 2024", "Kamar"], ["Attendance summary", "People", "Oct 22, 2024", "Kamar"], ["Department expenses", "Finance", "Oct 20, 2024", "Kamar"]] },
};

export const employeeModuleDatasets: Record<string, Dataset> = {
  Tasks: { columns: ["Task", "Team", "Due date", "Priority", "Status"], rows: [["Design system review", "Design team", "Oct 29, 2024", "High", "In progress"], ["Mobile prototype feedback", "Product team", "Oct 30, 2024", "Medium", "In progress"]] },
  Documents: { columns: ["Document", "Category", "Last updated", "Owner", "Access"], rows: [["Employee handbook.pdf", "Company", "Oct 18, 2024", "People team", "Everyone"], ["Brand guidelines v3.fig", "Design", "Oct 17, 2024", "Riyas", "Department"]] },
  Announcements: moduleDatasets.Announcements,
};

/** Columns rendered as status badges in module tables. */
export const badgeColumns = ["Status", "Priority", "Access"];
