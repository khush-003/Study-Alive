import Icon from '../Icon.jsx';

const careerIcons = {
  'fa-solid fa-code': 'faCode',
  'fa-solid fa-brain': 'faBrain',
  'fa-solid fa-robot': 'faRobot',
  'fa-solid fa-pen-nib': 'faPenNib',
  'fa-solid fa-chart-line': 'faChartLine',
  'fa-solid fa-heart-pulse': 'faHeartPulse',
  'fa-solid fa-shield-halved': 'faShieldHalved',
};

/**
 * Props: career (career data object), onSelect (called with career).
 * Usage: <CareerCard career={career} onSelect={handleCareerSelect} />
 */
export default function CareerCard({ career, onSelect }) {
  return (
    <button type="button" onClick={() => onSelect(career)} className="group w-full rounded-2xl border border-surface-border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <span className="gradient-brand flex h-11 w-11 items-center justify-center rounded-xl text-lg text-white"><Icon name={careerIcons[career.icon]} /></span>
        <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-semibold text-brand-700">{career.category}</span>
      </div>
      <h3 className="mt-4 font-display text-base font-extrabold text-content-title group-hover:text-brand-600">{career.name}</h3>
      <p className="mt-1 line-clamp-2 text-xs leading-5 text-content-muted">{career.tagline}</p>
      <p className="mt-4 text-xs font-bold text-emerald-600">{career.averageSalary}</p>
    </button>
  );
}
