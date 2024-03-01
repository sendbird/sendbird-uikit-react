import './open-channel-ui.scss';
import React from 'react';
import { RenderMessageProps } from '../../../../types';
export interface OpenChannelUIProps {
    renderMessage?: (props: RenderMessageProps) => React.ElementType<RenderMessageProps>;
    renderHeader?: () => React.ReactElement;
    renderInput?: () => React.ReactElement;
    renderPlaceHolderEmptyList?: () => React.ReactElement;
    renderPlaceHolderError?: () => React.ReactElement;
    renderPlaceHolderLoading?: () => React.ReactElement;
}
declare const OpenChannelUI: React.FC<OpenChannelUIProps>;
export default OpenChannelUI;
