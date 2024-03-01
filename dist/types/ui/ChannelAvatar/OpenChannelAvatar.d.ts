/// <reference types="react" />
import type { OpenChannel } from '@sendbird/chat/openChannel';
interface Props {
    channel: OpenChannel;
    theme: string;
    height?: number;
    width?: number;
}
declare function ChannelAvatar({ channel, theme, height, width, }: Props): JSX.Element;
export default ChannelAvatar;
