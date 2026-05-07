import { GroupChannelListOrder } from '@sendbird/chat/groupChannel';
import {
  StringObjType,
  UIKitFileTypes,
  UIKitMessageTypes,
  convertWordToStringObj,
  copyToClipboard,
  filterChannelListParams,
  filterMessageListParams,
  getChannelsWithUpsertedChannel,
  getClassName,
  getEmojiListAll,
  getEmojiListByCategoryIds,
  getEmojiMapAll,
  getEmojiTooltipString,
  getEmojiUrl,
  getHTMLTextDirection,
  getMimeTypesUIKitAccepts,
  getSenderName,
  getSendingMessageStatus,
  getUIKitFileType,
  getUIKitFileTypes,
  getUIKitMessageType,
  getUIKitMessageTypes,
  getUserName,
  hasSameMembers,
  isAudio,
  isAudioMessage,
  isChannelJustCreated,
  isEditedMessage,
  isEnabledOGMessage,
  isFailedMessage,
  isFormMessage,
  isFriend,
  isGif,
  isGifMessage,
  isImage,
  isImageFileInfo,
  isImageMessage,
  isMOVType,
  isOGMessage,
  isParentMessage,
  isPendingMessage,
  isReactedBy,
  isSendableMessage,
  isSentMessage,
  isSentStatus,
  isSupportedFileView,
  isTemplateMessage,
  isTextMessage,
  isThreadMessage,
  isValidTemplateMessageType,
  isVideo,
  isVideoMessage,
  isVoiceMessage,
  isVoiceMessageMimeType,
  sortChannelList,
  truncateString,
} from '../index';
import { MESSAGE_TEMPLATE_KEY } from '../consts';

const userMessage = (overrides = {}) => ({
  messageType: 'user',
  isUserMessage: () => true,
  ogMetaData: null,
  updatedAt: 0,
  ...overrides,
} as any);

const fileMessage = (type: string, overrides = {}) => ({
  messageType: 'file',
  isFileMessage: () => true,
  type,
  ...overrides,
} as any);

const channel = (overrides = {}) => ({
  url: 'channel-url',
  name: 'Alpha',
  members: [
    { userId: 'me', nickname: 'Me' },
    { userId: 'member-1', nickname: 'Jane' },
  ],
  lastMessage: { createdAt: 100 },
  customType: 'support',
  myMemberState: 'joined',
  hiddenState: 'unhidden',
  unreadMessageCount: 1,
  isHidden: false,
  isPublic: true,
  isSuper: false,
  isFrozen: false,
  cachedMetaData: { tier: 'gold-vip' },
  createdAt: 1000,
  invitedAt: 1000,
  ...overrides,
} as any);

