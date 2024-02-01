import React, { useRef } from 'react';
import { useIsElementInViewport } from './useIsElementInViewport';

export const useLazyImageLoader = (elementRef: React.MutableRefObject<any>) => {
  const isLoaded = useRef(false);
  const isVisible = useIsElementInViewport(elementRef);

  if (isVisible) isLoaded.current = true;
  return isLoaded.current;
};
