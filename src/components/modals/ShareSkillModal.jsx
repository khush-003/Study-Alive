import { useEffect, useState } from 'react';
import Modal from '../common/Modal.jsx';

export default function ShareSkillModal({ open, onClose, onToast, onSubmit }) {
  // These states hold the two skills entered for the exchange post.
  const [teach, setTeach] = useState('');
  const [learn, setLearn] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  // This effect clears entered skills and validation feedback when the modal closes.
  useEffect(() => {
    if (open) return;
    setTeach('');
    setLearn('');
    setErrors({});
  }, [open]);
  // This handler validates and publishes the student's skill exchange.
  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!teach.trim()) nextErrors.teach = 'Enter a skill you can teach.';
    if (!learn.trim()) nextErrors.learn = 'Enter a skill you want to learn.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSubmitting(true);
    try {
      await onSubmit({ teaches: teach.trim(), wantsToLearn: learn.trim() });
      onClose();
      onToast(`Skill offer published! You offer [${teach}] and wish to learn [${learn}].`);
    } catch (requestError) {
      onToast(requestError.response?.data?.message || requestError.message || 'Could not publish the skill offer.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Share a Skill">
      <form onSubmit={submit} className="space-y-3">
        <label htmlFor="skill-teach" className="block text-xs font-semibold">I can teach
          <input id="skill-teach" value={teach} onChange={(event) => setTeach(event.target.value)} className="mt-1 w-full rounded-xl border border-surface-border px-3 py-2.5 text-sm" />
          {errors.teach && <span role="alert" className="mt-1 block text-rose-600">{errors.teach}</span>}
        </label>
        <label htmlFor="skill-learn" className="block text-xs font-semibold">I want to learn
          <input id="skill-learn" value={learn} onChange={(event) => setLearn(event.target.value)} className="mt-1 w-full rounded-xl border border-surface-border px-3 py-2.5 text-sm" />
          {errors.learn && <span role="alert" className="mt-1 block text-rose-600">{errors.learn}</span>}
        </label>
        <button type="submit" disabled={submitting} className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white disabled:opacity-60">{submitting ? 'Publishing…' : 'Publish Skill Offer'}</button>
      </form>
    </Modal>
  );
}
