import { useEffect, useState } from 'react';
import * as messageActionTypes from '../dux/actionTypes';

interface DynamicParams {
  messagesLength: number;
  experimentalMessageLimit: number;
}

interface StaticParams {
  messagesDispatcher: ({
    type: string,
    payload: { experimentalMessageLimit: number }
  }) => void;
  logger: SendbirdUIKit.Logger;
}

const THROTTLE_TIMER = 5000;

// to trim message list so that we wont keep thousands of messages in memory
// We are throttling here; not debouncing
// it will be called once very 5 sec if messagesLength, experimentalMessageLimit changes
// we check if messagesLength > experimentalMessageLimit before dispatching action
function useTrimMessageList(
  { messagesLength, experimentalMessageLimit }: DynamicParams,
  { messagesDispatcher, logger }: StaticParams,
): void {
  const [inProgress, setInProgress] = useState(false);
  useEffect(() => {
    if (inProgress) {
      return;
    }
    if (typeof messagesLength === 'number' && messagesLength > experimentalMessageLimit) {
      logger.info('Trimming MessageList');
      messagesDispatcher({
        type: messageActionTypes.TRIM_MESSAGE_LIST,
        payload: { experimentalMessageLimit },
      });
    }
    setInProgress(true);
    setTimeout(() => { setInProgress(false); }, THROTTLE_TIMER);
  }, [messagesLength, experimentalMessageLimit]);
}

export default useTrimMessageList;
