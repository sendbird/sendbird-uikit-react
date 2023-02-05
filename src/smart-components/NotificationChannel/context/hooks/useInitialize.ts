import React, { useEffect } from 'react';
import { SendbirdGroupChat } from '@sendbird/chat/groupChannel';

import { actionTypes } from '../dux/actionTypes';
import { Logger } from '../../../../lib/SendbirdState';
import { Action } from '../dux/reducers';
import { MessageListParams } from '@sendbird/chat/message';
import { MAX_MESSAGE_COUNT } from '../consts';

type DynamicParams = {
  channelUrl: string;
  sdkInit: boolean;
  messageListParams?: MessageListParams;
};

type StaticParams = {
  notificationsDispatcher: React.Dispatch<Action>;
  sdk: SendbirdGroupChat;
  logger: Logger;
};

function useInitialize({
  channelUrl,
  sdkInit,
  messageListParams,
}: DynamicParams, {
  notificationsDispatcher,
  sdk,
  logger,
}: StaticParams) {
  useEffect(() => {
    if (sdkInit) {
      const messageListParams_: MessageListParams = {
        nextResultSize: 0,
        prevResultSize: MAX_MESSAGE_COUNT,
        reverse: true,
        isInclusive: false,
        includeReactions: false,
        ...messageListParams,
      };

      logger.info('NotificationChannel: Fetching channel start', { channelUrl, messageListParams_ });
      notificationsDispatcher({
        type: actionTypes.FETCH_CHANNEL_START,
        payload: {
          channelUrl,
          messageListParams: messageListParams_,
        },
      });
      sdk?.groupChannel.getChannel(channelUrl).then((channel) => {
        logger.info('NotificationChannel: Fetching channel success', { channel });
        notificationsDispatcher({
          type: actionTypes.FETCH_CHANNEL_SUCCESS,
          payload: {
            channel,
          },
        });
        notificationsDispatcher({
          type: actionTypes.SET_LAST_SEEN,
          payload: {
            lastSeen: channel?.myLastRead,
          },
        });
        // start fetching messages
        logger.info('NotificationChannel: Fetching messages start', { channel });
        notificationsDispatcher({
          type: actionTypes.FETCH_INITIAL_MESSAGES_START,
        });

        logger.info('NotificationChannel: Fetching messages', { channel });

        channel.getMessagesByTimestamp(
          new Date().getTime(),
          messageListParams_,
        ).then((messages) => {
          notificationsDispatcher({
            type: actionTypes.FETCH_INITIAL_MESSAGES_SUCCESS,
            payload: {
              channel,
              messages,
            },
          });
          channel?.markAsRead();
        })
        .catch((error) => {
          logger.error('NotificationChannel: Fetching messages failed', error);
          notificationsDispatcher({
            type: actionTypes.FETCH_INITIAL_MESSAGES_FAILURE,
            payload: { error, channel },
          });
        });
      }).catch((error) => {
        logger.error('NotificationChannel: Fetching channel fail', { error });
        notificationsDispatcher({
          type: actionTypes.FETCH_CHANNEL_FAILURE,
        });
      })
    }
  }, [channelUrl, sdkInit, messageListParams]);
}

export default useInitialize;
