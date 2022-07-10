import type { User } from '@sendbird/chat';
import type { AdminMessage, FileMessage, UserMessage } from '@sendbird/chat/message';
import type { OpenChannel, ParticipantListQuery } from '@sendbird/chat/openChannel';
import format from 'date-fns/format';

import { Logger } from '../../../lib/SendbirdState';

export const getMessageCreatedAt = (message: UserMessage | FileMessage): string => format(message.createdAt, 'p');

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
    const scrollDOM = document.querySelector('.sendbird-openchannel-conversation-scroll__container__item-container');
    // eslint-disable-next-line no-multi-assign
    scrollDOM.scrollTop = scrollDOM.scrollHeight;
  } catch (error) {
    setTimeout(() => {
      scrollIntoLast(currentTry + 1);
    }, 500 * currentTry);
  }
};

export const isSameGroup = (
  message: AdminMessage | UserMessage | FileMessage,
  comparingMessage: AdminMessage | UserMessage | FileMessage,
): boolean => {
  if (!(
    message
    && comparingMessage
    && message?.messageType
    && message.messageType !== 'admin'
    && comparingMessage?.messageType
    && comparingMessage.messageType !== 'admin'
    && (message as UserMessage | FileMessage)?.sender
    && (comparingMessage as UserMessage | FileMessage)?.sender
    && message?.createdAt
    && comparingMessage?.createdAt
    && (message as UserMessage | FileMessage)?.sender?.userId
    && (comparingMessage as UserMessage | FileMessage)?.sender?.userId
  )) {
    return false
  }
  // to fix typecasting
  const message_ = message as UserMessage;
  const comparingMessage_ = comparingMessage as UserMessage;
  return (
    message_?.sendingStatus === comparingMessage_?.sendingStatus
    && message_?.sender?.userId === comparingMessage_?.sender?.userId
    && (
      getMessageCreatedAt(message as UserMessage | FileMessage) === getMessageCreatedAt(comparingMessage as UserMessage | FileMessage)
    )
  );
};

export const compareMessagesForGrouping = (
  prevMessage: AdminMessage | UserMessage | FileMessage,
  currMessage: AdminMessage | UserMessage | FileMessage,
  nextMessage: AdminMessage | UserMessage | FileMessage,
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

export const isOperator = (openChannel: OpenChannel, userId: string): boolean => {
  const operators = openChannel?.operators;
  if (operators.map(operator => operator.userId).indexOf(userId) < 0) {
    return false;
  }
  return true;
};

export const isDisabledBecauseFrozen = (openChannel: OpenChannel, userId: string): boolean => {
  const isFrozen = openChannel?.isFrozen;
  return isFrozen && !isOperator(openChannel, userId);
};

export const isDisabledBecauseMuted = (mutedParticipantIds: Array<string>, userId: string): boolean => {
  return mutedParticipantIds.indexOf(userId) > -1;
};

export const fetchWithListQuery = (
  listQuery: ParticipantListQuery,
  logger: Logger,
  eachQueryNextCallback: (users: Array<User>) => void,
): void => {
  const fetchList = (query: ParticipantListQuery) => {
    const { hasNext } = query;
    if (hasNext) {
      query.next().then((users) => {
        eachQueryNextCallback(users);
        fetchList(query);
      }).catch((error) => {
        logger.warning('OpenChannel | FetchUserList failed', error);
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
