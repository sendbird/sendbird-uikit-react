import { useEffect, useState } from 'react';

function useElementObserver(selector: string, className: string): boolean {
  const [isElementMounted, setIsElementMounted] = useState<boolean>(false);

  useEffect(() => {
    const updateElementState = () => {
      const element = document.querySelector(selector);
      if (element && element.classList.contains(className)) {
        setIsElementMounted(true);
      } else {
        setIsElementMounted(false);
      }
    };
    updateElementState();

    const observerCallback: MutationCallback = (mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length || mutation.removedNodes.length) {
          Array.from(mutation.addedNodes).forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE && (node as Element).matches(selector) && (node as Element).classList.contains(className)) {
              setIsElementMounted(true);
            }
          });

          Array.from(mutation.removedNodes).forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE && (node as Element).matches(selector) && (node as Element).classList.contains(className)) {
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
    observer.observe(document.body, observerOptions);

    return () => {
      observer.disconnect();
    };
  }, [selector, className]);

  return isElementMounted;
}

export default useElementObserver;
