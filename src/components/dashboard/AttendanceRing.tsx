import { Card, PanelHeader } from "@/components/ui/Card";

type Segment = { label: string; value: number; tone: "present" | "remote" | "leave" };

/** Ring gauge of today's attendance (Office, Remote, Leave) with a small legend. The ring shows who is working. */
export default function AttendanceRing({ total, segments, onOpen, className = "" }: { total: number; segments: Segment[]; onOpen?: () => void; className?: string }) {
  const present = segments.filter((segment) => segment.tone !== "leave").reduce((sum, segment) => sum + segment.value, 0);
  const pct = total ? Math.round((present / total) * 100) : 0;
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  return <Card className={`ring-tile ${className}`}>
    <PanelHeader title="Today's attendance" subtitle={`${total} people scheduled`} action={onOpen && <button className="linkbtn" onClick={onOpen}>Open</button>} />
    <div className="ring-body">
      <div className="att-ring" role="img" aria-label={`${pct}% of the team is working today`}>
        <svg viewBox="0 0 128 128" aria-hidden="true">
          <circle className="ring-track" cx="64" cy="64" r={radius} />
          <circle className="ring-value" cx="64" cy="64" r={radius} strokeDasharray={circumference} strokeDashoffset={circumference * (1 - pct / 100)} />
        </svg>
        <div className="ring-label"><strong>{pct}%</strong><span>working</span></div>
      </div>
      <ul className="ring-legend">{segments.map((segment) => <li key={segment.label}><i className={segment.tone} /><span>{segment.label}</span><b>{segment.value}</b></li>)}</ul>
    </div>
  </Card>;
}
