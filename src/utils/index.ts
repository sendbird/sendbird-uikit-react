import { Emoji, EmojiCategory, EmojiContainer, User } from '@sendbird/chat';
import { GroupChannel, Member, GroupChannelListQuery, GroupChannelListOrder } from '@sendbird/chat/groupChannel';
import {
  AdminMessage,
  BaseMessage,
  FileMessage,
  MessageListParams,
  MultipleFilesMessage,
  Reaction,
  UploadedFileInfo,
  UserMessage,
} from '@sendbird/chat/message';
import { SendableMessage } from '@sendbird/chat/lib/__definition';

import { getOutgoingMessageState, OutgoingMessageStates } from './exports/getOutgoingMessageState';
import { HTMLTextDirection, Nullable } from '../types';
import { isSafari } from './browser';
import { match } from 'ts-pattern';
import isSameSecond from 'date-fns/isSameSecond';
import { MESSAGE_TEMPLATE_KEY } from './consts';
import { TemplateType } from '../ui/TemplateMessageItemBody/types';

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types
export const SUPPORTED_MIMES = {
  IMAGE: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/svg+xml',
    'image/webp', // not supported in IE
    'image/bmp',
  ],
  VIDEO: [
    'video/mpeg',
    'video/ogg',
    'video/webm',
    'video/mp4',
    // 'video/quicktime', // NOTE: Do not support ThumbnailMessage for the .mov video
  ],
  AUDIO: [
    'audio/aac',
    'audio/midi',
    'audio/x-midi',
    'audio/mpeg',
    'audio/ogg',
    'audio/opus',
    'audio/wav',
    'audio/webm',
    'audio/3gpp',
    'audio/3gpp2',
    'audio/mp3',
  ],
  DOCUMENT: [
    'text/plain',
    'text/css',
    'text/csv',
    'text/html',
    'text/calendar',
    'text/javascript',
    'text/xml',
    'text/x-log',
    'video/quicktime', // NOTE: Assume this video is a normal file, not video
  ],
  APPLICATION: [
    'application/x-abiword',
    'application/x-freearc',
    'application/vnd.amazon.ebook',
    'application/octet-stream',
    'application/x-bzip',
    'application/x-bzip2',
    'application/x-cdf',
    'application/x-csh',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-fontobject',
    'application/epub+zip',
    'application/gzip',
    'application/java-archive',
    'application/json',
    'application/ld+json',
    'application/vnd.apple.installer+xml',
    'application/vnd.oasis.opendocument.presentation',
    'application/vnd.oasis.opendocument.spreadsheet',
    'application/vnd.oasis.opendocument.text',
    'application/ogg',
    'application/pdf',
    'application/x-httpd-php',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.rar',
    'application/rtf',
    'application/x-sh',
    'application/x-tar',
    'application/vnd.visio',
    'application/xhtml+xml',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/xml',
    'application/vnd.mozilla.xul+xml',
    'application/zip',
    'application/x-7z-compressed',
  ],
  ARCHIVE: [
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    'application/x-tar',
    'application/gzip',
    'application/x-bzip',
    'application/x-bzip2',
    'application/x-xz',
    'application/x-iso9660-image',
  ],
};

