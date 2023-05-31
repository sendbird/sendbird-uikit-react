import getConfigsByPriority from '../getConfigsByPriority';
import { UIKitConfigInfo } from '../../types';

const mockRemoteConfigs: UIKitConfigInfo = {
  common: {
    enableUsingDefaultUserProfile: false,
  },
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

describe('getConfigsByPriority', () => {
  it('should override remoteConfigs value \w localConfigs which has higher priority', () => {
    const localConfigs = {
      common: {
        enableUsingDefaultUserProfile: true,
      },
    };
    const remoteConfigs: UIKitConfigInfo = {
      // Non-existing configs in localConfigs should be merged too
      ...mockRemoteConfigs,
      common: {
        enableUsingDefaultUserProfile: false, // Only this value should be replaced
      },
    };

    expect(getConfigsByPriority(localConfigs, remoteConfigs)).toEqual({
      ...remoteConfigs,
      ...localConfigs,
    });
  });

  it('should merge correctly even localConfigs has empty object or nullable fields', () => {
    const localConfigs = {};
    const remoteConfigs = mockRemoteConfigs;
    expect(getConfigsByPriority(localConfigs, remoteConfigs)).toEqual(remoteConfigs);
  });
});
