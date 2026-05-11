import { useCallback } from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { FileMessage, FileMessageCreateParams, SendingStatus } from '@sendbird/chat/message';

import type { Logger } from '../../../../lib/Sendbird/types';
import topics, { SBUGlobalPubSub } from '../../../../lib/pubSub/topics';
import { scrollIntoLast } from '../utils';
import { SendableMessageType } from '../../../../utils';
import { PublishingModuleType } from './useSendMultipleFilesMessage';
import { SCROLL_BOTTOM_DELAY_FOR_SEND } from '../../../../utils/consts';

interface DynamicProps {
  currentChannel: GroupChannel | null;
  onBeforeSendFileMessage?: (
    file: File,
    quotedMessage?: SendableMessageType,
  ) => FileMessageCreateParams | Promise<FileMessageCreateParams> | void | Promise<void>;
  sendMessageStart: (message: SendableMessageType) => void;
  sendMessageFailure: (message: SendableMessageType) => void;
}
interface StaticProps {
  logger: Logger;
  pubSub: SBUGlobalPubSub;
}

interface LocalFileMessage extends FileMessage {
  localUrl: string;
  file: File;
}

export type SendFileMessageFunctionType = (file: File, quoteMessage?: SendableMessageType) => Promise<FileMessage>;

export default function useSendFileMessageCallback({
  currentChannel,
  onBeforeSendFileMessage,
  sendMessageStart,
  sendMessageFailure,
}: DynamicProps, {
  logger,
  pubSub,
}: StaticProps): SendFileMessageFunctionType {
  return useCallback(async (file, quoteMessage): Promise<FileMessage> => {
    const createParamsDefault = () => {
      const params = {} as FileMessageCreateParams;
      params.file = file;
      if (quoteMessage) {
        params.isReplyToChannel = true;
        params.parentMessageId = quoteMessage.messageId;
      }
      return params;
    };
    const customParams = await onBeforeSendFileMessage?.(file, quoteMessage);
    const params = customParams || createParamsDefault();

    return new Promise((resolve, reject) => {
      logger.info('Thread | useSendFileMessageCallback: Sending file message start.', params);

      if (currentChannel == null) {
        logger.warning('Thread | useSendFileMessageCallback: currentChannel is null. Skipping file message send.');
        resolve(null);
      } else {
        currentChannel.sendFileMessage(params)
          .onPending((pendingMessage) => {
          // @ts-ignore
            sendMessageStart({
              ...pendingMessage,
              url: URL.createObjectURL(file),
              // pending thumbnail message seems to be failed
              sendingStatus: SendingStatus.PENDING,
              isUserMessage: pendingMessage.isUserMessage,
              isFileMessage: pendingMessage.isFileMessage,
              isAdminMessage: pendingMessage.isAdminMessage,
              isMultipleFilesMessage: pendingMessage.isMultipleFilesMessage,
            });
            setTimeout(() => scrollIntoLast(), SCROLL_BOTTOM_DELAY_FOR_SEND);
          })
          .onFailed((error, message) => {
            (message as LocalFileMessage).localUrl = URL.createObjectURL(file);
            (message as LocalFileMessage).file = file;
            logger.info('Thread | useSendFileMessageCallback: Sending file message failed.', { message, error });
            sendMessageFailure(message as SendableMessageType);
            reject(error);
          })
          .onSucceeded((message) => {
            logger.info('Thread | useSendFileMessageCallback: Sending file message succeeded.', message);
            pubSub.publish(topics.SEND_FILE_MESSAGE, {
              channel: currentChannel,
              message: message as FileMessage,
              publishingModules: [PublishingModuleType.THREAD],
            });
            resolve(message as FileMessage);
          });
      }
    });
  },
  [
    currentChannel,
    onBeforeSendFileMessage,
    sendMessageStart,
    sendMessageFailure,
  ],
  );
}
