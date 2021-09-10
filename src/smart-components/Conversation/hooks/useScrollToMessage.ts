import { useCallback } from 'react';

function useScrollToMessage({
  setIntialTimeStamp,
  setHighLightedMessageId,
  allMessages,
}, { logger }) {
  return useCallback(
    (createdAt: number, messageId: number) => {
      const isPresent = allMessages.find((m) => (
        m.messageId === messageId
      ));
      setHighLightedMessageId(null);
      setTimeout(() => {
        if (isPresent) {
          logger.info('Channel: scroll to message - message is present');
          setHighLightedMessageId(messageId);
        } else {
          logger.info('Channel: scroll to message - fetching older messages');
          setIntialTimeStamp(null);
          setIntialTimeStamp(createdAt);
          setHighLightedMessageId(messageId);
        }
      });
    }, [
      setIntialTimeStamp,
      setHighLightedMessageId,
      allMessages,
    ],
  );
}

export default useScrollToMessage;
