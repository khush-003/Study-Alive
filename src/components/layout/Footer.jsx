import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Footer() {
  const { user, openAuthModal, logout } = useAuth();
  return (
    <footer className="mt-10 border-t border-surface-border bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-content-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <span>© 2026 skill2career · Explore · Learn · Connect · Grow</span>
        <div className="flex gap-4">
          <Link to="/explore" className="hover:text-brand-600">Career pathways</Link>
          <Link to="/community" className="hover:text-brand-600">Peer Network</Link>
          <button type="button" onClick={() => user ? logout() : openAuthModal('register')} className="text-brand-600 hover:underline">{user ? 'Log Out' : 'Register Free'}</button>
        </div>
      </div>
    </footer>
  );
}
