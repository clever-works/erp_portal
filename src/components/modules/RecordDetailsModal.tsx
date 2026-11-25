import Modal, { ModalActions } from "@/components/ui/Modal";
import ModuleCell from "./ModuleCell";

/** Shows every column of a single table row. */
export default function RecordDetailsModal({ page, columns, row, onClose }: { page: string; columns: string[]; row: string[]; onClose: () => void }) {
  return <Modal labelledBy="row-details-title" onClose={onClose} className="row-details-modal" closeLabel="Close record details" focusClose>
    <h2 id="row-details-title">{row[0]}</h2>
    <p>{page} record details</p>
    <dl>{columns.map((column, index) => <div key={column}><dt>{column}</dt><dd><ModuleCell column={column} value={row[index] ?? "—"} /></dd></div>)}</dl>
    <ModalActions><button className="primary" onClick={onClose}>Done</button></ModalActions>
  </Modal>;
}
