import { UIKitConfigInfo } from '../types';

// @link: https://docs.google.com/spreadsheets/d/1-AozBMHRYOXS74vZ-7x2ptQcBL6nnM-orJWRvUgmkd4/edit#gid=0
const initialConfig: UIKitConfigInfo = {
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

export default initialConfig;
