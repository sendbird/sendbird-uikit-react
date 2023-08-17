import { useCallback, useEffect } from "react";

export function useKeyPress({
  onClose,
  incrementIdx,
  decrementIdx,
  ref,
}: {
  onClose: (e: globalThis.MouseEvent) => void;
  incrementIdx: () => void;
  decrementIdx: () => void;
  ref: React.RefObject<HTMLDivElement>;
}) {
  const target = ref.current;
  // if this doesnt work, try return onKeyDown and spread it on the div
  const onKeyDown = useCallback((event) => {
    // maybe use a ts-matching library
    switch (event.key) {
      case 'Escape':
        onClose(event);
        break;
      case 'ArrowLeft':
        decrementIdx();
        break;
      case 'ArrowRight':
        incrementIdx();
        break;
      // also -> close on esc click
      default:
        break;
    }
    event.preventDefault();
  }, [onClose, incrementIdx, decrementIdx]);
  useEffect(() => {
    target?.addEventListener('keydown', onKeyDown);
    return () => {
      target?.removeEventListener('keydown', onKeyDown);
    };
  }, [target]);

}
