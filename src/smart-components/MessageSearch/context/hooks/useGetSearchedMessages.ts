import { useEffect } from 'react';
import type { SendbirdError } from '@sendbird/chat';
import type { GroupChannel, SendbirdGroupChat } from '@sendbird/chat/groupChannel';
import {
  AdminMessage,
  BaseMessage,
  FileMessage,
  MessageSearchOrder,
  MessageSearchQuery,
  UserMessage,
} from '@sendbird/chat/message';
import { MessageSearchQueryParams } from '@sendbird/chat/lib/__definition';

import type { Logger } from '../../../../lib/SendbirdState';
import * as messageActionTypes from '../dux/actionTypes';

interface MainProps {
  currentChannel: GroupChannel;
  channelUrl: string;
  requestString?: string;
  messageSearchQuery?: MessageSearchQuery;
  onResultLoaded?: (
    messages?: Array<BaseMessage | UserMessage | FileMessage | AdminMessage>,
    error?: SendbirdError,
  ) => void;
  retryCount: number;
}
interface ToolProps {
  sdk: SendbirdGroupChat;
  logger: Logger;
  messageSearchDispatcher: ({ type: string, payload: any }) => void;
}

function useGetSearchedMessages(
  { currentChannel, channelUrl, requestString, messageSearchQuery, onResultLoaded, retryCount }: MainProps,
  { sdk, logger, messageSearchDispatcher }: ToolProps,
): void {
  useEffect(() => {
    messageSearchDispatcher({
      type: messageActionTypes.START_MESSAGE_SEARCH,
      payload: null,
    });
    if (sdk && channelUrl && sdk.createMessageSearchQuery && currentChannel) {
      if (requestString) {
        const inputSearchMessageQueryObject: MessageSearchQueryParams = {
          ...messageSearchQuery,
          order: MessageSearchOrder.TIMESTAMP,
          channelUrl,
          messageTimestampFrom: currentChannel.invitedAt,
          keyword: requestString,
        };
        const createdQuery = sdk.createMessageSearchQuery(inputSearchMessageQueryObject);
        createdQuery.next().then((messages) => {
          logger.info('MessageSearch | useGetSearchedMessages: succeeded getting messages', messages);
          messageSearchDispatcher({
            type: messageActionTypes.GET_SEARCHED_MESSAGES,
            payload: {
              messages,
              createdQuery,
            },
          });
          if (onResultLoaded && typeof onResultLoaded === 'function') {
            onResultLoaded(messages, null);
          }
        }).catch((error) => {
          logger.warning('MessageSearch | useGetSearchedMessages: getting failed', error);
          messageSearchDispatcher({
            type: messageActionTypes.SET_QUERY_INVALID,
            payload: null,
          });
          if (onResultLoaded && typeof onResultLoaded === 'function') {
            onResultLoaded(null, error);
          }
        });
        messageSearchDispatcher({
          type: messageActionTypes.START_GETTING_SEARCHED_MESSAGES,
          payload: createdQuery,
        });
      } else {
        logger.info('MessageSearch | useGetSeasrchedMessages: search string is empty');
      }
    }
  }, [channelUrl, messageSearchQuery, requestString, currentChannel, retryCount]);
}

export default useGetSearchedMessages;
