import { useCallback, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Icon from '../Icon.jsx';
import { navItems } from '../../data/navItems.js';
import { useAuth } from '../../context/AuthContext.jsx';
import MobileMenu from './MobileMenu.jsx';
import useOutsideClick from '../../hooks/useOutsideClick.js';

const icons = {
  home: 'faHouseChimney',
  explore: 'faCompass',
  compare: 'faCodeCompare',
  study: 'faBookOpen',
  community: 'faUserGroup',
  updates: 'faBell',
};

function NavigationLink({ id, label, onClick }) {
  const to = id === 'home' ? '/' : `/${id}`;
  return (
    <NavLink
      to={to}
      end={id === 'home'}
      onClick={onClick}
      className={({ isActive }) => `nav-link px-3 py-5 text-sm transition-colors hover:text-content-title ${isActive ? 'active text-brand-500' : 'text-content-body'}`}
    >
      <Icon name={icons[id]} className="mr-1.5 text-xs" />{label}
    </NavLink>
  );
}

export default function Header({ onCounselor, onWalkthrough, onLogout: onLogoutProp }) {
  const { user, openAuthModal, logout } = useAuth();
  // This state controls the mobile navigation menu visibility.
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);
  // This handler closes the menu when a pointer lands outside the header.
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const onLogout = onLogoutProp || logout;
  useOutsideClick(headerRef, closeMenu, menuOpen);

  return (
    <header ref={headerRef} className="sticky top-0 z-40 border-b border-surface-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center space-x-3">
          <span className="gradient-brand flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm shadow-indigo-200"><Icon name="faSeedling" /></span>
          <span><span className="font-display text-xl font-bold tracking-tight text-content-title">skill<span className="text-brand-500">2</span>career</span><span className="ml-1.5 hidden rounded-full border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-600 sm:inline-block">Student Platform</span></span>
        </Link>
        <nav className="hidden items-center space-x-1 lg:flex">
          {navItems.map((item) => <NavigationLink key={item.id} {...item} />)}
          <button type="button" onClick={onCounselor} className="my-auto flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-2 text-xs font-bold text-white shadow-sm transition-all hover:scale-105"><Icon name="faWandMagicSparkles" />AI Counselor</button>
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onWalkthrough} className="hidden items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-100 sm:flex"><Icon name="faCompass" className="text-brand-500" />Walkthrough</button>
          {user ? <div className="flex items-center gap-2">
            <Link to="/profile" className="flex items-center gap-2 rounded-xl border border-transparent p-1.5 hover:border-surface-border hover:bg-surface-hover">
              <span className="gradient-brand flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white">{user.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</span>
              <span className="hidden text-left lg:block"><span className="block text-xs font-semibold leading-tight text-content-title">{user.name}</span><span className="block text-[11px] leading-none text-content-muted">{user.stream}</span></span>
            </Link>
            <button type="button" onClick={onLogout} aria-label="Log out" className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"><Icon name="faArrowRightFromBracket" /></button>
          </div> : <div className="hidden items-center gap-2 sm:flex">
            <button type="button" onClick={() => openAuthModal('login')} className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-brand-600">Sign In</button>
            <button type="button" onClick={() => openAuthModal('register')} className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800">Register Free</button>
          </div>}
          <button type="button" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)} className="rounded-lg p-2 text-content-title hover:bg-slate-100 lg:hidden"><span className="text-lg">☰</span></button>
        </div>
      </div>
      <MobileMenu isOpen={menuOpen} onClose={closeMenu} onCounselor={onCounselor} user={user} onLogout={onLogout} onAuth={openAuthModal} outsideRef={headerRef} />
    </header>
  );
}
