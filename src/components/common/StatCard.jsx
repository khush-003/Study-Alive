import Icon from '../Icon.jsx';

const colors = {
  blue: 'bg-blue-50 text-blue-600',
  brand: 'bg-brand-50 text-brand-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  indigo: 'bg-indigo-50 text-indigo-600',
  purple: 'bg-purple-50 text-purple-600',
  rose: 'bg-rose-50 text-rose-600',
  amber: 'bg-amber-50 text-amber-600',
};

/**
 * Props: icon (Icon component name), label (string), sub (string), color (color key).
 * Usage: <StatCard icon="faBookOpen" label="Study hours" sub="This week" color="blue" />
 */
export default function StatCard({ icon, label, sub, color = 'brand' }) {
  return (
    <article className="flex items-center gap-3 rounded-2xl border border-surface-border bg-white p-4 shadow-sm">
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colors[color] || colors.brand}`}><Icon name={icon} /></span>
      <div className="min-w-0">
        <p className="text-sm font-bold text-content-title">{label}</p>
        {sub && <p className="mt-1 text-xs text-content-muted">{sub}</p>}
      </div>
    </article>
  );
}
