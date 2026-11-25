import { CalendarDays, TrendingUp, Users } from "lucide-react";

const bars = [38, 52, 46, 64, 58, 72, 66, 84];

/** Floating glass "product preview" tiles shown beside the sign-in form. Decorative only. */
export default function LoginShowcase() {
  return <div className="auth-showcase" aria-hidden="true">
    <div className="float-tile tile-a">
      <span className="ft-icon"><Users size={16} /></span>
      <span className="ft-label">Team members</span>
      <strong>241</strong>
      <span className="ft-chip"><TrendingUp size={12} /> +12.5%</span>
    </div>
    <div className="float-tile tile-b">
      <span className="ft-label">Present today</span>
      <div className="ft-ring"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" className="track" /><circle cx="32" cy="32" r="26" className="value" /></svg><b>90%</b></div>
    </div>
    <div className="float-tile tile-c">
      <span className="ft-label">Headcount growth</span>
      <div className="ft-bars">{bars.map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div>
    </div>
    <div className="float-tile tile-d">
      <span className="ft-icon coral"><CalendarDays size={16} /></span>
      <div><strong>3 leave requests</strong><span className="ft-label">waiting for approval</span></div>
    </div>
  </div>;
}
