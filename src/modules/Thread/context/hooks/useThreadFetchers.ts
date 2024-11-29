import { NEXT_THREADS_FETCH_SIZE, PREV_THREADS_FETCH_SIZE } from '../../consts';
import { BaseMessage, ThreadedMessageListParams } from '@sendbird/chat/message';
import { CoreMessageType, SendableMessageType } from '../../../../utils';
import { LoggerInterface } from '../../../../lib/Logger';
import { useCallback } from 'react';
import { ThreadListStateTypes } from '../../types';
import { useSendbird } from '../../../../lib/Sendbird/context/hooks/useSendbird';

type Params = {
  anchorMessage?: SendableMessageType;
  parentMessage: SendableMessageType | null;
  isReactionEnabled?: boolean;
  logger: LoggerInterface;
  threadListState: ThreadListStateTypes;
  oldestMessageTimeStamp: number;
  latestMessageTimeStamp: number;
  initializeThreadListStart: () => void,
  initializeThreadListSuccess: (parentMessage: BaseMessage, anchorMessage: SendableMessageType, threadedMessages: BaseMessage[]) => void,
  initializeThreadListFailure: () => void,
  getPrevMessagesStart: () => void,
  getPrevMessagesSuccess: (threadedMessages: CoreMessageType[]) => void,
  getPrevMessagesFailure: () => void,
  getNextMessagesStart: () => void,
  getNextMessagesSuccess: (threadedMessages: CoreMessageType[]) => void,
  getNextMessagesFailure: () => void,
};

function getThreadMessageListParams(params?: Partial<ThreadedMessageListParams>): ThreadedMessageListParams {
  return {
    prevResultSize: PREV_THREADS_FETCH_SIZE,
    nextResultSize: NEXT_THREADS_FETCH_SIZE,
    includeMetaArray: true,
    ...params,
  };
}

export const useThreadFetchers = ({
  isReactionEnabled,
  anchorMessage,
  parentMessage: staleParentMessage,
  logger,
  oldestMessageTimeStamp,
  latestMessageTimeStamp,
  threadListState,
  initializeThreadListStart,
  initializeThreadListSuccess,
  initializeThreadListFailure,
  getPrevMessagesStart,
  getPrevMessagesSuccess,
  getPrevMessagesFailure,
  getNextMessagesStart,
  getNextMessagesSuccess,
  getNextMessagesFailure,
}: Params) => {
  const { state: { stores } } = useSendbird();
  const timestamp = anchorMessage?.createdAt || 0;

  const initialize = useCallback(
    async (callback?: (messages: BaseMessage[]) => void) => {
      if (!stores.sdkStore.initialized || !staleParentMessage) return;

      initializeThreadListStart();

      try {
        const params = getThreadMessageListParams({ includeReactions: isReactionEnabled });
        logger.info('Thread | useGetThreadList: Initialize thread list start.', { timestamp, params });

        const { threadedMessages, parentMessage } = await staleParentMessage.getThreadedMessagesByTimestamp(timestamp, params);
        logger.info('Thread | useGetThreadList: Initialize thread list succeeded.', { staleParentMessage, threadedMessages });
        initializeThreadListSuccess(parentMessage, anchorMessage, threadedMessages);
        setTimeout(() => callback?.(threadedMessages));
      } catch (error) {
        logger.info('Thread | useGetThreadList: Initialize thread list failed.', error);
        initializeThreadListFailure();
      }
    },
    [stores.sdkStore.initialized, staleParentMessage, anchorMessage, isReactionEnabled],
  );

  const loadPrevious = useCallback(
    async (callback?: (messages: BaseMessage[]) => void) => {
      if (threadListState !== ThreadListStateTypes.INITIALIZED || oldestMessageTimeStamp === 0 || !staleParentMessage) return;

      getPrevMessagesStart();

      try {
        const params = getThreadMessageListParams({ nextResultSize: 0, includeReactions: isReactionEnabled });

        const { threadedMessages, parentMessage } = await staleParentMessage.getThreadedMessagesByTimestamp(oldestMessageTimeStamp, params);

        logger.info('Thread | useGetPrevThreadsCallback: Fetch prev threads succeeded.', { parentMessage, threadedMessages });
        getPrevMessagesSuccess(threadedMessages as CoreMessageType[]);
        setTimeout(() => callback?.(threadedMessages));
      } catch (error) {
        logger.info('Thread | useGetPrevThreadsCallback: Fetch prev threads failed.', error);
        getPrevMessagesFailure();
      }
    },
    [threadListState, oldestMessageTimeStamp, isReactionEnabled, staleParentMessage],
  );

  const loadNext = useCallback(
    async (callback?: (messages: BaseMessage[]) => void) => {
      if (threadListState !== ThreadListStateTypes.INITIALIZED || latestMessageTimeStamp === 0 || !staleParentMessage) return;

      getNextMessagesStart();

      try {
        const params = getThreadMessageListParams({ prevResultSize: 0, includeReactions: isReactionEnabled });

        const { threadedMessages, parentMessage } = await staleParentMessage.getThreadedMessagesByTimestamp(latestMessageTimeStamp, params);
        logger.info('Thread | useGetNextThreadsCallback: Fetch next threads succeeded.', { parentMessage, threadedMessages });
        getNextMessagesSuccess(threadedMessages as CoreMessageType[]);
        setTimeout(() => callback?.(threadedMessages));
      } catch (error) {
        logger.info('Thread | useGetNextThreadsCallback: Fetch next threads failed.', error);
        getNextMessagesFailure();
      }
    },
    [threadListState, latestMessageTimeStamp, isReactionEnabled, staleParentMessage],
  );

  return {
    initializeThreadFetcher: initialize,
    fetchPrevThreads: loadPrevious,
    fetchNextThreads: loadNext,
  };
};
