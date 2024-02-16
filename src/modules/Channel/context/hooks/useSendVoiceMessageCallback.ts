import React, { useCallback } from 'react';
import type { FileMessage, FileMessageCreateParams } from '@sendbird/chat/message';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import { MessageMetaArray } from '@sendbird/chat/message';

import type { Logger } from '../../../../lib/SendbirdState';
import * as messageActionTypes from '../dux/actionTypes';
import * as utils from '../utils';
import topics, { SBUGlobalPubSub } from '../../../../lib/pubSub/topics';
import {
  META_ARRAY_MESSAGE_TYPE_KEY,
  META_ARRAY_MESSAGE_TYPE_VALUE__VOICE,
  META_ARRAY_VOICE_DURATION_KEY,
  SCROLL_BOTTOM_DELAY_FOR_SEND,
  VOICE_MESSAGE_FILE_NAME,
  VOICE_MESSAGE_MIME_TYPE,
} from '../../../../utils/consts';
import type { SendableMessageType } from '../../../../utils';
import type { Nullable } from '../../../../types';
import { PublishingModuleType } from '../../../internalInterfaces';
import { ChannelActionTypes } from '../dux/actionTypes';

interface DynamicParams {
  currentGroupChannel: Nullable<GroupChannel>;
  onBeforeSendVoiceMessage?: (file: File, quoteMessage?: SendableMessageType) => FileMessageCreateParams;
}
interface StaticParams {
  logger: Logger;
  pubSub: SBUGlobalPubSub;
  scrollRef: React.RefObject<HTMLDivElement>;
  messagesDispatcher: React.Dispatch<ChannelActionTypes>;
}
type FuncType = (file: File, duration: number, quoteMessage: SendableMessageType) => Promise<FileMessage>;

export const useSendVoiceMessageCallback = ({
  currentGroupChannel,
  onBeforeSendVoiceMessage,
}: DynamicParams,
{
  logger,
  pubSub,
  scrollRef,
  messagesDispatcher,
}: StaticParams): Array<FuncType> => {
  const sendMessage = useCallback((file: File, duration: number, quoteMessage: SendableMessageType): Promise<FileMessage> => new Promise((resolve, reject) => {
    if (!currentGroupChannel) {
      return;
    }
    const messageParams: FileMessageCreateParams = (
      onBeforeSendVoiceMessage
      && typeof onBeforeSendVoiceMessage === 'function'
    )
      ? onBeforeSendVoiceMessage(file, quoteMessage)
      : {
        file,
        fileName: VOICE_MESSAGE_FILE_NAME,
        mimeType: VOICE_MESSAGE_MIME_TYPE,
        metaArrays: [
          new MessageMetaArray({
            key: META_ARRAY_VOICE_DURATION_KEY,
            value: [`${duration}`],
          }),
          new MessageMetaArray({
            key: META_ARRAY_MESSAGE_TYPE_KEY,
            value: [META_ARRAY_MESSAGE_TYPE_VALUE__VOICE],
          }),
        ],
      };
    if (quoteMessage) {
      messageParams.isReplyToChannel = true;
      messageParams.parentMessageId = quoteMessage.messageId;
    }
    logger.info('Channel: Start sending voice message', messageParams);
    currentGroupChannel.sendFileMessage(messageParams)
      .onPending((pendingMessage) => {
        pubSub.publish(topics.SEND_MESSAGE_START, {
          /* pubSub is used instead of messagesDispatcher
            to avoid redundantly calling `messageActionTypes.SEND_MESSAGE_START` */
          message: pendingMessage as FileMessage,
          channel: currentGroupChannel,
          publishingModules: [PublishingModuleType.CHANNEL],
        });
        setTimeout(() => utils.scrollIntoLast(0, scrollRef), SCROLL_BOTTOM_DELAY_FOR_SEND);
      })
      .onFailed((err, failedMessage) => {
        logger.error('Channel: Sending voice message failed!', { failedMessage, err });
        messagesDispatcher({
          type: messageActionTypes.SEND_MESSAGE_FAILURE,
          payload: failedMessage as SendableMessageType,
        });
        reject(err);
      })
      .onSucceeded((succeededMessage: FileMessage) => {
        logger.info('Channel: Sending voice message success!', succeededMessage);
        messagesDispatcher({
          type: messageActionTypes.SEND_MESSAGE_SUCCESS,
          payload: succeededMessage as SendableMessageType,
        });
        resolve(succeededMessage);
      });
  }), [
    currentGroupChannel,
    onBeforeSendVoiceMessage,
  ]);
  return [sendMessage];
};

export default useSendVoiceMessageCallback;
