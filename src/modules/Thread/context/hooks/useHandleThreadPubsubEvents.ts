import { useEffect } from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';

import type { Logger } from '../../../../lib/Sendbird/types';
import topics, { PUBSUB_TOPICS, SBUGlobalPubSub } from '../../../../lib/pubSub/topics';
import { scrollIntoLast } from '../utils';
import { SendableMessageType } from '../../../../utils';
import { shouldPubSubPublishToThread } from '../../../internalInterfaces';
import useThread from '../useThread';

interface DynamicProps {
  sdkInit: boolean;
  currentChannel: GroupChannel | null;
  parentMessage: SendableMessageType | null;
}
interface StaticProps {
  logger: Logger;
  pubSub: SBUGlobalPubSub;
}

export default function useHandleThreadPubsubEvents({
  sdkInit,
  currentChannel,
  parentMessage,
}: DynamicProps, {
  pubSub,
}: StaticProps): void {
  const {
    actions: {
      sendMessageStart,
      sendMessageSuccess,
      sendMessageFailure,
      onFileInfoUpdated,
      onMessageUpdated,
      onMessageDeleted,
    },
  } = useThread();

  useEffect(() => {
    const subscriber = new Map();
    if (pubSub?.subscribe) {
      // TODO: subscribe ON_FILE_INFO_UPLOADED
      subscriber.set(topics.SEND_MESSAGE_START, pubSub.subscribe(topics.SEND_MESSAGE_START, (props) => {
        const { channel, message, publishingModules } = props;
        if (currentChannel?.url === channel?.url && message?.parentMessageId === parentMessage?.messageId && shouldPubSubPublishToThread(publishingModules)) {
          // TODO: const clonedMessage = cloneMessage(message);
          const pendingMessage: Record<string, any> = { ...message };
          if (message.isMultipleFilesMessage()) {
            pendingMessage.fileInfoList = message?.messageParams?.fileInfoList.map((fileInfo) => ({
              ...fileInfo,
              url: URL.createObjectURL(fileInfo.file as File),
            })) ?? [];
          }
          sendMessageStart(message);
        }
        scrollIntoLast?.();
      }));
      subscriber.set(PUBSUB_TOPICS.ON_FILE_INFO_UPLOADED, pubSub.subscribe(PUBSUB_TOPICS.ON_FILE_INFO_UPLOADED, (props) => {
        const { response, publishingModules } = props;
        if (currentChannel?.url === response.channelUrl && shouldPubSubPublishToThread(publishingModules)) {
          onFileInfoUpdated(response);
        }
      }));
      subscriber.set(topics.SEND_USER_MESSAGE, pubSub.subscribe(topics.SEND_USER_MESSAGE, (props) => {
        const {
          channel,
          message,
        } = props as { channel: GroupChannel, message: SendableMessageType };
        if (currentChannel?.url === channel?.url
          && message?.parentMessageId === parentMessage?.messageId
        ) {
          sendMessageSuccess(message);
        }
        scrollIntoLast?.();
      }));
      subscriber.set(topics.SEND_MESSAGE_FAILED, pubSub.subscribe(topics.SEND_MESSAGE_FAILED, (props) => {
        const { channel, message, publishingModules } = props;
        if (currentChannel?.url === channel?.url && message?.parentMessageId === parentMessage?.messageId && shouldPubSubPublishToThread(publishingModules)) {
          sendMessageFailure(message);
        }
      }));
      subscriber.set(topics.SEND_FILE_MESSAGE, pubSub.subscribe(topics.SEND_FILE_MESSAGE, (props) => {
        const { channel, message, publishingModules } = props;
        if (currentChannel?.url === channel?.url && shouldPubSubPublishToThread(publishingModules)) {
          sendMessageSuccess(message);
        }
        scrollIntoLast?.();
      }));
      subscriber.set(topics.UPDATE_USER_MESSAGE, pubSub.subscribe(topics.UPDATE_USER_MESSAGE, (props) => {
        const {
          channel,
          message,
        } = props as { channel: GroupChannel, message: SendableMessageType };
        if (currentChannel?.url === channel?.url) {
          onMessageUpdated(channel, message);
        }
      }));
      subscriber.set(topics.DELETE_MESSAGE, pubSub.subscribe(topics.DELETE_MESSAGE, (props) => {
        const { channel, messageId } = props as { channel: GroupChannel, messageId: number };
        onMessageDeleted(channel, messageId);
      }));
    }
    return () => {
      subscriber?.forEach((s) => {
        try {
          s?.remove();
        } catch {
          //
        }
      });
    };
  }, [sdkInit, currentChannel, parentMessage?.messageId]);
}
