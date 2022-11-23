import type { UserMessageUpdateParams } from '@sendbird/chat/message';

import type { Logger } from '../../../../lib/SendbirdState';
import type { OpenChannel } from '@sendbird/chat/openChannel';
import { useCallback } from 'react';
import * as messageActionTypes from '../dux/actionTypes';

interface DynamicParams {
  currentOpenChannel: OpenChannel;
  onBeforeSendUserMessage?: (text) => UserMessageUpdateParams;
}
interface StaticParams {
  logger: Logger;
  messagesDispatcher: (props: { type: string, payload :any }) => void;
}
type CallbackReturn = (messageId, text, callback) => void;

function useUpdateMessageCallback(
  { currentOpenChannel, onBeforeSendUserMessage }: DynamicParams,
  { logger, messagesDispatcher }: StaticParams,
): CallbackReturn {
  return useCallback((messageId, text, callback) => {
    const createParamsDefault = (txt) => {
      const params = {
        message: txt,
      };
      return params;
    };

    if (onBeforeSendUserMessage && typeof onBeforeSendUserMessage === 'function') {
      logger.info('OpenChannel | useUpdateMessageCallback: Creating params using onBeforeUpdateUserMessage');
    }
    const params = onBeforeSendUserMessage ? onBeforeSendUserMessage(text) : createParamsDefault(text);
    currentOpenChannel.updateUserMessage(messageId, params)
      .then((message) => {
        if (callback) {
          callback();
        }
        logger.info('OpenChannel | useUpdateMessageCallback: Updating message succeeded', { message, params });
        messagesDispatcher({
          type: messageActionTypes.ON_MESSAGE_UPDATED,
          payload: {
            channel: currentOpenChannel,
            message,
          },
        });
      });
  }, [currentOpenChannel, onBeforeSendUserMessage]);
}

export default useUpdateMessageCallback;
