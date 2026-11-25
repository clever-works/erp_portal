"use client";

import { useEffect, useState } from "react";
import { Card, PanelHeader } from "@/components/ui/Card";

type SettingKey = "Organization name" | "Work week" | "Leave approval" | "Theme";

const definitions: { key: SettingKey; description: string; options?: string[] }[] = [
  { key: "Organization name", description: "Your company display name" },
  { key: "Work week", description: "Standard work days", options: ["Sunday – Thursday", "Monday – Friday", "Monday – Saturday"] },
  { key: "Leave approval", description: "Approval workflow", options: ["Manager → HR", "Manager only", "HR only"] },
  { key: "Theme", description: "Workspace appearance", options: ["System default", "Light", "Dark"] },
];

/** Editable workspace settings, saved to this browser. */
export default function SettingsPanel({ dark, onThemeChange, notify }: { dark: boolean; onThemeChange: (mode: string) => void; notify: (message: string) => void }) {
  const [values, setValues] = useState<Record<SettingKey, string>>({ "Organization name": "Acme Corporation", "Work week": "Sunday – Thursday", "Leave approval": "Manager → HR", Theme: dark ? "Dark" : "Light" });
  const [editing, setEditing] = useState<SettingKey | null>(null);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    try { const saved = localStorage.getItem("nexus-settings"); if (saved) setValues((current) => ({ ...current, ...JSON.parse(saved) })); } catch { /* use the workspace defaults */ }
  }, []);

  const beginEdit = (key: SettingKey) => { setEditing(key); setDraft(values[key]); };
  const save = () => {
    if (!editing || (editing === "Organization name" && !draft.trim())) return;
    const updated = { ...values, [editing]: draft.trim() };
    setValues(updated);
    try { localStorage.setItem("nexus-settings", JSON.stringify(updated)); } catch { /* changes remain available for this session */ }
    if (editing === "Theme") onThemeChange(draft);
    notify(`${editing} updated`);
    setEditing(null);
  };

  return <Card className="settings-panel">
    <PanelHeader title="Workspace settings" subtitle="Update organization preferences and defaults" />
    <div className="settings-list">{definitions.map(({ key, description, options }) => <div className="setting-row" key={key}>
      <div className="setting-label"><h3>{key}</h3><p>{description}</p></div>
      <div className="setting-value">{editing === key ? options
        ? <select className="filterselect" aria-label={`Edit ${key}`} value={draft} onChange={(event) => setDraft(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select>
        : <input className="filterinput" aria-label="Edit organization name" value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") save(); }} />
        : <span>{values[key]}</span>}</div>
      <div className="setting-actions">{editing === key
        ? <><button className="primary" onClick={save}>Save</button><button className="outline" onClick={() => setEditing(null)}>Cancel</button></>
        : <button className="outline" aria-label={`Edit ${key}`} onClick={() => beginEdit(key)}>Edit</button>}</div>
    </div>)}</div>
  </Card>;
}
