import { UIKitConfigInfo } from './types';

export interface UikitConfigurationStateType {
  initialized: boolean,
  loading: boolean,
  uikitConfiguration: UIKitConfigInfo,
}

const initialConfigValues = {
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
};

const initialState: UikitConfigurationStateType = {
  initialized: false,
  loading: false,
  uikitConfiguration: initialConfigValues as UIKitConfigInfo,
};

export default initialState;
