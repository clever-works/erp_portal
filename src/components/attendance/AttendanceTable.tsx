"use client";

import { useState } from "react";
import { formatClock, formatDay, formatHours, type AttendanceRecord } from "@/lib/attendance";
import Badge from "@/components/ui/Badge";

/** Attendance rows: date and/or employee, status, check-in, check-out and hours. Long lists load 40 rows at a time. */
export default function AttendanceTable({ records, showDate = true, showEmployee = true, pageSize = 40, emptyText = "No attendance records for this period." }: { records: AttendanceRecord[]; showDate?: boolean; showEmployee?: boolean; pageSize?: number; emptyText?: string }) {
  const [visible, setVisible] = useState(pageSize);
  const rows = records.slice(0, visible);
  if (!records.length) return <div className="emptystate">{emptyText}</div>;
  return <>
    <div className="tablewrap" role="region" aria-label="Attendance records" tabIndex={0}>
      <table className="table" aria-label="Attendance">
        <thead><tr>
          {showDate && <th scope="col">Date</th>}
          {showEmployee && <th scope="col">Employee</th>}
          <th scope="col">Status</th><th scope="col">Check in</th><th scope="col">Check out</th><th scope="col" className="num-col">Hours</th>
        </tr></thead>
        <tbody>{rows.map((record) => <tr key={`${record.date}-${record.employeeId}`}>
          {showDate && <td className="nowrap">{formatDay(record.date)}</td>}
          {showEmployee && <td className="strong-cell">{record.name}</td>}
          <td><Badge value={record.status} /></td>
          <td className="nowrap">{formatClock(record.checkIn)}</td>
          <td className="nowrap">{record.live ? <Badge value="Working" /> : formatClock(record.checkOut)}</td>
          <td className="num-col"><span className={record.minutes ? "num-cell" : "muted-cell"}>{formatHours(record.minutes)}</span></td>
        </tr>)}</tbody>
      </table>
    </div>
    {records.length > visible && <div className="table-more"><button className="outline" onClick={() => setVisible(visible + pageSize)}>Show more ({records.length - visible} left)</button></div>}
  </>;
}
