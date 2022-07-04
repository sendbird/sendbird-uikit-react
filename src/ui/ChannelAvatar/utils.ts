import type { GroupChannel } from "@sendbird/chat/groupChannel";
import type { OpenChannel } from "@sendbird/chat/openChannel";

export const DEFAULT_URL_PREFIX = 'https://static.sendbird.com/sample/cover/cover_';

export const getOpenChannelAvatar = (channel: OpenChannel): string => {
  if (channel?.coverUrl) {
    return channel.coverUrl;
  }
};

export const getChannelAvatarSource = (channel: GroupChannel, currentUserId: string): string | Array<string> => {
  if (channel?.coverUrl) {
    if (!(new RegExp(`^${DEFAULT_URL_PREFIX}`).test(channel.coverUrl))) {
      return channel.coverUrl;
    }
  }
  return (channel?.members || [])
    .filter((member) => member.userId !== currentUserId)
    .map(({ profileUrl }) => profileUrl);
};

export const generateDefaultAvatar = (channel: GroupChannel): boolean => {
  if (channel?.coverUrl) {
    if (new RegExp(`^${DEFAULT_URL_PREFIX}`).test(channel.coverUrl)) {
      return true;
    }
    return false;
  }
  return true;
}
