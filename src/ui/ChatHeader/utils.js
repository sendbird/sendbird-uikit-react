import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import { LabelStringSet } from '../Label';

export const prettyDate = (date) => formatDistanceToNowStrict(date, { addSuffix: true });


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
