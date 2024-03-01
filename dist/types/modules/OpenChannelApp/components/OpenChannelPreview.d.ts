import { ReactElement } from 'react';
import './open-channel-preview.scss';
import { OpenChannel } from '@sendbird/chat/openChannel';
interface Props {
    channel: OpenChannel;
    selected: boolean;
    onClick(event: any): void;
    isStreaming?: boolean;
}
export default function OpenChannelPreview({ channel, selected, onClick, isStreaming, }: Props): ReactElement;
export {};
