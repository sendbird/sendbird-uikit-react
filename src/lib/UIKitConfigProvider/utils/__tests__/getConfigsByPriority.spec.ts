import getConfigsByPriority from '../getConfigsByPriority';

describe('getConfigsByPriority', () => {
  it('should override remoteConfigs value \w localConfigs which has higher priority', () => {
    const localConfigs = {
      common: {
        enableUsingDefaultUserProfile: true,
      },
    };
    const remoteConfigs = {
      common: {
        enableUsingDefaultUserProfile: false, // Only this value should be replaced
      },
      // These below non-existing configs in localConfigs should be merged too
      groupChannel: {
        channel: {
          enableMention: false,
          enableOgtag: true,
          enableReactions: true,
          enableTypingIndicator: true,
          enableVoiceMessage: false,
          input: {
            camera: {
              enablePhoto: true,
              enableVideo: true,
            },
            enableDocument: true,
            gallery: {
              enablePhoto: true,
              enableVideo: true,
            },
          },
          replyType: 'quote_reply',
          threadReplySelectType: 'thread',
        },
        channelList: {
          enableMessageReceiptStatus: false,
          enableTypingIndicator: false,
        },
        setting: {
          enableMessageSearch: false,
        },
      },
      openChannel: {
        channel: {
          enableOgtag: true,
          input: {
            camera: {
              enablePhoto: true,
              enableVideo: true,
            },
            enableDocument: true,
            gallery: {
              enablePhoto: true,
              enableVideo: true,
            },
          },
        },
      },
    };

    expect(getConfigsByPriority(localConfigs, remoteConfigs)).toEqual({
      ...remoteConfigs,
      ...localConfigs,
    });
  });
});
