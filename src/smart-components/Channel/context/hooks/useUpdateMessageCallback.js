import { useCallback } from 'react';

import * as messageActionTypes from '../dux/actionTypes';
import * as topics from '../../../../lib/pubSub/topics';

function useUpdateMessageCallback({
  currentGroupChannel,
  messagesDispatcher,
  onBeforeUpdateUserMessage,
  isMentionEnabled,
}, {
  logger,
  pubSub,
  sdk,
}) {
  return useCallback((props, callback) => {
    const {
      messageId,
      message,
      mentionedUsers,
      mentionTemplate,
    } = props;
    const createParamsDefault = () => {
      const params = {};
      params.message = message;
      if (isMentionEnabled && mentionedUsers?.length > 0) {
        params.mentionedUsers = mentionedUsers;
      }
      if (isMentionEnabled && mentionTemplate) {
        params.mentionedMessageTemplate = mentionTemplate;
      } else {
        params.mentionedMessageTemplate = message;
      }
      return params;
    };

    const createCustomPrams = onBeforeUpdateUserMessage
      && typeof onBeforeUpdateUserMessage === 'function';

    if (createCustomPrams) {
      logger.info('Channel: creating params using onBeforeUpdateUserMessage', onBeforeUpdateUserMessage);
    }

    const params = onBeforeUpdateUserMessage
      ? onBeforeUpdateUserMessage(message)
      : createParamsDefault(message);

    logger.info('Channel: Updating message!', params);
    currentGroupChannel.updateUserMessage(messageId, params).then((msg, err) => {
      if (callback) {
        callback(err, msg);
      }

      logger.info('Channel: Updating message success!', msg);
      messagesDispatcher({
        type: messageActionTypes.ON_MESSAGE_UPDATED,
        payload: {
          channel: currentGroupChannel,
          message: msg,
        },
      });
      pubSub.publish(
        topics.UPDATE_USER_MESSAGE,
        {
          message: msg,
          channel: currentGroupChannel,
        },
      );
    });
  }, [currentGroupChannel.url, messagesDispatcher, onBeforeUpdateUserMessage]);
}

export default useUpdateMessageCallback;
