import type { GroupChannel } from "@sendbird/chat/groupChannel";
import type { BaseMessage } from "@sendbird/chat/message";

export declare type NotficationChannelStateInterface = {
  uiState: 'loading' | 'initialized' | 'invalid';
  allMessages: BaseMessage[];
  currentNotificationChannel: GroupChannel;
  hasMore: boolean;
}

export const initialState: NotficationChannelStateInterface = {
  uiState: 'loading',
  allMessages: [],
  currentNotificationChannel: null,
  hasMore: false,
};
