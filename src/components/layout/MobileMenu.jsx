import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../Icon.jsx';
import { navItems } from '../../data/navItems.js';
import useOutsideClick from '../../hooks/useOutsideClick.js';

const icons = {
  home: 'faHouseChimney',
  explore: 'faCompass',
  compare: 'faCodeCompare',
  study: 'faBookOpen',
  community: 'faUserGroup',
  updates: 'faBell',
};

export default function MobileMenu({ isOpen, onClose, onCounselor, user, onLogout, onAuth, outsideRef }) {
  const location = useLocation();
  // This effect dismisses the menu whenever the route changes.
  useEffect(() => { onClose(); }, [location.pathname, onClose]);
  // This hook dismisses the open menu when a pointer lands outside it.
  useOutsideClick(outsideRef, onClose, isOpen);

  if (!isOpen) return null;
  return (
    <nav className="space-y-1 border-t border-surface-border bg-white px-4 pb-4 pt-2 shadow-lg lg:hidden">
      {navItems.map(({ id, label }) => <Link key={id} to={id === 'home' ? '/' : `/${id}`} onClick={onClose} className="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-slate-50"><Icon name={icons[id]} className="mr-2 w-5 text-brand-500" />{label}</Link>)}
      <Link to="/profile" onClick={onClose} className="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-slate-50"><Icon name="faUser" className="mr-2 w-5 text-brand-500" />My Profile</Link>
      <button type="button" onClick={() => { onClose(); onCounselor(); }} className="w-full rounded-lg bg-indigo-50 px-3 py-2.5 text-left text-sm font-semibold text-indigo-700"><Icon name="faWandMagicSparkles" className="mr-2 text-brand-500" />Ask AI Counselor</button>
      {user ? <button type="button" onClick={() => { onClose(); onLogout(); }} className="px-3 py-2.5 text-sm font-medium text-rose-600">Log Out</button> : <div className="flex gap-2 border-t border-slate-100 pt-2"><button type="button" onClick={() => { onClose(); onAuth('login'); }} className="flex-1 rounded-xl border border-surface-border py-2.5 text-xs font-semibold text-slate-700">Sign In</button><button type="button" onClick={() => { onClose(); onAuth('register'); }} className="flex-1 rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white">Register Free</button></div>}
    </nav>
  );
}
