import { company } from "./data";
import type { SalaryPackage } from "./types";

/** Employee share of GOSI for Saudi nationals (annuities + SANED), charged on basic + housing. */
export const GOSI_RATE = 0.0975;

export type PayLine = { label: string; amount: number };
export type SalaryBreakdown = { earnings: PayLine[]; deductions: PayLine[]; gross: number; totalDeductions: number; net: number };

export function formatSAR(amount: number) {
  return `SAR ${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function grossOf(salary: SalaryPackage) { return salary.basic + salary.housing + salary.transport + salary.other; }

/** Splits a monthly package into earnings, deductions and net pay. */
export function breakdown(salary: SalaryPackage): SalaryBreakdown {
  const earnings: PayLine[] = [
    { label: "Basic salary", amount: salary.basic },
    { label: "Housing allowance", amount: salary.housing },
    { label: "Transport allowance", amount: salary.transport },
    { label: "Other allowances", amount: salary.other },
  ];
  const gosi = Math.round((salary.basic + salary.housing) * GOSI_RATE * 100) / 100;
  const deductions: PayLine[] = [{ label: "GOSI (9.75%)", amount: gosi }];
  const gross = grossOf(salary);
  const totalDeductions = deductions.reduce((sum, line) => sum + line.amount, 0);
  return { earnings, deductions, gross, totalDeductions, net: gross - totalDeductions };
}

export type PayslipPeriod = { key: string; label: string; payDate: string; status: "Paid" };

/** The last `count` paid months, newest first (this month counts once payday has passed). */
export function recentPeriods(count = 6, today = new Date()): PayslipPeriod[] {
  const periods: PayslipPeriod[] = [];
  const start = new Date(today.getFullYear(), today.getMonth() - (today.getDate() >= company.payday ? 0 : 1), 1);
  for (let i = 0; i < count; i++) {
    const month = new Date(start.getFullYear(), start.getMonth() - i, 1);
    const payDate = new Date(month.getFullYear(), month.getMonth(), company.payday);
    periods.push({
      key: `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`,
      label: month.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      payDate: payDate.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
      status: "Paid",
    });
  }
  return periods;
}

/** Next payday from today. */
export function nextPayday(today = new Date()) {
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), company.payday);
  const next = today.getDate() < company.payday ? thisMonth : new Date(today.getFullYear(), today.getMonth() + 1, company.payday);
  return next.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}
