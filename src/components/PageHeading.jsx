import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';

export default function PageHeading({ title, description, back = true, action }) {
  return (
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
      <div>
        {back && <Link to="/" className="mb-1 inline-flex items-center text-xs text-slate-500 hover:text-brand-600"><Icon name="faChevronRight" className="mr-1 rotate-180" />Back</Link>}
        <h1 className="font-display text-2xl font-extrabold text-content-title">{title}</h1>
        <p className="text-xs text-content-muted">{description}</p>
      </div>
      {action}
    </div>
  );
}
