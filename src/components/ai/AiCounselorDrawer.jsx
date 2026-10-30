import { useEffect, useRef, useState } from 'react';
import Icon from '../Icon.jsx';
import useGemini from '../../hooks/useGemini.js';
import useDialogFocus from '../../hooks/useDialogFocus.js';

const quickPrompts = [
  'Compare B.Tech CS vs BCA + MCA',
  'How do I build a portfolio without work experience?',
  'What are top in-demand tech skills for 2026?',
];

function sourceDetails(source) {
  const urlValue = typeof source === 'string' ? source : source?.url || source?.uri;
  if (typeof urlValue !== 'string') return null;
  try {
    const url = new URL(urlValue);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    return {
      href: url.href,
      label: typeof source === 'object' && source.title ? source.title : url.hostname,
    };
  } catch {
    return null;
  }
}

export default function AiCounselorDrawer({ open, user, onClose }) {
  // These states store chat history and the current message draft.
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const latestMessageRef = useRef(null);
  const dialogRef = useRef(null);
  const { ask, loading } = useGemini();
  useDialogFocus(dialogRef, open, onClose);

  // This effect scrolls the latest message into view after chat updates.
  useEffect(() => {
    latestMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, loading]);

  // This handler adds a question and requests a reply using server-side student context.
  const send = async (event, promptOverride) => {
    event?.preventDefault();
    const prompt = (promptOverride ?? input).trim();
    if (!prompt || loading) return;
    setMessages((current) => [...current, { role: 'user', text: prompt, sources: [] }]);
    setInput('');
    try {
      const response = await ask(prompt);
      setMessages((current) => [...current, { role: 'ai', text: response.text, sources: response.sources.slice(0, 3) }]);
    } catch (error) {
      const message = error.response?.data?.message || (error instanceof Error ? error.message : 'Unable to reach the AI service.');
      setMessages((current) => [...current, { role: 'ai', text: message, sources: [] }]);
    }
  };

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-40 bg-slate-950/30"
      role="presentation"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <aside
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-surface-border bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="AI Career Counselor"
        tabIndex={-1}
        ref={dialogRef}
      >
        <header className="flex items-center justify-between border-b border-surface-border p-4">
          <div>
            <p className="font-display text-sm font-extrabold text-content-title">AI Career Counselor</p>
            <p className="text-[11px] text-content-muted">Personal guidance for your next step</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close counselor" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><Icon name="faXmark" /></button>
        </header>
        <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
          <div className="mr-6 rounded-2xl bg-slate-100 p-3 text-sm text-slate-700">Hi{user?.name ? `, ${user.name}` : ''}! Tell me about your interests or ask me a career question.</div>
          {messages.map((message, index) => (
            <article
              key={`${message.role}-${index}`}
              ref={index === messages.length - 1 ? latestMessageRef : null}
              className={`rounded-2xl p-3 text-sm ${message.role === 'user' ? 'ml-6 whitespace-pre-wrap bg-indigo-600 text-right text-white' : 'mr-6 bg-slate-100 text-slate-700'}`}
            >
              <p className="whitespace-pre-wrap">{message.text}</p>
              {message.role === 'ai' && message.sources?.length > 0 && (
                <ul className="mt-3 space-y-1 border-t border-slate-200 pt-2 text-xs">
                  {message.sources.slice(0, 3).map((source, sourceIndex) => {
                    const details = sourceDetails(source);
                    return details ? (
                      <li key={`${details.href}-${sourceIndex}`}>
                        <a href={details.href} target="_blank" rel="noopener noreferrer" className="break-all text-brand-700 underline hover:text-brand-800">
                          {details.label}
                        </a>
                      </li>
                    ) : null;
                  })}
                </ul>
              )}
            </article>
          ))}
          {loading && (
            <div ref={latestMessageRef} className="mr-6 flex items-center gap-2 rounded-2xl bg-slate-100 p-3 text-sm text-slate-700" role="status">
              <Icon name="faSpinner" className="animate-spin text-brand-600" />
              <span>Thinking…</span>
              <span className="ml-1 inline-flex gap-1" aria-hidden="true"><i className="h-1 w-1 animate-pulse rounded-full bg-slate-500" /><i className="h-1 w-1 animate-pulse rounded-full bg-slate-500 [animation-delay:150ms]" /><i className="h-1 w-1 animate-pulse rounded-full bg-slate-500 [animation-delay:300ms]" /></span>
            </div>
          )}
        </div>
        {messages.length === 0 && (
          <div className="space-y-2 px-4 pb-3">
            {quickPrompts.map((prompt) => (
              <button key={prompt} type="button" disabled={loading} onClick={(event) => send(event, prompt)} className="block w-full rounded-xl border border-surface-border px-3 py-2 text-left text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-50">{prompt}</button>
            ))}
          </div>
        )}
        <form onSubmit={send} className="flex gap-2 border-t border-surface-border p-4">
          <label htmlFor="counselor-message" className="sr-only">Ask a career question</label>
          <input id="counselor-message" value={input} onChange={(event) => setInput(event.target.value)} disabled={loading} placeholder="Ask a career question..." className="min-w-0 flex-1 rounded-xl border border-surface-border px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none disabled:bg-slate-50" />
          <button type="submit" disabled={loading || !input.trim()} aria-label="Send message" className="rounded-xl bg-brand-600 px-4 text-white disabled:cursor-not-allowed disabled:opacity-50"><Icon name="faArrowRight" /></button>
        </form>
      </aside>
    </div>
  );
}
