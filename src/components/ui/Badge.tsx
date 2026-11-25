import { toneByStatus } from "@/lib/data";

/** Status pill; the colour is picked from the status text (Active, Pending, Rejected…). */
export default function Badge({ value }: { value: string }) {
  return <span className={`badge ${toneByStatus[value] ?? "neutral"}`}>{value}</span>;
}
