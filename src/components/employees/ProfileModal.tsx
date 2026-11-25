import type { ReactNode } from "react";
import { demoUsers } from "@/lib/data";
import type { ProfileTarget } from "@/lib/types";
import Badge from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import Modal, { ModalActions } from "@/components/ui/Modal";
import SalaryBreakdown from "@/components/payroll/SalaryBreakdown";

function DetailGroup({ title, items }: { title: string; items: [string, ReactNode][] }) {
  return <section className="profile-group">
    <h3>{title}</h3>
    <div className="profile-details">{items.map(([label, value]) => <div key={label}><small>{label}</small><strong>{value}</strong></div>)}</div>
  </section>;
}

/** Profile card for an employee (contact, work, salary, insurance), or for the built-in administrator ("admin"). */
export default function ProfileModal({ profile, onClose, onOpenSettings, showSalary = true }: { profile: ProfileTarget; onClose: () => void; onOpenSettings?: () => void; showSalary?: boolean }) {
  if (profile === "admin") {
    const admin = demoUsers[0];
    return <Modal labelledBy="profile-title" onClose={onClose} className="user-profile-modal" closeLabel="Close profile" focusClose>
      <div className="profile-hero"><Avatar initials={admin.initials} large /><div><h2 id="profile-title">{admin.name}</h2><p>{admin.jobTitle} · {admin.department}</p></div></div>
      <DetailGroup title="Contact" items={[["Email", admin.email], ["Employee ID", admin.employeeId], ["Phone", "+966 50 100 2001"], ["Extension", "2001"], ["Work location", "Riyadh, Saudi Arabia"], ["Department", admin.department]]} />
      <ModalActions>{onOpenSettings && <button className="outline" onClick={onOpenSettings}>Account settings</button>}<button className="primary" onClick={onClose}>Done</button></ModalActions>
    </Modal>;
  }

  return <Modal labelledBy="profile-title" onClose={onClose} className="user-profile-modal wide" closeLabel="Close profile" focusClose>
    <div className="profile-hero"><Avatar initials={profile.initials} large /><div><h2 id="profile-title">{profile.name}</h2><p>{profile.role} · {profile.department}</p></div><Badge value={profile.status} /></div>
    <div className="profile-scroll">
      <DetailGroup title="Contact" items={[["Email", profile.email], ["Phone", profile.phone], ["Extension", profile.extension], ["Employee ID", profile.id]]} />
      <DetailGroup title="Work" items={[["Department", profile.department], ["Job title", profile.role], ["Work mode", <Badge key="mode" value={profile.workMode} />], ["Status", <Badge key="status" value={profile.status} />]]} />
      <DetailGroup title="Medical insurance" items={[["Insurance provider", profile.insurance.provider], ["Insured company", profile.insurance.insuredCompany]]} />
      {showSalary && <section className="profile-group"><h3>Monthly salary</h3><SalaryBreakdown salary={profile.salary} compact /></section>}
    </div>
    <ModalActions><button className="primary" onClick={onClose}>Done</button></ModalActions>
  </Modal>;
}
