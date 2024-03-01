import React from 'react';
import { OpenChannel, OpenChannelUpdateParams } from '@sendbird/chat/openChannel';
import { RenderUserProfileProps } from '../../../types';
export interface OpenChannelSettingsContextProps {
    channelUrl: string;
    children?: React.ReactElement;
    onCloseClick?(): void;
    onBeforeUpdateChannel?(currentTitle: string, currentImg: File, data: string): OpenChannelUpdateParams;
    onChannelModified?(channel: OpenChannel): void;
    onDeleteChannel?(channel: OpenChannel): void;
    disableUserProfile?: boolean;
    renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
}
interface OpenChannelSettingsContextType {
    channelUrl: string;
    channel?: OpenChannel;
    isChannelInitialized: boolean;
    setChannel?: React.Dispatch<React.SetStateAction<OpenChannel>>;
    onCloseClick?(): void;
    onBeforeUpdateChannel?(currentTitle: string, currentImg: File, data: string): OpenChannelUpdateParams;
    onChannelModified?(channel: OpenChannel): void;
    onDeleteChannel?(channel: OpenChannel): void;
}
declare const OpenChannelSettingsProvider: React.FC<OpenChannelSettingsContextProps>;
type useOpenChannelSettingsType = () => OpenChannelSettingsContextType;
declare const useOpenChannelSettingsContext: useOpenChannelSettingsType;
export { OpenChannelSettingsProvider, useOpenChannelSettingsContext, };
