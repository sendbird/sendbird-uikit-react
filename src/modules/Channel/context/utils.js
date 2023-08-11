import format from 'date-fns/format';
import * as channelActions from './dux/actionTypes';
import topics from '../../../lib/pubSub/topics';

import { getSendingMessageStatus, isReadMessage } from '../../../utils';
import { OutgoingMessageStates } from '../../../utils/exports/getOutgoingMessageState';

const UNDEFINED = 'undefined';
const { SUCCEEDED, FAILED, PENDING } = getSendingMessageStatus();

export const scrollToRenderedMessage = (scrollRef, initialTimeStamp) => {
  try {
    const container = scrollRef.current;
    // scroll into the message with initialTimeStamp
    const element = container.querySelectorAll(`[data-sb-created-at="${initialTimeStamp}"]`)?.[0];
    if (element) {
      // Calculate the offset of the element from the top of the container
      const containerHeight = container.offsetHeight;
      const elementHeight = element.offsetHeight;
      const elementOffset = (containerHeight - elementHeight) / 2;
      // Set the scroll position of the container to bring the element to the middle
      container.scrollTop = element.offsetTop - elementOffset;
    }
  } catch {
    // do nothing
  }
};

/* eslint-disable default-param-last */
export const scrollIntoLast = (initialTry = 0, scrollRef) => {
  const MAX_TRIES = 10;
  const currentTry = initialTry;
  if (currentTry > MAX_TRIES) {
    return;
  }
  try {
    const scrollDOM = scrollRef?.current || document.querySelector('.sendbird-conversation__messages-padding');
    // eslint-disable-next-line no-multi-assign
    scrollDOM.scrollTop = scrollDOM.scrollHeight;
  } catch (error) {
    setTimeout(() => {
      scrollIntoLast(currentTry + 1, scrollRef);
    }, 500 * currentTry);
  }
};

export const pubSubHandleRemover = (subscriber) => {
  subscriber.forEach((s) => {
    try {
      s.remove();
    } catch {
      //
    }
  });
};

export const pubSubHandler = ({
  channelUrl,
  pubSub,
  dispatcher,
  scrollRef,
}) => {
  const subscriber = new Map();
  if (!pubSub || !pubSub.subscribe) return subscriber;
  subscriber.set(topics.SEND_USER_MESSAGE, pubSub.subscribe(topics.SEND_USER_MESSAGE, (msg) => {
    const { channel, message } = msg;
    scrollIntoLast(0, scrollRef);
    if (channelUrl === channel?.url) {
      dispatcher({
        type: channelActions.SEND_MESSAGEGE_SUCESS,
        payload: message,
      });
    }
  }));
  subscriber.set(topics.SEND_MESSAGE_START, pubSub.subscribe(topics.SEND_MESSAGE_START, (msg) => {
    const { channel, message } = msg;
    if (channelUrl === channel?.url) {
      dispatcher({
        type: channelActions.SEND_MESSAGEGE_START,
        payload: message,
      });
    }
  }));
  subscriber.set(topics.SEND_MESSAGE_FAILED, pubSub.subscribe(topics.SEND_MESSAGE_FAILED, (msg) => {
    const { channel, message } = msg;
    if (channelUrl === channel?.url) {
      dispatcher({
        type: channelActions.SEND_MESSAGE_FAILURE,
        payload: message,
      });
    }
  }));
  subscriber.set(topics.SEND_FILE_MESSAGE, pubSub.subscribe(topics.SEND_FILE_MESSAGE, (msg) => {
    const { channel, message } = msg;
    scrollIntoLast(0, scrollRef);
    if (channelUrl === channel?.url) {
      dispatcher({
        type: channelActions.SEND_MESSAGEGE_SUCESS,
        payload: message,
      });
    }
  }));
  subscriber.set(topics.UPDATE_USER_MESSAGE, pubSub.subscribe(topics.UPDATE_USER_MESSAGE, (msg) => {
    const { channel, message, fromSelector } = msg;
    if (fromSelector && (channelUrl === channel?.url)) {
      dispatcher({
        type: channelActions.ON_MESSAGE_UPDATED,
        payload: { channel, message },
      });
    }
  }));
  subscriber.set(topics.DELETE_MESSAGE, pubSub.subscribe(topics.DELETE_MESSAGE, (msg) => {
    const { channel, messageId } = msg;
    if (channelUrl === channel?.url) {
      dispatcher({
        type: channelActions.ON_MESSAGE_DELETED,
        payload: messageId,
      });
    }
  }));

  return subscriber;
};

export const getParsedStatus = (message, currentGroupChannel) => {
  if (message.requestState === FAILED) {
    return OutgoingMessageStates.FAILED;
  }

  if (message.requestState === PENDING) {
    return OutgoingMessageStates.PENDING;
  }

  if (message.requestState === SUCCEEDED) {
    if (!currentGroupChannel) {
      return OutgoingMessageStates.SENT;
    }

    const unreadMemberCount = currentGroupChannel?.getUnreadMemberCount(message);
    if (unreadMemberCount === 0) {
      return OutgoingMessageStates.READ;
    }

    const isDelivered = currentGroupChannel?.getUndeliveredMemberCount(message) === 0;
    if (isDelivered) {
      return OutgoingMessageStates.DELIVERED;
    }

    return OutgoingMessageStates.SENT;
  }

  return null;
};

