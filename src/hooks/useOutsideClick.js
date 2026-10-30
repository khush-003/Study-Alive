import { useEffect } from 'react';

// This hook closes popovers when a pointer action happens outside their ref.
export default function useOutsideClick(ref, onOutsideClick, enabled = true) {
  // This effect owns and cleans up the document listener for the open popover.
  useEffect(() => {
    if (!enabled) return undefined;

    const handlePointerDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) onOutsideClick(event);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [enabled, onOutsideClick, ref]);
}
