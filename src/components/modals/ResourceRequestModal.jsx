import { useEffect, useState } from 'react';
import Modal from '../common/Modal.jsx';
import { studyMaterials, studySubjects } from '../../data/studyMaterials.js';
import { getMaterials } from '../../services/studyService.js';
import useRemoteData from '../../hooks/useRemoteData.js';
import { OfflineNotice, RequestError } from '../common/RequestState.jsx';

export default function ResourceRequestModal({ open, onClose, onSubmit, onToast }) {
  // These states hold the requested subject and preferred resource format.
  const [subject, setSubject] = useState('');
  const [format, setFormat] = useState('PDF notes');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const materialsRequest = useRemoteData(getMaterials, studyMaterials);
  const subjects = [...new Set((materialsRequest.data || []).map((material) => material.subject))];
  // This effect clears request details and validation feedback when the modal closes.
  useEffect(() => {
    if (open) return;
    setSubject('');
    setFormat('PDF notes');
    setError('');
  }, [open]);
  // This handler validates the request and passes it to the app-level action.
  const submit = async (event) => {
    event.preventDefault();
    if (!subject) { setError('Choose a subject or course.'); return; }
    setError('');
    setSubmitting(true);
    try {
      await onSubmit({ subject, format });
      onClose();
    } catch (requestError) {
      onToast?.(requestError.response?.data?.message || requestError.message || 'Could not submit the resource request.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Request a Resource">
      <form onSubmit={submit} className="space-y-3">
        {materialsRequest.usingFallback && <OfflineNotice />}
        <RequestError error={materialsRequest.error} onRetry={materialsRequest.reload} />
        <label htmlFor="resource-subject" className="block text-xs font-semibold text-slate-700">Subject or course
          <select id="resource-subject" value={subject} onChange={(event) => setSubject(event.target.value)} className="mt-1 w-full rounded-xl border border-surface-border bg-white px-3 py-2.5 text-sm">
            <option value="">Choose a subject</option>
            {subjects.map((id) => {
              const item = studySubjects.find((subjectOption) => subjectOption.id === id);
              return <option key={id} value={item?.label || id}>{item?.label || id}</option>;
            })}
          </select>
          {error && <span role="alert" className="mt-1 block text-rose-600">{error}</span>}
        </label>
        <label htmlFor="resource-format" className="block text-xs font-semibold text-slate-700">Preferred format
          <select id="resource-format" value={format} onChange={(event) => setFormat(event.target.value)} className="mt-1 w-full rounded-xl border border-surface-border bg-white px-3 py-2.5 text-sm">
            {['PDF notes', 'Video lesson', 'Practice questions', 'Book or syllabus'].map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <button type="submit" disabled={submitting} className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white disabled:opacity-60">{submitting ? 'Submitting…' : 'Submit Request'}</button>
      </form>
    </Modal>
  );
}
