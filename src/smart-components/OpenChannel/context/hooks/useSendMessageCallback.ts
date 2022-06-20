import type { UserMessageCreateParams } from '@sendbird/chat/message';
import type { OpenChannel, SendbirdOpenChat } from '@sendbird/chat/openChannel';

import { useCallback } from 'react';
import type { Logger } from '../../../../lib/SendbirdState';
import * as messageActionTypes from '../dux/actionTypes';
import * as utils from '../utils';

interface DynamicParams {
  currentOpenChannel: OpenChannel;
  onBeforeSendUserMessage: (text: string) => UserMessageCreateParams;
  checkScrollBottom: () => boolean;
  messageInputRef: React.RefObject<HTMLInputElement>;
}
interface StaticParams {
  sdk: SendbirdOpenChat;
  logger: Logger;
  messagesDispatcher: ({ type: string, payload: any }) => void;
}

function useSendMessageCallback(
  { currentOpenChannel, onBeforeSendUserMessage, checkScrollBottom, messageInputRef }: DynamicParams,
  { sdk, logger, messagesDispatcher }: StaticParams,
): () => void {
  return useCallback(() => {
    if (sdk) {
      const text = messageInputRef.current.innerHTML;
      const createParamsDefault = (txt: string | number): UserMessageCreateParams => {
        const message = typeof txt === 'string' ? txt.trim() : txt.toString(10).trim();
        const params: UserMessageCreateParams = {
          message: message,
        };
        return params;
      }
      const createCustomParams = onBeforeSendUserMessage && typeof onBeforeSendUserMessage === 'function';
      if (createCustomParams) {
        logger.info('OpenChannel | useSendMessageCallback: Creating params using onBeforeSendUserMessage', onBeforeSendUserMessage);
      }
      const params = onBeforeSendUserMessage ? onBeforeSendUserMessage(text) : createParamsDefault(text);
      logger.info('OpenChannel | useSendMessageCallback: Sending message has started', params);

      const isBottom = checkScrollBottom();
      currentOpenChannel.sendUserMessage(params)
        .onPending((pendingMessage) => {
          messagesDispatcher({
            type: messageActionTypes.SENDING_MESSAGE_START,
            payload: {
              message: pendingMessage,
              channel: currentOpenChannel,
            }
          });
        })
        .onSucceeded((message) => {
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
        })
        .onFailed((error, message) => {
          logger.warning('OpenChannel | useSendMessageCallback: Sending message failed', error);
          messagesDispatcher({
            type: messageActionTypes.SENDING_MESSAGE_FAILED,
            payload: message,
          });
          // https://sendbird.com/docs/chat/v3/javascript/guides/error-codes#2-server-error-codes
          // TODO: Do we need to handle the error cases?
          // @ts-ignore
          if (error?.code === 900041) {
            messagesDispatcher({
              type: messageActionTypes.ON_USER_MUTED,
              payload: {
                channel: currentOpenChannel,
                user: sdk.currentUser,
              },
            });
          }
        });
    }
  }, [currentOpenChannel, onBeforeSendUserMessage, checkScrollBottom, messageInputRef]);
}

export default useSendMessageCallback;
