import { ReactElement } from 'react';
import { EmojiContainer, User } from '@sendbird/chat';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import './mobile-menu-reacted-members.scss';
import { SendableMessageType } from '../../utils';
export interface ReactedMembersBottomSheetProps {
    message: SendableMessageType;
    channel: GroupChannel;
    emojiKey: string;
    hideMenu: () => void;
    emojiContainer?: EmojiContainer;
    onPressUserProfileHandler?: (member: User) => void;
}
export declare const ReactedMembersBottomSheet: ({ message, channel, emojiKey, hideMenu, emojiContainer, onPressUserProfileHandler, }: ReactedMembersBottomSheetProps) => ReactElement;
