import { useEffect, useState } from 'react';

// This hook delays rapidly changing values so search work runs after typing pauses.
export default function useDebounce(value, delay = 300) {
  // This state keeps the last value that remained unchanged for the delay.
  const [debouncedValue, setDebouncedValue] = useState(value);

  // This effect replaces its timer whenever the input value or delay changes.
  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timer);
  }, [delay, value]);

  return debouncedValue;
}
