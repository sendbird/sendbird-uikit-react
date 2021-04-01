import { useEffect } from 'react';

import * as utils from '../utils';
import * as messageActionTypes from '../dux/actionTypes';
import { uuidv4 } from '../../../utils/uuid';

export default function useSetReadStatus({ allMessages, currentGroupChannel }, {
  messagesDispatcher,
  sdk,
  logger,
}) {
  useEffect(() => {
    if (!sdk.ChannelHandler || !currentGroupChannel.url) {
      return () => {};
    }
    // todo: move to reducer?
    const setReadStatus = () => {
      const allReadStatus = allMessages.reduce((accumulator, msg) => {
        if (msg.messageId !== 0) {
          return {
            ...accumulator,
            [msg.messageId]: utils.getParsedStatus(msg, currentGroupChannel),
          };
        }
        return accumulator;
      }, {});
      messagesDispatcher({
        type: messageActionTypes.SET_READ_STATUS,
        payload: allReadStatus,
      });
    };
    if (allMessages.length > 0) {
      setReadStatus();
    }

    const channelUrl = currentGroupChannel.url;
    const handler = new sdk.ChannelHandler();
    const handleMessageStatus = (c) => {
      if (channelUrl === c.url) {
        setReadStatus();
      }
    };
    handler.onDeliveryReceiptUpdated = handleMessageStatus;
    handler.onReadReceiptUpdated = handleMessageStatus;
    // Add this channel event handler to the SendBird object.
    const handlerId = uuidv4();
    logger.info('Channel | useSetReadStatus: Removing message reciver handler', handlerId);
    sdk.addChannelHandler(handlerId, handler);
    return () => {
      if (sdk && sdk.removeChannelHandler) {
        logger.info('Channel | useSetReadStatus: Removing message reciver handler', handlerId);
        sdk.removeChannelHandler(handlerId);
      }
    };
  }, [allMessages, currentGroupChannel]);
}
