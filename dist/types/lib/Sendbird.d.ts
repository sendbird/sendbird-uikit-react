import './index.scss';
import './__experimental__typography.scss';
import React from 'react';
import { User } from '@sendbird/chat';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { StringSet } from '../ui/Label/stringSet';
import { ConfigureSessionTypes } from './hooks/useConnect/types';
import { UIKitOptions, CommonUIKitConfigProps, SendbirdChatInitParams, CustomExtensionParams, SBUEventHandlers } from './types';
import { RenderUserProfileProps } from '../types';
import { SBUGlobalPubSub } from './pubSub/topics';
export { useSendbirdStateContext } from '../hooks/useSendbirdStateContext';
export type UserListQueryType = {
    hasNext?: boolean;
    next: () => Promise<Array<User>>;
    get isLoading(): boolean;
};
interface VoiceRecordOptions {
    maxRecordingTime?: number;
    minRecordingTime?: number;
}
export interface ImageCompressionOptions {
    compressionRate?: number;
    resizingWidth?: number | string;
    resizingHeight?: number | string;
}
export interface SendbirdConfig {
    logLevel?: string | Array<string>;
    pubSub?: SBUGlobalPubSub;
    userMention?: {
        maxMentionCount?: number;
        maxSuggestionCount?: number;
    };
    isREMUnitEnabled?: boolean;
}
export interface SendbirdProviderProps extends CommonUIKitConfigProps, React.PropsWithChildren<unknown> {
    appId: string;
    userId: string;
    accessToken?: string;
    customApiHost?: string;
    customWebSocketHost?: string;
    configureSession?: ConfigureSessionTypes;
    theme?: 'light' | 'dark';
    config?: SendbirdConfig;
    nickname?: string;
    colorSet?: Record<string, string>;
    stringSet?: Partial<StringSet>;
    dateLocale?: Locale;
    profileUrl?: string;
    voiceRecord?: VoiceRecordOptions;
    userListQuery?(): UserListQueryType;
    imageCompression?: ImageCompressionOptions;
    allowProfileEdit?: boolean;
    disableMarkAsDelivered?: boolean;
    breakpoint?: string | boolean;
    renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
    onUserProfileMessage?: (channel: GroupChannel) => void;
    uikitOptions?: UIKitOptions;
    isUserIdUsedForNickname?: boolean;
    sdkInitParams?: SendbirdChatInitParams;
    customExtensionParams?: CustomExtensionParams;
    isMultipleFilesMessageEnabled?: boolean;
    eventHandlers?: SBUEventHandlers;
}
export declare function SendbirdProvider(props: SendbirdProviderProps): React.JSX.Element;
export default SendbirdProvider;
