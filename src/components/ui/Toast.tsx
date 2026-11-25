import { Check } from "lucide-react";

/** Bottom-right confirmation message. */
export default function Toast({ message }: { message: string }) {
  if (!message) return null;
  return <div className="toast" role="status" aria-live="polite"><span className="toast-icon"><Check size={14} /></span>{message}</div>;
}
