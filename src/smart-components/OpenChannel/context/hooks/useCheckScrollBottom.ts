import { useCallback } from 'react';

interface DynamicParams {
  conversationScrollRef: React.RefObject<HTMLDivElement>;
}
interface StaticParams {
  logger: SendbirdUIKit.Logger;
}

function useCheckScrollBottom(
  { conversationScrollRef }: DynamicParams,
  { logger }: StaticParams,
): () => boolean {
  return useCallback(() => {
    let isBottom = true;
    if (conversationScrollRef) {
      try {
        const conversationScroll = conversationScrollRef.current;
        isBottom = conversationScroll.scrollHeight <= conversationScroll.scrollTop + conversationScroll.clientHeight;
      } catch(error) {
        logger.error('OpenChannel | useCheckScrollBottom', error);
      }
    }
    return isBottom;
  }, [conversationScrollRef])
}

export default useCheckScrollBottom;
