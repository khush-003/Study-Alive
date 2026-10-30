import { useCallback, useEffect, useRef, useState } from 'react';

// Load remote data and use local sample data only when the API cannot be reached.
export default function useRemoteData(loader, fallback, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const requestId = useRef(0);

  const reload = useCallback(async () => {
    const currentRequestId = ++requestId.current;
    setLoading(true);
    setError(null);
    setUsingFallback(false);
    try {
      const result = await loader();
      if (requestId.current === currentRequestId) setData(result);
    } catch (requestError) {
      if (requestId.current !== currentRequestId) return;
      setError(requestError);
      if (!requestError.response) {
        setData(fallback);
        setUsingFallback(true);
      }
    } finally {
      if (requestId.current === currentRequestId) setLoading(false);
    }
  // Loader identity is governed by the explicit dependency list supplied by callers.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fallback, ...dependencies]);

  // This effect reloads whenever request dependencies change and ignores stale responses.
  useEffect(() => {
    reload();
    return () => { requestId.current += 1; };
  }, [reload]);

  return { data, setData, loading, error, usingFallback, reload };
}
