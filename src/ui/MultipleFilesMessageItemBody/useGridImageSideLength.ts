import { useMemo } from 'react';
import {ThreadMessageKind} from "./index";
import {match} from "ts-pattern";

interface DynamicSideLengthProps {
  threadMessageKind: ThreadMessageKind;
  isMobile: boolean;
}

export function useDynamicSideLength({
  threadMessageKind,
  isMobile,
}: DynamicSideLengthProps): string[] {
  const imageSideLength = useMemo(() => {
    return match(threadMessageKind)
      .with(ThreadMessageKind.PARENT, () => (isMobile
          ? 'THREAD_PARENT_MOBILE'
          : 'THREAD_PARENT_WEB'
      ))
      .with(ThreadMessageKind.CHILD, () => (isMobile
          ? 'THREAD_CHILD_MOBILE'
          : 'THREAD_CHILD_WEB'
      ))
      .otherwise(() => (isMobile
          ? 'CHAT_MOBILE'
          : 'CHAT_WEB'
      ));
  }, [isMobile, threadMessageKind]);
  return [imageSideLength];
}
