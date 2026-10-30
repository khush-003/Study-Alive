import { createContext, useCallback, useMemo, useState } from 'react';

export const UiContext = createContext(null);

export function UiProvider({ children }) {
  // This state ensures only one global feature dialog is open at a time.
  const [activeModal, setActiveModal] = useState(null);
  // These handlers open a named dialog or close the currently active one.
  const openModal = useCallback((modal) => setActiveModal(modal), []);
  const closeModal = useCallback(() => setActiveModal(null), []);
  const isModalOpen = useCallback((modal) => activeModal === modal, [activeModal]);
  const value = useMemo(() => ({ activeModal, openModal, closeModal, isModalOpen }), [activeModal, openModal, closeModal, isModalOpen]);

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export default UiContext;
