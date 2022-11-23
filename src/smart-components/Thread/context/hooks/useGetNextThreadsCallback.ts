import { BaseMessage, FileMessage, ThreadedMessageListParams, UserMessage } from "@sendbird/chat/message";
import { useCallback } from "react";
import { CustomUseReducerDispatcher, Logger } from "../../../../lib/SendbirdState";
import { NEXT_THREADS_FETCH_SIZE } from "../../consts";
import { ThreadListStateTypes } from "../../types";
import { ThreadContextActionTypes } from "../dux/actionTypes";

interface DynamicProps {
  hasMoreNext: boolean;
  parentMessage: UserMessage | FileMessage;
  threadListStatus: ThreadListStateTypes;
  latestMessageTimeStamp: number;
  isReactionEnabled?: boolean;
}
interface StaticProps {
  logger: Logger;
  threadDispatcher: CustomUseReducerDispatcher;
}

export default function useGetNextThreadsCallback({
  hasMoreNext,
  parentMessage,
  threadListStatus,
  latestMessageTimeStamp,
  isReactionEnabled,
}: DynamicProps, {
  logger,
  threadDispatcher,
}: StaticProps): (callback: (messages?: Array<BaseMessage>) => void) => void {
  return useCallback((callback) => {
    // validation check
    if (threadListStatus === ThreadListStateTypes.INITIALIZED
      && parentMessage?.getThreadedMessagesByTimestamp
      && latestMessageTimeStamp !== 0
    ) {
      threadDispatcher({
        type: ThreadContextActionTypes.GET_NEXT_MESSAGES_START,
        payload: null,
      });
      parentMessage.getThreadedMessagesByTimestamp?.(
        latestMessageTimeStamp,
        {
          prevResultSize: 0,
          nextResultSize: NEXT_THREADS_FETCH_SIZE,
          includeReactions: isReactionEnabled,
        } as ThreadedMessageListParams,
      )
        .then(({ parentMessage, threadedMessages }) => {
          logger.info('Thread | useGetNextThreadsCallback: Fetch next threads succeeded.', { parentMessage, threadedMessages })
          threadDispatcher({
            type: ThreadContextActionTypes.GET_NEXT_MESSAGES_SUCESS,
            payload: { parentMessage, threadedMessages },
          });
          callback(threadedMessages);
        })
        .catch((error) => {
          logger.info('Thread | useGetNextThreadsCallback: Fetch next threads failed.', error);
          threadDispatcher({
            type: ThreadContextActionTypes.GET_NEXT_MESSAGES_FAILURE,
            payload: error,
          });
        });
    }
  }, [
    hasMoreNext,
    parentMessage,
    threadListStatus,
    latestMessageTimeStamp,
  ]);
}
