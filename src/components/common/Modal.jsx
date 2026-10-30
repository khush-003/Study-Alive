import { useRef } from 'react';
import Icon from '../Icon.jsx';
import useDialogFocus from '../../hooks/useDialogFocus.js';

/**
 * Props: isOpen (boolean), onClose (function), title (string), children (ReactNode),
 * maxWidth (Tailwind max-width class).
 * Usage: <Modal isOpen={open} onClose={onClose} title="Details"><p>Content</p></Modal>
 */
export default function Modal({ isOpen, onClose, title, ariaLabel, children, maxWidth = 'max-w-md' }) {
  const dialogRef = useRef(null);
  useDialogFocus(dialogRef, isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className={`relative w-full ${maxWidth} animate-fadeIn space-y-5 rounded-3xl border border-surface-border bg-white p-6 shadow-2xl sm:p-8`}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel || title || 'Dialog'}
        tabIndex={-1}
        ref={dialogRef}
      >
        <button type="button" onClick={onClose} aria-label="Close dialog" className="absolute right-5 top-5 text-slate-400 hover:text-slate-600"><Icon name="faXmark" /></button>
        {title && <h2 className="pr-8 font-display text-xl font-extrabold text-content-title">{title}</h2>}
        {children}
      </section>
    </div>
  );
}
