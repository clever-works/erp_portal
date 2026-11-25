/** Thin progress bar; `value` is 0–100. */
export default function ProgressBar({ value }: { value: number }) {
  return <div className="progressline"><i style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>;
}
