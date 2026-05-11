import type { UserMessageCreateParams, UserMessageUpdateParams } from '@sendbird/chat/message';

import type { Logger } from '../../../../lib/Sendbird/types';
import type { OpenChannel } from '@sendbird/chat/openChannel';
import { useCallback } from 'react';
import * as messageActionTypes from '../dux/actionTypes';

interface DynamicParams {
  currentOpenChannel: OpenChannel | null;
  onBeforeSendUserMessage?: (
    text: string,
  ) => (
    UserMessageCreateParams
    | UserMessageUpdateParams
    | Promise<UserMessageCreateParams | UserMessageUpdateParams>
    | void
    | Promise<void>
  );
}
interface StaticParams {
  logger: Logger;
  messagesDispatcher: (props: { type: string, payload :any }) => void;
}
type CallbackReturn = (messageId: number, text: string, callback: () => void) => Promise<void>;

function useUpdateMessageCallback(
  { currentOpenChannel, onBeforeSendUserMessage }: DynamicParams,
  { logger, messagesDispatcher }: StaticParams,
): CallbackReturn {
  return useCallback(async (messageId, text, callback) => {
    const createParamsDefault = (txt: string) => {
      return {
        message: txt,
      };
    };

    if (onBeforeSendUserMessage && typeof onBeforeSendUserMessage === 'function') {
      logger.info('OpenChannel | useUpdateMessageCallback: Creating params using onBeforeUpdateUserMessage');
    }
    const customParams = await onBeforeSendUserMessage?.(text);
    const params = (customParams || createParamsDefault(text)) as UserMessageUpdateParams;
    const message = await currentOpenChannel.updateUserMessage(messageId, params);
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
  }, [currentOpenChannel, onBeforeSendUserMessage]);
}

export default useUpdateMessageCallback;
