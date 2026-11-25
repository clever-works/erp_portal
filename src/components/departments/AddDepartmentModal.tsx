"use client";

import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import type { Department } from "@/lib/types";
import Modal, { ModalActions } from "@/components/ui/Modal";

/** Dialog to create a department: name, head, team size and annual budget (SAR). */
export default function AddDepartmentModal({ existing, people, onCreate, onClose }: { existing: Department[]; people: string[]; onCreate: (department: Department) => void; onClose: () => void }) {
  const [name, setName] = useState("");
  const [head, setHead] = useState("—");
  const [budget, setBudget] = useState("");
  const [error, setError] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const clean = name.trim().replace(/\s+/g, " ");
    if (!clean) { setError("Enter a department name."); return; }
    const match = existing.find((dept) => dept.name.toLowerCase() === clean.toLowerCase());
    if (match) { setError(`${match.name} already exists.`); return; }
    onCreate({ name: clean, head, headcount: 0, budget: Math.max(0, Number(budget) || 0), status: "Active" });
  };

  return <Modal labelledBy="department-modal-title" onClose={onClose}>
    <h2 id="department-modal-title">Add a department</h2>
    <p>It will appear in employee forms and announcement targeting straight away.</p>
    <form onSubmit={submit} noValidate>
      <div className="formrow"><label htmlFor="department-name">Department name</label><input id="department-name" autoFocus placeholder="e.g. Sales" value={name} onChange={(event) => { setName(event.target.value); setError(""); }} />{error && <p className="field-error" role="alert">{error}</p>}</div>
      <div className="formrow"><label htmlFor="department-head">Department head</label><select id="department-head" value={head} onChange={(event) => setHead(event.target.value)}><option value="—">Not assigned yet</option>{people.map((person) => <option key={person}>{person}</option>)}</select></div>
      <div className="formrow"><label htmlFor="department-budget">Annual budget (SAR)</label><input id="department-budget" inputMode="numeric" placeholder="e.g. 450000" value={budget} onChange={(event) => setBudget(event.target.value)} /></div>
      <ModalActions><button type="button" className="outline" onClick={onClose}>Cancel</button><button type="submit" className="primary"><Plus size={15} /> Add department</button></ModalActions>
    </form>
  </Modal>;
}
