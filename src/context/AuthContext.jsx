import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCurrentUser, loginAccount, loginDemoAccount, registerAccount, updateAccount } from '../services/authService.js';
import { TOKEN_KEY } from '../services/api.js';

const AuthContext = createContext(null);
const USER_CACHE_KEY = 'skill2career.user';
const subtitles = {
  register: 'Register to learn, download kits & connect with peers',
  login: 'Sign in to access your saved notes and mentors',
  edit: 'Update your student profile details',
};

function validateCredentials(details) {
  const email = details.email?.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Please enter a valid email address.');
  }
  if (typeof details.password !== 'string' || details.password.length < 6) {
    throw new Error('Password must be at least 6 characters.');
  }
}

// Read the last server-confirmed profile while its saved token is being checked.
function readCachedUser() {
  try {
    const cached = window.localStorage.getItem(USER_CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch {
    window.localStorage.removeItem(USER_CACHE_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  // These states share the authenticated student and bearer token across the app.
  const [user, setUser] = useState(() => (
    window.localStorage.getItem(TOKEN_KEY) ? readCachedUser() : null
  ));
  const [token, setToken] = useState(() => window.localStorage.getItem(TOKEN_KEY));
  const [authLoading, setAuthLoading] = useState(Boolean(window.localStorage.getItem(TOKEN_KEY)));
  const [authModal, setAuthModal] = useState({ open: false, mode: 'register', subtitle: subtitles.register });
  // This ref holds a protected action until the guest completes authentication.
  const pendingAction = useRef(null);

  // This effect validates the saved token and refreshes the profile from the backend.
  useEffect(() => {
    if (!token) {
      window.localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      setAuthLoading(false);
      return undefined;
    }
    let active = true;
    setAuthLoading(true);
    fetchCurrentUser()
      .then((profile) => { if (active) setUser(profile); })
      .catch(() => {
        if (!active) return;
        if (window.localStorage.getItem(TOKEN_KEY) !== token) return;
      })
      .finally(() => { if (active) setAuthLoading(false); });
    return () => { active = false; };
  }, [token]);

  // This effect resumes a gated action once the authenticated profile is ready.
  useEffect(() => {
    if (user) window.localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
    else window.localStorage.removeItem(USER_CACHE_KEY);
    if (user && pendingAction.current) {
      const action = pendingAction.current;
      pendingAction.current = null;
      action();
    }
  }, [user]);

  // This listener expires the session when any protected API request receives 401.
  useEffect(() => {
    const handleUnauthorized = () => {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(USER_CACHE_KEY);
      pendingAction.current = null;
      setToken(null);
      setUser(null);
      setAuthLoading(false);
      setAuthModal((current) => ({ ...current, open: false }));
      navigate('/');
    };
    window.addEventListener('skill2career:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('skill2career:unauthorized', handleUnauthorized);
  }, [navigate]);

  // This handler opens the requested auth tab with a contextual subtitle.
  const openAuthModal = useCallback((mode = 'register', subtitle = subtitles[mode]) => {
    const resolvedMode = ['login', 'edit'].includes(mode) ? mode : 'register';
    setAuthModal({ open: true, mode: resolvedMode, subtitle: subtitle || subtitles[resolvedMode] });
  }, []);

  // This handler closes the authentication dialog.
  const closeAuthModal = useCallback(() => {
    setAuthModal((current) => ({ ...current, open: false }));
  }, []);

  // This handler stores a newly registered student and closes the auth dialog.
  const register = useCallback(async (details) => {
    const name = details.name?.trim();
    if (!name) throw new Error('Please enter your full name to register.');
    validateCredentials(details);
    const session = await registerAccount({ ...details, name, email: details.email.trim() });
    window.localStorage.setItem(TOKEN_KEY, session.token);
    setToken(session.token);
    setUser(session.user);
    setAuthLoading(false);
    closeAuthModal();
  }, [closeAuthModal]);

  // This handler signs a student in from the provided account details.
  const login = useCallback(async (details) => {
    validateCredentials(details);
    const session = await loginAccount({ email: details.email.trim(), password: details.password });
    window.localStorage.setItem(TOKEN_KEY, session.token);
    setToken(session.token);
    setUser(session.user);
    setAuthLoading(false);
    closeAuthModal();
  }, [closeAuthModal]);

  // This handler creates one of the original sample student sessions.
  const demoLogin = useCallback(async (name) => {
    const profile = name.startsWith('Aanya') ? 'aanya' : 'aarav';
    const session = await loginDemoAccount(profile);
    window.localStorage.setItem(TOKEN_KEY, session.token);
    setToken(session.token);
    setUser(session.user);
    setAuthLoading(false);
    closeAuthModal();
  }, [closeAuthModal]);

  // This handler updates the current student's details without ending their session.
  const updateUser = useCallback(async (details) => {
    const name = details.name?.trim();
    if (!name) throw new Error('Please enter your full name.');
    if (!token) throw new Error('Sign in again before updating your profile.');
    const updatedUser = await updateAccount({ name, stream: details.stream || user?.stream });
    setUser(updatedUser);
    closeAuthModal();
  }, [closeAuthModal, token, user?.stream]);

  // This handler clears the saved session and returns the student to Home.
  const logout = useCallback(() => {
    pendingAction.current = null;
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_CACHE_KEY);
    setToken(null);
    setUser(null);
    setAuthLoading(false);
    closeAuthModal();
    navigate('/');
  }, [closeAuthModal, navigate]);

  const value = { user, token, authLoading, pendingAction, authModal, openAuthModal, closeAuthModal, register, login, demoLogin, updateUser, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// This hook exposes authentication state and actions to React components.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider.');
  return context;
}

export default AuthContext;
