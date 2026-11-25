import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";

export type TaskSummary = { name: string; detail: string; status: string; done?: number };

/** Compact task rows with status badge and optional progress bar. */
export default function TaskList({ tasks }: { tasks: TaskSummary[] }) {
  return <div className="list">{tasks.map((task) => <div className="taskitem" key={task.name}>
    <div className="tasktop"><strong>{task.name}</strong><Badge value={task.status} /></div>
    <small>{task.detail}</small>
    {task.done !== undefined && <div className="taskfoot"><ProgressBar value={task.done} /><small>{task.done}%</small></div>}
  </div>)}</div>;
}
