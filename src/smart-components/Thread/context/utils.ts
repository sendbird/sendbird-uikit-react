import format from 'date-fns/format';
import { GroupChannel } from "@sendbird/chat/groupChannel";
import { FileMessage, UserMessage } from "@sendbird/chat/message";
import { getOutgoingMessageState, OutgoingMessageStates } from "../../../utils/exports/getOutgoingMessageState";

export const getNicknamesMapFromMembers = (members = []): Map<string, string> => {
  const nicknamesMap = new Map();
  for (let memberIndex = 0; memberIndex < members.length; memberIndex += 1) {
    const { userId, nickname } = members[memberIndex];
    nicknamesMap.set(userId, nickname);
  }
  return nicknamesMap;
};

export const isAboutSame = (a: number, b: number, px: number): boolean => (Math.abs(a - b) <= px);

export const isEmpty = (val: any): boolean => (val === null || val === undefined);

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

export const getMessageCreatedAt = (message: UserMessage | FileMessage): string => format(message.createdAt, 'p');
export const isReadMessage = (channel: GroupChannel, message: UserMessage | FileMessage): boolean => (
  getOutgoingMessageState(channel, message) === OutgoingMessageStates.READ
);
export const isSameGroup = (
  message: UserMessage | FileMessage,
  comparingMessage: UserMessage | FileMessage,
  currentChannel: GroupChannel,
): boolean => {
  if (!(message
    && comparingMessage
    && message.messageType
    && message.messageType !== 'admin'
    && comparingMessage.messageType
    && comparingMessage?.messageType !== 'admin'
    && message?.sender
    && comparingMessage?.sender
    && message?.createdAt
    && comparingMessage?.createdAt
    && message?.sender?.userId
    && comparingMessage?.sender?.userId
  )) {
    return false;
  }
  return (
    message?.sendingStatus === comparingMessage?.sendingStatus
    && message?.sender?.userId === comparingMessage?.sender?.userId
    && getMessageCreatedAt(message) === getMessageCreatedAt(comparingMessage)
    && isReadMessage(currentChannel, message) === isReadMessage(currentChannel, comparingMessage)
  );
};

export const compareMessagesForGrouping = (
  prevMessage: UserMessage | FileMessage,
  currMessage: UserMessage | FileMessage,
  nextMessage: UserMessage | FileMessage,
  currentChannel: GroupChannel,
  replyType: string,
): [boolean, boolean] => {
  if (replyType === 'THREAD' && currMessage?.threadInfo) {
    return [false, false];
  }
  const sendingStatus = currMessage?.sendingStatus || '';
  const isAcceptable = sendingStatus !== 'pending' && sendingStatus !== 'failed';
  return [
    isSameGroup(prevMessage, currMessage, currentChannel) && isAcceptable,
    isSameGroup(currMessage, nextMessage, currentChannel) && isAcceptable,
  ];
};

export const scrollIntoLast = (intialTry = 0): void => {
  const MAX_TRIES = 10;
  const currentTry = intialTry;
  if (currentTry > MAX_TRIES) {
    return;
  }
  try {
    const scrollDOM = document.querySelector('.sendbird-thread-ui--scroll');
    // eslint-disable-next-line no-multi-assign
    scrollDOM.scrollTop = scrollDOM.scrollHeight;
  } catch (error) {
    setTimeout(() => {
      scrollIntoLast(currentTry + 1);
    }, 500 * currentTry);
  }
};
