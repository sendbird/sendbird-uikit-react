import { useCallback } from 'react';
import * as messageActionTypes from '../dux/actionTypes';
import SendbirdUIKit from '../../../index';

interface MainProps {
  currentMessageSearchQuery: SendBird.MessageSearchQuery;
  hasMoreResult: boolean;
  onResultLoaded?: (
    messages?: Array<SendBird.UserMessage | SendBird.FileMessage | SendBird.AdminMessage>,
    error?: SendbirdUIKit.SendbirdError,
  ) => void;
}
interface ToolProps {
  logger: SendbirdUIKit.Logger;
  messageSearchDispathcer: ({ type: string, payload: any }) => void;
}
type CallbackReturn = (
  callback: (
    messages: Array<SendBird.UserMessage | SendBird.FileMessage | SendBird.AdminMessage>,
    /* eslint-disable @typescript-eslint/no-explicit-any*/
    error: any,
  ) => void
) => void;

function useScrollCallback(
  { currentMessageSearchQuery, hasMoreResult, onResultLoaded }: MainProps,
  { logger, messageSearchDispathcer }: ToolProps,
): CallbackReturn {
  return useCallback((cb) => {
    if (!hasMoreResult) {
      logger.warning('MessageSearch | useScrollCallback: no more searched results', hasMoreResult);
    }
    if (currentMessageSearchQuery && currentMessageSearchQuery.hasNext) {
      currentMessageSearchQuery.next((messages, error) => {
        if (!error) {
          logger.info('MessageSearch | useScrollCallback: succeeded getting searched messages', messages);
          messageSearchDispathcer({
            type: messageActionTypes.GET_NEXT_SEARCHED_MESSAGES,
            payload: messages,
          });
          cb(messages, null);
          if (onResultLoaded && typeof onResultLoaded === 'function') {
            onResultLoaded(messages, null);
          }
        } else {
          logger.warning('MessageSearch | useScrollCallback: failed getting searched messages', error);
          cb(null, error);
          if (onResultLoaded && typeof onResultLoaded === 'function') {
            onResultLoaded(null, error);
          }
        }
      });
    } else {
      logger.warning('MessageSearch | useScrollCallback: no currentMessageSearchQuery');
    }
  }, [currentMessageSearchQuery, hasMoreResult]);
}

export default useScrollCallback;
