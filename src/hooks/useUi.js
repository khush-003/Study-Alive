import { useContext } from 'react';
import UiContext from '../context/UiContext.jsx';

export default function useUi() {
  // This hook reads shared interface state from its provider.
  const context = useContext(UiContext);
  if (!context) throw new Error('useUi must be used within a UiContext provider.');
  return context;
}
