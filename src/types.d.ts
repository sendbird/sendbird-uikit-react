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
  userMention?: {
    maxMentionCount?: number,
    maxSuggestionCount?: number,
  };
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
