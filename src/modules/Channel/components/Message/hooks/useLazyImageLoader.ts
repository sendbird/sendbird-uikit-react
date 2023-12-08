import React, { useEffect, useState } from 'react';
import { useIsElementInViewport } from './useIsElementInViewport';

export const useLazyImageLoader = (elementRef: React.MutableRefObject<any>) => {
  const { isVisible } = useIsElementInViewport(elementRef);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isLoaded || !isVisible) {
      return;
    }
    setIsLoaded(true);
  }, [isVisible]);

  return { isLoaded };
};
