import React, { useEffect, useState } from 'react';

export const useIsElementInViewport = (elementRef: React.MutableRefObject<any>) => {
  const [isVisible, setIsVisible] = useState(false);

  const callback = (entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    setIsVisible(entry.isIntersecting);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(callback);
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    return () => observer.disconnect();
  }, [elementRef]);

  return { isVisible };
};
