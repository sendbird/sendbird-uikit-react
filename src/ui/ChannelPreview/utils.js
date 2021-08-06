import isToday from 'date-fns/isToday';
import format from 'date-fns/format';
import isYesterday from 'date-fns/isYesterday';

import { truncate } from '../../utils';
import { LabelStringSet } from '../Label';

export const getChannelTitle = (channel = {}, currentUserId, stringSet = LabelStringSet) => {
  if (!channel || (!channel.name && !channel.members)) {
    return stringSet.NO_TITLE;
  }
  if (channel.name && channel.name !== 'Group Channel') {
    return channel.name;
  }
  if (channel.members.length === 1) {
    return stringSet.NO_MEMBERS;
  }

  return channel.members
    .filter(({ userId }) => userId !== currentUserId)
    .map(({ nickname }) => (nickname || stringSet.NO_NAME))
    .join(', ');
};

export const getLastMessageCreatedAt = (channel) => {
  if (!channel || !channel.lastMessage) {
    return '';
  }
  const date = channel.lastMessage.createdAt;
  if (isToday(date)) {
    return format(date, 'p');
  }

  if (isYesterday(date)) {
    return 'Yesterday';
  }

  return format(date, 'MMM dd');
};

export const getTotalMembers = (channel) => (
  channel && channel.memberCount
    ? channel.memberCount
    : 0
);

const getPrettyLastMessage = (message = {}) => {
  const MAXLEN = 30;
  const { messageType, name } = message;
  if (messageType === 'file') {
    return truncate(name, MAXLEN);
  }
  return message.message;
};

export const getLastMessage = (channel) => (
  channel && channel.lastMessage
    ? getPrettyLastMessage(channel.lastMessage)
    : ''
);

export const getChannelUnreadMessageCount = (channel) => (
  (channel && channel.unreadMessageCount)
    ? channel.unreadMessageCount
    : 0
);
