import { useEffect, useCallback } from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import type { MessageSearchQueryParams } from '@sendbird/chat/lib/__definition';
import type { SendbirdError } from '@sendbird/chat';
import type { Logger, SdkStore } from '../../../../lib/Sendbird/types';
import { CoreMessageType } from '../../../../utils';
import useMessageSearch from '../hooks/useMessageSearch';
import { ClientSentMessages } from '../../../../types';

enum MessageSearchOrder {
  SCORE = 'score',
  TIMESTAMP = 'ts',
}

interface MainProps {
  currentChannel: GroupChannel | null;
  channelUrl: string;
  requestString?: string;
  messageSearchQuery?: MessageSearchQueryParams;
  onResultLoaded?: (
    messages?: Array<CoreMessageType>,
    error?: SendbirdError,
  ) => void;
}
interface ToolProps {
  sdk: SdkStore['sdk'];
  logger: Logger;
}

function useGetSearchedMessages(
  { currentChannel, channelUrl, requestString, messageSearchQuery, onResultLoaded }: MainProps,
  { sdk, logger }: ToolProps,
): void {
  const {
    state: { retryCount },
    actions: {
      startMessageSearch,
      getSearchedMessages,
      setQueryInvalid,
      startGettingSearchedMessages,
    },
  } = useMessageSearch();

  const handleSearchError = useCallback((error: SendbirdError) => {
    logger.warning('MessageSearch | useGetSearchedMessages: failed getting search messages.', error);
    setQueryInvalid();
    if (onResultLoaded && typeof onResultLoaded === 'function') {
      onResultLoaded(undefined, error);
    }
  }, [logger, setQueryInvalid, onResultLoaded]);

  useEffect(() => {
    let disposed = false;

    startMessageSearch();
    if (sdk && channelUrl && sdk.createMessageSearchQuery && currentChannel && requestString) {
      currentChannel.refresh()
        .then((channel) => {
          if (disposed) {
            return;
          }

          const inputSearchMessageQueryObject: MessageSearchQueryParams = {
            order: MessageSearchOrder.TIMESTAMP,
            channelUrl,
            messageTimestampFrom: channel.invitedAt,
            keyword: requestString,
            ...messageSearchQuery,
          };
          const createdQuery = sdk.createMessageSearchQuery(inputSearchMessageQueryObject);
          startGettingSearchedMessages(createdQuery);

          createdQuery.next().then((messages) => {
            if (disposed) {
              return;
            }
            logger.info('MessageSearch | useGetSearchedMessages: succeeded getting messages', messages);
            getSearchedMessages(messages as ClientSentMessages[], createdQuery);
            if (onResultLoaded && typeof onResultLoaded === 'function') {
              onResultLoaded(messages as CoreMessageType[], undefined);
            }
          }).catch((error) => {
            if (!disposed) {
              handleSearchError(error);
            }
          });
        })
        .catch((error) => {
          if (disposed) {
            return;
          }
          logger.warning('MessageSearch | useGetSearchedMessages: failed getting channel.', error);
          handleSearchError(error);
        });
    } else if (!requestString) {
      logger.info('MessageSearch | useGetSearchedMessages: search string is empty');
    }

    return () => {
      disposed = true;
    };
  }, [
    channelUrl,
    messageSearchQuery,
    requestString,
    currentChannel,
    retryCount,
    sdk,
    logger,
    startMessageSearch,
    getSearchedMessages,
    startGettingSearchedMessages,
    handleSearchError,
  ]);
}

export default useGetSearchedMessages;
