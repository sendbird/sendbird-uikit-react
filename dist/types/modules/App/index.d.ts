/**
 * This is a drop in Chat solution
 * Can also be used as an example for creating
 * default chat apps
 */
import React from 'react';
import { SendbirdProviderProps } from '../../lib/Sendbird';
import './index.scss';
import { AppLayoutProps } from './types';
interface AppProps {
    appId: SendbirdProviderProps['appId'];
    userId: SendbirdProviderProps['userId'];
    accessToken?: SendbirdProviderProps['accessToken'];
    customApiHost?: SendbirdProviderProps['customApiHost'];
    customWebSocketHost?: SendbirdProviderProps['customWebSocketHost'];
    breakpoint?: SendbirdProviderProps['breakpoint'];
    theme?: SendbirdProviderProps['theme'];
    userListQuery?: SendbirdProviderProps['userListQuery'];
    nickname?: SendbirdProviderProps['nickname'];
    profileUrl?: SendbirdProviderProps['profileUrl'];
    dateLocale?: SendbirdProviderProps['dateLocale'];
    config?: SendbirdProviderProps['config'];
    isReactionEnabled?: SendbirdProviderProps['isReactionEnabled'];
    isMentionEnabled?: SendbirdProviderProps['isMentionEnabled'];
    isVoiceMessageEnabled?: SendbirdProviderProps['isVoiceMessageEnabled'];
    voiceRecord?: SendbirdProviderProps['voiceRecord'];
    replyType?: SendbirdProviderProps['replyType'];
    isMultipleFilesMessageEnabled?: SendbirdProviderProps['isMultipleFilesMessageEnabled'];
    colorSet?: SendbirdProviderProps['colorSet'];
    stringSet?: SendbirdProviderProps['stringSet'];
    allowProfileEdit?: SendbirdProviderProps['allowProfileEdit'];
    disableUserProfile?: SendbirdProviderProps['disableUserProfile'];
    disableMarkAsDelivered?: SendbirdProviderProps['disableMarkAsDelivered'];
    renderUserProfile?: SendbirdProviderProps['renderUserProfile'];
    showSearchIcon?: SendbirdProviderProps['showSearchIcon'];
    imageCompression?: SendbirdProviderProps['imageCompression'];
    isTypingIndicatorEnabledOnChannelList?: SendbirdProviderProps['isTypingIndicatorEnabledOnChannelList'];
    isMessageReceiptStatusEnabledOnChannelList?: SendbirdProviderProps['isMessageReceiptStatusEnabledOnChannelList'];
    uikitOptions?: SendbirdProviderProps['uikitOptions'];
    isUserIdUsedForNickname?: SendbirdProviderProps['isUserIdUsedForNickname'];
    sdkInitParams?: SendbirdProviderProps['sdkInitParams'];
    customExtensionParams?: SendbirdProviderProps['customExtensionParams'];
    eventHandlers?: SendbirdProviderProps['eventHandlers'];
    isMessageGroupingEnabled?: AppLayoutProps['isMessageGroupingEnabled'];
    disableAutoSelect?: AppLayoutProps['disableAutoSelect'];
    onProfileEditSuccess?: AppLayoutProps['onProfileEditSuccess'];
    /**
     * The default value is false.
     * If this option is enabled, it uses legacy modules (Channel, ChannelList) that are not applied local caching.
     * */
    enableLegacyChannelModules?: boolean;
}
export default function App(props: AppProps): React.JSX.Element;
export {};
