import { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { peers as fallbackPeers } from '../data/peers.js';
import { sessions as fallbackSessions } from '../data/sessions.js';
import Icon from '../components/Icon.jsx';
import PageHeading from '../components/PageHeading.jsx';
import PeerCard from '../components/common/PeerCard.jsx';
import SessionCard from '../components/common/SessionCard.jsx';
import { OfflineNotice, RequestError, SkeletonRows } from '../components/common/RequestState.jsx';
import useDebounce from '../hooks/useDebounce.js';
import useRemoteData from '../hooks/useRemoteData.js';
import { getConnections, getMySkillOffers, getPeers, getSessions, reserveSession, toggleConnection } from '../services/communityService.js';

const EMPTY_LIST = [];

export default function Community() {
  const { gate, showToast, openShareSkill, publishedOffers = [], user } = useOutletContext();
  const [tab, setTab] = useState('people');
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 200);
  const peersRequest = useRemoteData(
    () => getPeers(debouncedQuery ? { q: debouncedQuery } : {}),
    fallbackPeers,
    [debouncedQuery],
  );
  const sessionsRequest = useRemoteData(async () => {
    const records = await getSessions();
    return records.map((session) => ({
      ...session,
      time: new Date(session.startsAt).toLocaleString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }),
    }));
  }, fallbackSessions);
  const connectionsRequest = useRemoteData(
    () => user ? getConnections() : Promise.resolve(EMPTY_LIST),
    EMPTY_LIST,
    [user?.id],
  );
  const ownOffersRequest = useRemoteData(
    () => user ? getMySkillOffers() : Promise.resolve(EMPTY_LIST),
    EMPTY_LIST,
    [user?.id],
  );
  const ownOffers = useMemo(() => {
    const records = (ownOffersRequest.data || []).map((offer) => ({
      ...offer,
      id: offer.userId,
      owner: offer.name,
      ownerEmail: user?.email,
      isCurrentUser: true,
    }));
    return [...publishedOffers, ...records.filter((record) => (
      !publishedOffers.some((offer) => String(offer.offerId) === String(record.offerId))
    ))];
  }, [ownOffersRequest.data, publishedOffers, user?.email]);
  const allPeers = useMemo(() => [...ownOffers, ...(peersRequest.data || [])], [ownOffers, peersRequest.data]);
  const searchTerm = query.trim().toLowerCase();
  const visiblePeers = useMemo(() => allPeers.filter((peer) => (
    !searchTerm || `${peer.name} ${peer.teaches} ${peer.wantsToLearn}`.toLowerCase().includes(searchTerm)
  )), [allPeers, searchTerm]);
  const connectedIds = new Set((connectionsRequest.data || []).map((connection) => String(connection.id)));

  // This handler updates the peer's connection state optimistically and restores it on failure.
  const togglePeerConnection = (peer) => gate(async () => {
    const wasConnected = connectedIds.has(String(peer.id));
    const previous = connectionsRequest.data || [];
    connectionsRequest.setData(wasConnected
      ? previous.filter((connection) => String(connection.id) !== String(peer.id))
      : [...previous, { id: peer.id, name: peer.name, avatar: peer.avatar }]);
    try {
      const state = await toggleConnection(peer.id);
      if (state.connected !== !wasConnected) {
        connectionsRequest.setData((current) => state.connected
          ? [...current.filter((connection) => String(connection.id) !== String(peer.id)), { id: peer.id, name: peer.name, avatar: peer.avatar }]
          : current.filter((connection) => String(connection.id) !== String(peer.id)));
      }
      showToast(state.connected ? `Connected with ${peer.name}` : 'Disconnected');
    } catch (error) {
      connectionsRequest.setData(previous);
      showToast(error.response?.data?.message || error.message || 'Could not update this connection.', 'error');
    }
  }, `Register your name to connect and swap skills with ${peer.name}!`);

  // This handler reserves a live session optimistically and rolls it back if the API rejects it.
  const reserve = (session) => gate(async () => {
    const previous = sessionsRequest.data || [];
    sessionsRequest.setData(previous.map((item) => item.id === session.id ? { ...item, reserved: true } : item));
    try {
      await reserveSession(session.id);
      showToast(`Reserved your spot for "${session.title}"!`);
    } catch (error) {
      sessionsRequest.setData(previous);
      showToast(error.response?.data?.message || error.message || 'Could not reserve this session.', 'error');
    }
  }, 'Register your student name to reserve your free spot!');

  return (
    <section className="space-y-6 animate-fadeIn">
      {peersRequest.usingFallback && <OfflineNotice />}
      <RequestError error={peersRequest.error || sessionsRequest.error || connectionsRequest.error || ownOffersRequest.error} onRetry={() => {
        peersRequest.reload();
        sessionsRequest.reload();
        connectionsRequest.reload();
        ownOffersRequest.reload();
      }} />
      {(peersRequest.loading || sessionsRequest.loading || connectionsRequest.loading || ownOffersRequest.loading) && <SkeletonRows count={2} />}
      <PageHeading
        title="Skill Sharing Community"
        description="Find study partners, mentors, and peers to learn together."
        action={<button type="button" onClick={openShareSkill} className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"><Icon name="faUserGroup" className="mr-1.5" />Share a Skill</button>}
      />
      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-4">
          <div className="flex max-w-sm rounded-xl bg-slate-100 p-1">
            <button type="button" aria-pressed={tab === 'people'} onClick={() => setTab('people')} className={`w-1/2 rounded-lg py-2 text-xs font-bold ${tab === 'people' ? 'bg-white text-content-title shadow-sm' : 'text-content-muted'}`}>Find People</button>
            <button type="button" aria-pressed={tab === 'sessions'} onClick={() => setTab('sessions')} className={`w-1/2 rounded-lg py-2 text-xs font-bold ${tab === 'sessions' ? 'bg-white text-content-title shadow-sm' : 'text-content-muted'}`}>Live Sessions</button>
          </div>
          {tab === 'people' ? (
            <>
              <div className="relative">
                <Icon name="faMagnifyingGlass" className="absolute left-3.5 top-3 text-xs text-slate-400" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by skill, interest, or name..." aria-label="Search peers" className="w-full rounded-xl border border-surface-border bg-white py-2.5 pl-9 pr-4 text-xs shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 sm:text-sm" />
              </div>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-content-title">Students open to mentoring &amp; skill exchange</h2>
                <span className="shrink-0 text-xs text-slate-400">{allPeers.length} Active Mentors</span>
              </div>
              {visiblePeers.length ? (
                <div className="grid gap-3.5 md:grid-cols-2">
                  {visiblePeers.map((peer) => (
                    <PeerCard key={`${peer.id}-${peer.offerId || peer.id}`} peer={peer} connected={connectedIds.has(String(peer.id))} onToggle={togglePeerConnection} isCurrentUser={peer.isCurrentUser} />
                  ))}
                </div>
              ) : !peersRequest.loading && (
                <div className="rounded-2xl border border-dashed border-surface-border bg-white p-8 text-center">
                  <h3 className="text-sm font-bold text-content-title">No peers found</h3>
                  <p className="mt-1 text-xs text-content-muted">Try another name or skill to find a learning partner.</p>
                </div>
              )}
            </>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {(sessionsRequest.data || []).map((session) => (
                <SessionCard key={session.id} session={session} reserved={Boolean(session.reserved)} onReserve={reserve} />
              ))}
            </div>
          )}
        </div>
        <aside className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white"><Icon name="faUserGroup" /></span>
          <h2 className="mt-4 font-display text-xl font-extrabold text-content-title">Learn better, together</h2>
          <p className="mt-2 text-sm leading-6 text-content-muted">Exchange a skill you know for one you want to learn. Students grow faster when they share what they know.</p>
          <button type="button" onClick={openShareSkill} className="mt-5 rounded-xl border border-surface-border bg-white px-4 py-2.5 text-xs font-semibold text-brand-600 transition hover:bg-brand-50">Post a skill offer</button>
        </aside>
      </div>
    </section>
  );
}
