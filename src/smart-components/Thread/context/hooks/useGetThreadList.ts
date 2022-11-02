import { useEffect } from 'react';
import { SendbirdGroupChat } from '@sendbird/chat/groupChannel';
import { CustomUseReducerDispatcher, Logger } from '../../../../lib/SendbirdState';
import { FileMessage, ThreadedMessageListParams, UserMessage } from '@sendbird/chat/message';
import { ThreadContextActionTypes } from '../dux/actionTypes';

// Divide this to useGetPrevThreadedMessages and useGetNextThreadedMessages

interface DynamicProps {
  parentMessage: UserMessage | FileMessage;
  anchorMessage: UserMessage | FileMessage;
}

interface StaticProps {
  sdk: SendbirdGroupChat;
  logger: Logger;
  threadDispatcher: CustomUseReducerDispatcher;
}

export default function useGetThreadList({
  parentMessage,
  anchorMessage,
}: DynamicProps, {
  sdk,
  logger,
  threadDispatcher,
}: StaticProps): void {
  useEffect(() => {
    // validation check
    if (parentMessage?.getThreadedMessagesByTimestamp) {
      threadDispatcher({
        type: ThreadContextActionTypes.GET_NEXT_MESSAGES_START,
        payload: null,
      });
      threadDispatcher({
        type: ThreadContextActionTypes.GET_PREV_MESSAGES_START,
        payload: null,
      });
      parentMessage.getThreadedMessagesByTimestamp(
        anchorMessage.createdAt,
        {} as ThreadedMessageListParams,
      )
        .then(({ parentMessage, threadedMessages }) => {
          threadDispatcher({
            type: ThreadContextActionTypes.GET_NEXT_MESSAGES_SUCESS,
            payload: threadedMessages,
          });
          threadDispatcher({
            type: ThreadContextActionTypes.GET_PREV_MESSAGES_SUCESS,
            payload: threadedMessages,
          });
        })
        .catch((error) => {
          threadDispatcher({
            type: ThreadContextActionTypes.GET_NEXT_MESSAGES_FAILURE,
            payload: error,
          });
          threadDispatcher({
            type: ThreadContextActionTypes.GET_PREV_MESSAGES_FAILURE,
            payload: error,
          });
        });
    }
  }, [parentMessage]);
}
