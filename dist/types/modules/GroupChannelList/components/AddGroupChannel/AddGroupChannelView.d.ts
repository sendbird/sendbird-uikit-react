import React from 'react';
import { CreateChannelProviderProps } from '../../../CreateChannel/context/CreateChannelProvider';
type Props = {
    createChannelVisible: boolean;
    onChangeCreateChannelVisible: (value: boolean) => void;
    onBeforeCreateChannel: CreateChannelProviderProps['onBeforeCreateChannel'];
    onCreateChannelClick: CreateChannelProviderProps['onCreateChannelClick'];
    onChannelCreated: CreateChannelProviderProps['onChannelCreated'];
};
export declare const AddGroupChannelView: ({ createChannelVisible, onChangeCreateChannelVisible, onBeforeCreateChannel, onCreateChannelClick, onChannelCreated, }: Props) => React.JSX.Element;
export default AddGroupChannelView;
