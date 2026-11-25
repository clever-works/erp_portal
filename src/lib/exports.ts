import type { Employee } from "./types";
import { grossOf } from "./payroll";
import { downloadCsv } from "./utils";

const columns = ["Employee ID", "Name", "Email", "Phone", "Extension", "Department", "Job title", "Work mode", "Status",
  "Basic (SAR)", "Housing (SAR)", "Transport (SAR)", "Other (SAR)", "Gross (SAR)", "Insurance provider", "Insured company", "Skills", "Certificates"];

/** Downloads exactly the employees passed in (e.g. the filtered list), one row each. */
export function exportEmployeesCsv(employees: Employee[], filename = "employees.csv") {
  downloadCsv(filename, columns, employees.map((e) => [
    e.id, e.name, e.email, e.phone, e.extension, e.department, e.role, e.workMode, e.status,
    ...[e.salary.basic, e.salary.housing, e.salary.transport, e.salary.other, grossOf(e.salary)].map(String),
    e.insurance.provider, e.insurance.insuredCompany,
    (e.skills ?? []).map((s) => `${s.name} (${s.level})`).join("; "),
    (e.certificates ?? []).map((c) => `${c.name} – ${c.issuer}`).join("; "),
  ]));
}
