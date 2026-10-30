import { useCallback, useEffect, useState } from 'react';
import { getSavedCareers, removeSavedCareer, saveCareer } from '../services/careerService.js';

// Keep saved ids sourced from the server and roll back failed optimistic changes.
export default function useSavedCareers(authenticated) {
  const [savedIds, setSavedIds] = useState(() => new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    if (!authenticated) {
      setSavedIds(new Set());
      setLoading(false);
      setError(null);
      return () => { active = false; };
    }

    setLoading(true);
    setError(null);
    getSavedCareers()
      .then((careers) => {
        if (active) setSavedIds(new Set(careers.map((career) => String(career.id))));
      })
      .catch((requestError) => { if (active) setError(requestError); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [authenticated]);

  const toggleSaved = useCallback(async (careerId) => {
    const id = String(careerId);
    const wasSaved = savedIds.has(id);
    setSavedIds((current) => {
      const next = new Set(current);
      if (wasSaved) next.delete(id);
      else next.add(id);
      return next;
    });
    try {
      if (wasSaved) await removeSavedCareer(id);
      else await saveCareer(id);
      return !wasSaved;
    } catch (error) {
      setSavedIds((current) => {
        const next = new Set(current);
        if (wasSaved) next.add(id);
        else next.delete(id);
        return next;
      });
      throw error;
    }
  }, [savedIds]);

  return { savedIds, loading, error, toggleSaved };
}