export const isOperator = (groupChannel = {}) => {
  const myRole = groupChannel?.myRole;
  return myRole === 'operator';
};

export const isDisabledBecauseFrozen = (groupChannel = {}) => {
  const isFrozen = groupChannel?.isFrozen;
  return isFrozen && !isOperator(groupChannel);
};

export const isDisabledBecauseMuted = (groupChannel = {}) => {
  const myMutedState = groupChannel?.myMutedState;
  return myMutedState === 'muted';
};

export const getEmojiCategoriesFromEmojiContainer = (emojiContainer = {}) => (
  emojiContainer.emojiCategories ? emojiContainer.emojiCategories : []
);

export const getAllEmojisFromEmojiContainer = (emojiContainer = {}) => {
  const { emojiCategories = [] } = emojiContainer;
  const allEmojis = [];

  for (let categoryIndex = 0; categoryIndex < emojiCategories.length; categoryIndex += 1) {
    const { emojis } = emojiCategories[categoryIndex];
    for (let emojiIndex = 0; emojiIndex < emojis.length; emojiIndex += 1) {
      allEmojis.push(emojis[emojiIndex]);
    }
  }
  return allEmojis;
};

export const getEmojisFromEmojiContainer = (emojiContainer = {}, emojiCategoryId = '') => (
  emojiContainer.emojiCategories
    ? emojiContainer.emojiCategories
      .filter((emojiCategory) => emojiCategory.id === emojiCategoryId)[0].emojis
    : []
);

export const getAllEmojisMapFromEmojiContainer = (emojiContainer = {}) => {
  const { emojiCategories = [] } = emojiContainer;
  const allEmojisMap = new Map();

  for (let categoryIndex = 0; categoryIndex < emojiCategories.length; categoryIndex += 1) {
    const { emojis } = emojiCategories[categoryIndex];
    for (let emojiIndex = 0; emojiIndex < emojis.length; emojiIndex += 1) {
      const { key, url } = emojis[emojiIndex];
      allEmojisMap.set(key, url);
    }
  }
  return allEmojisMap;
};

export const getNicknamesMapFromMembers = (members = []) => {
  const nicknamesMap = new Map();
  for (let memberIndex = 0; memberIndex < members.length; memberIndex += 1) {
    const { userId, nickname } = members[memberIndex];
    nicknamesMap.set(userId, nickname);
  }
  return nicknamesMap;
};

const getUniqueListBy = (arr, key) => [...new Map(arr.map((item) => [item[key], item])).values()];
const getUniqueListByMessageId = (arr) => getUniqueListBy(arr, 'messageId');
const sortByCreatedAt = (messages) => messages.sort((a, b) => a.createdAt - b.createdAt);

export const mergeAndSortMessages = (oldMessages, newMessages) => {
  const lastOldMessage = oldMessages[oldMessages.length - 1];
  const firstNewMessage = newMessages[0];
  // If the last message of oldMessages is older than the first message of newMessages,
  // then we can safely append newMessages to oldMessages.
  if (lastOldMessage?.createdAt < firstNewMessage?.createdAt) {
    return [...oldMessages, ...newMessages];
  }

  // todo: optimize this
  // If the last message of oldMessages is newer than the first message of newMessages,
  // then we need to merge the two arrays and sort them by createdAt.
  const mergedMessages = [...oldMessages, ...newMessages];
  const unique = getUniqueListByMessageId(mergedMessages);
  return sortByCreatedAt(unique);
};

export const getMessageCreatedAt = (message) => format(message.createdAt, 'p');

export const isSameGroup = (message, comparingMessage, currentChannel) => {
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
  prevMessage,
  currMessage,
  nextMessage,
  currentChannel,
  replyType,
) => {
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

export const hasOwnProperty = (property) => (payload) => {
  // eslint-disable-next-line no-prototype-builtins
  if (payload && payload.hasOwnProperty && payload.hasOwnProperty(property)) {
    return true;
  }
  return false;
};

export const passUnsuccessfullMessages = (allMessages, newMessage) => {
  const { sendingStatus = UNDEFINED } = newMessage;
  if (sendingStatus === SUCCEEDED || sendingStatus === PENDING) {
    const lastIndexOfSucceededMessage = allMessages
      .map((message) => (
        message.sendingStatus
        || ((message.isAdminMessage && message.isAdminMessage()) ? SUCCEEDED : UNDEFINED)
      ))
      .lastIndexOf(SUCCEEDED);
    if (lastIndexOfSucceededMessage + 1 < allMessages.length) {
      const messages = [...allMessages];
      messages.splice(lastIndexOfSucceededMessage + 1, 0, newMessage);
      return messages;
    }
  }
  return [
    ...allMessages,
    newMessage,
  ];
};

export const pxToNumber = (px) => {
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

export const isAboutSame = (a, b, px) => (Math.abs(a - b) <= px);

export default getParsedStatus;
