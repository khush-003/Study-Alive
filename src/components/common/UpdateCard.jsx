import Icon from '../Icon.jsx';

/**
 * Props: update (news update object), expanded (boolean), onToggle (called with update).
 * Usage: <UpdateCard update={update} expanded={isExpanded} onToggle={toggleDetails} />
 */
export default function UpdateCard({ update, expanded = false, onToggle }) {
  return (
    <article className="rounded-2xl border border-surface-border bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
        <span className="rounded-full bg-brand-50 px-2.5 py-1 text-brand-700">{update.label}</span>
        <span className="text-content-muted">{update.timeAgo}</span>
      </div>
      <h3 className="mt-3 font-display text-base font-extrabold text-content-title">{update.title}</h3>
      <p className="mt-1 text-sm leading-6 text-content-muted">{update.summary}</p>
      {expanded && <p className="mt-3 border-t border-surface-border pt-3 text-sm leading-6 text-slate-700">{update.details}</p>}
      <button type="button" onClick={() => onToggle(update)} aria-expanded={expanded} className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-brand-600 hover:text-brand-700">
        {expanded ? 'Show less' : 'Read more'}<Icon name="faChevronRight" className={expanded ? '-rotate-90' : 'rotate-90'} />
      </button>
    </article>
  );
}
