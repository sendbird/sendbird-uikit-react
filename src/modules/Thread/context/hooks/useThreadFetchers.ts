import { ThreadContextActionTypes } from '../dux/actionTypes';
import { NEXT_THREADS_FETCH_SIZE, PREV_THREADS_FETCH_SIZE } from '../../consts';
import { BaseMessage, ThreadedMessageListParams } from '@sendbird/chat/message';
import { SendableMessageType } from '../../../../utils';
import { CustomUseReducerDispatcher } from '../../../../lib/SendbirdState';
import { LoggerInterface } from '../../../../lib/Logger';
import { useCallback } from 'react';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { ThreadListStateTypes } from '../../types';

type Params = {
  anchorMessage?: SendableMessageType;
  parentMessage: SendableMessageType;
  isReactionEnabled?: boolean;
  threadDispatcher: CustomUseReducerDispatcher;
  logger: LoggerInterface;
  threadListState: ThreadListStateTypes;
  oldestMessageTimeStamp: number;
  latestMessageTimeStamp: number;
};

export const useThreadFetchers = ({
  isReactionEnabled,
  anchorMessage,
  parentMessage: staleParentMessage,
  threadDispatcher,
  logger,
  oldestMessageTimeStamp,
  latestMessageTimeStamp,
  threadListState,
}: Params) => {
  const { stores } = useSendbirdStateContext();
  const timestamp = anchorMessage?.createdAt || 0;

  function getThreadMessageListParams(params?: Partial<ThreadedMessageListParams>): ThreadedMessageListParams {
    return {
      prevResultSize: PREV_THREADS_FETCH_SIZE,
      nextResultSize: NEXT_THREADS_FETCH_SIZE,
      includeReactions: isReactionEnabled,
      includeMetaArray: true,
      ...params,
    };
  }

  const initialize = useCallback(
    async (callback?: (messages: BaseMessage[]) => void) => {
      if (!stores.sdkStore.initialized || !staleParentMessage) return;

      threadDispatcher({
        type: ThreadContextActionTypes.INITIALIZE_THREAD_LIST_START,
        payload: null,
      });

      try {
        const params = getThreadMessageListParams();
        logger.info('Thread | useGetThreadList: Initialize thread list start.', { timestamp, params });

        const { threadedMessages, parentMessage } = await staleParentMessage.getThreadedMessagesByTimestamp(timestamp, params);
        logger.info('Thread | useGetThreadList: Initialize thread list succeeded.', { staleParentMessage, threadedMessages });
        threadDispatcher({
          type: ThreadContextActionTypes.INITIALIZE_THREAD_LIST_SUCCESS,
          payload: { parentMessage, anchorMessage, threadedMessages },
        });
        setTimeout(() => callback?.(threadedMessages));
      } catch (error) {
        logger.info('Thread | useGetThreadList: Initialize thread list failed.', error);
        threadDispatcher({
          type: ThreadContextActionTypes.INITIALIZE_THREAD_LIST_FAILURE,
          payload: error,
        });
      }
    },
    [stores.sdkStore.initialized, staleParentMessage, anchorMessage, isReactionEnabled],
  );

  const loadPrevious = useCallback(
    async (callback?: (messages: BaseMessage[]) => void) => {
      if (threadListState !== ThreadListStateTypes.INITIALIZED || oldestMessageTimeStamp === 0 || !staleParentMessage) return;

      threadDispatcher({
        type: ThreadContextActionTypes.GET_PREV_MESSAGES_START,
        payload: null,
      });

      try {
        const params = getThreadMessageListParams({ nextResultSize: 0 });

        const { threadedMessages, parentMessage } = await staleParentMessage.getThreadedMessagesByTimestamp(oldestMessageTimeStamp, params);

        logger.info('Thread | useGetPrevThreadsCallback: Fetch prev threads succeeded.', { parentMessage, threadedMessages });
        threadDispatcher({
          type: ThreadContextActionTypes.GET_PREV_MESSAGES_SUCESS,
          payload: { parentMessage, threadedMessages },
        });
        setTimeout(() => callback?.(threadedMessages));
      } catch (error) {
        logger.info('Thread | useGetPrevThreadsCallback: Fetch prev threads failed.', error);
        threadDispatcher({
          type: ThreadContextActionTypes.GET_PREV_MESSAGES_FAILURE,
          payload: error,
        });
      }
    },
    [threadListState, oldestMessageTimeStamp, isReactionEnabled, staleParentMessage],
  );

  const loadNext = useCallback(
    async (callback?: (messages: BaseMessage[]) => void) => {
      if (threadListState !== ThreadListStateTypes.INITIALIZED || latestMessageTimeStamp === 0 || !staleParentMessage) return;

      threadDispatcher({
        type: ThreadContextActionTypes.GET_NEXT_MESSAGES_START,
        payload: null,
      });

      try {
        const params = getThreadMessageListParams({ prevResultSize: 0 });

        const { threadedMessages, parentMessage } = await staleParentMessage.getThreadedMessagesByTimestamp(latestMessageTimeStamp, params);
        logger.info('Thread | useGetNextThreadsCallback: Fetch next threads succeeded.', { parentMessage, threadedMessages });
        threadDispatcher({
          type: ThreadContextActionTypes.GET_NEXT_MESSAGES_SUCESS,
          payload: { parentMessage, threadedMessages },
        });
        setTimeout(() => callback?.(threadedMessages));
      } catch (error) {
        logger.info('Thread | useGetNextThreadsCallback: Fetch next threads failed.', error);
        threadDispatcher({
          type: ThreadContextActionTypes.GET_NEXT_MESSAGES_FAILURE,
          payload: error,
        });
      }
    },
    [threadListState, latestMessageTimeStamp, isReactionEnabled, staleParentMessage],
  );

  return {
    initialize,
    loadPrevious,
    loadNext,
  };
};
