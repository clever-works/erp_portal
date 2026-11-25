"use client";

import { useState, type FormEvent } from "react";
import { Megaphone } from "lucide-react";
import type { Announcement } from "@/lib/types";
import Modal, { ModalActions } from "@/components/ui/Modal";

export type AnnouncementDraft = Pick<Announcement, "title" | "body" | "audience" | "priority">;

/** Admin dialog to write an announcement for everyone or for chosen departments. */
export default function AnnouncementComposer({ departments, onPublish, onClose }: { departments: string[]; onPublish: (draft: AnnouncementDraft) => void; onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [scope, setScope] = useState<"everyone" | "departments">("everyone");
  const [picked, setPicked] = useState<string[]>([]);
  const [priority, setPriority] = useState<Announcement["priority"]>("Normal");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggle = (dept: string) => { setPicked((current) => current.includes(dept) ? current.filter((d) => d !== dept) : [...current, dept]); setErrors((e) => ({ ...e, audience: "" })); };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!title.trim()) next.title = "Add a title.";
    if (!body.trim()) next.body = "Write the message.";
    if (scope === "departments" && picked.length === 0) next.audience = "Pick at least one department.";
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;
    onPublish({ title: title.trim(), body: body.trim(), audience: scope === "everyone" ? "everyone" : picked, priority });
  };

  return <Modal labelledBy="announcement-modal-title" onClose={onClose} className="composer-modal">
    <h2 id="announcement-modal-title">New announcement</h2>
    <p>Employees in the chosen departments see it on their Announcements page and get a notification.</p>
    <form onSubmit={submit} noValidate>
      <div className="formrow"><label htmlFor="announcement-title">Title</label><input id="announcement-title" autoFocus placeholder="e.g. Payroll cut-off moved to the 20th" value={title} onChange={(event) => { setTitle(event.target.value); setErrors((e) => ({ ...e, title: "" })); }} />{errors.title && <p className="field-error" role="alert">{errors.title}</p>}</div>
      <div className="formrow"><label htmlFor="announcement-body">Message</label><textarea id="announcement-body" rows={4} placeholder="Write your announcement…" value={body} onChange={(event) => { setBody(event.target.value); setErrors((e) => ({ ...e, body: "" })); }} />{errors.body && <p className="field-error" role="alert">{errors.body}</p>}</div>

      <fieldset className="audience-picker">
        <legend>Send to</legend>
        <div className="role-switch">
          <button type="button" className={scope === "everyone" ? "active" : ""} aria-pressed={scope === "everyone"} onClick={() => setScope("everyone")}>Everyone</button>
          <button type="button" className={scope === "departments" ? "active" : ""} aria-pressed={scope === "departments"} onClick={() => setScope("departments")}>Specific departments</button>
        </div>
        {scope === "departments" && <div className="chip-list" role="group" aria-label="Departments">
          {departments.map((dept) => <label key={dept} className={`chip${picked.includes(dept) ? " on" : ""}`}><input type="checkbox" checked={picked.includes(dept)} onChange={() => toggle(dept)} />{dept}</label>)}
        </div>}
        {errors.audience && <p className="field-error" role="alert">{errors.audience}</p>}
      </fieldset>

      <div className="formrow"><label htmlFor="announcement-priority">Priority</label><select id="announcement-priority" value={priority} onChange={(event) => setPriority(event.target.value as Announcement["priority"])}><option>Normal</option><option>Important</option></select></div>
      <ModalActions><button type="button" className="outline" onClick={onClose}>Cancel</button><button type="submit" className="primary"><Megaphone size={15} /> Publish</button></ModalActions>
    </form>
  </Modal>;
}
