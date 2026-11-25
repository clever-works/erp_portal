import { company } from "./data";
import { breakdown, formatSAR, type PayslipPeriod } from "./payroll";
import { SimplePdf } from "./pdf";
import type { Employee } from "./types";

const BRAND = "#0081a7";
const BRAND_DEEP = "#003443";
const TEAL = "#00afb9";
const INK = "#001a22";
const MUTED = "#4a6a75";
const LINE = "#dbe5e3";
const SOFT = "#f3f8f8";

/** Builds a one-page A4 payslip PDF for one employee and month. */
export function buildPayslip(employee: Employee, period: PayslipPeriod) {
  const pdf = new SimplePdf();
  const W = pdf.width;
  const M = 40;
  const pay = breakdown(employee.salary);

  // Header band
  pdf.rect(0, 0, W, 96, BRAND_DEEP).rect(0, 92, W, 4, TEAL);
  pdf.text(M, 44, "Nexus ERP", { size: 20, bold: true, color: "#ffffff" });
  pdf.text(M, 64, company.name, { size: 10, color: "#bbefff" });
  pdf.text(W - M, 44, "PAYSLIP", { size: 20, bold: true, color: "#ffffff", align: "right" });
  pdf.text(W - M, 64, period.label, { size: 10, color: "#bbefff", align: "right" });

  // Employee + pay details
  let y = 130;
  const details: [string, string][] = [
    ["Employee name", employee.name], ["Employee ID", employee.id], ["Department", employee.department], ["Job title", employee.role],
    ["Pay period", period.label], ["Pay date", period.payDate], ["Work mode", employee.workMode], ["Health insurance", employee.insurance.provider],
  ];
  pdf.rect(M, y - 18, W - M * 2, 96, SOFT);
  details.forEach(([label, value], i) => {
    const col = i % 2; const row = Math.floor(i / 2);
    const x = M + 14 + col * ((W - M * 2) / 2);
    const ly = y + row * 20;
    pdf.text(x, ly, label, { size: 8.5, color: MUTED });
    pdf.text(x + 100, ly, value, { size: 9.5, bold: true, color: INK });
  });

  // Earnings and deductions tables
  y = 250;
  const colW = (W - M * 2 - 20) / 2;
  const table = (x: number, title: string, lines: { label: string; amount: number }[], totalLabel: string, total: number) => {
    pdf.rect(x, y, colW, 26, BRAND).text(x + 12, y + 17, title, { size: 10, bold: true, color: "#ffffff" }).text(x + colW - 12, y + 17, "Amount", { size: 10, bold: true, color: "#ffffff", align: "right" });
    let ly = y + 46;
    lines.forEach((line) => {
      pdf.text(x + 12, ly, line.label, { size: 9.5, color: INK }).text(x + colW - 12, ly, formatSAR(line.amount), { size: 9.5, color: INK, align: "right" });
      pdf.line(x, ly + 8, x + colW, ly + 8, LINE);
      ly += 24;
    });
    pdf.text(x + 12, y + 162, totalLabel, { size: 10, bold: true, color: INK }).text(x + colW - 12, y + 162, formatSAR(total), { size: 10, bold: true, color: INK, align: "right" });
    pdf.line(x, y + 148, x + colW, y + 148, BRAND, 1);
  };
  table(M, "Earnings", pay.earnings, "Gross earnings", pay.gross);
  table(M + colW + 20, "Deductions", pay.deductions, "Total deductions", pay.totalDeductions);

  // Net pay band
  y = 450;
  pdf.rect(M, y, W - M * 2, 64, "#e3f5fa").rect(M, y, 5, 64, TEAL);
  pdf.text(M + 20, y + 26, "NET PAY", { size: 9, bold: true, color: MUTED });
  pdf.text(M + 20, y + 48, "Transferred to your registered bank account", { size: 9, color: MUTED });
  pdf.text(W - M - 16, y + 42, formatSAR(pay.net), { size: 22, bold: true, color: BRAND_DEEP, align: "right" });

  // Notes
  y = 550;
  pdf.text(M, y, "Notes", { size: 10, bold: true, color: INK });
  pdf.text(M, y + 18, "GOSI is calculated at 9.75% of basic salary plus housing allowance (employee share).", { size: 9, color: MUTED });
  pdf.text(M, y + 34, `Medical cover: ${employee.insurance.provider}. Insured company: ${employee.insurance.insuredCompany}.`, { size: 9, color: MUTED });

  // Footer
  pdf.line(M, 780, W - M, 780, LINE);
  pdf.text(M, 798, `${company.name}  |  CR ${company.crNumber}  |  ${company.city}`, { size: 8.5, color: MUTED });
  pdf.text(W - M, 798, "System-generated payslip. No signature required.", { size: 8.5, color: MUTED, align: "right" });

  return pdf.toBlob();
}

/** Builds the payslip and starts the browser download. */
export function downloadPayslip(employee: Employee, period: PayslipPeriod) {
  const url = URL.createObjectURL(buildPayslip(employee, period));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `payslip-${employee.name.toLowerCase().replace(/\s+/g, "-")}-${period.key}.pdf`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
