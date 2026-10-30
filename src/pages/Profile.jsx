import { Link, useOutletContext } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import PageHeading from '../components/PageHeading.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import useRemoteData from '../hooks/useRemoteData.js';
import { getProfileStats } from '../services/profileService.js';
import { OfflineNotice, RequestError, SkeletonRows } from '../components/common/RequestState.jsx';

const shortcuts = [
  ['/explore', 'Explore Careers', 'faHeartPulse', 'bg-rose-50 text-rose-500'],
  ['/study', 'Study Materials', 'faGraduationCap', 'bg-emerald-50 text-emerald-500'],
  ['/community', 'Peer Connections', 'faUserGroup', 'bg-purple-50 text-purple-500'],
];
const EMPTY_STATS = { saved: 0, courses: 0, connections: 0, badges: [] };

export default function Profile() {
  const { user, openAuthModal } = useAuth();
  const { handleLogout, showToast } = useOutletContext();
  const statsRequest = useRemoteData(
    () => user ? getProfileStats() : Promise.resolve(EMPTY_STATS),
    EMPTY_STATS,
    [user?.id],
  );
  const stats = statsRequest.data || EMPTY_STATS;
  const { saved, courses, connections } = stats;
  const badges = Array.isArray(stats.badges) ? stats.badges.length : Number(stats.badges || 0);
  const initials = user?.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase() || '?';

  return (
    <section className="space-y-6 animate-fadeIn">
      {statsRequest.usingFallback && <OfflineNotice />}
      <RequestError error={statsRequest.error} onRetry={statsRequest.reload} />
      {statsRequest.loading && user && <SkeletonRows count={1} />}
      <PageHeading
        title="My Profile"
        description="Manage your learning journey, saved paths and connections."
        action={user
          ? <button type="button" onClick={handleLogout} className="rounded-xl border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50">Log Out</button>
          : <button type="button" onClick={() => openAuthModal('register')} className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white">Register Account</button>}
      />
      <div className="flex flex-col items-center gap-5 rounded-3xl border border-surface-border bg-white p-6 text-center shadow-sm sm:flex-row sm:items-start sm:text-left">
        <div className="relative">
          <span className="gradient-brand flex h-24 w-24 items-center justify-center rounded-full font-display text-3xl font-extrabold text-white shadow-md ring-4 ring-indigo-50">{initials}</span>
          <span className={`absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-white ${user ? 'bg-emerald-500' : 'bg-slate-300'}`} />
        </div>
        <div className="flex-grow">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-xl font-extrabold text-content-title">{user?.name || 'Guest Student'}</h2>
              <p className="text-xs font-medium text-content-muted">{user?.stream || 'Browse mode • Register to save bookmarks'}</p>
              <p className="mt-0.5 text-xs font-semibold text-brand-600">{user?.email || 'guest@skill2career.com'}</p>
            </div>
            <button type="button" onClick={() => openAuthModal(user ? 'edit' : 'register')} className="rounded-xl border border-surface-border px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
              <Icon name="faUser" className="mr-1" />{user ? 'Update Details' : 'Create Profile'}
            </button>
          </div>
          <div className="mt-6 grid grid-cols-4 gap-2 border-t border-surface-border pt-5 text-center sm:gap-4">
            <Link to="/explore" aria-label={`${saved} saved careers; explore careers`} className="rounded-xl transition hover:bg-slate-50"><Stat value={saved} label="Saved" /></Link>
            <Link to="/study" aria-label={`${courses} completed courses; open study materials`} className="rounded-xl transition hover:bg-slate-50"><Stat value={courses} label="Courses" /></Link>
            <Link to="/community" aria-label={`${connections} peer connections; open community`} className="rounded-xl transition hover:bg-slate-50"><Stat value={connections} label="Connections" /></Link>
            <button type="button" onClick={() => showToast('Verified badges issued by skill2career')} aria-label={`${badges} badges; learn about verified badges`} className="rounded-xl transition hover:bg-slate-50"><Stat value={badges} label="Badges" /></button>
          </div>
        </div>
      </div>
      <div className="divide-y divide-surface-border overflow-hidden rounded-3xl border border-surface-border bg-white shadow-sm">
        {shortcuts.map(([to, label, icon, color]) => (
          <Link key={to} to={to} className="flex items-center justify-between p-4 transition hover:bg-slate-50">
            <span className="flex items-center gap-3.5">
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm ${color}`}><Icon name={icon} /></span>
              <span className="text-xs font-semibold text-content-title sm:text-sm">{label}</span>
            </span>
            <Icon name="faChevronRight" className="text-xs text-slate-300" />
          </Link>
        ))}
      </div>
    </section>
  );
}

function Stat({ value, label }) {
  return <div className="rounded-xl p-2"><span className="block font-display text-lg font-extrabold text-content-title sm:text-2xl">{value}</span><span className="text-[11px] font-medium text-content-muted">{label}</span></div>;
}
