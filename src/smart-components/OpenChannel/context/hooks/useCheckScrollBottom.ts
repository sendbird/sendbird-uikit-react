import { useCallback } from 'react';
import { Logger } from '../../../..';

interface DynamicParams {
  conversationScrollRef: React.RefObject<HTMLDivElement>;
}
interface StaticParams {
  logger: Logger;
}

function useCheckScrollBottom(
  { conversationScrollRef }: DynamicParams,
  { logger }: StaticParams,
): () => boolean {
  return useCallback(() => {
    let isBottom = true;
    if (conversationScrollRef && conversationScrollRef?.current) {
      try {
        const conversationScroll = conversationScrollRef.current;
        isBottom = conversationScroll.scrollHeight <= conversationScroll.scrollTop + conversationScroll.clientHeight;
      } catch (error) {
        logger.error('OpenChannel | useCheckScrollBottom', error);
      }
    }
    return isBottom;
  }, [conversationScrollRef])
}

export default useCheckScrollBottom;
