"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { employeeModuleDatasets, moduleDatasets } from "@/lib/data";
import { downloadCsv, fileSlug } from "@/lib/utils";
import { downloadDocumentPdf } from "@/lib/documentPdf";
import type { Dataset } from "@/lib/types";
import { Card, PanelHeader } from "@/components/ui/Card";
import SearchBox from "@/components/ui/SearchBox";
import DataTable from "./DataTable";
import RecordDetailsModal from "./RecordDetailsModal";

/** Searchable records page used by Departments, Tasks, Projects, Documents, Inventory, Finance and Reports. Export downloads the rows currently shown. */
export default function ModulePanel({ page, notify, employeeMode = false, dataset }: { page: string; notify: (message: string) => void; employeeMode?: boolean; dataset?: Dataset }) {
  const [term, setTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState<string[] | null>(null);
  const data = dataset ?? (employeeMode ? employeeModuleDatasets[page] : undefined) ?? moduleDatasets[page] ?? moduleDatasets.Tasks;
  const filtered = data.rows.filter((row) => row.join(" ").toLowerCase().includes(term.toLowerCase()));
  const exportRow = (row: string[]) => downloadCsv(`${fileSlug(page)}-${fileSlug(row[0])}.csv`, data.columns, [row]);

  return <>
    <div className="filters">
      <SearchBox label={`Search ${page.toLowerCase()}`} placeholder={`Search ${page.toLowerCase()}…`} value={term} onChange={setTerm} />
      {page !== "Documents" && <button className="outline filters-end" disabled={filtered.length === 0} onClick={() => {
        downloadCsv(`${[fileSlug(page), term.trim() && `search-${fileSlug(term)}`].filter(Boolean).join("-")}.csv`, data.columns, filtered);
        notify(`${filtered.length} ${page.toLowerCase()} record${filtered.length === 1 ? "" : "s"} exported`);
      }}><Download size={15} aria-hidden="true" /> Export CSV</button>}
    </div>
    <Card flush>
      <PanelHeader padded title={`${page} overview`} subtitle={`${filtered.length} records in your workspace`} liveSubtitle />
      <DataTable title={page} data={data} rows={filtered} onView={setSelectedRow}
        onExportRow={page === "Documents" ? undefined : exportRow}
        rowAction={page === "Documents" ? (row) => <button className="outline small-btn" aria-label={`Download ${row[0]} as PDF`} onClick={() => { downloadDocumentPdf(data.columns, row); notify(`${row[0].replace(/\.[a-z0-9]+$/i, "")} downloaded`); }}><Download size={14} aria-hidden="true" /> PDF</button> : undefined} />
      {filtered.length === 0 && <div className="emptystate" role="status">No records match your search.</div>}
    </Card>
    {selectedRow && <RecordDetailsModal page={page} columns={data.columns} row={selectedRow} onClose={() => setSelectedRow(null)} />}
  </>;
}
