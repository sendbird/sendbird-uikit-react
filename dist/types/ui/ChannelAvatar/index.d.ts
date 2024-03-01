/// <reference types="react" />
import './index.scss';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
interface Props {
    channel: GroupChannel;
    userId: string;
    theme: string;
    width?: number;
    height?: number;
}
declare function ChannelAvatar({ channel, userId, theme, width, height, }: Props): JSX.Element;
export default ChannelAvatar;
