import Icon from '../Icon.jsx';
import formatMarkdown from '../../utils/formatMarkdown.js';

/**
 * Props: result (AI response string), onClose (dismiss callback).
 * Usage: <AiResultCard result={result} onClose={closeResult} />
 */
export default function AiResultCard({ result, onClose }) {
  const blocks = formatMarkdown(result);
  const renderTokens = (tokens, prefix) => tokens.map((token, index) => token.bold
    ? <strong key={`${prefix}-${index}`} className="font-bold text-slate-900">{token.text}</strong>
    : <span key={`${prefix}-${index}`}>{token.text}</span>);

  return (
    <section className="relative space-y-3 overflow-hidden rounded-3xl border border-indigo-200 bg-white p-6 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-100 text-sm text-indigo-600"><Icon name="faBrain" /></span>
          <div><h2 className="text-sm font-bold text-slate-900">Gemini Career Decision Advisor</h2><p className="text-[11px] text-slate-500">Personalized evaluation of trade-offs and future outlook</p></div>
        </div>
        <button type="button" onClick={onClose} aria-label="Close AI result" className="text-slate-400 hover:text-slate-600"><Icon name="faXmark" /></button>
      </div>
      <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs leading-relaxed text-slate-700 sm:text-sm">
        {blocks.map((block, index) => block.type === 'list'
          ? <ul key={`list-${index}`} className="list-inside list-disc space-y-1">
            {block.items.map((tokens, itemIndex) => <li key={`item-${itemIndex}`}>{renderTokens(tokens, `list-${index}-${itemIndex}`)}</li>)}
          </ul>
          : <p key={`paragraph-${index}`}>{block.lines.map((tokens, lineIndex) => (
            <span key={`line-${index}-${lineIndex}`}>{lineIndex > 0 && <br />}{renderTokens(tokens, `paragraph-${index}-${lineIndex}`)}</span>
          ))}</p>)}
      </div>
    </section>
  );
}
