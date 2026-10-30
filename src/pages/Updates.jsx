import { useState } from 'react';
import UpdateCard from '../components/common/UpdateCard.jsx';
import Icon from '../components/Icon.jsx';
import PageHeading from '../components/PageHeading.jsx';
import { useToast } from '../context/ToastContext.jsx';
import useAuthGate from '../hooks/useAuthGate.js';
import useFilter from '../hooks/useFilter.js';
import { updates } from '../data/updates.js';
import useRemoteData from '../hooks/useRemoteData.js';
import { getUpdates } from '../services/updateService.js';
import { OfflineNotice, RequestError, SkeletonRows } from '../components/common/RequestState.jsx';

const categories = [
  { id: 'all', label: 'All' },
  { id: 'exams', label: 'Exams' },
  { id: 'admissions', label: 'Admissions' },
  { id: 'scholarships', label: 'Scholarships' },
  { id: 'events', label: 'Events' },
  { id: 'reports', label: 'Reports' },
];

export default function Updates() {
  const { showToast } = useToast();
  const gate = useAuthGate();
  const [expandedId, setExpandedId] = useState(null);
  const request = useRemoteData(
    async () => (await getUpdates({ page: 1, limit: 100 })).items,
    updates,
  );
  const { filteredItems, query, setQuery, category, setCategory } = useFilter(request.data || [], {
    searchKeys: ['title', 'summary', 'details', 'label'],
    category: 'all',
  });
  // This handler gates notification enrollment and reports the enabled state.
  const enableAlerts = () => gate(() => showToast('Update alerts enabled!'), 'Register to enable update alerts!');
  // This handler allows only one update card to remain expanded at a time.
  const toggleExpanded = (update) => setExpandedId((current) => current === update.id ? null : update.id);

  return (
    <section className="space-y-6 animate-fadeIn">
      {request.usingFallback && <OfflineNotice />}
      <RequestError error={request.error} onRetry={request.reload} />
      {request.loading && <SkeletonRows count={3} />}
      <PageHeading
        title="Latest Updates"
        description="Stay up to date with admissions, scholarships, exams and student events."
        action={<button type="button" onClick={enableAlerts} className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white"><Icon name="faBell" className="mr-2" />Enable Alerts</button>}
      />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search updates..."
        aria-label="Search updates"
        className="w-full rounded-xl border border-surface-border bg-white px-4 py-2.5 text-sm"
      />
      <div className="flex flex-wrap gap-2" aria-label="Filter updates by category">
        {categories.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={category === item.id}
            onClick={() => setCategory(item.id)}
            className={`rounded-full border px-3 py-1.5 text-xs ${category === item.id ? 'border-slate-900 bg-slate-900 font-bold text-white' : 'border-surface-border bg-white text-slate-600 hover:bg-slate-50'}`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filteredItems.map((update) => (
          <UpdateCard
            key={update.id}
            update={update}
            expanded={expandedId === update.id}
            onToggle={toggleExpanded}
          />
        ))}
        {!request.loading && !request.error && filteredItems.length === 0 && (
          <div className="rounded-2xl border border-dashed border-surface-border bg-white p-8 text-center text-sm text-content-muted">
            No updates match your search and category.
          </div>
        )}
      </div>
    </section>
  );
}
