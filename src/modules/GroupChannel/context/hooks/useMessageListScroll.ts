import { useLayoutEffect, useRef, useState } from 'react';
import pubSubFactory from '../../../../lib/pubSub';
import { useOnScrollPositionChangeDetectorWithRef } from '../../../../hooks/useOnScrollReachedEndDetector';

/**
 * You can pass the resolve function to scrollPubSub, if you want to catch when the scroll is finished.
 * */
type PromiseResolver = () => void;
export type ScrollTopics = 'scrollToBottom' | 'scroll';
export type ScrollTopicUnion =
  | {
      topic: 'scrollToBottom';
      payload: {
        animated?: boolean;
        resolve?: PromiseResolver;
      };
    }
  | {
      topic: 'scroll';
      payload: {
        top?: number;
        animated?: boolean;
        lazy?: boolean;
        resolve?: PromiseResolver;
      };
    };

function runCallback(callback: () => void, lazy = true) {
  if (lazy) {
    setTimeout(() => {
      callback();
    });
  } else {
    callback();
  }
}

function getScrollBehavior(behavior: 'smooth' | 'auto', animated?: boolean) {
  if (typeof animated === 'boolean') return animated ? 'smooth' : 'auto';
  return behavior;
}

export function useMessageListScroll(behavior: 'smooth' | 'auto') {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollDistanceFromBottomRef = useRef(0);

  const [scrollPubSub] = useState(() => pubSubFactory<ScrollTopics, ScrollTopicUnion>());
  const [isScrollBottomReached, setIsScrollBottomReached] = useState(false);

  // If there is no area to scroll, it is considered as scroll bottom reached.
  if (isScrollBottomReached === false && scrollRef.current && scrollRef.current.scrollHeight <= scrollRef.current.clientHeight) {
    scrollDistanceFromBottomRef.current = 0;
    setIsScrollBottomReached(true);
  }

  useLayoutEffect(() => {
    const unsubscribes: { remove(): void }[] = [];

    unsubscribes.push(
      scrollPubSub.subscribe('scrollToBottom', ({ resolve, animated }) => {
        runCallback(() => {
          if (!scrollRef.current) return;

          if (scrollRef.current.scroll) {
            scrollRef.current.scroll({ top: scrollRef.current.scrollHeight, behavior: getScrollBehavior(behavior, animated) });
          } else {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
          }

          // Update data by manual update
          scrollDistanceFromBottomRef.current = 0;
          setIsScrollBottomReached(true);

          if (resolve) resolve();
        });
      }),
    );

    unsubscribes.push(
      scrollPubSub.subscribe('scroll', ({ top, animated, lazy, resolve }) => {
        runCallback(() => {
          if (!scrollRef.current) return;
          const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

          if (scrollRef.current.scroll) {
            scrollRef.current.scroll({ top, behavior: getScrollBehavior(behavior, animated) });
          } else if (typeof top === 'number') {
            scrollRef.current.scrollTop = top;
          }

          // Update data by manual update
          scrollDistanceFromBottomRef.current = Math.max(0, scrollHeight - scrollTop - clientHeight);
          setIsScrollBottomReached(scrollDistanceFromBottomRef.current === 0);

          if (resolve) resolve();
        }, lazy);
      }),
    );

    return () => {
      unsubscribes.forEach(({ remove }) => remove());
    };
  }, [behavior]);

  // Update data by scroll events
  useOnScrollPositionChangeDetectorWithRef(scrollRef, {
    onReachedTop({ distanceFromBottom }) {
      setIsScrollBottomReached(false);
      scrollDistanceFromBottomRef.current = distanceFromBottom;
    },
    onInBetween({ distanceFromBottom }) {
      setIsScrollBottomReached(false);
      scrollDistanceFromBottomRef.current = distanceFromBottom;
    },
    onReachedBottom({ distanceFromBottom }) {
      setIsScrollBottomReached(true);
      scrollDistanceFromBottomRef.current = distanceFromBottom;
    },
  });

  return {
    scrollRef,
    scrollPubSub,
    isScrollBottomReached,
    setIsScrollBottomReached,
    scrollDistanceFromBottomRef,
  };
}
