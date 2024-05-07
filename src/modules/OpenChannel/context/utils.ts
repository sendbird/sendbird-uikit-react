import type React from 'react';
import type { User } from '@sendbird/chat';
import type { OpenChannel, ParticipantListQuery } from '@sendbird/chat/openChannel';
import format from 'date-fns/format';

import { Logger } from '../../../lib/SendbirdState';
import { SendableMessageType } from '../../../utils';

export const getMessageCreatedAt = (message: SendableMessageType): string => format(message.createdAt, 'p');

export const shouldFetchMore = (messageLength: number, maxMessages?: number): boolean => {
  if (typeof maxMessages !== 'number') {
    return true;
  }

  return maxMessages > messageLength;
};

/* eslint-disable default-param-last */
export const scrollIntoLast = (initialTry = 0, scrollRef: React.RefObject<HTMLElement>): void => {
  const MAX_TRIES = 10;
  const currentTry = initialTry;
  if (currentTry > MAX_TRIES) {
    return;
  }
  try {
    const scrollDOM = scrollRef?.current || document.querySelector('.sendbird-openchannel-conversation-scroll__container__item-container');
    // eslint-disable-next-line no-multi-assign
    if (scrollDOM) {
      scrollDOM.scrollTop = scrollDOM.scrollHeight;
    }
  } catch (error) {
    setTimeout(() => {
      scrollIntoLast(currentTry + 1, scrollRef);
    }, 500 * currentTry);
  }
};

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
