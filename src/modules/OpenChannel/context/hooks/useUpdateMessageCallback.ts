import type { UserMessageUpdateParams } from '@sendbird/chat/message';

import type { Logger } from '../../../../lib/SendbirdState';
import type { OpenChannel } from '@sendbird/chat/openChannel';
import { useCallback } from 'react';
import * as messageActionTypes from '../dux/actionTypes';

interface DynamicParams {
  currentOpenChannel: OpenChannel | null;
  onBeforeSendUserMessage?: (text: string) => UserMessageUpdateParams;
}
interface StaticParams {
  logger: Logger;
  messagesDispatcher: (props: { type: string, payload :any }) => void;
}
type CallbackReturn = (messageId: number, text: string, callback: () => void) => void;

function useUpdateMessageCallback(
  { currentOpenChannel, onBeforeSendUserMessage }: DynamicParams,
  { logger, messagesDispatcher }: StaticParams,
): CallbackReturn {
  return useCallback((messageId, text, callback) => {
    const createParamsDefault = (txt: string) => {
      return {
        message: txt,
      };
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
