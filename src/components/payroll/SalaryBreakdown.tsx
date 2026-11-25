import type { SalaryPackage } from "@/lib/types";
import { breakdown, formatSAR } from "@/lib/payroll";

const segmentTone = ["basic", "housing", "transport", "other"];

/** Salary split-up: a proportion bar, then earnings, deductions and net pay. */
export default function SalaryBreakdown({ salary, compact = false }: { salary: SalaryPackage; compact?: boolean }) {
  const pay = breakdown(salary);
  return <div className={`salary-breakdown${compact ? " compact" : ""}`}>
    <div className="split-bar" role="img" aria-label="Share of each earning in the gross salary">
      {pay.earnings.map((line, i) => pay.gross > 0 && line.amount > 0 && <i key={line.label} className={segmentTone[i]} style={{ width: `${(line.amount / pay.gross) * 100}%` }} title={`${line.label}: ${formatSAR(line.amount)}`} />)}
    </div>
    <div className="split-cols">
      <div>
        <h3>Earnings</h3>
        <ul>{pay.earnings.map((line, i) => <li key={line.label}><span><i className={`dot ${segmentTone[i]}`} />{line.label}</span><b>{formatSAR(line.amount)}</b></li>)}</ul>
        <p className="split-total"><span>Gross</span><b>{formatSAR(pay.gross)}</b></p>
      </div>
      <div>
        <h3>Deductions</h3>
        <ul>{pay.deductions.map((line) => <li key={line.label}><span><i className="dot deduction" />{line.label}</span><b>− {formatSAR(line.amount)}</b></li>)}</ul>
        <p className="split-total"><span>Total deductions</span><b>− {formatSAR(pay.totalDeductions)}</b></p>
      </div>
    </div>
    <div className="net-pay"><span>Net pay</span><strong>{formatSAR(pay.net)}</strong></div>
  </div>;
}
