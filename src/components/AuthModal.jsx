import { useEffect, useState } from 'react';
import { streams } from '../data/streams.js';
import { useAuth } from '../context/AuthContext.jsx';
import CommonModal from './common/Modal.jsx';
import Icon from './Icon.jsx';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthModal({ open, mode, subtitle, onClose, onModeChange, onSuccess }) {
  const { user, register, login, demoLogin, updateUser } = useAuth();
  // These states hold all controlled auth fields and inline validation feedback.
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [stream, setStream] = useState(streams[0]);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // This effect resets form data on close and pre-fills profile edit mode.
  useEffect(() => {
    if (!open) {
      setName('');
      setEmail('');
      setPassword('');
      setStream(streams[0]);
      setErrors({});
      setFormError('');
      setIsSubmitting(false);
      return;
    }
    setName(mode === 'edit' ? user?.name || '' : '');
    setEmail(mode === 'edit' ? user?.email || '' : '');
    setPassword('');
    setStream(user?.stream || streams[0]);
    setErrors({});
    setFormError('');
    setIsSubmitting(false);
  }, [open, mode, user]);

  // This handler validates fields and invokes the matching AuthContext action.
  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (mode !== 'login' && !name.trim()) nextErrors.name = 'Enter your full name.';
    if (!email.trim()) nextErrors.email = 'Enter your email address.';
    else if (!emailPattern.test(email.trim())) nextErrors.email = 'Enter a valid email address.';
    if (mode !== 'edit' && password.length < 6) nextErrors.password = 'Password must be at least 6 characters.';
    setErrors(nextErrors);
    setFormError('');
    if (Object.keys(nextErrors).length) return;

    setIsSubmitting(true);
    try {
      const details = { name: name.trim(), email: email.trim(), password, stream };
      if (mode === 'edit') await updateUser(details);
      else if (mode === 'login') await login(details);
      else await register(details);
      onSuccess?.();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to save these details.');
    } finally {
      setIsSubmitting(false);
    }
  };
  // This handler starts one of the sample sessions without entering credentials.
  const signInDemo = async (demoName) => {
    setFormError('');
    setIsSubmitting(true);
    try {
      await demoLogin(demoName);
      onSuccess?.();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to sign in to the demo account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CommonModal isOpen={open} onClose={onClose} ariaLabel={mode === 'edit' ? 'Update your profile' : 'Account access'}>
      <div className="space-y-1.5 text-center">
        <div className="gradient-brand mx-auto flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-md shadow-indigo-200"><Icon name="faSeedling" className="text-xl" /></div>
        <h2 className="font-display text-xl font-extrabold text-content-title">{mode === 'edit' ? 'Update your profile' : <>Welcome to skill<span className="text-brand-500">2</span>career</>}</h2>
        <p className="text-xs text-content-muted">{subtitle}</p>
      </div>
      {mode !== 'edit' && (
        <div className="flex rounded-xl bg-slate-100 p-1">
          <button type="button" onClick={() => onModeChange('register')} aria-pressed={mode === 'register'} className={`w-1/2 rounded-lg py-2 text-xs ${mode === 'register' ? 'bg-white font-bold text-content-title shadow-sm' : 'font-medium text-content-muted'}`}>Register</button>
          <button type="button" onClick={() => onModeChange('login')} aria-pressed={mode === 'login'} className={`w-1/2 rounded-lg py-2 text-xs ${mode === 'login' ? 'bg-white font-bold text-content-title shadow-sm' : 'font-medium text-content-muted'}`}>Sign In</button>
        </div>
      )}
      <form onSubmit={submit} noValidate className="space-y-3.5 text-xs">
        {mode !== 'login' && (
          <label htmlFor="auth-name" className="block font-semibold text-slate-700">Your Full Name
            <input id="auth-name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" className="mt-1 w-full rounded-xl border border-surface-border bg-slate-50 px-3 py-2.5 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
            {errors.name && <span role="alert" className="mt-1 block text-rose-600">{errors.name}</span>}
          </label>
        )}
        <label htmlFor="auth-email" className="block font-semibold text-slate-700">Email Address
          <input id="auth-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} readOnly={mode === 'edit'} autoComplete="email" className="mt-1 w-full rounded-xl border border-surface-border bg-slate-50 px-3 py-2.5 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 read-only:cursor-not-allowed read-only:opacity-70" />
          {errors.email && <span role="alert" className="mt-1 block text-rose-600">{errors.email}</span>}
        </label>
        {mode !== 'edit' && (
          <label htmlFor="auth-password" className="block font-semibold text-slate-700">Password
            <input id="auth-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} className="mt-1 w-full rounded-xl border border-surface-border bg-slate-50 px-3 py-2.5 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
            {errors.password && <span role="alert" className="mt-1 block text-rose-600">{errors.password}</span>}
          </label>
        )}
        {mode !== 'login' && (
          <label htmlFor="auth-stream" className="block font-semibold text-slate-700">Class &amp; Stream
            <select id="auth-stream" value={stream} onChange={(event) => setStream(event.target.value)} className="mt-1 w-full rounded-xl border border-surface-border bg-slate-50 p-2.5 focus:border-brand-500 focus:bg-white focus:outline-none">
              {streams.map((item) => <option key={item}>{item}</option>)}
              {user?.stream && !streams.includes(user.stream) && <option>{user.stream}</option>}
            </select>
          </label>
        )}
        {formError && <p role="alert" className="rounded-lg bg-rose-50 p-2 text-rose-700">{formError}</p>}
        <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-semibold text-white shadow-md transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-60">
          {isSubmitting ? 'Please wait…' : mode === 'register' ? 'Complete Free Registration' : mode === 'edit' ? 'Save Profile Details' : 'Sign In to skill2career'}<Icon name="faArrowRight" />
        </button>
      </form>
      {mode !== 'edit' && (
        <div className="space-y-2 border-t border-slate-100 pt-2">
          <p className="text-center text-[11px] font-medium text-slate-400">Or test instantly with 1-click:</p>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" disabled={isSubmitting} onClick={() => signInDemo('Aanya Sharma')} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60">Aanya (Science)</button>
            <button type="button" disabled={isSubmitting} onClick={() => signInDemo('Aarav Mehta')} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60">Aarav (Tech/CS)</button>
          </div>
        </div>
      )}
    </CommonModal>
  );
}
