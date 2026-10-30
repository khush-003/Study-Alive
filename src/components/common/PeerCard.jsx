import Avatar from './Avatar.jsx';

/**
 * Props: peer (peer object), connected (boolean), onToggle (called with peer).
 * Usage: <PeerCard peer={peer} connected={isConnected} onToggle={toggleConnection} />
 */
export default function PeerCard({ peer, connected = false, onToggle, isCurrentUser = false }) {
  return (
    <article className="flex items-center justify-between gap-3 rounded-2xl border border-surface-border bg-white p-4 shadow-sm">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar name={peer.name} src={peer.avatar} size={48} />
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold text-content-title">{peer.name}</h3>
          <p className="mt-1 text-[11px] text-content-muted"><span className="font-medium text-emerald-600">Teaches:</span> {peer.teaches}</p>
          <p className="text-[11px] text-content-muted"><span className="font-medium text-indigo-600">Wants to learn:</span> {peer.wantsToLearn}</p>
        </div>
      </div>
      <button type="button" onClick={() => onToggle(peer)} aria-pressed={connected} disabled={isCurrentUser} className={`shrink-0 rounded-xl px-3 py-2 text-xs font-semibold ${isCurrentUser ? 'cursor-default bg-slate-100 text-slate-500' : connected ? 'border border-emerald-200 bg-emerald-50 text-emerald-700' : 'bg-slate-900 text-white'}`}>{isCurrentUser ? 'Your offer' : connected ? 'Connected' : 'Connect'}</button>
    </article>
  );
}
