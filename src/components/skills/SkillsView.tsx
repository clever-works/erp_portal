import { Award, Download, ExternalLink, X } from "lucide-react";
import type { Certificate, Skill, SkillLevel } from "@/lib/types";
import { skillLevels } from "@/lib/data";
import Badge from "@/components/ui/Badge";

const levelRank: Record<SkillLevel, number> = { Beginner: 1, Intermediate: 2, Advanced: 3 };

/** Skill chips, strongest first, each with its level. Editable when handlers are passed. */
export function SkillChips({ skills, onLevel, onRemove, empty = "No skills added yet." }: { skills: Skill[]; onLevel?: (id: number, level: SkillLevel) => void; onRemove?: (id: number) => void; empty?: string }) {
  if (!skills.length) return <p className="skills-empty">{empty}</p>;
  const sorted = [...skills].sort((a, b) => levelRank[b.level] - levelRank[a.level] || a.name.localeCompare(b.name));
  return <ul className="skill-chips">{sorted.map((s) => <li key={s.id} className={`skill-chip level-${s.level.toLowerCase()}`}>
    <span className="skill-name">{s.name}</span>
    {onLevel
      ? <select aria-label={`${s.name} level`} value={s.level} onChange={(e) => onLevel(s.id, e.target.value as SkillLevel)}>{skillLevels.map((l) => <option key={l}>{l}</option>)}</select>
      : <Badge value={s.level} />}
    {onRemove && <button type="button" className="skill-remove" aria-label={`Remove ${s.name}`} onClick={() => onRemove(s.id)}><X size={13} /></button>}
  </li>)}</ul>;
}

const fmt = (iso: string) => (iso ? new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "");

/** Certificate cards with issuer, date, and a link or the uploaded file. */
export function CertificateList({ certificates, onRemove, empty = "No certificates added yet." }: { certificates: Certificate[]; onRemove?: (id: number) => void; empty?: string }) {
  if (!certificates.length) return <p className="skills-empty">{empty}</p>;
  const sorted = [...certificates].sort((a, b) => b.issued.localeCompare(a.issued));
  return <ul className="cert-list">{sorted.map((c) => <li key={c.id} className="cert-card">
    <span className="cert-icon"><Award size={18} aria-hidden="true" /></span>
    <div className="cert-body">
      <strong>{c.name}</strong>
      <small>{c.issuer}{c.issued ? ` · ${fmt(c.issued)}` : ""}</small>
      <div className="cert-links">
        {c.link && <a href={c.link} target="_blank" rel="noopener noreferrer"><ExternalLink size={13} /> View credential</a>}
        {c.file && <a href={c.file.dataUrl} download={c.file.name}><Download size={13} /> {c.file.name}</a>}
      </div>
    </div>
    {onRemove && <button type="button" className="skill-remove" aria-label={`Remove ${c.name}`} onClick={() => onRemove(c.id)}><X size={14} /></button>}
  </li>)}</ul>;
}

export { levelRank };
