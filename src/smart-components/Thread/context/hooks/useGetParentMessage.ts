import { useEffect } from 'react';
import { SendbirdGroupChat } from '@sendbird/chat/groupChannel';

import { CustomUseReducerDispatcher, Logger } from '../../../../lib/SendbirdState';
import { MessageRetrievalParams } from '@sendbird/chat/message';
import { ThreadContextActionTypes } from '../dux/actionTypes';

interface DynamicProps {
  channelUrl: string;
  parentMessageId: number;
  sdkInit: boolean;
}

interface StaticProps {
  sdk: SendbirdGroupChat;
  logger: Logger;
  threadDispatcher: CustomUseReducerDispatcher;
}

export default function useGetParentMessage({
  channelUrl,
  parentMessageId,
  sdkInit,
}: DynamicProps, {
  sdk,
  logger,
  threadDispatcher,
}: StaticProps): void {
  useEffect(() => {
    // validation check
    if (sdkInit && sdk?.message?.getMessage) {
      threadDispatcher({
        type: ThreadContextActionTypes.GET_PARENT_MESSAGE_START,
        payload: null,
      });
      sdk.message.getMessage?.({
        channelUrl,
        messageId: parentMessageId,
        includeReactions: true,
      includeThreadInfo: true,
      } as MessageRetrievalParams)
        .then((parentMessage) => {
          logger.info('Thread | useGetParentMessage: Get parent message succeeded.', parentMessage);
          threadDispatcher({
            type: ThreadContextActionTypes.GET_PARENT_MESSAGE_SUCCESS,
            payload: parentMessage,
          });
        })
        .catch((error) => {
          logger.info('Thread | useGetParentMessage: Get parent message failed.', error);
          threadDispatcher({
            type: ThreadContextActionTypes.GET_PARENT_MESSAGE_FAILURE,
            payload: error,
          });
        });
    }
  }, [sdkInit, channelUrl, parentMessageId]);
}
