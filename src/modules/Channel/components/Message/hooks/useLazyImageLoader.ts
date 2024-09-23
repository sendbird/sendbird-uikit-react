import { useRef } from 'react';
import { useIsElementInViewport } from './useIsElementInViewport';

export const useLazyImageLoader = () => {
  const isLoaded = useRef(false);
  const [ref, isVisible] = useIsElementInViewport();

  if (isVisible) isLoaded.current = true;
  return [ref, isLoaded.current];
};
