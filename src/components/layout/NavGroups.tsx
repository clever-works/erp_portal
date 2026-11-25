import type { NavGroup, NavItem } from "@/lib/types";

export type NavBadges = Partial<Record<NonNullable<NavItem["count"]>, number>>;

/** Grouped navigation list, shared by the desktop sidebar and the mobile drawer. */
export default function NavGroups({ groups, page, onNavigate, badges = {} }: { groups: NavGroup[]; page: string; onNavigate: (page: string) => void; badges?: NavBadges }) {
  return <>{groups.map((group) => <div className="navgroup" key={group.title}>
    <div className="navlabel">{group.title}</div>
    {group.items.map(({ label, icon: Icon, count }) => {
      const badge = count ? badges[count] ?? 0 : 0;
      return <button key={label} className={page === label ? "active" : ""} aria-current={page === label ? "page" : undefined} onClick={() => onNavigate(label)}>
        <Icon size={17} aria-hidden="true" />
        <span className="navtext">{label}</span>
        {badge > 0 && <span className="count" aria-label={`${badge} pending requests`}>{badge}</span>}
      </button>;
    })}
  </div>)}</>;
}
