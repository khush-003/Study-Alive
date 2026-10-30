import { useCallback, useState } from 'react';
import askAiService, { compareWithAi, generateStudyKit } from '../services/aiService.js';

// This hook centralizes loading and error state for server-side AI requests.
export default function useGemini() {
  // These states expose the current request status and its latest response/error.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [text, setText] = useState('');
  const [sources, setSources] = useState([]);

  // This handler sends one request; retry/backoff is handled privately by the backend.
  const runRequest = useCallback(async (request) => {
    setLoading(true);
    setError(null);
    setText('');
    setSources([]);
    try {
      const result = await request();
      setText(result.text);
      setSources(result.sources);
      return result;
    } catch (requestError) {
      const message = requestError?.response?.data?.message
        || (requestError instanceof Error ? requestError.message : 'Unable to reach the AI service.');
      setError(message);
      throw requestError;
    } finally {
      setLoading(false);
    }
  }, []);

  // These handlers use task-specific API routes so prompts remain server-owned.
  // These callbacks use the shared API client's current bearer token.
  const ask = useCallback((prompt, useSearch = false) => (
    runRequest(() => askAiService(prompt, useSearch))
  ), [runRequest]);
  const compare = useCallback((careerA, careerB) => (
    runRequest(() => compareWithAi(careerA, careerB))
  ), [runRequest]);
  const studyKit = useCallback((topic, type) => (
    runRequest(() => generateStudyKit(topic, type))
  ), [runRequest]);

  return { ask, compare, studyKit, loading, error, text, sources };
}
