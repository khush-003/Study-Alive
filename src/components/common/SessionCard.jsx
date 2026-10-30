/**
 * Props: session (live session object), reserved (boolean), onReserve (called with session).
 * Usage: <SessionCard session={session} reserved={isReserved} onReserve={reserveSession} />
 */
export default function SessionCard({ session, reserved = false, onReserve }) {
  return (
    <article className="flex flex-col justify-between rounded-2xl border border-surface-border bg-white p-5 shadow-sm">
      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold uppercase text-indigo-600">{session.badge}</span>
          <span className="text-xs text-slate-500">{session.time}</span>
        </div>
        <h3 className="text-sm font-bold text-content-title">{session.title}</h3>
        <p className="mt-1 text-xs text-content-muted">Speaker: {session.speaker}</p>
      </div>
      <button type="button" onClick={() => onReserve(session)} aria-pressed={reserved} disabled={reserved} className={`mt-4 w-full rounded-xl py-2 text-xs font-semibold transition disabled:cursor-not-allowed ${reserved ? 'border border-emerald-200 bg-emerald-50 text-emerald-700' : 'bg-brand-500 text-white hover:bg-brand-600'}`}>{reserved ? 'Reserved' : 'Reserve Free Spot'}</button>
    </article>
  );
}
