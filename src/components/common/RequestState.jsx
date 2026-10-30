// Show reusable loading rows or an actionable error for remote-backed screens.
export function SkeletonRows({ count = 3 }) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading content">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="animate-pulse rounded-2xl border border-surface-border bg-white p-5">
          <div className="h-4 w-1/3 rounded bg-slate-200" />
          <div className="mt-3 h-3 w-2/3 rounded bg-slate-100" />
          <div className="mt-2 h-3 w-1/2 rounded bg-slate-100" />
        </div>
      ))}
      <span className="sr-only">Loading content</span>
    </div>
  );
}

export function RequestError({ error, onRetry }) {
  if (!error) return null;
  return (
    <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
      <span>{error.response?.data?.message || (error.message === 'Network Error' ? 'The server is unavailable.' : error.message)}</span>
      {onRetry && <button type="button" onClick={onRetry} className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 shadow-sm">Retry</button>}
    </div>
  );
}

export function OfflineNotice() {
  return <p role="status" className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">The server is unreachable. Showing sample data.</p>;
}
