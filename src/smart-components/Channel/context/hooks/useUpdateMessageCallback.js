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
      const params = new sdk.UserMessageParams();
      params.message = message;
      if (isMentionEnabled && mentionedUsers?.length > 0) {
        params.mentionedUsers = mentionedUsers;
      }
      if (isMentionEnabled && mentionTemplate) {
        params.mentionedMessageTemplate = mentionTemplate;
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

    currentGroupChannel.updateUserMessage(messageId, params, (r, e) => {
      logger.info('Channel: Updating message!', params);
      const swapParams = sdk.getErrorFirstCallback();
      let message = r;
      let err = e;
      if (swapParams) {
        message = e;
        err = r;
      }
      if (callback) {
        callback(err, message);
      }
      if (!err) {
        logger.info('Channel: Updating message success!', message);
        messagesDispatcher({
          type: messageActionTypes.ON_MESSAGE_UPDATED,
          payload: {
            channel: currentGroupChannel,
            message,
          },
        });
        pubSub.publish(
          topics.UPDATE_USER_MESSAGE,
          {
            message,
            channel: currentGroupChannel,
          },
        );
      } else {
        logger.warning('Channel: Updating message failed!', err);
      }
    });
  }, [currentGroupChannel.url, messagesDispatcher, onBeforeUpdateUserMessage]);
}

export default useUpdateMessageCallback;
