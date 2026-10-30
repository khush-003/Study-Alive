import InfoCard from './InfoCard.jsx';

export default function JobsPayScaleTab({ career }) {
  return (
    <div className="space-y-4">
      <InfoCard label="Job opportunities" value={career.jobOpportunities} icon="faBriefcase" />
      <div>
        <h3 className="mb-3 font-display text-base font-bold text-content-title">Typical Job Profiles &amp; Salary Bands</h3>
        <div className="space-y-2">
          {career.jobProfiles.map((job) => (
            <article key={job.title} className="flex items-center justify-between gap-3 rounded-xl border border-surface-border bg-white p-4">
              <div><h4 className="text-sm font-bold text-slate-800">{job.title}</h4><p className="mt-1 text-xs text-slate-500">{job.stack}</p></div>
              <span className="shrink-0 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-600">{job.salary}</span>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
