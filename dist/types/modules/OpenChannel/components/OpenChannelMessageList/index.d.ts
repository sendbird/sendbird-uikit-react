import './openchannel-message-list.scss';
import React from 'react';
import { RenderMessageProps } from '../../../../types';
export type OpenchannelMessageListProps = {
    renderMessage?: (props: RenderMessageProps) => React.ElementType<RenderMessageProps>;
    renderPlaceHolderEmptyList?: () => React.ReactElement;
};
declare const _default: React.ForwardRefExoticComponent<OpenchannelMessageListProps & React.RefAttributes<HTMLDivElement>>;
export default _default;
