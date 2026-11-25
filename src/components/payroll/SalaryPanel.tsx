import { Banknote, CalendarClock, Download, HeartPulse, Landmark } from "lucide-react";
import type { Employee } from "@/lib/types";
import { breakdown, formatSAR, nextPayday, recentPeriods } from "@/lib/payroll";
import { downloadPayslip } from "@/lib/payslip";
import Bento from "@/components/ui/Bento";
import { Card, PanelHeader } from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import SalaryBreakdown from "./SalaryBreakdown";
import PayslipHistory from "./PayslipHistory";

/** Employee self-service salary page: summary tiles, split-up and payslip downloads. */
export default function SalaryPanel({ employee, notify }: { employee: Employee; notify: (message: string) => void }) {
  const pay = breakdown(employee.salary);
  const latest = recentPeriods(1)[0];
  const downloaded = (label: string) => notify(`${label} payslip downloaded`);

  return <Bento>
    <StatCard className="span-4" label="Net pay this month" value={formatSAR(pay.net)} hint={`Paid ${latest.payDate}`} icon={Banknote} tone="indigo" />
    <StatCard className="span-4" label="Gross monthly salary" value={formatSAR(pay.gross)} hint={`Annual ${formatSAR(pay.gross * 12)}`} icon={Landmark} tone="sky" />
    <StatCard className="span-4" label="Next payday" value={nextPayday()} hint="Salary is paid on the 27th" icon={CalendarClock} tone="emerald" />

    <Card className="span-7">
      <PanelHeader title="Salary split-up" subtitle="How your monthly pay is made up"
        action={<button className="primary" onClick={() => { downloadPayslip(employee, latest); downloaded(latest.label); }}><Download size={15} /> Latest payslip</button>} />
      <SalaryBreakdown salary={employee.salary} />
    </Card>
    <Card className="span-5">
      <PanelHeader title="Benefits" subtitle="Your cover and work details" />
      <dl className="detail-list">
        <div><dt><HeartPulse size={15} aria-hidden="true" /> Health insurance</dt><dd>{employee.insurance.provider}</dd></div>
        <div><dt>Insured company</dt><dd>{employee.insurance.insuredCompany}</dd></div>
        <div><dt>Work mode</dt><dd>{employee.workMode}</dd></div>
        <div><dt>Employee ID</dt><dd>{employee.id}</dd></div>
        <div><dt>Annual leave balance</dt><dd>12 days</dd></div>
      </dl>
    </Card>

    <Card flush className="span-12">
      <PanelHeader padded title="Payslips" subtitle="Download any of your last six payslips as a PDF" />
      <PayslipHistory employee={employee} onDownloaded={downloaded} />
    </Card>
  </Bento>;
}
