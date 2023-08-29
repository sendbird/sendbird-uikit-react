import type { EmojiContainer } from '@sendbird/chat';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import type { OpenChannel } from '@sendbird/chat/openChannel';
import React from 'react';
import { SendableMessageType } from '../../utils';
import { ReplyType } from '../../types';

// Fixme@v4 - deleteMessageOption type, rethink options
export type DeleteMenuStates = 'DISABLE' | 'HIDE' | 'ACTIVE';

export interface BaseMenuProps {
  channel: GroupChannel | OpenChannel;
  message: SendableMessageType;
  userId: string;
  hideMenu(): void;
  isByMe?: boolean;
  replyType?: ReplyType;
  disabled?: boolean;
  // This should take precedence over logic inside the component
  deleteMenuState?: DeleteMenuStates;
  showEdit?: (bool: boolean) => void;
  showRemove?: (bool: boolean) => void;
  resendMessage?: (message: SendableMessageType) => Promise<SendableMessageType>;
  setQuoteMessage?: (message: SendableMessageType) => void;
  isReactionEnabled?: boolean;
  parentRef?: React.RefObject<HTMLElement>;
  onReplyInThread?: (props: { message: SendableMessageType }) => void;
  isOpenedFromThread?: boolean;
}

export interface MobileBottomSheetProps extends BaseMenuProps {
  emojiContainer?: EmojiContainer;
  toggleReaction?: (message: SendableMessageType, reactionKey: string, isReacted: boolean) => void;
}
