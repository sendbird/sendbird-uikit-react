import { useEffect } from 'react';
import * as messageActionTypes from '../dux/actionTypes';
import SendbirdUIKit from '../../../index';
import SendBird from 'sendbird';

interface MainProps {
  currentChannel: SendbirdUIKit.GroupChannelType;
  channelUrl: string;
  searchString?: string;
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
  messageSearchDispathcer: ({ type: string, payload: any }) => void;
}

function useGetSearchedMessages(
  { currentChannel, channelUrl, searchString, messageSearchQuery, onResultLoaded, retryCount }: MainProps,
  { sdk, logger, messageSearchDispathcer }: ToolProps,
): void {
  useEffect(() => {
    messageSearchDispathcer({
      type: messageActionTypes.START_MESSAGE_SEARCH,
      payload: null,
    });
    if (sdk && channelUrl && sdk.createMessageSearchQuery && currentChannel) {
      if (searchString) {
        const inputSearchMessageQueryObject = {
          ...messageSearchQuery,
          channelUrl,
          messageTimestampFrom: currentChannel.invitedAt,
        };
        const createdQuery = sdk.createMessageSearchQuery(searchString, inputSearchMessageQueryObject);
        createdQuery.next((messages, error) => {
          if (!error) {
            logger.info('MessageSearch | useGetSearchedMessages: succeeded getting messages', messages);
            messageSearchDispathcer({
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
            messageSearchDispathcer({
              type: messageActionTypes.SET_QUERY_INVALID,
              payload: null,
            });
            if (onResultLoaded && typeof onResultLoaded === 'function') {
              onResultLoaded(null, error);
            }
          }
        });
        messageSearchDispathcer({
          type: messageActionTypes.START_GETTING_SEARCHED_MESSAGES,
          payload: createdQuery,
        });
      } else {
        logger.info('MessageSearch | useGetSeasrchedMessages: search string is empty');
      }
    }
  }, [channelUrl, messageSearchQuery, searchString, currentChannel, retryCount]);
}

export default useGetSearchedMessages;
