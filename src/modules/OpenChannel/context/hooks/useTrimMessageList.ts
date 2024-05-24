import { useEffect, useState } from 'react';
import * as messageActionTypes from '../dux/actionTypes';
import { LoggerInterface } from '../../../../lib/Logger';

interface DynamicParams {
  messagesLength: number;
  messageLimit?: number;
}

type MessagesDispatcherType = {
  type: string,
  payload: { messageLimit: number }
};

interface StaticParams {
  messagesDispatcher: (dispatcher: MessagesDispatcherType) => void;
  logger: LoggerInterface;
}

const THROTTLE_TIMER = 5000;

// to trim message list so that we wont keep thousands of messages in memory
// We are throttling here; not debouncing
// it will be called once very 5 sec if messagesLength, messageLimit changes
// we check if messagesLength > messageLimit before dispatching action
function useTrimMessageList(
  { messagesLength, messageLimit }: DynamicParams,
  { messagesDispatcher, logger }: StaticParams,
): void {
  const [inProgress, setInProgress] = useState(false);
  useEffect(() => {
    if (inProgress) {
      return;
    }
    if (typeof messagesLength === 'number' && typeof messageLimit === 'number' && messagesLength > messageLimit) {
      logger.info('Trimming MessageList');
      messagesDispatcher({
        type: messageActionTypes.TRIM_MESSAGE_LIST,
        payload: { messageLimit },
      });
    }
    setInProgress(true);
    setTimeout(() => { setInProgress(false); }, THROTTLE_TIMER);
  }, [messagesLength, messageLimit]);
}

export default useTrimMessageList;
