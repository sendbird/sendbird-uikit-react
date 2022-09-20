import type { User } from "@sendbird/chat";
import type { Member } from "@sendbird/chat/groupChannel";
import type {
  AdminMessage,
  FileMessage,
  UserMessage,
} from "@sendbird/chat/message";

export type ReplyType = "NONE" | "QUOTE_REPLY" | "THREAD";

export interface UserListQuery {
  hasNext?: boolean;
  next(): Promise<Array<User>>;
}

export interface RenderUserProfileProps {
  user: User | Member;
  currentUserId: string;
  close(): void;
}

export interface SendBirdProviderConfig {
  logLevel?: 'debug' | 'warning' | 'error' | 'info' | 'all' | Array<string>;
  userMention?: {
    maxMentionCount?: number,
    maxSuggestionCount?: number,
  };
  isREMUnitEnabled?: boolean;
}

export interface ClientMessage {
  reqId: string;
  file?: File;
  localUrl?: string;
  _sender: User;
}

export interface RenderMessageProps {
  message: UserMessage | FileMessage | AdminMessage;
  chainTop: boolean;
  chainBottom: boolean;
}

export interface RenderCustomSeparatorProps {
  message: AdminMessage | UserMessage | FileMessage;
}

export interface ClientUserMessage extends UserMessage, ClientMessage { }
export interface ClientFileMessage extends FileMessage, ClientMessage { }
export interface ClientAdminMessage extends AdminMessage, ClientMessage { }
export type EveryMessage = ClientUserMessage | ClientFileMessage | ClientAdminMessage;
export type ClientSentMessages = ClientUserMessage | ClientFileMessage;
