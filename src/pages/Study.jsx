import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { studyMaterialsBySubject, studySubjects } from '../data/studyMaterials.js';
import { OfflineNotice, RequestError, SkeletonRows } from '../components/common/RequestState.jsx';
import Icon from '../components/Icon.jsx';
import PageHeading from '../components/PageHeading.jsx';
import MaterialCard from '../components/common/MaterialCard.jsx';
import VideoModal from '../components/modals/VideoModal.jsx';
import useAuthGate from '../hooks/useAuthGate.js';
import useFilter from '../hooks/useFilter.js';
import { useToast } from '../context/ToastContext.jsx';
import { downloadResource, getMaterials, viewVideo } from '../services/studyService.js';
import useRemoteData from '../hooks/useRemoteData.js';

const filters = [
  { id: 'all', label: 'All' },
  { id: 'notes', label: 'Notes (PDF)' },
  { id: 'videos', label: 'Videos' },
  { id: 'practice', label: 'Practice Papers' },
  { id: 'books', label: 'Books & Syllabus' },
];

export default function Study() {
  // This state selects the subject whose resources should be displayed.
  const [subject, setSubject] = useState('cs');
  // This state stores the video lesson currently open in the preview modal.
  const [activeVideo, setActiveVideo] = useState(null);
  const gate = useAuthGate();
  const { showToast } = useToast();
  const { openAiStudy, openResourceRequest } = useOutletContext();
  const fallbackMaterials = useMemo(() => Object.values(studyMaterialsBySubject).flat(), []);
  const materialRequest = useRemoteData(getMaterials, fallbackMaterials);
  const allMaterials = useMemo(() => (materialRequest.data || []).map((material) => ({
    ...material,
    iconClass: material.type === 'videos'
      ? 'fa-solid fa-circle-play'
      : material.type === 'practice'
        ? 'fa-regular fa-clipboard'
        : material.type === 'books'
          ? 'fa-solid fa-bolt'
          : 'fa-regular fa-file-pdf',
    color: material.type === 'videos' ? 'blue' : material.type === 'practice' ? 'emerald' : material.type === 'books' ? 'purple' : 'red',
    meta: material.meta || material.description || material.type,
  })), [materialRequest.data]);
  const subjects = [...new Set(allMaterials.map((material) => material.subject))];
  // This effect selects the first available API subject if the prior choice is absent.
  useEffect(() => {
    if (subjects.length && !subjects.includes(subject)) setSubject(subjects[0]);
  }, [subjects.join('|'), subject]);
  const subjectDetails = studySubjects.find((item) => item.id === subject);
  const currentSubject = subjectDetails || {
    id: subject,
    label: subject.replace(/[-_]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()),
    description: 'Study materials for this subject',
  };
  const materials = useMemo(() => allMaterials.filter((material) => material.subject === subject), [allMaterials, subject]);
  // This hook combines text search and type filtering against the selected subject.
  const { filteredItems, query, setQuery, category, setCategory } = useFilter(materials, {
    searchKeys: ['title', 'meta'],
    category: 'all',
    categoryKey: 'type',
  });

  // This handler downloads a resource only after authentication succeeds.
  const handleDownload = (material) => gate(async () => {
    try {
      showToast(await downloadResource(material.id));
    } catch (error) {
      showToast(error.response?.data?.message || (error instanceof Error ? error.message : 'Unable to download this resource.'), 'error');
    }
  }, `Register your name to download "${material.filename}"`);
  // This handler opens the video preview after authentication succeeds.
  const handlePlay = (material) => gate(async () => {
    try {
      const video = await viewVideo(material.id);
      setActiveVideo({ ...material, videoUrl: new URL(video.fileUrl, import.meta.env.VITE_API_URL || window.location.origin).href });
    } catch (error) {
      showToast(error.response?.data?.message || (error instanceof Error ? error.message : 'Unable to open this video.'), 'error');
    }
  }, `Register to start watching "${material.title}"`);

  return (
    <section className="space-y-6 animate-fadeIn">
      {materialRequest.usingFallback && <OfflineNotice />}
      <RequestError error={materialRequest.error} onRetry={materialRequest.reload} />
      {materialRequest.loading && <SkeletonRows count={3} />}
      <PageHeading
        title="Study Materials"
        description="Learn. Practice. Excel. Handcrafted notes and question banks."
        action={(
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={openAiStudy} className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:opacity-95"><Icon name="faWandMagicSparkles" className="mr-1.5" />Gemini AI Study Kit</button>
            <button type="button" onClick={openResourceRequest} className="rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-600 transition hover:bg-brand-100"><Icon name="faFileArrowUp" className="mr-1.5" />Request a Resource</button>
          </div>
        )}
      />

      <div className="space-y-4 rounded-2xl border border-surface-border bg-white p-4 shadow-sm">
        <div className="relative">
          <Icon name="faMagnifyingGlass" className="absolute left-3.5 top-3 text-xs text-slate-400" />
          <label htmlFor="study-search" className="sr-only">Search study materials</label>
          <input id="study-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search for subjects, topics, or resources..." className="w-full rounded-xl border border-surface-border bg-slate-50 py-2 pl-9 pr-4 text-xs focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 sm:text-sm" />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {filters.map((filter) => (
            <button key={filter.id} type="button" aria-pressed={category === filter.id} onClick={() => setCategory(filter.id)} className={`shrink-0 rounded-full px-3.5 py-1.5 transition ${category === filter.id ? 'bg-slate-900 font-bold text-white' : 'bg-slate-100 font-medium text-slate-600 hover:bg-slate-200'}`}>{filter.label}</button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-surface-border bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-sm text-indigo-600"><Icon name="faGraduationCap" /></span>
          <div><span className="block text-xs font-bold text-slate-900">{currentSubject.label}</span><span className="text-[10px] text-slate-500">{currentSubject.description}</span></div>
        </div>
        <label className="sr-only" htmlFor="study-subject-select">Select study subject</label>
        <select id="study-subject-select" value={subject} onChange={(event) => setSubject(event.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20">
          {subjects.map((id) => {
            const option = studySubjects.find((item) => item.id === id);
            return <option key={id} value={id}>{option?.label || id}</option>;
          })}
        </select>
      </div>

      <div className="space-y-3">
        {filteredItems.map((material) => (
          <MaterialCard key={material.id} material={material} onDownload={handleDownload} onPlay={handlePlay} />
        ))}
        {!materialRequest.loading && !materialRequest.error && filteredItems.length === 0 && (
          <div className="rounded-2xl border border-dashed border-surface-border bg-white p-8 text-center">
            <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500"><Icon name="faMagnifyingGlass" /></span>
            <h2 className="mt-3 text-sm font-bold text-content-title">No study materials found</h2>
            <p className="mt-1 text-xs text-content-muted">Try another search or choose a different resource type.</p>
          </div>
        )}
      </div>
      <VideoModal isOpen={Boolean(activeVideo)} title={activeVideo?.title} length={activeVideo?.duration} videoUrl={activeVideo?.videoUrl} onClose={() => setActiveVideo(null)} />
    </section>
  );
}
