import { useEffect } from 'react';
import { SendbirdGroupChat } from '@sendbird/chat/groupChannel';

import { CustomUseReducerDispatcher, Logger } from '../../../../lib/SendbirdState';
import { MessageRetrievalParams } from '@sendbird/chat/message';
import { ThreadContextActionTypes } from '../dux/actionTypes';
import { ChannelType } from '@sendbird/chat';

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
}: StaticProps) {
  useEffect(() => {
    // validation check
    if (sdkInit && sdk?.message?.getMessage) {
      threadDispatcher({
        type: ThreadContextActionTypes.GET_PARENT_MESSAGE_START,
        payload: null,
      });
      const fetchParentMessage = async () => {
        const params: MessageRetrievalParams = {
          channelUrl,
          messageId: parentMessageId,
          includeReactions: true,
          includeThreadInfo: true,
          channelType: ChannelType.GROUP,
        };
        const data = await sdk.message.getMessage?.(params);
        return data;
      }
      fetchParentMessage()
        .then((parentMessage) => {
          logger.info('Thread | useGetParentMessage: Get parent message succeeded.', parentMessage);
          threadDispatcher({
            type: ThreadContextActionTypes.GET_PARENT_MESSAGE_SUCCESS,
            payload: { parentMessage },
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
  }, [sdkInit, parentMessageId]);
  /**
   * We don't use channelUrl here,
   * because Thread must operate independently of the channel.
   */
}
