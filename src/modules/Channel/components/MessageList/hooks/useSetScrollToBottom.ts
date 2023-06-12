import React, { useEffect, useState } from 'react';
import { useDebounce } from '../../../../../hooks/useDebounce';

const DELAY = 500;

export function useSetScrollToBottom({
  loading,
}: {
  loading: boolean;
}): ({
  scrollBottom: number;
  scrollToBottomHandler: (e: React.UIEvent<HTMLDivElement, UIEvent>) => void;
}) {
  const [scrollBottom, setScrollBottom] = useState(0);
  useEffect(() => {
    if (loading) {
      setScrollBottom(0);
    }
  }, [loading]);
  const scrollCb = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const element = e.target as HTMLDivElement;
    try {
      setScrollBottom(element.scrollHeight - element.scrollTop - element.offsetHeight);
    } catch {
      //
    }
  };
  return {
    scrollBottom,
    scrollToBottomHandler: useDebounce(scrollCb, DELAY),
  };
}
