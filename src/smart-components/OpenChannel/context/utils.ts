import format from 'date-fns/format';
import Sendbird from 'sendbird';
import SendbirdUIKit from '../../../index';

export const getMessageCreatedAt = (message: SendbirdUIKit.EveryMessage): string => format(message.createdAt, 'p');

export const shouldFetchMore = (messageLength: number, maxMessages: number): boolean => {
  if (typeof maxMessages !== 'number') {
    return true;
  }

  if (typeof maxMessages === 'number'
    && maxMessages > messageLength
  ) {
    return true;
  }
  return false;
}

export const scrollIntoLast = (intialTry = 0): void => {
  const MAX_TRIES = 10;
  const currentTry = intialTry;
  if (currentTry > MAX_TRIES) {
    return;
  }
  try {
    const scrollDOM = document.querySelector('.sendbird-openchannel-conversation-scroll');
    // eslint-disable-next-line no-multi-assign
    scrollDOM.scrollTop = scrollDOM.scrollHeight;
  } catch (error) {
    setTimeout(() => {
      scrollIntoLast(currentTry + 1);
    }, 500 * currentTry);
  }
};

export const isSameGroup = (
  message: SendbirdUIKit.EveryMessage,
  comparingMessage: SendbirdUIKit.EveryMessage,
): boolean => {
  if (!(
    message
    && comparingMessage
    && message?.messageType !== 'admin'
    && comparingMessage?.messageType !== 'admin'
    && message?.sender
    && comparingMessage?.sender
    && message?.createdAt
    && comparingMessage?.createdAt
    && message?.sender?.userId
    && comparingMessage?.sender?.userId
  )) {
    return false
  }

  return (
    message?.sendingStatus === comparingMessage?.sendingStatus
    && message?.sender?.userId === comparingMessage?.sender?.userId
    && getMessageCreatedAt(message) === getMessageCreatedAt(comparingMessage)
  );
};

export const compareMessagesForGrouping = (
  prevMessage: SendbirdUIKit.EveryMessage,
  currMessage: SendbirdUIKit.EveryMessage,
  nextMessage: SendbirdUIKit.EveryMessage,
): [boolean, boolean] => (
  [
    isSameGroup(prevMessage, currMessage),
    isSameGroup(currMessage, nextMessage),
  ]
);

export const kFormatter = (num: number): string => {
  if (Math.abs(num) > 999999) {
    return `${(Math.abs(num) / 1000000).toFixed(1)}M`;
  }

  if (Math.abs(num) > 999) {
    return `${(Math.abs(num) / 1000).toFixed(1)}K`;
  }

  return `${num}`;
};

export const isOperator = (openChannel: Sendbird.OpenChannel, userId: string): boolean => {
  const { operators } = openChannel;
  if (operators.map(operator => operator.userId).indexOf(userId) < 0) {
    return false;
  }
  return true;
};

export const isDisabledBecauseFrozen = (openChannel: Sendbird.OpenChannel, userId: string): boolean => {
  const { isFrozen } = openChannel;
  return isFrozen && !isOperator(openChannel, userId);
};

export const isDisabledBecauseMuted = (mutedParticipantIds: Array<string>, userId: string): boolean => {
  return mutedParticipantIds.indexOf(userId) > -1;
};

export const fetchWithListQuery = (
  listQuery: SendbirdUIKit.UserListQuery,
  logger: SendbirdUIKit.Logger,
  eachQueryNextCallback: (users: Array<Sendbird.User>) => void,
): void => {
  const fetchList = (query) => {
    const { hasNext } = query;
    if (hasNext) {
      query.next((error, users) => {
        if (!error) {
          eachQueryNextCallback(users);
          fetchList(query);
        } else {
          logger.warning('OpenChannel | FetchUserList failed', error);
        }
      });
    } else {
      logger.info('OpenChannel | FetchUserList finished');
    }
  };
  logger.info('OpenChannel | FetchUserList start', listQuery);
  fetchList(listQuery);
};

export const pxToNumber = (px: string | number): number | void => {
  if (typeof px === 'number') {
    return px;
  }
  if (typeof px === 'string') {
    const parsed = Number.parseFloat(px);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  return null;
};
