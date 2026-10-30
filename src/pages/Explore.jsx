import { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart, FaShareSquare } from 'react-icons/fa';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { careers, careersDatabase } from '../data/careers.js';
import { OfflineNotice, RequestError, SkeletonRows } from '../components/common/RequestState.jsx';
import BenefitsRisksTab from '../components/explore/BenefitsRisksTab.jsx';
import CoursesRoadmapTab from '../components/explore/CoursesRoadmapTab.jsx';
import JobsPayScaleTab from '../components/explore/JobsPayScaleTab.jsx';
import OverviewTab from '../components/explore/OverviewTab.jsx';
import Icon from '../components/Icon.jsx';
import useAuthGate from '../hooks/useAuthGate.js';
import useRemoteData from '../hooks/useRemoteData.js';
import useSavedCareers from '../hooks/useSavedCareers.js';
import { useToast } from '../context/ToastContext.jsx';
import { getCareer, getCareers } from '../services/careerService.js';

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'courses', label: 'Courses & Roadmap' },
  { id: 'benefits', label: 'Benefits & Risks' },
  { id: 'jobs', label: 'Jobs & Pay Scale' },
];

const careerIcons = {
  'fa-solid fa-code': 'faCode',
  'fa-solid fa-brain': 'faBrain',
  'fa-solid fa-robot': 'faRobot',
  'fa-solid fa-pen-nib': 'faPenNib',
  'fa-solid fa-chart-line': 'faChartLine',
  'fa-solid fa-heart-pulse': 'faHeartPulse',
  'fa-solid fa-shield-halved': 'faShieldHalved',
};

function CareerTabContent({ tab, career, onStudy }) {
  if (tab === 'courses') return <CoursesRoadmapTab career={career} />;
  if (tab === 'benefits') return <BenefitsRisksTab career={career} />;
  if (tab === 'jobs') return <JobsPayScaleTab career={career} />;
  return <OverviewTab career={career} onStudy={onStudy} />;
}

