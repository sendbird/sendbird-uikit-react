import { useCallback } from 'react';
import { BaseMessageInstance } from 'sendbird';

import { Logger } from '../../../../index';

interface DynamicParams {
  setIntialTimeStamp: React.Dispatch<React.SetStateAction<number>>;
  setAnimatedMessageId: React.Dispatch<React.SetStateAction<number>>;
  allMessages: BaseMessageInstance[];
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
