import { useCallback } from 'react';
import { BaseMessage, FileMessage, ThreadedMessageListParams, UserMessage } from '@sendbird/chat/message';

import { CustomUseReducerDispatcher, Logger } from '../../../../lib/SendbirdState';
import { PREV_THREADS_FETCH_SIZE } from '../../consts';
import { ThreadListStateTypes } from '../../types';
import { ThreadContextActionTypes } from '../dux/actionTypes';

interface DynamicProps {
  hasMorePrev: boolean;
  parentMessage: UserMessage | FileMessage;
  threadListState: ThreadListStateTypes;
  oldestMessageTimeStamp: number;
  isReactionEnabled?: boolean;
}
interface StaticProps {
  logger: Logger;
  threadDispatcher: CustomUseReducerDispatcher;
}

export default function useGetPrevThreadsCallback({
  hasMorePrev,
  parentMessage,
  threadListState,
  oldestMessageTimeStamp,
  isReactionEnabled,
}: DynamicProps, {
  logger,
  threadDispatcher,
}: StaticProps): (callback?: (messages?: Array<BaseMessage>) => void) => void {
  return useCallback((callback) => {
    // validation check
    if (threadListState === ThreadListStateTypes.INITIALIZED
      && parentMessage?.getThreadedMessagesByTimestamp
      && oldestMessageTimeStamp !== 0
    ) {
      threadDispatcher({
        type: ThreadContextActionTypes.GET_PREV_MESSAGES_START,
        payload: null,
      });
      parentMessage.getThreadedMessagesByTimestamp?.(
        oldestMessageTimeStamp,
        {
          prevResultSize: PREV_THREADS_FETCH_SIZE,
          nextResultSize: 0,
          includeReactions: isReactionEnabled,
          includeMetaArray: true,
        } as ThreadedMessageListParams,
      )
        .then(({ parentMessage, threadedMessages }) => {
          logger.info('Thread | useGetPrevThreadsCallback: Fetch prev threads succeeded.', { parentMessage, threadedMessages });
          threadDispatcher({
            type: ThreadContextActionTypes.GET_PREV_MESSAGES_SUCESS,
            payload: { parentMessage, threadedMessages },
          });
          callback(threadedMessages);
        })
        .catch((error) => {
          logger.info('Thread | useGetPrevThreadsCallback: Fetch prev threads failed.', error);
          threadDispatcher({
            type: ThreadContextActionTypes.GET_PREV_MESSAGES_FAILURE,
            payload: error,
          });
        });
    }
  }, [
    hasMorePrev,
    parentMessage,
    threadListState,
    oldestMessageTimeStamp,
  ]);
}
