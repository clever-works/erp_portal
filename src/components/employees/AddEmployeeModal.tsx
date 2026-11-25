"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Plus } from "lucide-react";
import { company, insurers, workModes } from "@/lib/data";
import { formatSAR, grossOf } from "@/lib/payroll";
import type { NewEmployee, WorkMode } from "@/lib/types";
import Modal, { ModalActions } from "@/components/ui/Modal";

/** Saudi mobile numbers: 05XXXXXXXX or +966 5X XXX XXXX. */
function normalizeSaudiMobile(input: string) {
  const digits = input.replace(/\D/g, "");
  const local = digits.startsWith("966") ? digits.slice(3) : digits.startsWith("0") ? digits.slice(1) : digits;
  if (!/^5\d{8}$/.test(local)) return null;
  return `+966 ${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5)}`;
}

/** Dialog to add a team member with contact, work, salary and insurance details. */
export default function AddEmployeeModal({ departments, onCreate, onClose }: { departments: string[]; onCreate: (employee: NewEmployee) => void; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", department: departments[0], role: "", phone: "", extension: "", workMode: "Office" as WorkMode, basic: "", housing: "", transport: "", other: "", provider: insurers[0], insuredCompany: company.name });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (key: keyof typeof form) => (value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => { if (!current[key]) return current; const next = { ...current }; delete next[key]; return next; });
  };
  const num = (value: string) => Math.max(0, Number(value) || 0);
  const salary = { basic: num(form.basic), housing: num(form.housing), transport: num(form.transport), other: num(form.other) };

  const fillAllowances = () => { const basic = num(form.basic); setForm((current) => ({ ...current, housing: String(basic * 0.25), transport: String(basic * 0.1) })); };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Enter the employee's name.";
    const phone = normalizeSaudiMobile(form.phone);
    if (!phone) next.phone = "Use a Saudi mobile number, e.g. 05X XXX XXXX or +966 5X XXX XXXX.";
    if (form.extension && !/^\d{2,6}$/.test(form.extension)) next.extension = "Extension should be 2–6 digits.";
    if (salary.basic <= 0) next.basic = "Enter the basic salary.";
    setErrors(next);
    if (Object.keys(next).length || !phone) return;
    onCreate({ name: form.name.trim(), department: form.department, role: form.role.trim() || "Team member", phone, extension: form.extension || "—", workMode: form.workMode, salary, insurance: { provider: form.provider, insuredCompany: form.insuredCompany.trim() || company.name } });
  };

  const field = (id: string, label: string, input: ReactNode, error?: string, wide = false) => <div className={`formrow${wide ? " wide" : ""}`}><label htmlFor={id}>{label}</label>{input}{error && <p className="field-error" role="alert">{error}</p>}</div>;

  return <Modal labelledBy="employee-modal-title" onClose={onClose} className="employee-form-modal">
    <h2 id="employee-modal-title">Add a team member</h2>
    <p>Create an employee profile with contact, salary and insurance details.</p>
    <form className="employee-form" onSubmit={submit} noValidate>
      <fieldset><legend>Basic details</legend>
        {field("employee-name", "Full name", <input id="employee-name" autoFocus placeholder="e.g. Kamar" value={form.name} onChange={(e) => set("name")(e.target.value)} />, errors.name)}
        {field("employee-role", "Job title", <input id="employee-role" placeholder="e.g. Accountant" value={form.role} onChange={(e) => set("role")(e.target.value)} />)}
        {field("employee-dept", "Department", <select id="employee-dept" value={form.department} onChange={(e) => set("department")(e.target.value)}>{departments.map((dept) => <option key={dept}>{dept}</option>)}</select>)}
        {field("employee-mode", "Work mode", <select id="employee-mode" value={form.workMode} onChange={(e) => set("workMode")(e.target.value)}>{workModes.map((mode) => <option key={mode}>{mode}</option>)}</select>)}
      </fieldset>
      <fieldset><legend>Contact</legend>
        {field("employee-phone", "Mobile number", <input id="employee-phone" inputMode="tel" placeholder="+966 5X XXX XXXX" value={form.phone} onChange={(e) => set("phone")(e.target.value)} />, errors.phone)}
        {field("employee-ext", "Extension", <input id="employee-ext" inputMode="numeric" placeholder="e.g. 2145" value={form.extension} onChange={(e) => set("extension")(e.target.value)} />, errors.extension)}
      </fieldset>
      <fieldset><legend>Monthly salary (SAR)</legend>
        {field("employee-basic", "Basic salary", <input id="employee-basic" inputMode="decimal" placeholder="e.g. 12000" value={form.basic} onChange={(e) => set("basic")(e.target.value)} onBlur={() => { if (!form.housing && !form.transport) fillAllowances(); }} />, errors.basic)}
        {field("employee-housing", "Housing allowance", <input id="employee-housing" inputMode="decimal" placeholder="25% of basic" value={form.housing} onChange={(e) => set("housing")(e.target.value)} />)}
        {field("employee-transport", "Transport allowance", <input id="employee-transport" inputMode="decimal" placeholder="10% of basic" value={form.transport} onChange={(e) => set("transport")(e.target.value)} />)}
        {field("employee-other", "Other allowances", <input id="employee-other" inputMode="decimal" placeholder="0" value={form.other} onChange={(e) => set("other")(e.target.value)} />)}
        <p className="form-hint wide">Gross monthly: <b>{formatSAR(grossOf(salary))}</b>. Housing and transport fill in at 25% and 10% of basic; you can change them.</p>
      </fieldset>
      <fieldset><legend>Medical insurance</legend>
        {field("employee-insurer", "Insurance provider", <select id="employee-insurer" value={form.provider} onChange={(e) => set("provider")(e.target.value)}>{insurers.map((name) => <option key={name}>{name}</option>)}</select>)}
        {field("employee-insured", "Insured company", <input id="employee-insured" value={form.insuredCompany} onChange={(e) => set("insuredCompany")(e.target.value)} />)}
      </fieldset>
      <ModalActions><button type="button" className="outline" onClick={onClose}>Cancel</button><button type="submit" className="primary"><Plus size={15} /> Add employee</button></ModalActions>
    </form>
  </Modal>;
}