export const SUPPORTED_FILE_EXTENSIONS = {
  IMAGE: ['.apng', '.avif', '.gif', '.jpg', '.jpeg', '.jfif', '.pjpeg', '.pjp', '.png', '.svg', '.webp', '.bmp', '.ico', '.cur', '.tif', '.tiff', '.heic', '.heif'],
  VIDEO: ['.mp4', '.webm', '.ogv', '.3gp', '.3g2', '.avi', '.mov', '.wmv', '.mpg', '.mpeg', '.m4v', '.mkv'],
  AUDIO: ['.aac', '.midi', '.mp3', '.oga', '.opus', '.wav', '.weba', '.3gp', '.3g2'],
  DOCUMENT: ['.txt', '.log', '.csv', '.rtf', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'],
  ARCHIVE: ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz', '.iso'],
};

export const getMimeTypesUIKitAccepts = (acceptableTypes?: string[]): string => {
  if (Array.isArray(acceptableTypes) && acceptableTypes.length > 0) {
    const uniqueTypes = acceptableTypes
      .reduce((prev, curr) => {
        const lowerCurr = curr.toLowerCase();
        switch (lowerCurr) {
          case 'image': {
            prev.push(...SUPPORTED_MIMES.IMAGE, ...SUPPORTED_FILE_EXTENSIONS.IMAGE);
            break;
          }
          case 'video': {
            prev.push(...SUPPORTED_MIMES.VIDEO, ...SUPPORTED_FILE_EXTENSIONS.VIDEO);
            break;
          }
          case 'audio': {
            prev.push(...SUPPORTED_MIMES.AUDIO, ...SUPPORTED_FILE_EXTENSIONS.AUDIO);
            break;
          }
          case 'archive': {
            prev.push(...SUPPORTED_MIMES.ARCHIVE, ...SUPPORTED_FILE_EXTENSIONS.ARCHIVE);
            break;
          }
          default: {
            prev.push(curr);
            break;
          }
        }
        return prev;
      }, [] as string[]);

    // To remove duplicates
    return Array.from(new Set(uniqueTypes)).join(',');
  }

  return [
    ...Object.values(SUPPORTED_MIMES).flat(),
    ...Object.values(SUPPORTED_FILE_EXTENSIONS).flat(),
  ].join(',');
};

/* eslint-disable no-redeclare */
export interface UIKitMessageTypes {
  ADMIN: 'ADMIN',
  TEXT: 'TEXT',
  FILE: 'FILE',
  MULTIPLE_FILES: 'MULTIPLE_FILES',
  THUMBNAIL: 'THUMBNAIL',
  OG: 'OG',
  UNKNOWN: 'UNKNOWN',
}
export const UIKitMessageTypes: UIKitMessageTypes = {
  ADMIN: 'ADMIN',
  TEXT: 'TEXT',
  FILE: 'FILE',
  MULTIPLE_FILES: 'MULTIPLE_FILES',
  THUMBNAIL: 'THUMBNAIL',
  OG: 'OG',
  UNKNOWN: 'UNKNOWN',
};
/* eslint-disable no-redeclare */
export interface UIKitFileTypes {
  IMAGE: 'IMAGE',
  AUDIO: 'AUDIO',
  VIDEO: 'VIDEO',
  GIF: 'GIF',
  VOICE: 'VOICE',
  OTHERS: 'OTHERS',
}
export const UIKitFileTypes: UIKitFileTypes = {
  IMAGE: 'IMAGE',
  AUDIO: 'AUDIO',
  VIDEO: 'VIDEO',
  GIF: 'GIF',
  VOICE: 'VOICE',
  OTHERS: 'OTHERS',
};

/* eslint-disable no-redeclare */
export interface SendingMessageStatus {
  NONE: 'none',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
  PENDING: 'pending',
}
const SendingMessageStatus: SendingMessageStatus = {
  NONE: 'none',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
  PENDING: 'pending',
};

export type CoreMessageType = AdminMessage | UserMessage | FileMessage | MultipleFilesMessage;
export type SendableMessageType = UserMessage | FileMessage | MultipleFilesMessage;

export const isMOVType = (type: string): boolean => type === 'video/quicktime';
/**
 * @link: https://sendbird.atlassian.net/browse/SBISSUE-16031?focusedCommentId=270601
 * We limitedly support .mov file type for ThumbnailMessage only in Safari browser.
 * */
export const isSupportedVideoFileTypeInSafari = (type: string): boolean => isSafari(navigator.userAgent) && isMOVType(type);
export const isImage = (type: string): boolean => SUPPORTED_MIMES.IMAGE.indexOf(type) >= 0;
export const isVideo = (type: string): boolean => SUPPORTED_MIMES.VIDEO.indexOf(type) >= 0
  || isSupportedVideoFileTypeInSafari(type);
export const isGif = (type: string): boolean => type === 'image/gif';
export const isSupportedFileView = (type: string): boolean => isImage(type) || isVideo(type);
export const isAudio = (type: string): boolean => SUPPORTED_MIMES.AUDIO.indexOf(type) >= 0;

export const getUIKitFileTypes = (): UIKitFileTypes => ({ ...UIKitFileTypes });
export const getUIKitFileType = (type: string): string => {
  if (isGif(type)) return UIKitFileTypes.GIF;
  if (isImage(type)) return UIKitFileTypes.IMAGE;
  if (isVideo(type)) return UIKitFileTypes.VIDEO;
  if (isAudio(type)) return UIKitFileTypes.AUDIO;
  return UIKitFileTypes.OTHERS;
};

export const isSentMessage = (
  message: SendableMessageType,
): boolean => (message.sendingStatus === 'succeeded');
export const isDeliveredMessage = (
  channel: GroupChannel,
  message: SendableMessageType,
): boolean => (
  getOutgoingMessageState(channel, message) === OutgoingMessageStates.DELIVERED
  || getOutgoingMessageState(channel, message) === OutgoingMessageStates.READ
);
export const isReadMessage = (
  channel: GroupChannel,
  message: SendableMessageType,
): boolean => (
  getOutgoingMessageState(channel, message) === OutgoingMessageStates.READ
);
// TODO: Remove channel from the params, it seems unnecessary
export const isFailedMessage = (
  message: SendableMessageType,
): boolean => (message?.sendingStatus === 'failed');
export const isPendingMessage = (
  message: SendableMessageType,
): boolean => (message?.sendingStatus === 'pending');

export const isSentStatus = (state: string): boolean => (
  state === OutgoingMessageStates.SENT
  || state === OutgoingMessageStates.DELIVERED
  || state === OutgoingMessageStates.READ
);

export const isAdminMessage = (message: CoreMessageType): message is AdminMessage => (
  message && (
    message['isAdminMessage'] && typeof message.isAdminMessage === 'function'
      ? message.isAdminMessage()
      : message?.messageType === 'admin'
  )
);
export const isUserMessage = (message: CoreMessageType): message is UserMessage => (
  message && (
    message['isUserMessage'] && typeof message.isUserMessage === 'function'
      ? message.isUserMessage()
      : message?.messageType === 'user'
  )
);
export const isFileMessage = (message?: CoreMessageType): message is FileMessage => (
  !!message && (
    message['isFileMessage'] && typeof message.isFileMessage === 'function'
      ? message.isFileMessage()
      : message?.messageType === 'file'
  )
);
export const isMultipleFilesMessage = (
  message?: CoreMessageType,
): message is MultipleFilesMessage => (
  message && (
    message['isMultipleFilesMessage'] && typeof message.isMultipleFilesMessage === 'function'
      ? message.isMultipleFilesMessage()
      : (
        message.messageType === 'file'
        && Object.prototype.hasOwnProperty.call(message, 'fileInfoList')
      )
  )
);
export const isParentMessage = (message: CoreMessageType): boolean => (
  !message.parentMessageId && !message.parentMessage && (message.threadInfo?.replyCount ?? 0) > 0
);
export const isThreadMessage = (message: CoreMessageType): boolean => (
  !!message.parentMessageId && !!message.parentMessage
);

export const isFormMessage = (message: CoreMessageType): boolean => !!(
  message.messageForm
);

export const isTemplateMessage = (message: CoreMessageType): boolean => !!(
  message && message.extendedMessagePayload?.[MESSAGE_TEMPLATE_KEY]
);

export const isValidTemplateMessageType = (templatePayload: unknown): boolean => {
  const type = templatePayload['type'];
  return !(type && !MessageTemplateTypes[type]);
};

export const MessageTemplateTypes: Record<TemplateType, TemplateType> = {
  default: 'default',
};

export const uiContainerType = {
  [MessageTemplateTypes.default]: 'ui_container_type__default',
};

export const isOGMessage = (message: CoreMessageType): message is UserMessage => {
  if (!message || !isUserMessage(message)) return false;
  return (
    !!message.ogMetaData
      && !!(message.ogMetaData.url || message.ogMetaData.title || message.ogMetaData.description || message.ogMetaData.defaultImage)
  );
};

export const isTextMessage = (message: CoreMessageType): message is UserMessage => {
  return isUserMessage(message);
};

export const isThumbnailMessage = (message: CoreMessageType): message is FileMessage => {
  if (!message || !isFileMessage(message)) return false;
  return isSupportedFileView(message.type);
};

export const isImageMessage = (message: SendableMessageType): message is FileMessage => {
  if (!message || !isFileMessage(message)) return false;
  return isThumbnailMessage(message) && isImage(message.type);
};

export const isVideoMessage = (message: SendableMessageType): message is FileMessage => {
  if (!message || !isFileMessage(message)) return false;
  return isThumbnailMessage(message) && isVideo(message.type);
};

export const isGifMessage = (message: SendableMessageType): message is FileMessage => {
  if (!message || !isFileMessage(message)) return false;
  return isThumbnailMessage(message) && isGif(message.type);
};

export const isAudioMessage = (message: CoreMessageType): message is FileMessage => {
  if (!message || !isFileMessage(message)) return false;
  return isAudio(message.type);
};

export const isImageFileInfo = (fileInfo: UploadedFileInfo): boolean => {
  if (!fileInfo) return false;
  return !!fileInfo.mimeType && (isImage(fileInfo.mimeType) || isGif(fileInfo.mimeType));
};

export const isAudioMessageMimeType = (type: string): boolean => (/^audio\//.test(type));
export const isVoiceMessageMimeType = (type: string): boolean => (/^voice\//.test(type));
export const isVoiceMessage = (message: Nullable<CoreMessageType>): boolean => {
  if (!message || !isFileMessage(message) || !message.type) return false;

  // ex) audio/m4a OR audio/m4a;sbu_type=voice
  const [mimeType, typeParameter] = (message as FileMessage).type.split(';');

  if (!isAudioMessageMimeType(mimeType)) {
    return false;
  }

  if (typeParameter) {
    const [key, value] = typeParameter.split('=');
    return key === 'sbu_type' && value === 'voice';
  }
  // ex) message.metaArrays = [{ key: 'KEY_INTERNAL_MESSAGE_TYPE', value: ['voice/m4a'] }]
  return isVoiceMessageMimeType(message?.metaArrays?.find((metaArray) => metaArray.key === 'KEY_INTERNAL_MESSAGE_TYPE')?.value?.[0] ?? '');
};

export const isEditedMessage = (
  message: CoreMessageType,
): boolean => isUserMessage(message) && (message?.updatedAt > 0);
export const isEnabledOGMessage = (message: UserMessage): boolean => (
  (!message || !message.ogMetaData || !message.ogMetaData.url) ? false : true
);

export const getUIKitMessageTypes = (): UIKitMessageTypes => ({ ...UIKitMessageTypes });

/**
 * Do not use this for MultipleFilesMessage. Use isMultipleFilesMessage() instead.
 */
export const getUIKitMessageType = (
  message: CoreMessageType,
): string => {
  if (isAdminMessage(message as AdminMessage)) return UIKitMessageTypes.ADMIN;
  if (isUserMessage(message as UserMessage)) {
    return isOGMessage(message as UserMessage) ? UIKitMessageTypes.OG : UIKitMessageTypes.TEXT;
  }
  // This is only a safeguard to not return UNKNOWN for MFM.
  if (isMultipleFilesMessage(message as FileMessage)) {
    return UIKitMessageTypes.MULTIPLE_FILES;
  }
  if (isFileMessage(message as FileMessage)) {
    if (isThumbnailMessage(message as FileMessage)) {
      return UIKitMessageTypes.THUMBNAIL;
    }
    if (isVoiceMessage(message as FileMessage)) {
      return UIKitFileTypes.VOICE;
    }
    return UIKitMessageTypes.FILE;
  }
  return UIKitMessageTypes.UNKNOWN;
};
/**
 * @deprecated use SendingStatus of @sendbird/chat instead
 * */
export const getSendingMessageStatus = (): SendingMessageStatus => ({ ...SendingMessageStatus });

const reducer = (accumulator: Array<string>, currentValue: string | Array<string>): Array<any> => {
  if (Array.isArray(currentValue)) {
    return [...accumulator, ...currentValue];
  } else {
    accumulator.push(currentValue);
    return accumulator;
  }
};
export const getClassName = (classNames: string | Array<string | Array<string>>): string => (
  Array.isArray(classNames)
    ? classNames.reduce(reducer, []).join(' ')
    : classNames
);

export const isReactedBy = (userId: string, reaction: Reaction): boolean => (
  reaction.userIds.some((reactorUserId: string): boolean => reactorUserId === userId)
);
interface StringSet {
  TOOLTIP__YOU: string;
  TOOLTIP__AND_YOU: string;
  TOOLTIP__UNKNOWN_USER: string;
}
export const getEmojiTooltipString = (reaction: Reaction, userId: string, memberNicknamesMap: Map<string, string>, stringSet: StringSet): string => {
  let you = '';
  if (isReactedBy(userId, reaction)) {
    you = reaction.userIds.length === 1 ? stringSet.TOOLTIP__YOU : stringSet.TOOLTIP__AND_YOU;
  }
  return (`${reaction.userIds
    .filter((reactorUserId: string) => reactorUserId !== userId)
    .map((reactorUserId: string) => (memberNicknamesMap.get(reactorUserId) || stringSet.TOOLTIP__UNKNOWN_USER))
    .join(', ')}${you}`);
};

export function getSuggestedReplies(message?: BaseMessage): string[] {
  if (message?.extendedMessagePayload && Array.isArray(message?.extendedMessagePayload?.suggested_replies)) {
    return message.extendedMessagePayload.suggested_replies;
  } else {
    return [];
  }
}

const URL_REG = /^((http|https):\/\/)?([a-z\d-]+\.)+[a-z]{2,}(\:[0-9]{1,5})?(\/[-a-zA-Z\d%_.~+&=]*)*(\?[;&a-zA-Z\d%_.~+=-]*)?(#\S*)?$/;
/** @deprecated
 * URL detection in a message text will be handled in utils/tokens/tokenize.ts
 */
export const isUrl = (text: string): boolean => URL_REG.test(text);

export const truncateString = (fullStr: string, strLen?: number): string => {
  if (!strLen) strLen = 40;
  if (fullStr === null || fullStr === undefined) return '';
  if (fullStr.length <= strLen) return fullStr;
  const separator = '...';
  const sepLen = separator.length;
  const charsToShow = strLen - sepLen;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars);
};

export const copyToClipboard = (text: string): boolean => {
  // @ts-ignore: Unreachable code error
  if (window.clipboardData && window.clipboardData.setData) {
    // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
    // @ts-ignore: Unreachable code error
    return window.clipboardData.setData('Text', text);
  }
  if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
    const textarea = document.createElement('textarea');
    textarea.textContent = text;
    textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in Microsoft Edge.
    document.body.appendChild(textarea);
    textarea.select();
    try {
      return document.execCommand('copy'); // Security exception may be thrown by some browsers.
    } catch (ex) {
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
  return false;
};

export const getEmojiListAll = (emojiContainer: EmojiContainer): Array<Emoji> => (
  emojiContainer?.emojiCategories?.map((emojiCategory: EmojiCategory) => emojiCategory.emojis)
    .reduce((prevArr: Array<Emoji>, currArr: Array<Emoji>) => prevArr.concat(currArr), [])
);
export const getEmojiMapAll = (emojiContainer: EmojiContainer): Map<string, Emoji> => {
  const emojiMap = new Map();
  emojiContainer?.emojiCategories?.forEach((category: EmojiCategory) => {
    category?.emojis?.forEach((emoji: Emoji): void => {
      if (emoji && emoji.key) {
        emojiMap.set(emoji.key, emoji);
      }
    });
  });
  return emojiMap;
};
export const getEmojiListByCategoryIds = (emojiContainer: EmojiContainer, categoryIds: number[]): Array<Emoji> => {
  if (!categoryIds) return getEmojiListAll(emojiContainer) || [];

  return emojiContainer?.emojiCategories
    ?.filter((emojiCategory: EmojiCategory) => categoryIds.includes(emojiCategory.id))
    .flatMap((emojiCategory: EmojiCategory) => emojiCategory.emojis) || [];
};
const findEmojiUrl = (targetKey: string) => ({ key }) => key === targetKey;
export const getEmojiUrl = (emojiContainer?: EmojiContainer, emojiKey?: string): string => {
  const isFindingKey = findEmojiUrl(emojiKey ?? '');
  return emojiContainer?.emojiCategories
    .find((category) => category.emojis.some(isFindingKey))?.emojis
    .find(isFindingKey)
    ?.url || '';
};

export const getUserName = (user: User): string => (user?.friendName || user?.nickname || user?.userId);
export const getSenderName = (message: SendableMessageType): string => (
  message?.sender && getUserName(message?.sender)
);

export const hasSameMembers = <T>(a: T[], b: T[]): boolean => {
  if (a === b) {
    return true;
  }
  if (a == null || b == null) {
    return false;
  }
  if (a.length !== b.length) {
    return false;
  }

  const sortedA = [...a].sort();
  const sortedB = [...b].sort();

  for (let i = 0; i < sortedA.length; ++i) {
    if (sortedA[i] !== sortedB[i]) {
      return false;
    }
  }
  return true;
};
export const isFriend = (user: Nullable<User>): boolean => {
  if (!user) return false;
  return !!(user.friendDiscoveryKey || user.friendName);
};

export const filterMessageListParams = (
  params: MessageListParams,
  message: SendableMessageType,
): boolean => {
  const { customTypesFilter = [] } = params;
  // @ts-ignore
  if (params?.messageTypeFilter && params.messageTypeFilter !== message.messageType) {
    return false;
  }
  if (customTypesFilter?.length > 0) {
    const customTypes = customTypesFilter.filter((item) => item !== '*');
    // Because Chat SDK inserts '*' when customTypes is empty
    if (customTypes.length > 0 && !customTypes.includes(message.customType)) {
      return false;
    }
  }
  if (params?.senderUserIdsFilter && params?.senderUserIdsFilter?.length > 0) {
    if (message?.isUserMessage?.() || message?.isFileMessage?.()) {
      const messageSender = (message as SendableMessageType).sender || message['_sender'];
      if (!params?.senderUserIdsFilter?.includes(messageSender?.userId)) {
        return false;
      }
    } else {
      return false;
    }
  }
  if (!params?.includeParentMessageInfo && (message?.parentMessageId || message?.parentMessage)) {
    return false;
  }
  return true;
};

export const filterChannelListParams = (params: GroupChannelListQuery, channel: GroupChannel, currentUserId: string): boolean => {
  const {
    includeEmpty,
    includeFrozen,
    searchFilter,
    userIdsFilter,
    customTypesFilter,
    channelUrlsFilter,
    customTypeStartsWithFilter,
    channelNameContainsFilter,
    nicknameContainsFilter,
    myMemberStateFilter,
    hiddenChannelFilter,
    unreadChannelFilter,
    publicChannelFilter,
    superChannelFilter,
    metadataKey = '',
    metadataValues = ['a', 'b'],
    metadataValueStartsWith,
  } = params;

  if (!includeEmpty && channel?.lastMessage === null) {
    return false;
  }
  if (searchFilter?.query && (searchFilter?.fields?.length ?? 0) > 0) {
    const searchQuery = searchFilter.query;
    const searchFields = searchFilter.fields;
    if (searchQuery && searchFields && searchFields.length > 0) {
      if (!searchFields.some((searchField) => {
        switch (searchField) {
          case 'channel_name': {
            return channel?.name?.toLowerCase().includes(searchQuery.toLowerCase());
          }
          case 'member_nickname': {
            return channel?.members?.some((member: Member) => member.nickname.toLowerCase().includes(searchQuery.toLowerCase()));
          }
          default: {
            return true;
          }
        }
      })) {
        return false;
      }
    }
  }
  if (userIdsFilter?.userIds?.length > 0) {
    const { includeMode, queryType } = userIdsFilter;
    const userIds: Array<string> = userIdsFilter.userIds;
    const memberIds = channel?.members?.map((member: Member) => member.userId);
    if (!includeMode) { // exact match
      if (!userIds.includes(currentUserId)) {
        userIds.push(currentUserId); // add the caller's userId if not added already.
      }
      if (channel?.members?.length > userIds.length) {
        return false; // userIds may contain one or more non-member(s).
      }
      if (!hasSameMembers(userIds, memberIds)) {
        return false;
      }
    } else if (userIds.length > 0) { // inclusive
      switch (queryType) {
        case 'AND': {
          if (userIds.some((userId: string) => !memberIds.includes(userId))) {
            return false;
          }
          break;
        }
        case 'OR': {
          if (userIds.every((userId: string) => !memberIds.includes(userId))) {
            return false;
          }
          break;
        }
        default: {
          break;
        }
      }
    }
  }
  if (includeEmpty === false && channel?.lastMessage === null) {
    return false;
  }
  if (includeFrozen === false && channel?.isFrozen === true) {
    return false;
  }
  if (customTypesFilter && !customTypesFilter.includes(channel?.customType)) {
    return false;
  }
  if (customTypeStartsWithFilter && !new RegExp(`^${customTypeStartsWithFilter}`).test(channel?.customType)) {
    return false;
  }
  if (channelNameContainsFilter && !channel?.name?.toLowerCase().includes(channelNameContainsFilter.toLowerCase())) {
    return false;
  }
  if (nicknameContainsFilter) {
    const lowerCasedSubString = nicknameContainsFilter.toLowerCase();
    if (channel?.members?.every((member: Member) => !member.nickname.toLowerCase().includes(lowerCasedSubString))) {
      return false;
    }
  }
  if (channelUrlsFilter && !channelUrlsFilter.includes(channel?.url)) {
    return false;
  }
  if (myMemberStateFilter) {
    switch (myMemberStateFilter) {
      case 'joined_only':
        if (channel?.myMemberState !== 'joined') {
          return false;
        }
        break;
      case 'invited_only':
        if (channel?.myMemberState !== 'invited') {
          return false;
        }
        break;
      case 'invited_by_friend':
        if (channel?.myMemberState !== 'invited' || !isFriend(channel?.inviter)) {
          return false;
        }
        break;
      case 'invited_by_non_friend':
        if (channel?.myMemberState !== 'invited' || isFriend(channel?.inviter)) {
          return false;
        }
        break;
    }
  }
  if (hiddenChannelFilter) {
    switch (hiddenChannelFilter) {
      case 'unhidden_only':
        if (channel?.isHidden || channel?.hiddenState !== 'unhidden') {
          return false;
        }
        break;
      case 'hidden_only':
        if (!channel?.isHidden) {
          return false;
        }
        break;
      case 'hidden_allow_auto_unhide':
        if (!channel?.isHidden || channel?.hiddenState !== 'hidden_allow_auto_unhide') {
          return false;
        }
        break;
      case 'hidden_prevent_auto_unhide':
        if (!channel?.isHidden || channel?.hiddenState !== 'hidden_prevent_auto_unhide') {
          return false;
        }
        break;
    }
  }
  if (unreadChannelFilter) {
    switch (unreadChannelFilter) {
      case 'unread_message':
        if (channel?.unreadMessageCount === 0) {
          return false;
        }
        break;
    }
  }
  if (publicChannelFilter) {
    switch (publicChannelFilter) {
      case 'public':
        if (!channel?.isPublic) {
          return false;
        }
        break;
      case 'private':
        if (channel?.isPublic) {
          return false;
        }
        break;
    }
  }
  if (superChannelFilter) {
    switch (superChannelFilter) {
      case 'super':
        if (!channel?.isSuper) {
          return false;
        }
        break;
      case 'nonsuper':
        if (channel?.isSuper) {
          return false;
        }
        break;
    }
  }
  const { cachedMetaData = {} } = channel;
  if (metadataKey && (metadataValues || metadataValueStartsWith)) {
    const metadataValue: string = cachedMetaData[metadataKey];
    if (!metadataValue) {
      return false;
    }
    if (metadataValues && !metadataValues.every(value => metadataValue.includes(value))) {
      return false;
    }
    if (metadataValueStartsWith && !metadataValue.startsWith(metadataValueStartsWith)) {
      return false;
    }
  }
  return true;
};

export const sortChannelList = (channels: GroupChannel[], order: GroupChannelListOrder) => {
  const compareFunc = match(order)
    .with(GroupChannelListOrder.CHANNEL_NAME_ALPHABETICAL, () => (
      (a: GroupChannel, b: GroupChannel) => a.name.localeCompare(b.name)
    ))
    .with(GroupChannelListOrder.CHRONOLOGICAL, () => (
      (a: GroupChannel, b: GroupChannel) => b.createdAt - a.createdAt
    ))
    .otherwise(() => (
      (a: GroupChannel, b: GroupChannel) => (b.lastMessage?.createdAt ?? Number.MIN_SAFE_INTEGER) - (a.lastMessage?.createdAt ?? Number.MIN_SAFE_INTEGER)
    ));
  return channels.sort(compareFunc);
};

/**
 * Upserts given channel to the channel list and then returns the sorted channel list.
 */
export const getChannelsWithUpsertedChannel = (
  _channels: Array<GroupChannel>,
  channel: GroupChannel,
  order?: GroupChannelListOrder,
): Array<GroupChannel> => {
  const channels = [..._channels];
  const findingIndex = channels.findIndex((ch) => ch.url === channel.url);
  if (findingIndex !== -1) {
    channels[findingIndex] = channel;
  } else {
    channels.push(channel);
  }
  return sortChannelList(channels, order ?? GroupChannelListOrder.LATEST_LAST_MESSAGE);
};

export enum StringObjType {
  normal = 'normal',
  mention = 'mention',
  url = 'url',
}
export interface StringObj {
  type: StringObjType;
  value: string;
  userId?: string;
}

/**
 * @deprecated
 * use modules/message/utils/tokenize instead
 */
export const convertWordToStringObj = (word: string, _users: Array<User>, _template?: string): Array<StringObj> => {
  const users = _users || [];
  const template = _template || '@'; // Use global variable
  const resultArray: Array<StringObj> = [];
  const regex = RegExp(`${template}{(${users.map((user) => user?.userId).join('|')})}`, 'g');
  let excutionResult;
  let lastIndex = 0;
  while ((excutionResult = regex.exec(word)) !== null) {
    const [template, userId] = excutionResult;
    const endIndex = regex.lastIndex;
    const startIndex = endIndex - template.length;
    // Normal text
    const normalText = word.slice(lastIndex, startIndex);
    resultArray.push({
      type: isUrl(normalText) ? StringObjType.url : StringObjType.normal,
      value: normalText,
    });
    // Mention template
    const mentionedUser = users.find((user) => user?.userId === userId);
    if (!mentionedUser) {
      resultArray.push({
        type: StringObjType.normal,
        value: template, // because template is the origin text
      });
    } else {
      resultArray.push({
        type: StringObjType.mention,
        value: mentionedUser?.nickname || '(No name)',
        userId: userId,
      });
    }
    lastIndex = endIndex;
  }
  if (lastIndex < word.length) {
    // Normal text
    const normalText = word.slice(lastIndex);
    resultArray.push({
      type: isUrl(normalText) ? StringObjType.url : StringObjType.normal,
      value: normalText,
    });
  }
  return resultArray;
};

export const arrayEqual = (array1: Array<unknown>, array2: Array<unknown>): boolean => {
  if (Array.isArray(array1) && Array.isArray(array2) && array1.length === array2.length) {
    for (let i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) {
        return false;
      }
    }
    return true;
  }
  return false;
};

export const isSendableMessage = (message?: BaseMessage | null): message is SendableMessageType => {
  return Boolean(message) && 'sender' in (message as SendableMessage);
};

/**
 * If the channel is just created, the channel's createdAt and currentUser's invitedAt are the same.
 */
export const isChannelJustCreated = (channel: GroupChannel): boolean => {
  return isSameSecond(channel.createdAt, channel.invitedAt) && !channel.lastMessage;
};

export const getHTMLTextDirection = (direction: HTMLTextDirection, forceLeftToRightMessageLayout: boolean): string => {
  return forceLeftToRightMessageLayout ? 'ltr' : direction;
};

export const DEFAULT_GROUP_CHANNEL_NAME = 'Group Channel';

export const DEFAULT_AI_CHATBOT_CHANNEL_NAME = 'AI Chatbot Widget Channel';

export const isDefaultChannelName = (channel: GroupChannel) => {
  return (
    !channel?.name
    || channel.name === DEFAULT_GROUP_CHANNEL_NAME
    || channel.name === DEFAULT_AI_CHATBOT_CHANNEL_NAME
  );
};
