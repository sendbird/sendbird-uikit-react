import { useCallback } from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { FileMessage, FileMessageCreateParams } from '@sendbird/chat/message';

import { CustomUseReducerDispatcher, Logger } from '../../../../lib/SendbirdState';
import { ThreadContextActionTypes } from '../dux/actionTypes';
import topics, { SBUGlobalPubSub } from '../../../../lib/pubSub/topics';
import { scrollIntoLast } from '../utils';
import { SendableMessageType } from '../../../../utils';
import { PublishingModuleType } from './useSendMultipleFilesMessage';
import { SCROLL_BOTTOM_DELAY_FOR_SEND } from '../../../../utils/consts';
import { SBUEventHandlers } from '../../../../lib/types';

interface DynamicProps {
  currentChannel: GroupChannel;
  onBeforeSendFileMessage?: (file: File, quotedMessage?: SendableMessageType) => FileMessageCreateParams;
}
interface StaticProps {
  logger: Logger;
  pubSub: SBUGlobalPubSub;
  threadDispatcher: CustomUseReducerDispatcher;
  eventHandlers?: SBUEventHandlers
}

interface LocalFileMessage extends FileMessage {
  localUrl: string;
  file: File;
}

export type SendFileMessageFunctionType = (file: File, quoteMessage?: SendableMessageType) => Promise<FileMessage>;

export default function useSendFileMessageCallback({
  currentChannel,
  onBeforeSendFileMessage,
}: DynamicProps, {
  logger,
  eventHandlers,
  pubSub,
  threadDispatcher,
}: StaticProps): SendFileMessageFunctionType {
  const sendMessage = useCallback((file, quoteMessage): Promise<FileMessage> => {
    return new Promise((resolve, reject) => {
      const createParamsDefault = () => {
        const params = {} as FileMessageCreateParams;
        params.file = file;
        if (quoteMessage) {
          params.isReplyToChannel = true;
          params.parentMessageId = quoteMessage.messageId;
        }
        return params;
      };
      const params = onBeforeSendFileMessage?.(file, quoteMessage) ?? createParamsDefault();
      logger.info('Thread | useSendFileMessageCallback: Sending file message start.', params);

      currentChannel?.sendFileMessage(params)
        .onPending((pendingMessage) => {
          threadDispatcher({
            type: ThreadContextActionTypes.SEND_MESSAGE_START,
            payload: {
              /* pubSub is used instead of messagesDispatcher
              to avoid redundantly calling `messageActionTypes.SEND_MESSAGE_START` */
              // TODO: remove data pollution
              message: {
                ...pendingMessage,
                url: URL.createObjectURL(file),
                // pending thumbnail message seems to be failed
                requestState: 'pending',
                isUserMessage: pendingMessage.isUserMessage,
                isFileMessage: pendingMessage.isFileMessage,
                isAdminMessage: pendingMessage.isAdminMessage,
                isMultipleFilesMessage: pendingMessage.isMultipleFilesMessage,
              },
            },
          });
          setTimeout(() => scrollIntoLast(), SCROLL_BOTTOM_DELAY_FOR_SEND);
        })
        .onFailed((error, message) => {
          (message as LocalFileMessage).localUrl = URL.createObjectURL(file);
          (message as LocalFileMessage).file = file;
          logger.info('Thread | useSendFileMessageCallback: Sending file message failed.', { message, error });
          eventHandlers?.request?.onFailed?.(error);
          threadDispatcher({
            type: ThreadContextActionTypes.SEND_MESSAGE_FAILURE,
            payload: { message, error },
          });
          reject(error);
        })
        .onSucceeded((message: FileMessage) => {
          logger.info('Thread | useSendFileMessageCallback: Sending file message succeeded.', message);
          pubSub.publish(topics.SEND_FILE_MESSAGE, {
            channel: currentChannel,
            message: message,
            publishingModules: [PublishingModuleType.THREAD],
          });
          resolve(message);
        });
    });
  }, [currentChannel]);
  return sendMessage;
}
