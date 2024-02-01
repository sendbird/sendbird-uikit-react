import type { GroupChannel } from '@sendbird/chat/groupChannel';
import isToday from 'date-fns/isToday';
import format from 'date-fns/format';
import isThisYear from 'date-fns/isThisYear';
import isYesterday from 'date-fns/isYesterday';
import { isAudio, isGif, isImage, isVideo, isVoiceMessageMimeType } from '../../../../utils';
import { LabelStringSet } from '../../../../ui/Label';

export const getChannelTitle = (channel?: GroupChannel, currentUserId?: string, stringSet = LabelStringSet) => {
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
    .map(({ nickname }) => nickname || stringSet.NO_NAME)
    .join(', ');
};

export const getLastMessageCreatedAt = ({ channel, locale, stringSet = LabelStringSet }) => {
  const createdAt = channel?.lastMessage?.createdAt;
  const optionalParam = locale ? { locale } : null;
  if (!createdAt) {
    return '';
  }
  if (isToday(createdAt)) {
    return format(createdAt, 'p', optionalParam);
  }
  if (isYesterday(createdAt)) {
    return stringSet.MESSAGE_STATUS__YESTERDAY || 'Yesterday';
  }
  if (isThisYear(createdAt)) {
    return format(createdAt, 'MMM d', optionalParam);
  }
  return format(createdAt, 'yyyy/M/d', optionalParam);
};

export const getTotalMembers = (channel?: GroupChannel) => (channel?.memberCount ? channel.memberCount : 0);

const getChannelPreviewFileDisplayString = (mimeType: string, stringSet = LabelStringSet) => {
  if (isGif(mimeType)) {
    return stringSet?.CHANNEL_PREVIEW_LAST_MESSAGE_FILE_TYPE_GIF ?? '';
  }
  if (isImage(mimeType)) {
    return stringSet?.CHANNEL_PREVIEW_LAST_MESSAGE_FILE_TYPE_PHOTO ?? '';
  }
  if (isVideo(mimeType)) {
    return stringSet?.CHANNEL_PREVIEW_LAST_MESSAGE_FILE_TYPE_VIDEO ?? '';
  }
  if (isAudio(mimeType)) {
    return stringSet?.CHANNEL_PREVIEW_LAST_MESSAGE_FILE_TYPE_AUDIO ?? '';
  }
  if (isVoiceMessageMimeType(mimeType)) {
    return stringSet?.CHANNEL_PREVIEW_LAST_MESSAGE_FILE_TYPE_VOICE_MESSAGE ?? '';
  }
  return stringSet?.CHANNEL_PREVIEW_LAST_MESSAGE_FILE_TYPE_GENERAL ?? '';
};

const getPrettyLastMessage = (message = null, stringSet = LabelStringSet) => {
  if (!message) return '';
  if (message.isFileMessage()) {
    return getChannelPreviewFileDisplayString(message.type, stringSet);
  }
  if (message.isMultipleFilesMessage()) {
    const mimeType = message.fileInfoList?.[0]?.mimeType;
    if (isImage(mimeType) || isGif(mimeType)) {
      return stringSet?.CHANNEL_PREVIEW_LAST_MESSAGE_FILE_TYPE_PHOTO ?? '';
    }
    return getChannelPreviewFileDisplayString(mimeType, stringSet);
  }
  return message.message ?? '';
};

export const getLastMessage = (channel?: GroupChannel, stringSet = LabelStringSet) => channel?.lastMessage ? getPrettyLastMessage(channel?.lastMessage, stringSet) : '';

export const getChannelUnreadMessageCount = (channel?: GroupChannel) => channel?.unreadMessageCount ? channel.unreadMessageCount : 0;