export default function Explore() {
  const { careerId = 'cs' } = useParams();
  const navigate = useNavigate();
  const gate = useAuthGate();
  const { showToast } = useToast();
  const { user } = useOutletContext();
  const listRequest = useRemoteData(getCareers, careers);
  const careerRequest = useRemoteData(
    () => getCareer(careerId),
    careersDatabase[careerId] || careersDatabase.cs,
    [careerId],
  );
  const { savedIds, error: savedError, toggleSaved: updateSaved } = useSavedCareers(Boolean(user));
  const career = careerRequest.data;
  const availableCareers = listRequest.data || [];
  console.log('Careers received by Explore:', availableCareers.length,
     availableCareers);
  const [tab, setTab] = useState('overview');
  const saved = Boolean(career && savedIds.has(String(career.id)));

  // This effect returns to the overview whenever the selected career changes.
  useEffect(() => {
    setTab('overview');
  }, [career?.id]);

  // This handler changes the route so the selected career is shareable and reload-safe.
  const chooseCareer = (id) => navigate(`/explore/${id}`);
  // This handler gates saving and updates the heart state after authentication.
  const toggleSaved = () => gate(async () => {
    try {
      const savedNow = await updateSaved(career.id);
      showToast(savedNow ? 'Career saved' : 'Career removed');
    } catch (error) {
      showToast(error.response?.data?.message || error.message || 'Could not update saved careers.', 'error');
    }
  }, 'Register your student name to save careers to your profile!');
  // This handler copies the current career URL and reports clipboard errors.
  const shareCareer = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Career link copied');
    } catch (error) {
      showToast(error instanceof Error ? 'Could not copy the career link.' : 'Could not copy the career link.', 'error');
    }
  };
  // This handler sends the selected career id to the comparison page.
  const compareCareer = () => navigate(`/compare?a=${encodeURIComponent(career.id)}`);
  // This handler navigates to the study library without refreshing the app.
  const openStudy = () => navigate('/study');

  if (careerRequest.loading || listRequest.loading) {
    return <section className="space-y-4"><SkeletonRows count={3} /></section>;
  }

  return (
    <section className="space-y-6 animate-fadeIn">
      {careerRequest.usingFallback && <OfflineNotice />}
      <RequestError error={careerRequest.error || listRequest.error} onRetry={() => { careerRequest.reload(); listRequest.reload(); }} />
      {savedError && <RequestError error={savedError} />}
      {!career && <div role="alert" className="rounded-2xl bg-rose-50 p-6 text-sm text-rose-700">Career details could not be loaded.</div>}
      {career && <>
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => navigate('/')} className="flex items-center text-xs font-medium text-slate-500 transition hover:text-brand-600"><Icon name="faChevronRight" className="mr-2 rotate-180" />Back to Dashboard</button>
        <div className="flex gap-2">
          <button type="button" onClick={toggleSaved} aria-label={saved ? 'Remove saved career' : 'Save career'} aria-pressed={saved} className={`rounded-xl border border-surface-border bg-white p-2 transition ${saved ? 'border-rose-200 text-rose-500' : 'text-slate-600 hover:border-rose-200 hover:text-rose-500'}`}>
            {saved ? <FaHeart aria-hidden="true" /> : <FaRegHeart aria-hidden="true" />}
          </button>
          <button type="button" onClick={shareCareer} aria-label="Share career" className="rounded-xl border border-surface-border bg-white p-2 text-slate-600 transition hover:text-brand-600"><FaShareSquare aria-hidden="true" /></button>
        </div>
      </div>

      <nav aria-label="Choose career" className="flex items-center gap-2 overflow-x-auto pb-2">
        {availableCareers.map((item) => (
          <button key={item.id} type="button" aria-current={career.id === item.id ? 'page' : undefined} onClick={() => chooseCareer(item.id)} className={`shrink-0 rounded-xl px-4 py-2 text-xs font-semibold shadow-sm transition ${career.id === item.id ? 'bg-slate-900 text-white' : 'border border-surface-border bg-white text-slate-600 hover:bg-slate-50'}`}>
            {item.name}
          </button>
        ))}
      </nav>

      <article className="overflow-hidden rounded-3xl border border-surface-border bg-white shadow-sm">
        <header className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 p-6 text-white sm:p-8">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full border border-brand-400/20 bg-brand-500/30 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-brand-200">{career.category}</span>
              <span className="text-xs text-slate-400">• Degree pathways vary</span>
            </div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-4xl">{career.name}</h1>
            <p className="mt-2 text-sm font-light text-slate-300 sm:text-base">{career.tagline}</p>
          </div>
          <div className="absolute right-8 top-1/2 hidden h-32 w-44 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-4xl text-brand-300 shadow-2xl backdrop-blur-md md:flex"><Icon name={careerIcons[career.icon]} /></div>
        </header>

        <nav aria-label="Career details" className="border-b border-surface-border bg-slate-50/50 px-4 sm:px-6">
          <div className="flex space-x-2 overflow-x-auto text-sm sm:space-x-8">
            {tabs.map((item) => (
              <button key={item.id} type="button" onClick={() => setTab(item.id)} aria-current={tab === item.id ? 'page' : undefined} className={`career-sub-tab shrink-0 border-b-2 px-2 py-3.5 text-xs sm:text-sm ${tab === item.id ? 'active border-brand-500 font-bold text-brand-600' : 'border-transparent font-medium text-slate-600 hover:text-slate-900'}`}>
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="space-y-6 p-5 sm:p-8">
          <CareerTabContent tab={tab} career={career} onStudy={openStudy} />
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-surface-border pt-5">
            <button type="button" onClick={compareCareer} className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"><Icon name="faCodeCompare" className="mr-1.5" />Compare this Career</button>
            <p className="text-xs text-content-muted">Build the skills and experience employers value.</p>
          </div>
        </div>
      </article>
      </>}
    </section>
  );
}
