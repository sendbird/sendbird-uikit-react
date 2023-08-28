import { useEffect } from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { CustomUseReducerDispatcher, Logger } from '../../../../lib/SendbirdState';
import topics from '../../../../lib/pubSub/topics';
import { scrollIntoLast } from '../utils';
import { ThreadContextActionTypes } from '../dux/actionTypes';
import {SendableMessageType} from "../../../../utils";

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

export default function useHandlePubsubEvents({
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
      subscriber.set(topics.SEND_USER_MESSAGE, pubSub.subscribe(topics.SEND_USER_MESSAGE, (props) => {
        const { channel, message } = props;
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
        const { channel, message } = props;
        if (currentChannel?.url === channel?.url
          && message?.parentMessageId === parentMessage?.messageId
        ) {
          threadDispatcher({
            type: ThreadContextActionTypes.SEND_MESSAGE_FAILURE,
            payload: { message },
          });
        }
      }));
      subscriber.set(topics.SEND_FILE_MESSAGE, pubSub.subscribe(topics.SEND_FILE_MESSAGE, (props) => {
        const { channel, message } = props;
        if (currentChannel?.url === channel?.url) {
          threadDispatcher({
            type: ThreadContextActionTypes.SEND_MESSAGE_SUCESS,
            payload: { message },
          });
        }
        scrollIntoLast?.();
      }));
      subscriber.set(topics.UPDATE_USER_MESSAGE, pubSub.subscribe(topics.UPDATE_USER_MESSAGE, (msg) => {
        const { channel, message } = msg;
        if (currentChannel?.url === channel?.url) {
          threadDispatcher({
            type: ThreadContextActionTypes.ON_MESSAGE_UPDATED,
            payload: { channel, message },
          });
        }
      }));
      subscriber.set(topics.DELETE_MESSAGE, pubSub.subscribe(topics.DELETE_MESSAGE, (msg) => {
        const { channel, messageId } = msg;
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
  }, [sdkInit, currentChannel]);
}
