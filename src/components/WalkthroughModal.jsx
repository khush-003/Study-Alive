import { useEffect, useState } from 'react';
import Icon from './Icon.jsx';
import Modal from './common/Modal.jsx';

export default function WalkthroughModal({ open, onClose }) {
  // This state chooses which walkthrough slide the student is viewing.
  const [step, setStep] = useState(1);
  // This effect starts the tour at step one whenever it opens or closes.
  useEffect(() => { setStep(1); }, [open]);
  // This handler advances between the two short product tour slides.
  const advance = () => setStep(2);
  return (
    <Modal isOpen={open} onClose={onClose} ariaLabel="Skill2career walkthrough">
      <div className="flex justify-between text-xs text-slate-400"><span className="font-bold uppercase tracking-wider text-brand-600">Step {step} of 2</span><button type="button" onClick={onClose} aria-label="Close walkthrough"><Icon name="faXmark" /></button></div>
      <div className="gradient-brand mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg shadow-indigo-300"><Icon name="faSeedling" className="text-3xl" /></div>
      {step === 1 ? <div className="space-y-2 text-center"><h2 className="font-display text-2xl font-extrabold text-content-title">skill<span className="text-brand-500">2</span>career</h2><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Explore · Learn · Connect · Grow</p><p className="pt-2 text-sm text-slate-700">Your skills today, a brighter tomorrow.</p></div> : <div className="space-y-2 text-center"><h2 className="font-display text-xl font-extrabold text-content-title">Find Your Right Career Path</h2><p className="text-sm text-content-muted">Explore careers, learn with study materials, and connect with your student community.</p></div>}
      <button type="button" onClick={step === 1 ? advance : onClose} className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800">{step === 1 ? 'Next: Find Your Path' : 'Start Exploring'}<Icon name="faArrowRight" className="ml-2" /></button>
    </Modal>
  );
}
