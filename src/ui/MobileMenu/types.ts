import type {
  FileMessage,
  UserMessage,
} from '@sendbird/chat/message';
import type { ReplyType } from 'SendbirdUIKitGlobal';
import type { EmojiContainer } from '@sendbird/chat';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import type { OpenChannel } from '@sendbird/chat/openChannel';
import React from 'react';

// Fixme@v4 - deleteMessageOption type, rethink options
export type DeleteMenuStates = 'DISABLE' | 'HIDE' | 'ACTIVE';

export interface BaseMenuProps {
  channel: GroupChannel | OpenChannel;
  message: UserMessage | FileMessage;
  userId: string;
  hideMenu(): void;
  isByMe?: boolean;
  replyType?: ReplyType;
  disabled?: boolean;
  // This should take precedence over logic inside the component
  deleteMenuState?: DeleteMenuStates;
  showEdit?: (bool: boolean) => void;
  showRemove?: (bool: boolean) => void;
  resendMessage?: (message: UserMessage | FileMessage) => Promise<UserMessage | FileMessage>;
  setQuoteMessage?: (message: UserMessage | FileMessage) => void;
  isReactionEnabled?: boolean;
  parentRef?: React.RefObject<HTMLElement>;
  onReplyInThread?: (props: { message: UserMessage | FileMessage }) => void;
  isOpenedFromThread?: boolean;
}

export interface MobileBottomSheetProps extends BaseMenuProps {
  emojiContainer?: EmojiContainer;
  toggleReaction?: (message: UserMessage | FileMessage, reactionKey: string, isReacted: boolean) => void;
}
