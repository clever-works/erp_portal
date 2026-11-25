"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import type { Employee, SkillLevel } from "@/lib/types";
import { skillLevels } from "@/lib/data";
import { exportEmployeesCsv } from "@/lib/exports";
import { fileSlug } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import SearchBox from "@/components/ui/SearchBox";
import { levelRank } from "@/components/skills/SkillsView";
import EmployeeTable from "./EmployeeTable";

/**
 * Employees page body: search (also matches skills), employment status (Active / On leave / Inactive),
 * work mode (Office / Remote), skill + minimum level, and the table. Inactive people show greyed out.
 * Export CSV downloads only the rows currently shown, named after the active filters.
 */
export default function EmployeeDirectory({ employees, onSelect, onExported }: { employees: Employee[]; onSelect: (employee: Employee) => void; onExported?: (count: number) => void }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [mode, setMode] = useState("All work modes");
  const [skill, setSkill] = useState("Any skill");
  const [minLevel, setMinLevel] = useState<"Any level" | SkillLevel>("Any level");

  const allSkills = useMemo(() => [...new Set(employees.flatMap((e) => (e.skills ?? []).map((s) => s.name)))].sort((a, b) => a.localeCompare(b)), [employees]);

  const filtered = useMemo(() => employees.filter((person) => {
    const skills = person.skills ?? [];
    const text = `${person.name} ${person.email} ${person.department} ${person.role} ${person.phone} ${person.extension} ${skills.map((s) => s.name).join(" ")}`.toLowerCase();
    if (!text.includes(query.toLowerCase())) return false;
    if (status !== "All statuses" && person.status !== status) return false;
    if (mode !== "All work modes" && person.workMode !== mode) return false;
    if (skill !== "Any skill" || minLevel !== "Any level") {
      const need = minLevel === "Any level" ? 1 : levelRank[minLevel];
      return skills.some((s) => (skill === "Any skill" || s.name === skill) && levelRank[s.level] >= need);
    }
    return true;
  }), [employees, query, status, mode, skill, minLevel]);

  return <>
    <div className="filters">
      <SearchBox label="Search employees" placeholder="Search name, email, phone, ext. or skill…" value={query} onChange={setQuery} />
      <select className="filterselect" aria-label="Filter by employment status" value={status} onChange={(event) => setStatus(event.target.value)}><option>All statuses</option><option>Active</option><option>On leave</option><option>Inactive</option></select>
      <select className="filterselect" aria-label="Filter by work mode" value={mode} onChange={(event) => setMode(event.target.value)}><option>All work modes</option><option>Office</option><option>Remote</option></select>
      <select className="filterselect" aria-label="Filter by skill" value={skill} onChange={(event) => setSkill(event.target.value)}><option>Any skill</option>{allSkills.map((s) => <option key={s}>{s}</option>)}</select>
      <select className="filterselect" aria-label="Minimum skill level" value={minLevel} onChange={(event) => setMinLevel(event.target.value as "Any level" | SkillLevel)}><option>Any level</option>{skillLevels.map((l) => <option key={l} value={l}>{l === "Advanced" ? "Advanced" : `${l} or above`}</option>)}</select>
      <span className="filters-count">{filtered.length} team members</span>
      <button className="outline" disabled={filtered.length === 0} onClick={() => {
        const parts = [status !== "All statuses" && status, mode !== "All work modes" && mode, skill !== "Any skill" && skill, minLevel !== "Any level" && `${minLevel}-plus`, query.trim() && `search-${query.trim()}`].filter(Boolean) as string[];
        exportEmployeesCsv(filtered, `${["employees", ...parts.map(fileSlug)].join("-")}.csv`);
        onExported?.(filtered.length);
      }}><Download size={15} aria-hidden="true" /> Export CSV</button>
    </div>
    <Card flush>
      <EmployeeTable employees={filtered} onSelect={onSelect} />
      {filtered.length === 0 && <div className="emptystate">No employees match these filters.</div>}
    </Card>
  </>;
}
