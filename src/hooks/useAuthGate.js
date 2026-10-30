import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

// This hook protects actions for guests and retries them after authentication.
// Usage: const gate = useAuthGate(); <button onClick={() => gate(() => download(file), 'Register to download')}>
export default function useAuthGate() {
  const { user, pendingAction, openAuthModal } = useAuth();

  // This handler runs an action now or holds it until the student signs in.
  return useCallback((callback, reason = 'Please register or sign in to continue!') => {
    if (typeof callback !== 'function') throw new TypeError('The auth gate requires an action callback.');
    if (user) {
      callback();
      return true;
    }
    pendingAction.current = callback;
    openAuthModal('register', reason);
    return false;
  }, [openAuthModal, pendingAction, user]);
}
