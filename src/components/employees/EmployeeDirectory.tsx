"use client";

import { useMemo, useState } from "react";
import type { Employee } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import SearchBox from "@/components/ui/SearchBox";
import EmployeeTable from "./EmployeeTable";

/** Employees page body: search, status filter and the full table. */
export default function EmployeeDirectory({ employees, onSelect }: { employees: Employee[]; onSelect: (employee: Employee) => void }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All employees");
  const filtered = useMemo(() => employees.filter((person) =>
    `${person.name} ${person.email} ${person.department} ${person.role} ${person.phone} ${person.extension}`.toLowerCase().includes(query.toLowerCase())
    && (filter === "All employees" || person.status === filter || person.workMode === filter)), [employees, query, filter]);

  return <>
    <div className="filters">
      <SearchBox label="Search employees" placeholder="Search name, email, phone or ext…" value={query} onChange={setQuery} />
      <select className="filterselect" aria-label="Filter employees" value={filter} onChange={(event) => setFilter(event.target.value)}><option>All employees</option><option>Active</option><option>On leave</option><option>Office</option><option>Remote</option></select>
      <span className="filters-count">{filtered.length} team members</span>
    </div>
    <Card flush>
      <EmployeeTable employees={filtered} onSelect={onSelect} />
      {filtered.length === 0 && <div className="emptystate">No employees match your search.</div>}
    </Card>
  </>;
}
