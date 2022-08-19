import { GroupChannel } from '@sendbird/chat/groupChannel';

export const getChannelTitle = (channel: GroupChannel, currentUserId: string, stringSet: { [key: string]: string }): string => {
  if (!channel?.name && !channel?.members) {
    return stringSet.NO_TITLE;
  }
  if (channel?.name && channel.name !== 'Group Channel') {
    return channel.name;
  }

  if (channel?.members?.length === 1) {
    return stringSet.NO_MEMBERS;
  }

  return (channel?.members || [])
    .filter(({ userId }) => userId !== currentUserId)
    .map(({ nickname }) => (nickname || stringSet.NO_NAME))
    .join(', ');
};
