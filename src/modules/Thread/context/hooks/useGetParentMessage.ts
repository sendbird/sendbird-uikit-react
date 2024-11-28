import { useEffect } from 'react';

import { Logger } from '../../../../lib/SendbirdState';
import { BaseMessage, MessageRetrievalParams } from '@sendbird/chat/message';
import { ChannelType } from '@sendbird/chat';
import { SdkStore } from '../../../../lib/types';
import useThread from '../useThread';

interface DynamicProps {
  channelUrl: string;
  sdkInit: boolean;
  parentMessage?: BaseMessage | null;
}

interface StaticProps {
  sdk: SdkStore['sdk'];
  logger: Logger;
}

export default function useGetParentMessage({
  channelUrl,
  sdkInit,
  parentMessage,
}: DynamicProps, {
  sdk,
  logger,
}: StaticProps): void {
  const {
    actions: {
      getParentMessageStart,
      getParentMessageSuccess,
      getParentMessageFailure,
    },
  } = useThread();

  useEffect(() => {
    // validation check
    if (sdkInit && sdk?.message?.getMessage && parentMessage) {
      getParentMessageStart();
      const params: MessageRetrievalParams = {
        channelUrl,
        channelType: ChannelType.GROUP,
        messageId: parentMessage.messageId,
        includeMetaArray: true,
        includeReactions: true,
        includeThreadInfo: true,
        includeParentMessageInfo: true,
      };
      logger.info('Thread | useGetParentMessage: Get parent message start.', params);
      sdk.message.getMessage?.(params)
        .then((parentMsg) => {
          logger.info('Thread | useGetParentMessage: Get parent message succeeded.', parentMessage);
          // @ts-ignore
          parentMsg.ogMetaData = parentMessage?.ogMetaData || null;// ogMetaData is not included for now
          // @ts-ignore
          getParentMessageSuccess(parentMsg);
        })
        .catch((error) => {
          logger.info('Thread | useGetParentMessage: Get parent message failed.', error);
          getParentMessageFailure();
        });
    }
  }, [sdkInit, parentMessage?.messageId]);
  /**
   * We don't use channelUrl here,
   * because Thread must operate independently of the channel.
   */
}
