import format from 'date-fns/format';
import { AdminMessage, Emoji, EmojiCategory, EmojiContainer, FileMessage, GroupChannel, OpenChannel, Reaction, SendBirdInstance, User, UserMessage } from "sendbird";

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types
const SUPPORTED_MIMES = {
  IMAGE: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/svg+xml',
    'image/webp', // not supported in IE
  ],
  VIDEO: [
    'video/mpeg',
    'video/ogg',
    'video/webm',
    'video/mp4',
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
};

export interface UIKitMessageTypes {
  ADMIN: "ADMIN",
  TEXT: "TEXT",
  FILE: "FILE",
  THUMBNAIL: "THUMBNAIL",
  OG: "OG",
  UNKNOWN: "UNKNOWN",
}
const UIKitMessageTypes: UIKitMessageTypes = {
  ADMIN: "ADMIN",
  TEXT: "TEXT",
  FILE: "FILE",
  THUMBNAIL: "THUMBNAIL",
  OG: "OG",
  UNKNOWN: "UNKNOWN",
};
export interface UIKitFileTypes {
  IMAGE: "IMAGE",
  AUDIO: "AUDIO",
  VIDEO: "VIDEO",
  GIF: "GIF",
  OTHERS: "OTHERS",
}
export const UIKitFileTypes: UIKitFileTypes = {
  IMAGE: "IMAGE",
  AUDIO: "AUDIO",
  VIDEO: "VIDEO",
  GIF: "GIF",
  OTHERS: "OTHERS",
};

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

export interface OutgoingMessageStates {
  NONE: 'NONE',
  PENDING: 'PENDING',
  SENT: 'SENT',
  FAILED: 'FAILED',
  DELIVERED: 'DELIVERED',
  READ: 'READ',
  // delivered and read are only in group channel
}
const OutgoingMessageStates: OutgoingMessageStates = {
  NONE: 'NONE',
  PENDING: 'PENDING',
  SENT: 'SENT',
  FAILED: 'FAILED',
  DELIVERED: 'DELIVERED',
  READ: 'READ',
};

export type CoreMessageType = AdminMessage | UserMessage | FileMessage;

export const isImage = (type: string): boolean => SUPPORTED_MIMES.IMAGE.indexOf(type) >= 0;
export const isVideo = (type: string): boolean => SUPPORTED_MIMES.VIDEO.indexOf(type) >= 0;
export const isGif = (type: string): boolean => type === 'image/gif';
export const isSupportedFileView = (type: string): boolean => isImage(type) || isVideo(type);
export const isAudio = (type: string): boolean => SUPPORTED_MIMES.AUDIO.indexOf(type) >= 0;

export const getUIKitFileTypes = (): UIKitFileTypes => ({ ...UIKitFileTypes });
export const getUIKitFileType = (type: string): string => {
  if (isImage(type)) return UIKitFileTypes.IMAGE;
  if (isVideo(type)) return UIKitFileTypes.VIDEO;
  if (isAudio(type)) return UIKitFileTypes.AUDIO;
  if (isGif(type)) return UIKitFileTypes.GIF;
  return UIKitFileTypes.OTHERS;
};
export const getOutgoingMessageStates = (): OutgoingMessageStates => ({ ...OutgoingMessageStates });
export const getOutgoingMessageState = (channel: GroupChannel | OpenChannel, message: UserMessage | FileMessage): string => {
  if (message.sendingStatus === 'pending') return OutgoingMessageStates.PENDING;
  if (message.sendingStatus === 'failed') return OutgoingMessageStates.FAILED;
  if (channel.isGroupChannel()) {
    /* GroupChannel only */
    if ((channel as GroupChannel).getUnreadMemberCount(message) === 0) {
      return OutgoingMessageStates.READ;
    } else if ((channel as GroupChannel).getUndeliveredMemberCount(message) === 0) {
      return OutgoingMessageStates.DELIVERED;
    }
  }
  if (message.sendingStatus === 'succeeded') return OutgoingMessageStates.SENT;
  return OutgoingMessageStates.NONE;
};
export const isSentMessage = (channel: GroupChannel | OpenChannel, message: UserMessage | FileMessage): boolean => (
  getOutgoingMessageState(channel, message) === OutgoingMessageStates.SENT
  || getOutgoingMessageState(channel, message) === OutgoingMessageStates.DELIVERED
  || getOutgoingMessageState(channel, message) === OutgoingMessageStates.READ
);
export const isDeliveredMessage = (channel: GroupChannel, message: UserMessage | FileMessage): boolean => (
  getOutgoingMessageState(channel, message) === OutgoingMessageStates.DELIVERED
  || getOutgoingMessageState(channel, message) === OutgoingMessageStates.READ
);
export const isReadMessage = (channel: GroupChannel, message: UserMessage | FileMessage): boolean => (
  getOutgoingMessageState(channel, message) === OutgoingMessageStates.READ
);
export const isFailedMessage = (channel: GroupChannel | OpenChannel, message: UserMessage | FileMessage): boolean => (
  getOutgoingMessageState(channel, message) === OutgoingMessageStates.FAILED
);
export const isSentStatus = (state: string): boolean => (
  state === OutgoingMessageStates.SENT
  || state === OutgoingMessageStates.DELIVERED
  || state === OutgoingMessageStates.READ
);

