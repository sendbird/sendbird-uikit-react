import React, { useCallback, useEffect, useState } from 'react';

export const useIsElementInViewport = (): [React.RefCallback<HTMLDivElement>, boolean] => {
  const [isVisible, setIsVisible] = useState(false);
  const [element, setElement] = useState(null);

  const ref = useCallback((node) => {
    if (node !== null) setElement(node);
  }, []);

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      setIsVisible(entry.isIntersecting);
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [element]);

  return [ref, isVisible];
};
