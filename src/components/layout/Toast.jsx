import Icon from '../Icon.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export default function Toast() {
  const { toast } = useToast();
  if (!toast?.message) return null;
  const icon = toast.type === 'error' ? 'faXmark' : 'faCheck';
  const iconColor = toast.type === 'error' ? 'text-rose-400' : 'text-emerald-400';
  return <div role="status" aria-live="polite" className="fixed bottom-5 left-5 z-50 max-w-sm animate-fadeIn rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white shadow-xl"><Icon name={icon} className={`mr-3 ${iconColor}`} />{toast.message}</div>;
}
