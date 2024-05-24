import { DependencyList, useLayoutEffect, useRef, useState } from 'react';
import pubSubFactory from '../../../../lib/pubSub';

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

export function useMessageListScroll(behavior: 'smooth' | 'auto', deps: DependencyList = []) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);
  const scrollDistanceFromBottomRef = useRef(0);

  const [scrollPubSub] = useState(() => pubSubFactory<ScrollTopics, ScrollTopicUnion>({ publishSynchronous: true }));
  const [isScrollBottomReached, setIsScrollBottomReached] = useState(true);

  // SideEffect: Reset scroll state
  useLayoutEffect(() => {
    scrollPositionRef.current = 0;
    scrollDistanceFromBottomRef.current = 0;
    setIsScrollBottomReached(true);
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, deps);

  useLayoutEffect(() => {
    const unsubscribes: { remove(): void }[] = [];

    unsubscribes.push(
      scrollPubSub.subscribe('scrollToBottom', ({ resolve, animated }) => {
        runCallback(() => {
          if (!scrollRef.current) {
            if (resolve) resolve();
            return;
          }

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

  return {
    scrollRef,
    scrollPubSub,
    isScrollBottomReached,
    setIsScrollBottomReached,
    scrollDistanceFromBottomRef,
    scrollPositionRef,
  };
}

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
