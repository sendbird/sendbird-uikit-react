import React, { useEffect } from 'react';
import { SendbirdGroupChat } from '@sendbird/chat/groupChannel';

import { actionTypes } from '../dux/actionTypes';
import { Logger } from '../../../../lib/SendbirdState';
import { Action } from '../dux/reducers';
import { MessageListParams } from '@sendbird/chat/message';

type DynamicParams = {
  channelUrl: string;
  sdkInit: boolean;
};

type StaticParams = {
  notificationsDispatcher: React.Dispatch<Action>;
  sdk: SendbirdGroupChat;
  logger: Logger;
};

function useInitialize({ channelUrl, sdkInit }: DynamicParams, {
  notificationsDispatcher,
  sdk,
  logger,
}: StaticParams) {
  useEffect(() => {
    if (sdkInit) {
      logger.info('NotificationChannel: Fetching channel start', { channelUrl });
      notificationsDispatcher({
        type: actionTypes.FETCH_CHANNEL_START,
        payload: {
          channelUrl,
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
        // start fetching messages
        logger.info('NotificationChannel: Fetching messages start', { channel });
        notificationsDispatcher({
          type: actionTypes.FETCH_INITIAL_MESSAGES_START,
        });

        const messageListParams: MessageListParams = {
          prevResultSize: 20,
          nextResultSize: 0,
          isInclusive: false,
          includeReactions: false,
        };

        logger.info('NotificationChannel: Fetching messages', { channel });

        channel.getMessagesByTimestamp(
          new Date().getTime(),
          messageListParams,
        ).then((messages) => {
          notificationsDispatcher({
              type: actionTypes.FETCH_INITIAL_MESSAGES_SUCCESS,
              payload: {
                channel,
                messages,
              },
            });
          })
          .catch((error) => {
            logger.error('NotificationChannel: Fetching messages failed', error);
            notificationsDispatcher({
              type: actionTypes.FETCH_INITIAL_MESSAGES_FAILURE,
              payload: { error, channel },
            });
          })
          .finally(() => {
            // if (!initialTimeStamp) {
            //   setTimeout(() => utils.scrollIntoLast(0, scrollRef));
            // }
          });
      }).catch((error) => {
        logger.error('NotificationChannel: Fetching channel fail', { error });
        notificationsDispatcher({
          type: actionTypes.FETCH_CHANNEL_FAILURE,
        });
      })
    }
  }, [channelUrl, sdkInit]);
}

export default useInitialize;
