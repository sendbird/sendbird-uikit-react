import { ReactElement } from 'react';
import { EmojiContainer } from '@sendbird/chat';
import { SendableMessageType } from '../../utils';
export interface MobileEmojisBottomSheetProps {
    userId: string;
    message: SendableMessageType;
    emojiContainer: EmojiContainer;
    hideMenu: () => void;
    toggleReaction?: (message: SendableMessageType, key: string, byMe: boolean) => void;
}
export declare const MobileEmojisBottomSheet: ({ userId, message, emojiContainer, hideMenu, toggleReaction, }: MobileEmojisBottomSheetProps) => ReactElement;
