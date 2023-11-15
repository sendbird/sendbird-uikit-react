import type { User } from '@sendbird/chat';
import type { Member } from '@sendbird/chat/groupChannel';
import type {
  AdminMessage,
  FileMessage,
  MultipleFilesMessage,
  UserMessage,
} from '@sendbird/chat/message';
import { CoreMessageType } from './utils';

export type ReplyType = 'NONE' | 'QUOTE_REPLY' | 'THREAD';
export type Nullable<T> = T | null;

export type SpaceFromTriggerType = {
  x: number,
  y: number,
  top?: number,
  left?: number,
  height?: number,
};

export interface UserListQuery {
  hasNext?: boolean;
  next(): Promise<Array<User>>;
  get isLoading(): boolean;
}

export enum TypingIndicatorTypes {
  Text = 'text',
  Bubble = 'bubble',
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
  message: CoreMessageType;
  chainTop: boolean;
  chainBottom: boolean;
}

export interface RenderCustomSeparatorProps {
  message: CoreMessageType;
}

export interface ClientUserMessage extends UserMessage, ClientMessage { }
export interface ClientFileMessage extends FileMessage, ClientMessage { }
export interface ClientAdminMessage extends AdminMessage, ClientMessage { }
export interface ClientMultipleFilesMessage extends MultipleFilesMessage, ClientMessage { }
export type EveryMessage = ClientUserMessage | ClientFileMessage | ClientMultipleFilesMessage | ClientAdminMessage;
export type ClientSentMessages = ClientUserMessage | ClientFileMessage | ClientMultipleFilesMessage;
