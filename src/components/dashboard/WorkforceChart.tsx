import { headcountLastYear, headcountThisYear, months } from "@/lib/data";
import { Card, PanelHeader } from "@/components/ui/Card";

/** Monthly headcount bar chart, this year vs last year. Values are % of a 300-person scale. */
export default function WorkforceChart({ current = headcountThisYear, previous = headcountLastYear, className = "" }: { current?: number[]; previous?: number[]; className?: string }) {
  return <Card className={className}>
    <PanelHeader title="Workforce overview" subtitle="Headcount growth throughout the year"
      action={<div className="panel-tools"><div className="legend"><span><i className="current" /> This year</span><span><i /> Last year</span></div><select className="filterselect" aria-label="Chart period"><option>This year</option><option>Last year</option></select></div>} />
    <div className="chart-wrap">
      <div className="chart-axis" aria-hidden="true">{[300, 200, 100, 0].map((v) => <span key={v}>{v}</span>)}</div>
      <div className="chart-body">
        <div className="chart" role="img" aria-label="Workforce overview bar chart comparing this year's headcount with last year, January through December">
          {months.map((month, i) => <div className="barcol" key={month} data-tip={`${month}: ${current[i] * 3} vs ${previous[i] * 3}`} aria-hidden="true">
            <div className="bar current" style={{ height: `${current[i]}%` }} />
            <div className="bar last" style={{ height: `${previous[i]}%` }} />
          </div>)}
        </div>
        <div className="months" aria-hidden="true">{months.map((month) => <span key={month}>{month}</span>)}</div>
      </div>
    </div>
  </Card>;
}
