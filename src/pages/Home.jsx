import { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { careers } from '../data/careers.js';
import { topCareerOptions, trendingCards } from '../data/trending.js';
import CareerCard from '../components/common/CareerCard.jsx';
import { OfflineNotice, RequestError, SkeletonRows } from '../components/common/RequestState.jsx';
import SectionHeader from '../components/common/SectionHeader.jsx';
import Icon from '../components/Icon.jsx';
import useDebounce from '../hooks/useDebounce.js';
import useOutsideClick from '../hooks/useOutsideClick.js';
import useRemoteData from '../hooks/useRemoteData.js';
import { getCareers, getTrendingCareers } from '../services/careerService.js';

const shortcuts = [
  { path: '/explore', title: 'Career Guidance', subtitle: 'Explore 150+ Careers', icon: 'faCompass', color: 'blue' },
  { path: '/study', title: 'Study Materials', subtitle: 'Notes, PYQs, Revision', icon: 'faBookOpen', color: 'emerald' },
  { path: '/community', title: 'Skill Sharing', subtitle: 'Learn 1-on-1 with Peers', icon: 'faUserGroup', color: 'purple' },
  { path: '/updates', title: 'Latest Updates', subtitle: 'Exams, Scholarships, Events', icon: 'faBell', color: 'amber' },
];

const colorStyles = {
  blue: 'bg-blue-50 text-blue-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  purple: 'bg-purple-50 text-purple-600',
  amber: 'bg-amber-50 text-amber-600',
  indigo: 'bg-indigo-50 text-brand-600',
  rose: 'bg-rose-50 text-rose-600',
  teal: 'bg-teal-50 text-teal-600',
  orange: 'bg-orange-50 text-orange-600',
};

const iconsByClass = {
  'fa-solid fa-code': 'faCode',
  'fa-solid fa-database': 'faDatabase',
  'fa-solid fa-shield-halved': 'faShieldHalved',
  'fa-solid fa-robot': 'faRobot',
};

const homeFallback = { careers, trendingCards, topCareerOptions };
const careerColors = ['indigo', 'rose', 'amber', 'teal'];
const careerIconNames = {
  cs: 'fa-solid fa-code',
  ds: 'fa-solid fa-database',
  cyber: 'fa-solid fa-shield-halved',
  mech: 'fa-solid fa-robot',
  design: 'fa-solid fa-pen-nib',
  medical: 'fa-solid fa-heart-pulse',
  business: 'fa-solid fa-chart-line',
};

export default function HomePage({ user, onAuth }) {
  const navigate = useNavigate();
  const loadHomeData = async () => {
    const [careerList, trendingList] = await Promise.all([getCareers(), getTrendingCareers()]);
    const topOptions = careerList.flatMap((career) => (career.jobProfiles || []).slice(0, 1).map((job) => ({
      id: `${career.id}-${job.title}`,
      careerId: career.id,
      title: job.title,
      summary: job.stack,
      salary: job.salary || career.averageSalary,
      iconClass: careerIconNames[career.id] || career.icon,
      color: careerColors[careerList.indexOf(career) % careerColors.length],
    }))).slice(0, 4);
    return {
      careers: careerList,
      trendingCards: trendingList.map((career, index) => ({
        id: career.id,
        careerId: career.id,
        title: career.name,
        badge: career.category || 'Trending',
        iconClass: careerIconNames[career.id] || career.icon,
        color: careerColors[index % careerColors.length],
      })),
      topCareerOptions: topOptions,
    };
  };
  const { data: homeData, loading, error, usingFallback, reload } = useRemoteData(loadHomeData, homeFallback);
  const homeCareers = homeData?.careers || [];
  const homeTrending = homeData?.trendingCards || [];
  const homeOptions = homeData?.topCareerOptions || [];
  // This state controls the search text and visibility of the suggestions.
  const [query, setQuery] = useState('');
  const searchRef = useRef(null);
  const debouncedQuery = useDebounce(query, 180);
  // This handler closes the suggestions when the student clicks elsewhere.
  const closeSuggestions = useCallback(() => setQuery(''), []);
  useOutsideClick(searchRef, closeSuggestions, Boolean(query));
  // This memo matches career names and skill descriptions after typing pauses.
  const suggestions = useMemo(() => {
    const searchTerm = debouncedQuery.trim().toLowerCase();
    if (searchTerm.length < 2) return [];
    return homeCareers.filter((career) => `${career.name} ${career.requiredSkills}`.toLowerCase().includes(searchTerm)).slice(0, 5);
  }, [debouncedQuery, homeCareers]);
  // This handler opens the career route and clears the search field.
  const openCareer = (careerId) => {
    navigate(`/explore/${careerId}`);
    setQuery('');
  };

  return (
    <section className="space-y-8 animate-fadeIn">
      {usingFallback && <OfflineNotice />}
      <RequestError error={error} onRetry={reload} />
      {loading && <SkeletonRows count={2} />}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <span className="flex items-center gap-1.5 text-sm font-medium text-brand-600">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            {user ? 'Your learning journey' : 'Explore Pathways & Courses'}
          </span>
          <h1 className="mt-0.5 font-display text-2xl font-extrabold tracking-tight text-content-title sm:text-3xl">
            Hi <span className="text-brand-600">{user?.name ?? 'Learner'}</span>, What would you like to explore today?
          </h1>
          <p className="mt-1 text-sm text-content-muted">Discover verified career pathways, peer mentors, and study kits for 2026.</p>
        </div>
        <div ref={searchRef} className="relative w-full md:w-80">
          <Icon name="faMagnifyingGlass" className="absolute left-3.5 top-3.5 text-sm text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search careers, courses, skills..."
            aria-label="Search careers, courses, and skills"
            aria-expanded={query.trim().length >= 2 && debouncedQuery.trim().length >= 2}
            aria-controls="home-search-suggestions"
            className="w-full rounded-xl border border-surface-border bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm transition-all focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
          {query.trim().length >= 2 && debouncedQuery.trim().length >= 2 && (
            <div id="home-search-suggestions" role="listbox" className="absolute left-0 right-0 top-12 z-30 space-y-1 rounded-xl border border-surface-border bg-white p-2 text-xs shadow-xl">
              {suggestions.length ? suggestions.map((career) => (
                <button key={career.id} type="button" role="option" aria-selected="false" onClick={() => openCareer(career.id)} className="flex w-full items-center justify-between rounded-lg p-2 text-left hover:bg-slate-100">
                  <span className="font-semibold text-slate-800">{career.name}</span><span className="text-[10px] text-brand-600">Explore →</span>
                </button>
              )) : <p className="p-2 text-slate-400">No matching careers found</p>}
            </div>
          )}
        </div>
      </div>

      {!user && (
        <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent p-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white"><Icon name="faGraduationCap" /></span>
            <div><h2 className="text-xs font-bold text-slate-900 sm:text-sm">Want to download notes, connect with mentors or test with AI?</h2><p className="text-[11px] text-slate-500">Register your student name in seconds to unlock full access.</p></div>
          </div>
          <button type="button" onClick={() => onAuth('register', 'Register to unlock free downloads and peer mentorship!')} className="shrink-0 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800">Register to Learn Free</button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {shortcuts.map((item) => (
          <button key={item.path} type="button" onClick={() => navigate(item.path)} className="group flex flex-col items-center rounded-2xl border border-surface-border bg-white p-4 text-center shadow-sm transition-all hover:border-brand-200 hover:shadow-md">
            <span className={`mb-2.5 flex h-12 w-12 items-center justify-center rounded-xl text-lg transition-transform group-hover:scale-110 ${colorStyles[item.color]}`}><Icon name={item.icon} /></span>
            <span className="text-xs font-bold text-content-title sm:text-sm">{item.title}</span><span className="text-[11px] text-content-muted">{item.subtitle}</span>
          </button>
        ))}
      </div>

      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl">
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-950 via-slate-900/90 to-indigo-950/60" />
        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80" alt="Students studying together" className="absolute inset-0 h-full w-full object-cover object-center opacity-30 mix-blend-overlay" />
        <div className="relative z-20 flex flex-col items-start justify-between gap-6 p-6 md:flex-row md:items-center sm:p-10">
          <div className="max-w-xl">
            <span className="rounded-full border border-brand-500/30 bg-brand-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-200">Future Ready 2026</span>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Small Steps <br /><span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Big Futures</span></h2>
            <p className="mt-2 text-sm font-light text-slate-300 sm:text-base">Explore. Learn. Connect. Grow. Overcome your doubts with personalized career maps, curated study decks, and student mentors who have been there.</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <button type="button" onClick={() => navigate('/explore')} className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition-all hover:bg-slate-100"><span>Explore Pathways</span><Icon name="faArrowRight" className="text-xs" /></button>
            <button type="button" onClick={() => navigate('/compare')} className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-medium text-white backdrop-blur transition-all hover:bg-white/20"><Icon name="faCodeCompare" className="text-xs" /><span>Compare Careers</span></button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader title="Trending Career Paths" subtitle="Top high-demand sectors chosen by modern students" actionLabel="See all" onAction={() => navigate('/explore')} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {homeTrending.map((item) => {
            const profile = homeCareers.find((career) => career.id === item.careerId);
            if (!profile) return null;
            const career = { ...profile, name: item.title, category: item.badge };
            return <CareerCard key={item.id} career={career} onSelect={(selectedCareer) => openCareer(selectedCareer.id)} />;
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-surface-border bg-white p-6 shadow-sm">
        <SectionHeader title="Top Career Options" subtitle="Deep dive into scope, salaries, and real requirements" actionLabel="See all" onAction={() => navigate('/explore')} />
        <div className="mt-4 divide-y divide-surface-border">
          {homeOptions.map((item) => (
            <button key={item.id} type="button" onClick={() => openCareer(item.careerId)} className="group flex w-full items-center justify-between gap-3 rounded-xl px-3 py-4 text-left transition hover:bg-slate-50">
              <span className="flex min-w-0 items-center gap-3.5">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colorStyles[item.color]}`}><Icon name={iconsByClass[item.iconClass]} /></span>
                <span className="min-w-0"><span className="block text-sm font-bold text-content-title transition-colors group-hover:text-brand-600">{item.title}</span><span className="block text-xs text-content-muted">{item.summary}</span></span>
              </span>
              <span className="flex shrink-0 items-center gap-3"><span className="hidden rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 sm:inline-block">{item.salary}</span><Icon name="faChevronRight" className="text-slate-300 transition group-hover:text-slate-600" /></span>
            </button>
          ))}
        </div>
      </section>
    </section>
  );
}
