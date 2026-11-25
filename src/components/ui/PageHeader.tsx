import type { ReactNode } from "react";

/**
 * Page heading with optional eyebrow and action buttons.
 * `variant="welcome"` is the larger dashboard greeting.
 */
export default function PageHeader({ title, description, eyebrow, actions, variant = "section" }: { title: ReactNode; description?: ReactNode; eyebrow?: ReactNode; actions?: ReactNode; variant?: "section" | "welcome" }) {
  return <div className={variant === "welcome" ? "welcome" : "sectionhead"}>
    <div>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 tabIndex={-1}>{title}</h1>
      {description && <p>{description}</p>}
    </div>
    {actions && <div className="head-actions">{actions}</div>}
  </div>;
}
