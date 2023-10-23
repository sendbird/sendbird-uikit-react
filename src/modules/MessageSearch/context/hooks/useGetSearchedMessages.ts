import { useEffect } from 'react';

import type { GroupChannel } from '@sendbird/chat/groupChannel';
import type { MessageSearchQueryParams } from '@sendbird/chat/lib/__definition';

import type { SendbirdError } from '@sendbird/chat';

import type { Logger } from '../../../../lib/SendbirdState';
import * as messageActionTypes from '../dux/actionTypes';
import { CoreMessageType } from '../../../../utils';
import { SdkStore } from '../../../../lib/types';

enum MessageSearchOrder {
  SCORE = 'score',
  TIMESTAMP = 'ts',
}

interface MainProps {
  currentChannel: GroupChannel;
  channelUrl: string;
  requestString?: string;
  messageSearchQuery?: MessageSearchQueryParams;
  onResultLoaded?: (
    messages?: Array<CoreMessageType>,
    error?: SendbirdError,
  ) => void;
  retryCount: number;
}
interface ToolProps {
  sdk: SdkStore['sdk'];
  logger: Logger;
  messageSearchDispatcher: (props: { type: string, payload: any }) => void;
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
        currentChannel.refresh().then((channel) => {
          const inputSearchMessageQueryObject: MessageSearchQueryParams = {
            order: MessageSearchOrder.TIMESTAMP,
            channelUrl,
            messageTimestampFrom: channel.invitedAt,
            keyword: requestString,
            ...messageSearchQuery,
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
              onResultLoaded(messages as CoreMessageType[], null);
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
        });
      } else {
        logger.info('MessageSearch | useGetSeasrchedMessages: search string is empty');
      }
    }
  }, [channelUrl, messageSearchQuery, requestString, currentChannel, retryCount]);
}

export default useGetSearchedMessages;
