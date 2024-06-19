/* global MutationCallback */
/* global MutationObserverInit */
// To prevent Undefined lint errors: https://github.com/standard/standard/issues/1159#issuecomment-403003627

import { useEffect, useState } from 'react';

function useElementObserver(selector: string, targetElement?: HTMLElement | HTMLElement[] | null): boolean {
  const [isElementMounted, setIsElementMounted] = useState<boolean>(false);

  useEffect(() => {
    const targetElements = Array.isArray(targetElement) ? targetElement : [targetElement];

    const updateElementState = () => {
      const elements = targetElements?.map(target => target?.querySelector(selector));
      setIsElementMounted(elements?.some(element => !!element) ?? false);
    };
    updateElementState();

    const observerCallback: MutationCallback = (mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length || mutation.removedNodes.length) {
          Array.from(mutation.addedNodes).forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE && (node as Element).matches(selector)) {
              setIsElementMounted(true);
            }
          });

          Array.from(mutation.removedNodes).forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE && (node as Element).matches(selector)) {
              setIsElementMounted(false);
            }
          });
        }
      });
    };

    const observer = new MutationObserver(observerCallback);
    const observerOptions: MutationObserverInit = {
      childList: true, // Observe addition and removal of child nodes
      subtree: true, // Observe the entire subtree
    };

    targetElements?.forEach(target => {
      if (target) observer.observe(target, observerOptions);
    });

    return () => {
      observer.disconnect();
    };
  }, [selector, targetElement]);

  return isElementMounted;
}

export default useElementObserver;
