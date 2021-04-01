import Sendbird from 'sendbird';
import { useCallback } from 'react';
import * as messageActionTypes from '../dux/actionTypes';

interface MainProps {
  currentOpenChannel: SendbirdUIKit.OpenChannelType;
  onBeforeSendUserMessage?: (text) => Sendbird.UserMessageParams;
}
interface ToolProps {
  sdk: SendbirdUIKit.Sdk;
  logger: SendbirdUIKit.Logger;
  messagesDispatcher: ({ type: string, payload :any }) => void;
}
type CallbackReturn = (messageId, text, callback) => void;

function useUpdateMessageCallback(
  { currentOpenChannel, onBeforeSendUserMessage }: MainProps,
  { sdk, logger, messagesDispatcher }: ToolProps,
): CallbackReturn {
  return useCallback((messageId, text, callback) => {
    const createParamsDefault = (txt) => {
      const params = new sdk.UserMessageParams();
      params.message = txt;
      return params;
    };

    if (onBeforeSendUserMessage && typeof onBeforeSendUserMessage === 'function') {
      logger.info('OpenChannel | useUpdateMessageCallback: Creating params using onBeforeUpdateUserMessage');
    }
    const params = onBeforeSendUserMessage ? onBeforeSendUserMessage(text) : createParamsDefault(text);
    currentOpenChannel.updateUserMessage(messageId, params, (message, error) => {
      if (callback) {
        callback();
      }
      if (!error) {
        logger.info('OpenChannel | useUpdateMessageCallback: Updating message succeeded', { message, params });
        messagesDispatcher({
          type: messageActionTypes.ON_MESSAGE_UPDATED,
          payload: {
            channel: currentOpenChannel,
            message,
          },
        });
      } else {
        logger.warning('OpenChannel | useUpdateMessageCallback: Updating message failed', error);
      }
    });
  }, [currentOpenChannel, onBeforeSendUserMessage]);
}

export default useUpdateMessageCallback;
