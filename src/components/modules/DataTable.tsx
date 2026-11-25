import type { ReactNode } from "react";
import type { Dataset } from "@/lib/types";
import TableActionMenu from "@/components/ui/TableActionMenu";
import ModuleCell from "./ModuleCell";

/**
 * Generic records table with a per-row "View details / Export row" menu.
 * `rowAction` adds a visible button per row (e.g. Download on Documents).
 */
export default function DataTable({ title, data, rows, onView, onExportRow, rowAction }: { title: string; data: Dataset; rows: string[][]; onView: (row: string[]) => void; onExportRow?: (row: string[]) => void; rowAction?: (row: string[]) => ReactNode }) {
  return <div className="tablewrap" role="region" aria-label={`${title} records`} tabIndex={0}>
    <table className="table" aria-label={`${title} data`}>
      <thead><tr>{data.columns.map((column) => <th scope="col" key={column}>{column}</th>)}{rowAction && <th scope="col"><span className="sr-only">Download</span></th>}<th scope="col" className="actions-col"><span className="sr-only">Actions</span></th></tr></thead>
      <tbody>{rows.map((row) => <tr key={row[0]}>
        {row.map((cell, i) => <td key={i} className={i === 0 ? "strong-cell" : ""}><ModuleCell column={data.columns[i]} value={cell} /></td>)}
        {rowAction && <td className="nowrap">{rowAction(row)}</td>}
        <td className="actions-col"><TableActionMenu label={row[0]}>
          <button aria-label={`View details for ${row[0]}`} onClick={() => onView(row)}>View details</button>
          {onExportRow && <button aria-label={`Export ${row[0]} row as CSV`} onClick={() => onExportRow(row)}>Export row as CSV</button>}
        </TableActionMenu></td>
      </tr>)}</tbody>
    </table>
  </div>;
}
