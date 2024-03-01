import React from 'react';
import { Emoji } from '@sendbird/chat';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { OpenChannel } from '@sendbird/chat/openChannel';
import { Reaction } from '@sendbird/chat/message';
import { Nullable } from '../../types';
import { SendableMessageType } from '../../utils';
type Props = {
    reaction: Reaction;
    memberNicknamesMap: Map<string, string>;
    setEmojiKey: React.Dispatch<React.SetStateAction<string>>;
    toggleReaction?: (message: SendableMessageType, key: string, byMe: boolean) => void;
    emojisMap: Map<string, Emoji>;
    channel: Nullable<GroupChannel | OpenChannel>;
    message?: SendableMessageType;
};
export default function ReactionItem({ reaction, memberNicknamesMap, setEmojiKey, toggleReaction, emojisMap, channel, message, }: Props): React.JSX.Element;
export {};
