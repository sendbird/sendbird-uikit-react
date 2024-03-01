import React from 'react';
import { OpenChannel } from '@sendbird/chat/openChannel';
import './index.scss';
import { OnOpenChannelSelected } from '../../context/OpenChannelListInterfaces';
interface RenderOpenChannelPreviewProps {
    channel: OpenChannel;
    isSelected: boolean;
    onChannelSelected: OnOpenChannelSelected;
}
export interface OpenChannelListUIProps {
    renderHeader?: () => React.ReactElement;
    renderChannelPreview?: (props: RenderOpenChannelPreviewProps) => React.ReactElement;
    renderPlaceHolderEmpty?: () => React.ReactElement;
    renderPlaceHolderError?: () => React.ReactElement;
    renderPlaceHolderLoading?: () => React.ReactElement;
}
declare function OpenChannelListUI({ renderHeader, renderChannelPreview, renderPlaceHolderEmpty, renderPlaceHolderError, renderPlaceHolderLoading, }: OpenChannelListUIProps): React.ReactElement;
export default OpenChannelListUI;
