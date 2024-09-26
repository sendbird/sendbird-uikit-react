import { RefCallback, useRef } from 'react';
import { useIsElementInViewport } from './useIsElementInViewport';

export const useLazyImageLoader = (): [RefCallback<HTMLDivElement>, boolean] => {
  const isLoaded = useRef(false);
  const [ref, isVisible] = useIsElementInViewport();

  if (isVisible) isLoaded.current = true;
  return [ref, isLoaded.current];
};
