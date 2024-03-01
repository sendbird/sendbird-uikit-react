import './index.scss';
import React from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import { User } from '@sendbird/chat';
export interface Props {
    renderHeader?: (props: void) => React.ReactElement;
    renderPlaceHolderError?: (props: void) => React.ReactElement;
    renderPlaceHolderLoading?: (props: void) => React.ReactElement;
    renderPlaceHolderEmptyList?: (props: void) => React.ReactElement;
    onChangeTheme: (theme: string) => void;
    onUserProfileUpdated: (user: User) => void;
    allowProfileEdit: boolean;
    channels: GroupChannel[];
    onLoadMore: () => void;
    initialized: boolean;
    renderChannel: (props: {
        item: GroupChannel;
        index: number;
    }) => React.ReactElement;
    renderAddChannel(): React.ReactElement;
}
export declare const GroupChannelListUIView: ({ renderHeader, renderPlaceHolderError, renderPlaceHolderLoading, renderPlaceHolderEmptyList, onChangeTheme, onUserProfileUpdated, allowProfileEdit, channels, onLoadMore, initialized, renderChannel, renderAddChannel, }: Props) => React.JSX.Element;
