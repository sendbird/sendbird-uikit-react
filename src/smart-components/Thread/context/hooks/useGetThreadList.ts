import { useEffect } from 'react';
import { CustomUseReducerDispatcher, Logger } from '../../../../lib/SendbirdState';
import { FileMessage, ThreadedMessageListParams, UserMessage } from '@sendbird/chat/message';
import { ThreadContextActionTypes } from '../dux/actionTypes';
import { NEXT_THREADS_FETCH_SIZE, PREV_THREADS_FETCH_SIZE } from '../../consts';

interface DynamicProps {
  sdkInit: boolean;
  parentMessage: UserMessage | FileMessage;
  anchorMessage?: UserMessage | FileMessage;
  isReactionEnabled?: boolean;
}

interface StaticProps {
  logger: Logger;
  threadDispatcher: CustomUseReducerDispatcher;
}

export default function useGetThreadList({
  sdkInit,
  parentMessage,
  anchorMessage,
  isReactionEnabled,
}: DynamicProps, {
  logger,
  threadDispatcher,
}: StaticProps): void {
  useEffect(() => {
    // validation check
    if (sdkInit && parentMessage?.getThreadedMessagesByTimestamp) {
      threadDispatcher({
        type: ThreadContextActionTypes.INITIALIZE_THREAD_LIST_START,
        payload: null,
      });
      const timeStamp = anchorMessage?.createdAt || 0;
      const params = {
        prevResultSize: PREV_THREADS_FETCH_SIZE,
        nextResultSize: NEXT_THREADS_FETCH_SIZE,
        includeReactions: isReactionEnabled,
        includeMetaArray: true,
      } as ThreadedMessageListParams;
      logger.info('Thread | useGetThreadList: Initialize thread list start.', { timeStamp, params });
      parentMessage.getThreadedMessagesByTimestamp?.(timeStamp, params)
        .then(({ parentMessage, threadedMessages }) => {
          logger.info('Thread | useGetThreadList: Initialize thread list succeeded.', { parentMessage, threadedMessages });
          threadDispatcher({
            type: ThreadContextActionTypes.INITIALIZE_THREAD_LIST_SUCCESS,
            payload: {
              parentMessage,
              anchorMessage,
              threadedMessages,
            },
          });
        })
        .catch((error) => {
          logger.info('Therad | useGetThreadList: Initialize thread list failed.', error);
          threadDispatcher({
            type: ThreadContextActionTypes.INITIALIZE_THREAD_LIST_FAILURE,
            payload: error,
          });
        });
    }
  }, [sdkInit, parentMessage, anchorMessage]);
}
