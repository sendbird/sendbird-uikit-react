import { useCallback } from 'react';
import { SendbirdTypes } from '../../../types';
import { Logger } from '../../../index';

interface DynamicParams {
  setIntialTimeStamp(ts: number): null;
  setAnimatedMessageId(id: number): null;
  allMessages: SendbirdTypes['BaseMessageInstance'][];
}

interface StaticParams {
  logger: Logger;
}

function useScrollToMessage({
  setIntialTimeStamp,
  setAnimatedMessageId,
  allMessages,
}: DynamicParams,
  { logger }: StaticParams,
): (createdAt: number, messageId: number) => void {
  return useCallback(
    (createdAt: number, messageId: number) => {
      const isPresent = allMessages.find((m) => (
        m.messageId === messageId
      ));
      setAnimatedMessageId(null);
      setTimeout(() => {
        if (isPresent) {
          logger.info('Channel: scroll to message - message is present');
          setAnimatedMessageId(messageId);
        } else {
          logger.info('Channel: scroll to message - fetching older messages');
          setIntialTimeStamp(null);
          setIntialTimeStamp(createdAt);
          setAnimatedMessageId(messageId);
        }
      });
    }, [
    setIntialTimeStamp,
    setAnimatedMessageId,
    allMessages,
  ],
  );
}

export default useScrollToMessage;
