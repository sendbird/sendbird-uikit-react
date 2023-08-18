import { useCallback, useEffect } from "react";
import { FileViewerComponentProps, ViewerTypes } from "../types";

export function useKeyPress({
  props,
  ref,
}: {
  props: FileViewerComponentProps,
  ref: React.RefObject<HTMLDivElement>;
}): void {
  if (props.viewerType === ViewerTypes.MULTI) {
    const { onClose, onClickLeft, onClickRight } = props;
    const target = ref.current;
    // if this doesnt work, try return onKeyDown and spread it on the div
    const onKeyDown = useCallback((event) => {
      // maybe use a ts-matching library
      switch (event.key) {
        case 'Escape':
          onClose(event);
          break;
        case 'ArrowLeft':
          onClickLeft();
          break;
        case 'ArrowRight':
          onClickRight();
          break;
        default:
          break;
      }
      event.preventDefault();
    }, [onClose, onClickLeft, onClickRight]);

    useEffect(() => {
      target?.addEventListener('keydown', onKeyDown);
      return () => {
        target?.removeEventListener('keydown', onKeyDown);
      };
    }, [target, onKeyDown]);
  }

}
