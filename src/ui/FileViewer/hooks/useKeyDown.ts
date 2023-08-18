import { useCallback, useLayoutEffect } from 'react';
import { noop } from '../../../utils/utils';
import { FileViewerComponentProps, ViewerTypes } from '../types';

export function useKeyDown({ props, ref }: {
  props: FileViewerComponentProps,
  ref: React.RefObject<HTMLDivElement>;
}): {
  onKeyDown: React.KeyboardEventHandler<HTMLDivElement>;
} {
  const { onClose } = props;
  let onClickLeft = noop;
  let onClickRight = noop;
  if (props.viewerType === ViewerTypes.MULTI) {
    onClickLeft = props.onClickLeft;
    onClickRight = props.onClickRight;
  }

  useLayoutEffect(() => {
    ref.current?.focus();
  }, [ref.current]);

  // this usecallback is not super necessary
  // discuss with others and remove it if it's not needed
  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = useCallback((event) => {
    switch (event.key) {
      case 'Escape':
        // @ts-ignore
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
    event.stopPropagation();
  }, [onClose, onClickLeft, onClickRight]);

  return {
    onKeyDown,
  };
}
