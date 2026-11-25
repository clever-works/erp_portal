import type { Employee } from "@/lib/types";
import { copyValue } from "@/lib/utils";
import { formatSAR, grossOf } from "@/lib/payroll";
import Badge from "@/components/ui/Badge";
import { MiniAvatar } from "@/components/ui/Avatar";
import TableActionMenu from "@/components/ui/TableActionMenu";

/**
 * Employee table.
 * `compact` (dashboard): employee, email, department, job title, status.
 * `full` (Employees page): adds employee ID, job title, phone, extension, work mode and monthly salary, each in its own column.
 */
export default function EmployeeTable({ employees, onSelect, variant = "full" }: { employees: Employee[]; onSelect: (employee: Employee) => void; variant?: "full" | "compact" }) {
  const full = variant === "full";
  return <div className="tablewrap" role="region" aria-label="Employee records" tabIndex={0}>
    <table className="table" aria-label="Employee directory">
      <thead><tr>
        <th scope="col">Employee</th>
        {full && <><th scope="col">Employee ID</th><th scope="col">Job title</th></>}
        <th scope="col">Email</th>
        {full && <><th scope="col">Phone</th><th scope="col">Ext.</th></>}
        <th scope="col">Department</th>
        {!full && <th scope="col">Job title</th>}
        {full && <><th scope="col">Work mode</th><th scope="col" className="num-col">Monthly salary</th></>}
        <th scope="col">Status</th>
        <th scope="col" className="actions-col"><span className="sr-only">Actions</span></th>
      </tr></thead>
      <tbody>{employees.map((person) => <tr key={person.id} className={person.status === "Inactive" ? "row-inactive" : undefined}>
        <td><div className="person"><MiniAvatar initials={person.initials} color={person.color} /><div><button className="person-link" onClick={() => onSelect(person)}>{person.name}</button></div></div></td>
        {full && <><td className="muted-cell nowrap">{person.id}</td><td>{person.role}</td></>}
        <td className="muted-cell">{person.email}</td>
        {full && <><td className="nowrap">{person.phone}</td><td className="muted-cell">{person.extension}</td></>}
        <td>{person.department}</td>
        {!full && <td className="muted-cell">{person.role}</td>}
        {full && <><td><Badge value={person.workMode} /></td><td className="num-col"><span className="num-cell">{formatSAR(grossOf(person.salary))}</span></td></>}
        <td><Badge value={person.status} /></td>
        <td className="actions-col"><TableActionMenu label={person.name}>
          <button aria-label={`View ${person.name} profile`} onClick={() => onSelect(person)}>View profile</button>
          <button aria-label={`Copy ${person.name} email`} onClick={() => copyValue(person.email)}>Copy email</button>
          <button aria-label={`Copy ${person.name} phone`} onClick={() => copyValue(person.phone)}>Copy phone</button>
        </TableActionMenu></td>
      </tr>)}</tbody>
    </table>
  </div>;
}
