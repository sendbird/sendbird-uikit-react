import { useCallback } from 'react';

import * as messageActionTypes from '../dux/actionTypes';
import * as topics from '../../../lib/pubSub/topics';

function useUpdateMessageCallback({
  currentGroupChannel,
  messagesDispatcher,
  onBeforeUpdateUserMessage,
}, {
  logger,
  pubSub,
  sdk,
}) {
  return useCallback((messageId, text, cb) => {
    const createParamsDefault = (txt) => {
      const params = new sdk.UserMessageParams();
      params.message = txt;
      return params;
    };

    const createCustomPrams = onBeforeUpdateUserMessage
      && typeof onBeforeUpdateUserMessage === 'function';

    if (createCustomPrams) {
      logger.info('Channel: creating params using onBeforeUpdateUserMessage', onBeforeUpdateUserMessage);
    }

    const params = onBeforeUpdateUserMessage
      ? onBeforeUpdateUserMessage(text)
      : createParamsDefault(text);

    currentGroupChannel.updateUserMessage(messageId, params, (r, e) => {
      logger.info('Channel: Updating message!', params);
      const swapParams = sdk.getErrorFirstCallback();
      let message = r;
      let err = e;
      if (swapParams) {
        message = e;
        err = r;
      }
      if (cb) {
        cb(err, message);
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
