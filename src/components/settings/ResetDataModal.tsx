import { RotateCcw } from "lucide-react";
import Modal, { ModalActions } from "@/components/ui/Modal";

/** Browser keys that hold the demo's saved data (the theme and sign-in are kept). */
export const DEMO_DATA_KEYS = ["nexus-erp", "nexus-settings"];

/** Confirm, then wipe the saved demo data in this browser and reload with the starting data. */
export function resetDemoData() {
  try { DEMO_DATA_KEYS.forEach((key) => localStorage.removeItem(key)); } catch { /* nothing saved */ }
  window.location.reload();
}

export default function ResetDataModal({ onClose }: { onClose: () => void }) {
  return <Modal labelledBy="reset-title" onClose={onClose} closeLabel="Cancel reset" focusClose>
    <h2 id="reset-title">Reset demo data?</h2>
    <p>This browser goes back to the starting demo data, the same on every device. Changes made here are removed: added employees, leave and WFH decisions, skills, announcements, settings and check-ins. You stay signed in and your light or dark theme is kept.</p>
    <ModalActions>
      <button className="outline" onClick={onClose}>Cancel</button>
      <button className="primary danger-fill" onClick={resetDemoData}><RotateCcw size={15} /> Reset data</button>
    </ModalActions>
  </Modal>;
}
