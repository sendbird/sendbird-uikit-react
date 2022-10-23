import type {
  FileMessage,
  UserMessage,
} from '@sendbird/chat/message';
import type { ReplyType } from 'SendbirdUIKitGlobal';
import type { EmojiContainer } from '@sendbird/chat';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import type { OpenChannel } from '@sendbird/chat/openChannel';

export interface BaseMenuProps {
  channel: GroupChannel | OpenChannel;
  message: UserMessage | FileMessage;
  userId: string;
  hideMenu(): void;
  isByMe?: boolean;
  replyType?: ReplyType;
  disabled?: boolean;
  showEdit?: (bool: boolean) => void;
  showRemove?: (bool: boolean) => void;
  resendMessage?: (message: UserMessage | FileMessage) => Promise<UserMessage | FileMessage>;
  setQuoteMessage?: (message: UserMessage | FileMessage) => void;
  isReactionEnabled?: boolean;
}

export interface MobileBottomSheetProps extends BaseMenuProps {
  emojiContainer?: EmojiContainer;
  toggleReaction?: (message: UserMessage | FileMessage, reactionKey: string, isReacted: boolean) => void;
}

export interface MobileContextMenuProps extends BaseMenuProps {}

export interface MobileMenuProps extends MobileBottomSheetProps, MobileContextMenuProps {
}
