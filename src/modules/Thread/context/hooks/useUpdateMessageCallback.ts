import { useCallback } from 'react';
import { User } from '@sendbird/chat';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { UserMessage, UserMessageUpdateParams } from '@sendbird/chat/message';

import { Logger } from '../../../../lib/SendbirdState';

import topics, { SBUGlobalPubSub } from '../../../../lib/pubSub/topics';
import { PublishingModuleType } from '../../../internalInterfaces';
import { SendableMessageType } from '../../../../utils';

interface DynamicProps {
  currentChannel: GroupChannel | null;
  isMentionEnabled?: boolean;
  onMessageUpdated: (currentChannel: GroupChannel, message: SendableMessageType) => void;
}
interface StaticProps {
  logger: Logger;
  pubSub: SBUGlobalPubSub;
}

type CallbackParams = {
  messageId: number;
  message: string;
  mentionedUsers?: User[];
  mentionTemplate?: string;
};

export default function useUpdateMessageCallback({
  currentChannel,
  isMentionEnabled,
  onMessageUpdated,
}: DynamicProps, {
  logger,
  pubSub,
}: StaticProps) {
  // TODO: add type
  return useCallback((props: CallbackParams) => {
    const {
      messageId,
      message,
      mentionedUsers,
      mentionTemplate,
    } = props;

    const createParamsDefault = () => {
      const params = {} as UserMessageUpdateParams;
      params.message = message;
      if (isMentionEnabled && mentionedUsers && mentionedUsers?.length > 0) {
        params.mentionedUsers = mentionedUsers;
      }
      if (isMentionEnabled && mentionTemplate) {
        params.mentionedMessageTemplate = mentionTemplate;
      } else {
        params.mentionedMessageTemplate = message;
      }
      return params;
    };

    const params = createParamsDefault();
    logger.info('Thread | useUpdateMessageCallback: Message update start.', params);

    currentChannel?.updateUserMessage?.(messageId, params)
      .then((message: UserMessage) => {
        logger.info('Thread | useUpdateMessageCallback: Message update succeeded.', message);
        onMessageUpdated(currentChannel, message);
        pubSub.publish(
          topics.UPDATE_USER_MESSAGE,
          {
            fromSelector: true,
            channel: currentChannel,
            message: message,
            publishingModules: [PublishingModuleType.THREAD],
          },
        );
      });
  }, [currentChannel, isMentionEnabled]);
}
