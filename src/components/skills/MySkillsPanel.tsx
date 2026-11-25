"use client";

import { useState, type FormEvent } from "react";
import { Award, Plus, Upload } from "lucide-react";
import type { Certificate, Employee, Skill, SkillLevel } from "@/lib/types";
import { skillLevels, skillSuggestions } from "@/lib/data";
import { localDateKey } from "@/lib/utils";
import Bento from "@/components/ui/Bento";
import { Card, PanelHeader } from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import { CertificateList, SkillChips } from "./SkillsView";

const MAX_FILE_BYTES = 1024 * 1024; // files are kept in this browser, so keep them small

/** Employee page: add skills with a level and keep certificates (link and/or uploaded file). */
export default function MySkillsPanel({ employee, onChange, notify }: { employee: Employee; onChange: (skills: Skill[], certificates: Certificate[]) => void; notify: (message: string) => void }) {
  const { skills, certificates } = employee;
  const [skillName, setSkillName] = useState("");
  const [level, setLevel] = useState<SkillLevel>("Beginner");
  const [skillError, setSkillError] = useState("");

  const [cert, setCert] = useState({ name: "", issuer: "", issued: "", link: "" });
  const [file, setFile] = useState<Certificate["file"]>();
  const [certError, setCertError] = useState("");

  const addSkill = (event: FormEvent) => {
    event.preventDefault();
    const name = skillName.trim().replace(/\s+/g, " ");
    if (!name) { setSkillError("Type a skill, e.g. HTML."); return; }
    const existing = skills.find((s) => s.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      onChange(skills.map((s) => (s.id === existing.id ? { ...s, level } : s)), certificates);
      notify(`${existing.name} updated to ${level}`);
    } else {
      onChange([...skills, { id: Date.now(), name, level }], certificates);
      notify(`${name} added`);
    }
    setSkillName(""); setLevel("Beginner"); setSkillError("");
  };

  const pickFile = (input: HTMLInputElement) => {
    const picked = input.files?.[0];
    if (!picked) { setFile(undefined); return; }
    if (picked.size > MAX_FILE_BYTES) { setCertError("Please choose a file under 1 MB (PDF or image)."); input.value = ""; return; }
    if (!/^(application\/pdf|image\/)/.test(picked.type)) { setCertError("Use a PDF or an image file."); input.value = ""; return; }
    const reader = new FileReader();
    reader.onload = () => { setFile({ name: picked.name, type: picked.type, dataUrl: String(reader.result) }); setCertError(""); };
    reader.readAsDataURL(picked);
  };

  const addCert = (event: FormEvent) => {
    event.preventDefault();
    if (!cert.name.trim() || !cert.issuer.trim()) { setCertError("Add the certificate name and who issued it."); return; }
    if (cert.issued && cert.issued > localDateKey(new Date())) { setCertError("The issue date can't be in the future."); return; }
    if (cert.link && !/^https?:\/\//i.test(cert.link.trim())) { setCertError("The link should start with https://"); return; }
    onChange(skills, [...certificates, { id: Date.now(), name: cert.name.trim(), issuer: cert.issuer.trim(), issued: cert.issued, link: cert.link.trim() || undefined, file }]);
    notify("Certificate added");
    setCert({ name: "", issuer: "", issued: "", link: "" }); setFile(undefined); setCertError("");
    (event.target as HTMLFormElement).reset();
  };

  const count = (l: SkillLevel) => skills.filter((s) => s.level === l).length;

  return <Bento>
    <StatCard className="span-4" label="Skills" value={String(skills.length)} hint={`${count("Advanced")} advanced · ${count("Intermediate")} intermediate`} icon={Award} tone="indigo" />
    <StatCard className="span-4" label="Certificates" value={String(certificates.length)} hint="Shown on your profile" icon={Award} tone="emerald" />
    <StatCard className="span-4" label="Beginner skills" value={String(count("Beginner"))} hint="Skills you're still learning" icon={Award} tone="amber" />

    <Card className="span-7">
      <PanelHeader title="My skills" subtitle="Add what you know and how well. Change the level as you grow." />
      <form className="skill-form" onSubmit={addSkill} noValidate>
        <label>Skill<input list="skill-suggestions" placeholder="e.g. HTML" value={skillName} onChange={(e) => { setSkillName(e.target.value); setSkillError(""); }} /></label>
        <datalist id="skill-suggestions">{skillSuggestions.map((s) => <option key={s} value={s} />)}</datalist>
        <label>Level<select value={level} onChange={(e) => setLevel(e.target.value as SkillLevel)}>{skillLevels.map((l) => <option key={l}>{l}</option>)}</select></label>
        <button className="primary" type="submit"><Plus size={15} /> Add skill</button>
        {skillError && <p className="auth-error wide" role="alert">{skillError}</p>}
      </form>
      <SkillChips skills={skills}
        onLevel={(id, l) => onChange(skills.map((s) => (s.id === id ? { ...s, level: l } : s)), certificates)}
        onRemove={(id) => { onChange(skills.filter((s) => s.id !== id), certificates); notify("Skill removed"); }} />
    </Card>

    <Card className="span-5">
      <PanelHeader title="My certificates" subtitle="Add a link, upload the file, or both." />
      <form className="cert-form" onSubmit={addCert} noValidate>
        <label className="wide">Certificate name<input placeholder="e.g. Google UX Design Certificate" value={cert.name} onChange={(e) => { setCert({ ...cert, name: e.target.value }); setCertError(""); }} /></label>
        <label>Issued by<input placeholder="e.g. Coursera" value={cert.issuer} onChange={(e) => { setCert({ ...cert, issuer: e.target.value }); setCertError(""); }} /></label>
        <label>Issue date<input type="date" max={localDateKey(new Date())} value={cert.issued} onChange={(e) => setCert({ ...cert, issued: e.target.value })} /></label>
        <label className="wide">Link (optional)<input placeholder="https://" value={cert.link} onChange={(e) => { setCert({ ...cert, link: e.target.value }); setCertError(""); }} /></label>
        <label className="wide file-field"><span><Upload size={14} /> File (optional, PDF or image, under 1 MB)</span><input type="file" accept="application/pdf,image/*" onChange={(e) => pickFile(e.target)} /></label>
        <button className="primary wide" type="submit"><Plus size={15} /> Add certificate</button>
        {certError && <p className="auth-error wide" role="alert">{certError}</p>}
      </form>
      <CertificateList certificates={certificates} onRemove={(id) => { onChange(skills, certificates.filter((c) => c.id !== id)); notify("Certificate removed"); }} />
    </Card>
  </Bento>;
}
