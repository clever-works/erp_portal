import { Download } from "lucide-react";
import type { Employee } from "@/lib/types";
import { breakdown, formatSAR, recentPeriods } from "@/lib/payroll";
import { downloadPayslip } from "@/lib/payslip";
import Badge from "@/components/ui/Badge";

/** Last six payslips with a PDF download button on each row. */
export default function PayslipHistory({ employee, onDownloaded }: { employee: Employee; onDownloaded?: (label: string) => void }) {
  const pay = breakdown(employee.salary);
  const periods = recentPeriods(6);
  return <div className="tablewrap" role="region" aria-label="Payslip history" tabIndex={0}>
    <table className="table" aria-label="Payslips">
      <thead><tr><th scope="col">Month</th><th scope="col">Pay date</th><th scope="col" className="num-col">Gross</th><th scope="col" className="num-col">Deductions</th><th scope="col" className="num-col">Net pay</th><th scope="col">Status</th><th scope="col" className="actions-col"><span className="sr-only">Download</span></th></tr></thead>
      <tbody>{periods.map((period) => <tr key={period.key}>
        <td className="strong-cell">{period.label}</td>
        <td className="muted-cell">{period.payDate}</td>
        <td className="num-col">{formatSAR(pay.gross)}</td>
        <td className="num-col muted-cell">− {formatSAR(pay.totalDeductions)}</td>
        <td className="num-col"><span className="num-cell">{formatSAR(pay.net)}</span></td>
        <td><Badge value={period.status} /></td>
        <td className="actions-col"><button className="outline small-btn" aria-label={`Download ${period.label} payslip`} onClick={() => { downloadPayslip(employee, period); onDownloaded?.(period.label); }}><Download size={14} /> PDF</button></td>
      </tr>)}</tbody>
    </table>
  </div>;
}