export const isAdminMessage = (message: AdminMessage): boolean => (
  message && (message.isAdminMessage?.() || (message['messageType'] && message.messageType === 'admin'))
);
export const isUserMessage = (message: UserMessage): boolean => (
  message && (message.isUserMessage?.() || (message['messageType'] && message.messageType === 'user'))
);
export const isFileMessage = (message: FileMessage): boolean => (
  message && (message.isFileMessage?.() || (message['messageType'] && message.messageType === 'file'))
);

export const isOGMessage = (message: UserMessage): boolean => !!(
  message && isUserMessage(message) && message?.ogMetaData && message?.ogMetaData?.url
);
export const isTextMessage = (message: UserMessage): boolean => isUserMessage(message) && !isOGMessage(message);
export const isThumbnailMessage = (message: FileMessage): boolean => message && isFileMessage(message) && isSupportedFileView(message.type);
export const isImageMessage = (message: FileMessage): boolean => message && isThumbnailMessage(message) && isImage(message.type);
export const isVideoMessage = (message: FileMessage): boolean => message && isThumbnailMessage(message) && isVideo(message.type);
export const isGifMessage = (message: FileMessage): boolean => message && isThumbnailMessage(message) && isGif(message.type);
export const isAudioMessage = (message: FileMessage): boolean => message && isFileMessage(message) && isAudio(message.type);

export const isEditedMessage = (message: UserMessage): boolean => isUserMessage(message) && (message?.updatedAt > 0);
export const isEnabledOGMessage = (message: UserMessage): boolean => (
  (!message || !message.ogMetaData || !message.ogMetaData.url) ? false : true
);

export const getUIKitMessageTypes = (): UIKitMessageTypes => ({ ...UIKitMessageTypes });
export const getUIKitMessageType = (message: CoreMessageType): string => {
  if (isAdminMessage(message as AdminMessage)) return UIKitMessageTypes.ADMIN;
  if (isUserMessage(message as UserMessage)) {
    return isOGMessage(message as UserMessage) ? UIKitMessageTypes.OG : UIKitMessageTypes.TEXT;
  }
  if (isFileMessage(message as FileMessage)) {
    return isThumbnailMessage(message as FileMessage) ? UIKitMessageTypes.THUMBNAIL : UIKitMessageTypes.FILE;
  }
  return UIKitMessageTypes.UNKNOWN;
};
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

// TODO: Use the interface after language tranlsatation of Sendbird.js
interface UIKitStore {
  stores: {
    sdkStore: {
      sdk: SendBirdInstance,
    },
    userStore: {
      user: User,
    },
  },
  config: {
    useReaction: boolean,
  }
}
export const getCurrentUserId = (store: UIKitStore): string => (store?.stores?.userStore?.user?.userId);
export const getUseReaction = (store: UIKitStore, channel: GroupChannel | OpenChannel): boolean => {
  if (!store?.config?.useReaction)
    return false;
  if (!store?.stores?.sdkStore?.sdk?.appInfo?.isUsingReaction)
    return false;
  if (channel?.isGroupChannel())
    return !((channel as GroupChannel).isBroadcast || (channel as GroupChannel).isSuper);
  return store?.config?.useReaction;
};

export const isMessageSentByMe = (userId: string, message: UserMessage | FileMessage): boolean => (
  (userId && message?.sender?.userId) && userId === message.sender.userId
);

const URL_REG = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
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
  emojiContainer.emojiCategories
    .map((emojiCategory: EmojiCategory) => emojiCategory.emojis)
    .reduce((prevArr: Array<Emoji>, currArr: Array<Emoji>) => prevArr.concat(currArr), [])
);
export const getEmojiMapAll = (emojiContainer: EmojiContainer): Map<string, Emoji> => {
  const emojiMap = new Map();
  emojiContainer.emojiCategories.forEach((category: EmojiCategory) => category.emojis.forEach((emoji: Emoji): void => { emojiMap.set(emoji.key, emoji) }));
  return emojiMap;
};

export const getUserName = (user: User): string => (user?.friendName || user?.nickname || user?.userId);
export const getSenderName = (message: UserMessage | FileMessage): string => (message.sender && getUserName(message.sender));
export const getMessageCreatedAt = (message: UserMessage | FileMessage): string => format(message.createdAt || 0, 'p');
