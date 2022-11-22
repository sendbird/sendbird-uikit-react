import { useEffect } from 'react';
import { SendbirdGroupChat } from '@sendbird/chat/groupChannel';

import { CustomUseReducerDispatcher, Logger } from '../../../../lib/SendbirdState';
import { BaseMessage, MessageRetrievalParams } from '@sendbird/chat/message';
import { ThreadContextActionTypes } from '../dux/actionTypes';
import { ChannelType } from '@sendbird/chat';

interface DynamicProps {
  channelUrl: string;
  parentMessageId: number;
  sdkInit: boolean;
  parentMessage?: BaseMessage;
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
  parentMessage,
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
      const params: MessageRetrievalParams = {
        channelUrl,
        channelType: ChannelType.GROUP,
        messageId: parentMessageId,
        includeMetaArray: true,
        includeReactions: true,
        includeThreadInfo: true,
        includePollDetails: true,
        includeParentMessageInfo: true,
      };
      logger.info('Thread | useGetParentMessage: Get parent message start.', params);
      const fetchParentMessage = async () => {
        const data = await sdk.message.getMessage?.(params);
        return data;
      }
      fetchParentMessage()
        .then((parentMsg) => {
          logger.info('Thread | useGetParentMessage: Get parent message succeeded.', parentMessage);
          parentMsg.ogMetaData = parentMessage.ogMetaData;// ogMetaData is not included for now
          threadDispatcher({
            type: ThreadContextActionTypes.GET_PARENT_MESSAGE_SUCCESS,
            payload: { parentMessage: parentMsg },
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
