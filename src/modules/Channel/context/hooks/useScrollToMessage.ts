import type { BaseMessage } from '@sendbird/chat/message';
import { useCallback } from 'react';

import { Logger } from '../../../../index';
import { scrollToRenderedMessage } from '../utils';

interface DynamicParams {
  setInitialTimeStamp: React.Dispatch<React.SetStateAction<number>>;
  setAnimatedMessageId: React.Dispatch<React.SetStateAction<number>>;
  allMessages: BaseMessage[];
  scrollRef: React.RefObject<HTMLDivElement>;
}

interface StaticParams {
  logger: Logger;
}

// To prevent multiple clicks on the message in the channel while scrolling
function deactivateClick(scrollRef: React.RefObject<HTMLDivElement>) {
  const element = scrollRef.current;
  const parentNode = element?.parentNode as HTMLDivElement;
  if (element && parentNode) {
    element.style.pointerEvents = 'none';
    parentNode.style.cursor = 'wait';
  }
}

function activateClick(scrollRef: React.RefObject<HTMLDivElement>) {
  const element = scrollRef.current;
  const parentNode = element?.parentNode as HTMLDivElement;
  if (element && parentNode) {
    element.style.pointerEvents = 'auto';
    parentNode.style.cursor = 'auto';
  }
}

function useScrollToMessage({
  setInitialTimeStamp,
  setAnimatedMessageId,
  allMessages,
  scrollRef,
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
        try {
          logger.info('Channel: scroll to message - disabling mouse events');
          deactivateClick(scrollRef);
          if (isPresent) {
            logger.info('Channel: scroll to message - message is present');
            setAnimatedMessageId(messageId);
            scrollToRenderedMessage(scrollRef, createdAt);
          } else {
            logger.info('Channel: scroll to message - fetching older messages');
            setInitialTimeStamp(null);
            setInitialTimeStamp(createdAt);
            setAnimatedMessageId(messageId);
          }
        } finally {
          logger.info('Channel: scroll to message - enabled mouse events');
          activateClick(scrollRef);
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
