"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import { handleDialogKeyDown } from "@/lib/utils";

/**
 * Accessible dialog: dimmed backdrop, focus trap, Escape and backdrop-click to close.
 * Set `focusClose` when the dialog has no input that should take focus first.
 */
export default function Modal({ labelledBy, onClose, children, className = "", closeLabel = "Close", focusClose = false }: { labelledBy: string; onClose: () => void; children: ReactNode; className?: string; closeLabel?: string; focusClose?: boolean }) {
  return <div className="modalback" onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className={`modal${className ? ` ${className}` : ""}`} role="dialog" aria-modal="true" aria-labelledby={labelledBy} onKeyDown={(event) => handleDialogKeyDown(event, onClose)}>
      <button className="profile-close iconbtn" autoFocus={focusClose} aria-label={closeLabel} onClick={onClose}><X size={17} /></button>
      {children}
    </section>
  </div>;
}

/** Right-aligned button row at the bottom of a modal. */
export function ModalActions({ children }: { children: ReactNode }) {
  return <div className="modalactions">{children}</div>;
}
