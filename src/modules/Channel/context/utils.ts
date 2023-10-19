import React from 'react';
import { EmojiContainer } from '@sendbird/chat';
import { GroupChannel, Member } from '@sendbird/chat/groupChannel';
import format from 'date-fns/format';
import * as channelActions from './dux/actionTypes';
import topics from '../../../lib/pubSub/topics';

import { isReadMessage, SendableMessageType } from '../../../utils';
import { BaseMessage, SendingStatus } from '@sendbird/chat/message';
import { CustomUseReducerDispatcher } from '../../../lib/SendbirdState';
import { PubSubTypes } from '../../../lib/pubSub';

export const scrollToRenderedMessage = (
  scrollRef: React.MutableRefObject<HTMLElement>,
  initialTimeStamp: number,
  setIsScrolled: (val: boolean) => void,
) => {
  try {
    const container = scrollRef.current;
    // scroll into the message with initialTimeStamp
    const element = container.querySelectorAll(`[data-sb-created-at="${initialTimeStamp}"]`)?.[0];
    if (element instanceof HTMLElement) {
      // Calculate the offset of the element from the top of the container
      const containerHeight = container.offsetHeight;
      const elementHeight = element.offsetHeight;
      const elementOffset = (containerHeight - elementHeight) / 2;
      // Set the scroll position of the container to bring the element to the middle
      container.scrollTop = element.offsetTop - elementOffset;
    }
  } catch {
    // do nothing
  } finally {
    setIsScrolled?.(true);
  }
};

/* eslint-disable default-param-last */
export const scrollIntoLast = (
  initialTry = 0,
  scrollRef: React.MutableRefObject<HTMLElement>,
  setIsScrolled?: (val: boolean) => void,
) => {
  const MAX_TRIES = 10;
  const currentTry = initialTry;
  if (currentTry > MAX_TRIES) {
    setIsScrolled?.(true);
    return;
  }
  try {
    const scrollDOM = scrollRef?.current || document.querySelector('.sendbird-conversation__messages-padding');
    scrollDOM.scrollTop = scrollDOM.scrollHeight;
    setIsScrolled?.(true);
  } catch (error) {
    setTimeout(() => {
      scrollIntoLast(currentTry + 1, scrollRef, setIsScrolled);
    }, 500 * currentTry);
  }
};

export const pubSubHandleRemover = (subscriber: Map<string, { remove(): void }>) => {
  subscriber.forEach((s) => {
    try {
      s.remove();
    } catch {
      //
    }
  });
};

type Params = {
  channelUrl: string;
  pubSub: PubSubTypes;
  dispatcher: CustomUseReducerDispatcher;
  scrollRef: React.RefObject<HTMLElement>;
};
export const pubSubHandler = ({ channelUrl, pubSub, dispatcher, scrollRef }: Params) => {
  const subscriber = new Map();
  if (!pubSub || !pubSub.subscribe) return subscriber;
  subscriber.set(
    topics.SEND_USER_MESSAGE,
    pubSub.subscribe(topics.SEND_USER_MESSAGE, (msg) => {
      const { channel, message } = msg;
      scrollIntoLast(0, scrollRef);
      if (channelUrl === channel?.url) {
        dispatcher({
          type: channelActions.SEND_MESSAGE_SUCESS,
          payload: message,
        });
      }
    }),
  );
  subscriber.set(
    topics.SEND_MESSAGE_START,
    pubSub.subscribe(topics.SEND_MESSAGE_START, (msg) => {
      const { channel, message } = msg;
      if (channelUrl === channel?.url) {
        dispatcher({
          type: channelActions.SEND_MESSAGE_START,
          payload: message,
        });
      }
    }),
  );
  subscriber.set(
    topics.ON_FILE_INFO_UPLOADED,
    pubSub.subscribe(topics.ON_FILE_INFO_UPLOADED, (payload) => {
      if (channelUrl === payload.channelUrl) {
        dispatcher({
          type: channelActions.ON_FILE_INFO_UPLOADED,
          payload,
        });
      }
    }),
  );
  subscriber.set(
    topics.SEND_MESSAGE_FAILED,
    pubSub.subscribe(topics.SEND_MESSAGE_FAILED, (msg) => {
      const { channel, message } = msg;
      if (channelUrl === channel?.url) {
        dispatcher({
          type: channelActions.SEND_MESSAGE_FAILURE,
          payload: message,
        });
      }
    }),
  );
  subscriber.set(
    topics.SEND_FILE_MESSAGE,
    pubSub.subscribe(topics.SEND_FILE_MESSAGE, (msg) => {
      const { channel, message } = msg;
      scrollIntoLast(0, scrollRef);
      if (channelUrl === channel?.url) {
        dispatcher({
          type: channelActions.SEND_MESSAGE_SUCESS,
          payload: message,
        });
      }
    }),
  );
  subscriber.set(
    topics.UPDATE_USER_MESSAGE,
    pubSub.subscribe(topics.UPDATE_USER_MESSAGE, (msg) => {
      const { channel, message, fromSelector } = msg;
      if (fromSelector && channelUrl === channel?.url) {
        dispatcher({
          type: channelActions.ON_MESSAGE_UPDATED,
          payload: { channel, message },
        });
      }
    }),
  );
  subscriber.set(
    topics.DELETE_MESSAGE,
    pubSub.subscribe(topics.DELETE_MESSAGE, (msg) => {
      const { channel, messageId } = msg;
      if (channelUrl === channel?.url) {
        dispatcher({
          type: channelActions.ON_MESSAGE_DELETED,
          payload: messageId,
        });
      }
    }),
  );

  return subscriber;
};

