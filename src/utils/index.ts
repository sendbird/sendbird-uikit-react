import SendBird, { AdminMessage, Emoji, EmojiCategory, EmojiContainer, FileMessage, GroupChannel, GroupChannelListQuery, Member, MessageListParams, OpenChannel, Reaction, SendBirdInstance, User, UserMessage } from "sendbird";
import { EveryMessage } from '../types';

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
export const OutgoingMessageStates: OutgoingMessageStates = {
  NONE: 'NONE',
  PENDING: 'PENDING',
  SENT: 'SENT',
  FAILED: 'FAILED',
  DELIVERED: 'DELIVERED',
  READ: 'READ',
};

export type CoreMessageType = EveryMessage;

export const isTextuallyNull = (text: string): boolean => {
  if (text === '' || text === null) {
    return true;
  }
  return false;
};

export const isImage = (type: string): boolean => SUPPORTED_MIMES.IMAGE.indexOf(type) >= 0;
export const isVideo = (type: string): boolean => SUPPORTED_MIMES.VIDEO.indexOf(type) >= 0;
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
export const getOutgoingMessageStates = (): OutgoingMessageStates => ({ ...OutgoingMessageStates });
export const getOutgoingMessageState = (channel: GroupChannel | OpenChannel, message: UserMessage | FileMessage): string => {
  if (message.sendingStatus === 'pending') return OutgoingMessageStates.PENDING;
  if (message.sendingStatus === 'failed') return OutgoingMessageStates.FAILED;
  if (channel?.isGroupChannel?.()) {
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
export const isSentMessage = (message: UserMessage | FileMessage): boolean => (message.sendingStatus === 'succeeded');
export const isDeliveredMessage = (channel: GroupChannel, message: UserMessage | FileMessage): boolean => (
  getOutgoingMessageState(channel, message) === OutgoingMessageStates.DELIVERED
  || getOutgoingMessageState(channel, message) === OutgoingMessageStates.READ
);
export const isReadMessage = (channel: GroupChannel, message: UserMessage | FileMessage): boolean => (
  getOutgoingMessageState(channel, message) === OutgoingMessageStates.READ
);
// TODO: Remove channel from the params, it seems unnecessary
export const isFailedMessage = (message: UserMessage | FileMessage): boolean => (message.sendingStatus === 'failed');
export const isPendingMessage = (message: UserMessage | FileMessage): boolean => (message.sendingStatus === 'pending');
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
export const getUIKitMessageType = (message: SendBird.UserMessage | SendBird.FileMessage | SendBird.AdminMessage): string => {
  if (isAdminMessage(message as SendBird.AdminMessage)) return UIKitMessageTypes.ADMIN;
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
const MENTION_TAG_REG = /\@\{.*?\}/i;
export const isMentionedText = (text: string): boolean => MENTION_TAG_REG.test(text);

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

export const getUserName = (user: User): string => (user?.friendName || user?.nickname || user?.userId);
export const getSenderName = (message: UserMessage | FileMessage): string => (message.sender && getUserName(message.sender));

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
}
export const isFriend = (user: User): boolean => !!(user.friendDiscoveryKey || user.friendName);

export const filterMessageListParams = (params: MessageListParams, message: UserMessage | FileMessage): boolean => {
  if (params?.messageType && params.messageType !== message.messageType) {
    return false;
  }
  if (params?.customTypes?.length > 0) {
    const customTypes = params.customTypes.filter((item) => item !== '*');
    // Because Chat SDK inserts '*' when customTypes is empty
    if (customTypes.length > 0 && !customTypes.includes(message.customType)) {
      return false;
    }
  }
  if (params?.senderUserIds && params?.senderUserIds?.length > 0) {
    if (message?.isUserMessage() || message.isFileMessage()) {
      const messageSender = (message as UserMessage | FileMessage).sender || message['_sender'];
      if (!params?.senderUserIds?.includes(messageSender?.userId)) {
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

interface SDKChannelListParamsPrivateProps extends GroupChannelListQuery {
  _searchFilter: {
    search_query: string,
    search_fields: Array<'member_nickname' | 'channel_name'>,
  };
  _userIdsFilter: {
    userIds: Array<string>,
    includeMode: boolean,
    queryType: 'AND' | 'OR',
  };
}
export const filterChannelListParams = (params: SDKChannelListParamsPrivateProps, channel: GroupChannel, currentUserId: string): boolean => {
  if (!params?.includeEmpty && channel?.lastMessage && channel.lastMessage === null) {
    return false;
  }
  if (params?._searchFilter?.search_query && params._searchFilter.search_fields?.length > 0) {
    const searchFilter = params._searchFilter;
    const searchQuery = searchFilter.search_query;
    const searchFields = searchFilter.search_fields;
    if (searchQuery && searchFields && searchFields.length > 0) {
      if (!searchFields.some((searchField) => {
        switch (searchField) {
          case 'channel_name': {
            return channel.name.toLowerCase().includes(searchQuery.toLowerCase());
          }
          case 'member_nickname': {
            return channel.members.some((member: Member) => member.nickname.toLowerCase().includes(searchQuery.toLowerCase()));
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
  if (params?._userIdsFilter?.userIds?.length > 0) {
    const userIdsFilter = params._userIdsFilter;
    const { includeMode, queryType } = userIdsFilter;
    const userIds: string[] = userIdsFilter.userIds;
    const memberIds = channel.members.map((member: Member) => member.userId);
    if (!includeMode) { // exact match
      if (!userIds.includes(currentUserId)) {
        userIds.push(currentUserId); // add the caller's userId if not added already.
      }
      if (channel.members.length > userIds.length) {
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
  if (params?.includeEmpty === false && channel?.lastMessage === null) {
    return false;
  }
  if (params?.includeFrozen === false && channel?.isFrozen === true) {
    return false;
  }
  if (params?.customTypesFilter?.length > 0 && !params.customTypesFilter.includes(channel?.customType)) {
    return false;
  }
  if (params?.customTypeStartsWithFilter && !new RegExp(`^${params.customTypeStartsWithFilter}`).test(channel?.customType)) {
    return false;
  }
  if (params?.channelNameContainsFilter && !channel?.name?.toLowerCase().includes(params.channelNameContainsFilter.toLowerCase())) {
    return false;
  }
  if (params?.nicknameContainsFilter) {
    const lowerCasedSubString = params.nicknameContainsFilter.toLowerCase();
    if (channel?.members?.every((member: Member) => !member.nickname.toLowerCase().includes(lowerCasedSubString))) {
      return false;
    }
  }
  if (params?.channelUrlsFilter?.length > 0 && !params.channelUrlsFilter.includes(channel?.url)) {
    return false;
  }
  if (params?.memberStateFilter) {
    switch (params.memberStateFilter) {
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
        if (channel?.myMemberState !== 'invited' || !isFriend(channel.inviter)) {
          return false;
        }
        break;
      case 'invited_by_non_friend':
        if (channel?.myMemberState !== 'invited' || isFriend(channel.inviter)) {
          return false;
        }
        break;
    }
  }
  if (params?.hiddenChannelFilter) {
    switch (params.hiddenChannelFilter) {
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
  if (params?.unreadChannelFilter) {
    switch (params.unreadChannelFilter) {
      case 'unread_message':
        if (channel?.unreadMessageCount === 0) {
          return false;
        }
        break;
    }
  }
  if (params?.publicChannelFilter) {
    switch (params.publicChannelFilter) {
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
  if (params?.superChannelFilter) {
    switch (params.superChannelFilter) {
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
  return true;
};

export const binarySearch = (list: Array<number>, number: number): number => {// [100, 99, 98, 97, ...]
  const pivot = Math.floor(list.length / 2);
  if (list[pivot] === number) {
    return pivot;
  }
  const leftList = list.slice(0, pivot);
  const rightList = list.slice(pivot + 1, list.length);
  if (list[pivot] > number) {
    return pivot + 1 + (rightList.length === 0 ? 0 : binarySearch(rightList, number));
  } else {
    return (leftList.length === 0) ? pivot : binarySearch(leftList, number);
  }
};
// This is required when channel is displayed on channel list by filter
export const getChannelsWithUpsertedChannel = (channels: Array<GroupChannel>, channel: GroupChannel): Array<GroupChannel> => {
  if (channels.some((ch: GroupChannel) => ch.url === channel.url)) {
    return channels.map((ch: GroupChannel) => (ch.url === channel.url ? channel : ch));
  }
  const targetIndex = binarySearch(
    channels.map((channel: GroupChannel) => channel?.lastMessage?.createdAt || channel?.createdAt),
    channel?.lastMessage?.createdAt || channel?.createdAt
  );
  return [...channels.slice(0, targetIndex), channel, ...channels.slice(targetIndex, channels.length)];
};

export const getMatchedUserIds = (word: string, users: Array<SendBird.User>, _template?: string): boolean => {
  const template = _template || '@'; // Use global variable
  // const matchedUserIds = [];
  // users.map((user) => user?.userId).forEach((userId) => {
  //   if (word.indexOf(`${template}{${userId}}`) > -1) {
  //     matchedUserIds.push(userId);
  //   }
  // });
  // return matchedUserIds;
  return users.map((user) => user?.userId).some((userId) => word.indexOf(`${template}{${userId}}`) > -1);
};

export enum StringObjType { normal, mention, url }
export interface StringObj {
  type: StringObjType;
  value: string;
  userId?: string;
}

export const convertWordToStringObj = (word: string, _users : Array<SendBird.User>, _template?: string): Array<StringObj> => {
  const users = _users || [];
  const template = _template || '@'; // Use global variable
  const resultArray = [];
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
        value: template,  // because template is the origin text
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
