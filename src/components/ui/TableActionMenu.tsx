"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal } from "lucide-react";

const MENU_WIDTH = 192;
const MENU_HEIGHT_ESTIMATE = 132;

/**
 * "⋯" row menu for tables. Pass <button>s as children; clicking one closes the menu.
 * The menu is rendered into the app root (a portal) so frosted/blurred cards
 * can't clip it or shift its position.
 */
export default function TableActionMenu({ label, children }: { label: string; children: ReactNode }) {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const close = (returnFocus = false) => { setPosition(null); if (returnFocus) triggerRef.current?.focus(); };
  const open = () => {
    const rect = triggerRef.current!.getBoundingClientRect();
    const opensUp = rect.bottom + 4 + MENU_HEIGHT_ESTIMATE > window.innerHeight - 8;
    setPosition({
      top: Math.max(8, opensUp ? rect.top - 4 - MENU_HEIGHT_ESTIMATE : rect.bottom + 4),
      left: Math.max(8, Math.min(rect.right - MENU_WIDTH, window.innerWidth - MENU_WIDTH - 8)),
    });
  };

  useEffect(() => {
    if (!position) return;
    menuRef.current?.querySelector<HTMLElement>("button")?.focus({ preventScroll: true });
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!menuRef.current?.contains(target) && !triggerRef.current?.contains(target)) close();
    };
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") close(true); };
    const onViewportChange = () => close();
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onViewportChange, true);
    window.addEventListener("resize", onViewportChange);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onViewportChange, true);
      window.removeEventListener("resize", onViewportChange);
    };
  }, [position]);

  const portalTarget = typeof document !== "undefined" ? document.querySelector(".app") ?? document.body : null;

  return <div className="row-action-menu">
    <button ref={triggerRef} type="button" className="row-action-trigger" aria-label={`Actions for ${label}`} title={`Actions for ${label}`} aria-haspopup="menu" aria-expanded={!!position} onClick={() => (position ? close() : open())}>
      <MoreHorizontal size={17} aria-hidden="true" />
    </button>
    {position && portalTarget && createPortal(
      <div ref={menuRef} className="row-action-popover" role="menu" aria-label={`${label} actions`} style={{ top: position.top, left: position.left }}
        onClick={(event) => { if ((event.target as HTMLElement).closest("button")) close(); }}>
        {children}
      </div>, portalTarget)}
  </div>;
}
