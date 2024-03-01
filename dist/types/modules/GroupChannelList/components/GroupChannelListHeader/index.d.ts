import React from 'react';
import './index.scss';
export interface GroupChannelListHeaderProps {
    renderTitle?: () => React.ReactElement;
    renderIconButton?: (props: void) => React.ReactElement;
    onEdit?: (props: void) => void;
    allowProfileEdit?: boolean;
}
export declare const GroupChannelListHeader: ({ renderTitle, renderIconButton, onEdit, allowProfileEdit, }: GroupChannelListHeaderProps) => React.JSX.Element;
export default GroupChannelListHeader;
