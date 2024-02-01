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
      payload: undefined | null | PromiseResolver;
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

export function useMessageListScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollDistanceFromBottomRef = useRef(0);

  const [scrollPubSub] = useState(() => pubSubFactory<ScrollTopics, ScrollTopicUnion>());
  const [isScrollBottomReached, setIsScrollBottomReached] = useState(false);

  useLayoutEffect(() => {
    const unsubscribes: { remove(): void }[] = [];

    unsubscribes.push(
      scrollPubSub.subscribe('scrollToBottom', (resolve) => {
        runCallback(() => {
          if (!scrollRef.current) return;

          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;

          // Update data by manual update
          scrollDistanceFromBottomRef.current = 0;
          setIsScrollBottomReached(true);

          if (resolve) resolve();
        });
      }),
    );

    unsubscribes.push(
      scrollPubSub.subscribe('scroll', ({ top, animated = false, lazy, resolve }) => {
        runCallback(() => {
          if (!scrollRef.current) return;
          const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

          scrollRef.current.scroll({ top, behavior: animated ? 'smooth' : 'auto' });

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
  }, []);

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
