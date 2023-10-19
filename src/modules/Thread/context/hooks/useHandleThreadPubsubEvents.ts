import { useEffect } from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { CustomUseReducerDispatcher, Logger } from '../../../../lib/SendbirdState';
import topics from '../../../../lib/pubSub/topics';
import { scrollIntoLast } from '../utils';
import { ThreadContextActionTypes } from '../dux/actionTypes';
import { SendableMessageType } from '../../../../utils';
import { PublishingModuleType } from './useSendMultipleFilesMessage';

interface DynamicProps {
  sdkInit: boolean;
  currentChannel: GroupChannel;
  parentMessage: SendableMessageType
}
interface StaticProps {
  logger: Logger;
  pubSub: any;
  threadDispatcher: CustomUseReducerDispatcher;
}

export default function useHandleThreadPubsubEvents({
  sdkInit,
  currentChannel,
  parentMessage,
}: DynamicProps, {
  pubSub,
  threadDispatcher,
}: StaticProps): void {
  useEffect(() => {
    const pubSubHandler = (): Map<any, any> => {
      const subscriber = new Map();
      if (!pubSub || !pubSub.subscribe) {
        return subscriber;
      }
      // TODO: subscribe ON_FILE_INFO_UPLOADED
      subscriber.set(topics.SEND_MESSAGE_START, pubSub.subscribe(topics.SEND_MESSAGE_START, (props) => {
        const {
          channel,
          message,
          publishingModules,
        } = props as { channel: GroupChannel, message: SendableMessageType, publishingModules: PublishingModuleType[] };
        if (currentChannel?.url === channel?.url
          && message?.parentMessageId === parentMessage?.messageId
          && publishingModules.includes(PublishingModuleType.THREAD)
        ) {
          // TODO: const clonedMessage = cloneMessage(message);
          const nextMessage: Record<string, any> = { ...message };
          if (message.isMultipleFilesMessage()) {
            nextMessage.fileInfoList = message.messageParams.fileInfoList.map((fileInfo) => ({
              ...fileInfo,
              url: URL.createObjectURL(fileInfo.file as File),
            }));
          }
          threadDispatcher({
            type: ThreadContextActionTypes.SEND_MESSAGE_START,
            payload: {
              message: nextMessage,
            },
          });
        }
        scrollIntoLast?.();
      }));
      subscriber.set(topics.SEND_USER_MESSAGE, pubSub.subscribe(topics.SEND_USER_MESSAGE, (props) => {
        const {
          channel,
          message,
        } = props as { channel: GroupChannel, message: SendableMessageType };
        if (currentChannel?.url === channel?.url
          && message?.parentMessageId === parentMessage?.messageId
        ) {
          threadDispatcher({
            type: ThreadContextActionTypes.SEND_MESSAGE_SUCESS,
            payload: { message },
          });
        }
        scrollIntoLast?.();
      }));
      subscriber.set(topics.SEND_MESSAGE_FAILED, pubSub.subscribe(topics.SEND_MESSAGE_FAILED, (props) => {
        const {
          channel,
          message,
          publishingModules,
        } = props as { channel: GroupChannel, message: SendableMessageType, publishingModules: PublishingModuleType[] };
        if (currentChannel?.url === channel?.url
          && message?.parentMessageId === parentMessage?.messageId
          && publishingModules.includes(PublishingModuleType.THREAD)
        ) {
          threadDispatcher({
            type: ThreadContextActionTypes.SEND_MESSAGE_FAILURE,
            payload: { message },
          });
        }
      }));
      subscriber.set(topics.SEND_FILE_MESSAGE, pubSub.subscribe(topics.SEND_FILE_MESSAGE, (props) => {
        const {
          channel,
          message,
          publishingModules,
        } = props as { channel: GroupChannel, message: SendableMessageType, publishingModules: PublishingModuleType[] };
        if (currentChannel?.url === channel?.url
          && publishingModules.includes(PublishingModuleType.THREAD)
        ) {
          threadDispatcher({
            type: ThreadContextActionTypes.SEND_MESSAGE_SUCESS,
            payload: { message },
          });
        }
        scrollIntoLast?.();
      }));
      subscriber.set(topics.UPDATE_USER_MESSAGE, pubSub.subscribe(topics.UPDATE_USER_MESSAGE, (props) => {
        const {
          channel,
          message,
        } = props as { channel: GroupChannel, message: SendableMessageType };
        if (currentChannel?.url === channel?.url) {
          threadDispatcher({
            type: ThreadContextActionTypes.ON_MESSAGE_UPDATED,
            payload: { channel, message },
          });
        }
      }));
      subscriber.set(topics.DELETE_MESSAGE, pubSub.subscribe(topics.DELETE_MESSAGE, (props) => {
        const { channel, messageId } = props as { channel: GroupChannel, messageId: number };
        if (currentChannel?.url === channel?.url) {
          threadDispatcher({
            type: ThreadContextActionTypes.ON_MESSAGE_DELETED,
            payload: { messageId },
          });
        }
      }));
    };
    const subscriber = pubSubHandler();
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
