/**
 * Props: label (string), active (boolean), onClick (function).
 * Usage: <Chip label="Reports" active={active} onClick={selectReports} />
 */
export default function Chip({ label, active = false, onClick }) {
  return <button type="button" onClick={onClick} aria-pressed={active} className={`rounded-full border px-3 py-1.5 text-xs ${active ? 'border-slate-900 bg-slate-900 font-bold text-white' : 'border-surface-border bg-white text-slate-600 hover:bg-slate-50'}`}>{label}</button>;
}
