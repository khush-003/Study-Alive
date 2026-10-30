import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Icon from './Icon.jsx';
import { navItems } from '../data/navItems.js';

const navIcons = {
  home: 'faHouseChimney',
  explore: 'faCompass',
  compare: 'faCodeCompare',
  study: 'faBookOpen',
  community: 'faUserGroup',
  updates: 'faBell',
};

function NavigationLink({ to, children, onClick }) {
  return <NavLink to={to} end={to === '/'} onClick={onClick} className={({ isActive }) => `nav-link px-3 py-5 text-sm transition-colors hover:text-content-title ${isActive ? 'active text-brand-500' : 'text-content-body'}`}>{children}</NavLink>;
}

export function Header({ user, onAuth, onLogout, onCounselor, onWalkthrough }) {
  // This state controls whether the mobile navigation menu is displayed.
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  // This handler closes the mobile navigation after selecting a route.
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-surface-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button type="button" className="flex items-center space-x-3 text-left" onClick={() => navigate('/')}>
          <span className="gradient-brand flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm shadow-indigo-200"><Icon name="faSeedling" /></span>
          <span><span className="font-display text-xl font-bold tracking-tight text-content-title">skill<span className="text-brand-500">2</span>career</span><span className="ml-1.5 hidden rounded-full border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-600 sm:inline-block">Student Platform</span></span>
        </button>
        <nav className="hidden items-center space-x-1 lg:flex">
          {navItems.map(({ id, label }) => <NavigationLink key={id} to={id === 'home' ? '/' : `/${id}`}><Icon name={navIcons[id]} className="mr-1.5 text-xs" />{label}</NavigationLink>)}
          <button type="button" onClick={onCounselor} className="my-auto flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-2 text-xs font-bold text-white shadow-sm transition-all hover:scale-105"><Icon name="faWandMagicSparkles" />AI Counselor</button>
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onWalkthrough} className="hidden items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-100 sm:flex"><Icon name="faCompass" className="text-brand-500" />Walkthrough</button>
          {user ? <div className="flex items-center gap-2"><Link to="/profile" className="flex items-center gap-2 rounded-xl border border-transparent p-1.5 hover:border-surface-border hover:bg-surface-hover"><span className="gradient-brand flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white">{user.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</span><span className="hidden text-left lg:block"><span className="block text-xs font-semibold leading-tight text-content-title">{user.name}</span><span className="block text-[11px] leading-none text-content-muted">{user.stream}</span></span></Link><button type="button" onClick={onLogout} className="text-xs font-semibold text-rose-600">Log out</button></div> : <div className="hidden items-center gap-2 sm:flex"><button type="button" onClick={() => onAuth('login')} className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-brand-600">Sign In</button><button type="button" onClick={() => onAuth('register')} className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800">Register Free</button></div>}
          <button type="button" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)} className="rounded-lg p-2 text-content-title hover:bg-slate-100 lg:hidden"><span className="text-lg">☰</span></button>
        </div>
      </div>
      {menuOpen && <nav className="space-y-1 border-t border-surface-border bg-white p-3 lg:hidden">{navItems.map(({ id, label }) => <NavigationLink key={id} to={id === 'home' ? '/' : `/${id}`} onClick={closeMenu}><Icon name={navIcons[id]} className="mr-2 w-5 text-brand-500" />{label}</NavigationLink>)}<button type="button" onClick={() => { closeMenu(); onCounselor(); }} className="w-full rounded-lg bg-indigo-50 px-3 py-2.5 text-left text-sm font-semibold text-indigo-700"><Icon name="faWandMagicSparkles" className="mr-2" />AI Counselor</button>{user ? <button type="button" onClick={() => { closeMenu(); onLogout(); }} className="px-3 py-2 text-sm text-rose-600">Log out</button> : <button type="button" onClick={() => { closeMenu(); onAuth('register'); }} className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white">Register to Learn & Connect</button>}</nav>}
    </header>
  );
}

export function Footer({ user, onAuth }) {
  return <footer className="mt-10 border-t border-surface-border bg-white"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-content-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"><span>© 2026 skill2career · Explore · Learn · Connect · Grow</span><div className="flex gap-4"><Link to="/explore" className="hover:text-brand-600">Career pathways</Link><Link to="/community" className="hover:text-brand-600">Peer Network</Link><button type="button" onClick={() => user ? onAuth('logout') : onAuth('register')} className="text-brand-600 hover:underline">{user ? 'Log Out' : 'Register Free'}</button></div></div></footer>;
}
