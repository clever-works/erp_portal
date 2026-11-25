import type { NavGroup } from "@/lib/types";

/** Tab strip with the sibling modules of the current page (e.g. People: Employees · Departments · Attendance · Leave). */
export default function SectionTabs({ groups, page, onNavigate }: { groups: NavGroup[]; page: string; onNavigate: (page: string) => void }) {
  const group = groups.find((entry) => entry.items.some((item) => item.label === page));
  if (!group || group.items.length < 2) return null;
  return <nav className="section-tabs" aria-label={`${group.title} sections`}>
    {group.items.map(({ label, icon: Icon }) => <button key={label} className={label === page ? "active" : ""} aria-current={label === page ? "page" : undefined} onClick={() => onNavigate(label)}>
      <Icon size={15} aria-hidden="true" />{label === "Leave management" ? "Leave" : label === "My salary" ? "Salary" : label === "My skills" ? "Skills" : label}
    </button>)}
  </nav>;
}
