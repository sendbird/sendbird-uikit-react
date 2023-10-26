import React, { RefObject, useEffect } from 'react';

import { scrollIntoLast } from '../utils';
import * as channelActions from '../dux/actionTypes';
import { PUBSUB_TOPICS } from '../../../../lib/pubSub/topics';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { SendableMessageType } from '../../../../utils';
import { FileUploadedPayload } from './useSendMultipleFilesMessage';
import { PublishingModuleType } from '../../../internalInterfaces';
import { ChannelActionTypes } from '../dux/actionTypes';

export interface UseHandlePubsubEventsParams {
  channelUrl: string;
  sdkInit: boolean;
  pubSub: any;
  dispatcher: React.Dispatch<ChannelActionTypes>;
  scrollRef: RefObject<HTMLElement>;
}

export const useHandleChannelPubsubEvents = ({
  channelUrl,
  sdkInit,
  pubSub,
  dispatcher,
  scrollRef,
}: UseHandlePubsubEventsParams): void => {
  useEffect(() => {
    const subscriber = new Map();
    if (pubSub?.subscribe) {
      subscriber.set(PUBSUB_TOPICS.SEND_USER_MESSAGE, pubSub.subscribe(PUBSUB_TOPICS.SEND_USER_MESSAGE, (props) => {
        const { channel, message } = props;
        scrollIntoLast(0, scrollRef);
        if (channelUrl === channel?.url) {
          dispatcher({
            type: channelActions.SEND_MESSAGE_SUCCESS,
            payload: message,
          });
        }
      }));
      subscriber.set(PUBSUB_TOPICS.SEND_MESSAGE_START, pubSub.subscribe(PUBSUB_TOPICS.SEND_MESSAGE_START, (props) => {
        const {
          channel,
          message,
          publishingModules,
        } = props as { channel: GroupChannel, message: SendableMessageType, publishingModules: PublishingModuleType[] };
        if (channelUrl === channel?.url
          && publishingModules.includes(PublishingModuleType.CHANNEL)
        ) {
          dispatcher({
            type: channelActions.SEND_MESSAGE_START,
            payload: message,
          });
        }
      }));
      subscriber.set(PUBSUB_TOPICS.ON_FILE_INFO_UPLOADED, pubSub.subscribe(PUBSUB_TOPICS.ON_FILE_INFO_UPLOADED, (props) => {
        const {
          response,
          publishingModules,
        } = props as { response: FileUploadedPayload, publishingModules: PublishingModuleType[] };
        if (channelUrl === response.channelUrl && publishingModules.includes(PublishingModuleType.CHANNEL)) {
          dispatcher({
            type: channelActions.ON_FILE_INFO_UPLOADED,
            payload: response,
          });
        }
      }));
      subscriber.set(PUBSUB_TOPICS.SEND_MESSAGE_FAILED, pubSub.subscribe(PUBSUB_TOPICS.SEND_MESSAGE_FAILED, (props) => {
        const {
          channel,
          message,
          publishingModules,
        } = props as { channel: GroupChannel, message: SendableMessageType, publishingModules: PublishingModuleType[] };
        if (channelUrl === channel?.url
          && publishingModules.includes(PublishingModuleType.CHANNEL)
        ) {
          dispatcher({
            type: channelActions.SEND_MESSAGE_FAILURE,
            payload: message,
          });
        }
      }));
      subscriber.set(PUBSUB_TOPICS.SEND_FILE_MESSAGE, pubSub.subscribe(PUBSUB_TOPICS.SEND_FILE_MESSAGE, (props) => {
        const { channel, message } = props;
        scrollIntoLast(0, scrollRef);
        if (channelUrl === channel?.url) {
          dispatcher({
            type: channelActions.SEND_MESSAGE_SUCCESS,
            payload: message,
          });
        }
      }));
      subscriber.set(PUBSUB_TOPICS.UPDATE_USER_MESSAGE, pubSub.subscribe(PUBSUB_TOPICS.UPDATE_USER_MESSAGE, (props) => {
        const { channel, message, fromSelector } = props;
        if (fromSelector && (channelUrl === channel?.url)) {
          dispatcher({
            type: channelActions.ON_MESSAGE_UPDATED,
            payload: { channel, message },
          });
        }
      }));
      subscriber.set(PUBSUB_TOPICS.DELETE_MESSAGE, pubSub.subscribe(PUBSUB_TOPICS.DELETE_MESSAGE, (props) => {
        const { channel, messageId } = props;
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
