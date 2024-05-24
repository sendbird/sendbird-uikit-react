import format from 'date-fns/format';
import { GroupChannel, Member } from '@sendbird/chat/groupChannel';
import { getOutgoingMessageState, OutgoingMessageStates } from '../../../utils/exports/getOutgoingMessageState';
import { SendableMessageType } from '../../../utils';

export const getNicknamesMapFromMembers = (members: Member[] = []): Map<string, string> => {
  const nicknamesMap = new Map();
  for (let memberIndex = 0; memberIndex < members.length; memberIndex += 1) {
    const { userId, nickname } = members[memberIndex];
    nicknamesMap.set(userId, nickname);
  }
  return nicknamesMap;
};

export const getParentMessageFrom = (message: SendableMessageType | null) => {
  if (!message) {
    return null;
  }
  if (isParentMessage(message)) {
    return message;
  }
  if (isThreadMessage(message)) {
    return message?.parentMessage || null;
  }
  return null;
};

export const isParentMessage = (message: SendableMessageType): boolean => {
  return (
    message?.parentMessage === null
    && typeof message?.parentMessageId === 'number'
    && !message?.parentMessageId
  );
};

export const isThreadMessage = (message: SendableMessageType): boolean => {
  return (
    message?.parentMessage !== null
    && typeof message?.parentMessageId === 'number'
    && message?.parentMessageId > 0
    && message?.threadInfo === null
  );
};

export const isAboutSame = (a: number, b: number, px: number): boolean => (Math.abs(a - b) <= px);

export const isEmpty = (val: unknown): boolean => (val === null || val === undefined);

// Some Ids return string and number inconsistently
// only use to comapre IDs
export function compareIds(a: number | string, b: number | string): boolean {
  if (isEmpty(a) || isEmpty(b)) {
    return false;
  }
  const aString = a.toString();
  const bString = b.toString();
  return aString === bString;
}

export const getMessageCreatedAt = (message: SendableMessageType): string => format(message.createdAt, 'p');
export const isReadMessage = (channel: GroupChannel, message: SendableMessageType): boolean => (
  getOutgoingMessageState(channel, message) === OutgoingMessageStates.READ
);

export const scrollIntoLast = (intialTry = 0): void => {
  const MAX_TRIES = 10;
  const currentTry = intialTry;
  if (currentTry > MAX_TRIES) {
    return;
  }
  try {
    const scrollDOM = document.querySelector('.sendbird-thread-ui--scroll');
    // eslint-disable-next-line no-multi-assign
    if (scrollDOM) { scrollDOM.scrollTop = scrollDOM.scrollHeight; }
  } catch (error) {
    setTimeout(() => {
      scrollIntoLast(currentTry + 1);
    }, 500 * currentTry);
  }
};
