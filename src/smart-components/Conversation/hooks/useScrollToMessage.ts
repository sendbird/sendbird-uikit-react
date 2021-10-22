import { useCallback } from 'react';
import { SendbirdTypes } from '../../../types';
import { Logger } from '../../../index';

interface DynamicParams {
  setIntialTimeStamp(ts: number): null;
  setHighLightedMessageId(id: number): null;
  allMessages: SendbirdTypes['BaseMessageInstance'][];
}

interface StaticParams {
  logger: Logger;
}

function useScrollToMessage({
  setIntialTimeStamp,
  setHighLightedMessageId,
  allMessages,
}: DynamicParams,
  { logger }: StaticParams,
): (createdAt: number, messageId: number) => void {
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
