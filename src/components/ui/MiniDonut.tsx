export type DonutSegment = { label: string; value: number; color: string };

const R = 24;
const C = 2 * Math.PI * R;
const GAP = 2.2; // surface gap between segments, in path units

/**
 * Small donut (pie) chart with a hover tooltip per segment and a legend.
 * Colours should be CSS variables or palette hexes; text always uses text tokens.
 */
export default function MiniDonut({ segments, center, label }: { segments: DonutSegment[]; center?: string; label: string }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const shown = segments.filter((s) => s.value > 0);
  let offset = 0;
  return <div className="mini-donut">
    <svg viewBox="0 0 64 64" role="img" aria-label={`${label}: ${segments.map((s) => `${s.label} ${s.value}`).join(", ")}`}>
      <circle cx="32" cy="32" r={R} className="mini-donut-track" />
      {total > 0 && shown.map((s) => {
        const length = (s.value / total) * C;
        const dash = shown.length > 1 ? Math.max(0, length - GAP) : length;
        const el = <circle key={s.label} cx="32" cy="32" r={R} stroke={s.color} strokeDasharray={`${dash} ${C - dash}`} strokeDashoffset={-offset} className="mini-donut-seg"><title>{`${s.label}: ${s.value}`}</title></circle>;
        offset += length;
        return el;
      })}
      {center && <text x="32" y="32" className="mini-donut-center" dominantBaseline="central" textAnchor="middle">{center}</text>}
    </svg>
    <ul className="mini-donut-legend">{segments.map((s) => <li key={s.label}><i style={{ background: s.color }} /><span>{s.label}</span><b>{s.value}</b></li>)}</ul>
  </div>;
}
