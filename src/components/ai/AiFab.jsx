import { FaWandMagicSparkles } from 'react-icons/fa6';
import useAuthGate from '../../hooks/useAuthGate.js';
import useUi from '../../hooks/useUi.js';

export default function AiFab({ label = 'Open AI Counselor' }) {
  const gate = useAuthGate();
  const { openModal } = useUi();
  // This handler opens the counselor only after the student passes the auth gate.
  const openCounselor = () => gate(() => openModal('counselor'), 'Register to get unlimited AI career advice!');
  return <button type="button" onClick={openCounselor} aria-label={label} className="fixed bottom-5 right-5 z-30 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transition hover:scale-105"><FaWandMagicSparkles /></button>;
}
