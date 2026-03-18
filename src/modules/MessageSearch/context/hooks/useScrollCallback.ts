import { useCallback, useRef } from 'react';
import type { SendbirdError } from '@sendbird/chat';
import type { BaseMessage } from '@sendbird/chat/message';
import { CoreMessageType } from '../../../../utils';
import { LoggerInterface } from '../../../../lib/Logger';
import useMessageSearch from '../hooks/useMessageSearch';
import { ClientSentMessages } from '../../../../types';

interface MainProps {
  onResultLoaded?: (messages?: Array<CoreMessageType> | null, error?: SendbirdError | null) => void;
}

interface ToolProps {
  logger: LoggerInterface;
}

export type CallbackReturn = (callback: (...args: [messages: BaseMessage[], error: null] | [messages: null, error: any]) => void) => void;

function useScrollCallback(
  { onResultLoaded }: MainProps,
  { logger }: ToolProps,
): CallbackReturn {
  const {
    state: {
      currentMessageSearchQuery,
    },
    actions: {
      getNextSearchedMessages,
    },
  } = useMessageSearch();

  const queryRef = useRef(currentMessageSearchQuery);
  queryRef.current = currentMessageSearchQuery;

  return useCallback((cb) => {
    const query = queryRef.current;

    if (!navigator.onLine) {
      logger.warning('MessageSearch | useScrollCallback: offline, skip loading more results');
      return;
    }

    if (query?.isLoading) {
      logger.warning('MessageSearch | useScrollCallback: query already in progress');
      return;
    }
    
    if (query && query.hasNext) {
      query
        .next()
        .then((messages) => {
          logger.info('MessageSearch | useScrollCallback: succeeded getting searched messages', messages);
          getNextSearchedMessages(messages as ClientSentMessages[]);
          cb(messages, null);
          if (onResultLoaded && typeof onResultLoaded === 'function') {
            onResultLoaded(messages as CoreMessageType[], null);
          }
        })
        .catch((error) => {
          logger.warning('MessageSearch | useScrollCallback: failed getting searched messages', error);
          cb(null, error);
          if (onResultLoaded && typeof onResultLoaded === 'function') {
            onResultLoaded(null, error);
          }
        });
    } else {
      logger.warning('MessageSearch | useScrollCallback: no currentMessageSearchQuery or no more results');
    }
  }, []);
}

export default useScrollCallback;
