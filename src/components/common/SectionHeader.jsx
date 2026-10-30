/**
 * Props: title (string), subtitle (string), actionLabel (string), onAction (function).
 * Usage: <SectionHeader title="Careers" subtitle="Explore pathways" actionLabel="View all" onAction={showAll} />
 */
export default function SectionHeader({ title, subtitle, actionLabel, onAction }) {
  return (
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
      <div>
        <h2 className="font-display text-xl font-extrabold text-content-title">{title}</h2>
        {subtitle && <p className="text-xs text-content-muted">{subtitle}</p>}
      </div>
      {actionLabel && <button type="button" onClick={onAction} className="self-start rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 sm:self-auto">{actionLabel}</button>}
    </div>
  );
}
