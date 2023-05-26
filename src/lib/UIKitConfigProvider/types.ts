export interface CommonConfig {
  enableUsingDefaultUserProfile: boolean;
}

export interface GroupChannelConfig {
  channel: {
    enableMention: boolean;
    enableOgtag: boolean;
    enableReactions: boolean;
    enableTypingIndicator: boolean;
    enableVoiceMessage: boolean;
    input: {
      camera: {
        enablePhoto: boolean;
        enableVideo: boolean;
      };
      enableDocument: boolean;
      gallery: {
        enablePhoto: boolean;
        enableVideo: boolean;
      };
    };
    replyType: 'none' | 'quote_reply' | 'thread';
    threadReplySelectType: 'thread';
  };
  channelList: {
    enableMessageReceiptStatus: boolean;
    enableTypingIndicator: boolean;
  };
  setting: {
    enableMessageSearch: boolean;
  };
}

interface OpenChannelConfig {
  channel: Pick<GroupChannelConfig['channel'], 'enableOgtag' | 'input'>;
}

export interface UIKitConfigInfo {
  common: CommonConfig;
  groupChannel: GroupChannelConfig;
  openChannel: OpenChannelConfig;
}

export interface UIKitConfigPayload {
  lastUpdatedAt: number;
  uikitConfigurations: UIKitConfigInfo;
}
