import type { ReactNode } from "react";

/** Row with a leading visual (avatar/icon), a title + subtitle, and trailing content. */
export default function ListRow({ leading, title, subtitle, children, className = "" }: { leading?: ReactNode; title: string; subtitle?: string; children?: ReactNode; className?: string }) {
  return <div className={`leaveitem${className ? ` ${className}` : ""}`}>
    {leading}
    <div className="leave-identity"><strong>{title}</strong>{subtitle && <small>{subtitle}</small>}</div>
    {children}
  </div>;
}
