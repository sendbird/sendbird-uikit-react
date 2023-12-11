import { useEffect } from 'react';
import { useChannelContext } from '../../../context/ChannelProvider';

export function useScrollBehavior() {
  const {
    scrollRef,
    scrollBehavior = 'auto',
  } = useChannelContext();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.style.scrollBehavior = scrollBehavior;
    }
  }, [scrollRef.current]);

  return null;
}
