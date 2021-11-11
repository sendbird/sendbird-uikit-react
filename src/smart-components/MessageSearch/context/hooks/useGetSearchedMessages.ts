import { useEffect } from 'react';
import * as messageActionTypes from '../dux/actionTypes';
import SendbirdUIKit from '../../../index';
import SendBird from 'sendbird';

interface MainProps {
  currentChannel: SendbirdUIKit.GroupChannelType;
  channelUrl: string;
  requestString?: string;
  messageSearchQuery?: SendbirdUIKit.MessageSearchQueryType;
  onResultLoaded?: (
    messages?: Array<SendBird.UserMessage | SendBird.FileMessage | SendBird.AdminMessage>,
    error?: SendbirdUIKit.SendbirdError,
  ) => void;
  retryCount: number;
}
interface ToolProps {
  sdk: SendbirdUIKit.Sdk;
  logger: SendbirdUIKit.Logger;
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
        const inputSearchMessageQueryObject = {
          ...messageSearchQuery,
          order: 'ts' as const,
          channelUrl,
          messageTimestampFrom: currentChannel.invitedAt,
        };
        const createdQuery = sdk.createMessageSearchQuery(requestString, inputSearchMessageQueryObject);
        createdQuery.next((messages, error) => {
          if (!error) {
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
          } else {
            logger.warning('MessageSearch | useGetSearchedMessages: getting failed', error);
            messageSearchDispatcher({
              type: messageActionTypes.SET_QUERY_INVALID,
              payload: null,
            });
            if (onResultLoaded && typeof onResultLoaded === 'function') {
              onResultLoaded(null, error);
            }
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
