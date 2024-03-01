import './index.scss';
import { ReactElement } from 'react';
import type { EmojiContainer } from '@sendbird/chat';
import { SendableMessageType } from '../../utils';
import { SpaceFromTriggerType } from '../../types';
export interface MessageEmojiMenuProps {
    className?: string | Array<string>;
    message: SendableMessageType;
    userId: string;
    spaceFromTrigger?: SpaceFromTriggerType;
    emojiContainer?: EmojiContainer;
    toggleReaction?: (message: SendableMessageType, reactionKey: string, isReacted: boolean) => void;
    setSupposedHover?: (bool: boolean) => void;
}
export declare function MessageEmojiMenu({ className, message, userId, spaceFromTrigger, emojiContainer, toggleReaction, setSupposedHover, }: MessageEmojiMenuProps): ReactElement;
export default MessageEmojiMenu;
