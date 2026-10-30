import { useEffect, useRef, useState } from 'react';
import Modal from '../common/Modal.jsx';
import useGemini from '../../hooks/useGemini.js';

const kitTypes = ['summary', 'cheatsheet', 'quiz'];

export default function AiStudyModal({ open, onClose }) {
  // These states hold the requested topic, kit format, result, and input feedback.
  const [kitType, setKitType] = useState('summary');
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState('');
  const [inputError, setInputError] = useState('');
  const [requestError, setRequestError] = useState('');
  const requestId = useRef(0);
  const { studyKit, loading } = useGemini();

  // This effect clears generated content and form state whenever the dialog closes.
  useEffect(() => {
    if (open) return;
    requestId.current += 1;
    setKitType('summary');
    setTopic('');
    setResult('');
    setInputError('');
    setRequestError('');
  }, [open]);
  // This handler validates the topic and generates a kit through the backend AI service.
  const generate = async (event) => {
    event.preventDefault();
    if (!topic.trim()) {
      setInputError('Enter a topic to create a study kit.');
      return;
    }
    setInputError('');
    setRequestError('');
    setResult('');
    const currentRequestId = ++requestId.current;
    try {
      const response = await studyKit(topic.trim(), kitType);
      if (requestId.current === currentRequestId) setResult(response.text);
    } catch (error) {
      if (requestId.current === currentRequestId) {
        setRequestError(error.response?.data?.message || (error instanceof Error ? error.message : 'Unable to generate a study kit right now.'));
      }
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Create an AI Study Kit">
      <form onSubmit={generate} className="space-y-4">
        <div className="grid grid-cols-3 gap-2" role="group" aria-label="Choose a study kit type">
          {kitTypes.map((type) => (
            <button key={type} type="button" aria-pressed={kitType === type} onClick={() => setKitType(type)} className={`rounded-xl border px-2 py-2 text-xs capitalize ${kitType === type ? 'border-brand-500 bg-brand-50 font-semibold text-brand-700' : 'border-surface-border text-slate-600'}`}>
              {type}
            </button>
          ))}
        </div>
        <label htmlFor="ai-study-topic" className="block text-xs font-semibold text-slate-700">Study topic
          <input id="ai-study-topic" value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="e.g. Thermodynamics" className="mt-1 w-full rounded-xl border border-surface-border px-3 py-2.5 text-sm" />
          {inputError && <span role="alert" className="mt-1 block text-rose-600">{inputError}</span>}
        </label>
        <button type="submit" disabled={loading} className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? 'Generating…' : 'Generate Study Kit'}
        </button>
        {(loading || result || requestError) && (
          <section aria-live="polite" aria-busy={loading} className="max-h-72 overflow-y-auto whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            {loading ? 'Generating your study kit…' : result || requestError}
          </section>
        )}
      </form>
    </Modal>
  );
}
