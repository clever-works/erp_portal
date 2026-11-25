import { Search } from "lucide-react";

/** Text search field with a magnifier icon. */
export default function SearchBox({ label, placeholder, value, onChange }: { label: string; placeholder: string; value: string; onChange: (value: string) => void }) {
  return <label className="searchbox">
    <Search size={15} aria-hidden="true" />
    <input aria-label={label} placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} />
  </label>;
}
