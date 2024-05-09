import type { UserMessageCreateParams } from '@sendbird/chat/message';
import type { OpenChannel } from '@sendbird/chat/openChannel';

import React, { useCallback } from 'react';
import type { Logger } from '../../../../lib/SendbirdState';
import * as messageActionTypes from '../dux/actionTypes';
import * as utils from '../utils';
import { SdkStore } from '../../../../lib/types';
import { SendableMessage } from '@sendbird/chat/lib/__definition';

interface DynamicParams {
  currentOpenChannel: OpenChannel | null;
  onBeforeSendUserMessage?: (text: string) => UserMessageCreateParams;
  checkScrollBottom: () => boolean;
  messageInputRef: React.RefObject<HTMLInputElement>;
}
interface StaticParams {
  sdk: SdkStore['sdk'];
  logger: Logger;
  messagesDispatcher: (props: { type: string, payload: any }) => void;
  scrollRef: React.RefObject<HTMLElement>;
}

function useSendMessageCallback(
  { currentOpenChannel, onBeforeSendUserMessage, messageInputRef }: DynamicParams,
  { sdk, logger, messagesDispatcher, scrollRef }: StaticParams,
): () => void {
  return useCallback(() => {
    if (sdk) {
      const text = messageInputRef.current?.innerText;
      const createParamsDefault = (txt: string | number): UserMessageCreateParams => {
        const message = txt as string;
        const params: UserMessageCreateParams = {
          message: message,
        };
        return params;
      };
      const createCustomParams = onBeforeSendUserMessage && typeof onBeforeSendUserMessage === 'function';
      if (createCustomParams) {
        logger.info('OpenChannel | useSendMessageCallback: Creating params using onBeforeSendUserMessage', onBeforeSendUserMessage);
      }
      const params = onBeforeSendUserMessage ? onBeforeSendUserMessage(text ?? '') : createParamsDefault(text ?? '');
      logger.info('OpenChannel | useSendMessageCallback: Sending message has started', params);

      let pendingMsg: SendableMessage | undefined;
      currentOpenChannel?.sendUserMessage(params)
        .onPending((pendingMessage) => {
          messagesDispatcher({
            type: messageActionTypes.SENDING_MESSAGE_START,
            payload: {
              message: pendingMessage,
              channel: currentOpenChannel,
            },
          });
          pendingMsg = pendingMessage;

          setTimeout(() => utils.scrollIntoLast(0, scrollRef));
        })
        .onSucceeded((message) => {
          logger.info('OpenChannel | useSendMessageCallback: Sending message succeeded', message);
          messagesDispatcher({
            type: messageActionTypes.SENDING_MESSAGE_SUCCEEDED,
            payload: message,
          });
        })
        .onFailed((error) => {
          logger.warning('OpenChannel | useSendMessageCallback: Sending message failed', error);
          messagesDispatcher({
            type: messageActionTypes.SENDING_MESSAGE_FAILED,
            payload: pendingMsg,
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
  }, [currentOpenChannel, onBeforeSendUserMessage, messageInputRef]);
}

export default useSendMessageCallback;
