import type { SendbirdError } from '@sendbird/chat';
import type { MessageSearchQuery } from '@sendbird/chat/message';
import { useCallback } from 'react';
import { Logger } from '../../../..';
import * as messageActionTypes from '../dux/actionTypes';
import { CoreMessageType } from '../../../../utils';

interface MainProps {
  currentMessageSearchQuery: MessageSearchQuery;
  hasMoreResult: boolean;
  onResultLoaded?: (
    messages?: Array<CoreMessageType>,
    error?: SendbirdError,
  ) => void;
}

type MessageSearchDispatcherType = { type: string, payload: any };

interface ToolProps {
  logger: Logger;
  messageSearchDispatcher: (payload: MessageSearchDispatcherType) => void;
}

export type CallbackReturn = (
  callback: (
    messages: Array<CoreMessageType>,
    /* eslint-disable @typescript-eslint/no-explicit-any */
    error: any,
  ) => void
) => void;

function useScrollCallback(
  { currentMessageSearchQuery, hasMoreResult, onResultLoaded }: MainProps,
  { logger, messageSearchDispatcher }: ToolProps,
): CallbackReturn {
  return useCallback((cb) => {
    if (!hasMoreResult) {
      logger.warning('MessageSearch | useScrollCallback: no more searched results', hasMoreResult);
    }
    if (currentMessageSearchQuery && currentMessageSearchQuery.hasNext) {
      currentMessageSearchQuery.next().then((messages) => {
        logger.info('MessageSearch | useScrollCallback: succeeded getting searched messages', messages);
        messageSearchDispatcher({
          type: messageActionTypes.GET_NEXT_SEARCHED_MESSAGES,
          payload: messages,
        });
        cb(messages, null);
        if (onResultLoaded && typeof onResultLoaded === 'function') {
          onResultLoaded(messages, null);
        }
      }).catch((error) => {
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
