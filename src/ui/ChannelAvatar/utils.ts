export const DEFAULT_URL_PREFIX = 'https://static.sendbird.com/sample/cover/cover_';

export const getOpenChannelAvatar = (channel: SendBird.OpenChannel): string => {
  if (channel && channel.coverUrl) {
    return channel.coverUrl;
  }
};

export const getChannelAvatarSource = (channel: SendBird.GroupChannel, currentUserId: string): string | Array<string> => {
  if (channel && channel.coverUrl) {
    if (!(new RegExp(`^${DEFAULT_URL_PREFIX}`).test(channel.coverUrl))) {
      return channel.coverUrl;
    }
  }

  return channel && channel.members
    ? channel.members
      .filter((member) => member.userId !== currentUserId)
      .map(({ profileUrl }) => profileUrl)
    : [];
};


export const generateDefaultAvatar = (channel: SendBird.GroupChannel): boolean => {
  if (channel && channel.coverUrl) {
    if (new RegExp(`^${DEFAULT_URL_PREFIX}`).test(channel.coverUrl)) {
      return true;
    }
    return false;
  }
  return true;
}