export const isOperator = (groupChannel?: GroupChannel) => {
  const myRole = groupChannel?.myRole;
  return myRole === 'operator';
};

export const isDisabledBecauseFrozen = (groupChannel?: GroupChannel) => {
  const isFrozen = groupChannel?.isFrozen;
  return isFrozen && !isOperator(groupChannel);
};

export const isDisabledBecauseMuted = (groupChannel?: GroupChannel) => {
  const myMutedState = groupChannel?.myMutedState;
  return myMutedState === 'muted';
};

export const getAllEmojisMapFromEmojiContainer = (emojiContainer: EmojiContainer) => {
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

export const getNicknamesMapFromMembers = (members: Member[] = []) => {
  const nicknamesMap = new Map<string, string>();
  for (let memberIndex = 0; memberIndex < members.length; memberIndex += 1) {
    const { userId, nickname } = members[memberIndex];
    nicknamesMap.set(userId, nickname);
  }
  return nicknamesMap;
};

const getUniqueListBy = <T>(arr: T[], key: keyof T): T[] => {
  const entries = arr.map((item) => [item[key], item] as [T[keyof T], T]);
  return Array.from(new Map(entries).values());
};
const getUniqueListByMessageId = (arr: BaseMessage[]) => {
  return getUniqueListBy(arr, 'messageId');
};
const sortByCreatedAt = (messages: BaseMessage[]) => {
  return messages.sort((a, b) => a.createdAt - b.createdAt);
};

export const mergeAndSortMessages = (oldMessages: BaseMessage[], newMessages: BaseMessage[]) => {
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

export const getMessageCreatedAt = (message: BaseMessage) => format(message.createdAt, 'p');

export const isSameGroup = (
  message: SendableMessageType | BaseMessage,
  comparingMessage: SendableMessageType | BaseMessage,
  currentChannel: GroupChannel,
) => {
  if (
    !(
      message
      && comparingMessage
      && message.messageType
      && message.messageType !== 'admin'
      && comparingMessage.messageType
      && comparingMessage?.messageType !== 'admin'
      && 'sender' in message
      && 'sender' in comparingMessage
      && message.createdAt
      && comparingMessage.createdAt
      && message.sender.userId
      && comparingMessage.sender.userId
    )
  ) {
    return false;
  }
  return (
    message?.sendingStatus === comparingMessage?.sendingStatus
    && message?.sender?.userId === comparingMessage?.sender?.userId
    && getMessageCreatedAt(message) === getMessageCreatedAt(comparingMessage)
    && isReadMessage(currentChannel, message) === isReadMessage(currentChannel, comparingMessage)
  );
};

export const passUnsuccessfullMessages = (allMessages: SendableMessageType[], newMessage: SendableMessageType) => {
  const { sendingStatus } = newMessage;

  if (sendingStatus === SendingStatus.SUCCEEDED || sendingStatus === SendingStatus.PENDING) {
    const lastIndexOfSucceededMessage = allMessages
      .map((message) => {
        if (message.sendingStatus) return message.sendingStatus;
        return message.isAdminMessage() ? SendingStatus.SUCCEEDED : null;
      })
      .lastIndexOf(SendingStatus.SUCCEEDED);

    if (lastIndexOfSucceededMessage + 1 < allMessages.length) {
      const messages = [...allMessages];
      messages.splice(lastIndexOfSucceededMessage + 1, 0, newMessage);
      return messages;
    }
  }
  return [...allMessages, newMessage];
};

export const pxToNumber = (px: string | number) => {
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

export const isAboutSame = (a: number, b: number, px: number) => {
  return Math.abs(a - b) <= px;
};
