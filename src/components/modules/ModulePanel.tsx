"use client";

import { useState } from "react";
import { Download, Filter } from "lucide-react";
import { employeeModuleDatasets, moduleDatasets } from "@/lib/data";
import { downloadCsv } from "@/lib/utils";
import type { Dataset } from "@/lib/types";
import { Card, PanelHeader } from "@/components/ui/Card";
import SearchBox from "@/components/ui/SearchBox";
import DataTable from "./DataTable";
import RecordDetailsModal from "./RecordDetailsModal";

/** Searchable records page used by Departments, Tasks, Projects, Documents, Inventory, Finance, Announcements and Reports. */
export default function ModulePanel({ page, notify, employeeMode = false, dataset }: { page: string; notify: (message: string) => void; employeeMode?: boolean; dataset?: Dataset }) {
  const [term, setTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState<string[] | null>(null);
  const data = dataset ?? (employeeMode ? employeeModuleDatasets[page] : undefined) ?? moduleDatasets[page] ?? moduleDatasets.Tasks;
  const filtered = data.rows.filter((row) => row.join(" ").toLowerCase().includes(term.toLowerCase()));
  const exportRow = (row: string[]) => downloadCsv(`${page.toLowerCase()}-${row[0].toLowerCase().replaceAll(" ", "-")}.csv`, data.columns, [row]);

  return <>
    <div className="filters">
      <SearchBox label={`Search ${page.toLowerCase()}`} placeholder={`Search ${page.toLowerCase()}…`} value={term} onChange={setTerm} />
      <button className="outline" onClick={() => notify("Filters are up to date")}><Filter size={15} aria-hidden="true" /> Filters</button>
      <button className="outline filters-end" onClick={() => notify(`${page} report downloaded`)}><Download size={15} aria-hidden="true" /> Export</button>
    </div>
    <Card flush>
      <PanelHeader padded title={`${page} overview`} subtitle={`${filtered.length} records in your workspace`} liveSubtitle />
      <DataTable title={page} data={data} rows={filtered} onView={setSelectedRow} onExportRow={exportRow} />
      {filtered.length === 0 && <div className="emptystate" role="status">No records match your search.</div>}
    </Card>
    {selectedRow && <RecordDetailsModal page={page} columns={data.columns} row={selectedRow} onClose={() => setSelectedRow(null)} />}
  </>;
}