describe('utils/index additional coverage', () => {
  it('builds accepted mime type strings from defaults and explicit categories', () => {
    expect(getMimeTypesUIKitAccepts()).toContain('image/jpeg');
    const accepted = getMimeTypesUIKitAccepts(['image', 'video', 'audio', 'archive', 'application/custom', 'IMAGE']);

    expect(accepted).toContain('image/jpeg');
    expect(accepted).toContain('.jpg');
    expect(accepted).toContain('video/mp4');
    expect(accepted).toContain('audio/wav');
    expect(accepted).toContain('application/zip');
    expect(accepted).toContain('application/custom');
    expect(accepted.split(',').filter(type => type === 'image/jpeg')).toHaveLength(1);
  });

  it('classifies file and message types', () => {
    expect(isMOVType('video/quicktime')).toBe(true);
    expect(isImage('image/png')).toBe(true);
    expect(isVideo('video/mp4')).toBe(true);
    expect(isGif('image/gif')).toBe(true);
    expect(isSupportedFileView('image/jpeg')).toBe(true);
    expect(isAudio('audio/mp3')).toBe(true);
    expect(getUIKitFileTypes()).toEqual(UIKitFileTypes);
    expect(getUIKitFileType('image/gif')).toBe(UIKitFileTypes.GIF);
    expect(getUIKitFileType('image/png')).toBe(UIKitFileTypes.IMAGE);
    expect(getUIKitFileType('video/mp4')).toBe(UIKitFileTypes.VIDEO);
    expect(getUIKitFileType('audio/mp3')).toBe(UIKitFileTypes.AUDIO);
    expect(getUIKitFileType('application/pdf')).toBe(UIKitFileTypes.OTHERS);

    expect(getUIKitMessageTypes()).toEqual(UIKitMessageTypes);
    expect(getUIKitMessageType({ messageType: 'admin' } as any)).toBe(UIKitMessageTypes.ADMIN);
    expect(getUIKitMessageType(userMessage())).toBe(UIKitMessageTypes.TEXT);
    expect(getUIKitMessageType(userMessage({ ogMetaData: { url: 'https://sendbird.com' } }))).toBe(UIKitMessageTypes.OG);
    expect(getUIKitMessageType({ messageType: 'file', fileInfoList: [] } as any)).toBe(UIKitMessageTypes.MULTIPLE_FILES);
    expect(getUIKitMessageType(fileMessage('image/png'))).toBe(UIKitMessageTypes.THUMBNAIL);
    expect(getUIKitMessageType(fileMessage('audio/m4a;sbu_type=voice'))).toBe(UIKitFileTypes.VOICE);
    expect(getUIKitMessageType(fileMessage('application/pdf'))).toBe(UIKitMessageTypes.FILE);
    expect(getUIKitMessageType({} as any)).toBe(UIKitMessageTypes.UNKNOWN);
  });

  it('evaluates message status and feature predicates', () => {
    expect(isSentMessage({ sendingStatus: 'succeeded' } as any)).toBe(true);
    expect(isFailedMessage({ sendingStatus: 'failed' } as any)).toBe(true);
    expect(isPendingMessage({ sendingStatus: 'pending' } as any)).toBe(true);
    expect(isSentStatus('SENT')).toBe(true);
    expect(isSentStatus('FAILED')).toBe(false);
    expect(isParentMessage({ threadInfo: { replyCount: 1 } } as any)).toBe(true);
    expect(isThreadMessage({ parentMessageId: 1, parentMessage: {} } as any)).toBe(true);
    expect(isFormMessage({ messageForm: {} } as any)).toBe(true);
    expect(isTemplateMessage({ extendedMessagePayload: { [MESSAGE_TEMPLATE_KEY]: { key: 'template' } } } as any)).toBe(true);
    expect(isValidTemplateMessageType({ type: 'default' })).toBe(true);
    expect(isValidTemplateMessageType({ type: 'unknown' })).toBe(false);
    expect(isOGMessage(userMessage({ ogMetaData: { title: 'Title' } }))).toBe(true);
    expect(isTextMessage(userMessage())).toBe(true);
    expect(isImageMessage(fileMessage('image/png'))).toBe(true);
    expect(isVideoMessage(fileMessage('video/mp4'))).toBe(true);
    expect(isGifMessage(fileMessage('image/gif'))).toBe(true);
    expect(isAudioMessage(fileMessage('audio/mp3'))).toBe(true);
    expect(isImageFileInfo({ mimeType: 'image/png' } as any)).toBe(true);
    expect(isImageFileInfo(null as any)).toBe(false);
    expect(isVoiceMessageMimeType('voice/m4a')).toBe(true);
    expect(isVoiceMessage(fileMessage('audio/m4a;sbu_type=voice'))).toBe(true);
    expect(isVoiceMessage(fileMessage('audio/m4a', { metaArrays: [{ key: 'KEY_INTERNAL_MESSAGE_TYPE', value: ['voice/m4a'] }] }))).toBe(true);
    expect(isVoiceMessage(fileMessage('video/mp4'))).toBe(false);
    expect(isEditedMessage(userMessage({ updatedAt: 1 }))).toBe(true);
    expect(isEnabledOGMessage(userMessage({ ogMetaData: { url: 'https://sendbird.com' } }))).toBe(true);
    expect(getSendingMessageStatus()).toMatchObject({ SUCCEEDED: 'succeeded' });
  });

  it('handles class names, emoji helpers, names, equality, and truncation', () => {
    const reaction = { userIds: ['member-1', 'me'] } as any;
    const stringSet = {
      TOOLTIP__YOU: 'You',
      TOOLTIP__AND_YOU: 'and you',
      TOOLTIP__UNKNOWN_USER: 'Unknown',
    };
    const emojiContainer = {
      emojiCategories: [
        { id: 1, emojis: [{ key: 'smile', url: 'smile.png' }] },
        { id: 2, emojis: [{ key: 'wave', url: 'wave.png' }, { key: '', url: 'ignored.png' }] },
      ],
    } as any;

    expect(getClassName(['one', ['two', 'three']])).toBe('one two three');
    expect(getClassName('single')).toBe('single');
    expect(isReactedBy('me', reaction)).toBe(true);
    expect(getEmojiTooltipString(reaction, 'me', new Map([['member-1', 'Jane']]), stringSet)).toBe('Janeand you');
    expect(getEmojiTooltipString({ userIds: ['unknown'] } as any, 'me', new Map(), stringSet)).toBe('Unknown');
    expect(getEmojiListAll(emojiContainer)).toHaveLength(3);
    expect([...getEmojiMapAll(emojiContainer).keys()]).toEqual(['smile', 'wave']);
    expect(getEmojiListByCategoryIds(emojiContainer, [2])).toEqual(emojiContainer.emojiCategories[1].emojis);
    expect(getEmojiListByCategoryIds(emojiContainer, null as any)).toHaveLength(3);
    expect(getEmojiUrl(emojiContainer, 'wave')).toBe('wave.png');
    expect(getEmojiUrl(emojiContainer, 'missing')).toBe('');
    expect(getUserName({ friendName: 'Friend', nickname: 'Nick', userId: 'id' } as any)).toBe('Friend');
    expect(getUserName({ nickname: 'Nick', userId: 'id' } as any)).toBe('Nick');
    expect(getSenderName({ sender: { userId: 'sender-id' } } as any)).toBe('sender-id');
    expect(hasSameMembers(['b', 'a'], ['a', 'b'])).toBe(true);
    expect(hasSameMembers(['a'], ['a', 'b'])).toBe(false);
    expect(hasSameMembers(null as any, ['a'])).toBe(false);
    expect(isFriend({ friendDiscoveryKey: 'key' } as any)).toBe(true);
    expect(isFriend(null)).toBe(false);
    expect(truncateString(null as any)).toBe('');
    expect(truncateString('short', 20)).toBe('short');
    expect(truncateString('abcdefghijklmnop', 9)).toBe('abc...nop');
  });

  it('copies text through legacy clipboard, execCommand, and unsupported paths', () => {
    const originalClipboardData = (window as any).clipboardData;
    const originalQueryCommandSupported = document.queryCommandSupported;
    const originalExecCommand = document.execCommand;

    (window as any).clipboardData = { setData: jest.fn(() => true) };
    expect(copyToClipboard('legacy')).toBe(true);
    expect((window as any).clipboardData.setData).toHaveBeenCalledWith('Text', 'legacy');

    delete (window as any).clipboardData;
    document.queryCommandSupported = jest.fn(() => true);
    document.execCommand = jest.fn(() => true);
    expect(copyToClipboard('modern')).toBe(true);
    expect(document.execCommand).toHaveBeenCalledWith('copy');

    document.execCommand = jest.fn(() => {
      throw new Error('denied');
    });
    expect(copyToClipboard('blocked')).toBe(false);

    document.queryCommandSupported = jest.fn(() => false);
    expect(copyToClipboard('unsupported')).toBe(false);

    (window as any).clipboardData = originalClipboardData;
    document.queryCommandSupported = originalQueryCommandSupported;
    document.execCommand = originalExecCommand;
  });

  it('filters message list params by type, custom type, sender, and parent message info', () => {
    const message = {
      messageType: 'user',
      customType: 'notice',
      sender: { userId: 'sender-1' },
      isUserMessage: () => true,
    } as any;

    expect(filterMessageListParams({}, message)).toBe(true);
    expect(filterMessageListParams({ messageTypeFilter: 'file' } as any, message)).toBe(false);
    expect(filterMessageListParams({ customTypesFilter: ['*'] } as any, message)).toBe(true);
    expect(filterMessageListParams({ customTypesFilter: ['event'] } as any, message)).toBe(false);
    expect(filterMessageListParams({ senderUserIdsFilter: ['sender-1'] } as any, message)).toBe(true);
    expect(filterMessageListParams({ senderUserIdsFilter: ['other'] } as any, message)).toBe(false);
    expect(filterMessageListParams({ senderUserIdsFilter: ['sender-1'] } as any, { messageType: 'admin' } as any)).toBe(false);
    expect(filterMessageListParams({ includeParentMessageInfo: false } as any, { ...message, parentMessageId: 1 })).toBe(false);
  });

  it('filters channel list params across common query options', () => {
    const base = channel();
    const accepts = (params, ch = base) => filterChannelListParams(params as any, ch as any, 'me');

    expect(accepts({ includeEmpty: true })).toBe(true);
    expect(accepts({ includeEmpty: false }, channel({ lastMessage: null }))).toBe(false);
    expect(accepts({ searchFilter: { query: 'alp', fields: ['channel_name'] } })).toBe(true);
    expect(accepts({ searchFilter: { query: 'zzz', fields: ['channel_name'] } })).toBe(false);
    expect(accepts({ searchFilter: { query: 'jane', fields: ['member_nickname'] } })).toBe(true);
    expect(accepts({ searchFilter: { query: 'anything', fields: ['unknown'] } })).toBe(true);
    expect(accepts({ userIdsFilter: { userIds: ['member-1'], includeMode: false } })).toBe(true);
    expect(accepts({ userIdsFilter: { userIds: ['missing'], includeMode: false } })).toBe(false);
    expect(accepts({ userIdsFilter: { userIds: ['member-1'], includeMode: true, queryType: 'AND' } })).toBe(true);
    expect(accepts({ userIdsFilter: { userIds: ['missing'], includeMode: true, queryType: 'AND' } })).toBe(false);
    expect(accepts({ userIdsFilter: { userIds: ['missing', 'member-1'], includeMode: true, queryType: 'OR' } })).toBe(true);
    expect(accepts({ userIdsFilter: { userIds: ['missing'], includeMode: true, queryType: 'OR' } })).toBe(false);
    expect(accepts({ includeFrozen: false }, channel({ isFrozen: true }))).toBe(false);
    expect(accepts({ customTypesFilter: ['support'] })).toBe(true);
    expect(accepts({ customTypesFilter: ['sales'] })).toBe(false);
    expect(accepts({ customTypeStartsWithFilter: 'sup' })).toBe(true);
    expect(accepts({ customTypeStartsWithFilter: 'sale' })).toBe(false);
    expect(accepts({ channelNameContainsFilter: 'alp' })).toBe(true);
    expect(accepts({ nicknameContainsFilter: 'jane' })).toBe(true);
    expect(accepts({ nicknameContainsFilter: 'missing' })).toBe(false);
    expect(accepts({ channelUrlsFilter: ['channel-url'] })).toBe(true);
    expect(accepts({ channelUrlsFilter: ['other'] })).toBe(false);
  });

  it('filters channel list params by membership, hidden, unread, public, super, and metadata filters', () => {
    const accepts = (params, ch = channel()) => filterChannelListParams(params as any, ch as any, 'me');

    expect(accepts({ myMemberStateFilter: 'joined_only' })).toBe(true);
    expect(accepts({ myMemberStateFilter: 'joined_only' }, channel({ myMemberState: 'invited' }))).toBe(false);
    expect(accepts({ myMemberStateFilter: 'invited_only' }, channel({ myMemberState: 'invited' }))).toBe(true);
    expect(accepts({ myMemberStateFilter: 'invited_by_friend' }, channel({ myMemberState: 'invited', inviter: { friendName: 'Friend' } }))).toBe(true);
    expect(accepts({ myMemberStateFilter: 'invited_by_non_friend' }, channel({ myMemberState: 'invited', inviter: { userId: 'stranger' } }))).toBe(true);
    expect(accepts({ hiddenChannelFilter: 'unhidden_only' })).toBe(true);
    expect(accepts({ hiddenChannelFilter: 'hidden_only' }, channel({ isHidden: true }))).toBe(true);
    expect(accepts({ hiddenChannelFilter: 'hidden_allow_auto_unhide' }, channel({ isHidden: true, hiddenState: 'hidden_allow_auto_unhide' }))).toBe(true);
    expect(accepts({ hiddenChannelFilter: 'hidden_prevent_auto_unhide' }, channel({ isHidden: true, hiddenState: 'hidden_prevent_auto_unhide' }))).toBe(true);
    expect(accepts({ unreadChannelFilter: 'unread_message' }, channel({ unreadMessageCount: 0 }))).toBe(false);
    expect(accepts({ publicChannelFilter: 'public' })).toBe(true);
    expect(accepts({ publicChannelFilter: 'private' })).toBe(false);
    expect(accepts({ superChannelFilter: 'super' }, channel({ isSuper: true }))).toBe(true);
    expect(accepts({ superChannelFilter: 'nonsuper' })).toBe(true);
    expect(accepts({ metadataKey: 'tier', metadataValues: ['gold'], metadataValueStartsWith: 'gold' })).toBe(true);
    expect(accepts({ metadataKey: 'tier', metadataValues: ['silver'] })).toBe(false);
    expect(accepts({ metadataKey: 'missing', metadataValues: ['gold'] })).toBe(false);
  });

  it('sorts and upserts channel lists', () => {
    const alpha = channel({ url: 'a', name: 'Alpha', createdAt: 1, lastMessage: { createdAt: 5 } });
    const beta = channel({ url: 'b', name: 'Beta', createdAt: 2, lastMessage: { createdAt: 10 } });
    const gamma = channel({ url: 'g', name: 'Gamma', createdAt: 3, lastMessage: null });

    expect(sortChannelList([beta, alpha], GroupChannelListOrder.CHANNEL_NAME_ALPHABETICAL).map(ch => ch.url)).toEqual(['a', 'b']);
    expect(sortChannelList([alpha, beta], GroupChannelListOrder.CHRONOLOGICAL).map(ch => ch.url)).toEqual(['b', 'a']);
    expect(sortChannelList([alpha, beta, gamma], GroupChannelListOrder.LATEST_LAST_MESSAGE).map(ch => ch.url)).toEqual(['b', 'a', 'g']);
    expect(getChannelsWithUpsertedChannel([alpha], beta, GroupChannelListOrder.CHANNEL_NAME_ALPHABETICAL).map(ch => ch.url)).toEqual(['a', 'b']);
    expect(getChannelsWithUpsertedChannel([alpha], { ...alpha, name: 'Updated' } as any)[0].name).toBe('Updated');
  });

  it('converts mention templates and exposes small predicates', () => {
    expect(convertWordToStringObj('hello @{u1}https://sendbird.com', [{ userId: 'u1', nickname: 'Jane' }] as any)).toEqual([
      { type: StringObjType.normal, value: 'hello ' },
      { type: StringObjType.mention, value: 'Jane', userId: 'u1' },
      { type: StringObjType.url, value: 'https://sendbird.com' },
    ]);
    expect(convertWordToStringObj('hello #{u2}', [{ userId: 'u1', nickname: 'Jane' }] as any, '#')).toEqual([
      { type: StringObjType.normal, value: 'hello #{u2}' },
    ]);
    expect(convertWordToStringObj('plain', null as any)).toEqual([{ type: StringObjType.normal, value: 'plain' }]);
    expect(isSendableMessage({ sender: { userId: 'sender' } } as any)).toBe(true);
    expect(isSendableMessage(null)).toBe(false);
    expect(isChannelJustCreated(channel({ lastMessage: null }))).toBe(true);
    expect(isChannelJustCreated(channel({ lastMessage: { messageId: 1 } }))).toBe(false);
    expect(getHTMLTextDirection('rtl', false)).toBe('rtl');
    expect(getHTMLTextDirection('rtl', true)).toBe('ltr');
  });
});
