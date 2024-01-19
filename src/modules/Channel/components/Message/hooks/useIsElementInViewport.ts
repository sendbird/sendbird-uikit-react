import React, { useLayoutEffect, useState } from 'react';

export const useIsElementInViewport = (elementRef: React.MutableRefObject<any>) => {
  const [isVisible, setIsVisible] = useState(false);

  useLayoutEffect(() => {
    const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry) setIsVisible(entry.isIntersecting);
    });

    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [elementRef.current]);

  return isVisible;
};
