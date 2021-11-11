import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import SendBird from 'sendbird';
import { LabelStringSet } from '../../../../ui/Label';

export const prettyDate = (date: Date): string => formatDistanceToNowStrict(date, { addSuffix: true });

export const getChannelTitle = (
  channel: SendBird.GroupChannel,
  currentUserId: string,
  stringSet: { [label: string]: string }
  ): string => {
  const LABEL_STRING_SET: { [label: string]: string } = stringSet || LabelStringSet;
  if (!channel || (!channel.name && !channel.members)) {
    return LABEL_STRING_SET.NO_TITLE;
  }
  if (channel.name && channel.name !== 'Group Channel') {
    return channel.name;
  }

  if (channel.members.length === 1) {
    return LABEL_STRING_SET.NO_MEMBERS;
  }

  return channel.members
    .filter(({ userId }) => userId !== currentUserId)
    .map(({ nickname }) => (nickname || LABEL_STRING_SET.NO_NAME))
    .join(', ');
};
