import { useCallback } from 'react';

interface MainProps {
  conversationScrollRef: React.RefObject<HTMLDivElement>;
}
interface ToolProps {
  logger: SendbirdUIKit.Logger;
}

function useCheckScrollBottom(
  { conversationScrollRef }: MainProps,
  { logger }: ToolProps,
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
