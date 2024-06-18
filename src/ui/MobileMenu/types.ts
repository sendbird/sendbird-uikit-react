import React, { MouseEvent, ReactNode } from 'react';
import type { EmojiContainer } from '@sendbird/chat';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import type { OpenChannel } from '@sendbird/chat/openChannel';
import { CoreMessageType, SendableMessageType } from '../../utils';
import { ReplyType } from '../../types';
import type { RenderMenuItemsParams } from '../MessageMenu/messageMenu';

// Fixme@v4 - deleteMessageOption type, rethink options
export type DeleteMenuStates = 'DISABLE' | 'HIDE' | 'ACTIVE';
type MobileRenderMenuItemsParams = {
  items: Omit<RenderMenuItemsParams['items'], 'OpenInChannelMenuItem'>
};

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
  resendMessage?: (message: SendableMessageType) => void;
  deleteMessage?: (message: CoreMessageType) => Promise<void>;
  setQuoteMessage?: (message: SendableMessageType) => void;
  isReactionEnabled?: boolean;
  parentRef?: React.RefObject<HTMLElement>;
  onReplyInThread?: (props: { message: SendableMessageType }) => void;
  isOpenedFromThread?: boolean;
  onDownloadClick?: (e: MouseEvent) => Promise<void>;
  renderMenuItems?: (params: MobileRenderMenuItemsParams) => ReactNode;
}

export interface MobileBottomSheetProps extends BaseMenuProps {
  emojiContainer?: EmojiContainer;
  toggleReaction?: (message: SendableMessageType, reactionKey: string, isReacted: boolean) => void;
}
