export const dummyFileMessageImage = {
  messageId: 15814617,
  messageType: 'file',
  channelUrl: 'sendbird_group_channel_11985956_fa67b79d39e6aa5abbeda4413cde24ce1685eedb',
  data: '',
  customType: '',
  createdAt: 1583104552977,
  updatedAt: 0,
  channelType: 'group',
  metaArrays: [],
  reactions: [],
  mentionType: 'users',
  mentionedUsers: [],
  url: '72b35fef-acda-4e32-123323456789973567890dfvgbhnjmkiytdxbna0e4-37e1226b0615.pdf',
  name: '',
  size: 0,
  type: '',
  thumbnails: [],
  sender: {
    nickname: 'ME',
    profileUrl: 'https://static.sendbird.com/sample/profiles/profile_19_512px.png',
    userId: 'hoon1234',
    connectionStatus: 'nonavailable',
    lastSeenAt: 0,
    isActive: true,
    friendDiscoveryKey: null,
    friendName: null,
    _preferredLanguages: null,
    isBlockedByMe: false
  },
  reqId: '1583104547956',
  requireAuth: false,
  requestState: 'succeeded',
  requestedMentionUserIds: [],
  errorCode: 0
};

export const dummyFileMessageAudio = {
  messageId: 15814617,
  messageType: 'file',
  channelUrl: 'sendbird_group_channel_11985956_fa67b79d39e6aa5abbeda4413cde24ce1685eedb',
  data: '',
  customType: '',
  createdAt: 1583104552977,
  updatedAt: 0,
  channelType: 'group',
  metaArrays: [],
  reactions: [],
  mentionType: 'users',
  mentionedUsers: [],
  url: '72b35fef-acda-4e32-123323456789973567890dfvgbhnjmkiytdxbna0e4-37e1226b0615.mp3',
  name: '',
  size: 0,
  type: '',
  thumbnails: [],
  sender: {
    nickname: 'ME',
    profileUrl: 'https://static.sendbird.com/sample/profiles/profile_19_512px.png',
    userId: 'hoon1234',
    connectionStatus: 'nonavailable',
    lastSeenAt: 0,
    isActive: true,
    friendDiscoveryKey: null,
    friendName: null,
    _preferredLanguages: null,
    isBlockedByMe: false
  },
  reqId: '1583104547956',
  requireAuth: false,
  requestState: 'succeeded',
  requestedMentionUserIds: [],
  errorCode: 0
};

type generatorType = (callback?: (message: Record<string, any>) => Record<string, any>) => Record<string, any>;

export const getFileMessage: generatorType = (callback) => {
  const message = { ...dummyFileMessageImage };
  if (callback) {
    return callback(message);
  }
  return message;
};
