import { useEffect } from 'react';
import { useGroupChannelContext } from '../../../context/GroupChannelProvider';

export function useScrollBehavior() {
  const {
    scrollRef,
    scrollBehavior = 'auto',
  } = useGroupChannelContext();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.style.scrollBehavior = scrollBehavior;
    }
  }, [scrollRef.current]);

  return null;
}
