import { BriefcaseBusiness } from "lucide-react";

/** Nexus logo mark and wordmark. */
export default function Brand({ className = "" }: { className?: string }) {
  return <div className={`brand${className ? ` ${className}` : ""}`}>
    <div className="brandmark"><BriefcaseBusiness size={18} /></div>
    <div className="brandname">Nexus<small>ERP Workspace</small></div>
  </div>;
}
