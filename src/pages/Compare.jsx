import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { careers, careersDatabase } from '../data/careers.js';
import { OfflineNotice, RequestError, SkeletonRows } from '../components/common/RequestState.jsx';
import ComparisonTable from '../components/compare/ComparisonTable.jsx';
import AiResultCard from '../components/compare/AiResultCard.jsx';
import Icon from '../components/Icon.jsx';
import PageHeading from '../components/PageHeading.jsx';
import useAuthGate from '../hooks/useAuthGate.js';
import useGemini from '../hooks/useGemini.js';
import { useToast } from '../context/ToastContext.jsx';
import useRemoteData from '../hooks/useRemoteData.js';
import { compareCareers, getCareers } from '../services/careerService.js';

const rows = [
  { label: 'Scope', icon: 'faBullseye', key: 'scope', highlight: false },
  { label: 'Average Salary', icon: 'faChartLine', key: 'averageSalary', highlight: true },
  { label: 'Job Opportunities', icon: 'faBriefcase', key: 'jobOpportunities', highlight: false },
  { label: 'Future Growth', icon: 'faArrowTrendUp', key: 'futureGrowth', highlight: false },
  { label: 'Required Skills', icon: 'faLightbulb', key: 'requiredSkills', highlight: false },
  { label: 'Global Opportunities', icon: 'faEarthAmericas', key: 'globalOpportunities', highlight: false },
  { label: 'Best For', icon: 'faUser', key: 'bestFor', highlight: false },
];

const validCareerId = (id, fallback) => (id && careersDatabase[id] ? id : fallback);

function CareerSelect({ label, value, onChange, tone, careers: options }) {
  const toneStyles = tone === 'indigo'
    ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
    : 'border-purple-200 bg-purple-50 text-purple-700';
  return (
    <label className={`inline-flex items-center rounded-xl border px-3 py-1.5 text-xs font-semibold ${toneStyles}`}>
      <span className="sr-only">{label}</span>
      <select aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} className="max-w-52 cursor-pointer bg-transparent text-xs font-semibold focus:outline-none">
        {options.map((career) => <option key={career.id} value={career.id}>{career.name}</option>)}
      </select>
    </label>
  );
}

export default function Compare() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [careerAId, setCareerAId] = useState(() => validCareerId(searchParams.get('a'), 'cs'));
  const [careerBId, setCareerBId] = useState(() => validCareerId(searchParams.get('b'), 'mech'));
  const [result, setResult] = useState('');
  const careerOptions = useRemoteData(getCareers, careers);
  const pairFallback = useMemo(() => ({
    careerA: careersDatabase[careerAId],
    careerB: careersDatabase[careerBId],
  }), [careerAId, careerBId]);
  const pair = useRemoteData(
    () => compareCareers(careerAId, careerBId),
    pairFallback,
    [careerAId, careerBId],
  );
  const gate = useAuthGate();
  const gemini = useGemini();
  const { showToast } = useToast();
  // This effect follows query-string changes such as browser back and forward.
  useEffect(() => {
    setCareerAId(validCareerId(searchParams.get('a'), 'cs'));
    setCareerBId(validCareerId(searchParams.get('b'), 'mech'));
  }, [searchParams]);
  // These lookups resolve the selected ids to their complete career records.
  const careerA = pair.data?.careerA;
  const careerB = pair.data?.careerB;

  // This handler updates one selected career and keeps the URL shareable.
  const selectCareer = (side, id) => {
    if (side === 'a') setCareerAId(id);
    else setCareerBId(id);
    const params = new URLSearchParams(searchParams);
    params.set(side, id);
    setSearchParams(params, { replace: true });
    setResult('');
  };
  // This handler restores the default pair and clears any prior result.
  const clearAll = () => {
    setCareerAId('cs');
    setCareerBId('mech');
    setSearchParams({ a: 'cs', b: 'mech' }, { replace: true });
    setResult('');
  };
  // This handler runs the AI comparison only after the student authenticates.
  const analyze = () => gate(async () => {
    setResult('');
    try {
      const response = await gemini.compare(careerA.name, careerB.name);
      setResult(response.text);
    } catch (error) {
      showToast(error.response?.data?.message || (error instanceof Error ? error.message : 'Unable to analyze these careers right now.'), 'error');
    }
  }, 'Register your student name to analyze careers with Gemini AI!');

  return (
    <section className="space-y-6 animate-fadeIn">
      {pair.usingFallback && <OfflineNotice />}
      <RequestError error={pair.error || careerOptions.error} onRetry={() => { pair.reload(); careerOptions.reload(); }} />
      <PageHeading
        title="Compare Careers"
        description="Make informed decisions by evaluating parameters side by side."
        action={<button type="button" onClick={clearAll} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50">Clear All</button>}
      />
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-surface-border bg-white p-4 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Comparing:</span>
        <CareerSelect label="First career to compare" value={careerAId} onChange={(id) => selectCareer('a', id)} tone="indigo" careers={careerOptions.data || []} />
        <span className="text-xs font-bold text-slate-400">vs</span>
        <CareerSelect label="Second career to compare" value={careerBId} onChange={(id) => selectCareer('b', id)} tone="purple" careers={careerOptions.data || []} />
        <button type="button" disabled={gemini.loading} onClick={analyze} className="ml-auto flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-wait disabled:opacity-60">
          <Icon name={gemini.loading ? 'faSpinner' : 'faWandMagicSparkles'} className={gemini.loading ? 'animate-spin' : ''} />
          {gemini.loading ? 'Analyzing…' : 'Analyze with Gemini AI'}
        </button>
      </div>
      {gemini.loading && <div role="status" aria-live="polite" className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-700">Comparing career paths…</div>}
      {result && <AiResultCard result={result} onClose={() => setResult('')} />}
      {pair.loading ? <SkeletonRows count={1} /> : careerA && careerB ? <ComparisonTable careerA={careerA} careerB={careerB} rows={rows} /> : null}
    </section>
  );
}
