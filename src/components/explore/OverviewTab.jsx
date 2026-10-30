import InfoCard from './InfoCard.jsx';

export default function OverviewTab({ career, onStudy }) {
  const stats = [
    { label: 'Career scope', value: career.scope, icon: 'faBullseye', tone: 'blue' },
    { label: 'Average salary', value: career.averageSalary, icon: 'faChartLine' },
    { label: 'Future growth', value: career.futureGrowth, icon: 'faArrowTrendUp', tone: 'emerald' },
    { label: 'Global opportunities', value: career.globalOpportunities, icon: 'faEarthAmericas', tone: 'purple' },
    { label: 'Required skills', value: career.requiredSkills, icon: 'faLightbulb' },
    { label: 'Best suited for', value: career.bestFor, icon: 'faUser', tone: 'emerald' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-base font-bold text-content-title">About</h3>
        <p className="mt-2 text-sm leading-relaxed text-content-body">{career.about}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{stats.map((stat) => <InfoCard key={stat.label} {...stat} />)}</div>
      <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-blue-200/60 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:flex-row sm:items-center">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Explore a pathway for {career.name}.</h4>
          <p className="text-[11px] text-slate-600">See curated notes, practice materials, and study resources.</p>
        </div>
        <button type="button" onClick={onStudy} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-brand-600 shadow-sm transition hover:bg-slate-50">Get Materials</button>
      </div>
    </div>
  );
}
