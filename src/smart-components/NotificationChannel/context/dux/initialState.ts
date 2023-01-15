import type { GroupChannel } from "@sendbird/chat/groupChannel";
import type { BaseMessage, MessageListParams } from "@sendbird/chat/message";

export declare type NotficationChannelStateInterface = {
  uiState: 'loading' | 'initialized' | 'invalid';
  allMessages: BaseMessage[];
  currentNotificationChannel: GroupChannel;
  hasMore: boolean;
  messageListParams?: MessageListParams;
}

export const initialState: NotficationChannelStateInterface = {
  uiState: 'loading',
  allMessages: [],
  currentNotificationChannel: null,
  hasMore: false,
  messageListParams: null,
};
