import './index.scss';
import React from 'react';
import { OpenChannel } from '@sendbird/chat/openChannel';
interface OpenChannelPreviewProps {
    className?: string;
    isSelected?: boolean;
    channel: OpenChannel;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}
declare function OpenChannelPreview({ className, isSelected, channel, onClick, }: OpenChannelPreviewProps): React.ReactElement;
export default OpenChannelPreview;
