import { useLayoutEffect, useRef, useState } from 'react';
import pubSubFactory from '../../../../lib/pubSub';
import { useOnScrollPositionChangeDetectorWithRef } from '../../../../hooks/useOnScrollReachedEndDetector';

type ScrollTopics = 'scrollToBottom' | 'scroll';
type ScrollTopicUnion =
  | {
      topic: 'scrollToBottom';
      payload: undefined | null;
    }
  | {
      topic: 'scroll';
      payload: { top?: number; animated?: boolean; lazy?: boolean };
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
      scrollPubSub.subscribe('scrollToBottom', () => {
        runCallback(() => {
          if (!scrollRef.current) return;

          scrollRef.current.scrollTop = Number.MAX_SAFE_INTEGER;

          // Update data by manual update
          scrollDistanceFromBottomRef.current = 0;
          setIsScrollBottomReached(true);
        });
      }),
    );

    unsubscribes.push(
      scrollPubSub.subscribe('scroll', ({ top, animated = false, lazy }) => {
        runCallback(() => {
          if (!scrollRef.current) return;
          const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

          scrollRef.current.scroll({ top, behavior: animated ? 'smooth' : 'auto' });

          // Update data by manual update
          scrollDistanceFromBottomRef.current = scrollHeight - scrollTop - clientHeight;
          setIsScrollBottomReached(false);
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
