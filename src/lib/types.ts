import type { LucideIcon } from "lucide-react";

export type WorkMode = "Office" | "Remote";
/** Monthly package in SAR. */
export type SalaryPackage = { basic: number; housing: number; transport: number; other: number };
export type Insurance = { provider: string; insuredCompany: string };
export type SkillLevel = "Beginner" | "Intermediate" | "Advanced";
export type Skill = { id: number; name: string; level: SkillLevel };
/** A certificate can carry a link, an uploaded file (kept as a data URL in this browser), or both. */
export type Certificate = { id: number; name: string; issuer: string; issued: string; link?: string; file?: { name: string; type: string; dataUrl: string } };
export type Employee = {
  id: string; name: string; email: string; department: string; role: string; status: string; initials: string; color: string;
  phone: string; extension: string; workMode: WorkMode; salary: SalaryPackage; insurance: Insurance;
  skills: Skill[]; certificates: Certificate[];
};
/** Fields an admin fills in when adding a team member. */
export type NewEmployee = Pick<Employee, "name" | "department" | "role" | "phone" | "extension" | "workMode" | "salary" | "insurance">;
export type DemoUser = { email: string; password: string; name: string; role: "admin" | "employee"; department: string; jobTitle: string; initials: string; employeeId: string };
/** `id` links an employee's own request to the admin's copy; `late` = sick leave filed after the fact. */
export type Leave = { name: string; kind: string; dates: string; initials: string; color: string; status: string; id?: number; late?: boolean; reason?: string };
export type PersonalLeave = { kind: string; dates: string; status: string; id?: number; start?: string; end?: string; late?: boolean; reason?: string };
/** Who a notice or announcement is for: admins only, everyone, or a list of departments. */
export type Audience = "admin" | "everyone" | string[];
/** `employeeId` targets one employee (e.g. "your WFH request was approved"). */
export type InboxNotice = { id: number; title: string; body: string; time: string; page: string; read: boolean; audience?: Audience; createdAt?: string; fromAnnouncement?: boolean; employeeId?: string };
export type Department = { name: string; head: string; headcount: number; budget: number; status: string };
export type Announcement = { id: number; title: string; body: string; audience: "everyone" | string[]; priority: "Normal" | "Important"; publishedAt: string; author: string };
export type EmployeeAttendance = { date: string; checkInAt: string; checkOutAt: string | null };
/** `count` names which pending-items badge (if any) the menu item shows. */
export type NavItem = { label: string; icon: LucideIcon; count?: "leave" | "wfh"; employeeOnly?: boolean };
export type WfhRequest = { id: number; employeeId: string; name: string; initials: string; color: string; start: string; end: string; reason: string; status: "Pending" | "Approved" | "Rejected"; requestedAt: string };
export type NavGroup = { title: string; items: NavItem[] };
export type Dataset = { columns: string[]; rows: string[][] };
/** "admin" is the built-in administrator profile card. */
export type ProfileTarget = Employee | "admin";
