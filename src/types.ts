import { MutableRefObject } from 'react';
import type { User } from '@sendbird/chat';
import type { Member } from '@sendbird/chat/groupChannel';
import type {
  AdminMessage,
  FileMessage,
  MultipleFilesMessage,
  UserMessage,
  Thumbnail,
} from '@sendbird/chat/message';
import { CoreMessageType } from './utils';
import { MessageProps } from './modules/GroupChannel/components/Message/MessageView';

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

export enum TypingIndicatorType {
  Text = 'text',
  Bubble = 'bubble',
}

export interface RenderUserProfileProps {
  user: User | Member;
  currentUserId: string;
  close(): void;
  avatarRef: MutableRefObject<any>;
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

// This is used for OpenChannel.renderMessage
export interface RenderMessageProps {
  message: CoreMessageType;
  chainTop: boolean;
  chainBottom: boolean;
}
// This is used for GroupChannel.renderMessage
export type RenderMessageParamsType = Omit<MessageProps, 'renderMessage'>;

export interface RenderCustomSeparatorProps {
  message: CoreMessageType;
}

export interface ClientUserMessage extends UserMessage, ClientMessage { }
export interface ClientFileMessage extends FileMessage, ClientMessage { }
export interface ClientAdminMessage extends AdminMessage, ClientMessage { }
export interface ClientMultipleFilesMessage extends MultipleFilesMessage, ClientMessage { }
export type EveryMessage = ClientUserMessage | ClientFileMessage | ClientMultipleFilesMessage | ClientAdminMessage;
export type ClientSentMessages = ClientUserMessage | ClientFileMessage | ClientMultipleFilesMessage;

export interface UploadedFileInfoWithUpload {
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  thumbnails?: Thumbnail[];
  url?: string;
  isUploaded?: boolean;
}
