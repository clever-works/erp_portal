"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight, Search } from "lucide-react";
import type { NavItem } from "@/lib/types";

/** Module jump search in the top bar. Opens with Ctrl/Cmd + K, arrow keys to move, Enter to go. */
export default function QuickSearch({ items, onNavigate }: { items: NavItem[]; onNavigate: (page: string) => void }) {
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); inputRef.current?.focus(); setOpen(true); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = items.filter((item) => item.label.toLowerCase().includes(term.trim().toLowerCase()));
  const go = (label: string) => { onNavigate(label); setTerm(""); setOpen(false); inputRef.current?.blur(); };

  return <div className="quicksearch">
    <label className="searchbox">
      <Search size={15} aria-hidden="true" />
      <input ref={inputRef} aria-label="Search workspace modules" placeholder="Search modules…" value={term}
        onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}
        onChange={(event) => { setTerm(event.target.value); setIndex(0); setOpen(true); }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") { event.preventDefault(); setIndex((i) => Math.min(i + 1, results.length - 1)); }
          else if (event.key === "ArrowUp") { event.preventDefault(); setIndex((i) => Math.max(i - 1, 0)); }
          else if (event.key === "Enter" && results[index]) go(results[index].label);
          else if (event.key === "Escape") { setOpen(false); inputRef.current?.blur(); }
        }} />
      <kbd>Ctrl K</kbd>
    </label>
    {open && <div className="quicksearch-results" role="listbox" aria-label="Modules">
      {results.length
        ? results.map((item, i) => { const Icon = item.icon; return <button key={item.label} role="option" aria-selected={i === index} className={i === index ? "selected" : ""} onMouseDown={(event) => event.preventDefault()} onMouseEnter={() => setIndex(i)} onClick={() => go(item.label)}><Icon size={15} aria-hidden="true" /><span>{item.label}</span><ChevronRight size={14} className="go" aria-hidden="true" /></button>; })
        : <div className="quicksearch-empty">No modules found</div>}
    </div>}
  </div>;
}
