import { DependencyList, useEffect, useLayoutEffect, useRef, useState } from 'react';
import pubSubFactory from '../../../../lib/pubSub';
import { useGroupChannel } from './useGroupChannel';
import { createScrollController } from '../../internal/scroll/controller';
import { attachViewportObserver } from '../../internal/scroll/browserViewport';

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

  // Phase 3 ScrollController — parallel-only. Subscribes to the same
  // scrollPubSub topics as the legacy handlers below and records typed
  // ScrollIntent records (visible via the dev/test hook
  // `__GROUP_CHANNEL_SCROLL_CONTROLLER_HOOK__`). The default executor is
  // no-op, so the controller does not drive DOM scroll — the legacy
  // handlers in this hook continue to own that responsibility.
  // Phase 3 sub-batch 2 invariant: scrollPubSub topic/payload contract
  // is UNCHANGED (BC-6).
  const scrollControllerRef = useRef(createScrollController());
  const {
    actions: { setIsScrollBottomReached },
  } = useGroupChannel();

  // SideEffect: Reset scroll state
  useLayoutEffect(() => {
    scrollPositionRef.current = 0;
    scrollDistanceFromBottomRef.current = 0;
    setIsScrollBottomReached(true);
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, deps);

  // Phase 3 controller attach — runs whenever scrollRef.current changes.
  // Idempotent: attach is safe to call repeatedly.
  useLayoutEffect(() => {
    scrollControllerRef.current.attach(scrollRef.current);
  });

  // Phase 3 viewport observer attach — feature-detected. SSR-safe.
  useEffect(() => {
    const observer = attachViewportObserver(scrollControllerRef.current);
    return () => observer.dispose();
  }, []);

  // Phase 3 parallel subscribers — translate each scrollPubSub publish into
  // a typed ScrollIntent for the controller. These run alongside the legacy
  // DOM handlers below; the controller's no-op executor ensures no
  // duplicate DOM mutation. RV-3.1 / RV-3.2 verify the mapping.
  useLayoutEffect(() => {
    const controller = scrollControllerRef.current;
    const subs: { remove(): void }[] = [];
    subs.push(
      scrollPubSub.subscribe('scrollToBottom', ({ animated, resolve }) => {
        // eslint-disable-next-line no-void
        void controller.run({
          type: 'TO_BOTTOM',
          animated: animated === true,
          reason: 'button',
          resolve,
        });
      }),
    );
    subs.push(
      scrollPubSub.subscribe('scroll', ({ top, animated, lazy, resolve }) => {
        // eslint-disable-next-line no-void
        void controller.run({
          type: 'TO_MESSAGE',
          createdAt: 0,
          animated: animated === true,
          focus: false,
          top,
          lazy,
          resolve,
        });
      }),
    );
    return () => {
      subs.forEach(({ remove }) => remove());
    };
  }, []);

  useLayoutEffect(() => {
    const unsubscribes: { remove(): void }[] = [];

    unsubscribes.push(
      scrollPubSub.subscribe('scrollToBottom', ({ resolve, animated }) => {
        // Use lazy: false since scrollToBottom action already waits for DOM update via requestAnimationFrame
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
        }, false);
      }),
    );

    unsubscribes.push(
      scrollPubSub.subscribe('scroll', ({ top, animated, lazy, resolve }) => {
        runCallback(() => {
          if (!scrollRef.current || typeof top !== 'number') {
            resolve?.();
            return;
          }
          const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

          if (scrollRef.current.scroll) {
            scrollRef.current.scroll({ top, behavior: getScrollBehavior(behavior, animated) });
          } else {
            scrollRef.current.scrollTop = top;
          }

          // Update data by manual update
          scrollDistanceFromBottomRef.current = Math.max(0, scrollHeight - scrollTop - clientHeight);
          setIsScrollBottomReached(scrollDistanceFromBottomRef.current === 0);

          resolve?.();
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
