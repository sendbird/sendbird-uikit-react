import React, { useCallback } from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';

import { actionTypes } from '../dux/actionTypes';
import { Logger } from '../../../../lib/SendbirdState';
import { Action } from '../dux/reducers';
import { BaseMessage, MessageListParams } from '@sendbird/chat/message';

type DynamicParams = {
  channel: GroupChannel;
  sdkInit: boolean;
  oldestMessageTimeStamp: number;
};

type StaticParams = {
  messageListParams: MessageListParams;
  notificationsDispatcher: React.Dispatch<Action>;
  logger: Logger;
};

export type NotificationFetchMoreCb = (value: [BaseMessage[] | null, Error | null]) => void;

function useFetchMore({ channel, sdkInit, oldestMessageTimeStamp }: DynamicParams, {
  logger,
  notificationsDispatcher,
  messageListParams,
}: StaticParams): (cb: NotificationFetchMoreCb) => void {
  return useCallback((cb) => {
    logger.info('NotificationChannel: Fetching messages', { channel, messageListParams });

    channel.getMessagesByTimestamp(
      oldestMessageTimeStamp || new Date().getTime(),
      messageListParams,
    )
      .then((messages) => {
        logger.info('NotificationChannel: Fetching messages success', messages);
        notificationsDispatcher({
          type: actionTypes.FETCH_PREV_MESSAGES_SUCCESS,
          payload: { channel, messages },
        });
        cb([messages, null]);
      })
      .catch((error) => {
        logger.error('NotificationChannel: Fetching messages failed', error);
        notificationsDispatcher({
          type: actionTypes.FETCH_PREV_MESSAGES_FAILURE,
          payload: { channel },
        });
        cb([null, error]);
      });
  }, [channel, oldestMessageTimeStamp, sdkInit]);
}

export default useFetchMore;
