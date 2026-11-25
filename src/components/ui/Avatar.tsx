import { tint } from "@/lib/utils";

/** Round initials avatar in the brand colour. */
export function Avatar({ initials, large = false }: { initials: string; large?: boolean }) {
  return <div className={`avatar${large ? " profile-large" : ""}`} aria-hidden="true">{initials}</div>;
}

/** Smaller avatar with a per-person tint, used in lists and tables. */
export function MiniAvatar({ initials, color }: { initials: string; color: string }) {
  return <div className="miniavatar" aria-hidden="true" style={{ background: tint(color) }}>{initials}</div>;
}
