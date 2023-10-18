import { RefObject, useEffect } from 'react';

import { scrollIntoLast } from '../utils';
import * as channelActions from '../dux/actionTypes';
import { CustomUseReducerDispatcher } from '../../../../lib/SendbirdState';
import { PUBSUB_TOPICS } from '../../../../lib/pubSub/topics';

export interface UseSubscribePubSubHandlerParams {
  channelUrl: string;
  sdkInit: boolean;
  pubSub: any;
  dispatcher: CustomUseReducerDispatcher;
  scrollRef: RefObject<HTMLElement>;
}

export const useSubscribePubSubHandler = ({
  channelUrl,
  sdkInit,
  pubSub,
  dispatcher,
  scrollRef,
}: UseSubscribePubSubHandlerParams): void => {
  const subscriber = new Map();
  useEffect(() => {
    if (pubSub?.subscribe) {
      subscriber.set(PUBSUB_TOPICS.SEND_USER_MESSAGE, pubSub.subscribe(PUBSUB_TOPICS.SEND_USER_MESSAGE, (msg) => {
        const { channel, message } = msg;
        scrollIntoLast(0, scrollRef);
        if (channelUrl === channel?.url) {
          dispatcher({
            type: channelActions.SEND_MESSAGE_SUCESS,
            payload: message,
          });
        }
      }));
      subscriber.set(PUBSUB_TOPICS.SEND_MESSAGE_START, pubSub.subscribe(PUBSUB_TOPICS.SEND_MESSAGE_START, (msg) => {
        const { channel, message } = msg;
        if (channelUrl === channel?.url) {
          dispatcher({
            type: channelActions.SEND_MESSAGE_START,
            payload: message,
          });
        }
      }));
      subscriber.set(PUBSUB_TOPICS.ON_FILE_INFO_UPLOADED, pubSub.subscribe(
        PUBSUB_TOPICS.ON_FILE_INFO_UPLOADED,
        (payload) => {
          if (channelUrl === payload.channelUrl) {
            dispatcher({
              type: channelActions.ON_FILE_INFO_UPLOADED,
              payload,
            });
          }
        },
      ));
      subscriber.set(PUBSUB_TOPICS.SEND_MESSAGE_FAILED, pubSub.subscribe(PUBSUB_TOPICS.SEND_MESSAGE_FAILED, (msg) => {
        const { channel, message } = msg;
        if (channelUrl === channel?.url) {
          dispatcher({
            type: channelActions.SEND_MESSAGE_FAILURE,
            payload: message,
          });
        }
      }));
      subscriber.set(PUBSUB_TOPICS.SEND_FILE_MESSAGE, pubSub.subscribe(PUBSUB_TOPICS.SEND_FILE_MESSAGE, (msg) => {
        const { channel, message } = msg;
        scrollIntoLast(0, scrollRef);
        if (channelUrl === channel?.url) {
          dispatcher({
            type: channelActions.SEND_MESSAGE_SUCESS,
            payload: message,
          });
        }
      }));
      subscriber.set(PUBSUB_TOPICS.UPDATE_USER_MESSAGE, pubSub.subscribe(PUBSUB_TOPICS.UPDATE_USER_MESSAGE, (msg) => {
        const { channel, message, fromSelector } = msg;
        if (fromSelector && (channelUrl === channel?.url)) {
          dispatcher({
            type: channelActions.ON_MESSAGE_UPDATED,
            payload: { channel, message },
          });
        }
      }));
      subscriber.set(PUBSUB_TOPICS.DELETE_MESSAGE, pubSub.subscribe(PUBSUB_TOPICS.DELETE_MESSAGE, (msg) => {
        const { channel, messageId } = msg;
        if (channelUrl === channel?.url) {
          dispatcher({
            type: channelActions.ON_MESSAGE_DELETED,
            payload: messageId,
          });
        }
      }));
    }
    return () => {
      subscriber.forEach((s) => {
        try {
          s.remove();
        } catch {
          //
        }
      });
    };
  }, [
    channelUrl,
    sdkInit,
  ]);
};
