import type { GroupChannel } from "@sendbird/chat/groupChannel";
import type { BaseMessage, MessageListParams } from "@sendbird/chat/message";
import { number } from "prop-types";

export declare type NotficationChannelStateInterface = {
  uiState: 'loading' | 'initialized' | 'invalid';
  allMessages: BaseMessage[];
  currentNotificationChannel: GroupChannel;
  hasMore: boolean;
  messageListParams?: MessageListParams;
  lastSeen?: number;
}

export const initialState: NotficationChannelStateInterface = {
  uiState: 'loading',
  allMessages: [],
  currentNotificationChannel: null,
  hasMore: false,
  messageListParams: null,
  lastSeen: 0,
};
