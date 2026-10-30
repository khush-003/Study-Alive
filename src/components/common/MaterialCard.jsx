import Icon from '../Icon.jsx';

const icons = {
  'fa-regular fa-file-pdf': 'faFilePdf',
  'fa-solid fa-circle-play': 'faCirclePlay',
  'fa-regular fa-clipboard': 'faClipboard',
  'fa-solid fa-bolt': 'faBolt',
};
const colors = {
  red: 'bg-red-50 text-rose-600',
  blue: 'bg-blue-50 text-blue-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  purple: 'bg-purple-50 text-purple-600',
};

/**
 * Props: material (study resource object), onDownload and onPlay (called with material).
 * Usage: <MaterialCard material={resource} onDownload={downloadResource} onPlay={playVideo} />
 */
export default function MaterialCard({ material, onDownload, onPlay }) {
  const canDownload = material.type !== 'videos';
  const handleAction = () => (canDownload ? onDownload : onPlay)?.(material);

  return (
    <article className="flex items-center justify-between gap-4 rounded-2xl border border-surface-border bg-white p-4 shadow-sm">
      <div className="flex min-w-0 items-center gap-3.5">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colors[material.color] || 'bg-slate-50 text-slate-600'}`}><Icon name={icons[material.iconClass]} /></span>
        <div className="min-w-0"><h3 className="text-sm font-bold text-content-title">{material.title}</h3><p className="mt-1 text-xs text-content-muted">{material.meta}</p></div>
      </div>
      <button type="button" onClick={handleAction} aria-label={canDownload ? `Download ${material.title}` : `Watch ${material.title}`} className="shrink-0 rounded-xl border border-surface-border p-3 text-brand-600 transition hover:bg-brand-50"><Icon name={canDownload ? 'faDownload' : 'faPlay'} /></button>
    </article>
  );
}
