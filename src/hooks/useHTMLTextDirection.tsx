import { useEffect, useRef, useCallback } from 'react';
import { VOICE_PLAYER_ROOT_ID } from '../utils/consts';
import { HTMLTextDirection } from '../types';

const useHTMLTextDirection = (direction: HTMLTextDirection) => {
  useEffect(() => {
    /**
     * It sets the 'dir' attribute of the closest parent <div> element of the element with VOICE_PLAYER_ROOT_ID cause:
     * - An empty <div> element is created in the VoiceMessageProvider, which is the highest-level <div> element within the SendbirdProvider.
     * - It tries to find the nearest parent <div> element within the SendbirdProvider and sets 'dir' attribute,
     * ensuring that the directionality is applied correctly.
     * */
    const targetElement = document.getElementById(VOICE_PLAYER_ROOT_ID);
    targetElement.parentElement.dir = direction;
  }, [direction]);
};

export default useHTMLTextDirection;

export const useMessageLayoutDirection = (
  direction: HTMLTextDirection,
  forceLeftToRightMessageLayout: boolean,
  loading: boolean,
  containerSelector: string = '.sendbird-conversation', // find message container element by default
) => {
  const observerRef = useRef<MutationObserver | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  const updateMessageDirection = useCallback((element: HTMLElement) => {
    element.dir = forceLeftToRightMessageLayout ? 'ltr' : direction;
  }, [direction, forceLeftToRightMessageLayout]);

  const updateAllMessageElements = useCallback(() => {
    if (containerRef.current) {
      const messageListElements = containerRef.current.getElementsByClassName('sendbird-conversation__messages');
      Array.from(messageListElements).forEach(updateMessageDirection);
    }
  }, [updateMessageDirection]);

  useEffect(() => {
    const container = document.querySelector(containerSelector);
    if (!container) {
      return;
    }
    containerRef.current = container as HTMLElement;
    // initial update
    updateAllMessageElements();

    const observer = new MutationObserver((mutations) => {
      let needsUpdate = false;

      mutations.forEach((mutation) => {
        // detect class attribute change
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          needsUpdate = true;
          return;
        }

        // detect DOM tree including childList change
        if (mutation.type === 'childList' && (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
          needsUpdate = true;

        }
      });

      // update message elements if needed
      if (needsUpdate) {
        updateAllMessageElements();
      }
    });

    observer.observe(containerRef.current, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class'],
    });

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [containerSelector, updateAllMessageElements]);

  useEffect(() => {
    if (!loading) {
      // use requestAnimationFrame to ensure that the update is applied after the DOM is updated
      requestAnimationFrame(() => {
        updateAllMessageElements();
      });
    }
  }, [loading, updateAllMessageElements]);
};
