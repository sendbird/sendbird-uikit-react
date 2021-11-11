import SendBird from "sendbird";

export type ReplyType = "NONE" | "QUOTE_REPLY" | "THREAD";

export interface UserListQuery {
  hasNext?: boolean;
  next(callback: unknown): void;
}

export interface RenderUserProfileProps {
  user: SendBird.User | SendBird.Member;
  currentUserId: string;
  close(): void;
}

export interface SendBirdProviderConfig {
  logLevel?: 'debug' | 'warning' | 'error' | 'info' | 'all' | Array<string>;
}

export interface ClientMessage {
  reqId: string;
  file?: File;
  localUrl?: string;
  _sender: SendBird.User;
}

export interface RenderMessageProps {
  message: EveryMessage;
  chainTop: boolean;
  chainBottom: boolean;
}

export interface ClientUserMessage extends SendBird.UserMessage, ClientMessage { }
export interface ClientFileMessage extends SendBird.FileMessage, ClientMessage { }
export interface ClientAdminMessage extends SendBird.AdminMessage, ClientMessage { }
export type EveryMessage = ClientUserMessage | ClientFileMessage | ClientAdminMessage;
export type ClientSentMessages = ClientUserMessage | ClientFileMessage;

export interface SendbirdTypes {
  GroupChannel: import('sendbird').GroupChannel;
  GroupChannelParams: import('sendbird').GroupChannelParams;
  OpenChannel: import('sendbird').OpenChannel;
  OpenChannelStatic: import('sendbird').OpenChannelStatic;
  // Add after core release
  // OpenChannelParams: import('sendbird').OpenChannelParams;
  BaseChannel: import('sendbird').BaseChannel;
  Member: import('sendbird').Member;
  User: import('sendbird').User;
  UserMessageParams: import('sendbird').UserMessageParams;
  FileMessageParams: import('sendbird').FileMessageParams;
  SendBirdInstance: import('sendbird').SendBirdInstance;
  UserListQuery: import('sendbird').UserListQuery;
  BaseMessageInstance: import('sendbird').BaseMessageInstance;
  UserMessage: import('sendbird').UserMessage;
  FileMessage: import('sendbird').FileMessage;
  EmojiCategory: import('sendbird').EmojiCategory;
  SendBirdError: import('sendbird').SendBirdError;
  ChannelHandler: import('sendbird').ChannelHandler;
  MessageListParams: import('sendbird').MessageListParams;
}
