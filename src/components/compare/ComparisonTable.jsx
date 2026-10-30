import Icon from '../Icon.jsx';

/**
 * Props: careerA and careerB (career records), rows ({ label, icon, key, highlight }[]).
 * Usage: <ComparisonTable careerA={careerA} careerB={careerB} rows={rows} />
 */
export default function ComparisonTable({ careerA, careerB, rows }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-surface-border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-surface-border bg-slate-50/70 text-xs font-bold uppercase tracking-wider text-slate-500">
              <th className="w-1/3 px-6 py-4">Parameter</th>
              <th className="w-1/3 px-6 py-4 font-extrabold text-brand-700">{careerA.name}</th>
              <th className="w-1/3 px-6 py-4 font-extrabold text-purple-700">{careerB.name}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border text-xs sm:text-sm">
            {rows.map(({ label, icon, key, highlight }) => (
              <tr key={key} className="transition hover:bg-slate-50">
                <th scope="row" className="px-6 py-3.5 text-left font-semibold text-slate-800"><Icon name={icon} className="mr-2 w-4 text-xs text-slate-400" />{label}</th>
                <td className={`px-6 py-3.5 ${highlight ? 'font-bold text-brand-600' : 'text-slate-700'}`}>{careerA[key]}</td>
                <td className={`px-6 py-3.5 ${highlight ? 'font-bold text-purple-600' : 'text-slate-700'}`}>{careerB[key]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
