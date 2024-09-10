import { useCallback } from 'react';
import type { SendbirdError } from '@sendbird/chat';
import type { BaseMessage } from '@sendbird/chat/message';
import { CoreMessageType } from '../../../../utils';
import { LoggerInterface } from '../../../../lib/Logger';
import { useMessageSearchStore } from '../_MessageSearchProvider';
import useMessageSearchActions from './useMessageSearchActions';
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
  const { getNextSearchedMessages } = useMessageSearchActions();
  const { state: {
    currentMessageSearchQuery,
    hasMoreResult,
  } } = useMessageSearchStore();

  return useCallback((cb) => {
    if (!hasMoreResult) {
      logger.warning('MessageSearch | useScrollCallback: no more searched results', hasMoreResult);
    }
    if (currentMessageSearchQuery && currentMessageSearchQuery.hasNext) {
      currentMessageSearchQuery
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
      logger.warning('MessageSearch | useScrollCallback: no currentMessageSearchQuery');
    }
  }, [currentMessageSearchQuery, hasMoreResult]);
}

export default useScrollCallback;
