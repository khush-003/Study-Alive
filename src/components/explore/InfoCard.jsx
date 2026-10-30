import Icon from '../Icon.jsx';

export default function InfoCard({ label, value, icon, tone = 'brand' }) {
  const tones = {
    blue: 'text-blue-600',
    brand: 'text-brand-500',
    emerald: 'text-emerald-600',
    purple: 'text-purple-600',
  };
  return (
    <div className="flex gap-3 rounded-xl border border-surface-border bg-white p-3">
      <span className={`mt-0.5 ${tones[tone] || tones.brand}`}><Icon name={icon} /></span>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-content-muted">{label}</p>
        <p className="mt-1 text-xs font-semibold leading-5 text-content-title">{value}</p>
      </div>
    </div>
  );
}
