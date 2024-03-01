import './index.scss';
import React from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import { GroupChannelListItemBasicProps } from '../GroupChannelListItem/GroupChannelListItemView';
interface GroupChannelItemProps extends GroupChannelListItemBasicProps {
}
export interface GroupChannelListUIProps {
    renderChannelPreview?: (props: GroupChannelItemProps) => React.ReactElement;
    renderHeader?: (props: void) => React.ReactElement;
    renderPlaceHolderError?: (props: void) => React.ReactElement;
    renderPlaceHolderLoading?: (props: void) => React.ReactElement;
    renderPlaceHolderEmptyList?: (props: void) => React.ReactElement;
    sortChannelList?: (channels: GroupChannel[]) => GroupChannel[];
}
export declare const GroupChannelListUI: (props: GroupChannelListUIProps) => React.JSX.Element;
export default GroupChannelListUI;
