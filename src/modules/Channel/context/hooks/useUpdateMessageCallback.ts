import React, { useCallback } from 'react';

import * as messageActionTypes from '../dux/actionTypes';
import { ChannelActionTypes } from '../dux/actionTypes';
import topics, { SBUGlobalPubSub } from '../../../../lib/pubSub/topics';
import { PublishingModuleType } from '../../../internalInterfaces';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { UserMessage, UserMessageUpdateParams } from '@sendbird/chat/message';
import { LoggerInterface } from '../../../../lib/Logger';
import { SendbirdError, User } from '@sendbird/chat';

type UseUpdateMessageCallbackOptions = {
  currentGroupChannel: null | GroupChannel;
  messagesDispatcher: React.Dispatch<ChannelActionTypes>;
  onBeforeUpdateUserMessage?: (text: string) => UserMessageUpdateParams;
  isMentionEnabled: boolean;
};
type UseUpdateMessageCallbackParams = {
  logger: LoggerInterface;
  pubSub: SBUGlobalPubSub;
};
type UpdateMessageParams = {
  messageId: number;
  message: string;
  mentionedUsers?: User[];
  mentionTemplate?: string;
};
type UpdateMessageCallback = (err: SendbirdError, message: UserMessage) => void;
function useUpdateMessageCallback(
  {
    currentGroupChannel,
    messagesDispatcher,
    onBeforeUpdateUserMessage,
    isMentionEnabled,
  }: UseUpdateMessageCallbackOptions,
  { logger, pubSub }: UseUpdateMessageCallbackParams,
) {
  return useCallback(
    (props: UpdateMessageParams, callback?: UpdateMessageCallback) => {
      const { messageId, message, mentionedUsers, mentionTemplate } = props;
      const createParamsDefault = (message: string) => {
        const params: UserMessageUpdateParams = {
          message,
        };
        if (isMentionEnabled && mentionedUsers && mentionedUsers.length > 0) {
          params.mentionedUsers = mentionedUsers;
        }
        if (isMentionEnabled && mentionTemplate) {
          params.mentionedMessageTemplate = mentionTemplate;
        } else {
          params.mentionedMessageTemplate = message;
        }
        return params;
      };

      const shouldCreateCustomParams = onBeforeUpdateUserMessage && typeof onBeforeUpdateUserMessage === 'function';

      if (shouldCreateCustomParams) {
        logger.info('Channel: creating params using onBeforeUpdateUserMessage', onBeforeUpdateUserMessage);
      }

      const params = shouldCreateCustomParams ? onBeforeUpdateUserMessage(message) : createParamsDefault(message);

      logger.info('Channel: Updating message!', params);
      currentGroupChannel
        ?.updateUserMessage(messageId, params)
        .then((msg) => {
          if (callback) {
            callback(null, msg);
          }

          logger.info('Channel: Updating message success!', msg);
          messagesDispatcher({
            type: messageActionTypes.ON_MESSAGE_UPDATED,
            payload: {
              channel: currentGroupChannel,
              message: msg,
            },
          });
          pubSub.publish(topics.UPDATE_USER_MESSAGE, {
            message: msg,
            channel: currentGroupChannel,
            publishingModules: [PublishingModuleType.CHANNEL],
          });
        })
        .catch((err) => {
          if (callback) {
            callback(err, null);
          }
        });
    },
    [currentGroupChannel?.url, messagesDispatcher, onBeforeUpdateUserMessage],
  );
}

export default useUpdateMessageCallback;
