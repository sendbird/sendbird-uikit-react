import type { BaseMessage } from '@sendbird/chat/message';
import { useCallback } from 'react';

import { Logger } from '../../../../index';

interface DynamicParams {
  setInitialTimeStamp: React.Dispatch<React.SetStateAction<number>>;
  setAnimatedMessageId: React.Dispatch<React.SetStateAction<number>>;
  allMessages: BaseMessage[];
}

interface StaticParams {
  logger: Logger;
}

function useScrollToMessage({
  setInitialTimeStamp,
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
          setInitialTimeStamp(null);
          setInitialTimeStamp(createdAt);
          setAnimatedMessageId(messageId);
        }
      });
    }, [
      setInitialTimeStamp,
      setAnimatedMessageId,
      allMessages,
    ],
  );
}

export default useScrollToMessage;
