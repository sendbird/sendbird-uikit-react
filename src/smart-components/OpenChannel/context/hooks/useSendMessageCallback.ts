import Sendbird from 'sendbird';
import { useCallback } from 'react';
import * as messageActionTypes from '../dux/actionTypes';
import * as utils from '../utils';

interface DynamicParams {
  currentOpenChannel: SendbirdUIKit.OpenChannelType;
  onBeforeSendUserMessage: (text: string) => Sendbird.UserMessageParams;
  checkScrollBottom: () => boolean;
}
interface StaticParams {
  sdk: SendbirdUIKit.Sdk;
  logger: SendbirdUIKit.Logger;
  messagesDispatcher: ({ type: string, payload: any }) => void;
}

function useSendMessageCallback(
  { currentOpenChannel, onBeforeSendUserMessage, checkScrollBottom }: DynamicParams,
  { sdk, logger, messagesDispatcher }: StaticParams,
): (props: { message: string }) => void {
  return useCallback((props) => {
    const text = props?.message || '';
    if (sdk && sdk.UserMessageParams) {
      const createParamsDefault = (txt: string | number): Sendbird.UserMessageParams => {
        const message = typeof txt === 'string' ? txt.trim() : txt.toString(10).trim();
        const params = new sdk.UserMessageParams();
        params.message = message;
        return params;
      }
      const createCustomParams = onBeforeSendUserMessage && typeof onBeforeSendUserMessage === 'function';
      if (createCustomParams) {
        logger.info('OpenChannel | useSendMessageCallback: Creating params using onBeforeSendUserMessage', onBeforeSendUserMessage);
      }
      const params = onBeforeSendUserMessage ? onBeforeSendUserMessage(text) : createParamsDefault(text);
      logger.info('OpenChannel | useSendMessageCallback: Sending message has started', params);

      const isBottom = checkScrollBottom();
      const pendingMessage = currentOpenChannel.sendUserMessage(params, (message, error) => {
        if (!error) {
          logger.info('OpenChannel | useSendMessageCallback: Sending message succeeded', message);
          messagesDispatcher({
            type: messageActionTypes.SENDING_MESSAGE_SUCCEEDED,
            payload: message,
          });
          if (isBottom) {
            setTimeout(() => {
              utils.scrollIntoLast();
            });
          }
        } else {
          logger.warning('OpenChannel | useSendMessageCallback: Sending message failed', error);
          messagesDispatcher({
            type: messageActionTypes.SENDING_MESSAGE_FAILED,
            payload: message,
          });
          // https://sendbird.com/docs/chat/v3/javascript/guides/error-codes#2-server-error-codes
          // TODO: Do we need to handle the error cases?
          if (error?.code === 900041) {
            messagesDispatcher({
              type: messageActionTypes.ON_USER_MUTED,
              payload: {
                channel: currentOpenChannel,
                user: sdk.currentUser,
              },
            });
          }
        }
      });
      messagesDispatcher({
        type: messageActionTypes.SENDING_MESSAGE_START,
        payload: {
          message: pendingMessage,
          channel: currentOpenChannel,
        }
      });
    }
  }, [currentOpenChannel, onBeforeSendUserMessage, checkScrollBottom]);
}

export default useSendMessageCallback;
