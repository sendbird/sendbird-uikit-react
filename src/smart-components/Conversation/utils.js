import format from 'date-fns/format';
import * as channelActions from './dux/actionTypes';
import * as topics from '../../lib/pubSub/topics';

import { getSendingMessageStatus, getOutgoingMessageStates } from '../../utils';

const MessageStatusType = getOutgoingMessageStates();
const UNDEFINED = 'undefined';
const { SUCCEEDED, FAILED, PENDING } = getSendingMessageStatus();

export const scrollIntoLast = (intialTry = 0) => {
  const MAX_TRIES = 10;
  const currentTry = intialTry;
  if (currentTry > MAX_TRIES) {
    return;
  }
  try {
    const scrollDOM = document.querySelector('.sendbird-conversation__scroll-container');
    // eslint-disable-next-line no-multi-assign
    scrollDOM.scrollTop = scrollDOM.scrollHeight;
  } catch (error) {
    setTimeout(() => {
      scrollIntoLast(currentTry + 1);
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

export const pubSubHandler = (channelUrl, pubSub, dispatcher) => {
  const subscriber = new Map();
  if (!pubSub || !pubSub.subscribe) return subscriber;
  subscriber.set(topics.SEND_USER_MESSAGE, pubSub.subscribe(topics.SEND_USER_MESSAGE, (msg) => {
    const { channel, message } = msg;
    scrollIntoLast();
    if (channel && (channelUrl === channel.url)) {
      dispatcher({
        type: channelActions.SEND_MESSAGEGE_SUCESS,
        payload: message,
      });
    }
  }));
  subscriber.set(topics.SEND_MESSAGE_START, pubSub.subscribe(topics.SEND_MESSAGE_START, (msg) => {
    const { channel, message } = msg;
    if (channel && (channelUrl === channel.url)) {
      dispatcher({
        type: channelActions.SEND_MESSAGEGE_START,
        payload: message,
      });
    }
  }));
  subscriber.set(topics.SEND_FILE_MESSAGE, pubSub.subscribe(topics.SEND_FILE_MESSAGE, (msg) => {
    const { channel, message } = msg;
    scrollIntoLast();
    if (channel && (channelUrl === channel.url)) {
      dispatcher({
        type: channelActions.SEND_MESSAGEGE_SUCESS,
        payload: message,
      });
    }
  }));
  subscriber.set(topics.UPDATE_USER_MESSAGE, pubSub.subscribe(topics.UPDATE_USER_MESSAGE, (msg) => {
    const { channel, message, fromSelector } = msg;
    if (fromSelector && channel && (channelUrl === channel.url)) {
      dispatcher({
        type: channelActions.ON_MESSAGE_UPDATED,
        payload: { channel, message },
      });
    }
  }));
  subscriber.set(topics.DELETE_MESSAGE, pubSub.subscribe(topics.DELETE_MESSAGE, (msg) => {
    const { channel, messageId } = msg;
    if (channel && (channelUrl === channel.url)) {
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
    return MessageStatusType.FAILED;
  }

  if (message.requestState === PENDING) {
    return MessageStatusType.PENDING;
  }

  if (message.requestState === SUCCEEDED) {
    if (!currentGroupChannel) {
      return MessageStatusType.SENT;
    }

    const unreadCount = currentGroupChannel.getReadReceipt(message);
    if (unreadCount === 0) {
      return MessageStatusType.READ;
    }

    const isDelivered = currentGroupChannel.getDeliveryReceipt(message) === 0;
    if (isDelivered) {
      return MessageStatusType.DELIVERED;
    }

    return MessageStatusType.SENT;
  }

  return null;
};

export const isOperator = (groupChannel = {}) => {
  const { myRole } = groupChannel;
  return myRole === 'operator';
};

export const isDisabledBecauseFrozen = (groupChannel = {}) => {
  const { isFrozen } = groupChannel;
  return isFrozen && !isOperator(groupChannel);
};

export const isDisabledBecauseMuted = (groupChannel = {}) => {
  const { myMutedState } = groupChannel;
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

export const getMessageCreatedAt = (message) => format(message.createdAt, 'p');

export const isSameGroup = (message, comparingMessage) => {
  if (
    !message
    || !comparingMessage
    || !message.sender
    || !comparingMessage.sender
    || !message.createdAt
    || !comparingMessage.createdAt
    || !message.sender.userId
    || !comparingMessage.sender.userId
  ) {
    return false;
  }
  return (
    message.sendingStatus === comparingMessage.sendingStatus
    && message.sender.userId === comparingMessage.sender.userId
    && getMessageCreatedAt(message) === getMessageCreatedAt(comparingMessage)
  );
};

export const compareMessagesForGrouping = (
  prevMessage,
  currMessage,
  nextMessage,
) => (
  [
    isSameGroup(prevMessage, currMessage),
    isSameGroup(currMessage, nextMessage),
  ]
);

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

export default getParsedStatus;
