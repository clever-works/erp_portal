import { badgeColumns } from "@/lib/data";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";

/** Renders one table cell based on its column: badge, progress bar, money or plain text. */
export default function ModuleCell({ column, value }: { column: string; value: string }) {
  if (badgeColumns.includes(column)) return <Badge value={value} />;
  if (column === "Progress") return <div className="cell-progress"><ProgressBar value={parseInt(value, 10) || 0} /><span>{value}</span></div>;
  if (column === "Amount" || column === "Annual budget") return <span className="num-cell">{value}</span>;
  return <>{value}</>;
}
