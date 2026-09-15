// ===== hooks/VoicePlayer/dux/initialState.d.ts =====
import { ObjectValues } from '../../../utils/typeHelpers/objectValues';
import { GroupKey } from '../utils';
export declare const VOICE_PLAYER_STATUS: {
    readonly IDLE: "IDLE";
    readonly PREPARING: "PREPARING";
    readonly PLAYING: "PLAYING";
    readonly PAUSED: "PAUSED";
    readonly COMPLETED: "COMPLETED";
};
export declare const VoicePlayerStatus: {
    readonly IDLE: "IDLE";
    readonly PREPARING: "PREPARING";
    readonly PLAYING: "PLAYING";
    readonly PAUSED: "PAUSED";
    readonly COMPLETED: "COMPLETED";
};
export type VoicePlayerStatusType = ObjectValues<typeof VOICE_PLAYER_STATUS>;
export type AudioStorageUnit = {
    playingStatus: VoicePlayerStatusType;
    audioFile: null | File;
    playbackTime: number;
    duration: number;
};
export declare const AudioUnitDefaultValue: () => AudioStorageUnit;
export interface VoicePlayerInitialState {
    currentPlayer: null | HTMLAudioElement;
    currentGroupKey: string;
    audioStorage: Record<GroupKey, AudioStorageUnit>;
}
export declare const voicePlayerInitialState: VoicePlayerInitialState;
// ===== hooks/VoicePlayer/index.d.ts =====
import React from 'react';
import { VoicePlayerInitialState } from './dux/initialState';
export interface VoicePlayerProps {
    children: React.ReactElement;
}
export interface VoicePlayerPlayProps {
    groupKey: string;
    audioFile?: File;
    audioFileUrl?: string;
    audioFileMimeType?: string;
}
export interface VoicePlayerContext {
    play: (props: VoicePlayerPlayProps) => void;
    pause: (groupKey?: string) => void;
    stop: (text?: string) => void;
    reset: (groupKey: string) => void;
    voicePlayerStore: VoicePlayerInitialState;
}
export declare const ALL = "ALL";
export declare const VoicePlayerProvider: ({ children, }: VoicePlayerProps) => React.ReactElement;
export declare const useVoicePlayerContext: () => VoicePlayerContext;
// ===== hooks/VoicePlayer/useVoicePlayer.d.ts =====
import { VoicePlayerStatusType } from './dux/initialState';
export interface UseVoicePlayerProps {
    key?: string;
    channelUrl?: string;
    audioFile?: File;
    audioFileUrl?: string;
    audioFileMimeType?: string;
}
export interface UseVoicePlayerContext {
    play: () => void;
    pause: () => void;
    stop: (text?: string) => void;
    playbackTime: number;
    duration: number;
    playingStatus: VoicePlayerStatusType;
}
export declare const useVoicePlayer: ({ key, channelUrl, audioFile, audioFileUrl, audioFileMimeType, }: UseVoicePlayerProps) => UseVoicePlayerContext;
// ===== hooks/VoicePlayer/utils.d.ts =====
export type GroupKey = string;
export declare const generateGroupKey: (channelUrl?: string, key?: string) => GroupKey;
/**
 * Parses and returns the correct MIME type based on the browser.
 * If the browser is Safari and the file type is m4a, use 'audio/x-m4a' for the audio player.
 * Safari doesn't support 'audio/mp3' well.
 * Also, 'audio/m4a' should be converted to 'audio/x-m4a' to be correctly played in Safari.
 * @link: https://sendbird.atlassian.net/browse/CLNP-2997
 *
 * @param mimeType - The original MIME type.
 * @returns Converted file name and MIME type.
 */
export declare const getParsedVoiceAudioFileInfo: (mimeType: string) => {
    name: string;
    mimeType: string;
};
// ===== hooks/VoiceRecorder/index.d.ts =====
import React from 'react';
export interface VoiceRecorderProps {
    children: React.ReactElement;
}
export interface VoiceRecorderEventHandler {
    onRecordingStarted?: () => void;
    onRecordingEnded?: (props: null | File) => void;
}
export interface VoiceRecorderContext {
    start: (eventHandler?: VoiceRecorderEventHandler) => void;
    stop: () => void;
    isRecordable: boolean;
}
export declare const VoiceRecorderProvider: (props: VoiceRecorderProps) => React.ReactElement;
export declare const useVoiceRecorderContext: () => VoiceRecorderContext;
declare const _default: {
    VoiceRecorderProvider: (props: VoiceRecorderProps) => React.ReactElement<any, string | React.JSXElementConstructor<any>>;
    useVoiceRecorderContext: () => VoiceRecorderContext;
};
export default _default;
// ===== hooks/VoiceRecorder/useVoiceRecorder.d.ts =====
import { VoiceRecorderEventHandler } from '.';
export declare const VoiceRecorderStatus: {
    readonly PREPARING: "PREPARING";
    readonly READY_TO_RECORD: "READY_TO_RECORD";
    readonly RECORDING: "RECORDING";
    readonly COMPLETED: "COMPLETED";
};
export type VoiceRecorderStatus = typeof VoiceRecorderStatus[keyof typeof VoiceRecorderStatus];
export interface UseVoiceRecorderContext {
    start: () => void;
    stop: () => void;
    cancel: () => void;
    recordingLimit: number;
    recordingTime: number;
    recordedFile: File | null;
    recordingStatus: VoiceRecorderStatus;
}
export declare const useVoiceRecorder: ({ onRecordingStarted, onRecordingEnded, }: VoiceRecorderEventHandler) => UseVoiceRecorderContext;
// ===== hooks/useConnectionState.d.ts =====
import { ConnectionState } from '@sendbird/chat';
export declare const useConnectionState: () => ConnectionState;
// ===== hooks/useLocalization.d.ts =====
/**
 * This file is only for re-exporting the `useLocalization` hook.
 * It should not be used internally within the project.
 */
import { useLocalization } from '../lib/LocalizationContext';
export { useLocalization } from '../lib/LocalizationContext';
export default useLocalization;
// ===== hooks/useModal/ModalRoot/index.d.ts =====
import { ReactElement } from 'react';
export declare const MODAL_ROOT = "sendbird-modal-root";
export declare const ModalRoot: () => ReactElement;
export default ModalRoot;
// ===== hooks/useModal/index.d.ts =====
import React, { ReactElement } from 'react';
import { type ModalProps } from '../../ui/Modal';
export type OpenGlobalModalProps = {
    modalProps: ModalProps;
    childElement: (props: {
        closeModal: () => void;
    }) => ReactElement;
};
export type GlobalModalProviderProps = React.PropsWithChildren<unknown>;
export interface GlobalModalContextInterface {
    openModal: (props: OpenGlobalModalProps) => void;
}
export declare const GlobalModalProvider: ({ children }: GlobalModalProviderProps) => React.JSX.Element;
export declare const useGlobalModalContext: () => GlobalModalContextInterface;
export * from './ModalRoot';
// ===== index.d.ts =====
export { default as SendBirdProvider } from './lib/Sendbird';
export { default as App } from './modules/App/index';
export { default as ChannelSettings } from './modules/ChannelSettings';
export { default as ChannelList } from './modules/ChannelList';
export { default as Channel } from './modules/Channel';
export { default as getStringSet } from './ui/Label/stringSet';
export { default as OpenChannel } from './modules/OpenChannel';
export { default as OpenChannelSettings } from './modules/OpenChannelSettings';
export { default as MessageSearch } from './modules/MessageSearch';
export { withSendBird } from './lib/Sendbird/index';
export { useSendbirdStateContext } from './lib/Sendbird/context/hooks/useSendbirdStateContext';
export { useSendbird } from './lib/Sendbird/context/hooks/useSendbird';
export { default as sendbirdSelectors } from './lib/selectors';
export { default as sendBirdSelectors } from './lib/selectors';
export { TypingIndicatorType } from './types';
// ===== lib/LocalizationContext.d.ts =====
import React from 'react';
import { StringSet } from '../ui/Label/stringSet';
import type { Locale } from 'date-fns';
declare const LocalizationContext: React.Context<{
    stringSet: StringSet;
    dateLocale: globalThis.Locale;
}>;
interface LocalizationProviderProps {
    stringSet: StringSet;
    dateLocale?: Locale;
    children: React.ReactElement;
}
declare const LocalizationProvider: (props: LocalizationProviderProps) => React.ReactElement;
declare const useLocalization: () => {
    stringSet: StringSet;
    dateLocale: globalThis.Locale;
};
export { LocalizationContext, LocalizationProvider, useLocalization };
// ===== lib/Logger/index.d.ts =====
import { ObjectValues } from '../../utils/typeHelpers/objectValues';
export declare const LOG_LEVELS: {
    readonly DEBUG: "debug";
    readonly WARNING: "warning";
    readonly ERROR: "error";
    readonly INFO: "info";
    readonly ALL: "all";
};
export type LogLevel = ObjectValues<typeof LOG_LEVELS>;
interface PrintLogProps {
    level: LogLevel;
    title?: string;
    description?: string;
    payload?: unknown[];
}
export declare const printLog: ({ level, title, description, payload, }: PrintLogProps) => void;
export interface LoggerInterface {
    info(title?: string, ...payload: unknown[]): void;
    error(title?: string, ...payload: unknown[]): void;
    warning(title?: string, ...payload: unknown[]): void;
}
export declare const getDefaultLogger: () => LoggerInterface;
export declare const LoggerFactory: (lvl: LogLevel, customInterface?: () => void) => LoggerInterface;
export {};
// ===== lib/Sendbird/context/hooks/useSendbird.d.ts =====
import { User } from '@sendbird/chat';
import { LoggerInterface } from '../../../Logger';
import { MessageTemplatesInfo, SendbirdState } from '../../types';
export declare const useSendbird: () => {
    state: SendbirdState;
    actions: {
        disconnect: ({ logger }: {
            logger: LoggerInterface;
        }) => Promise<void>;
        connect: (params: any) => Promise<void>;
        initUser: (payload: any) => void;
        resetUser: () => void;
        updateUserInfo: (payload: User) => void;
        setSdkLoading: (payload: any) => void;
        sdkError: () => void;
        initSdk: (payload: any) => void;
        resetSdk: () => void;
        initMessageTemplateInfo: ({ payload }: {
            payload: MessageTemplatesInfo;
        }) => void;
        upsertMessageTemplates: ({ payload }: {
            payload: any;
        }) => SendbirdState;
        upsertWaitingTemplateKeys: ({ payload }: {
            payload: any;
        }) => void;
        markErrorWaitingTemplateKeys: ({ payload }: {
            payload: any;
        }) => void;
    };
};
export default useSendbird;
// ===== lib/Sendbird/context/hooks/useSendbirdStateContext.d.ts =====
import { SendbirdState } from '../../types';
export declare function useSendbirdStateContext(): SendbirdState;
export default useSendbirdStateContext;
// ===== lib/Sendbird/index.d.ts =====
import React from 'react';
import './index.scss';
import './__experimental__typography.scss';
import type { SendbirdProviderProps } from './types';
export type { SendbirdProviderProps } from './types';
export declare const SendbirdProvider: (props: SendbirdProviderProps) => React.JSX.Element;
type ContextAwareComponentType = {
    (props: any): JSX.Element;
    displayName: string;
};
type PropsType = Record<string, any>;
/**
 * @deprecated This function is deprecated. Use `useSendbird` instead.
 * */
export declare const withSendBird: (OriginalComponent: any, mapStoreToProps: (props: any) => PropsType) => ContextAwareComponentType;
export default SendbirdProvider;
// ===== lib/Sendbird/types.d.ts =====
import React, { MutableRefObject } from 'react';
import type SendbirdChat from '@sendbird/chat';
import type { User, SendbirdChatParams, SendbirdError, SessionHandler } from '@sendbird/chat';
import type { GroupChannel, GroupChannelCreateParams, GroupChannelModule, Member, SendbirdGroupChat } from '@sendbird/chat/groupChannel';
import type { OpenChannel, OpenChannelCreateParams, OpenChannelModule, SendbirdOpenChat } from '@sendbird/chat/openChannel';
import type { FileMessageCreateParams, UserMessage, UserMessageCreateParams, UserMessageUpdateParams } from '@sendbird/chat/message';
import { Module, ModuleNamespaces } from '@sendbird/chat/lib/__definition';
import { SBUConfig } from '@sendbird/uikit-tools';
import { PartialDeep } from '../../utils/typeHelpers/partialDeep';
import { CoreMessageType } from '../../utils';
import { LoggerInterface } from '../Logger';
import { MarkAsReadSchedulerType } from '../hooks/useMarkAsReadScheduler';
import { MarkAsDeliveredSchedulerType } from '../hooks/useMarkAsDeliveredScheduler';
import { SBUGlobalPubSub } from '../pubSub/topics';
import { EmojiManager } from '../emojiManager';
import { StringSet } from '../../ui/Label/stringSet';
export type ReplyType = 'NONE' | 'QUOTE_REPLY' | 'THREAD';
export type ConfigureSessionTypes = (sdk: SendbirdChat | SendbirdGroupChat | SendbirdOpenChat) => SessionHandler;
export type CustomUseReducerDispatcher = React.Dispatch<{
    type: string;
    payload: any;
}>;
export type ImageCompressionOutputFormatType = 'preserve' | 'png' | 'jpeg';
export interface ImageCompressionOptions {
    compressionRate?: number;
    resizingWidth?: number | string;
    resizingHeight?: number | string;
    outputFormat?: ImageCompressionOutputFormatType;
}
export type Logger = LoggerInterface;
export declare const Role: {
    readonly OPERATOR: "operator";
    readonly NONE: "none";
};
export type RoleType = typeof Role[keyof typeof Role];
export type HTMLTextDirection = 'ltr' | 'rtl';
export interface RenderUserProfileProps {
    user: User | Member;
    currentUserId: string;
    close(): void;
    avatarRef: MutableRefObject<any>;
}
export interface UserListQuery {
    hasNext?: boolean;
    next(): Promise<Array<User>>;
    get isLoading(): boolean;
}
export interface MessageTemplatesInfo {
    token: string;
    templatesMap: Record<string, ProcessedMessageTemplate>;
}
export interface WaitingTemplateKeyData {
    requestedAt: number;
    erroredMessageIds: number[];
}
export type ProcessedMessageTemplate = {
    version: number;
    uiTemplate: string;
    colorVariables?: Record<string, string>;
};
export interface AppInfoStateType {
    messageTemplatesInfo?: MessageTemplatesInfo;
    /**
     * This represents template keys that are currently waiting for its fetch response.
     * Whenever initialized, request succeeds or fails, it needs to be updated.
     */
    waitingTemplateKeysMap: Record<string, WaitingTemplateKeyData>;
}
export interface SBUEventHandlers {
    reaction?: {
        onPressUserProfile?(member: User): void;
    };
    connection?: {
        onConnected?(user: User): void;
        onFailed?(error: SendbirdError): void;
    };
    modal?: {
        onMounted?(params: {
            id: string;
            close(): void;
        }): void | (() => void);
    };
    message?: {
        onSendMessageFailed?: (message: CoreMessageType, error: unknown) => void;
        onUpdateMessageFailed?: (message: CoreMessageType, error: unknown) => void;
        onFileUploadFailed?: (error: unknown) => void;
    };
}
interface VoiceRecordOptions {
    maxRecordingTime?: number;
    minRecordingTime?: number;
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
export interface CommonUIKitConfigProps {
    /** @deprecated Please use `uikitOptions.common.enableUsingDefaultUserProfile` instead * */
    disableUserProfile?: boolean;
    /** @deprecated Please use `uikitOptions.groupChannel.replyType` instead * */
    replyType?: 'NONE' | 'QUOTE_REPLY' | 'THREAD';
    /** @deprecated Please use `uikitOptions.groupChannel.enableReactions` instead * */
    isReactionEnabled?: boolean;
    /** @deprecated Please use `uikitOptions.groupChannel.enableMention` instead * */
    isMentionEnabled?: boolean;
    /** @deprecated Please use `uikitOptions.groupChannel.enableVoiceMessage` instead * */
    isVoiceMessageEnabled?: boolean;
    /** @deprecated Please use `uikitOptions.groupChannelList.enableTypingIndicator` instead * */
    isTypingIndicatorEnabledOnChannelList?: boolean;
    /** @deprecated Please use `uikitOptions.groupChannelList.enableMessageReceiptStatus` instead * */
    isMessageReceiptStatusEnabledOnChannelList?: boolean;
    /** @deprecated Please use `uikitOptions.groupChannelSettings.enableMessageSearch` instead * */
    showSearchIcon?: boolean;
}
export type SendbirdChatInitParams = Omit<SendbirdChatParams<Module[]>, 'appId'>;
export type CustomExtensionParams = Record<string, string>;
export type UIKitOptions = PartialDeep<{
    common: SBUConfig['common'];
    groupChannel: SBUConfig['groupChannel']['channel'];
    groupChannelList: SBUConfig['groupChannel']['channelList'];
    groupChannelSettings: SBUConfig['groupChannel']['setting'];
    openChannel: SBUConfig['openChannel']['channel'];
}>;
/**
 * Mount this once per application, at the app root.
 *
 * The provider uses the cached `SendbirdChat` singleton, so mounting several of them on one
 * `appId` shares a single instance and WebSocket, and using more than one `appId` on a page
 * replaces the singleton. Pass `sdkInitParams={{ newInstance: true }}` on any provider that
 * needs an instance of its own.
 */
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
    userListQuery?: () => UserListQuery;
    imageCompression?: ImageCompressionOptions;
    allowProfileEdit?: boolean;
    disableMarkAsDelivered?: boolean;
    breakpoint?: string | boolean;
    htmlTextDirection?: HTMLTextDirection;
    forceLeftToRightMessageLayout?: boolean;
    uikitOptions?: UIKitOptions;
    isUserIdUsedForNickname?: boolean;
    sdkInitParams?: SendbirdChatInitParams;
    customExtensionParams?: CustomExtensionParams;
    isMultipleFilesMessageEnabled?: boolean;
    autoscrollMessageOverflowToTop?: boolean;
    renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
    onBeforeStartDirectMessage?: (channelParams: GroupChannelCreateParams, users: User[]) => GroupChannelCreateParams;
    onStartDirectMessage?: (channel: GroupChannel) => void;
    /**
     * @deprecated Please use `onStartDirectMessage` instead. It's renamed.
     */
    onUserProfileMessage?: (channel: GroupChannel) => void;
    eventHandlers?: SBUEventHandlers;
}
export interface SendbirdStateConfig {
    renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
    onBeforeStartDirectMessage?: (channelParams: GroupChannelCreateParams, users: User[]) => GroupChannelCreateParams;
    onStartDirectMessage?: (props: GroupChannel) => void;
    allowProfileEdit: boolean;
    isOnline: boolean;
    userId: string;
    appId: string;
    accessToken?: string;
    theme: string;
    htmlTextDirection: HTMLTextDirection;
    forceLeftToRightMessageLayout: boolean;
    pubSub: SBUGlobalPubSub;
    logger: Logger;
    setCurrentTheme: (theme: 'light' | 'dark') => void;
    userListQuery?: () => UserListQuery;
    uikitUploadSizeLimit: number;
    uikitMultipleFilesMessageLimit: number;
    voiceRecord: {
        maxRecordingTime: number;
        minRecordingTime: number;
    };
    userMention: {
        maxMentionCount: number;
        maxSuggestionCount: number;
    };
    imageCompression: ImageCompressionOptions;
    markAsReadScheduler: MarkAsReadSchedulerType;
    markAsDeliveredScheduler: MarkAsDeliveredSchedulerType;
    disableMarkAsDelivered: boolean;
    isMultipleFilesMessageEnabled: boolean;
    autoscrollMessageOverflowToTop: boolean;
    common: {
        enableUsingDefaultUserProfile: SBUConfig['common']['enableUsingDefaultUserProfile'];
    };
    groupChannel: {
        enableOgtag: SBUConfig['groupChannel']['channel']['enableOgtag'];
        enableTypingIndicator: SBUConfig['groupChannel']['channel']['enableTypingIndicator'];
        enableReactions: SBUConfig['groupChannel']['channel']['enableReactions'];
        enableMention: SBUConfig['groupChannel']['channel']['enableMention'];
        replyType: SBUConfig['groupChannel']['channel']['replyType'];
        threadReplySelectType: SBUConfig['groupChannel']['channel']['threadReplySelectType'];
        enableVoiceMessage: SBUConfig['groupChannel']['channel']['enableVoiceMessage'];
        typingIndicatorTypes: SBUConfig['groupChannel']['channel']['typingIndicatorTypes'];
        enableDocument: SBUConfig['groupChannel']['channel']['input']['enableDocument'];
        enableFeedback: SBUConfig['groupChannel']['channel']['enableFeedback'];
        enableSuggestedReplies: SBUConfig['groupChannel']['channel']['enableSuggestedReplies'];
        showSuggestedRepliesFor: SBUConfig['groupChannel']['channel']['showSuggestedRepliesFor'];
        suggestedRepliesDirection: SBUConfig['groupChannel']['channel']['suggestedRepliesDirection'];
        enableMarkdownForUserMessage: SBUConfig['groupChannel']['channel']['enableMarkdownForUserMessage'];
        enableFormTypeMessage: SBUConfig['groupChannel']['channel']['enableFormTypeMessage'];
        enableMarkAsUnread: SBUConfig['groupChannel']['channel']['enableMarkAsUnread'];
        /**
         * @deprecated Currently, this feature is turned off by default. If you wish to use this feature, contact us: {@link https://dashboard.sendbird.com/settings/contact_us?category=feedback_and_feature_requests&product=UIKit}
         */
        enableReactionsSupergroup: never;
    };
    groupChannelList: {
        enableTypingIndicator: SBUConfig['groupChannel']['channelList']['enableTypingIndicator'];
        enableMessageReceiptStatus: SBUConfig['groupChannel']['channelList']['enableMessageReceiptStatus'];
    };
    groupChannelSettings: {
        enableMessageSearch: SBUConfig['groupChannel']['setting']['enableMessageSearch'];
    };
    openChannel: {
        enableOgtag: SBUConfig['openChannel']['channel']['enableOgtag'];
        enableDocument: SBUConfig['openChannel']['channel']['input']['enableDocument'];
    };
    /**
     * @deprecated Please use `onStartDirectMessage` instead. It's renamed.
     */
    onUserProfileMessage?: (props: GroupChannel) => void;
    /**
     * @deprecated Please use `!config.common.enableUsingDefaultUserProfile` instead.
     * Note that you should use the negation of `config.common.enableUsingDefaultUserProfile`
     * to replace `disableUserProfile`.
     */
    disableUserProfile: boolean;
    /** @deprecated Please use `config.groupChannel.enableReactions` instead * */
    isReactionEnabled: boolean;
    /** @deprecated Please use `config.groupChannel.enableMention` instead * */
    isMentionEnabled: boolean;
    /** @deprecated Please use `config.groupChannel.enableVoiceMessage` instead * */
    isVoiceMessageEnabled?: boolean;
    /** @deprecated Please use `config.groupChannel.replyType` instead * */
    replyType: ReplyType;
    /** @deprecated Please use `config.groupChannelSettings.enableMessageSearch` instead * */
    showSearchIcon?: boolean;
    /** @deprecated Please use `config.groupChannelList.enableTypingIndicator` instead * */
    isTypingIndicatorEnabledOnChannelList?: boolean;
    /** @deprecated Please use `config.groupChannelList.enableMessageReceiptStatus` instead * */
    isMessageReceiptStatusEnabledOnChannelList?: boolean;
    /** @deprecated Please use setCurrentTheme instead * */
    setCurrenttheme: (theme: 'light' | 'dark') => void;
}
export type SendbirdChatType = SendbirdChat & ModuleNamespaces<[GroupChannelModule, OpenChannelModule]>;
export interface SdkStore {
    error: boolean;
    initialized: boolean;
    loading: boolean;
    sdk: SendbirdChat & ModuleNamespaces<[GroupChannelModule, OpenChannelModule]>;
}
export interface UserStore {
    initialized: boolean;
    loading: boolean;
    user: User;
}
export interface AppInfoStore {
    messageTemplatesInfo?: MessageTemplatesInfo;
    /**
     * This represents template keys that are currently waiting for its fetch response.
     * Whenever initialized, request succeeds or fails, it needs to be updated.
     */
    waitingTemplateKeysMap: Record<string, WaitingTemplateKeyData>;
}
export interface SendbirdStateStore {
    sdkStore: SdkStore;
    userStore: UserStore;
    appInfoStore: AppInfoStore;
}
export type SendbirdState = {
    config: SendbirdStateConfig;
    stores: SendbirdStateStore;
    eventHandlers?: SBUEventHandlers;
    emojiManager: EmojiManager;
    utils: SendbirdProviderUtils;
};
export interface SendbirdProviderUtils {
    updateMessageTemplatesInfo: (templateKeys: string[], messageId: number, createdAt: number) => Promise<void>;
    getCachedTemplate: (key: string) => ProcessedMessageTemplate | null;
}
export interface sendbirdSelectorsInterface {
    getSdk: (store: SendbirdState) => SendbirdChat | undefined;
    getConnect: (store: SendbirdState) => (userId: string, accessToken?: string) => Promise<User>;
    getDisconnect: (store: SendbirdState) => () => Promise<void>;
    getUpdateUserInfo: (store: SendbirdState) => (nickName: string, profileUrl?: string) => Promise<User>;
    getCreateGroupChannel: (store: SendbirdState) => (channelParams: GroupChannelCreateParams) => Promise<GroupChannel>;
    getCreateOpenChannel: (store: SendbirdState) => (channelParams: OpenChannelCreateParams) => Promise<OpenChannel>;
    getGetGroupChannel: (store: SendbirdState) => (channelUrl: string, isSelected?: boolean) => Promise<GroupChannel>;
    getGetOpenChannel: (store: SendbirdState) => (channelUrl: string) => Promise<OpenChannel>;
    getLeaveGroupChannel: (store: SendbirdState) => (channel: GroupChannel) => Promise<void>;
    getEnterOpenChannel: (store: SendbirdState) => (channel: OpenChannel) => Promise<OpenChannel>;
    getExitOpenChannel: (store: SendbirdState) => (channel: OpenChannel) => Promise<void>;
    getFreezeChannel: (store: SendbirdState) => (channel: GroupChannel | OpenChannel) => Promise<void>;
    getUnFreezeChannel: (store: SendbirdState) => (channel: GroupChannel | OpenChannel) => Promise<void>;
    getSendUserMessage: (store: SendbirdState) => (channel: GroupChannel | OpenChannel, userMessageParams: UserMessageCreateParams) => any;
    getSendFileMessage: (store: SendbirdState) => (channel: GroupChannel | OpenChannel, fileMessageParams: FileMessageCreateParams) => any;
    getUpdateUserMessage: (store: SendbirdState) => (channel: GroupChannel | OpenChannel, messageId: string | number, params: UserMessageUpdateParams) => Promise<UserMessage>;
}
export {};
// ===== lib/Sendbird/withSendbird.d.ts =====
/**
 * This file is for the backward compatibility.
 */
import { withSendBird } from './index';
/**
 * @deprecated This function is deprecated. Use `useSendbird` instead.
 * */
export default withSendBird;
// ===== lib/UserProfileContext.d.ts =====
import React from 'react';
import type { User } from '@sendbird/chat';
import type { GroupChannel, GroupChannelCreateParams } from '@sendbird/chat/groupChannel';
import type { RenderUserProfileProps } from '../types';
interface UserProfileContextInterface {
    isOpenChannel: boolean;
    disableUserProfile: boolean;
    renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
    onBeforeStartDirectMessage?: (channelParams: GroupChannelCreateParams, users: User[]) => GroupChannelCreateParams;
    onStartDirectMessage?: (channel: GroupChannel) => void;
    /**
     * @deprecated This prop has been renamed to `onStartDirectMessage`.
     */
    onUserProfileMessage?: (channel: GroupChannel) => void;
}
/**
 * user profile goes deep inside the component tree
 * use this context as a short circuit to send in values
 */
export declare const UserProfileContext: React.Context<UserProfileContextInterface>;
export type UserProfileProviderProps = React.PropsWithChildren<Partial<UserProfileContextInterface> & {
    /** This prop is optional. It is no longer necessary to provide it because the value can be accessed through SendbirdStateContext. */
    disableUserProfile?: boolean;
    /** This prop is optional. It is no longer necessary to provide it because the value can be accessed through SendbirdStateContext. */
    renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
}>;
export declare const useUserProfileContext: () => UserProfileContextInterface;
export declare const UserProfileProvider: ({ isOpenChannel, disableUserProfile: _disableUserProfile, renderUserProfile: _renderUserProfile, onUserProfileMessage: _onUserProfileMessage, onBeforeStartDirectMessage: _onBeforeStartDirectMessage, onStartDirectMessage: _onStartDirectMessage, children, }: UserProfileProviderProps) => React.JSX.Element;
export {};
// ===== lib/emojiManager.d.ts =====
/**
 * ## How to use?
 *
 * const { emojiManager } = useSendbirdStateContext();
 * const allEmojis = emojiManager.getAllEmojis();
 * const emojiUrl = emojiManager.getEmojiUrl(reactionKey: string);
 *
 *
 * ## Additional util
 *
 * isReactedByMe(userId)
 */
import type { Emoji, EmojiContainer } from '@sendbird/chat';
import type { SendbirdChatType, Logger } from './Sendbird/types';
import { Reaction } from '@sendbird/chat/message';
export interface EmojiManagerParams {
    sdk: SendbirdChatType;
    logger?: Logger;
}
export declare class EmojiManager {
    private _emojiContainer;
    constructor(props: EmojiManagerParams);
    private get AllEmojisAsArray();
    private get AllEmojisAsMap();
    getAllEmojis(type: string): Emoji[] | Map<string, string>;
    getEmojiUrl(reactionKey: Reaction['key']): string;
    get emojiContainer(): EmojiContainer;
}
// ===== lib/handlers/ConnectionHandler.d.ts =====
import { ConnectionHandler } from '@sendbird/chat';
/**
 * Returns the instance of ConnectionHandler
 */
export default ConnectionHandler;
// ===== lib/handlers/GroupChannelHandler.d.ts =====
import { GroupChannelHandler } from '@sendbird/chat/groupChannel';
/**
 * Returns the instance of GroupChannelHandler
 * workaround for: https://sendbird.atlassian.net/browse/UIKIT-1993
 * Recommended fix: remove instanceOf validation check from SDK
 */
export default GroupChannelHandler;
// ===== lib/handlers/OpenChannelHandler.d.ts =====
/**
 * Returns the instance of OpenChannelHandler
 */
import { OpenChannelHandler } from '@sendbird/chat/openChannel';
export default OpenChannelHandler;
// ===== lib/handlers/SessionHandler.d.ts =====
/**
 * Returns the instance of SessionHandler
 */
import { SessionHandler } from '@sendbird/chat';
export default SessionHandler;
// ===== lib/handlers/UserEventHandler.d.ts =====
import { UserEventHandler } from '@sendbird/chat';
/**
 * Returns the class of UserEventHandler
 */
export default UserEventHandler;
// ===== lib/hooks/useMarkAsDeliveredScheduler.d.ts =====
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { Logger } from '../Sendbird/types';
export type MarkAsDeliveredSchedulerType = {
    push: (channel: GroupChannel) => void;
    clear: () => void;
    getQueue: () => GroupChannel[];
};
interface DynamicParams {
    isConnected: boolean;
}
interface StaticParams {
    logger: Logger;
}
export declare function useMarkAsDeliveredScheduler({ isConnected, }: DynamicParams, { logger, }: StaticParams): MarkAsDeliveredSchedulerType;
export {};
// ===== lib/hooks/useMarkAsReadScheduler.d.ts =====
import { GroupChannel } from '@sendbird/chat/groupChannel';
import type { Logger } from '../Sendbird/types';
export type MarkAsReadSchedulerType = {
    push: (channel: GroupChannel) => void;
    clear: () => void;
    getQueue: () => GroupChannel[];
};
interface DynamicParams {
    isConnected: boolean;
}
interface StaticParams {
    logger: Logger;
}
export declare function useMarkAsReadScheduler({ isConnected, }: DynamicParams, { logger, }: StaticParams): MarkAsReadSchedulerType;
export {};
// ===== lib/pubSub/index.d.ts =====
export type PubSubTypes<T extends keyof any, U extends {
    topic: T;
    payload: any;
}> = {
    __getTopics: () => Record<T, Set<(data: PayloadByTopic<T, U>) => void>>;
    subscribe: <K extends T>(topic: K, subscriber: (data: PayloadByTopic<K, U>) => void) => {
        remove: () => void;
    };
    publish: <K extends T>(topic: K, data: PayloadByTopic<K, U>) => void;
};
type PayloadByTopic<T extends keyof any, U> = U extends {
    topic: T;
    payload: infer P;
} ? P : never;
type Options = {
    publishSynchronous?: boolean;
};
declare const pubSubFactory: <T extends string | number | symbol = string | number | symbol, U extends {
    topic: T;
    payload: any;
} = any>(opts?: Options) => PubSubTypes<T, U>;
export default pubSubFactory;
// ===== lib/pubSub/topics.d.ts =====
import { PublishingModuleType } from '../../modules/internalInterfaces';
import { UploadableFileInfo } from '@sendbird/chat/message';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { PubSubTypes } from './index';
import { OpenChannel } from '@sendbird/chat/openChannel';
import { SendableMessageType } from '../../utils';
export { PublishingModuleType } from '../../modules/internalInterfaces';
export declare enum PUBSUB_TOPICS {
    USER_UPDATED = "USER_UPDATED",// NOTE: Unused topic
    SEND_MESSAGE_START = "SEND_MESSAGE_START",
    SEND_MESSAGE_FAILED = "SEND_MESSAGE_FAILED",
    SEND_USER_MESSAGE = "SEND_USER_MESSAGE",
    SEND_FILE_MESSAGE = "SEND_FILE_MESSAGE",
    ON_FILE_INFO_UPLOADED = "ON_FILE_INFO_UPLOADED",
    UPDATE_USER_MESSAGE = "UPDATE_USER_MESSAGE",
    DELETE_MESSAGE = "DELETE_MESSAGE",
    LEAVE_CHANNEL = "LEAVE_CHANNEL",// NOTE: No one publish this topic
    CREATE_CHANNEL = "CREATE_CHANNEL",
    UPDATE_OPEN_CHANNEL = "UPDATE_OPEN_CHANNEL"
}
export type PubSubSendMessagePayload = {
    message: SendableMessageType;
    channel: GroupChannel | OpenChannel;
    publishingModules: PublishingModuleType[];
};
export type SBUGlobalPubSubTopicPayloadUnion = {
    topic: PUBSUB_TOPICS.SEND_MESSAGE_START;
    payload: PubSubSendMessagePayload & {
        message: SendableMessageType & {
            url?: string;
            requestState?: 'pending';
        };
    };
} | {
    topic: PUBSUB_TOPICS.SEND_MESSAGE_FAILED;
    payload: PubSubSendMessagePayload & {
        error: Error;
    };
} | {
    topic: PUBSUB_TOPICS.SEND_USER_MESSAGE;
    payload: PubSubSendMessagePayload;
} | {
    topic: PUBSUB_TOPICS.SEND_FILE_MESSAGE;
    payload: PubSubSendMessagePayload;
} | {
    topic: PUBSUB_TOPICS.ON_FILE_INFO_UPLOADED;
    payload: {
        response: {
            channelUrl: string;
            requestId: string;
            index: number;
            uploadableFileInfo: UploadableFileInfo;
            error: Error;
        };
        publishingModules: PublishingModuleType[];
    };
} | {
    topic: PUBSUB_TOPICS.UPDATE_USER_MESSAGE;
    payload: {
        message: SendableMessageType;
        channel: GroupChannel | OpenChannel;
        publishingModules: PublishingModuleType[];
        fromSelector?: boolean;
    };
} | {
    topic: PUBSUB_TOPICS.DELETE_MESSAGE;
    payload: {
        messageId: number;
        channel: GroupChannel | OpenChannel;
    };
} | {
    topic: PUBSUB_TOPICS.LEAVE_CHANNEL;
    payload: {
        channel: GroupChannel;
    };
} | {
    topic: PUBSUB_TOPICS.CREATE_CHANNEL;
    payload: {
        channel: GroupChannel;
    };
} | {
    topic: PUBSUB_TOPICS.UPDATE_OPEN_CHANNEL;
    payload: OpenChannel;
};
export type SBUGlobalPubSub = PubSubTypes<PUBSUB_TOPICS, SBUGlobalPubSubTopicPayloadUnion>;
export default PUBSUB_TOPICS;
// ===== lib/selectors.d.ts =====
import type { User } from '@sendbird/chat';
import { FailedMessageHandler, MessageHandler, UserMessage, UserMessageCreateParams } from '@sendbird/chat/message';
import { GroupChannel, GroupChannelCreateParams } from '@sendbird/chat/groupChannel';
import { OpenChannel, OpenChannelCreateParams } from '@sendbird/chat/openChannel';
import { FileMessage, FileMessageCreateParams, SendableMessage, UserMessageUpdateParams } from '@sendbird/chat/lib/__definition';
import { SendbirdState } from './Sendbird/types';
import { SendableMessageType } from '../utils';
import { PublishingModuleType } from '../modules/internalInterfaces';
/**
 * 1. UIKit Instances
 *    a. getSdk
 *    b. getPubSub
 * 2. Chat & Connection
 *    a. getConnect
 *    b. getDisconnect
 *    c. getUpdateUserInfo
 * 3. Channel
 *    a. getCreateGroupChannel
 *    b. getCreateOpenChannel
 *    c. getGetGroupChannel
 *    d. getGetOpenChannel
 *    e. getLeaveGroupChannel
 *    f. getEnterOpenChannel
 *    g. getExitOpenChannel
 *    h. getFreezeChannel
 *    i. getUnfreezeChannel
 * 4. Message
 *    a. getSendUserMessage
 *    b. getSendFileMessage
 *    c. getUpdateUserMessage
 *    d. x - getUpdateFileMessage
 *    e. getDeleteMessage
 *    f. getResendUserMessage
 *    g. getResendFileMessage
 */
/**
 * import useSendbirdStateContext from '@sendbird-uikit/useSendbirdStateContext'
 * import selectors from '@sendbird-uikit/send'
 * const state = useSendbirdStateContext();
 */
/**
 * const sdk = selectors.getSdk(state);
 */
export declare const getSdk: (state: SendbirdState) => import("@sendbird/chat").default & import("@sendbird/chat/lib/__definition").ModuleNamespaces<[import("@sendbird/chat/groupChannel").GroupChannelModule, import("@sendbird/chat/openChannel").OpenChannelModule]>;
/**
 * const pubSub = selectors.getPubSub(state);
 */
export declare const getPubSub: (state: SendbirdState) => import("./pubSub/topics").SBUGlobalPubSub;
/**
 * const connect = selectors.getConnect(state);
 * connect('user-id-sendbirdian', 'access-token-0000')
 *  .then((user) => {})
 *  .catch((error) => {})
 */
export declare const getConnect: (state: SendbirdState) => (userId: string, accessToken?: string) => Promise<User>;
/**
 * const disconnect = selectors.getDisconnect(state);
 * disconnect()
 *  .then(() => {})
 *  .catch((error) => {})
 */
export declare const getDisconnect: (state: SendbirdState) => () => Promise<void>;
/**
 * const updateUserInfo = selectors.getUpdateUserInfo(state);
 * updateUserInfo('new-nickname', 'new-profile-url')
 *  .then((user) => {})
 *  .catch((error) => {})
 */
export declare const getUpdateUserInfo: (state: SendbirdState) => (nickname: string, profileUrl?: string) => Promise<User>;
/**
 * const createGroupChannel = selectors.getCreateGroupChannel(state);
 * createGroupChannel(channelParams: GroupChannelCreateParams)
 *  .then((channel) => {})
 *  .catch((error) => {})
 */
export declare const getCreateGroupChannel: (state: SendbirdState) => (params: GroupChannelCreateParams) => Promise<GroupChannel>;
/**
 * const createOpenChannel = selectors.getCreateOpenChannel(state);
 * createOpenChannel(channelParams: OpenChannelCreateParams)
 *  .then((channel) => {})
 *  .catch((error) => {})
 */
export declare const getCreateOpenChannel: (state: SendbirdState) => (params: OpenChannelCreateParams) => Promise<OpenChannel>;
/**
 * const getGroupChannel = selectors.getGetGroupChannel(state);
 * getGroupChannel('channel-url-1234', isSelected)
 *  .then((channel) => {
 *    // groupChannel = channel;
 *    // or
 *    // setCurrentChannel(channel);
 *  })
 *  .catch((error) => {})
 */
export declare const getGetGroupChannel: (state: SendbirdState) => (channelUrl: string) => Promise<GroupChannel>;
/**
 * const getOpenChannel = selectors.getGetOpenChannel(state);
 * getOpenChannel('channel-url-12345')
 *  .then((channel) => {
 *    // openChannel = channel;
 *    // or
 *    // setCurrentChannel(channel);
 *  })
 *  .catch((error) => {})
 */
export declare const getGetOpenChannel: (state: SendbirdState) => (channelUrl: string) => Promise<OpenChannel>;
/**
 * const leaveChannel = selectors.getLeaveGroupChannel(state);
 * leaveChannel('group-channel-url')
 *  .then((channel) => {})
 *  .catch((error) => {})
 */
export declare const getLeaveGroupChannel: (state: SendbirdState) => (channelUrl: string) => Promise<void>;
/**
 * const enterChannel = selectors.getEnterOpenChannel(state);
 * enterChannel('open-channel-url')
 *  .then((channel) => {})
 *  .catch((error) => {})
 */
export declare const getEnterOpenChannel: (state: SendbirdState) => (channelUrl: string) => Promise<OpenChannel>;
/**
 * const exitChannel = selectors.getExitOpenChannel(state);
 * exitChannel('open-channel-url')
 *  .then((channel) => {})
 *  .catch((error) => {})
 */
export declare const getExitOpenChannel: (state: SendbirdState) => (channelUrl: string) => Promise<OpenChannel>;
/**
 * const freezeChannel = selectors.getFreezeChannel(currentChannel);
 * freezeChannel()
 *  .then(() => {})
 *  .catch((error) => {})
 */
export declare const getFreezeChannel: () => (channel: GroupChannel | OpenChannel) => Promise<void>;
/**
 * const unfreezeChannel = selectors.getUnfreezeChannel(currentChannel);
 * unfreezeChannel()
 *  .then((channel) => {})
 *  .catch((error) => {})
 */
export declare const getUnfreezeChannel: () => (channel: GroupChannel | OpenChannel) => Promise<void>;
export declare class UikitMessageHandler<T extends SendableMessage = SendableMessage> {
    private _onPending;
    private _onFailed;
    private _onSucceeded;
    triggerPending(message: T): void;
    triggerFailed(error: Error, message: T | null): void;
    triggerSucceeded(message: T): void;
    onPending(handler: MessageHandler<T>): UikitMessageHandler<T>;
    onFailed(handler: FailedMessageHandler<T>): UikitMessageHandler<T>;
    onSucceeded(handler: MessageHandler<T>): UikitMessageHandler<T>;
}
/**
 * const sendUserMessage = selectors.getSendUserMessage(state);
 * sendUserMessage(
 *  channel: GroupChannel | OpenChannel,
 *  params: UserMessageCreateParams,
 * )
 *  .onPending((message) => {})
 *  .onFailed((error, message) => {})
 *  .onSucceeded((message) => {})
 */
export declare const getSendUserMessage: (state: SendbirdState, publishingModules?: PublishingModuleType[]) => (channel: GroupChannel | OpenChannel, params: UserMessageCreateParams) => UikitMessageHandler;
/**
 * const sendFileMessage = selectors.getSendFileMessage(state);
 * sendFileMessage(
 *  channel: GroupChannel | OpenChannel,
 *  params: FileMessageCreateParams,
 * )
 *  .onPending((message) => {})
 *  .onFailed((error, message) => {})
 *  .onSucceeded((message) => {})
 */
export declare const getSendFileMessage: (state: SendbirdState, publishingModules?: PublishingModuleType[]) => (channel: GroupChannel | OpenChannel, params: FileMessageCreateParams) => UikitMessageHandler;
/**
 * const updateUserMessage = selectors.getUpdateUserMessage(state);
 * updateUserMessage(
 *  channel: GroupChannel | OpenChannel,
 *  messageId: number,
 *  messageParams: UserMessageUpdateParams,
 * )
 *  .then((message) => {})
 *  .catch((error) => {})
 */
export declare const getUpdateUserMessage: (state: SendbirdState, publishingModules?: PublishingModuleType[]) => (channel: GroupChannel | OpenChannel, messageId: number, params: UserMessageUpdateParams) => Promise<UserMessage>;
/**
 * const updateFileMessage = selectors.getUpdateFileMessage(state);
 * updateFileMessage(
 *  channel: GroupChannel | OpenChannel,
 *  messageId: number,
 *  params: FileMessageUpdateParams,
 * )
 *  .then((message) => {})
 *  .catch((error) => {})
 */
/**
 * const deleteMessage = selectors.getDeleteMessage(state);
 * deleteMessage(
 *  channel: GroupChannel | OpenChannel,
 *  message: SendableMessage,
 * )
 *  .then((deletedMessage) => {})
 *  .catch((error) => {})
 */
export declare const getDeleteMessage: (state: SendbirdState) => (channel: GroupChannel | OpenChannel, message: SendableMessageType) => Promise<SendableMessageType>;
/**
 * const resendUserMessage = selectors.getResendUserMessage(state);
 * resendUserMessage(
 *  channel: GroupChannel | OpenChannel,
 *  failedMessage: UserMessage,
 * )
 *  .then(() => {})
 *  .catch((error) => {})
 */
export declare const getResendUserMessage: (state: SendbirdState, publishingModules?: PublishingModuleType[]) => (channel: GroupChannel | OpenChannel, failedMessage: UserMessage) => Promise<UserMessage>;
/**
 * const resendFileMessage = selectors.getResendFileMessage(state);
 * resendFileMessage(
 *  channel: GroupChannel | OpenChannel,
 *  failedMessage: FileMessage,
 *  blob: Blob,
 * )
 *  .then(() => {})
 *  .catch((error) => {})
 */
export declare const getResendFileMessage: (state: SendbirdState, publishingModules?: PublishingModuleType[]) => (channel: GroupChannel | OpenChannel, failedMessage: FileMessage, blob: Blob) => Promise<FileMessage>;
declare const sendbirdSelectors: {
    getSdk: (state: SendbirdState) => import("@sendbird/chat").default & import("@sendbird/chat/lib/__definition").ModuleNamespaces<[import("@sendbird/chat/groupChannel").GroupChannelModule, import("@sendbird/chat/openChannel").OpenChannelModule]>;
    getPubSub: (state: SendbirdState) => import("./pubSub/topics").SBUGlobalPubSub;
    getConnect: (state: SendbirdState) => (userId: string, accessToken?: string) => Promise<User>;
    getDisconnect: (state: SendbirdState) => () => Promise<void>;
    getUpdateUserInfo: (state: SendbirdState) => (nickname: string, profileUrl?: string) => Promise<User>;
    getCreateGroupChannel: (state: SendbirdState) => (params: GroupChannelCreateParams) => Promise<GroupChannel>;
    getCreateOpenChannel: (state: SendbirdState) => (params: OpenChannelCreateParams) => Promise<OpenChannel>;
    getGetGroupChannel: (state: SendbirdState) => (channelUrl: string) => Promise<GroupChannel>;
    getGetOpenChannel: (state: SendbirdState) => (channelUrl: string) => Promise<OpenChannel>;
    getLeaveGroupChannel: (state: SendbirdState) => (channelUrl: string) => Promise<void>;
    getEnterOpenChannel: (state: SendbirdState) => (channelUrl: string) => Promise<OpenChannel>;
    getExitOpenChannel: (state: SendbirdState) => (channelUrl: string) => Promise<OpenChannel>;
    getFreezeChannel: () => (channel: GroupChannel | OpenChannel) => Promise<void>;
    getUnfreezeChannel: () => (channel: GroupChannel | OpenChannel) => Promise<void>;
    getSendUserMessage: (state: SendbirdState, publishingModules?: PublishingModuleType[]) => (channel: GroupChannel | OpenChannel, params: UserMessageCreateParams) => UikitMessageHandler;
    getSendFileMessage: (state: SendbirdState, publishingModules?: PublishingModuleType[]) => (channel: GroupChannel | OpenChannel, params: FileMessageCreateParams) => UikitMessageHandler;
    getUpdateUserMessage: (state: SendbirdState, publishingModules?: PublishingModuleType[]) => (channel: GroupChannel | OpenChannel, messageId: number, params: UserMessageUpdateParams) => Promise<UserMessage>;
    getDeleteMessage: (state: SendbirdState) => (channel: GroupChannel | OpenChannel, message: SendableMessageType) => Promise<SendableMessageType>;
    getResendUserMessage: (state: SendbirdState, publishingModules?: PublishingModuleType[]) => (channel: GroupChannel | OpenChannel, failedMessage: UserMessage) => Promise<UserMessage>;
    getResendFileMessage: (state: SendbirdState, publishingModules?: PublishingModuleType[]) => (channel: GroupChannel | OpenChannel, failedMessage: FileMessage, blob: Blob) => Promise<FileMessage>;
};
export default sendbirdSelectors;
// ===== modules/App/index.d.ts =====
/**
 * This is a drop in Chat solution
 * Can also be used as an example for creating
 * default chat apps
 */
import React from 'react';
import { SendbirdProviderProps } from '../../lib/Sendbird';
import './index.scss';
import { AppLayoutProps } from './types';
export interface AppProps {
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
    voiceRecord?: SendbirdProviderProps['voiceRecord'];
    isMultipleFilesMessageEnabled?: SendbirdProviderProps['isMultipleFilesMessageEnabled'];
    autoscrollMessageOverflowToTop?: SendbirdProviderProps['autoscrollMessageOverflowToTop'];
    colorSet?: SendbirdProviderProps['colorSet'];
    stringSet?: SendbirdProviderProps['stringSet'];
    allowProfileEdit?: SendbirdProviderProps['allowProfileEdit'];
    disableMarkAsDelivered?: SendbirdProviderProps['disableMarkAsDelivered'];
    renderUserProfile?: SendbirdProviderProps['renderUserProfile'];
    onBeforeStartDirectMessage?: SendbirdProviderProps['onBeforeStartDirectMessage'];
    imageCompression?: SendbirdProviderProps['imageCompression'];
    uikitOptions?: SendbirdProviderProps['uikitOptions'];
    isUserIdUsedForNickname?: SendbirdProviderProps['isUserIdUsedForNickname'];
    sdkInitParams?: SendbirdProviderProps['sdkInitParams'];
    customExtensionParams?: SendbirdProviderProps['customExtensionParams'];
    eventHandlers?: SendbirdProviderProps['eventHandlers'];
    isMessageGroupingEnabled?: AppLayoutProps['isMessageGroupingEnabled'];
    disableAutoSelect?: AppLayoutProps['disableAutoSelect'];
    onProfileEditSuccess?: AppLayoutProps['onProfileEditSuccess'];
    htmlTextDirection?: AppLayoutProps['htmlTextDirection'];
    forceLeftToRightMessageLayout?: AppLayoutProps['forceLeftToRightMessageLayout'];
    /**
     * The default value is false.
     * If this option is enabled, it uses legacy modules (Channel, ChannelList) that are not applied local caching.
     * */
    enableLegacyChannelModules?: boolean;
    /** @deprecated Please use `uikitOptions.common.enableUsingDefaultUserProfile` instead * */
    disableUserProfile?: SendbirdProviderProps['disableUserProfile'];
    /** @deprecated Please use `uikitOptions.groupChannel.replyType` instead * */
    replyType?: SendbirdProviderProps['replyType'];
    /** @deprecated Please use `uikitOptions.groupChannel.enableReactions` instead * */
    isReactionEnabled?: SendbirdProviderProps['isReactionEnabled'];
    /** @deprecated Please use `uikitOptions.groupChannel.enableMention` instead * */
    isMentionEnabled?: SendbirdProviderProps['isMentionEnabled'];
    /** @deprecated Please use `uikitOptions.groupChannel.enableVoiceMessage` instead * */
    isVoiceMessageEnabled?: SendbirdProviderProps['isVoiceMessageEnabled'];
    /** @deprecated Please use `uikitOptions.groupChannelList.enableTypingIndicator` instead * */
    isTypingIndicatorEnabledOnChannelList?: SendbirdProviderProps['isTypingIndicatorEnabledOnChannelList'];
    /** @deprecated Please use `uikitOptions.groupChannelList.enableMessageReceiptStatus` instead * */
    isMessageReceiptStatusEnabledOnChannelList?: SendbirdProviderProps['isMessageReceiptStatusEnabledOnChannelList'];
    /** @deprecated Please use `uikitOptions.groupChannelSettings.enableMessageSearch` instead * */
    showSearchIcon?: SendbirdProviderProps['showSearchIcon'];
}
export default function App(props: AppProps): React.JSX.Element;
// ===== modules/App/types.d.ts =====
/// <reference types="react" />
import type { User } from '@sendbird/chat';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import type { Locale } from 'date-fns';
import { ReplyType, UserListQuery, RenderUserProfileProps, SendBirdProviderConfig, HTMLTextDirection } from '../../types';
import { CustomExtensionParams, SBUEventHandlers, SendbirdChatInitParams } from '../../lib/Sendbird/types';
import { SendableMessageType } from '../../utils';
export interface AppLayoutProps {
    isReactionEnabled?: boolean;
    replyType?: 'NONE' | 'QUOTE_REPLY' | 'THREAD';
    htmlTextDirection?: HTMLTextDirection;
    forceLeftToRightMessageLayout?: boolean;
    isMessageGroupingEnabled?: boolean;
    isMultipleFilesMessageEnabled?: boolean;
    autoscrollMessageOverflowToTop?: boolean;
    allowProfileEdit?: boolean;
    showSearchIcon?: boolean;
    onProfileEditSuccess?(user: User): void;
    disableAutoSelect?: boolean;
    currentChannel?: GroupChannel;
    setCurrentChannel: React.Dispatch<GroupChannel | undefined>;
    enableLegacyChannelModules: boolean;
}
interface SubLayoutCommonProps {
    highlightedMessage?: number | null;
    setHighlightedMessage?: React.Dispatch<number | null>;
    startingPoint?: number | null;
    setStartingPoint: React.Dispatch<number | null>;
    threadTargetMessage: SendableMessageType | null;
    setThreadTargetMessage: React.Dispatch<SendableMessageType>;
}
export interface MobileLayoutProps extends AppLayoutProps, SubLayoutCommonProps {
}
export interface DesktopLayoutProps extends AppLayoutProps, SubLayoutCommonProps {
    showSettings: boolean;
    setShowSettings: React.Dispatch<boolean>;
    showSearch: boolean;
    setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
    showThread: boolean;
    setShowThread: React.Dispatch<boolean>;
}
export default interface AppProps {
    appId: string;
    userId: string;
    accessToken?: string;
    customApiHost?: string;
    customWebSocketHost?: string;
    theme?: 'light' | 'dark';
    userListQuery?(): UserListQuery;
    nickname?: string;
    profileUrl?: string;
    dateLocale?: Locale;
    allowProfileEdit?: boolean;
    disableUserProfile?: boolean;
    showSearchIcon?: boolean;
    renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
    onProfileEditSuccess?(user: User): void;
    config?: SendBirdProviderConfig;
    isReactionEnabled?: boolean;
    isMessageGroupingEnabled?: boolean;
    stringSet?: Record<string, string>;
    colorSet?: Record<string, string>;
    imageCompression?: {
        compressionRate?: number;
        resizingWidth?: number | string;
        resizingHeight?: number | string;
    };
    replyType?: ReplyType;
    disableAutoSelect?: boolean;
    isTypingIndicatorEnabledOnChannelList?: boolean;
    isMessageReceiptStatusEnabledOnChannelList?: boolean;
    sdkInitParams?: SendbirdChatInitParams;
    customExtensionParams?: CustomExtensionParams;
    eventHandlers?: SBUEventHandlers;
}
export {};
// ===== modules/Channel/components/ChannelHeader/index.d.ts =====
import React from 'react';
export interface ChannelHeaderProps {
    className?: string;
}
/**
 * @deprecated This component is deprecated and will be removed in the next major update.
 * Please use the `GroupChannel` component from '@sendbird/uikit-react/GroupChannel' instead.
 * For more information, please refer to the migration guide:
 * https://docs.sendbird.com/docs/chat/uikit/v3/react/introduction/group-channel-migration-guide
 */
export declare const ChannelHeader: ({ className }: ChannelHeaderProps) => React.JSX.Element;
export default ChannelHeader;
// ===== modules/Channel/components/ChannelUI/index.d.ts =====
import React from 'react';
import { GroupChannelUIBasicProps } from '../../../GroupChannel/components/GroupChannelUI/GroupChannelUIView';
export interface ChannelUIProps extends GroupChannelUIBasicProps {
    isLoading?: boolean;
    /**
     * Customizes all child components of the message component.
     * */
    renderMessage?: GroupChannelUIBasicProps['renderMessage'];
}
/**
 * @deprecated This component is deprecated and will be removed in the next major update.
 * Please use the `GroupChannel` component from '@sendbird/uikit-react/GroupChannel' instead.
 * For more information, please refer to the migration guide:
 * https://docs.sendbird.com/docs/chat/uikit/v3/react/introduction/group-channel-migration-guide
 */
declare const ChannelUI: (props: ChannelUIProps) => React.JSX.Element;
export default ChannelUI;
// ===== modules/Channel/components/FileViewer/index.d.ts =====
import React from 'react';
import type { FileMessage } from '@sendbird/chat/message';
export interface FileViewerProps {
    onCancel: () => void;
    message: FileMessage;
}
/**
 * @deprecated This component is deprecated and will be removed in the next major update.
 * Please use the `GroupChannel` component from '@sendbird/uikit-react/GroupChannel' instead.
 * For more information, please refer to the migration guide:
 * https://docs.sendbird.com/docs/chat/uikit/v3/react/introduction/group-channel-migration-guide
 */
export declare const FileViewer: (props: FileViewerProps) => React.JSX.Element;
export default FileViewer;
// ===== modules/Channel/components/FrozenNotification/index.d.ts =====
import FrozenNotification from '../../../GroupChannel/components/FrozenNotification';
export default FrozenNotification;
// ===== modules/Channel/components/Message/index.d.ts =====
import React from 'react';
import { MessageProps } from '../../../GroupChannel/components/Message/MessageView';
/**
 * @deprecated This component is deprecated and will be removed in the next major update.
 * Please use the `GroupChannel` component from '@sendbird/uikit-react/GroupChannel' instead.
 * For more information, please refer to the migration guide:
 * https://docs.sendbird.com/docs/chat/uikit/v3/react/introduction/group-channel-migration-guide
 */
declare const Message: (props: MessageProps) => React.JSX.Element;
export default Message;
// ===== modules/Channel/components/MessageInputWrapper/index.d.ts =====
import React from 'react';
import { GroupChannelUIBasicProps } from '../../../GroupChannel/components/GroupChannelUI/GroupChannelUIView';
export interface MessageInputWrapperProps {
    value?: string;
    disabled?: boolean;
    acceptableMimeTypes?: string[];
    renderFileUploadIcon?: GroupChannelUIBasicProps['renderFileUploadIcon'];
    renderVoiceMessageIcon?: GroupChannelUIBasicProps['renderVoiceMessageIcon'];
    renderSendMessageIcon?: GroupChannelUIBasicProps['renderSendMessageIcon'];
}
/**
 * @deprecated This component is deprecated and will be removed in the next major update.
 * Please use the `GroupChannel` component from '@sendbird/uikit-react/GroupChannel' instead.
 * For more information, please refer to the migration guide:
 * https://docs.sendbird.com/docs/chat/uikit/v3/react/introduction/group-channel-migration-guide
 */
export declare const MessageInputWrapper: (props: MessageInputWrapperProps) => React.JSX.Element;
export default MessageInputWrapper;
// ===== modules/Channel/components/MessageList/index.d.ts =====
import '../../../GroupChannel/components/MessageList/index.scss';
import React from 'react';
import { GroupChannelMessageListProps } from '../../../GroupChannel/components/MessageList';
import { GroupChannelUIBasicProps } from '../../../GroupChannel/components/GroupChannelUI/GroupChannelUIView';
export interface MessageListProps extends GroupChannelMessageListProps {
    /**
     * Customizes all child components of the message component.
     * */
    renderMessage?: GroupChannelUIBasicProps['renderMessage'];
}
/**
 * @deprecated This component is deprecated and will be removed in the next major update.
 * Please use the `GroupChannel` component from '@sendbird/uikit-react/GroupChannel' instead.
 * For more information, please refer to the migration guide:
 * https://docs.sendbird.com/docs/chat/uikit/v3/react/introduction/group-channel-migration-guide
 */
export declare const MessageList: (props: MessageListProps) => React.JSX.Element;
export default MessageList;
// ===== modules/Channel/components/RemoveMessageModal/index.d.ts =====
import React from 'react';
import { RemoveMessageModalProps } from '../../../GroupChannel/components/RemoveMessageModal/RemoveMessageModalView';
/**
 * @deprecated This component is deprecated and will be removed in the next major update.
 * Please use the `GroupChannel` component from '@sendbird/uikit-react/GroupChannel' instead.
 * For more information, please refer to the migration guide:
 * https://docs.sendbird.com/docs/chat/uikit/v3/react/introduction/group-channel-migration-guide
 */
declare const RemoveMessageModal: (props: RemoveMessageModalProps) => React.JSX.Element;
export default RemoveMessageModal;
// ===== modules/Channel/components/SuggestedMentionList/index.d.ts =====
import React from 'react';
import type { SuggestedMentionListViewProps } from '../../../GroupChannel/components/SuggestedMentionList/SuggestedMentionListView';
export type SuggestedMentionListProps = Omit<SuggestedMentionListViewProps, 'currentChannel'>;
/**
 * @deprecated This component is deprecated and will be removed in the next major update.
 * Please use the `GroupChannel` component from '@sendbird/uikit-react/GroupChannel' instead.
 * For more information, please refer to the migration guide:
 * https://docs.sendbird.com/docs/chat/uikit/v3/react/introduction/group-channel-migration-guide
 */
export declare const SuggestedMentionList: (props: SuggestedMentionListProps) => React.JSX.Element;
export default SuggestedMentionList;
// ===== modules/Channel/components/TypingIndicator.d.ts =====
import TypingIndicator from '../../GroupChannel/components/TypingIndicator';
export default TypingIndicator;
// ===== modules/Channel/components/UnreadCount/index.d.ts =====
import UnreadCount from '../../../GroupChannel/components/UnreadCount';
export default UnreadCount;
// ===== modules/Channel/context/ChannelProvider.d.ts =====
import React from 'react';
import type { GroupChannel, Member } from '@sendbird/chat/groupChannel';
import type { BaseMessage, FileMessage, FileMessageCreateParams, MultipleFilesMessage, MultipleFilesMessageCreateParams, UserMessage, UserMessageCreateParams, UserMessageUpdateParams, MessageListParams as SDKMessageListParams } from '@sendbird/chat/message';
import type { EmojiContainer, SendbirdError, User } from '@sendbird/chat';
import { ReplyType, Nullable } from '../../../types';
import { UserProfileProviderProps } from '../../../lib/UserProfileContext';
import { CoreMessageType, SendableMessageType } from '../../../utils';
import { ThreadReplySelectType } from './const';
import * as channelActions from './dux/actionTypes';
import { ChannelActionTypes } from './dux/actionTypes';
export { ThreadReplySelectType } from './const';
export interface MessageListParams extends Partial<SDKMessageListParams> {
    /** @deprecated It won't work even if you activate this props */
    reverse?: boolean;
}
export type ChannelQueries = {
    messageListParams?: MessageListParams;
};
export interface ChannelContextProps extends Pick<UserProfileProviderProps, 'disableUserProfile' | 'renderUserProfile'> {
    children?: React.ReactElement;
    channelUrl: string;
    isReactionEnabled?: boolean;
    isMessageGroupingEnabled?: boolean;
    isMultipleFilesMessageEnabled?: boolean;
    showSearchIcon?: boolean;
    animatedMessage?: number | null;
    highlightedMessage?: number | null;
    startingPoint?: number | null;
    onBeforeSendUserMessage?(text: string, quotedMessage?: SendableMessageType): UserMessageCreateParams;
    onBeforeSendFileMessage?(file: File, quotedMessage?: SendableMessageType): FileMessageCreateParams;
    onBeforeUpdateUserMessage?(text: string): UserMessageUpdateParams;
    onBeforeSendVoiceMessage?: (file: File, quotedMessage?: SendableMessageType) => FileMessageCreateParams;
    onBeforeSendMultipleFilesMessage?: (files: Array<File>, quotedMessage?: SendableMessageType) => MultipleFilesMessageCreateParams;
    onChatHeaderActionClick?(event: React.MouseEvent<HTMLElement>): void;
    onSearchClick?(): void;
    onBackClick?(): void;
    replyType?: ReplyType;
    threadReplySelectType?: ThreadReplySelectType;
    queries?: ChannelQueries;
    filterMessageList?(messages: BaseMessage): boolean;
    disableMarkAsRead?: boolean;
    onReplyInThread?: (props: {
        message: SendableMessageType;
    }) => void;
    onQuoteMessageClick?: (props: {
        message: SendableMessageType;
    }) => void;
    onMessageAnimated?: () => void;
    onMessageHighlighted?: () => void;
    scrollBehavior?: 'smooth' | 'auto';
    reconnectOnIdle?: boolean;
}
interface MessageStoreInterface {
    allMessages: CoreMessageType[];
    localMessages: CoreMessageType[];
    loading: boolean;
    initialized: boolean;
    /** @deprecated Please use `unreadSinceDate` instead * */
    unreadSince: string;
    unreadSinceDate: Date | null;
    isInvalid: boolean;
    currentGroupChannel: Nullable<GroupChannel>;
    hasMorePrev: boolean;
    oldestMessageTimeStamp: number;
    hasMoreNext: boolean;
    latestMessageTimeStamp: number;
    emojiContainer: EmojiContainer;
    readStatus: any;
    typingMembers: Member[];
}
interface SendMessageParams {
    message: string;
    quoteMessage?: SendableMessageType;
    mentionedUsers?: User[];
    mentionTemplate?: string;
}
interface UpdateMessageParams {
    messageId: number;
    message: string;
    mentionedUsers?: User[];
    mentionTemplate?: string;
}
export type SendMessageType = (params: SendMessageParams) => void;
export type UpdateMessageType = (props: UpdateMessageParams, callback?: (err: SendbirdError, message: UserMessage) => void) => void;
export interface ChannelProviderInterface extends ChannelContextProps, MessageStoreInterface {
    scrollToMessage(createdAt: number, messageId: number): void;
    isScrolled?: boolean;
    setIsScrolled?: React.Dispatch<React.SetStateAction<boolean>>;
    messageActionTypes: typeof channelActions;
    messagesDispatcher: React.Dispatch<ChannelActionTypes>;
    quoteMessage: SendableMessageType | null;
    setQuoteMessage: React.Dispatch<React.SetStateAction<SendableMessageType | null>>;
    initialTimeStamp: number | null | undefined;
    setInitialTimeStamp: React.Dispatch<React.SetStateAction<number | null | undefined>>;
    animatedMessageId: number | null;
    highLightedMessageId: number | null | undefined;
    nicknamesMap: Map<string, string>;
    emojiAllMap: any;
    onScrollCallback: (callback: () => void) => void;
    onScrollDownCallback: (callback: (param: [BaseMessage[], null] | [null, unknown]) => void) => void;
    scrollRef: React.RefObject<HTMLDivElement>;
    setAnimatedMessageId: React.Dispatch<React.SetStateAction<number | null>>;
    setHighLightedMessageId: React.Dispatch<React.SetStateAction<number | null | undefined>>;
    messageInputRef: React.RefObject<HTMLInputElement>;
    deleteMessage(message: CoreMessageType): Promise<void>;
    updateMessage: UpdateMessageType;
    resendMessage(failedMessage: SendableMessageType): void;
    sendMessage: SendMessageType;
    sendFileMessage: (file: File, quoteMessage?: SendableMessageType) => Promise<FileMessage>;
    sendVoiceMessage: (file: File, duration: number, quoteMessage?: SendableMessageType) => Promise<FileMessage>;
    sendMultipleFilesMessage: (files: Array<File>, quoteMessage?: SendableMessageType) => Promise<MultipleFilesMessage>;
    toggleReaction(message: SendableMessageType, emojiKey: string, isReacted: boolean): void;
    renderUserMentionItem?: (props: {
        user: User;
    }) => JSX.Element;
}
/**
 * @deprecated This provider is deprecated and will be removed in the next major update.
 * Please use the `GroupChannelProvider` from '@sendbird/uikit-react/GroupChannel' instead.
 * For more information, please refer to the migration guide:
 * https://docs.sendbird.com/docs/chat/uikit/v3/react/introduction/group-channel-migration-guide
 */
declare const ChannelProvider: (props: ChannelContextProps) => React.JSX.Element;
declare const useChannelContext: () => ChannelProviderInterface;
export { ChannelProvider, useChannelContext, };
// ===== modules/Channel/context/const.d.ts =====
export * from '../../GroupChannel/context/const';
export declare const PREV_RESULT_SIZE = 30;
export declare const NEXT_RESULT_SIZE = 15;
// ===== modules/Channel/context/dux/actionTypes.d.ts =====
import type { EmojiContainer } from '@sendbird/chat';
import type { GroupChannel, Member } from '@sendbird/chat/groupChannel';
import type { ReactionEvent } from '@sendbird/chat/message';
import type { MessageListParams } from '../ChannelProvider';
import type { CoreMessageType, SendableMessageType } from '../../../../utils';
import type { FileUploadedPayload } from '../hooks/useSendMultipleFilesMessage';
import { CreateAction } from '../../../../utils/typeHelpers/reducers/createAction';
export declare const RESET_MESSAGES = "RESET_MESSAGES";
export declare const FETCH_INITIAL_MESSAGES_START = "FETCH_INITIAL_MESSAGES_START";
export declare const FETCH_INITIAL_MESSAGES_SUCCESS = "FETCH_INITIAL_MESSAGES_SUCCESS";
export declare const FETCH_INITIAL_MESSAGES_FAILURE = "FETCH_INITIAL_MESSAGES_FAILURE";
export declare const FETCH_PREV_MESSAGES_SUCCESS = "FETCH_PREV_MESSAGES_SUCCESS";
export declare const FETCH_PREV_MESSAGES_FAILURE = "FETCH_PREV_MESSAGES_FAILURE";
export declare const FETCH_NEXT_MESSAGES_SUCCESS = "FETCH_NEXT_MESSAGES_SUCCESS";
export declare const FETCH_NEXT_MESSAGES_FAILURE = "FETCH_NEXT_MESSAGES_FAILURE";
export declare const SEND_MESSAGE_START = "SEND_MESSAGE_START";
export declare const SEND_MESSAGE_SUCCESS = "SEND_MESSAGE_SUCCESS";
export declare const SEND_MESSAGE_FAILURE = "SEND_MESSAGE_FAILURE";
export declare const RESEND_MESSAGE_START = "RESEND_MESSAGE_START";
export declare const ON_MESSAGE_RECEIVED = "ON_MESSAGE_RECEIVED";
export declare const ON_MESSAGE_UPDATED = "ON_MESSAGE_UPDATED";
export declare const ON_MESSAGE_THREAD_INFO_UPDATED = "ON_MESSAGE_THREAD_INFO_UPDATED";
export declare const ON_MESSAGE_DELETED = "ON_MESSAGE_DELETED";
export declare const ON_MESSAGE_DELETED_BY_REQ_ID = "ON_MESSAGE_DELETED_BY_REQ_ID";
export declare const SET_CURRENT_CHANNEL = "SET_CURRENT_CHANNEL";
export declare const SET_CHANNEL_INVALID = "SET_CHANNEL_INVALID";
export declare const MARK_AS_READ = "MARK_AS_READ";
export declare const MARK_AS_UNREAD = "MARK_AS_UNREAD";
export declare const ON_REACTION_UPDATED = "ON_REACTION_UPDATED";
export declare const SET_EMOJI_CONTAINER = "SET_EMOJI_CONTAINER";
export declare const MESSAGE_LIST_PARAMS_CHANGED = "MESSAGE_LIST_PARAMS_CHANGED";
export declare const ON_FILE_INFO_UPLOADED = "ON_FILE_INFO_UPLOADED";
export declare const ON_TYPING_STATUS_UPDATED = "ON_TYPING_STATUS_UPDATED";
type CHANNEL_PAYLOAD_TYPES = {
    [RESET_MESSAGES]: null;
    [FETCH_INITIAL_MESSAGES_START]: null;
    [FETCH_INITIAL_MESSAGES_SUCCESS]: {
        currentGroupChannel: null | GroupChannel;
        messages: CoreMessageType[];
    };
    [FETCH_PREV_MESSAGES_SUCCESS]: {
        currentGroupChannel: null | GroupChannel;
        messages: CoreMessageType[];
    };
    [FETCH_NEXT_MESSAGES_SUCCESS]: {
        currentGroupChannel: null | GroupChannel;
        messages: CoreMessageType[];
    };
    [FETCH_INITIAL_MESSAGES_FAILURE]: {
        currentGroupChannel: null | GroupChannel;
    };
    [FETCH_PREV_MESSAGES_FAILURE]: {
        currentGroupChannel: null | GroupChannel;
    };
    [FETCH_NEXT_MESSAGES_FAILURE]: {
        currentGroupChannel: null | GroupChannel;
    };
    [SEND_MESSAGE_START]: SendableMessageType;
    [SEND_MESSAGE_SUCCESS]: SendableMessageType;
    [SEND_MESSAGE_FAILURE]: SendableMessageType;
    [SET_CURRENT_CHANNEL]: null | GroupChannel;
    [SET_CHANNEL_INVALID]: null;
    [ON_MESSAGE_RECEIVED]: {
        channel: GroupChannel;
        message: SendableMessageType;
    };
    [ON_MESSAGE_UPDATED]: {
        channel: GroupChannel;
        message: SendableMessageType;
    };
    [ON_MESSAGE_THREAD_INFO_UPDATED]: {
        channel: GroupChannel;
        event: any;
    };
    [RESEND_MESSAGE_START]: SendableMessageType;
    [MARK_AS_READ]: {
        channel: null | GroupChannel;
        userIds?: null | string[];
    };
    [MARK_AS_UNREAD]: {
        channel: null | GroupChannel;
        userIds?: null | string[];
    };
    [ON_MESSAGE_DELETED]: MessageId;
    [ON_MESSAGE_DELETED_BY_REQ_ID]: RequestId;
    [SET_EMOJI_CONTAINER]: EmojiContainer;
    [ON_REACTION_UPDATED]: ReactionEvent;
    [MESSAGE_LIST_PARAMS_CHANGED]: MessageListParams;
    [ON_FILE_INFO_UPLOADED]: FileUploadedPayload;
    [ON_TYPING_STATUS_UPDATED]: {
        channel: GroupChannel;
        typingMembers: Member[];
    };
};
type MessageId = number;
type RequestId = string;
export type ChannelActionTypes = CreateAction<CHANNEL_PAYLOAD_TYPES>;
export {};
// ===== modules/Channel/context/hooks/useHandleUploadFiles.d.ts =====
import { Logger } from '../../../../lib/Sendbird/types';
import { SendMFMFunctionType } from './useSendMultipleFilesMessage';
import { SendableMessageType } from '../../../../utils';
import { SendFileMessageFunctionType } from '../../../Thread/context/hooks/useSendFileMessage';
import { FileMessage, MultipleFilesMessage } from '@sendbird/chat/message';
/**
 * The handleUploadFiles is a function sending a FileMessage and MultipleFilesMessage
 * by the received FileList from the ChangeEvent of MessageInput component.
 */
interface useHandleUploadFilesDynamicProps {
    sendFileMessage: SendFileMessageFunctionType;
    sendMultipleFilesMessage: SendMFMFunctionType;
    quoteMessage?: SendableMessageType;
    acceptableMimeTypes?: string[];
}
interface useHandleUploadFilesStaticProps {
    logger: Logger;
}
export declare const useHandleUploadFiles: ({ sendFileMessage, sendMultipleFilesMessage, quoteMessage, acceptableMimeTypes, }: useHandleUploadFilesDynamicProps, { logger, }: useHandleUploadFilesStaticProps) => (files: File[]) => Promise<void | FileMessage | MultipleFilesMessage>;
export {};
// ===== modules/Channel/context/hooks/useInitialMessagesFetch.d.ts =====
import React from 'react';
import { MessageListParams as MessageListParamsInternal } from '../ChannelProvider';
import { ReplyType as ReplyTypeInternal } from '../../../../types';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { LoggerInterface } from '../../../../lib/Logger';
import { ChannelActionTypes } from '../dux/actionTypes';
type UseInitialMessagesFetchOptions = {
    currentGroupChannel: GroupChannel | null;
    initialTimeStamp: number | null | undefined;
    userFilledMessageListQuery?: MessageListParamsInternal;
    replyType: ReplyTypeInternal;
    setIsScrolled: (val: boolean) => void;
};
type UseInitialMessagesFetchParams = {
    logger: LoggerInterface;
    messagesDispatcher: React.Dispatch<ChannelActionTypes>;
    scrollRef: React.RefObject<HTMLElement>;
};
declare function useInitialMessagesFetch({ currentGroupChannel, initialTimeStamp, userFilledMessageListQuery, replyType, setIsScrolled, }: UseInitialMessagesFetchOptions, { logger, scrollRef, messagesDispatcher }: UseInitialMessagesFetchParams): () => void;
export default useInitialMessagesFetch;
// ===== modules/Channel/context/hooks/useSendMultipleFilesMessage.d.ts =====
/// <reference types="react" />
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import type { MultipleFilesMessageCreateParams, UploadableFileInfo } from '@sendbird/chat/message';
import { MultipleFilesMessage } from '@sendbird/chat/message';
import type { Logger } from '../../../../lib/Sendbird/types';
import type { Nullable } from '../../../../types';
import { SendableMessageType } from '../../../../utils';
import { PublishingModuleType } from '../../../internalInterfaces';
export type OnBeforeSendMFMType = (files: Array<File>, quoteMessage?: SendableMessageType) => MultipleFilesMessageCreateParams;
export interface UseSendMFMDynamicParams {
    currentChannel: Nullable<GroupChannel>;
    onBeforeSendMultipleFilesMessage?: OnBeforeSendMFMType;
    publishingModules: PublishingModuleType[];
}
export interface UseSendMFMStaticParams {
    logger: Logger;
    pubSub: any;
    scrollRef?: React.RefObject<HTMLDivElement>;
}
export interface FileUploadedPayload {
    channelUrl: string;
    requestId: string;
    index: number;
    uploadableFileInfo: UploadableFileInfo;
    error: Error;
}
export type SendMFMFunctionType = (files: Array<File>, quoteMessage?: SendableMessageType) => Promise<MultipleFilesMessage>;
/**
 * pubSub is used instead of messagesDispatcher to avoid redundantly calling
 * because this useSendMultipleFilesMessage is used in the Channel and Thread both
 */
export declare const useSendMultipleFilesMessage: ({ currentChannel, onBeforeSendMultipleFilesMessage, publishingModules, }: UseSendMFMDynamicParams, { logger, pubSub, scrollRef, }: UseSendMFMStaticParams) => Array<SendMFMFunctionType>;
// ===== modules/Channel/index.d.ts =====
import React from 'react';
import { ChannelContextProps } from './context/ChannelProvider';
import { ChannelUIProps } from './components/ChannelUI';
export interface ChannelProps extends ChannelContextProps, ChannelUIProps {
}
/**
 * @deprecated This component is deprecated and will be removed in the next major update.
 * Please use the `GroupChannel` component from '@sendbird/uikit-react/GroupChannel' instead.
 * For more information, please refer to the migration guide:
 * https://docs.sendbird.com/docs/chat/uikit/v3/react/introduction/group-channel-migration-guide
 */
declare const Channel: (props: ChannelProps) => React.JSX.Element;
export default Channel;
// ===== modules/ChannelList/components/AddChannel/index.d.ts =====
import React from 'react';
export declare const AddChannel: () => React.JSX.Element;
export default AddChannel;
// ===== modules/ChannelList/components/ChannelListHeader/index.d.ts =====
import ChannelListHeader from '../../../GroupChannelList/components/GroupChannelListHeader';
export default ChannelListHeader;
// ===== modules/ChannelList/components/ChannelListUI/index.d.ts =====
import React from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import { GroupChannelListItemBasicProps } from '../../../GroupChannelList/components/GroupChannelListItem/GroupChannelListItemView';
interface ChannelPreviewProps extends Omit<GroupChannelListItemBasicProps, 'onLeaveChannel'> {
    onLeaveChannel(channel?: GroupChannel, onLeaveChannelCb?: (channel: GroupChannel, error?: unknown) => void): Promise<void>;
}
export interface ChannelListUIProps {
    renderChannelPreview?: (props: ChannelPreviewProps) => React.ReactElement;
    renderHeader?: (props: void) => React.ReactElement;
    renderPlaceHolderError?: (props: void) => React.ReactElement;
    renderPlaceHolderLoading?: (props: void) => React.ReactElement;
    renderPlaceHolderEmptyList?: (props: void) => React.ReactElement;
}
/**
 * @deprecated This component is deprecated and will be removed in the next major update.
 * Please use the `GroupChannel` component from '@sendbird/uikit-react/GroupChannel' instead.
 * For more information, please refer to the migration guide:
 * https://docs.sendbird.com/docs/chat/uikit/v3/react/introduction/group-channel-migration-guide
 */
declare const ChannelListUI: React.FC<ChannelListUIProps>;
export default ChannelListUI;
// ===== modules/ChannelList/components/ChannelPreview/index.d.ts =====
import React from 'react';
import { GroupChannelListItemBasicProps } from '../../../GroupChannelList/components/GroupChannelListItem/GroupChannelListItemView';
interface ChannelPreviewInterface extends GroupChannelListItemBasicProps {
    /** @deprecated Please use `isSelected` instead */
    isActive?: boolean;
}
/**
 * @deprecated This component is deprecated and will be removed in the next major update.
 * Please use the `GroupChannel` component from '@sendbird/uikit-react/GroupChannel' instead.
 * For more information, please refer to the migration guide:
 * https://docs.sendbird.com/docs/chat/uikit/v3/react/introduction/group-channel-migration-guide
 */
declare const ChannelPreview: ({ channel, isActive, isSelected, isTyping, renderChannelAction, onLeaveChannel, onClick, tabIndex, }: ChannelPreviewInterface) => React.JSX.Element;
export default ChannelPreview;
// ===== modules/ChannelList/components/ChannelPreviewAction.d.ts =====
import GroupChannelPreviewAction from '../../GroupChannelList/components/GroupChannelPreviewAction';
export default GroupChannelPreviewAction;
// ===== modules/ChannelList/context/ChannelListProvider.d.ts =====
import React from 'react';
import type { User } from '@sendbird/chat';
import { GroupChannel, GroupChannelCreateParams, GroupChannelListOrder, GroupChannelListQuery as GroupChannelListQuerySb, GroupChannelUserIdsFilter, HiddenChannelFilter, MyMemberStateFilter, PublicChannelFilter, QueryType, SuperChannelFilter, UnreadChannelFilter } from '@sendbird/chat/groupChannel';
import { ChannelListActionTypes } from '../dux/actionTypes';
import { UserProfileProviderProps } from '../../../lib/UserProfileContext';
import { CHANNEL_TYPE } from '../../CreateChannel/types';
export interface ApplicationUserListQueryInternal {
    limit?: number;
    userIdsFilter?: Array<string>;
    metaDataKeyFilter?: string;
    metaDataValuesFilter?: Array<string>;
}
export interface GroupChannelListQueryParamsInternal {
    limit?: number;
    includeEmpty?: boolean;
    order?: GroupChannelListOrder;
    userIdsExactFilter?: Array<string>;
    userIdsIncludeFilter?: Array<string>;
    userIdsIncludeFilterQueryType?: QueryType;
    nicknameContainsFilter?: string | null;
    channelNameContainsFilter?: string;
    customTypesFilter?: Array<string> | null;
    customTypeStartsWithFilter?: string | null;
    channelUrlsFilter?: Array<string> | null;
    superChannelFilter?: SuperChannelFilter;
    publicChannelFilter?: PublicChannelFilter;
    metadataOrderKeyFilter?: string | null;
    memberStateFilter?: MyMemberStateFilter;
    hiddenChannelFilter?: HiddenChannelFilter;
    unreadChannelFilter?: UnreadChannelFilter;
    includeFrozen?: boolean;
    userIdsFilter?: GroupChannelUserIdsFilter;
}
interface ChannelListQueries {
    applicationUserListQuery?: ApplicationUserListQueryInternal;
    channelListQuery?: GroupChannelListQueryParamsInternal;
}
type OverrideInviteUserType = {
    users: Array<string>;
    onClose: () => void;
    channelType: CHANNEL_TYPE;
};
export interface ChannelListProviderProps extends Pick<UserProfileProviderProps, 'disableUserProfile' | 'renderUserProfile'> {
    allowProfileEdit?: boolean;
    onBeforeCreateChannel?(users: Array<string>): GroupChannelCreateParams;
    overrideInviteUser?(params: OverrideInviteUserType): void;
    onThemeChange?(theme: string): void;
    onProfileEditSuccess?(user: User): void;
    onChannelSelect?(channel: GroupChannel | null): void;
    sortChannelList?: (channels: GroupChannel[]) => GroupChannel[];
    queries?: ChannelListQueries;
    children?: React.ReactElement;
    className?: string | string[];
    disableAutoSelect?: boolean;
    activeChannelUrl?: string;
    typingChannels?: Array<GroupChannel>;
    isTypingIndicatorEnabled?: boolean;
    isMessageReceiptStatusEnabled?: boolean;
    reconnectOnIdle?: boolean;
}
export interface ChannelListProviderInterface extends ChannelListProviderProps {
    initialized: boolean;
    loading: boolean;
    allChannels: GroupChannel[];
    currentChannel: GroupChannel | null;
    channelListQuery: GroupChannelListQueryParamsInternal | null;
    currentUserId: string;
    channelListDispatcher: React.Dispatch<ChannelListActionTypes>;
    channelSource: GroupChannelListQuerySb | null;
    fetchChannelList: () => void;
}
/**
 * @deprecated This provider is deprecated and will be removed in the next major update.
 * Please use the `GroupChannelListProvider` from '@sendbird/uikit-react/GroupChannelList' instead.
 * For more information, please refer to the migration guide:
 * https://docs.sendbird.com/docs/chat/uikit/v3/react/introduction/group-channel-migration-guide
 */
declare const ChannelListProvider: React.FC<ChannelListProviderProps>;
declare function useChannelListContext(): ChannelListProviderInterface;
export { ChannelListProvider, useChannelListContext };
// ===== modules/ChannelList/dux/actionTypes.d.ts =====
import type { GroupChannel, GroupChannelListQuery } from '@sendbird/chat/groupChannel';
import { CreateAction } from '../../../utils/typeHelpers/reducers/createAction';
export declare const RESET_CHANNEL_LIST = "RESET_CHANNEL_LIST";
export declare const CREATE_CHANNEL = "CREATE_CHANNEL";
export declare const UNLOAD_CHANNELS = "UNLOAD_CHANNELS";
export declare const SET_CHANNEL_LOADING = "SET_CHANNEL_LOADING";
export declare const LEAVE_CHANNEL_SUCCESS = "LEAVE_CHANNEL_SUCCESS";
export declare const SET_CURRENT_CHANNEL = "SET_CURRENT_CHANNEL";
export declare const FETCH_CHANNELS_START = "FETCH_CHANNELS_START";
export declare const FETCH_CHANNELS_SUCCESS = "FETCH_CHANNELS_SUCCESS";
export declare const FETCH_CHANNELS_FAILURE = "FETCH_CHANNELS_FAILURE";
export declare const INIT_CHANNELS_START = "INIT_CHANNELS_START";
export declare const INIT_CHANNELS_SUCCESS = "INIT_CHANNELS_SUCCESS";
export declare const REFRESH_CHANNELS_SUCCESS = "REFRESH_CHANNELS_SUCCESS";
export declare const INIT_CHANNELS_FAILURE = "INIT_CHANNELS_FAILURE";
export declare const INVITE_MEMBERS_SUCESS = "INVITE_MEMBERS_SUCESS";
export declare const ON_USER_JOINED = "ON_USER_JOINED";
export declare const ON_CHANNEL_DELETED = "ON_CHANNEL_DELETED";
export declare const ON_LAST_MESSAGE_UPDATED = "ON_LAST_MESSAGE_UPDATED";
export declare const ON_USER_LEFT = "ON_USER_LEFT";
export declare const ON_CHANNEL_CHANGED = "ON_CHANNEL_CHANGED";
export declare const ON_CHANNEL_ARCHIVED = "ON_CHANNEL_ARCHIVED";
export declare const ON_CHANNEL_FROZEN = "ON_CHANNEL_FROZEN";
export declare const ON_CHANNEL_UNFROZEN = "ON_CHANNEL_UNFROZEN";
export declare const ON_READ_RECEIPT_UPDATED = "ON_READ_RECEIPT_UPDATED";
export declare const ON_DELIVERY_RECEIPT_UPDATED = "ON_DELIVERY_RECEIPT_UPDATED";
export declare const CHANNEL_LIST_PARAMS_UPDATED = "CHANNEL_LIST_PARAMS_UPDATED";
type CHANNEL_LIST_PAYLOAD_TYPES = {
    [RESET_CHANNEL_LIST]: null;
    [CREATE_CHANNEL]: GroupChannel;
    [UNLOAD_CHANNELS]: null;
    [SET_CHANNEL_LOADING]: boolean;
    [LEAVE_CHANNEL_SUCCESS]: ChannelURL;
    [SET_CURRENT_CHANNEL]: GroupChannel | null;
    [FETCH_CHANNELS_START]: null;
    [FETCH_CHANNELS_SUCCESS]: GroupChannel[];
    [FETCH_CHANNELS_FAILURE]: null;
    [INIT_CHANNELS_START]: {
        currentUserId: string;
    };
    [INIT_CHANNELS_SUCCESS]: {
        channelList: GroupChannel[];
        disableAutoSelect: boolean;
    };
    [REFRESH_CHANNELS_SUCCESS]: {
        channelList: GroupChannel[];
        currentChannel: GroupChannel | null;
    };
    [INIT_CHANNELS_FAILURE]: null;
    [INVITE_MEMBERS_SUCESS]: null;
    [ON_USER_JOINED]: GroupChannel;
    [ON_CHANNEL_DELETED]: ChannelURL;
    [ON_LAST_MESSAGE_UPDATED]: GroupChannel;
    [ON_USER_LEFT]: {
        isMe: boolean;
        channel: GroupChannel;
    };
    [ON_CHANNEL_CHANGED]: GroupChannel;
    [ON_CHANNEL_ARCHIVED]: GroupChannel;
    [ON_CHANNEL_FROZEN]: GroupChannel;
    [ON_CHANNEL_UNFROZEN]: GroupChannel;
    [ON_READ_RECEIPT_UPDATED]: GroupChannel;
    [ON_DELIVERY_RECEIPT_UPDATED]: GroupChannel;
    [CHANNEL_LIST_PARAMS_UPDATED]: {
        channelListQuery: GroupChannelListQuery;
        currentUserId?: string;
    };
};
type ChannelURL = string;
export type ChannelListActionTypes = CreateAction<CHANNEL_LIST_PAYLOAD_TYPES>;
export {};
// ===== modules/ChannelList/index.d.ts =====
import React from 'react';
import { ChannelListProviderProps } from './context/ChannelListProvider';
import { ChannelListUIProps } from './components/ChannelListUI';
export interface ChannelListProps extends ChannelListProviderProps, ChannelListUIProps {
}
/**
 * @deprecated This component is deprecated and will be removed in the next major update.
 * Please use the `GroupChannelList` component from '@sendbird/uikit-react/GroupChannelList' instead.
 * For more information, please refer to the migration guide:
 * https://docs.sendbird.com/docs/chat/uikit/v3/react/introduction/group-channel-migration-guide
 */
declare const ChannelList: React.FC<ChannelListProps>;
export default ChannelList;
// ===== modules/ChannelSettings/components/ChannelProfile/index.d.ts =====
import './channel-profile.scss';
import React from 'react';
declare const ChannelProfile: React.FC;
export default ChannelProfile;
// ===== modules/ChannelSettings/components/ChannelSettingsUI/ChannelSettingsHeader.d.ts =====
import React, { MouseEvent } from 'react';
import { type HeaderCustomProps } from '../../../../ui/Header';
export interface ChannelSettingsHeaderProps extends HeaderCustomProps {
    onCloseClick?: (e: MouseEvent) => void;
}
export declare const ChannelSettingsHeader: ({ onCloseClick, renderLeft, renderMiddle, renderRight, }: ChannelSettingsHeaderProps) => React.JSX.Element;
export default ChannelSettingsHeader;
// ===== modules/ChannelSettings/components/ChannelSettingsUI/MenuItem.d.ts =====
import React, { ReactNode } from 'react';
interface Props {
    renderLeft: () => ReactNode;
    renderMiddle: () => ReactNode;
    renderRight?: (props: MenuItemActionProps) => ReactNode;
    renderAccordion?: () => ReactNode;
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
    accordionOpened?: boolean;
    setAccordionOpened?: (value: boolean) => void;
}
export declare const MenuItem: ({ renderLeft, renderMiddle, renderRight, renderAccordion, className, onClick, onKeyDown, accordionOpened, setAccordionOpened, }: Props) => React.JSX.Element;
export interface MenuItemActionProps {
    useAccordion: boolean;
    accordionOpened: boolean;
    children?: ReactNode;
}
export declare const MenuItemAction: ({ useAccordion, accordionOpened, children, }: MenuItemActionProps) => string | number | true | React.JSX.Element | Iterable<React.ReactNode>;
export default MenuItem;
// ===== modules/ChannelSettings/components/ChannelSettingsUI/MenuListByRole.d.ts =====
import '../ModerationPanel/admin-panel.scss';
import '../UserPanel/user-panel.scss';
import React from 'react';
import useMenuItems from './hooks/useMenuItems';
interface MenuListByRoleProps {
    menuItems: ReturnType<typeof useMenuItems>;
}
export declare const MenuListByRole: ({ menuItems, }: MenuListByRoleProps) => React.JSX.Element;
export default MenuListByRole;
// ===== modules/ChannelSettings/components/ChannelSettingsUI/hooks/useMenuItems.d.ts =====
import React from 'react';
import { IconProps } from '../../../../../ui/Icon';
import { type LabelProps } from '../../../../../ui/Label';
import { type MenuItemActionProps } from '../MenuItem';
type MenuItem = {
    icon: IconProps;
    label: LabelProps;
    rightComponent?: (props: MenuItemActionProps) => React.ReactNode;
    accordionComponent?: () => React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
    hideMenu?: boolean;
};
type MenuItemsByRole = {
    [key: string]: MenuItem;
};
type MenuItems = {
    operator: MenuItemsByRole;
    nonOperator: MenuItemsByRole;
};
export declare const useMenuItems: () => MenuItems;
export default useMenuItems;
// ===== modules/ChannelSettings/components/ChannelSettingsUI/index.d.ts =====
import './channel-settings-ui.scss';
import React, { ReactNode } from 'react';
import useMenuItems from './hooks/useMenuItems';
import { ChannelSettingsHeaderProps } from './ChannelSettingsHeader';
import { UserListItemProps } from '../../../../ui/UserListItem';
interface ModerationPanelProps {
    menuItems: ReturnType<typeof useMenuItems>;
}
export interface ChannelSettingsUIProps {
    renderHeader?: (props: ChannelSettingsHeaderProps) => React.ReactElement;
    renderChannelProfile?: () => React.ReactElement;
    renderModerationPanel?: (props: ModerationPanelProps) => React.ReactElement;
    renderLeaveChannel?: () => React.ReactElement;
    renderPlaceholderError?: () => React.ReactElement;
    renderPlaceholderLoading?: () => React.ReactElement;
    /**
     * @deprecated This prop is deprecated and will be removed in the next major update.
     * Please use the `renderUserListItem` prop of the `ChannelSettingsProvider` instead.
     */
    renderUserListItem?: (props: UserListItemProps) => ReactNode;
}
declare const ChannelSettingsUI: (props: ChannelSettingsUIProps) => React.JSX.Element;
export default ChannelSettingsUI;
/** NOTE: For exportation */
export { OperatorList } from '../ModerationPanel/OperatorList';
export { MemberList } from '../ModerationPanel/MemberList';
export { MutedMemberList } from '../ModerationPanel/MutedMemberList';
export { BannedUserList } from '../ModerationPanel/BannedUserList';
// ===== modules/ChannelSettings/components/EditDetailsModal/index.d.ts =====
import React from 'react';
export type EditDetailsProps = {
    onSubmit: () => void;
    onCancel: () => void;
};
declare const EditDetails: React.FC<EditDetailsProps>;
export default EditDetails;
// ===== modules/ChannelSettings/components/LeaveChannel/index.d.ts =====
import './leave-channel.scss';
import React from 'react';
export type LeaveChannelProps = {
    onSubmit: () => void;
    onCancel: () => void;
};
declare const LeaveChannel: React.FC<LeaveChannelProps>;
export default LeaveChannel;
// ===== modules/ChannelSettings/components/ModerationPanel/BannedUserList.d.ts =====
import { ReactElement, ReactNode } from 'react';
import type { BannedUserListQueryParams } from '@sendbird/chat';
import { UserListItemProps } from '../../../../ui/UserListItem';
interface BannedUserListProps {
    renderUserListItem?: (props: UserListItemProps) => ReactNode;
    bannedUserListQueryParams?: BannedUserListQueryParams;
}
export declare const BannedUserList: ({ renderUserListItem, bannedUserListQueryParams, }: BannedUserListProps) => ReactElement;
/** @deprecated Use the BannedUserList instead */
export declare const BannedMemberList: ({ renderUserListItem, bannedUserListQueryParams, }: BannedUserListProps) => ReactElement;
export default BannedUserList;
// ===== modules/ChannelSettings/components/ModerationPanel/MemberList.d.ts =====
import { ReactElement, ReactNode } from 'react';
import type { MemberListQueryParams } from '@sendbird/chat/groupChannel';
import { UserListItemProps } from '../../../../ui/UserListItem';
interface MemberListProps {
    renderUserListItem?: (props: UserListItemProps & {
        index: number;
    }) => ReactNode;
    memberListQueryParams?: MemberListQueryParams;
}
export declare const MemberList: ({ renderUserListItem, memberListQueryParams, }: MemberListProps) => ReactElement;
export default MemberList;
// ===== modules/ChannelSettings/components/ModerationPanel/MutedMemberList.d.ts =====
import { ReactElement, ReactNode } from 'react';
import type { MemberListQueryParams } from '@sendbird/chat/groupChannel';
import { UserListItemProps } from '../../../../ui/UserListItem';
interface MutedMemberListProps {
    renderUserListItem?: (props: UserListItemProps) => ReactNode;
    memberListQueryParams?: MemberListQueryParams;
}
export declare const MutedMemberList: ({ renderUserListItem, memberListQueryParams, }: MutedMemberListProps) => ReactElement;
export default MutedMemberList;
// ===== modules/ChannelSettings/components/ModerationPanel/OperatorList.d.ts =====
import { ReactElement, ReactNode } from 'react';
import type { OperatorListQueryParams } from '@sendbird/chat';
import { UserListItemProps } from '../../../../ui/UserListItem';
interface OperatorListProps {
    renderUserListItem?: (props: UserListItemProps) => ReactNode;
    operatorListQueryParams?: OperatorListQueryParams;
}
export declare const OperatorList: ({ renderUserListItem, operatorListQueryParams, }: OperatorListProps) => ReactElement;
export default OperatorList;
// ===== modules/ChannelSettings/components/ModerationPanel/index.d.ts =====
import './admin-panel.scss';
import { ReactElement } from 'react';
/**
 * @deprecated
 * `ModerationPanel` is deprecated.
 * Use `@sendbird/ChannelSettings/components/ChannelSettingMenuList` instead.
 */
export default function ModerationPanel(): ReactElement;
// ===== modules/ChannelSettings/components/UserListItem/index.d.ts =====
import { UserListItem as UIUserListItem } from '../../../../ui/UserListItem';
/**
 * @deprecated This modules has been deprecated, please import from '@sendbird/uikit-react/ui/UserListItem'
 */
export declare const UserListItem: typeof UIUserListItem;
export default UserListItem;
// ===== modules/ChannelSettings/components/UserPanel/index.d.ts =====
import './user-panel.scss';
import React from 'react';
declare const UserPanel: React.FC;
/**
 * @deprecated
 * `UserPanel` is deprecated.
 * Use `@sendbird/ChannelSettings/components/ChannelSettingMenuList` instead.
 */
export default UserPanel;
// ===== modules/ChannelSettings/context/ChannelSettingsProvider.d.ts =====
import React from 'react';
import type { ChannelSettingsContextProps, ChannelSettingsState } from './types';
export declare const ChannelSettingsContext: React.Context<import("../../../utils/storeManager").Store<ChannelSettingsState>>;
declare const ChannelSettingsProvider: (props: ChannelSettingsContextProps) => React.JSX.Element;
declare const useChannelSettingsContext: () => {
    setChannel: (channel: import("@sendbird/chat/groupChannel").GroupChannel) => void;
    setLoading: (loading: boolean) => void;
    setInvalid: (invalid: boolean) => void;
    channel: import("@sendbird/chat/groupChannel").GroupChannel;
    loading: boolean;
    invalidChannel: boolean;
    forceUpdateUI(): void;
    setChannelUpdateId(uniqId: string): void;
    channelUrl: string;
    onCloseClick?(): void;
    onLeaveChannel?(): void;
    overrideInviteUser?(params: {
        users: string[];
        onClose: () => void;
        channel: import("@sendbird/chat/groupChannel").GroupChannel;
    }): void;
    onChannelModified?(channel: import("@sendbird/chat/groupChannel").GroupChannel): void;
    onBeforeUpdateChannel?(currentTitle: string, currentImg: File, data: string): import("@sendbird/chat/groupChannel").GroupChannelUpdateParams;
    queries?: import("./types").ChannelSettingsQueries;
    renderUserListItem?: (props: import("../../../ui/UserListItem").UserListItemProps) => React.ReactNode;
};
export { ChannelSettingsProvider, useChannelSettingsContext };
// ===== modules/ChannelSettings/context/index.d.ts =====
export * from './ChannelSettingsProvider';
export * from './types';
export { useChannelSettings } from './useChannelSettings';
// ===== modules/ChannelSettings/context/types.d.ts =====
import type { ReactNode } from 'react';
import type { GroupChannel, GroupChannelUpdateParams } from '@sendbird/chat/groupChannel';
import type { UserListItemProps } from '../../../ui/UserListItem';
import type { UserProfileProviderProps } from '../../../lib/UserProfileContext';
interface ApplicationUserListQuery {
    limit?: number;
    userIdsFilter?: Array<string>;
    metaDataKeyFilter?: string;
    metaDataValuesFilter?: Array<string>;
}
export interface ChannelSettingsQueries {
    applicationUserListQuery?: ApplicationUserListQuery;
}
type OverrideInviteUserType = {
    users: Array<string>;
    onClose: () => void;
    channel: GroupChannel;
};
export interface CommonChannelSettingsProps {
    channelUrl: string;
    onCloseClick?(): void;
    onLeaveChannel?(): void;
    overrideInviteUser?(params: OverrideInviteUserType): void;
    onChannelModified?(channel: GroupChannel): void;
    onBeforeUpdateChannel?(currentTitle: string, currentImg: File | null, data: string | undefined): GroupChannelUpdateParams;
    queries?: ChannelSettingsQueries;
    renderUserListItem?: (props: UserListItemProps) => ReactNode;
}
export interface ChannelSettingsState extends CommonChannelSettingsProps {
    channel: GroupChannel | null;
    loading: boolean;
    invalidChannel: boolean;
    forceUpdateUI(): void;
    setChannelUpdateId(uniqId: string): void;
}
export interface ChannelSettingsContextProps extends CommonChannelSettingsProps, Pick<UserProfileProviderProps, 'renderUserProfile' | 'disableUserProfile'> {
    children?: ReactNode;
    className?: string;
}
export {};
// ===== modules/ChannelSettings/context/useChannelSettings.d.ts =====
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import { ChannelSettingsState } from './types';
export declare const useChannelSettings: () => {
    state: ChannelSettingsState;
    actions: {
        setChannel: (channel: GroupChannel) => void;
        setLoading: (loading: boolean) => void;
        setInvalid: (invalid: boolean) => void;
    };
};
export default useChannelSettings;
// ===== modules/ChannelSettings/index.d.ts =====
import React from 'react';
import { ChannelSettingsUIProps } from './components/ChannelSettingsUI';
import { ChannelSettingsContextProps } from './context/index';
interface ChannelSettingsProps extends ChannelSettingsContextProps, Omit<ChannelSettingsUIProps, 'renderUserListItem'> {
}
declare const ChannelSettings: React.FC<ChannelSettingsProps>;
export default ChannelSettings;
// ===== modules/CreateChannel/components/CreateChannelUI/index.d.ts =====
import './create-channel-ui.scss';
import React from 'react';
export interface CreateChannelUIProps {
    onCancel?(): void;
    renderStepOne?: (props: void) => React.ReactElement;
}
declare const CreateChannel: React.FC<CreateChannelUIProps>;
export default CreateChannel;
// ===== modules/CreateChannel/components/InviteUsers/index.d.ts =====
import React from 'react';
import './invite-users.scss';
import { UserListQuery } from '../../../../types';
export interface InviteUsersProps {
    onCancel?: () => void;
    userListQuery?(): UserListQuery;
}
declare const InviteUsers: React.FC<InviteUsersProps>;
export default InviteUsers;
// ===== modules/CreateChannel/components/SelectChannelType.d.ts =====
import React from 'react';
export interface SelectChannelTypeProps {
    onCancel?(): void;
}
declare const SelectChannelType: React.FC<SelectChannelTypeProps>;
export default SelectChannelType;
// ===== modules/CreateChannel/context/CreateChannelProvider.d.ts =====
import React from 'react';
import { User } from '@sendbird/chat';
import type { GroupChannel, GroupChannelCreateParams } from '@sendbird/chat/groupChannel';
import { CHANNEL_TYPE } from '../types';
import { SendbirdChatType } from '../../../lib/Sendbird/types';
declare const CreateChannelContext: React.Context<import("../../../utils/storeManager").Store<CreateChannelState>>;
export interface UserListQuery {
    hasNext?: boolean;
    next(): Promise<Array<User>>;
    get isLoading(): boolean;
}
type OverrideInviteUserType = {
    users: Array<string>;
    onClose: () => void;
    channelType: CHANNEL_TYPE;
};
export interface CreateChannelProviderProps {
    children?: React.ReactElement;
    userListQuery?(): UserListQuery;
    /**
     * Overrides the action of the channel creation button.
     * */
    onCreateChannelClick?(params: OverrideInviteUserType): void;
    /**
     * Called when the channel is created. (Should not have onCreateChannelClick for this to invoke.)
     * */
    onChannelCreated(channel: GroupChannel): void;
    /**
     * Called just before the channel is created. (Should not have onCreateChannelClick for this to invoke.)
     * */
    onBeforeCreateChannel?(users: Array<string>): GroupChannelCreateParams;
    /**
     * @deprecated
     * Use the onChannelCreated instead
     */
    onCreateChannel?(channel: GroupChannel): void;
    /**
     * @deprecated
     * Use the onCreateChannelClick instead
     */
    overrideInviteUser?(params: OverrideInviteUserType): void;
}
export interface CreateChannelState {
    sdk: SendbirdChatType;
    userListQuery?(): UserListQuery;
    /**
     * Overrides the action of the channel creation button.
     * */
    onCreateChannelClick?(params: OverrideInviteUserType): void;
    /**
     * Called when the channel is created. (Should not have onCreateChannelClick for this to invoke.)
     * */
    onChannelCreated?(channel: GroupChannel): void;
    /**
     * Called just before the channel is created. (Should not have onCreateChannelClick for this to invoke.)
     * */
    onBeforeCreateChannel?(users: Array<string>): GroupChannelCreateParams;
    pageStep: number;
    type: CHANNEL_TYPE;
    /**
     * @deprecated
     * Use the onChannelCreated instead
     */
    onCreateChannel?(channel: GroupChannel): void;
    /**
     * @deprecated
     * Use the onCreateChannelClick instead
     */
    overrideInviteUser?(params: OverrideInviteUserType): void;
}
declare const CreateChannelProvider: React.FC<CreateChannelProviderProps>;
declare const useCreateChannelContext: () => {
    setPageStep: (pageStep: number) => void;
    setType: (type: CHANNEL_TYPE) => void;
    createChannel: (params: GroupChannelCreateParams) => Promise<GroupChannel>;
    sdk: SendbirdChatType;
    userListQuery?(): UserListQuery;
    /**
     * Overrides the action of the channel creation button.
     * */
    onCreateChannelClick?(params: OverrideInviteUserType): void;
    /**
     * Called when the channel is created. (Should not have onCreateChannelClick for this to invoke.)
     * */
    onChannelCreated?(channel: GroupChannel): void;
    /**
     * Called just before the channel is created. (Should not have onCreateChannelClick for this to invoke.)
     * */
    onBeforeCreateChannel?(users: Array<string>): GroupChannelCreateParams;
    pageStep: number;
    type: CHANNEL_TYPE;
    /**
     * @deprecated
     * Use the onChannelCreated instead
     */
    onCreateChannel?(channel: GroupChannel): void;
    /**
     * @deprecated
     * Use the onCreateChannelClick instead
     */
    overrideInviteUser?(params: OverrideInviteUserType): void;
};
export { CreateChannelProvider, CreateChannelContext, useCreateChannelContext, };
// ===== modules/CreateChannel/context/index.d.ts =====
export * from './CreateChannelProvider';
export { default as useCreateChannel } from './useCreateChannel';
// ===== modules/CreateChannel/context/useCreateChannel.d.ts =====
import { CreateChannelState } from './CreateChannelProvider';
import { CHANNEL_TYPE } from '../types';
declare const useCreateChannel: () => {
    state: CreateChannelState;
    actions: {
        setPageStep: (pageStep: number) => void;
        setType: (type: CHANNEL_TYPE) => void;
        createChannel: (params: import("@sendbird/chat/groupChannel").GroupChannelCreateParams) => Promise<import("@sendbird/chat/groupChannel").GroupChannel>;
    };
};
export default useCreateChannel;
// ===== modules/CreateChannel/index.d.ts =====
import React from 'react';
import { CreateChannelUIProps } from './components/CreateChannelUI';
import { CreateChannelProviderProps } from './context/CreateChannelProvider';
export interface CreateChannelProps extends CreateChannelProviderProps, CreateChannelUIProps {
}
declare const CreateChannel: React.FC<CreateChannelProps>;
export default CreateChannel;
// ===== modules/CreateChannel/types.d.ts =====
export declare enum CHANNEL_TYPE {
    GROUP = "group",
    SUPERGROUP = "supergroup",
    BROADCAST = "broadcast"
}
// ===== modules/CreateOpenChannel/components/CreateOpenChannelUI/index.d.ts =====
import React from 'react';
import './index.scss';
export interface CreateOpenChannelUIProps {
    closeModal?: () => void;
    renderHeader?: () => React.ReactElement;
    renderProfileInput?: () => React.ReactElement;
}
declare function CreateOpenChannelUI({ closeModal, renderHeader, renderProfileInput, }: CreateOpenChannelUIProps): React.ReactElement;
export default CreateOpenChannelUI;
// ===== modules/CreateOpenChannel/context/CreateOpenChannelProvider.d.ts =====
import React from 'react';
import { OpenChannel, OpenChannelCreateParams } from '@sendbird/chat/openChannel';
import { SdkStore, Logger } from '../../../lib/Sendbird/types';
export interface CreateNewOpenChannelCallbackProps {
    name: string;
    coverUrlOrImage?: string;
}
export interface CreateOpenChannelContextInterface extends CreateOpenChannelProviderProps {
    sdk: SdkStore['sdk'];
    sdkInitialized: boolean;
    logger: Logger;
    createNewOpenChannel: (props: CreateNewOpenChannelCallbackProps) => void;
}
export interface CreateOpenChannelProviderProps {
    className?: string;
    children?: React.ReactElement;
    onCreateChannel?: (channel: OpenChannel) => void;
    onBeforeCreateChannel?: (params: OpenChannelCreateParams) => OpenChannelCreateParams;
}
export declare const CreateOpenChannelProvider: React.FC<CreateOpenChannelProviderProps>;
export declare const useCreateOpenChannelContext: () => CreateOpenChannelContextInterface;
// ===== modules/CreateOpenChannel/index.d.ts =====
import React from 'react';
import { CreateOpenChannelUIProps } from './components/CreateOpenChannelUI';
import { CreateOpenChannelProviderProps } from './context/CreateOpenChannelProvider';
export interface CreateOpenChannelProps extends CreateOpenChannelProviderProps, CreateOpenChannelUIProps {
}
declare function CreateOpenChannel({ className, onCreateChannel, onBeforeCreateChannel, closeModal, renderHeader, renderProfileInput, }: CreateOpenChannelProps): React.ReactElement;
export default CreateOpenChannel;
// ===== modules/EditUserProfile/components/EditUserProfileUI/EditUserProfileUIView.d.ts =====
import React, { type MutableRefObject, type Dispatch } from 'react';
export interface EditUserProfileUIViewProps {
    formRef: MutableRefObject<any>;
    inputRef: MutableRefObject<any>;
    setProfileImage: Dispatch<File | null>;
    onThemeChange?: (theme: string) => void;
}
export declare const EditUserProfileUIView: ({ formRef, inputRef, onThemeChange, setProfileImage, }: EditUserProfileUIViewProps) => React.JSX.Element;
// ===== modules/EditUserProfile/components/EditUserProfileUI/index.d.ts =====
import React from 'react';
import { User } from '@sendbird/chat';
import './edit-user-profile.scss';
import { EditUserProfileUIView } from './EditUserProfileUIView';
export interface UseEditUserProfileUIStateParams {
    onEditProfile?: (user: User) => void;
}
export declare const useEditUserProfileUISates: ({ onEditProfile, }: UseEditUserProfileUIStateParams) => {
    formRef: React.MutableRefObject<any>;
    inputRef: React.MutableRefObject<any>;
    updateUserInfo: () => void;
    profileImage: File;
    setProfileImage: React.Dispatch<React.SetStateAction<File>>;
};
export declare const EditUserProfileUI: () => React.JSX.Element;
export { EditUserProfileUIView };
export default EditUserProfileUI;
// ===== modules/EditUserProfile/context/EditUserProfileProvider.d.ts =====
import type { User } from '@sendbird/chat';
import React from 'react';
export interface EditUserProfileProps {
    children?: React.ReactElement;
    onCancel?(): void;
    onThemeChange?(theme: string): void;
    onEditProfile?(updatedUser: User): void;
}
export interface EditUserProfileProviderInterface {
    onCancel?(): void;
    onThemeChange?(theme: string): void;
    onEditProfile?(updatedUser: User): void;
}
declare const EditUserProfileProvider: ({ children, ...props }: EditUserProfileProps) => React.JSX.Element;
declare const useEditUserProfileContext: () => EditUserProfileProviderInterface;
export { EditUserProfileProvider, useEditUserProfileContext, };
// ===== modules/EditUserProfile/index.d.ts =====
import React from 'react';
import { EditUserProfileProps } from './context/EditUserProfileProvider';
declare const EditUserProfile: React.FC<EditUserProfileProps>;
export default EditUserProfile;
// ===== modules/GroupChannel/components/FileViewer/index.d.ts =====
import React from 'react';
import type { FileMessage } from '@sendbird/chat/message';
export interface FileViewerProps {
    onCancel: () => void;
    message: FileMessage;
}
export declare const FileViewer: (props: FileViewerProps) => React.JSX.Element;
export default FileViewer;
// ===== modules/GroupChannel/components/FrozenNotification/index.d.ts =====
import './index.scss';
import React from 'react';
export interface FrozenNotificationProps {
    className?: string;
}
export declare const FrozenNotification: ({ className, }: FrozenNotificationProps) => React.ReactElement;
export default FrozenNotification;
// ===== modules/GroupChannel/components/GroupChannelHeader/index.d.ts =====
import React from 'react';
import type { HeaderCustomProps } from '../../../../ui/Header';
export interface GroupChannelHeaderProps extends HeaderCustomProps {
    className?: string;
}
export declare const GroupChannelHeader: (props: GroupChannelHeaderProps) => React.JSX.Element;
export default GroupChannelHeader;
// ===== modules/GroupChannel/components/GroupChannelUI/GroupChannelUIView.d.ts =====
import './index.scss';
import React from 'react';
import type { RenderCustomSeparatorProps, RenderMessageParamsType } from '../../../../types';
import type { GroupChannelHeaderProps } from '../GroupChannelHeader';
import type { GroupChannelMessageListProps } from '../MessageList';
import type { MessageContentProps } from '../../../../ui/MessageContent';
import { SuggestedRepliesProps } from '../SuggestedReplies';
import { TypingIndicatorBubbleProps } from '../../../../ui/TypingIndicatorBubble';
export interface GroupChannelUIBasicProps {
    /**
     * A function that customizes the rendering of a loading placeholder component.
     */
    renderPlaceholderLoader?: () => React.ReactElement;
    /**
     * A function that customizes the rendering of a invalid placeholder component.
     */
    renderPlaceholderInvalid?: () => React.ReactElement;
    /**
     * A function that customizes the rendering of an empty placeholder component when there are no messages in the channel.
     */
    renderPlaceholderEmpty?: () => React.ReactElement;
    /**
     * A function that customizes the rendering of a header component.
     */
    renderChannelHeader?: (props: GroupChannelHeaderProps) => React.ReactElement;
    /**
     * A function that customizes the rendering of a message list component.
     */
    renderMessageList?: (props: GroupChannelMessageListProps) => React.ReactElement;
    /**
     * A function that customizes the rendering of a message input component.
     */
    renderMessageInput?: () => React.ReactElement;
    /**
     * A function that customizes the rendering of each message component in the message list component.
     */
    renderMessage?: (props: RenderMessageParamsType) => React.ReactElement;
    /**
     * A function that customizes the rendering of the content portion of each message component.
     */
    renderMessageContent?: (props: MessageContentProps) => React.ReactElement;
    /**
     * A function that customizes the rendering of the suggested replies of each message component.
     */
    renderSuggestedReplies?: (props: SuggestedRepliesProps) => React.ReactElement;
    /**
     * A function that customizes the rendering of a separator component between messages.
     */
    renderCustomSeparator?: (props: RenderCustomSeparatorProps) => React.ReactElement;
    /**
     * A function that customizes the rendering of a frozen notification component when the channel is frozen.
     */
    renderFrozenNotification?: () => React.ReactElement;
    /**
     * A function that customizes the rendering of the file upload icon in the message input component.
     */
    renderFileUploadIcon?: () => React.ReactElement;
    /**
     * A function that customizes the rendering of the voice message icon in the message input component.
     */
    renderVoiceMessageIcon?: () => React.ReactElement;
    /**
     * A function that customizes the rendering of the send message icon in the message input component.
     */
    renderSendMessageIcon?: () => React.ReactElement;
    /**
     * A function that customizes the rendering of the typing indicator component.
     */
    renderTypingIndicator?: () => React.ReactElement;
    /**
     * A function that customizes the rendering of the typing indicator bubble component.
     */
    renderTypingIndicatorBubble?: (props: TypingIndicatorBubbleProps) => React.ReactElement;
}
export interface GroupChannelUIViewProps extends GroupChannelUIBasicProps {
    isLoading?: boolean;
    isInvalid: boolean;
    channelUrl: string;
    renderChannelHeader: GroupChannelUIBasicProps['renderChannelHeader'];
    renderMessageList: GroupChannelUIBasicProps['renderMessageList'];
    renderMessageInput: GroupChannelUIBasicProps['renderMessageInput'];
}
export declare const GroupChannelUIView: (props: GroupChannelUIViewProps) => React.JSX.Element;
// ===== modules/GroupChannel/components/GroupChannelUI/index.d.ts =====
import React from 'react';
import { GroupChannelUIBasicProps } from './GroupChannelUIView';
export interface GroupChannelUIProps extends GroupChannelUIBasicProps {
}
export declare const GroupChannelUI: (props: GroupChannelUIProps) => React.JSX.Element;
export default GroupChannelUI;
// ===== modules/GroupChannel/components/Message/MessageView.d.ts =====
import type { EveryMessage, RenderCustomSeparatorProps, RenderMessageParamsType, ReplyType } from '../../../../types';
import React from 'react';
import { type EmojiCategory, EmojiContainer, User } from '@sendbird/chat';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import type { FileMessage, UserMessageCreateParams, UserMessageUpdateParams } from '@sendbird/chat/message';
import { ThreadReplySelectType } from '../../context/const';
import { CoreMessageType, SendableMessageType } from '../../../../utils';
import { MessageContentProps } from '../../../../ui/MessageContent';
import { SuggestedRepliesProps } from '../SuggestedReplies';
import type { OnBeforeDownloadFileMessageType } from '../../context/types';
export interface MessageProps {
    message: EveryMessage;
    hasSeparator?: boolean;
    hasNewMessageSeparator?: boolean;
    chainTop?: boolean;
    chainBottom?: boolean;
    handleScroll?: (isBottomMessageAffected?: boolean) => void;
    /**
     * Customizes all child components of the message.
     * */
    children?: React.ReactNode;
    /**
     * A function that customizes the rendering of the content portion of message component.
     */
    renderMessageContent?: (props: MessageContentProps) => React.ReactElement;
    /**
     * A function that customizes the rendering of suggested replies component of messages.
     */
    renderSuggestedReplies?: (props: SuggestedRepliesProps) => React.ReactElement;
    /**
     * A function that customizes the rendering of a separator between messages.
     */
    renderCustomSeparator?: (props: RenderCustomSeparatorProps) => React.ReactElement;
    /**
     * A function that customizes the rendering of the edit input portion of the message component.
     * */
    renderEditInput?: () => React.ReactElement;
    /**
     * A function that is called when the new message separator visibility changes.
     */
    onNewMessageSeparatorVisibilityChange?: (isVisible: boolean) => void;
    /**
     * A function that forces scroll to message when new message is received.
     */
    scrollMessageOverflowToTop?: (ref: React.MutableRefObject<any>, message: CoreMessageType) => void;
    /**
     * @deprecated Please use `children` instead
     * @description Customizes all child components of the message.
     * */
    renderMessage?: (props: RenderMessageParamsType) => React.ReactElement;
}
export interface MessageViewProps extends MessageProps {
    channel: GroupChannel;
    emojiContainer: EmojiContainer;
    editInputDisabled: boolean;
    shouldRenderSuggestedReplies: boolean;
    isReactionEnabled?: boolean;
    replyType: ReplyType;
    threadReplySelectType: ThreadReplySelectType;
    nicknamesMap: Map<string, string>;
    renderUserMentionItem?: (props: {
        user: User;
    }) => React.ReactElement;
    filterEmojiCategoryIds?: (message: SendableMessageType) => EmojiCategory['id'][];
    scrollToMessage: (createdAt: number, messageId: number) => void;
    toggleReaction: (message: SendableMessageType, emojiKey: string, isReacted: boolean) => void;
    setQuoteMessage: React.Dispatch<React.SetStateAction<SendableMessageType | null>>;
    onQuoteMessageClick?: (params: {
        message: SendableMessageType;
    }) => void;
    onReplyInThreadClick?: (params: {
        message: SendableMessageType;
    }) => void;
    sendUserMessage: (params: UserMessageCreateParams) => void;
    updateUserMessage: (messageId: number, params: UserMessageUpdateParams) => void;
    resendMessage: (failedMessage: SendableMessageType) => void;
    deleteMessage: (message: CoreMessageType) => Promise<void>;
    markAsUnread?: (message: SendableMessageType) => void;
    renderFileViewer: (props: {
        message: FileMessage;
        onCancel: () => void;
    }) => React.ReactElement;
    renderRemoveMessageModal?: (props: {
        message: EveryMessage;
        onCancel: () => void;
    }) => React.ReactElement;
    /**
     * You can't use this prop in the Channel component (legacy).
     * Accepting this prop only for the GroupChannel.
     */
    onBeforeDownloadFileMessage?: OnBeforeDownloadFileMessageType;
    animatedMessageId: number | null;
    setAnimatedMessageId: React.Dispatch<React.SetStateAction<number | null>>;
    newMessageIds?: number[] | null;
    setNewMessageIds?: (ids: number[]) => void;
    onMessageAnimated?: () => void;
    /** @deprecated * */
    highLightedMessageId?: number | null;
    /** @deprecated * */
    setHighLightedMessageId?: React.Dispatch<React.SetStateAction<number | null>>;
    /** @deprecated * */
    onMessageHighlighted?: () => void;
    usedInLegacy?: boolean;
}
declare const MessageView: (props: MessageViewProps) => React.JSX.Element;
export default MessageView;
// ===== modules/GroupChannel/components/Message/index.d.ts =====
import React from 'react';
import { MessageProps } from './MessageView';
export declare const Message: (props: MessageProps) => React.ReactElement;
export default Message;
// ===== modules/GroupChannel/components/MessageInputWrapper/VoiceMessageInputWrapper.d.ts =====
import './voice-message-wrapper.scss';
import React from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
export type VoiceMessageInputWrapperProps = {
    channel?: GroupChannel;
    onCancelClick?: () => void;
    onSubmitClick?: (file: File, duration: number) => void;
};
export declare const VoiceMessageInputWrapper: ({ channel, onCancelClick, onSubmitClick, }: VoiceMessageInputWrapperProps) => React.ReactElement;
export default VoiceMessageInputWrapper;
// ===== modules/GroupChannel/components/MessageInputWrapper/index.d.ts =====
import React from 'react';
import { GroupChannelUIBasicProps } from '../GroupChannelUI/GroupChannelUIView';
export interface MessageInputWrapperProps {
    value?: string;
    disabled?: boolean;
    acceptableMimeTypes?: string[];
    renderFileUploadIcon?: GroupChannelUIBasicProps['renderFileUploadIcon'];
    renderVoiceMessageIcon?: GroupChannelUIBasicProps['renderVoiceMessageIcon'];
    renderSendMessageIcon?: GroupChannelUIBasicProps['renderSendMessageIcon'];
}
export declare const MessageInputWrapper: (props: MessageInputWrapperProps) => React.JSX.Element;
export { VoiceMessageInputWrapper, type VoiceMessageInputWrapperProps } from './VoiceMessageInputWrapper';
export default MessageInputWrapper;
// ===== modules/GroupChannel/components/MessageList/getMessagePartsInfo.d.ts =====
/// <reference types="react" />
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { CoreMessageType } from '../../../../utils';
import { StringSet } from '../../../../ui/Label/stringSet';
export interface GetMessagePartsInfoProps {
    allMessages: Array<CoreMessageType>;
    stringSet: StringSet;
    isMessageGroupingEnabled?: boolean;
    currentIndex: number;
    currentMessage: CoreMessageType;
    currentChannel?: GroupChannel | null;
    replyType?: string;
    hasPrevious?: boolean;
    firstUnreadMessageId?: number | string | undefined;
    isUnreadMessageExistInChannel?: React.MutableRefObject<boolean>;
}
interface OutPuts {
    chainTop: boolean;
    chainBottom: boolean;
    hasSeparator: boolean;
    hasNewMessageSeparator: boolean;
}
/**
 * exported, should be backward compatible
 */
export declare const getMessagePartsInfo: ({ allMessages, stringSet, isMessageGroupingEnabled, currentIndex, currentMessage, currentChannel, replyType, firstUnreadMessageId, isUnreadMessageExistInChannel, }: GetMessagePartsInfoProps) => OutPuts;
export {};
// ===== modules/GroupChannel/components/MessageList/index.d.ts =====
import './index.scss';
import React from 'react';
import { GroupChannelUIBasicProps } from '../GroupChannelUI/GroupChannelUIView';
export interface GroupChannelMessageListProps {
    className?: string;
    /**
     * A function that customizes the rendering of each message component in the message list component.
     */
    renderMessage?: GroupChannelUIBasicProps['renderMessage'];
    /**
     * A function that customizes the rendering of the content portion of each message component.
     */
    renderMessageContent?: GroupChannelUIBasicProps['renderMessageContent'];
    /**
     * A function that customizes the rendering of a separator component between messages.
     */
    renderCustomSeparator?: GroupChannelUIBasicProps['renderCustomSeparator'];
    /**
     * A function that customizes the rendering of a loading placeholder component.
     */
    renderPlaceholderLoader?: GroupChannelUIBasicProps['renderPlaceholderLoader'];
    /**
     * A function that customizes the rendering of an empty placeholder component when there are no messages in the channel.
     */
    renderPlaceholderEmpty?: GroupChannelUIBasicProps['renderPlaceholderEmpty'];
    /**
     * A function that customizes the rendering of a frozen notification component when the channel is frozen.
     */
    renderFrozenNotification?: GroupChannelUIBasicProps['renderFrozenNotification'];
    /**
     * A function that customizes the rendering of a suggested replies component.
     */
    renderSuggestedReplies?: GroupChannelUIBasicProps['renderSuggestedReplies'];
    /**
     * A function that customizes the rendering of a Typing Indicator Bubble component.
     */
    renderTypingIndicatorBubble?: GroupChannelUIBasicProps['renderTypingIndicatorBubble'];
}
export declare const MessageList: (props: GroupChannelMessageListProps) => React.JSX.Element;
export default MessageList;
// ===== modules/GroupChannel/components/RemoveMessageModal/RemoveMessageModalView.d.ts =====
import React from 'react';
import { EveryMessage } from '../../../../types';
import { SendableMessageType } from '../../../../utils';
export interface RemoveMessageModalProps {
    onSubmit?: () => void;
    onCancel: () => void;
    message: EveryMessage;
}
export interface RemoveMessageModalViewProps extends RemoveMessageModalProps {
    deleteMessage: (message: SendableMessageType) => Promise<void>;
}
export declare const RemoveMessageModalView: (props: RemoveMessageModalViewProps) => React.JSX.Element;
export default RemoveMessageModalView;
// ===== modules/GroupChannel/components/RemoveMessageModal/index.d.ts =====
import React from 'react';
import { RemoveMessageModalProps } from './RemoveMessageModalView';
export declare const RemoveMessageModal: (props: RemoveMessageModalProps) => React.JSX.Element;
export default RemoveMessageModal;
// ===== modules/GroupChannel/components/SuggestedMentionList/SuggestedMentionListView.d.ts =====
import './index.scss';
import React from 'react';
import type { User } from '@sendbird/chat';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
export interface SuggestedMentionListViewProps {
    className?: string;
    currentChannel: GroupChannel;
    targetNickname: string;
    memberListQuery?: Record<string, string>;
    onUserItemClick?: (member: User) => void;
    onFocusItemChange?: (member: User) => void;
    onFetchUsers?: (users: Array<User>) => void;
    renderUserMentionItem?: (props: {
        user: User;
    }) => JSX.Element;
    ableAddMention: boolean;
    maxMentionCount?: number;
    maxSuggestionCount?: number;
    inputEvent?: React.KeyboardEvent<HTMLDivElement>;
}
export declare const SuggestedMentionListView: (props: SuggestedMentionListViewProps) => React.JSX.Element;
export default SuggestedMentionListView;
// ===== modules/GroupChannel/components/SuggestedMentionList/index.d.ts =====
import React from 'react';
import type { SuggestedMentionListViewProps } from './SuggestedMentionListView';
export type SuggestedMentionListProps = SuggestedMentionListViewProps;
export declare const SuggestedMentionList: (props: SuggestedMentionListProps) => React.JSX.Element;
export default SuggestedMentionList;
// ===== modules/GroupChannel/components/SuggestedReplies/index.d.ts =====
import './index.scss';
import React from 'react';
export interface SuggestedRepliesProps {
    replyOptions: string[];
    onSendMessage: ({ message }: {
        message: string;
    }) => void;
    type?: 'vertical' | 'horizontal';
    gap?: number;
}
export interface ReplyItemProps {
    value: string;
    onClickReply: (event: React.MouseEvent<HTMLDivElement>, option: string) => void;
    type?: 'vertical' | 'horizontal';
}
export declare const ReplyItem: ({ value, onClickReply, type, }: ReplyItemProps) => React.JSX.Element;
declare const SuggestedReplies: ({ replyOptions, onSendMessage, type }: SuggestedRepliesProps) => React.JSX.Element;
export default SuggestedReplies;
// ===== modules/GroupChannel/components/TypingIndicator.d.ts =====
import React from 'react';
import type { Member } from '@sendbird/chat/groupChannel';
export interface TypingIndicatorTextProps {
    members: Member[];
}
export declare const TypingIndicatorText: ({ members }: TypingIndicatorTextProps) => React.JSX.Element;
export interface TypingIndicatorProps {
    channelUrl: string;
}
export declare const TypingIndicator: ({ channelUrl }: TypingIndicatorProps) => React.JSX.Element;
export default TypingIndicator;
// ===== modules/GroupChannel/components/UnreadCount/index.d.ts =====
import './index.scss';
import React from 'react';
export interface UnreadCountProps {
    className?: string;
    count: number | undefined;
    onClick(): void;
    lastReadAt?: Date | null;
    /** @deprecated Please use `lastReadAt` instead * */
    time?: string;
}
export declare const UnreadCount: React.FC<UnreadCountProps>;
export default UnreadCount;
// ===== modules/GroupChannel/context/GroupChannelProvider.d.ts =====
import React from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import { ThreadReplySelectType } from './const';
import type { GroupChannelProviderProps, MessageListQueryParamsType, GroupChannelState } from './types';
export declare const GroupChannelContext: React.Context<import("../../../utils/storeManager").Store<GroupChannelState>>;
export declare const InternalGroupChannelProvider: (props: GroupChannelProviderProps) => React.JSX.Element;
declare const GroupChannelManager: React.FC<React.PropsWithChildren<GroupChannelProviderProps>>;
declare const GroupChannelProvider: React.FC<GroupChannelProviderProps>;
declare const useGroupChannelContext: () => {
    setCurrentChannel: (channel: GroupChannel) => void;
    handleChannelError: (error: import("@sendbird/chat").SendbirdError) => void;
    markAsReadAll: (channel: GroupChannel) => void;
    markAsUnread: (message: import("../../../utils").SendableMessageType, source?: "manual" | "internal") => void;
    setReadStateChanged: (state: string) => void;
    setFirstUnreadMessageId: (messageId: string | number) => void;
    sendUserMessage: (params: import("@sendbird/chat/message").UserMessageCreateParams) => Promise<import("@sendbird/chat/message").UserMessage>;
    sendFileMessage: (params: import("@sendbird/chat/message").FileMessageCreateParams) => Promise<import("@sendbird/chat/message").FileMessage>;
    sendMultipleFilesMessage: (params: import("@sendbird/chat/message").MultipleFilesMessageCreateParams) => Promise<import("@sendbird/chat/message").MultipleFilesMessage>;
    updateUserMessage: (messageId: number, params: import("@sendbird/chat/message").UserMessageUpdateParams) => Promise<import("@sendbird/chat/message").UserMessage>;
    setNewMessageIds: (ids: number[]) => void;
    setQuoteMessage: (message: import("../../../utils").SendableMessageType) => void;
    setAnimatedMessageId: (messageId: number) => void;
    setIsScrollBottomReached: (isReached: boolean) => void;
    scrollToBottom: (animated?: boolean) => Promise<void>;
    scrollToMessage: (createdAt: number, messageId: number, messageFocusAnimated?: boolean, scrollAnimated?: boolean) => Promise<void>;
    toggleReaction: (message: import("../../../utils").SendableMessageType, emojiKey: string, isReacted: boolean) => void;
    sendVoiceMessage: (params: import("@sendbird/chat/message").FileMessageCreateParams, duration: number) => Promise<import("@sendbird/chat/message").FileMessage>;
    initialized: boolean;
    loading: boolean;
    refreshing: boolean;
    messages: import("@sendbird/chat/message").BaseMessage[];
    newMessages: import("@sendbird/chat/message").BaseMessage[];
    resetNewMessages: () => void;
    refresh: () => Promise<void>;
    loadPrevious: () => Promise<void>;
    hasPrevious: () => boolean;
    loadNext: () => Promise<void>;
    hasNext: () => boolean;
    sendFileMessages: (paramsList: import("@sendbird/chat/message").FileMessageCreateParams[], onPending?: (message: import("@sendbird/chat/message").FileMessage) => void) => Promise<import("@sendbird/chat/message").FileMessage[]>;
    updateFileMessage: (messageId: number, params: import("@sendbird/chat/message").FileMessageUpdateParams) => Promise<import("@sendbird/chat/message").FileMessage>;
    resendMessage: <T extends import("@sendbird/chat/message").UserMessage | import("@sendbird/chat/message").FileMessage | import("@sendbird/chat/message").MultipleFilesMessage>(failedMessage: T) => Promise<T>;
    deleteMessage: <T_1 extends import("@sendbird/chat/message").UserMessage | import("@sendbird/chat/message").FileMessage | import("@sendbird/chat/message").MultipleFilesMessage>(message: T_1) => Promise<void>;
    resetWithStartingPoint: (startingPoint: number) => Promise<void>;
    _dangerous_reducer_updateMessages: (messages: import("@sendbird/chat/message").BaseMessage[], clearBeforeAction: boolean, currentUserId?: string, strictStreamingOrder?: boolean) => void;
    _dangerous_reducer_deleteMessages: (messageIds: number[], reqIds: string[]) => void;
    channelUrl: string;
    isReactionEnabled?: boolean;
    isMessageGroupingEnabled?: boolean;
    isMultipleFilesMessageEnabled?: boolean;
    autoscrollMessageOverflowToTop?: boolean;
    showSearchIcon?: boolean;
    replyType?: import("../../../types").ReplyType;
    threadReplySelectType?: ThreadReplySelectType;
    disableMarkAsRead?: boolean;
    scrollBehavior?: "auto" | "smooth";
    forceLeftToRightMessageLayout?: boolean;
    startingPoint?: number;
    animatedMessageId?: number;
    onMessageAnimated?: () => void;
    messageListQueryParams?: MessageListQueryParamsType;
    filterEmojiCategoryIds?: (message: import("../../../utils").SendableMessageType) => number[];
    onBeforeSendUserMessage?: import("./types").OnBeforeHandler<import("@sendbird/chat/message").UserMessageCreateParams>;
    onBeforeSendFileMessage?: import("./types").OnBeforeHandler<import("@sendbird/chat/message").FileMessageCreateParams>;
    onBeforeSendVoiceMessage?: import("./types").OnBeforeHandler<import("@sendbird/chat/message").FileMessageCreateParams>;
    onBeforeSendMultipleFilesMessage?: import("./types").OnBeforeHandler<import("@sendbird/chat/message").MultipleFilesMessageCreateParams>;
    onBeforeUpdateUserMessage?: import("./types").OnBeforeHandler<import("@sendbird/chat/message").UserMessageUpdateParams>;
    onBeforeDownloadFileMessage?: import("./types").OnBeforeDownloadFileMessageType;
    onBackClick?(): void;
    onChatHeaderActionClick?(event: React.MouseEvent<HTMLElement, MouseEvent>): void;
    onReplyInThreadClick?: (props: {
        message: import("../../../utils").SendableMessageType;
    }) => void;
    onSearchClick?(): void;
    onQuoteMessageClick?: (props: {
        message: import("../../../utils").SendableMessageType;
    }) => void;
    renderUserMentionItem?: (props: {
        user: import("@sendbird/chat").User;
    }) => JSX.Element;
    renderUserProfile?: ((props: import("../../../types").RenderUserProfileProps) => React.ReactElement<any, string | React.JSXElementConstructor<any>>) & ((props: import("../../../types").RenderUserProfileProps) => React.ReactElement<any, string | React.JSXElementConstructor<any>>);
    onStartDirectMessage?: (channel: GroupChannel) => void;
    onUserProfileMessage?: (channel: GroupChannel) => void;
    disableUserProfile?: boolean;
    children?: React.ReactNode;
    currentChannel: GroupChannel;
    fetchChannelError: import("@sendbird/chat").SendbirdError;
    nicknamesMap: Map<string, string>;
    quoteMessage: import("../../../utils").SendableMessageType;
    isScrollBottomReached: boolean;
    readState: string;
    newMessageIds: number[];
    scrollRef: React.RefObject<HTMLDivElement>;
    scrollDistanceFromBottomRef: React.MutableRefObject<number>;
    scrollPositionRef: React.MutableRefObject<number>;
    messageInputRef: React.RefObject<HTMLDivElement>;
    markAsUnreadSourceRef: React.MutableRefObject<"manual" | "internal">;
    scrollPubSub: import("../../../lib/pubSub").PubSubTypes<import("./hooks/useMessageListScroll").ScrollTopics, import("./hooks/useMessageListScroll").ScrollTopicUnion>;
};
export { GroupChannelProvider, useGroupChannelContext, GroupChannelManager, };
// ===== modules/GroupChannel/context/const.d.ts =====
export declare const MAX_USER_MENTION_COUNT = 10;
export declare const MAX_USER_SUGGESTION_COUNT = 15;
export declare const USER_MENTION_TEMP_CHAR = "@";
export declare const UIKIT_COMPATIBLE_FORM_VERSION = 1;
export declare enum ThreadReplySelectType {
    PARENT = "PARENT",
    THREAD = "THREAD"
}
// ===== modules/GroupChannel/context/hooks/useGroupChannel.d.ts =====
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import type { SendbirdError } from '@sendbird/chat';
import type { FileMessage, FileMessageCreateParams, MultipleFilesMessage, MultipleFilesMessageCreateParams, UserMessage, UserMessageCreateParams, UserMessageUpdateParams } from '@sendbird/chat/message';
import { SendableMessageType } from '../../../../utils';
import type { GroupChannelState, MessageActions } from '../types';
export interface GroupChannelActions extends MessageActions {
    setCurrentChannel: (channel: GroupChannel) => void;
    handleChannelError: (error: SendbirdError) => void;
    markAsReadAll: (channel: GroupChannel) => void;
    markAsUnread: (message: SendableMessageType, source?: 'manual' | 'internal') => void;
    setReadStateChanged: (state: string) => void;
    setFirstUnreadMessageId: (messageId: number | string | null) => void;
    sendUserMessage: (params: UserMessageCreateParams) => Promise<UserMessage>;
    sendFileMessage: (params: FileMessageCreateParams) => Promise<FileMessage>;
    sendMultipleFilesMessage: (params: MultipleFilesMessageCreateParams) => Promise<MultipleFilesMessage>;
    updateUserMessage: (messageId: number, params: UserMessageUpdateParams) => Promise<UserMessage>;
    setNewMessageIds: (ids: number[]) => void;
    setQuoteMessage: (message: SendableMessageType | null) => void;
    setAnimatedMessageId: (messageId: number | null) => void;
    setIsScrollBottomReached: (isReached: boolean) => void;
    scrollToBottom: (animated?: boolean) => Promise<void>;
    scrollToMessage: (createdAt: number, messageId: number, messageFocusAnimated?: boolean, scrollAnimated?: boolean) => Promise<void>;
    toggleReaction: (message: SendableMessageType, emojiKey: string, isReacted: boolean) => void;
}
export declare const useGroupChannel: () => {
    state: GroupChannelState;
    actions: GroupChannelActions;
};
// ===== modules/GroupChannel/context/hooks/useMessageActions.d.ts =====
import { useGroupChannelMessages } from '@sendbird/uikit-tools';
import type { FileMessage, FileMessageCreateParams, MultipleFilesMessage, MultipleFilesMessageCreateParams, UserMessage, UserMessageCreateParams, UserMessageUpdateParams } from '@sendbird/chat/message';
import type { GroupChannelState } from '../types';
import { GroupChannel } from '@sendbird/chat/groupChannel';
type MessageListDataSource = ReturnType<typeof useGroupChannelMessages>;
type MessageActions = {
    sendUserMessage: (params: UserMessageCreateParams) => Promise<UserMessage>;
    sendFileMessage: (params: FileMessageCreateParams) => Promise<FileMessage>;
    sendVoiceMessage: (params: FileMessageCreateParams, duration: number) => Promise<FileMessage>;
    sendMultipleFilesMessage: (params: MultipleFilesMessageCreateParams) => Promise<MultipleFilesMessage>;
    updateUserMessage: (messageId: number, params: UserMessageUpdateParams) => Promise<UserMessage>;
} & Partial<MessageListDataSource>;
interface Params extends GroupChannelState {
    scrollToBottom(animated?: boolean): Promise<void>;
    currentChannel: GroupChannel;
}
/**
 * @description This hook controls common processes related to message sending, updating.
 * */
export declare function useMessageActions(params: Params): MessageActions;
export {};
// ===== modules/GroupChannel/context/hooks/useMessageListScroll.d.ts =====
import { DependencyList } from 'react';
/**
 * You can pass the resolve function to scrollPubSub, if you want to catch when the scroll is finished.
 * */
type PromiseResolver = () => void;
export type ScrollTopics = 'scrollToBottom' | 'scroll';
export type ScrollTopicUnion = {
    topic: 'scrollToBottom';
    payload: {
        animated?: boolean;
        resolve?: PromiseResolver;
    };
} | {
    topic: 'scroll';
    payload: {
        top?: number;
        animated?: boolean;
        lazy?: boolean;
        resolve?: PromiseResolver;
    };
};
export declare function useMessageListScroll(behavior: 'smooth' | 'auto', deps?: DependencyList): {
    scrollRef: import("react").MutableRefObject<HTMLDivElement>;
    scrollPubSub: import("../../../../lib/pubSub").PubSubTypes<ScrollTopics, ScrollTopicUnion>;
    scrollDistanceFromBottomRef: import("react").MutableRefObject<number>;
    scrollPositionRef: import("react").MutableRefObject<number>;
};
export {};
// ===== modules/GroupChannel/context/index.d.ts =====
export * from './GroupChannelProvider';
export * from './types';
export { useGroupChannel } from './hooks/useGroupChannel';
// ===== modules/GroupChannel/context/types.d.ts =====
import type { EmojiCategory, SendbirdError, User } from '@sendbird/chat';
import { type FileMessage, FileMessageCreateParams, type MultipleFilesMessage, MultipleFilesMessageCreateParams, UserMessageCreateParams, UserMessageUpdateParams } from '@sendbird/chat/message';
import type { GroupChannel, MessageCollectionParams, MessageFilterParams } from '@sendbird/chat/groupChannel';
import type { PubSubTypes } from '../../../lib/pubSub';
import type { ScrollTopics, ScrollTopicUnion } from './hooks/useMessageListScroll';
import type { SendableMessageType } from '../../../utils';
import type { UserProfileProviderProps } from '../../../lib/UserProfileContext';
import { ReplyType } from '../../../types';
import { useMessageActions } from './hooks/useMessageActions';
import { useGroupChannelMessages } from '@sendbird/uikit-tools';
import { ThreadReplySelectType } from './const';
import { PropsWithChildren } from 'react';
type MessageDataSource = ReturnType<typeof useGroupChannelMessages>;
export type MessageActions = ReturnType<typeof useMessageActions>;
export type MessageListQueryParamsType = Omit<MessageCollectionParams, 'filter'> & MessageFilterParams;
export type OnBeforeHandler<T> = (params: T) => T | Promise<T> | void | Promise<void>;
export type OnBeforeDownloadFileMessageType = (params: {
    message: FileMessage | MultipleFilesMessage;
    index?: number;
}) => Promise<boolean>;
export interface GroupChannelState extends GroupChannelProviderProps, Omit<InternalGroupChannelState, keyof GroupChannelProviderProps> {
}
interface InternalGroupChannelState extends MessageDataSource {
    currentChannel: GroupChannel | null;
    channelUrl: string;
    fetchChannelError: SendbirdError | null;
    nicknamesMap: Map<string, string>;
    quoteMessage: SendableMessageType | null;
    animatedMessageId: number | null;
    isScrollBottomReached: boolean;
    readState: string | null;
    newMessageIds: number[] | null;
    scrollRef: React.RefObject<HTMLDivElement>;
    scrollDistanceFromBottomRef: React.MutableRefObject<number>;
    scrollPositionRef: React.MutableRefObject<number>;
    messageInputRef: React.RefObject<HTMLDivElement>;
    isReactionEnabled: boolean;
    isMessageGroupingEnabled: boolean;
    isMultipleFilesMessageEnabled: boolean;
    autoscrollMessageOverflowToTop: boolean;
    showSearchIcon: boolean;
    replyType: ReplyType;
    threadReplySelectType: ThreadReplySelectType;
    disableMarkAsRead: boolean;
    scrollBehavior: 'smooth' | 'auto';
    markAsUnread?: (message: SendableMessageType) => void;
    markAsUnreadSourceRef: React.MutableRefObject<'manual' | 'internal' | null>;
    scrollPubSub: PubSubTypes<ScrollTopics, ScrollTopicUnion>;
}
export interface GroupChannelProviderProps extends PropsWithChildren<Pick<UserProfileProviderProps, 'renderUserProfile' | 'disableUserProfile' | 'onUserProfileMessage' | 'onStartDirectMessage'>> {
    channelUrl: string;
    isReactionEnabled?: boolean;
    isMessageGroupingEnabled?: boolean;
    isMultipleFilesMessageEnabled?: boolean;
    autoscrollMessageOverflowToTop?: boolean;
    showSearchIcon?: boolean;
    replyType?: ReplyType;
    threadReplySelectType?: ThreadReplySelectType;
    disableMarkAsRead?: boolean;
    scrollBehavior?: 'smooth' | 'auto';
    forceLeftToRightMessageLayout?: boolean;
    startingPoint?: number;
    animatedMessageId?: number | null;
    onMessageAnimated?: () => void;
    messageListQueryParams?: MessageListQueryParamsType;
    filterEmojiCategoryIds?: (message: SendableMessageType) => EmojiCategory['id'][];
    onBeforeSendUserMessage?: OnBeforeHandler<UserMessageCreateParams>;
    onBeforeSendFileMessage?: OnBeforeHandler<FileMessageCreateParams>;
    onBeforeSendVoiceMessage?: OnBeforeHandler<FileMessageCreateParams>;
    onBeforeSendMultipleFilesMessage?: OnBeforeHandler<MultipleFilesMessageCreateParams>;
    onBeforeUpdateUserMessage?: OnBeforeHandler<UserMessageUpdateParams>;
    onBeforeDownloadFileMessage?: OnBeforeDownloadFileMessageType;
    onBackClick?(): void;
    onChatHeaderActionClick?(event: React.MouseEvent<HTMLElement>): void;
    onReplyInThreadClick?: (props: {
        message: SendableMessageType;
    }) => void;
    onSearchClick?(): void;
    onQuoteMessageClick?: (props: {
        message: SendableMessageType;
    }) => void;
    renderUserMentionItem?: (props: {
        user: User;
    }) => JSX.Element;
}
export {};
// ===== modules/GroupChannel/index.d.ts =====
import React from 'react';
import { type GroupChannelProviderProps } from './context/types';
import { GroupChannelUIProps } from './components/GroupChannelUI';
export interface GroupChannelProps extends GroupChannelProviderProps, GroupChannelUIProps {
}
export declare const GroupChannel: (props: GroupChannelProps) => React.JSX.Element;
export default GroupChannel;
// ===== modules/GroupChannelList/components/AddGroupChannel/index.d.ts =====
import React from 'react';
export declare const AddGroupChannel: () => React.JSX.Element;
export default AddGroupChannel;
// ===== modules/GroupChannelList/components/GroupChannelListHeader/index.d.ts =====
import React from 'react';
import './index.scss';
import { HeaderCustomProps } from '../../../../ui/Header';
export interface GroupChannelListHeaderProps extends HeaderCustomProps {
    /** @deprecated Use the props `renderMiddle` instead */
    renderTitle?: () => React.ReactElement;
    renderIconButton?: (props: void) => React.ReactElement;
    onEdit?: (props: void) => void;
    allowProfileEdit?: boolean;
}
export declare const GroupChannelListHeader: ({ renderTitle, renderIconButton, onEdit, allowProfileEdit, renderLeft, renderMiddle, renderRight, }: GroupChannelListHeaderProps) => React.JSX.Element;
export default GroupChannelListHeader;
// ===== modules/GroupChannelList/components/GroupChannelListItem/GroupChannelListItemView.d.ts =====
import './index.scss';
import React from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import { GroupChannelPreviewActionProps } from '../GroupChannelPreviewAction';
export interface GroupChannelListItemBasicProps {
    tabIndex: number;
    channel: GroupChannel;
    onClick: () => void;
    renderChannelAction: (props: GroupChannelPreviewActionProps) => React.ReactElement;
    isSelected?: boolean;
    isTyping?: boolean;
    onLeaveChannel?: () => Promise<void>;
}
export interface GroupChannelListItemViewProps extends GroupChannelListItemBasicProps {
    channelName: string;
    isMessageStatusEnabled?: boolean;
}
export declare const GroupChannelListItemView: ({ channel, tabIndex, isTyping, isSelected, channelName, isMessageStatusEnabled, onClick, onLeaveChannel, renderChannelAction, }: GroupChannelListItemViewProps) => React.JSX.Element;
// ===== modules/GroupChannelList/components/GroupChannelListItem/index.d.ts =====
import React from 'react';
import { GroupChannelListItemBasicProps } from './GroupChannelListItemView';
export interface GroupChannelListItemProps extends GroupChannelListItemBasicProps {
}
export declare const GroupChannelListItem: ({ channel, isSelected, isTyping, renderChannelAction, onLeaveChannel, onClick, tabIndex, }: GroupChannelListItemProps) => React.JSX.Element;
// ===== modules/GroupChannelList/components/GroupChannelListUI/index.d.ts =====
import './index.scss';
import React from 'react';
import { GroupChannelListItemBasicProps } from '../GroupChannelListItem/GroupChannelListItemView';
interface GroupChannelItemProps extends GroupChannelListItemBasicProps {
}
export interface GroupChannelListUIProps {
    renderChannelPreview?: (props: GroupChannelItemProps) => React.ReactElement;
    renderHeader?: (props: void) => React.ReactElement;
    renderPlaceHolderError?: (props: void) => React.ReactElement;
    renderPlaceHolderLoading?: (props: void) => React.ReactElement;
    renderPlaceHolderEmptyList?: (props: void) => React.ReactElement;
}
export declare const GroupChannelListUI: (props: GroupChannelListUIProps) => React.JSX.Element;
export default GroupChannelListUI;
// ===== modules/GroupChannelList/components/GroupChannelPreviewAction.d.ts =====
import React from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
export interface GroupChannelPreviewActionProps {
    channel?: GroupChannel;
    disabled?: boolean;
    onLeaveChannel?: () => Promise<void>;
}
export declare function GroupChannelPreviewAction({ channel, disabled, onLeaveChannel }: GroupChannelPreviewActionProps): React.JSX.Element;
export default GroupChannelPreviewAction;
// ===== modules/GroupChannelList/context/GroupChannelListProvider.d.ts =====
import React from 'react';
import type { User } from '@sendbird/chat';
import type { GroupChannel, GroupChannelCreateParams, GroupChannelFilterParams } from '@sendbird/chat/groupChannel';
import { GroupChannelCollectionParams } from '@sendbird/chat/groupChannel';
import { useGroupChannelList as useGroupChannelListDataSource } from '@sendbird/uikit-tools';
import type { CHANNEL_TYPE } from '../../CreateChannel/types';
import type { UserProfileProviderProps } from '../../../lib/UserProfileContext';
import { PartialRequired } from '../../../utils/typeHelpers/partialRequired';
type OnCreateChannelClickParams = {
    users: Array<string>;
    onClose: () => void;
    channelType: CHANNEL_TYPE;
};
type ChannelListDataSource = ReturnType<typeof useGroupChannelListDataSource>;
export type ChannelListQueryParamsType = Omit<GroupChannelCollectionParams, 'filter'> & GroupChannelFilterParams;
interface ContextBaseType {
    onChannelSelect(channel: GroupChannel | null): void;
    onChannelCreated(channel: GroupChannel): void;
    className: string | string[];
    selectedChannelUrl?: string;
    allowProfileEdit: boolean;
    disableAutoSelect: boolean;
    isTypingIndicatorEnabled: boolean;
    isMessageReceiptStatusEnabled: boolean;
    channelListQueryParams?: ChannelListQueryParamsType;
    onThemeChange?(theme: string): void;
    onCreateChannelClick?(params: OnCreateChannelClickParams): void;
    onBeforeCreateChannel?(users: string[]): GroupChannelCreateParams;
    onUserProfileUpdated?(user: User): void;
}
export interface GroupChannelListContextType extends ContextBaseType, ChannelListDataSource {
    typingChannelUrls: string[];
    scrollRef: React.RefObject<HTMLDivElement>;
}
export interface GroupChannelListProviderProps extends PartialRequired<ContextBaseType, 'onChannelSelect' | 'onChannelCreated'>, Pick<UserProfileProviderProps, 'onUserProfileMessage' | 'onStartDirectMessage' | 'renderUserProfile' | 'disableUserProfile'> {
    children?: React.ReactNode;
}
export declare const GroupChannelListContext: React.Context<import("../../../utils/storeManager").Store<GroupChannelListState>>;
export interface GroupChannelListState extends GroupChannelListContextType {
}
/**
 * @returns {ReturnType<typeof createStore<GroupChannelListState>>}
 */
export declare const useGroupChannelListStore: () => {
    state: GroupChannelListState;
    updateState: (updates: Partial<GroupChannelListState>) => void;
};
export declare const GroupChannelListManager: React.FC<GroupChannelListProviderProps>;
export declare const GroupChannelListProvider: (props: GroupChannelListProviderProps) => React.JSX.Element;
export declare const useGroupChannelListContext: () => {
    setGroupChannels: (channels: any) => void;
    typingChannelUrls: string[];
    scrollRef: React.RefObject<HTMLDivElement>;
    onChannelSelect(channel: GroupChannel | null): void;
    onChannelCreated(channel: GroupChannel): void;
    className: string | string[];
    selectedChannelUrl?: string;
    allowProfileEdit: boolean;
    disableAutoSelect: boolean;
    isTypingIndicatorEnabled: boolean;
    isMessageReceiptStatusEnabled: boolean;
    channelListQueryParams?: ChannelListQueryParamsType;
    onThemeChange?(theme: string): void;
    onCreateChannelClick?(params: OnCreateChannelClickParams): void;
    onBeforeCreateChannel?(users: string[]): GroupChannelCreateParams;
    onUserProfileUpdated?(user: User): void;
    initialized: boolean;
    groupChannels: GroupChannel[];
    refresh: () => Promise<void>;
    refreshing: boolean;
    loadMore: () => Promise<void>;
};
export {};
// ===== modules/GroupChannelList/context/index.d.ts =====
export * from './GroupChannelListProvider';
export { useGroupChannelList } from './useGroupChannelList';
// ===== modules/GroupChannelList/context/useGroupChannelList.d.ts =====
import { GroupChannelListState } from './GroupChannelListProvider';
export declare const useGroupChannelList: () => {
    state: GroupChannelListState;
    actions: {
        setGroupChannels: (channels: any) => void;
    };
};
export default useGroupChannelList;
// ===== modules/GroupChannelList/index.d.ts =====
import React from 'react';
import { GroupChannelListProviderProps } from './context/GroupChannelListProvider';
import { GroupChannelListUIProps } from './components/GroupChannelListUI';
export interface GroupChannelListProps extends GroupChannelListProviderProps, GroupChannelListUIProps {
}
export declare const GroupChannelList: (props: GroupChannelListProps) => React.JSX.Element;
export default GroupChannelList;
// ===== modules/Message/context/MessageProvider.d.ts =====
import React from 'react';
import { BaseMessage } from '@sendbird/chat/message';
export type MessageProviderProps = {
    children: React.ReactNode;
    message: BaseMessage;
    isByMe?: boolean;
};
export type MessageProviderInterface = Omit<MessageProviderProps, 'children'>;
declare const MessageProvider: React.FC<MessageProviderProps>;
declare const useMessageContext: () => MessageProviderInterface;
export { MessageProvider, useMessageContext, };
// ===== modules/Message/hooks/useDirtyGetMentions.d.ts =====
/// <reference types="react" />
import { Logger } from '../../../lib/Sendbird/types';
interface DynamicParams {
    ref: React.RefObject<HTMLElement>;
}
interface StaticParams {
    logger: Logger;
}
/**
 * exported, should be backwords compatible
 * This is a dirty way to get the mentions given DOM node
 */
export declare function useDirtyGetMentions({ ref, }: DynamicParams, { logger, }: StaticParams): Element[];
export {};
// ===== modules/MessageSearch/components/MessageSearchUI/index.d.ts =====
import React from 'react';
import './index.scss';
import { ClientSentMessages } from '../../../../types';
export interface MessageSearchUIProps {
    renderPlaceHolderError?: (props: void) => React.ReactElement;
    renderPlaceHolderLoading?: (props: void) => React.ReactElement;
    renderPlaceHolderNoString?: (props: void) => React.ReactElement;
    renderPlaceHolderEmptyList?: (props: void) => React.ReactElement;
    renderSearchItem?({ message, onResultClick, }: {
        message: ClientSentMessages;
        onResultClick?: (message: ClientSentMessages) => void;
    }): JSX.Element;
}
export declare const MessageSearchUI: React.FC<MessageSearchUIProps>;
export default MessageSearchUI;
// ===== modules/MessageSearch/context/MessageSearchProvider.d.ts =====
import React from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import { MessageSearchQuery } from '@sendbird/chat/message';
import { ClientSentMessages } from '../../../types';
import { SendbirdError } from '@sendbird/chat';
import type { MessageSearchQueryParams } from '@sendbird/chat/lib/__definition';
import useScrollCallback from './hooks/useScrollCallback';
import { CoreMessageType } from '../../../utils';
export interface MessageSearchProviderProps {
    channelUrl: string;
    children?: React.ReactElement;
    searchString?: string;
    messageSearchQuery?: MessageSearchQueryParams;
    onResultLoaded?(messages?: Array<CoreMessageType> | null, error?: SendbirdError | null): void;
    onResultClick?(message: ClientSentMessages): void;
}
export interface MessageSearchState extends MessageSearchProviderProps {
    channelUrl: string;
    allMessages: ClientSentMessages[];
    loading: boolean;
    isInvalid: boolean;
    initialized: boolean;
    currentChannel: GroupChannel | null;
    currentMessageSearchQuery: MessageSearchQuery | null;
    hasMoreResult: boolean;
    retryCount: number;
    selectedMessageId: number | null;
    requestString: string;
    onScroll?: ReturnType<typeof useScrollCallback>;
    handleOnScroll?: (e: React.BaseSyntheticEvent) => void;
    scrollRef?: React.RefObject<HTMLDivElement>;
}
export declare const MessageSearchContext: React.Context<import("../../../utils/storeManager").Store<MessageSearchState>>;
declare const MessageSearchManager: React.FC<MessageSearchProviderProps>;
declare const MessageSearchProvider: React.FC<MessageSearchProviderProps>;
declare const useMessageSearchContext: () => {
    setCurrentChannel: (channel: GroupChannel) => void;
    setChannelInvalid: () => void;
    getSearchedMessages: (messages: ClientSentMessages[], createdQuery: MessageSearchQuery) => void;
    setQueryInvalid: () => void;
    startMessageSearch: () => void;
    startGettingSearchedMessages: (query: MessageSearchQuery) => void;
    getNextSearchedMessages: (messages: ClientSentMessages[]) => void;
    resetSearchString: () => void;
    setSelectedMessageId: (messageId: number) => void;
    handleRetryToConnect: () => void;
    setRetryCount: () => void;
    channelUrl: string;
    allMessages: ClientSentMessages[];
    loading: boolean;
    isInvalid: boolean;
    initialized: boolean;
    currentChannel: GroupChannel | null;
    currentMessageSearchQuery: MessageSearchQuery | null;
    hasMoreResult: boolean;
    retryCount: number;
    selectedMessageId: number | null;
    requestString: string;
    onScroll?: ReturnType<typeof useScrollCallback>;
    handleOnScroll?: (e: React.BaseSyntheticEvent) => void;
    scrollRef?: React.RefObject<HTMLDivElement>;
    children?: React.ReactElement;
    searchString?: string;
    messageSearchQuery?: MessageSearchQueryParams;
    onResultLoaded?(messages?: Array<CoreMessageType> | null, error?: SendbirdError | null): void;
    onResultClick?(message: ClientSentMessages): void;
};
export { MessageSearchProvider, useMessageSearchContext, MessageSearchManager, };
// ===== modules/MessageSearch/context/hooks/useMessageSearch.d.ts =====
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import { MessageSearchQuery } from '@sendbird/chat/message';
import { ClientSentMessages } from '../../../../types';
import { type MessageSearchState } from '../MessageSearchProvider';
declare const useMessageSearch: () => {
    state: MessageSearchState;
    actions: {
        setCurrentChannel: (channel: GroupChannel) => void;
        setChannelInvalid: () => void;
        getSearchedMessages: (messages: ClientSentMessages[], createdQuery: MessageSearchQuery) => void;
        setQueryInvalid: () => void;
        startMessageSearch: () => void;
        startGettingSearchedMessages: (query: MessageSearchQuery) => void;
        getNextSearchedMessages: (messages: ClientSentMessages[]) => void;
        resetSearchString: () => void;
        setSelectedMessageId: (messageId: number) => void;
        handleRetryToConnect: () => void;
        setRetryCount: () => void;
    };
};
export default useMessageSearch;
// ===== modules/MessageSearch/context/hooks/useScrollCallback.d.ts =====
import type { SendbirdError } from '@sendbird/chat';
import type { BaseMessage } from '@sendbird/chat/message';
import { CoreMessageType } from '../../../../utils';
import { LoggerInterface } from '../../../../lib/Logger';
interface MainProps {
    onResultLoaded?: (messages?: Array<CoreMessageType> | null, error?: SendbirdError | null) => void;
}
interface ToolProps {
    logger: LoggerInterface;
}
export type CallbackReturn = (callback: (...args: [messages: BaseMessage[], error: null] | [messages: null, error: any]) => void) => void;
declare function useScrollCallback({ onResultLoaded }: MainProps, { logger }: ToolProps): CallbackReturn;
export default useScrollCallback;
// ===== modules/MessageSearch/context/index.d.ts =====
export * from './MessageSearchProvider';
export { default as useMessageSearch } from './hooks/useMessageSearch';
// ===== modules/MessageSearch/index.d.ts =====
/// <reference types="react" />
import './index.scss';
import { MessageSearchUIProps } from './components/MessageSearchUI';
import { MessageSearchProviderProps } from './context/MessageSearchProvider';
export interface MessageSearchPannelProps extends MessageSearchUIProps, MessageSearchProviderProps {
    onCloseClick?: () => void;
}
declare function MessageSearchPannel(props: MessageSearchPannelProps): JSX.Element;
export default MessageSearchPannel;
// ===== modules/OpenChannel/components/FrozenChannelNotification/index.d.ts =====
/// <reference types="react" />
import './frozen-channel-notification.scss';
declare const FrozenNotification: () => JSX.Element;
export default FrozenNotification;
// ===== modules/OpenChannel/components/OpenChannelHeader/index.d.ts =====
/// <reference types="react" />
import './open-channel-header.scss';
export default function OpenchannelConversationHeader(): JSX.Element;
// ===== modules/OpenChannel/components/OpenChannelInput/index.d.ts =====
import React from 'react';
export type MessageInputWrapperProps = {
    value?: string;
};
declare const _default: React.ForwardRefExoticComponent<MessageInputWrapperProps & React.RefAttributes<HTMLInputElement>>;
export default _default;
// ===== modules/OpenChannel/components/OpenChannelMessage/index.d.ts =====
import './open-channel-message.scss';
import React, { ReactElement } from 'react';
import type { RenderMessageProps } from '../../../../types';
import { CoreMessageType } from '../../../../utils';
export type OpenChannelMessageProps = {
    renderMessage?: (props: RenderMessageProps) => React.ReactElement;
    message: CoreMessageType;
    chainTop?: boolean;
    chainBottom?: boolean;
    hasSeparator?: boolean;
    editDisabled?: boolean;
};
export default function OpenChannelMessage(props: OpenChannelMessageProps): ReactElement;
// ===== modules/OpenChannel/components/OpenChannelMessageList/index.d.ts =====
import './openchannel-message-list.scss';
import React from 'react';
import { RenderMessageProps } from '../../../../types';
export type OpenChannelMessageListProps = {
    renderMessage?: (props: RenderMessageProps) => React.ReactElement;
    renderPlaceHolderEmptyList?: () => React.ReactElement;
};
/** @deprecated * */
export type OpenchannelMessageListProps = OpenChannelMessageListProps;
declare const _default: React.ForwardRefExoticComponent<OpenChannelMessageListProps & React.RefAttributes<HTMLDivElement>>;
export default _default;
// ===== modules/OpenChannel/components/OpenChannelUI/index.d.ts =====
import './open-channel-ui.scss';
import React from 'react';
import { RenderMessageProps } from '../../../../types';
export interface OpenChannelUIProps {
    renderMessage?: (props: RenderMessageProps) => React.ReactElement;
    renderHeader?: () => React.ReactElement;
    renderMessageInput?: () => React.ReactElement;
    renderPlaceHolderEmptyList?: () => React.ReactElement;
    renderPlaceHolderError?: () => React.ReactElement;
    renderPlaceHolderLoading?: () => React.ReactElement;
    /** @deprecated Please use renderMessageInput instead * */
    renderInput?: () => React.ReactElement;
}
declare const OpenChannelUI: React.FC<OpenChannelUIProps>;
export default OpenChannelUI;
// ===== modules/OpenChannel/context/OpenChannelProvider.d.ts =====
import React from 'react';
import type { FileMessageCreateParams, UserMessageCreateParams } from '@sendbird/chat/message';
import { RenderUserProfileProps } from '../../../types';
import { State as MessageStoreState } from './dux/initialState';
type OpenChannelQueries = {
    messageListParams?: {
        replyType?: string;
        messageType?: string;
        prevResultSize?: number;
        nextResultSize?: number;
        reverse?: boolean;
        isInclusive?: boolean;
        includeMetaArray?: boolean;
        includeParentMessageInfo?: boolean;
        showSubchannelMessagesOnly?: boolean;
        customTypes?: Array<string>;
        senderUserIds?: Array<string>;
    };
};
export interface OpenChannelProviderProps {
    channelUrl: string;
    children?: React.ReactElement;
    isMessageGroupingEnabled?: boolean;
    queries?: OpenChannelQueries;
    messageLimit?: number;
    onBeforeSendUserMessage?(text: string): UserMessageCreateParams;
    onBeforeSendFileMessage?(file_: File): FileMessageCreateParams;
    onChatHeaderActionClick?(): void;
    onBackClick?(): void;
    disableUserProfile?: boolean;
    renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
}
interface OpenChannelInterface extends OpenChannelProviderProps, MessageStoreState {
    messageInputRef: React.RefObject<HTMLInputElement>;
    conversationScrollRef: React.RefObject<HTMLDivElement>;
    disabled: boolean;
    amIBanned: boolean;
    amIMuted: boolean;
    amIOperator: boolean;
    fetchMore: boolean;
    checkScrollBottom: () => boolean;
    onScroll: (callback: () => void) => void;
    handleSendMessage: any;
    handleFileUpload: any;
    updateMessage: any;
    deleteMessage: any;
    resendMessage: any;
}
declare const OpenChannelProvider: React.FC<OpenChannelProviderProps>;
declare const useOpenChannelContext: () => OpenChannelInterface;
export { OpenChannelProvider, useOpenChannelContext, };
// ===== modules/OpenChannel/context/dux/initialState.d.ts =====
import type { User } from '@sendbird/chat';
import type { OpenChannel } from '@sendbird/chat/openChannel';
import { CoreMessageType } from '../../../../utils';
export interface State {
    allMessages: Array<CoreMessageType>;
    loading: boolean;
    initialized: boolean;
    currentOpenChannel: OpenChannel;
    isInvalid: boolean;
    hasMore: boolean;
    lastMessageTimestamp: number;
    frozen: boolean;
    operators: Array<User>;
    participants: Array<User>;
    bannedParticipantIds: Array<string>;
    mutedParticipantIds: Array<string>;
}
declare const initialState: State;
export default initialState;
// ===== modules/OpenChannel/index.d.ts =====
import React from 'react';
import { OpenChannelUIProps } from './components/OpenChannelUI';
import { OpenChannelProviderProps } from './context/OpenChannelProvider';
export interface OpenChannelProps extends OpenChannelProviderProps, OpenChannelUIProps {
}
declare const OpenChannel: React.FC<OpenChannelProps>;
export default OpenChannel;
// ===== modules/OpenChannelList/components/OpenChannelListUI/index.d.ts =====
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
// ===== modules/OpenChannelList/components/OpenChannelPreview/index.d.ts =====
import './index.scss';
import React from 'react';
import { OpenChannel } from '@sendbird/chat/openChannel';
interface OpenChannelPreviewProps {
    className?: string;
    isSelected?: boolean;
    channel: OpenChannel;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}
declare function OpenChannelPreview({ className, isSelected, channel, onClick, }: OpenChannelPreviewProps): React.ReactElement;
export default OpenChannelPreview;
// ===== modules/OpenChannelList/context/OpenChannelListInterfaces.d.ts =====
import { OpenChannel } from '@sendbird/chat/openChannel';
import { Dispatch } from 'react';
import { Logger } from '../../../lib/Sendbird/types';
import OpenChannelListActionTypes from './dux/actionTypes';
import { FetchNextCallbackType } from './hooks/useFetchNextCallback';
export interface UserFilledOpenChannelListQuery {
    customTypes?: Array<string>;
    includeFrozen?: boolean;
    includeMetaData?: boolean;
    limit?: number;
    nameKeyword?: string;
    urlKeyword?: string;
}
export declare enum OpenChannelListFetchingStatus {
    EMPTY = "EMPTY",
    FETCHING = "FETCHING",
    DONE = "DONE",
    ERROR = "ERROR"
}
export type OnOpenChannelSelected = (channel: OpenChannel, e?: React.MouseEvent<HTMLDivElement | unknown>) => void;
export type OpenChannelListDispatcherType = Dispatch<{
    type: OpenChannelListActionTypes;
    payload: any;
}>;
export interface OpenChannelListProviderProps {
    className?: string;
    children?: React.ReactElement;
    queries?: {
        openChannelListQuery?: UserFilledOpenChannelListQuery;
    };
    onChannelSelected?: OnOpenChannelSelected;
}
export interface OpenChannelListProviderInterface extends OpenChannelListProviderProps {
    logger: Logger;
    currentChannel: OpenChannel;
    allChannels: Array<OpenChannel>;
    fetchingStatus: OpenChannelListFetchingStatus;
    customOpenChannelListQuery?: UserFilledOpenChannelListQuery;
    fetchNextChannels: FetchNextCallbackType;
    refreshOpenChannelList: () => void;
    openChannelListDispatcher: OpenChannelListDispatcherType;
}
// ===== modules/OpenChannelList/context/OpenChannelListProvider.d.ts =====
import React from 'react';
import { OpenChannelListProviderProps, OpenChannelListProviderInterface } from './OpenChannelListInterfaces';
export declare function useOpenChannelListContext(): OpenChannelListProviderInterface;
export declare const OpenChannelListProvider: React.FC<OpenChannelListProviderProps>;
declare const _default: {
    OpenChannelListProvider: React.FC<OpenChannelListProviderProps>;
    useOpenChannelListContext: typeof useOpenChannelListContext;
};
export default _default;
// ===== modules/OpenChannelList/context/dux/actionTypes.d.ts =====
declare enum OpenChannelListActionTypes {
    INIT_OPEN_CHANNEL_LIST_START = "INIT_OPEN_CHANNEL_LIST_START",
    INIT_OPEN_CHANNEL_LIST_SUCCESS = "INIT_OPEN_CHANNEL_LIST_SUCCESS",
    INIT_OPEN_CHANNEL_LIST_FAILURE = "INIT_OPEN_CHANNEL_LIST_FAILURE",
    RESET_OPEN_CHANNEL_LIST = "RESET_OPEN_CHANNEL_LIST",
    FETCH_OPEN_CHANNEL_LIST_START = "FETCH_OPEN_CHANNEL_LIST_START",
    FETCH_OPEN_CHANNEL_LIST_SUCCESS = "FETCH_OPEN_CHANNEL_LIST_SUCCESS",
    FETCH_OPEN_CHANNEL_LIST_FAILURE = "FETCH_OPEN_CHANNEL_LIST_FAILURE",
    CREATE_OPEN_CHANNEL = "CREATE_OPEN_CHANNEL",
    SET_CURRENT_OPEN_CHANNEL = "SET_CURRENT_OPEN_CHANNEL",
    UPDATE_OPEN_CHANNEL_LIST_QUERY = "UPDATE_OPEN_CHANNEL_LIST_QUERY",
    UPDATE_OPEN_CHANNEL = "UPDATE_OPEN_CHANNEL",
    DELETE_OPEN_CHANNEL = "DELETE_OPEN_CHANNEL"
}
export default OpenChannelListActionTypes;
// ===== modules/OpenChannelList/context/hooks/useFetchNextCallback.d.ts =====
import { SendbirdError } from '@sendbird/chat';
import { OpenChannel, OpenChannelListQuery } from '@sendbird/chat/openChannel';
import type { Logger } from '../../../../lib/Sendbird/types';
import { OpenChannelListDispatcherType } from '../OpenChannelListInterfaces';
interface DynamicParams {
    sdkInitialized: boolean;
    openChannelListQuery: OpenChannelListQuery;
}
interface StaticParams {
    logger: Logger;
    openChannelListDispatcher: OpenChannelListDispatcherType;
}
export type FetchNextCallbackType = (callback: (channels?: Array<OpenChannel>, err?: SendbirdError) => void) => void;
declare function useFetchNextCallback({ sdkInitialized, openChannelListQuery, }: DynamicParams, { logger, openChannelListDispatcher, }: StaticParams): FetchNextCallbackType;
export default useFetchNextCallback;
// ===== modules/OpenChannelList/index.d.ts =====
import { ReactElement } from 'react';
import { OpenChannelListUIProps } from './components/OpenChannelListUI';
import { OpenChannelListProviderProps } from './context/OpenChannelListInterfaces';
export interface OpenChannelListProps extends OpenChannelListProviderProps, OpenChannelListUIProps {
}
declare function OpenChannelList({ className, queries, onChannelSelected, renderHeader, renderChannelPreview, renderPlaceHolderEmpty, renderPlaceHolderError, renderPlaceHolderLoading, }: OpenChannelListProps): ReactElement;
export default OpenChannelList;
// ===== modules/OpenChannelSettings/components/EditDetailsModal.d.ts =====
import { ReactElement } from 'react';
interface Props {
    onCancel(): void;
}
declare const EditDetails: (props: Props) => ReactElement;
export default EditDetails;
// ===== modules/OpenChannelSettings/components/OpenChannelProfile/index.d.ts =====
import { ReactElement } from 'react';
import './channel-profile.scss';
export default function ChannelProfile(): ReactElement;
// ===== modules/OpenChannelSettings/components/OpenChannelSettingsUI/index.d.ts =====
import './open-channel-ui.scss';
import React from 'react';
export interface OpenChannelUIProps {
    renderOperatorUI?: () => React.ReactElement;
    renderParticipantList?: () => React.ReactElement;
}
declare const OpenChannelUI: React.FC<OpenChannelUIProps>;
export default OpenChannelUI;
// ===== modules/OpenChannelSettings/components/OperatorUI/index.d.ts =====
import React from 'react';
export declare const copyToClipboard: (text: string) => boolean;
export interface OperatorUIProps {
    renderChannelProfile?: () => React.ReactElement;
}
export declare const OperatorUI: React.FC<OperatorUIProps>;
export default OperatorUI;
// ===== modules/OpenChannelSettings/components/ParticipantUI/index.d.ts =====
import { ReactElement } from 'react';
interface ParticipantListProps {
    isOperatorView?: boolean;
}
export default function ParticipantList({ isOperatorView, }: ParticipantListProps): ReactElement;
export {};
// ===== modules/OpenChannelSettings/context/OpenChannelSettingsProvider.d.ts =====
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
    channel?: OpenChannel | null;
    isChannelInitialized: boolean;
    setChannel?: React.Dispatch<React.SetStateAction<OpenChannel | null>>;
    onCloseClick?(): void;
    onBeforeUpdateChannel?(currentTitle: string, currentImg: File, data: string): OpenChannelUpdateParams;
    onChannelModified?(channel: OpenChannel): void;
    onDeleteChannel?(channel: OpenChannel): void;
}
declare const OpenChannelSettingsProvider: React.FC<OpenChannelSettingsContextProps>;
declare const useOpenChannelSettingsContext: () => OpenChannelSettingsContextType;
export { OpenChannelSettingsProvider, useOpenChannelSettingsContext, };
// ===== modules/OpenChannelSettings/index.d.ts =====
import React from 'react';
import { OpenChannelUIProps } from './components/OpenChannelSettingsUI';
import { OpenChannelSettingsContextProps } from './context/OpenChannelSettingsProvider';
export interface OpenChannelSettingsProps extends OpenChannelSettingsContextProps, OpenChannelUIProps {
}
declare const OpenChannelSetting: React.FC<OpenChannelSettingsProps>;
export default OpenChannelSetting;
// ===== modules/Thread/components/ParentMessageInfo/ParentMessageInfoItem.d.ts =====
import { ReactElement } from 'react';
import './ParentMessageInfoItem.scss';
import { SendableMessageType } from '../../../../utils';
import type { OnBeforeDownloadFileMessageType } from '../../../GroupChannel/context/types';
export interface ParentMessageInfoItemProps {
    className?: string;
    message: SendableMessageType;
    showFileViewer?: (bool: boolean) => void;
    onBeforeDownloadFileMessage?: OnBeforeDownloadFileMessageType;
}
export default function ParentMessageInfoItem({ className, message, showFileViewer, onBeforeDownloadFileMessage, }: ParentMessageInfoItemProps): ReactElement;
// ===== modules/Thread/components/ParentMessageInfo/index.d.ts =====
import React, { ReactNode } from 'react';
import './index.scss';
import { MessageEmojiMenuProps } from '../../../../ui/MessageItemReactionMenu';
import { MessageMenuProps } from '../../../../ui/MessageMenu';
export interface ParentMessageInfoProps {
    className?: string;
    renderEmojiMenu?: (props: MessageEmojiMenuProps) => ReactNode;
    renderMessageMenu?: (props: MessageMenuProps) => ReactNode;
}
export default function ParentMessageInfo({ className, renderEmojiMenu, renderMessageMenu, }: ParentMessageInfoProps): React.ReactElement;
// ===== modules/Thread/components/ThreadHeader/index.d.ts =====
import React from 'react';
import type { MouseEvent, KeyboardEvent, TouchEvent } from 'react';
type EventType = MouseEvent | KeyboardEvent | TouchEvent;
export interface ThreadHeaderProps {
    className?: string;
    channelName: string;
    renderActionIcon?: (props: {
        onActionIconClick: (e: EventType) => void;
    }) => React.ReactElement;
    onActionIconClick?: (e: EventType) => void;
    onChannelNameClick?: (e: EventType) => void;
}
export default function ThreadHeader({ className, channelName, renderActionIcon, onActionIconClick, onChannelNameClick, }: ThreadHeaderProps): React.ReactElement;
export {};
// ===== modules/Thread/components/ThreadList/ThreadListItem.d.ts =====
import React from 'react';
import { SendableMessageType } from '../../../../utils';
import { MessageComponentRenderers } from '../../../../ui/MessageContent';
export interface ThreadListItemProps extends MessageComponentRenderers {
    className?: string;
    message: SendableMessageType;
    chainTop?: boolean;
    chainBottom?: boolean;
    hasSeparator?: boolean;
    renderCustomSeparator?: (props: {
        message: SendableMessageType;
    }) => React.ReactElement;
    handleScroll?: () => void;
}
export default function ThreadListItem(props: ThreadListItemProps): React.ReactElement;
// ===== modules/Thread/components/ThreadList/index.d.ts =====
import React, { RefObject } from 'react';
import './index.scss';
import type { SendableMessageType } from '../../../../utils';
import { ThreadListItemProps } from './ThreadListItem';
export interface ThreadListProps {
    className?: string;
    renderMessage?: (props: ThreadListItemProps) => React.ReactElement;
    renderCustomSeparator?: (props: {
        message: SendableMessageType;
    }) => React.ReactElement;
    scrollRef?: RefObject<HTMLDivElement>;
    scrollBottom?: number;
}
export default function ThreadList({ className, renderMessage, renderCustomSeparator, scrollRef, scrollBottom, }: ThreadListProps): React.ReactElement;
// ===== modules/Thread/components/ThreadMessageInput/index.d.ts =====
import React from 'react';
import './index.scss';
export interface ThreadMessageInputProps {
    className?: string;
    disabled?: boolean;
    renderFileUploadIcon?: () => React.ReactElement;
    renderVoiceMessageIcon?: () => React.ReactElement;
    renderSendMessageIcon?: () => React.ReactElement;
    acceptableMimeTypes?: string[];
}
declare const _default: React.ForwardRefExoticComponent<ThreadMessageInputProps & React.RefAttributes<any>>;
export default _default;
// ===== modules/Thread/components/ThreadUI/index.d.ts =====
import React, { ReactNode } from 'react';
import './index.scss';
import { ParentMessageStateTypes, ThreadListStateTypes } from '../../types';
import { SendableMessageType } from '../../../../utils';
export interface ThreadUIProps {
    renderHeader?: () => React.ReactElement;
    renderParentMessageInfo?: () => ReactNode;
    renderMessage?: (props: {
        message: SendableMessageType;
        chainTop: boolean;
        chainBottom: boolean;
        hasSeparator: boolean;
    }) => React.ReactElement;
    renderFileUploadIcon?: () => React.ReactElement;
    renderVoiceMessageIcon?: () => React.ReactElement;
    renderSendMessageIcon?: () => React.ReactElement;
    renderMessageInput?: () => React.ReactElement;
    renderCustomSeparator?: () => React.ReactElement;
    renderParentMessageInfoPlaceholder?: (type: ParentMessageStateTypes) => React.ReactElement;
    renderThreadListPlaceHolder?: (type: ThreadListStateTypes) => React.ReactElement;
}
declare const ThreadUI: React.FC<ThreadUIProps>;
export default ThreadUI;
// ===== modules/Thread/context/ThreadProvider.d.ts =====
import React from 'react';
import { type EmojiCategory, EmojiContainer } from '@sendbird/chat';
import { GroupChannel, Member } from '@sendbird/chat/groupChannel';
import type { FileMessage, FileMessageCreateParams, MultipleFilesMessage, MultipleFilesMessageCreateParams, UserMessageCreateParams } from '@sendbird/chat/message';
import { UserProfileProviderProps } from '../../../lib/UserProfileContext';
import type { OnBeforeDownloadFileMessageType } from '../../GroupChannel/context/types';
import { useGroupChannelThreadMessages } from '@sendbird/uikit-tools';
import { CoreMessageType, SendableMessageType } from '../../../utils';
import { ChannelStateTypes, ParentMessageStateTypes, ThreadListStateTypes } from '../types';
export interface ThreadProviderProps extends Pick<UserProfileProviderProps, 'disableUserProfile' | 'renderUserProfile'> {
    children?: React.ReactElement;
    channelUrl: string;
    message: SendableMessageType | null;
    onHeaderActionClick?: () => void;
    onMoveToParentMessage?: (props: {
        message: SendableMessageType;
        channel: GroupChannel;
    }) => void;
    onBeforeSendUserMessage?: (message: string, quotedMessage?: SendableMessageType) => UserMessageCreateParams;
    onBeforeSendFileMessage?: (file: File, quotedMessage?: SendableMessageType) => FileMessageCreateParams;
    onBeforeSendVoiceMessage?: (file: File, quotedMessage?: SendableMessageType) => FileMessageCreateParams;
    onBeforeSendMultipleFilesMessage?: (files: Array<File>, quotedMessage?: SendableMessageType) => MultipleFilesMessageCreateParams;
    onBeforeDownloadFileMessage?: OnBeforeDownloadFileMessageType;
    isMultipleFilesMessageEnabled?: boolean;
    filterEmojiCategoryIds?: (message: SendableMessageType) => EmojiCategory['id'][];
}
type ThreadMessageDataSource = ReturnType<typeof useGroupChannelThreadMessages>;
export interface LocalFilePreview {
    localUrl: string;
    file: File;
}
export interface ThreadState extends ThreadProviderProps {
    currentChannel: GroupChannel;
    /** All thread replies (succeeded + pending + failed) in one list. Prefer this. */
    threadMessages: Array<CoreMessageType>;
    /** @deprecated Use {@link ThreadState.threadMessages} instead. Holds succeeded (server) replies only. */
    allThreadMessages: Array<CoreMessageType>;
    /** @deprecated Use {@link ThreadState.threadMessages} instead. Holds pending/failed outbound replies only. */
    localThreadMessages: Array<CoreMessageType>;
    parentMessage: SendableMessageType;
    channelState: ChannelStateTypes;
    parentMessageState: ParentMessageStateTypes;
    threadListState: ThreadListStateTypes;
    hasMorePrev: boolean;
    hasMoreNext: boolean;
    emojiContainer: EmojiContainer;
    isMuted: boolean;
    isChannelFrozen: boolean;
    currentUserId: string;
    typingMembers: Member[];
    nicknamesMap: Map<string, string>;
    localFilePreviews: Map<string, LocalFilePreview>;
    loadPrevious?: ThreadMessageDataSource['loadPrevious'];
    loadNext?: ThreadMessageDataSource['loadNext'];
    resetWithStartingPoint?: ThreadMessageDataSource['resetWithStartingPoint'];
    dsSendUserMessage?: ThreadMessageDataSource['sendUserMessage'];
    dsSendFileMessage?: ThreadMessageDataSource['sendFileMessage'];
    dsSendMultipleFilesMessage?: ThreadMessageDataSource['sendMultipleFilesMessage'];
    dsUpdateUserMessage?: ThreadMessageDataSource['updateUserMessage'];
    dsResendMessage?: ThreadMessageDataSource['resendMessage'];
    dsDeleteMessage?: ThreadMessageDataSource['deleteMessage'];
}
export declare const ThreadContext: React.Context<import("../../../utils/storeManager").Store<ThreadState>>;
export declare const InternalThreadProvider: React.FC<React.PropsWithChildren<unknown>>;
export declare const ThreadManager: React.FC<React.PropsWithChildren<ThreadProviderProps>>;
export declare const ThreadProvider: (props: ThreadProviderProps) => React.JSX.Element;
export declare const useThreadContext: () => {
    onMessageReceived: (channel: GroupChannel, message: SendableMessageType) => void;
    onReactionUpdated: (reactionEvent: import("@sendbird/chat/message").ReactionEvent) => void;
    onFileInfoUpdated: (params: import("../types").FileUploadInfoParams) => void;
    sendMessageStart: (message: SendableMessageType) => void;
    sendMessageSuccess: (message: SendableMessageType) => void;
    sendMessageFailure: (message: SendableMessageType) => void;
    resendMessageStart: (message: SendableMessageType) => void;
    onMessageUpdated: (channel: GroupChannel, message: SendableMessageType) => void;
    onMessageDeleted: (channel: GroupChannel, messageId: number) => void;
    onMessageDeletedByReqId: (reqId: string | number) => void;
    initializeThreadListStart: () => void;
    initializeThreadListSuccess: (parentMessage: import("@sendbird/chat/message").BaseMessage, anchorMessage: SendableMessageType, threadedMessages: import("@sendbird/chat/message").BaseMessage[]) => void;
    initializeThreadListFailure: () => void;
    getPrevMessagesStart: () => void;
    getPrevMessagesSuccess: (threadedMessages: CoreMessageType[]) => void;
    getPrevMessagesFailure: () => void;
    getNextMessagesStart: () => void;
    getNextMessagesSuccess: (threadedMessages: CoreMessageType[]) => void;
    getNextMessagesFailure: () => void;
    sendMessage: (props: import("./hooks/useThreadMessageActions").SendMessageParams) => void;
    sendFileMessage: (file: File, quoteMessage?: SendableMessageType) => Promise<FileMessage>;
    sendVoiceMessage: (file: File, duration: number, quoteMessage?: SendableMessageType) => void;
    sendMultipleFilesMessage: (files: File[], quoteMessage?: SendableMessageType) => Promise<MultipleFilesMessage>;
    updateMessage: (props: import("./hooks/useThreadMessageActions").UpdateMessageParams) => void;
    deleteMessage: (message: SendableMessageType) => Promise<void>;
    resendMessage: (failedMessage: SendableMessageType) => void;
    toggleReaction: (message: import("@sendbird/chat/message").BaseMessage, key: string, isReacted: boolean) => void;
    initializeThreadFetcher: (callback?: (messages: CoreMessageType[]) => void) => Promise<void>;
    fetchPrevThreads: (callback?: (messages: CoreMessageType[]) => void) => Promise<void>;
    fetchNextThreads: (callback?: (messages: CoreMessageType[]) => void) => Promise<void>;
    setCurrentUserId: (currentUserId: string) => void;
    getChannelStart: () => void;
    getChannelSuccess: (groupChannel: GroupChannel) => void;
    getChannelFailure: () => void;
    getParentMessageStart: () => void;
    getParentMessageSuccess: (parentMessage: SendableMessageType) => void;
    getParentMessageFailure: () => void;
    setEmojiContainer: (emojiContainer: EmojiContainer) => void;
    onUserMuted: (channel: GroupChannel, user: import("@sendbird/chat").User) => void;
    onUserUnmuted: (channel: GroupChannel, user: import("@sendbird/chat").User) => void;
    onUserBanned: (channel: GroupChannel, user: import("@sendbird/chat").User) => void;
    onUserUnbanned: () => void;
    onUserLeft: (channel: GroupChannel, user: import("@sendbird/chat").User) => void;
    onChannelFrozen: () => void;
    onChannelUnfrozen: () => void;
    onOperatorUpdated: (channel: GroupChannel) => void;
    onTypingStatusUpdated: (channel: GroupChannel, typingMembers: Member[]) => void;
    currentChannel: GroupChannel;
    /** All thread replies (succeeded + pending + failed) in one list. Prefer this. */
    threadMessages: Array<CoreMessageType>;
    /** @deprecated Use {@link ThreadState.threadMessages} instead. Holds succeeded (server) replies only. */
    allThreadMessages: Array<CoreMessageType>;
    /** @deprecated Use {@link ThreadState.threadMessages} instead. Holds pending/failed outbound replies only. */
    localThreadMessages: Array<CoreMessageType>;
    parentMessage: SendableMessageType;
    channelState: ChannelStateTypes;
    parentMessageState: ParentMessageStateTypes;
    threadListState: ThreadListStateTypes;
    hasMorePrev: boolean;
    hasMoreNext: boolean;
    emojiContainer: EmojiContainer;
    isMuted: boolean;
    isChannelFrozen: boolean;
    currentUserId: string;
    typingMembers: Member[];
    nicknamesMap: Map<string, string>;
    localFilePreviews: Map<string, LocalFilePreview>;
    loadPrevious?: ThreadMessageDataSource['loadPrevious'];
    loadNext?: ThreadMessageDataSource['loadNext'];
    resetWithStartingPoint?: ThreadMessageDataSource['resetWithStartingPoint'];
    dsSendUserMessage?: ThreadMessageDataSource['sendUserMessage'];
    dsSendFileMessage?: ThreadMessageDataSource['sendFileMessage'];
    dsSendMultipleFilesMessage?: ThreadMessageDataSource['sendMultipleFilesMessage'];
    dsUpdateUserMessage?: ThreadMessageDataSource['updateUserMessage'];
    dsResendMessage?: ThreadMessageDataSource['resendMessage'];
    dsDeleteMessage?: ThreadMessageDataSource['deleteMessage'];
    children?: React.ReactElement;
    channelUrl: string;
    message: SendableMessageType | null;
    onHeaderActionClick?: () => void;
    onMoveToParentMessage?: (props: {
        message: SendableMessageType;
        channel: GroupChannel;
    }) => void;
    onBeforeSendUserMessage?: (message: string, quotedMessage?: SendableMessageType) => UserMessageCreateParams;
    onBeforeSendFileMessage?: (file: File, quotedMessage?: SendableMessageType) => FileMessageCreateParams;
    onBeforeSendVoiceMessage?: (file: File, quotedMessage?: SendableMessageType) => FileMessageCreateParams;
    onBeforeSendMultipleFilesMessage?: (files: Array<File>, quotedMessage?: SendableMessageType) => MultipleFilesMessageCreateParams;
    onBeforeDownloadFileMessage?: OnBeforeDownloadFileMessageType;
    isMultipleFilesMessageEnabled?: boolean;
    filterEmojiCategoryIds?: (message: SendableMessageType) => EmojiCategory['id'][];
    renderUserProfile?: ((props: import("../../../types").RenderUserProfileProps) => React.ReactElement<any, string | React.JSXElementConstructor<any>>) & ((props: import("../../../types").RenderUserProfileProps) => React.ReactElement<any, string | React.JSXElementConstructor<any>>);
    disableUserProfile?: boolean;
};
export {};
// ===== modules/Thread/context/hooks/useSendFileMessage.d.ts =====
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { FileMessage, FileMessageCreateParams } from '@sendbird/chat/message';
import type { Logger } from '../../../../lib/Sendbird/types';
import { SBUGlobalPubSub } from '../../../../lib/pubSub/topics';
import { SendableMessageType } from '../../../../utils';
interface DynamicProps {
    currentChannel: GroupChannel | null;
    onBeforeSendFileMessage?: (file: File, quotedMessage?: SendableMessageType) => FileMessageCreateParams;
    sendMessageStart: (message: SendableMessageType) => void;
    sendMessageFailure: (message: SendableMessageType) => void;
}
interface StaticProps {
    logger: Logger;
    pubSub: SBUGlobalPubSub;
}
export type SendFileMessageFunctionType = (file: File, quoteMessage?: SendableMessageType) => Promise<FileMessage>;
export default function useSendFileMessageCallback({ currentChannel, onBeforeSendFileMessage, sendMessageStart, sendMessageFailure, }: DynamicProps, { logger, pubSub, }: StaticProps): SendFileMessageFunctionType;
export {};
// ===== modules/Thread/context/hooks/useThreadMessageActions.d.ts =====
import { User } from '@sendbird/chat';
import { FileMessage, MultipleFilesMessage } from '@sendbird/chat/message';
import type { Logger } from '../../../../lib/Sendbird/types';
import { SBUGlobalPubSub } from '../../../../lib/pubSub/topics';
import { SendableMessageType } from '../../../../utils';
import type { ThreadState } from '../ThreadProvider';
export type SendMessageParams = {
    message: string;
    quoteMessage?: SendableMessageType;
    mentionTemplate?: string;
    mentionedUsers?: Array<User>;
};
export type UpdateMessageParams = {
    messageId: number;
    message: string;
    mentionedUsers?: User[];
    mentionedUserIds?: string[];
    mentionTemplate?: string;
};
export interface ThreadMessageActions {
    sendMessage: (props: SendMessageParams) => void;
    sendFileMessage: (file: File, quoteMessage?: SendableMessageType) => Promise<FileMessage>;
    sendVoiceMessage: (file: File, duration: number, quoteMessage?: SendableMessageType) => void;
    sendMultipleFilesMessage: (files: Array<File>, quoteMessage?: SendableMessageType) => Promise<MultipleFilesMessage>;
    updateMessage: (props: UpdateMessageParams) => void;
    deleteMessage: (message: SendableMessageType) => Promise<void>;
    resendMessage: (failedMessage: SendableMessageType) => void;
}
interface StaticProps {
    logger: Logger;
    pubSub: SBUGlobalPubSub;
    isMentionEnabled: boolean;
}
export declare function useThreadMessageActions(state: ThreadState, { logger, pubSub, isMentionEnabled }: StaticProps): ThreadMessageActions;
export default useThreadMessageActions;
// ===== modules/Thread/context/index.d.ts =====
export * from './ThreadProvider';
export { default as useThread } from './useThread';
// ===== modules/Thread/context/useThread.d.ts =====
import { ThreadState } from './ThreadProvider';
import { FileUploadInfoParams } from '../types';
import { GroupChannel, Member } from '@sendbird/chat/groupChannel';
import { CoreMessageType, SendableMessageType } from '../../../utils';
import { EmojiContainer, User } from '@sendbird/chat';
import { BaseMessage, ReactionEvent } from '@sendbird/chat/message';
declare const useThread: () => {
    state: ThreadState;
    actions: {
        onMessageReceived: (channel: GroupChannel, message: SendableMessageType) => void;
        onReactionUpdated: (reactionEvent: ReactionEvent) => void;
        onFileInfoUpdated: (params: FileUploadInfoParams) => void;
        sendMessageStart: (message: SendableMessageType) => void;
        sendMessageSuccess: (message: SendableMessageType) => void;
        sendMessageFailure: (message: SendableMessageType) => void;
        resendMessageStart: (message: SendableMessageType) => void;
        onMessageUpdated: (channel: GroupChannel, message: SendableMessageType) => void;
        onMessageDeleted: (channel: GroupChannel, messageId: number) => void;
        onMessageDeletedByReqId: (reqId: string | number) => void;
        initializeThreadListStart: () => void;
        initializeThreadListSuccess: (parentMessage: BaseMessage, anchorMessage: SendableMessageType, threadedMessages: BaseMessage[]) => void;
        initializeThreadListFailure: () => void;
        getPrevMessagesStart: () => void;
        getPrevMessagesSuccess: (threadedMessages: CoreMessageType[]) => void;
        getPrevMessagesFailure: () => void;
        getNextMessagesStart: () => void;
        getNextMessagesSuccess: (threadedMessages: CoreMessageType[]) => void;
        getNextMessagesFailure: () => void;
        sendMessage: (props: import("./hooks/useThreadMessageActions").SendMessageParams) => void;
        sendFileMessage: (file: File, quoteMessage?: SendableMessageType) => Promise<import("@sendbird/chat/message").FileMessage>;
        sendVoiceMessage: (file: File, duration: number, quoteMessage?: SendableMessageType) => void;
        sendMultipleFilesMessage: (files: File[], quoteMessage?: SendableMessageType) => Promise<import("@sendbird/chat/message").MultipleFilesMessage>;
        updateMessage: (props: import("./hooks/useThreadMessageActions").UpdateMessageParams) => void;
        deleteMessage: (message: SendableMessageType) => Promise<void>;
        resendMessage: (failedMessage: SendableMessageType) => void;
        toggleReaction: (message: BaseMessage, key: string, isReacted: boolean) => void;
        initializeThreadFetcher: (callback?: (messages: CoreMessageType[]) => void) => Promise<void>;
        fetchPrevThreads: (callback?: (messages: CoreMessageType[]) => void) => Promise<void>;
        fetchNextThreads: (callback?: (messages: CoreMessageType[]) => void) => Promise<void>;
        setCurrentUserId: (currentUserId: string) => void;
        getChannelStart: () => void;
        getChannelSuccess: (groupChannel: GroupChannel) => void;
        getChannelFailure: () => void;
        getParentMessageStart: () => void;
        getParentMessageSuccess: (parentMessage: SendableMessageType) => void;
        getParentMessageFailure: () => void;
        setEmojiContainer: (emojiContainer: EmojiContainer) => void;
        onUserMuted: (channel: GroupChannel, user: User) => void;
        onUserUnmuted: (channel: GroupChannel, user: User) => void;
        onUserBanned: (channel: GroupChannel, user: User) => void;
        onUserUnbanned: () => void;
        onUserLeft: (channel: GroupChannel, user: User) => void;
        onChannelFrozen: () => void;
        onChannelUnfrozen: () => void;
        onOperatorUpdated: (channel: GroupChannel) => void;
        onTypingStatusUpdated: (channel: GroupChannel, typingMembers: Member[]) => void;
    };
};
export default useThread;
// ===== modules/Thread/index.d.ts =====
import React from 'react';
import { ThreadProviderProps } from './context/ThreadProvider';
import { ThreadUIProps } from './components/ThreadUI';
export interface ThreadProps extends ThreadProviderProps, ThreadUIProps {
    className?: string;
}
declare const Thread: (props: ThreadProps) => React.JSX.Element;
export default Thread;
// ===== modules/Thread/types.d.ts =====
import { UploadableFileInfo } from '@sendbird/chat/message';
export declare enum ChannelStateTypes {
    NIL = "NIL",
    LOADING = "LOADING",
    INVALID = "INVALID",
    INITIALIZED = "INITIALIZED"
}
export declare enum ParentMessageStateTypes {
    NIL = "NIL",
    LOADING = "LOADING",
    INVALID = "INVALID",
    INITIALIZED = "INITIALIZED"
}
export declare enum ThreadListStateTypes {
    NIL = "NIL",
    LOADING = "LOADING",
    INVALID = "INVALID",
    INITIALIZED = "INITIALIZED"
}
export interface FileUploadInfoParams {
    channelUrl: string;
    requestId: string;
    index: number;
    uploadableFileInfo: UploadableFileInfo;
    error: Error;
}
// ===== modules/internalInterfaces.d.ts =====
export declare enum PublishingModuleType {
    CHANNEL = "CHANNEL",
    THREAD = "THREAD"
}
export declare function shouldPubSubPublishToChannel(modules?: PublishingModuleType[]): boolean;
export declare function shouldPubSubPublishToThread(modules?: PublishingModuleType[]): boolean;
// ===== types.d.ts =====
import { MutableRefObject } from 'react';
import type { User } from '@sendbird/chat';
import type { Member } from '@sendbird/chat/groupChannel';
import type { AdminMessage, FileMessage, MultipleFilesMessage, UserMessage, Thumbnail } from '@sendbird/chat/message';
import { CoreMessageType } from './utils';
import { MessageProps } from './modules/GroupChannel/components/Message/MessageView';
export type ReplyType = 'NONE' | 'QUOTE_REPLY' | 'THREAD';
export type Nullable<T> = T | null;
export type SpaceFromTriggerType = {
    x: number;
    y: number;
    top?: number;
    left?: number;
    height?: number;
};
export interface UserListQuery {
    hasNext?: boolean;
    next(): Promise<Array<User>>;
    get isLoading(): boolean;
}
export declare enum TypingIndicatorType {
    Text = "text",
    Bubble = "bubble"
}
export interface RenderUserProfileProps {
    user: User | Member;
    currentUserId: string;
    close(): void;
    avatarRef: MutableRefObject<any>;
}
export interface SendBirdProviderConfig {
    logLevel?: 'debug' | 'warning' | 'error' | 'info' | 'all' | Array<string>;
    userMention?: {
        maxMentionCount?: number;
        maxSuggestionCount?: number;
    };
    isREMUnitEnabled?: boolean;
}
export interface ClientMessage {
    reqId: string;
    file?: File;
    localUrl?: string;
    _sender: User;
}
export interface RenderMessageProps {
    message: CoreMessageType;
    chainTop: boolean;
    chainBottom: boolean;
}
export type RenderMessageParamsType = Omit<MessageProps, 'renderMessage'>;
export interface RenderCustomSeparatorProps {
    message: CoreMessageType;
}
export interface ClientUserMessage extends UserMessage, ClientMessage {
}
export interface ClientFileMessage extends FileMessage, ClientMessage {
}
export interface ClientAdminMessage extends AdminMessage, ClientMessage {
}
export interface ClientMultipleFilesMessage extends MultipleFilesMessage, ClientMessage {
}
export type EveryMessage = ClientUserMessage | ClientFileMessage | ClientMultipleFilesMessage | ClientAdminMessage;
export type ClientSentMessages = ClientUserMessage | ClientFileMessage | ClientMultipleFilesMessage;
export interface UploadedFileInfoWithUpload {
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    thumbnails?: Thumbnail[];
    url?: string;
    isUploaded?: boolean;
}
export type SendbirdTheme = 'light' | 'dark';
export type HTMLTextDirection = 'ltr' | 'rtl';
// ===== ui/Accordion/Accordion.d.ts =====
import React, { type ReactElement } from 'react';
import './index.scss';
export interface AccordionProps {
    className?: string;
    id: string;
    renderTitle?: () => ReactElement;
    renderContent?: () => ReactElement;
    renderFooter?: () => ReactElement;
}
export declare const Accordion: ({ className, id, renderTitle, renderContent, renderFooter, }: AccordionProps) => React.JSX.Element;
// ===== ui/Accordion/AccordionGroup.d.ts =====
import React, { type ReactElement } from 'react';
export interface AccordionGroupContextType {
    openedListKeys: Array<string>;
    addOpenedListKey: (key: string) => void;
    removeOpenedListKey: (key: string) => void;
    clearOpenedListKeys: () => void;
    allowMultipleOpen: boolean;
}
export declare const AccordionGroupContext: React.Context<AccordionGroupContextType>;
export interface AccordionGroupProps {
    className?: string;
    children: ReactElement | Array<ReactElement>;
    allowMultipleOpen?: boolean;
}
export declare const AccordionGroupProvider: ({ className, children, allowMultipleOpen, }: AccordionGroupProps) => React.JSX.Element;
export declare const useAccordionGroupContext: () => AccordionGroupContextType;
export default AccordionGroupProvider;
// ===== ui/Accordion/index.d.ts =====
/// <reference types="react" />
import './index.scss';
import { Accordion } from './Accordion';
export default Accordion;
export declare const AccordionGroup: ({ className, children, allowMultipleOpen, }: import("./AccordionGroup").AccordionGroupProps) => import("react").JSX.Element;
export * from './Accordion';
export * from './AccordionGroup';
// ===== ui/AdminMessage/index.d.ts =====
import { ReactElement } from 'react';
import { AdminMessage as AdminMessageType } from '@sendbird/chat/message';
import './index.scss';
interface AdminMessageProps {
    className?: string | Array<string>;
    message: AdminMessageType;
}
export default function AdminMessage({ className, message, }: AdminMessageProps): ReactElement | null;
export {};
// ===== ui/Avatar/MutedAvatarOverlay.d.ts =====
import './muted-avatar-overlay.scss';
import { ReactElement } from 'react';
interface Props {
    height?: number;
    width?: number;
}
export default function MutedAvatarOverlay(props: Props): ReactElement;
export {};
// ===== ui/Avatar/index.d.ts =====
import React, { ReactElement } from 'react';
import './index.scss';
interface AvatarInnerProps {
    height: string | number;
    width: string | number;
    src?: string | Array<string>;
    alt?: string;
    customDefaultComponent?({ width, height }: {
        width: number | string;
        height: number | string;
    }): ReactElement;
}
export declare const AvatarInner: ({ src, alt, height, width, customDefaultComponent, }: AvatarInnerProps) => ReactElement;
interface AvatarProps {
    className?: string | Array<string>;
    height?: string | number;
    width?: string | number;
    zIndex?: string | number;
    left?: string;
    bottom?: string;
    src?: string | Array<string>;
    alt?: string;
    onClick?(): void;
    customDefaultComponent?({ width, height }: {
        width: number | string;
        height: number | string;
    }): ReactElement;
}
declare const _default: React.ForwardRefExoticComponent<AvatarProps & React.RefAttributes<HTMLDivElement>>;
export default _default;
// ===== ui/Badge/index.d.ts =====
import { ReactElement } from 'react';
import './index.scss';
export interface BadgeProps {
    count: string | number;
    maxLevel?: number;
    className?: string | Array<string>;
}
export default function Badge({ count, maxLevel, className, }: BadgeProps): ReactElement;
// ===== ui/BottomSheet/index.d.ts =====
import './bottom-sheet.scss';
import React from 'react';
interface BottomSheetProps {
    className?: string;
    children: React.ReactElement;
    onBackdropClick?: () => void;
}
declare const BottomSheet: React.FunctionComponent<BottomSheetProps>;
export default BottomSheet;
// ===== ui/Button/index.d.ts =====
import { ReactElement } from 'react';
import './index.scss';
import { LabelColors } from '../Label';
import { ButtonTypes, ButtonSizes } from './types';
import { ObjectValues } from '../../utils/typeHelpers/objectValues';
import { Typography } from '../Label/types';
export interface ButtonProps {
    className?: string | Array<string>;
    type?: ButtonTypes;
    size?: ButtonSizes;
    children: string | ReactElement;
    disabled?: boolean;
    onClick?: () => void;
    labelType?: ObjectValues<typeof Typography>;
    labelColor?: ObjectValues<typeof LabelColors>;
}
export default function Button({ className, type, size, children, disabled, onClick, labelType, labelColor, }: ButtonProps): ReactElement;
export * from './types';
// ===== ui/Button/types.d.ts =====
export declare enum ButtonTypes {
    PRIMARY = "PRIMARY",
    SECONDARY = "SECONDARY",
    DANGER = "DANGER",
    DISABLED = "DISABLED",
    WARNING = "WARNING"
}
export declare enum ButtonSizes {
    BIG = "BIG",
    SMALL = "SMALL"
}
// ===== ui/ChannelAvatar/OpenChannelAvatar.d.ts =====
/// <reference types="react" />
import type { OpenChannel } from '@sendbird/chat/openChannel';
interface Props {
    channel: OpenChannel;
    theme: string;
    height?: number;
    width?: number;
}
declare function ChannelAvatar({ channel, theme, height, width, }: Props): JSX.Element;
export default ChannelAvatar;
// ===== ui/ChannelAvatar/index.d.ts =====
/// <reference types="react" />
import './index.scss';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
interface Props {
    channel: GroupChannel;
    userId: string;
    theme: string;
    width?: number;
    height?: number;
}
declare function ChannelAvatar({ channel, userId, theme, width, height, }: Props): JSX.Element;
export default ChannelAvatar;
// ===== ui/Checkbox/index.d.ts =====
import { ChangeEvent, ReactElement } from 'react';
import './index.scss';
export interface CheckboxProps {
    id?: string;
    checked?: boolean;
    disabled?: boolean;
    onChange?(e: ChangeEvent<HTMLInputElement>): void;
}
export default function Checkbox({ id, checked, disabled, onChange, }: CheckboxProps): ReactElement;
// ===== ui/ConnectionStatus/index.d.ts =====
import { ReactElement } from 'react';
import './index.scss';
declare function ConnectionStatus(): ReactElement;
export default ConnectionStatus;
// ===== ui/ContextMenu/EmojiListItems.d.ts =====
import { ReactElement, ReactNode, RefObject } from 'react';
import { Nullable } from '../../types';
type SpaceFromTrigger = {
    x: number;
    y: number;
};
export interface EmojiListItemsProps {
    id?: string;
    closeDropdown: () => void;
    children: ReactNode;
    parentRef: RefObject<HTMLDivElement>;
    parentContainRef: RefObject<HTMLDivElement>;
    spaceFromTrigger?: SpaceFromTrigger;
}
export declare const EmojiListItems: ({ id, children, parentRef, parentContainRef, spaceFromTrigger, closeDropdown, }: EmojiListItemsProps) => Nullable<ReactElement>;
export default EmojiListItems;
// ===== ui/ContextMenu/MenuItems.d.ts =====
import React, { ReactElement } from 'react';
interface MenuItemsProps {
    id?: string;
    className?: string;
    testID?: string;
    style?: Record<string, string>;
    openLeft?: boolean;
    children: React.ReactElement | Array<React.ReactElement> | React.ReactNode;
    parentRef?: React.RefObject<HTMLElement>;
    parentContainRef?: React.RefObject<HTMLElement>;
    closeDropdown: () => void;
}
type MenuStyleType = {
    top: number;
    left: number;
};
interface MenuItemsState {
    menuStyle: MenuStyleType;
    handleClickOutside: (e: MouseEvent) => void;
}
export default class MenuItems extends React.Component<MenuItemsProps, MenuItemsState> {
    constructor(props: MenuItemsProps);
    menuRef: React.RefObject<HTMLUListElement>;
    private resizeRafId;
    componentDidMount(): void;
    componentWillUnmount(): void;
    handleResize: () => void;
    setupEvents: () => void;
    cleanUpEvents: () => void;
    getMenuPosition: () => MenuStyleType;
    render(): ReactElement;
}
export {};
// ===== ui/ContextMenu/index.d.ts =====
import React, { ReactElement, MouseEvent, ReactNode } from 'react';
import './index.scss';
import _MenuItems from './MenuItems';
import { MuteMenuItem } from './items/MuteMenuItem';
import { OperatorMenuItem } from './items/OperatorMenuItem';
export declare const MENU_OBSERVING_CLASS_NAME = "sendbird-observing-message-menu";
export declare const getObservingId: (txt: string | number) => string;
export declare const MenuItems: typeof _MenuItems;
export declare const EmojiListItems: ({ id, children, parentRef, parentContainRef, spaceFromTrigger, closeDropdown, }: import("./EmojiListItems").EmojiListItemsProps) => React.ReactElement<any, string | React.JSXElementConstructor<any>>;
/**
 * @deprecated
 * Use the `MessageItemProps` from '@sendbird/uikit-react/ui/MessageMenu' instead
 */
export interface MenuItemProps {
    className?: string | Array<string>;
    children: ReactElement | ReactElement[] | ReactNode;
    onClick?: (e: MouseEvent<HTMLLIElement>) => void;
    disable?: boolean;
    /**
     * @deprecated Please use the testID instead
     */
    dataSbId?: string;
    testID?: string;
}
/**
 * @deprecated
 * Use the `MenuItem` from '@sendbird/uikit-react/ui/MessageMenu' instead
 */
export declare const MenuItem: ({ className, children, onClick, disable, dataSbId, testID, }: MenuItemProps) => React.JSX.Element;
export declare const MENU_ROOT_ID = "sendbird-dropdown-portal";
export declare const MenuRoot: () => ReactElement;
export declare const EMOJI_MENU_ROOT_ID = "sendbird-emoji-list-portal";
export declare const EmojiReactionListRoot: () => ReactElement;
type MenuDisplayingFunc = () => void;
export interface ContextMenuProps {
    menuTrigger?: (func: MenuDisplayingFunc) => ReactElement;
    menuItems: (func: MenuDisplayingFunc) => ReactElement;
    isOpen?: boolean;
    onClick?: (...args: any[]) => void;
}
export default function ContextMenu({ menuTrigger, menuItems, isOpen, onClick, }: ContextMenuProps): ReactElement;
export { MuteMenuItem, OperatorMenuItem, };
// ===== ui/ContextMenu/items/MuteMenuItem.d.ts =====
import { ReactElement, ReactNode } from 'react';
import { BaseChannel, User } from '@sendbird/chat';
export interface MuteMenuItemProps {
    channel: BaseChannel;
    user: User & {
        isMuted: boolean;
    };
    className?: string | Array<string>;
    children: ReactElement | ReactElement[] | ReactNode;
    disable?: boolean;
    /**
     * @deprecated Please use the testID instead
     */
    dataSbId?: string;
    testID?: string;
    onChange?: (channel: BaseChannel, user: User, isMuted: boolean) => void;
    onError?: (reason: any) => void;
}
export declare const MuteMenuItem: ({ channel, user, className, children, disable, dataSbId, testID, onChange, onError, }: MuteMenuItemProps) => ReactElement;
// ===== ui/ContextMenu/items/OperatorMenuItem.d.ts =====
import { ReactElement, ReactNode } from 'react';
import { BaseChannel, User } from '@sendbird/chat';
export interface OperatorMenuItemProps {
    channel: BaseChannel;
    user: User & {
        isMuted: boolean;
    };
    className?: string | Array<string>;
    children: ReactElement | ReactElement[] | ReactNode;
    disable?: boolean;
    /**
     * @deprecated Please use the testID instead
     */
    dataSbId?: string;
    testID?: string;
    onChange?: (channel: BaseChannel, user: User, isOperator: boolean) => void;
    onError?: (reason: any) => void;
}
export declare const OperatorMenuItem: ({ channel, user, className, children, disable, dataSbId, testID, onChange, onError, }: OperatorMenuItemProps) => ReactElement;
// ===== ui/DateSeparator/index.d.ts =====
import { ReactElement } from 'react';
import './index.scss';
import { Colors } from '../../utils/color';
export interface DateSeparatorProps {
    children?: string | ReactElement;
    className?: string | Array<string>;
    separatorColor?: Colors;
}
declare const DateSeparator: ({ children, className, separatorColor, }: DateSeparatorProps) => ReactElement;
export default DateSeparator;
// ===== ui/EmojiReactions/index.d.ts =====
import './index.scss';
import { ReactElement } from 'react';
import type { EmojiCategory, EmojiContainer, User } from '@sendbird/chat';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import { Nullable, SpaceFromTriggerType } from '../../types';
import { SendableMessageType } from '../../utils';
export interface EmojiReactionsProps {
    className?: string | Array<string>;
    userId: string;
    message: SendableMessageType;
    channel: Nullable<GroupChannel>;
    emojiContainer: EmojiContainer;
    memberNicknamesMap: Map<string, string>;
    spaceFromTrigger?: SpaceFromTriggerType;
    isByMe?: boolean;
    toggleReaction?: (message: SendableMessageType, key: string, byMe: boolean) => void;
    onPressUserProfile?: (member: User) => void;
    filterEmojiCategoryIds?: (message: SendableMessageType) => EmojiCategory['id'][];
}
declare const EmojiReactions: ({ className, userId, message, channel, emojiContainer, memberNicknamesMap, spaceFromTrigger, isByMe, toggleReaction, onPressUserProfile, filterEmojiCategoryIds, }: EmojiReactionsProps) => ReactElement;
export default EmojiReactions;
// ===== ui/FeedbackIconButton/index.d.ts =====
import React, { MouseEvent, ReactNode } from 'react';
import './index.scss';
export interface FeedbackIconButtonProps {
    children: ReactNode;
    isSelected: boolean;
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
}
declare const FeedbackIconButton: React.ForwardRefExoticComponent<FeedbackIconButtonProps & React.RefAttributes<HTMLButtonElement>>;
export default FeedbackIconButton;
// ===== ui/FileMessageItemBody/index.d.ts =====
import './index.scss';
import { ReactElement } from 'react';
import type { FileMessage } from '@sendbird/chat/message';
import type { OnBeforeDownloadFileMessageType } from '../../modules/GroupChannel/context/types';
interface Props {
    className?: string | Array<string>;
    message: FileMessage;
    isByMe?: boolean;
    mouseHover?: boolean;
    isReactionEnabled?: boolean;
    truncateLimit?: number;
    onBeforeDownloadFileMessage?: OnBeforeDownloadFileMessageType;
}
export default function FileMessageItemBody({ className, message, isByMe, mouseHover, isReactionEnabled, truncateLimit, onBeforeDownloadFileMessage, }: Props): ReactElement;
export {};
// ===== ui/FileViewer/index.d.ts =====
import './index.scss';
import { FileMessage, MultipleFilesMessage } from '@sendbird/chat/message';
import { MouseEvent, ReactElement } from 'react';
import { FileViewerComponentProps } from './types';
import { UploadedFileInfoWithUpload } from '../../types';
export declare const FileViewerComponent: (props: FileViewerComponentProps) => ReactElement;
export interface FileViewerProps {
    message?: FileMessage | MultipleFilesMessage;
    statefulFileInfoList?: UploadedFileInfoWithUpload[];
    isByMe?: boolean;
    currentIndex?: number;
    onClose: (e: MouseEvent) => void;
    onDelete?: (e: MouseEvent) => void;
    onClickLeft?: () => void;
    onClickRight?: () => void;
    onDownloadClick?: (e: MouseEvent) => Promise<void>;
}
export default function FileViewer({ message, statefulFileInfoList, onClose, isByMe, onDelete, currentIndex, onClickLeft, onClickRight, onDownloadClick, }: FileViewerProps): ReactElement;
// ===== ui/FileViewer/types.d.ts =====
import { MouseEvent } from 'react';
export declare const ViewerTypes: {
    readonly SINGLE: "SINGLE";
    readonly MULTI: "MULTI";
};
export type ViewerType = keyof typeof ViewerTypes;
export interface SenderInfo {
    profileUrl: string;
    nickname: string;
}
export interface FileInfo {
    name: string;
    type: string;
    url: string;
}
export interface BaseViewer {
    onClose: (e: React.MouseEvent | React.KeyboardEvent) => void;
}
export interface SingleFileViewer extends SenderInfo, FileInfo, BaseViewer {
    viewerType?: typeof ViewerTypes.SINGLE;
    isByMe?: boolean;
    disableDelete?: boolean;
    onDelete: (e: MouseEvent) => void;
    onDownloadClick?: (e: MouseEvent) => Promise<void>;
}
export interface MultiFilesViewer extends SenderInfo, BaseViewer {
    viewerType: typeof ViewerTypes.MULTI;
    fileInfoList: FileInfo[];
    currentIndex: number;
    onClickLeft: () => void;
    onClickRight: () => void;
    onDownloadClick?: (e: MouseEvent) => Promise<void>;
}
export type FileViewerComponentProps = SingleFileViewer | MultiFilesViewer;
// ===== ui/Header/index.d.ts =====
import React from 'react';
import type { MouseEvent, KeyboardEvent, TouchEvent, ReactNode, ReactElement } from 'react';
import './index.scss';
import type { Types as IconTypes } from '../Icon/type';
import type { Colors as IconColors } from '../Icon/colors';
export interface HeaderCustomProps {
    renderLeft?: () => ReactNode;
    renderRight?: () => ReactNode;
    renderMiddle?: () => ReactNode;
}
export interface HeaderProps extends HeaderCustomProps {
    className?: string;
}
export declare const Header: ({ className, renderLeft, renderRight, renderMiddle, }: HeaderProps) => React.JSX.Element;
export interface HeaderTitleProps {
    title?: string;
    subtitle?: string;
    onClickSubtitle?: (e: MouseEvent | TouchEvent | KeyboardEvent) => void;
}
export declare const Title: ({ title, subtitle, onClickSubtitle, }: HeaderTitleProps) => React.JSX.Element;
export interface HeaderIconButtonProps {
    className?: string;
    onClick?: (e: MouseEvent) => void;
    type: IconTypes;
    color?: IconColors;
    width?: string;
    height?: string;
    renderIcon?: (props: HeaderIconProps) => ReactElement;
}
export declare const IconButton: ({ className, onClick, type, color, width, height, renderIcon, }: HeaderIconButtonProps) => React.JSX.Element;
export interface HeaderIconProps {
    className?: string;
    type: IconTypes;
    color?: IconColors;
    width?: string;
    height?: string;
    onClick?: (e: MouseEvent) => void;
}
export declare const Icon: ({ className, type, color, width, height, onClick, }: HeaderIconProps) => React.JSX.Element;
declare const _default: (({ className, renderLeft, renderRight, renderMiddle, }: HeaderProps) => React.JSX.Element) & {
    Title: ({ title, subtitle, onClickSubtitle, }: HeaderTitleProps) => React.JSX.Element;
    IconButton: ({ className, onClick, type, color, width, height, renderIcon, }: HeaderIconButtonProps) => React.JSX.Element;
    Icon: ({ className, type, color, width, height, onClick, }: HeaderIconProps) => React.JSX.Element;
};
export default _default;
// ===== ui/Icon/colors.d.ts =====
export declare const Colors: {
    readonly DEFAULT: "DEFAULT";
    readonly PRIMARY: "PRIMARY";
    readonly PRIMARY_2: "PRIMARY_2";
    readonly SECONDARY: "SECONDARY";
    readonly SECONDARY_2: "SECONDARY_2";
    readonly CONTENT: "CONTENT";
    readonly CONTENT_INVERSE: "CONTENT_INVERSE";
    readonly CONTENT_INVERSE_3: "CONTENT_INVERSE_3";
    readonly WHITE: "WHITE";
    readonly GRAY: "GRAY";
    readonly THUMBNAIL_ICON: "THUMBNAIL_ICON";
    readonly SENT: "SENT";
    readonly READ: "READ";
    readonly ON_BACKGROUND_1: "ON_BACKGROUND_1";
    readonly ON_BACKGROUND_2: "ON_BACKGROUND_2";
    readonly ON_BACKGROUND_3: "ON_BACKGROUND_3";
    readonly ON_BACKGROUND_4: "ON_BACKGROUND_4";
    readonly BACKGROUND_3: "BACKGROUND_3";
    readonly ERROR: "ERROR";
};
export type Colors = typeof Colors[keyof typeof Colors];
declare const _default: {
    Colors: {
        readonly DEFAULT: "DEFAULT";
        readonly PRIMARY: "PRIMARY";
        readonly PRIMARY_2: "PRIMARY_2";
        readonly SECONDARY: "SECONDARY";
        readonly SECONDARY_2: "SECONDARY_2";
        readonly CONTENT: "CONTENT";
        readonly CONTENT_INVERSE: "CONTENT_INVERSE";
        readonly CONTENT_INVERSE_3: "CONTENT_INVERSE_3";
        readonly WHITE: "WHITE";
        readonly GRAY: "GRAY";
        readonly THUMBNAIL_ICON: "THUMBNAIL_ICON";
        readonly SENT: "SENT";
        readonly READ: "READ";
        readonly ON_BACKGROUND_1: "ON_BACKGROUND_1";
        readonly ON_BACKGROUND_2: "ON_BACKGROUND_2";
        readonly ON_BACKGROUND_3: "ON_BACKGROUND_3";
        readonly ON_BACKGROUND_4: "ON_BACKGROUND_4";
        readonly BACKGROUND_3: "BACKGROUND_3";
        readonly ERROR: "ERROR";
    };
};
export default _default;
// ===== ui/Icon/index.d.ts =====
import React from 'react';
import './index.scss';
import { Types } from './type';
import { Colors } from './colors';
export interface IconProps {
    className?: string | string[];
    /** Type: Use strings from below list */
    type: Types;
    /** Type: Use Colors from below list */
    fillColor?: Colors;
    width?: string | number;
    height?: string | number;
    onClick?: React.MouseEventHandler<HTMLDivElement> & React.KeyboardEventHandler<HTMLDivElement>;
    children?: React.ReactNode;
    testID?: string;
}
export default function Icon({ className, type, fillColor, width, height, onClick, children, testID, }: IconProps): React.JSX.Element;
export declare const IconTypes: {
    readonly ADD: "ADD";
    readonly ARROW_LEFT: "ARROW_LEFT";
    readonly ATTACH: "ATTACH";
    readonly AUDIO_ON_LINED: "AUDIO_ON_LINED";
    readonly BAN: "BAN";
    readonly BROADCAST: "BROADCAST";
    readonly CAMERA: "CAMERA";
    readonly CHANNELS: "CHANNELS";
    readonly CHAT: "CHAT";
    readonly CHAT_FILLED: "CHAT_FILLED";
    readonly CHEVRON_DOWN: "CHEVRON_DOWN";
    readonly CHEVRON_RIGHT: "CHEVRON_RIGHT";
    readonly CLOSE: "CLOSE";
    readonly COLLAPSE: "COLLAPSE";
    readonly COPY: "COPY";
    readonly CREATE: "CREATE";
    readonly DELETE: "DELETE";
    readonly DISCONNECTED: "DISCONNECTED";
    readonly DOCUMENT: "DOCUMENT";
    readonly DONE: "DONE";
    readonly DONE_ALL: "DONE_ALL";
    readonly DOWNLOAD: "DOWNLOAD";
    readonly EDIT: "EDIT";
    readonly EMOJI_MORE: "EMOJI_MORE";
    readonly ERROR: "ERROR";
    readonly EXPAND: "EXPAND";
    readonly FILE_AUDIO: "FILE_AUDIO";
    readonly FILE_DOCUMENT: "FILE_DOCUMENT";
    readonly FREEZE: "FREEZE";
    readonly GIF: "GIF";
    readonly INFO: "INFO";
    readonly LEAVE: "LEAVE";
    readonly MARK_AS_UNREAD: "MARK_AS_UNREAD";
    readonly MEMBERS: "MEMBERS";
    readonly MESSAGE: "MESSAGE";
    readonly MODERATIONS: "MODERATIONS";
    readonly MORE: "MORE";
    readonly MUTE: "MUTE";
    readonly NOTIFICATIONS: "NOTIFICATIONS";
    readonly NOTIFICATIONS_OFF_FILLED: "NOTIFICATIONS_OFF_FILLED";
    readonly OPERATOR: "OPERATOR";
    readonly PHOTO: "PHOTO";
    readonly PLAY: "PLAY";
    readonly PLUS: "PLUS";
    readonly QUESTION: "QUESTION";
    readonly REFRESH: "REFRESH";
    readonly REPLY: "REPLY";
    readonly REMOVE: "REMOVE";
    readonly SEARCH: "SEARCH";
    readonly SEND: "SEND";
    readonly SETTINGS_FILLED: "SETTINGS_FILLED";
    readonly SLIDE_LEFT: "SLIDE_LEFT";
    readonly SPINNER: "SPINNER";
    readonly SUPERGROUP: "SUPERGROUP";
    readonly THREAD: "THREAD";
    readonly THUMBNAIL_NONE: "THUMBNAIL_NONE";
    readonly TOGGLE_OFF: "TOGGLE_OFF";
    readonly TOGGLE_ON: "TOGGLE_ON";
    readonly USER: "USER";
    readonly FEEDBACK_LIKE: "FEEDBACK_LIKE";
    readonly FEEDBACK_DISLIKE: "FEEDBACK_DISLIKE";
    readonly FLOATING_BUTTON_CLOSE: "FLOATING_BUTTON_CLOSE";
};
export declare const IconColors: {
    readonly DEFAULT: "DEFAULT";
    readonly PRIMARY: "PRIMARY";
    readonly PRIMARY_2: "PRIMARY_2";
    readonly SECONDARY: "SECONDARY";
    readonly SECONDARY_2: "SECONDARY_2";
    readonly CONTENT: "CONTENT";
    readonly CONTENT_INVERSE: "CONTENT_INVERSE";
    readonly CONTENT_INVERSE_3: "CONTENT_INVERSE_3";
    readonly WHITE: "WHITE";
    readonly GRAY: "GRAY";
    readonly THUMBNAIL_ICON: "THUMBNAIL_ICON";
    readonly SENT: "SENT";
    readonly READ: "READ";
    readonly ON_BACKGROUND_1: "ON_BACKGROUND_1";
    readonly ON_BACKGROUND_2: "ON_BACKGROUND_2";
    readonly ON_BACKGROUND_3: "ON_BACKGROUND_3";
    readonly ON_BACKGROUND_4: "ON_BACKGROUND_4";
    readonly BACKGROUND_3: "BACKGROUND_3";
    readonly ERROR: "ERROR";
};
// ===== ui/Icon/type.d.ts =====
export declare const Types: {
    readonly ADD: "ADD";
    readonly ARROW_LEFT: "ARROW_LEFT";
    readonly ATTACH: "ATTACH";
    readonly AUDIO_ON_LINED: "AUDIO_ON_LINED";
    readonly BAN: "BAN";
    readonly BROADCAST: "BROADCAST";
    readonly CAMERA: "CAMERA";
    readonly CHANNELS: "CHANNELS";
    readonly CHAT: "CHAT";
    readonly CHAT_FILLED: "CHAT_FILLED";
    readonly CHEVRON_DOWN: "CHEVRON_DOWN";
    readonly CHEVRON_RIGHT: "CHEVRON_RIGHT";
    readonly CLOSE: "CLOSE";
    readonly COLLAPSE: "COLLAPSE";
    readonly COPY: "COPY";
    readonly CREATE: "CREATE";
    readonly DELETE: "DELETE";
    readonly DISCONNECTED: "DISCONNECTED";
    readonly DOCUMENT: "DOCUMENT";
    readonly DONE: "DONE";
    readonly DONE_ALL: "DONE_ALL";
    readonly DOWNLOAD: "DOWNLOAD";
    readonly EDIT: "EDIT";
    readonly EMOJI_MORE: "EMOJI_MORE";
    readonly ERROR: "ERROR";
    readonly EXPAND: "EXPAND";
    readonly FILE_AUDIO: "FILE_AUDIO";
    readonly FILE_DOCUMENT: "FILE_DOCUMENT";
    readonly FREEZE: "FREEZE";
    readonly GIF: "GIF";
    readonly INFO: "INFO";
    readonly LEAVE: "LEAVE";
    readonly MARK_AS_UNREAD: "MARK_AS_UNREAD";
    readonly MEMBERS: "MEMBERS";
    readonly MESSAGE: "MESSAGE";
    readonly MODERATIONS: "MODERATIONS";
    readonly MORE: "MORE";
    readonly MUTE: "MUTE";
    readonly NOTIFICATIONS: "NOTIFICATIONS";
    readonly NOTIFICATIONS_OFF_FILLED: "NOTIFICATIONS_OFF_FILLED";
    readonly OPERATOR: "OPERATOR";
    readonly PHOTO: "PHOTO";
    readonly PLAY: "PLAY";
    readonly PLUS: "PLUS";
    readonly QUESTION: "QUESTION";
    readonly REFRESH: "REFRESH";
    readonly REPLY: "REPLY";
    readonly REMOVE: "REMOVE";
    readonly SEARCH: "SEARCH";
    readonly SEND: "SEND";
    readonly SETTINGS_FILLED: "SETTINGS_FILLED";
    readonly SLIDE_LEFT: "SLIDE_LEFT";
    readonly SPINNER: "SPINNER";
    readonly SUPERGROUP: "SUPERGROUP";
    readonly THREAD: "THREAD";
    readonly THUMBNAIL_NONE: "THUMBNAIL_NONE";
    readonly TOGGLE_OFF: "TOGGLE_OFF";
    readonly TOGGLE_ON: "TOGGLE_ON";
    readonly USER: "USER";
    readonly FEEDBACK_LIKE: "FEEDBACK_LIKE";
    readonly FEEDBACK_DISLIKE: "FEEDBACK_DISLIKE";
    readonly FLOATING_BUTTON_CLOSE: "FLOATING_BUTTON_CLOSE";
};
export type Types = typeof Types[keyof typeof Types];
// ===== ui/IconButton/index.d.ts =====
import React, { FocusEvent, MouseEvent, ReactNode } from 'react';
import './index.scss';
export interface IconButtonProps {
    className?: string | Array<string>;
    children: ReactNode;
    disabled?: boolean;
    width?: string;
    height?: string;
    type?: 'button' | 'submit' | 'reset';
    style?: {
        [key: string]: string;
    };
    onBlur?: (e: FocusEvent<HTMLButtonElement>) => void;
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    testID?: string;
}
declare const IconButton: React.ForwardRefExoticComponent<IconButtonProps & React.RefAttributes<HTMLButtonElement>>;
export default IconButton;
// ===== ui/ImageRenderer/index.d.ts =====
import { ReactElement } from 'react';
import './index.scss';
export declare function getBorderRadiusForImageRenderer(circle?: boolean, borderRadius?: string | number | null): string | undefined;
export declare function getBorderRadiusForMultipleImageRenderer(borderRadius: string | number, index: number, totalCount: number): string;
export interface ImageRendererProps {
    className?: string | Array<string>;
    url: string;
    alt?: string;
    width?: string | number | null;
    maxSideLength?: string | null;
    height?: string | number | null;
    circle?: boolean;
    fixedSize?: boolean;
    placeHolder?: ((props: {
        style: Record<string, string | number>;
    }) => ReactElement) | ReactElement | null;
    defaultComponent?: (() => ReactElement) | ReactElement | null;
    borderRadius?: string | number | null;
    onLoad?: () => void;
    onError?: () => void;
    shadeOnHover?: boolean;
    isUploaded?: boolean;
}
declare const ImageRenderer: ({ className, url, alt, width, maxSideLength, height, circle, fixedSize, placeHolder, defaultComponent, borderRadius, onLoad, onError, shadeOnHover, isUploaded, }: ImageRendererProps) => ReactElement;
export default ImageRenderer;
// ===== ui/Input/index.d.ts =====
import React, { ReactElement, ReactNode } from 'react';
import './index.scss';
export interface InputLabelProps {
    children: ReactNode;
}
export declare const InputLabel: ({ children }: InputLabelProps) => ReactElement;
export interface InputProps {
    name: string;
    required?: boolean;
    disabled?: boolean;
    value?: string;
    placeHolder?: string;
    autoFocus?: boolean;
}
declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
export default Input;
// ===== ui/Label/index.d.ts =====
import React from 'react';
import './index.scss';
import { Typography, Colors } from './types';
import { ObjectValues } from '../../utils/typeHelpers/objectValues';
export type LabelProps = {
    className?: string | string[];
    type?: ObjectValues<typeof Typography>;
    color?: ObjectValues<typeof Colors>;
    children?: React.ReactNode;
    testID?: string;
};
export declare const Label: React.ForwardRefExoticComponent<LabelProps & React.RefAttributes<HTMLDivElement>>;
declare const LabelTypography: {
    readonly H_1: "H_1";
    readonly H_2: "H_2";
    readonly SUBTITLE_1: "SUBTITLE_1";
    readonly SUBTITLE_2: "SUBTITLE_2";
    readonly BODY_1: "BODY_1";
    readonly BODY_2: "BODY_2";
    readonly BUTTON_1: "BUTTON_1";
    readonly BUTTON_2: "BUTTON_2";
    readonly BUTTON_3: "BUTTON_3";
    readonly CAPTION_1: "CAPTION_1";
    readonly CAPTION_2: "CAPTION_2";
    readonly CAPTION_3: "CAPTION_3";
};
declare const LabelColors: {
    readonly ONBACKGROUND_1: "ONBACKGROUND_1";
    readonly ONBACKGROUND_2: "ONBACKGROUND_2";
    readonly ONBACKGROUND_3: "ONBACKGROUND_3";
    readonly ONBACKGROUND_4: "ONBACKGROUND_4";
    readonly ONCONTENT_1: "ONCONTENT_1";
    readonly ONCONTENT_2: "ONCONTENT_2";
    readonly ONCONTENT_3: "ONCONTENT_3";
    readonly ONCONTENT_INVERSE_1: "ONCONTENT_INVERSE_1";
    readonly ONCONTENT_INVERSE_3: "ONCONTENT_INVERSE_3";
    readonly PRIMARY: "PRIMARY";
    readonly ERROR: "ERROR";
    readonly SECONDARY_3: "SECONDARY_3";
};
declare const LabelStringSet: import("./stringSet").StringSet;
export { LabelTypography, LabelColors, LabelStringSet };
export default Label;
// ===== ui/Label/stringSet.d.ts =====
/**
 * NOTE:
 * Do not forget to update the string set table on Docs
 * When you update this string set
 *
 * `%d` will be replaced by a proper number
 */
export type StringSet = Record<keyof typeof stringSet['en'], string>;
declare const stringSet: {
    en: {
        MESSAGE_STATUS__YESTERDAY: string;
        CHANNEL__MESSAGE_LIST__NOTIFICATION__NEW_MESSAGE: string;
        CHANNEL__MESSAGE_LIST__NOTIFICATION__NEW_MESSAGE_S: string;
        CHANNEL__MESSAGE_LIST__NOTIFICATION__UNREAD_MESSAGE: string;
        CHANNEL__MESSAGE_LIST__NOTIFICATION__UNREAD_MESSAGE_S: string;
        /** @deprecated Please use `DATE_FORMAT__MESSAGE_LIST__NOTIFICATION__UNREAD_SINCE` instead * */
        CHANNEL__MESSAGE_LIST__NOTIFICATION__ON: string;
        CHANNEL_PREVIEW_MOBILE_LEAVE: string;
        CHANNEL_SETTING__HEADER__TITLE: string;
        CHANNEL_SETTING__PROFILE__EDIT: string;
        CHANNEL_SETTING__MEMBERS__TITLE: string;
        CHANNEL_SETTING__MEMBERS__SEE_ALL_MEMBERS: string;
        CHANNEL_SETTING__MEMBERS__INVITE_MEMBER: string;
        CHANNEL_SETTING__MEMBERS__YOU: string;
        CHANNEL_SETTING__MEMBERS__SELECT_TITLE: string;
        CHANNEL_SETTING__MEMBERS__OPERATOR: string;
        CHANNEL_SETTING__LEAVE_CHANNEL__TITLE: string;
        CHANNEL_SETTING__OPERATORS__TITLE: string;
        CHANNEL_SETTING__OPERATORS__TITLE_ALL: string;
        CHANNEL_SETTING__OPERATORS__TITLE_ADD: string;
        CHANNEL_SETTING__OPERATORS__ADD_BUTTON: string;
        CHANNEL_SETTING__MUTED_MEMBERS__TITLE: string;
        CHANNEL_SETTING__MUTED_MEMBERS__TITLE_ALL: string;
        CHANNEL_SETTING__NO_UNMUTED: string;
        CHANNEL_SETTING__BANNED_MEMBERS__TITLE: string;
        CHANNEL_SETTING__FREEZE_CHANNEL: string;
        CHANNEL_SETTING__MODERATION__REGISTER_AS_OPERATOR: string;
        CHANNEL_SETTING__MODERATION__UNREGISTER_OPERATOR: string;
        CHANNEL_SETTING__MODERATION__MUTE: string;
        CHANNEL_SETTING__MODERATION__UNMUTE: string;
        CHANNEL_SETTING__MODERATION__BAN: string;
        CHANNEL_SETTING__MODERATION__UNBAN: string;
        CHANNEL_SETTING__MODERATION__EMPTY_BAN: string;
        CHANNEL_SETTING__MODERATION__ALL_BAN: string;
        OPEN_CHANNEL_CONVERSATION__TITLE_PARTICIPANTS: string;
        OPEN_CHANNEL_CONVERSATION__SELECT_PARTICIPANTS: string;
        OPEN_CHANNEL_LIST__TITLE: string;
        CREATE_OPEN_CHANNEL_LIST__TITLE: string;
        CREATE_OPEN_CHANNEL_LIST__SUBTITLE__IMG_SECTION: string;
        CREATE_OPEN_CHANNEL_LIST__SUBTITLE__IMG_UPLOAD: string;
        CREATE_OPEN_CHANNEL_LIST__SUBTITLE__TEXT_SECTION: string;
        CREATE_OPEN_CHANNEL_LIST__SUBTITLE__TEXT_PLACE_HOLDER: string;
        CREATE_OPEN_CHANNEL_LIST__SUBMIT: string;
        OPEN_CHANNEL_SETTINGS__OPERATOR_TITLE: string;
        OPEN_CHANNEL_SETTINGS__OPERATOR_URL: string;
        OPEN_CHANNEL_SETTINGS__PARTICIPANTS_ACCORDION_TITLE: string;
        OPEN_CHANNEL_SETTINGS__DELETE_CHANNEL_PANEL: string;
        OPEN_CHANNEL_SETTINGS__DELETE_CHANNEL_TITLE: string;
        OPEN_CHANNEL_SETTINGS__DELETE_CHANNEL_CONTEXT: string;
        OPEN_CHANNEL_SETTINGS__DELETE_CHANNEL_SUBMIT: string;
        OPEN_CHANNEL_SETTINGS__OPERATORS_TITLE: string;
        OPEN_CHANNEL_SETTINGS__OPERATORS__TITLE_ADD: string;
        OPEN_CHANNEL_SETTINGS__OPERATORS__TITLE_ALL: string;
        OPEN_CHANNEL_SETTINGS__MUTED_MEMBERS__TITLE: string;
        OPEN_CHANNEL_SETTINGS__MUTED_MEMBERS__TITLE_ALL: string;
        OPEN_CHANNEL_SETTINGS__MUTED_MEMBERS__NO_ONE: string;
        OPEN_CHANNEL_SETTINGS__BANNED_MEMBERS__TITLE: string;
        OPEN_CHANNEL_SETTINGS__BANNED_MEMBERS__TITLE_ALL: string;
        OPEN_CHANNEL_SETTINGS__BANNED_MEMBERS__NO_ONE: string;
        OPEN_CHANNEL_SETTINGS__MEMBERS__YOU: string;
        OPEN_CHANNEL_SETTINGS__MEMBERS__OPERATOR: string;
        OPEN_CHANNEL_SETTINGS__PARTICIPANTS_TITLE: string;
        OPEN_CHANNEL_SETTINGS__EMPTY_LIST: string;
        OPEN_CHANNEL_SETTINGS__SEE_ALL: string;
        OPEN_CHANNEL_SETTINGS__ALL_PARTICIPANTS_TITLE: string;
        OPEN_CHANNEL_SETTINGS__NO_TITLE: string;
        OPEN_CHANNEL_SETTING__MODERATION__REGISTER_AS_OPERATOR: string;
        OPEN_CHANNEL_SETTING__MODERATION__UNREGISTER_OPERATOR: string;
        OPEN_CHANNEL_SETTING__MODERATION__MUTE: string;
        OPEN_CHANNEL_SETTING__MODERATION__UNMUTE: string;
        OPEN_CHANNEL_SETTING__MODERATION__BAN: string;
        OPEN_CHANNEL_SETTING__MODERATION__UNBAN: string;
        TRYING_TO_CONNECT: string;
        TYPING_INDICATOR__IS_TYPING: string;
        TYPING_INDICATOR__AND: string;
        TYPING_INDICATOR__ARE_TYPING: string;
        TYPING_INDICATOR__MULTIPLE_TYPING: string;
        CHANNEL_FROZEN: string;
        PLACE_HOLDER__NO_CHANNEL: string;
        PLACE_HOLDER__WRONG: string;
        PLACE_HOLDER__RETRY_TO_CONNECT: string;
        PLACE_HOLDER__NO_MESSAGES: string;
        TOOLTIP__AND_YOU: string;
        TOOLTIP__YOU: string;
        TOOLTIP__UNKNOWN_USER: string;
        UNKNOWN__UNKNOWN_MESSAGE_TYPE: string;
        UNKNOWN__CANNOT_READ_MESSAGE: string;
        UNKNOWN__TEMPLATE_ERROR: string;
        FORM_VERSION_ERROR: string;
        UNKNOWN__CANNOT_READ_TEMPLATE: string;
        MESSAGE_EDITED: string;
        MODAL__DELETE_MESSAGE__TITLE: string;
        MODAL__CHANNEL_INFORMATION__TITLE: string;
        MODAL__CHANNEL_INFORMATION__CHANNEL_IMAGE: string;
        MODAL__CHANNEL_INFORMATION__UPLOAD: string;
        MODAL__CHANNEL_INFORMATION__CHANNEL_NAME: string;
        MODAL__CHANNEL_INFORMATION__INPUT__PLACE_HOLDER: string;
        MODAL__INVITE_MEMBER__TITLE: string;
        MODAL__INVITE_MEMBER__SELECTED: string;
        MODAL__CHOOSE_CHANNEL_TYPE__TITLE: string;
        MODAL__CHOOSE_CHANNEL_TYPE__GROUP: string;
        MODAL__CHOOSE_CHANNEL_TYPE__SUPER_GROUP: string;
        MODAL__CHOOSE_CHANNEL_TYPE__BROADCAST: string;
        MODAL__CREATE_CHANNEL__TITLE: string;
        MODAL__CREATE_CHANNEL__GROUP: string;
        MODAL__CREATE_CHANNEL__SUPER: string;
        MODAL__CREATE_CHANNEL__BROADCAST: string;
        MODAL__CREATE_CHANNEL__SELECTED: string;
        MODAL__LEAVE_CHANNEL__TITLE: string;
        MODAL__LEAVE_CHANNEL__FOOTER: string;
        MODAL__VOICE_MESSAGE_INPUT_DISABLED__TITLE_MUTED: string;
        MODAL__VOICE_MESSAGE_INPUT_DISABLED__TITLE_FROZEN: string;
        USER_PROFILE__MESSAGE: string;
        USER_PROFILE__USER_ID: string;
        EDIT_PROFILE__TITLE: string;
        EDIT_PROFILE__IMAGE_LABEL: string;
        EDIT_PROFILE__IMAGE_UPLOAD: string;
        EDIT_PROFILE__NICKNAME_LABEL: string;
        EDIT_PROFILE__NICKNAME_PLACEHOLDER: string;
        EDIT_PROFILE__USERID_LABEL: string;
        EDIT_PROFILE__THEME_LABEL: string;
        MESSAGE_INPUT__PLACE_HOLDER: string;
        MESSAGE_INPUT__PLACE_HOLDER__DISABLED: string;
        MESSAGE_INPUT__PLACE_HOLDER__SUGGESTED_REPLIES: string;
        MESSAGE_INPUT__PLACE_HOLDER__MESSAGE_FORM: string;
        MESSAGE_INPUT__PLACE_HOLDER__FROZEN: string;
        MESSAGE_INPUT__PLACE_HOLDER__MUTED: string;
        MESSAGE_INPUT__PLACE_HOLDER__MUTED_SHORT: string;
        MESSAGE_INPUT__QUOTE_REPLY__PLACE_HOLDER: string;
        MESSAGE_INPUT__PLACE_HOLDER__FILE_ATTACHED: string;
        MESSAGE_INPUT__PENDING_FILE__TYPE_UNKNOWN: string;
        MESSAGE_INPUT__PENDING_FILE__REMOVE: string;
        BUTTON__SUBMIT: string;
        BUTTON__CANCEL: string;
        BUTTON__DELETE: string;
        BUTTON__SAVE: string;
        BUTTON__CREATE: string;
        BUTTON__INVITE: string;
        BUTTON__OK: string;
        BADGE__OVER: string;
        NO_TITLE: string;
        NO_NAME: string;
        NO_MEMBERS: string;
        LABEL__OPERATOR: string;
        MESSAGE_MENU__COPY: string;
        MESSAGE_MENU__REPLY: string;
        MESSAGE_MENU__THREAD: string;
        MESSAGE_MENU__OPEN_IN_CHANNEL: string;
        MESSAGE_MENU__EDIT: string;
        MESSAGE_MENU__RESEND: string;
        MESSAGE_MENU__DELETE: string;
        MESSAGE_MENU__SAVE: string;
        MESSAGE_MENU__MARK_AS_UNREAD: string;
        CONTEXT_MENU_DROPDOWN__COPY: string;
        CONTEXT_MENU_DROPDOWN__EDIT: string;
        CONTEXT_MENU_DROPDOWN__RESEND: string;
        CONTEXT_MENU_DROPDOWN__DELETE: string;
        CONTEXT_MENU_DROPDOWN__SAVE: string;
        SEARCH: string;
        SEARCH_IN_CHANNEL: string;
        SEARCH_IN: string;
        SEARCHING: string;
        NO_SEARCHED_MESSAGE: string;
        QUOTE_MESSAGE_INPUT__REPLY_TO: string;
        QUOTE_MESSAGE_INPUT__FILE_TYPE_IMAGE: string;
        QUOTE_MESSAGE_INPUT__FILE_TYPE_GIF: string;
        QUOTE_MESSAGE_INPUT__FILE_TYPE__VIDEO: string;
        QUOTED_MESSAGE__REPLIED_TO: string;
        QUOTED_MESSAGE__CURRENT_USER: string;
        QUOTED_MESSAGE__UNAVAILABLE: string;
        THREAD__HEADER_TITLE: string;
        CHANNEL__THREAD_REPLY: string;
        CHANNEL__THREAD_REPLIES: string;
        CHANNEL__THREAD_OVER_MAX: string;
        THREAD__THREAD_REPLY: string;
        THREAD__THREAD_REPLIES: string;
        THREAD__INPUT__REPLY_TO_THREAD: string;
        THREAD__INPUT__REPLY_IN_THREAD: string;
        MENTION_NAME__NO_NAME: string;
        MENTION_COUNT__OVER_LIMIT: string;
        UI__FILE_VIEWER__UNSUPPORT: string;
        VOICE_RECORDING_PERMISSION_DENIED: string;
        VOICE_MESSAGE: string;
        CHANNEL_PREVIEW_LAST_MESSAGE_FILE_TYPE_GIF: string;
        CHANNEL_PREVIEW_LAST_MESSAGE_FILE_TYPE_PHOTO: string;
        CHANNEL_PREVIEW_LAST_MESSAGE_FILE_TYPE_VIDEO: string;
        CHANNEL_PREVIEW_LAST_MESSAGE_FILE_TYPE_AUDIO: string;
        CHANNEL_PREVIEW_LAST_MESSAGE_FILE_TYPE_VOICE_MESSAGE: string;
        CHANNEL_PREVIEW_LAST_MESSAGE_FILE_TYPE_GENERAL: string;
        CHANNEL_PREVIEW_LAST_MESSAGE_TEMPLATE_MESSAGE: string;
        DATE_FORMAT__MESSAGE_LIST__NOTIFICATION__UNREAD_SINCE: string;
        DATE_FORMAT__MESSAGE_LIST__DATE_SEPARATOR: string;
        DATE_FORMAT__THREAD_LIST__DATE_SEPARATOR: string;
        DATE_FORMAT__MESSAGE_CREATED_AT: string;
        DATE_FORMAT__UNREAD_SINCE: string;
        DATE_FORMAT__LAST_MESSAGE_CREATED_AT__TODAY: string;
        DATE_FORMAT__LAST_MESSAGE_CREATED_AT__THIS_YEAR: string;
        DATE_FORMAT__LAST_MESSAGE_CREATED_AT__PREVIOUS_YEAR: string;
        FILE_UPLOAD_NOTIFICATION__COUNT_LIMIT: string;
        FILE_UPLOAD_NOTIFICATION__SIZE_LIMIT: string;
        FILE_UPLOAD_NOTIFICATION__UNSUPPORTED_FILE_TYPE: string;
        FEEDBACK_LIKE: string;
        FEEDBACK_DISLIKE: string;
        EDIT_COMMENT: string;
        REMOVE_FEEDBACK: string;
        FEEDBACK_MODAL_TITLE: string;
        FEEDBACK_CONTENT_PLACEHOLDER: string;
        BUTTON__REMOVE_FEEDBACK: string;
        FEEDBACK_FAILED_SUBMIT: string;
        FEEDBACK_FAILED_SAVE: string;
        FEEDBACK_FAILED_DELETE: string;
        FORM_ITEM_REQUIRED: string;
        FORM_ITEM_INVALID: string;
        FORM_ITEM_OPTIONAL_EMPTY: string;
    };
};
declare const getStringSet: (lang?: keyof typeof stringSet) => StringSet;
export default getStringSet;
// ===== ui/Label/types.d.ts =====
export declare const Typography: {
    readonly H_1: "H_1";
    readonly H_2: "H_2";
    readonly SUBTITLE_1: "SUBTITLE_1";
    readonly SUBTITLE_2: "SUBTITLE_2";
    readonly BODY_1: "BODY_1";
    readonly BODY_2: "BODY_2";
    readonly BUTTON_1: "BUTTON_1";
    readonly BUTTON_2: "BUTTON_2";
    readonly BUTTON_3: "BUTTON_3";
    readonly CAPTION_1: "CAPTION_1";
    readonly CAPTION_2: "CAPTION_2";
    readonly CAPTION_3: "CAPTION_3";
};
export declare const Colors: {
    readonly ONBACKGROUND_1: "ONBACKGROUND_1";
    readonly ONBACKGROUND_2: "ONBACKGROUND_2";
    readonly ONBACKGROUND_3: "ONBACKGROUND_3";
    readonly ONBACKGROUND_4: "ONBACKGROUND_4";
    readonly ONCONTENT_1: "ONCONTENT_1";
    readonly ONCONTENT_2: "ONCONTENT_2";
    readonly ONCONTENT_3: "ONCONTENT_3";
    readonly ONCONTENT_INVERSE_1: "ONCONTENT_INVERSE_1";
    readonly ONCONTENT_INVERSE_3: "ONCONTENT_INVERSE_3";
    readonly PRIMARY: "PRIMARY";
    readonly ERROR: "ERROR";
    readonly SECONDARY_3: "SECONDARY_3";
};
// ===== ui/LinkLabel/index.d.ts =====
import React, { ReactNode } from 'react';
import { LabelColors, LabelTypography } from '../Label';
import './index.scss';
import { ObjectValues } from '../../utils/typeHelpers/objectValues';
type LinkLabelProps = {
    src: string;
    className?: string | string[];
    type?: ObjectValues<typeof LabelTypography>;
    color?: ObjectValues<typeof LabelColors>;
    children: ReactNode;
};
export default function LinkLabel({ className, src, type, color, children }: LinkLabelProps): React.JSX.Element;
export declare const LinkLabelTypography: {
    readonly H_1: "H_1";
    readonly H_2: "H_2";
    readonly SUBTITLE_1: "SUBTITLE_1";
    readonly SUBTITLE_2: "SUBTITLE_2";
    readonly BODY_1: "BODY_1";
    readonly BODY_2: "BODY_2";
    readonly BUTTON_1: "BUTTON_1";
    readonly BUTTON_2: "BUTTON_2";
    readonly BUTTON_3: "BUTTON_3";
    readonly CAPTION_1: "CAPTION_1";
    readonly CAPTION_2: "CAPTION_2";
    readonly CAPTION_3: "CAPTION_3";
};
export declare const LinkLabelColors: {
    readonly ONBACKGROUND_1: "ONBACKGROUND_1";
    readonly ONBACKGROUND_2: "ONBACKGROUND_2";
    readonly ONBACKGROUND_3: "ONBACKGROUND_3";
    readonly ONBACKGROUND_4: "ONBACKGROUND_4";
    readonly ONCONTENT_1: "ONCONTENT_1";
    readonly ONCONTENT_2: "ONCONTENT_2";
    readonly ONCONTENT_3: "ONCONTENT_3";
    readonly ONCONTENT_INVERSE_1: "ONCONTENT_INVERSE_1";
    readonly ONCONTENT_INVERSE_3: "ONCONTENT_INVERSE_3";
    readonly PRIMARY: "PRIMARY";
    readonly ERROR: "ERROR";
    readonly SECONDARY_3: "SECONDARY_3";
};
export {};
// ===== ui/Loader/index.d.ts =====
import { ReactElement } from 'react';
import './index.scss';
export interface LoaderProps {
    className?: string | Array<string>;
    width?: string | number;
    height?: string | number;
    children?: ReactElement;
    testID?: string;
}
export default function Loader({ className, width, height, children, testID, }: LoaderProps): ReactElement;
// ===== ui/MentionLabel/index.d.ts =====
/// <reference types="react" />
import './index.scss';
interface MentionLabelProps {
    mentionTemplate: string;
    mentionedUserId: string;
    mentionedUserNickname: string;
    isByMe: boolean;
}
export default function MentionLabel(props: MentionLabelProps): JSX.Element;
export {};
// ===== ui/MentionUserLabel/index.d.ts =====
/// <reference types="react" />
import './index.scss';
interface MentionUserLabelProps {
    className?: string;
    children?: string;
    isReverse?: boolean;
    color?: string;
    userId?: string;
}
export default function MentionUserLabel({ className, children, isReverse, color, userId, }: MentionUserLabelProps): JSX.Element;
export {};
// ===== ui/MessageContent/MessageBody/index.d.ts =====
import React from 'react';
import '../index.scss';
import { CoreMessageType } from '../../../utils';
import type { SendbirdStateConfig } from '../../../lib/Sendbird/types';
import { Nullable } from '../../../types';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import type { OnBeforeDownloadFileMessageType } from '../../../modules/GroupChannel/context/types';
export type CustomSubcomponentsProps = Record<'ThumbnailMessageItemBody' | 'MultipleFilesMessageItemBody', Record<string, any>>;
export interface MessageBodyProps {
    className?: string;
    channel: Nullable<GroupChannel>;
    message: CoreMessageType;
    showFileViewer?: (bool: boolean) => void;
    onMessageHeightChange?: () => void;
    onBeforeDownloadFileMessage?: OnBeforeDownloadFileMessageType;
    mouseHover: boolean;
    isMobile: boolean;
    config: SendbirdStateConfig;
    isReactionEnabledInChannel: boolean;
    isByMe: boolean;
}
export declare const MessageBody: (props: MessageBodyProps) => React.JSX.Element;
export default MessageBody;
// ===== ui/MessageContent/MessageHeader/index.d.ts =====
import React from 'react';
import '../index.scss';
import { CoreMessageType } from '../../../utils';
import { Nullable } from '../../../types';
import { GroupChannel } from '@sendbird/chat/groupChannel';
export interface MessageHeaderProps {
    channel: Nullable<GroupChannel>;
    message: CoreMessageType;
}
export declare const MessageHeader: (props: MessageHeaderProps) => React.JSX.Element;
export default MessageHeader;
// ===== ui/MessageContent/MessageProfile/index.d.ts =====
import React from 'react';
import '../index.scss';
import { MessageContentProps } from '../index';
export interface MessageProfileProps extends MessageContentProps {
    className?: string;
    isByMe?: boolean;
    displayThreadReplies?: boolean;
    bottom?: string;
}
export declare function MessageProfile({ className, isByMe, displayThreadReplies, bottom, message, channel, userId, chainBottom, }: MessageProfileProps): React.JSX.Element;
export default MessageProfile;
// ===== ui/MessageContent/index.d.ts =====
import React, { ReactElement, ReactNode } from 'react';
import './index.scss';
import { type MessageMenuProps } from '../MessageMenu';
import { MessageEmojiMenuProps } from '../MessageItemReactionMenu';
import { EmojiReactionsProps } from '../EmojiReactions';
import type { OnBeforeDownloadFileMessageType } from '../../modules/GroupChannel/context/types';
import { CoreMessageType, SendableMessageType } from '../../utils';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { type EmojiCategory, EmojiContainer } from '@sendbird/chat';
import { ThreadReplySelectType } from '../../modules/Channel/context/const';
import { Nullable, ReplyType } from '../../types';
import { MessageProfileProps } from './MessageProfile';
import { MessageBodyProps } from './MessageBody';
import { MessageHeaderProps } from './MessageHeader';
import { MobileBottomSheetProps } from '../MobileMenu/types';
export { MessageBody } from './MessageBody';
export { MessageHeader } from './MessageHeader';
export { MessageProfile } from './MessageProfile';
export interface MessageContentProps extends MessageComponentRenderers {
    className?: string | Array<string>;
    userId: string;
    channel: Nullable<GroupChannel>;
    message: CoreMessageType;
    disabled?: boolean;
    chainTop?: boolean;
    chainBottom?: boolean;
    isReactionEnabled?: boolean;
    disableQuoteMessage?: boolean;
    replyType?: ReplyType;
    threadReplySelectType?: ThreadReplySelectType;
    nicknamesMap?: Map<string, string>;
    emojiContainer?: EmojiContainer;
    scrollToMessage?: (createdAt: number, messageId: number) => void;
    showEdit?: (bool: boolean) => void;
    showRemove?: (bool: boolean) => void;
    showFileViewer?: (bool: boolean) => void;
    resendMessage?: (message: SendableMessageType) => void;
    deleteMessage?: (message: CoreMessageType) => Promise<void>;
    toggleReaction?: (message: SendableMessageType, reactionKey: string, isReacted: boolean) => void;
    setQuoteMessage?: (message: SendableMessageType) => void;
    markAsUnread?: (message: SendableMessageType) => void;
    onReplyInThread?: (props: {
        message: SendableMessageType;
    }) => void;
    onQuoteMessageClick?: (props: {
        message: SendableMessageType;
    }) => void;
    onMessageHeightChange?: () => void;
    onBeforeDownloadFileMessage?: OnBeforeDownloadFileMessageType;
}
export interface MessageComponentRenderers {
    renderSenderProfile?: (props: MessageProfileProps) => ReactNode;
    renderMessageBody?: (props: MessageBodyProps) => ReactNode;
    renderMessageHeader?: (props: MessageHeaderProps) => ReactNode;
    renderMessageMenu?: (props: MessageMenuProps) => ReactNode;
    renderEmojiMenu?: (props: MessageEmojiMenuProps) => ReactNode;
    renderEmojiReactions?: (props: EmojiReactionsProps) => ReactNode;
    renderMobileMenuOnLongPress?: (props: MobileBottomSheetProps) => React.ReactElement;
    filterEmojiCategoryIds?: (message: SendableMessageType) => EmojiCategory['id'][];
}
export declare function MessageContent(props: MessageContentProps): ReactElement;
export default MessageContent;
// ===== ui/MessageFeedbackFailedModal/index.d.ts =====
import { ReactElement } from 'react';
import '../MessageFeedbackModal/index.scss';
/**
 * @deprecated This feature is deprecated and will be removed in May 2026.
 */
export interface MessageFeedbackFailedModalProps {
    text: string;
    onCancel?: () => void;
}
/**
 * @deprecated This feature is deprecated and will be removed in May 2026.
 */
export default function MessageFeedbackFailedModal(props: MessageFeedbackFailedModalProps): ReactElement;
// ===== ui/MessageFeedbackModal/index.d.ts =====
import { ReactElement } from 'react';
import './index.scss';
import { CoreMessageType } from '../../utils';
import { FeedbackRating } from '@sendbird/chat/message';
/**
 * @deprecated This feature is deprecated and will be removed in May 2026.
 */
export interface MessageFeedbackModalProps {
    selectedFeedback: FeedbackRating | undefined;
    message: CoreMessageType;
    onClose?: () => void;
    onSubmit?: (selectedFeedback: FeedbackRating, comment: string) => void;
    onUpdate?: (selectedFeedback: FeedbackRating, comment: string) => void;
    onRemove?: () => void;
}
/**
 * @deprecated This feature is deprecated and will be removed in May 2026.
 */
export default function MessageFeedbackModal(props: MessageFeedbackModalProps): ReactElement;
// ===== ui/MessageInput/hooks/usePaste/index.d.ts =====
import React from 'react';
import { DynamicProps } from './types';
export declare function usePaste({ ref, setIsInput, channel, setMentionedUsers, onAddFiles, }: DynamicProps): (e: React.ClipboardEvent<HTMLDivElement>) => void;
export default usePaste;
// ===== ui/MessageInput/hooks/usePaste/types.d.ts =====
/// <reference types="react" />
import type { User } from '@sendbird/chat';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import type { OpenChannel } from '@sendbird/chat/openChannel';
export type Word = {
    text: string;
    userId?: string;
};
export type DynamicProps = {
    ref: React.RefObject<HTMLInputElement> | null;
    channel: OpenChannel | GroupChannel;
    setMentionedUsers: React.Dispatch<React.SetStateAction<User[]>>;
    setIsInput: React.Dispatch<React.SetStateAction<boolean>>;
    /**
     * When provided, files in the clipboard short-circuit the text/html paste
     * branch and are routed here for composer staging.
     */
    onAddFiles?: (files: File[]) => void;
};
// ===== ui/MessageInput/hooks/usePendingFiles.d.ts =====
import type { Logger } from '../../../lib/Sendbird/types';
import type { OpenGlobalModalProps } from '../../../hooks/useModal';
import type { StringSet } from '../../Label/stringSet';
export interface PendingFile {
    id: string;
    file: File;
    /** Object URL for image previews. Undefined for non-image files. Revoked on remove/unmount. */
    previewUrl?: string;
    isImage: boolean;
}
export interface UsePendingFilesParams {
    uikitUploadSizeLimit: number;
    uikitMultipleFilesMessageLimit: number;
    acceptableMimeTypes?: string[];
    openModal: (props: OpenGlobalModalProps) => void;
    stringSet: StringSet;
    logger?: Logger;
}
export interface UsePendingFilesReturn {
    pendingFiles: PendingFile[];
    /**
     * Adds files to the staging list. Validates combined-count + per-file size.
     * On count/size violation, opens the standard modal and rejects the batch.
     */
    addFiles: (files: File[]) => void;
    removeFile: (id: string) => void;
    clear: () => void;
    hasPendingFiles: boolean;
}
/**
 * Holds files staged for the message composer before send. Producers (file
 * picker, drag-and-drop, clipboard paste) all call addFiles. The owning
 * wrapper drains pendingFiles on submit and calls clear().
 */
export declare const usePendingFiles: ({ uikitUploadSizeLimit, uikitMultipleFilesMessageLimit, acceptableMimeTypes, openModal, stringSet, logger, }: UsePendingFilesParams) => UsePendingFilesReturn;
// ===== ui/MessageInput/index.d.ts =====
import React from 'react';
import './index.scss';
import type { PendingFile } from './hooks/usePendingFiles';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { User } from '@sendbird/chat';
import { OpenChannel } from '@sendbird/chat/openChannel';
import { UserMessage } from '@sendbird/chat/message';
type MessageInputProps = {
    channel: GroupChannel | OpenChannel;
    message?: UserMessage;
    value?: null | string;
    className?: string | string[];
    messageFieldId?: string;
    isEdit?: boolean;
    isMobile?: boolean;
    isMentionEnabled?: boolean;
    isVoiceMessageEnabled?: boolean;
    isSelectingMultipleFilesEnabled?: boolean;
    disabled?: boolean;
    placeholder?: string;
    maxLength?: number;
    /**
     * @deprecated Pass `onAddFiles` + `onSubmit` for the composer flow. When
     * `onAddFiles` is undefined, files from the picker are routed here for
     * immediate send (legacy behavior).
     */
    onFileUpload?: (file: File[]) => void;
    onSendMessage?: (params: {
        message: string;
        mentionTemplate: string;
    }) => void;
    /**
     * Composer mode: files staged for send. When defined and non-empty, the
     * preview strip renders above the textarea and the send button activates
     * regardless of text input state.
     */
    pendingFiles?: PendingFile[];
    /**
     * Composer mode: routes files from the picker, drag-drop, and clipboard
     * paste to the staging hook. When defined, takes precedence over
     * `onFileUpload`.
     */
    onAddFiles?: (files: File[]) => void;
    /**
     * Composer mode: removes a staged file by id from the preview strip.
     */
    onRemoveFile?: (id: string) => void;
    /**
     * Composer mode: unified send action. When defined, takes precedence over
     * `onSendMessage` for the click and Enter-key paths.
     */
    onSubmit?: (params: {
        message: string;
        mentionTemplate: string;
        files: PendingFile[];
    }) => void;
    onUpdateMessage?: (params: {
        messageId: number;
        message: string;
        mentionTemplate: string;
        mentionedUserIds?: string[];
    }) => void;
    onCancelEdit?: () => void;
    onStartTyping?: () => void;
    onStopTyping?: () => void;
    channelUrl?: string;
    mentionSelectedUser?: null | User;
    onUserMentioned?: (user: User) => void;
    onMentionStringChange?: (mentionString: string) => void;
    onMentionedUserIdsUpdated?: (mentionedUserIds: string[]) => void;
    onVoiceMessageIconClick?: () => void;
    onKeyUp?: (event: React.KeyboardEvent<HTMLDivElement>) => boolean;
    onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => boolean;
    renderVoiceMessageIcon?: () => React.ReactNode;
    renderFileUploadIcon?: () => React.ReactNode;
    renderSendMessageIcon?: () => React.ReactNode;
    setMentionedUsers?: React.Dispatch<React.SetStateAction<User[]>>;
    acceptableMimeTypes?: string[];
};
declare const MessageInput: React.ForwardRefExoticComponent<MessageInputProps & React.RefAttributes<HTMLInputElement>>;
export default MessageInput;
// ===== ui/MessageItemMenu/index.d.ts =====
import './index.scss';
import { ReactElement } from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import type { OpenChannel } from '@sendbird/chat/openChannel';
import { MenuItemProps } from '../ContextMenu';
import { SendableMessageType } from '../../utils/index';
import { ReplyType } from '../../types';
export interface MessageMenuRenderMenuItemProps extends Omit<MenuItemProps, 'children' | 'className'> {
    className?: string;
    text: string;
}
export interface MessageMenuProps {
    className?: string | Array<string>;
    message: SendableMessageType;
    channel: GroupChannel | OpenChannel | null;
    isByMe?: boolean;
    disabled?: boolean;
    replyType?: ReplyType;
    disableDeleteMessage?: boolean;
    showEdit?: (bool: boolean) => void;
    showRemove?: (bool: boolean) => void;
    deleteMessage?: (message: SendableMessageType) => void;
    resendMessage?: (message: SendableMessageType) => void;
    setQuoteMessage?: (message: SendableMessageType) => void;
    setSupposedHover?: (bool: boolean) => void;
    onReplyInThread?: (props: {
        message: SendableMessageType;
    }) => void;
    onMoveToParentMessage?: () => void;
    renderMenuItem?: (props: MessageMenuRenderMenuItemProps) => ReactElement;
}
export declare function MessageMenu(props: MessageMenuProps): ReactElement | null;
export default MessageMenu;
// ===== ui/MessageItemReactionMenu/index.d.ts =====
import './index.scss';
import { ReactElement } from 'react';
import type { EmojiCategory, EmojiContainer } from '@sendbird/chat';
import { SendableMessageType } from '../../utils';
import { SpaceFromTriggerType } from '../../types';
export interface MessageEmojiMenuProps {
    className?: string | Array<string>;
    message: SendableMessageType;
    userId: string;
    spaceFromTrigger?: SpaceFromTriggerType;
    emojiContainer?: EmojiContainer;
    filterEmojiCategoryIds?: (message: SendableMessageType) => EmojiCategory['id'][];
    toggleReaction?: (message: SendableMessageType, reactionKey: string, isReacted: boolean) => void;
}
export declare function MessageEmojiMenu({ className, message, userId, spaceFromTrigger, emojiContainer, filterEmojiCategoryIds, toggleReaction, }: MessageEmojiMenuProps): ReactElement | null;
export default MessageEmojiMenu;
// ===== ui/MessageMenu/MessageMenu.d.ts =====
import React, { ReactElement } from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { OpenChannel } from '@sendbird/chat/openChannel';
import { SendableMessageType } from '../../utils';
import { type PrebuildMenuItemPropsType, TriggerIconProps } from './menuItems/MessageMenuItems';
import { ReplyType } from '../../types';
export type RenderMenuItemsParams = {
    items: {
        CopyMenuItem: (props: PrebuildMenuItemPropsType) => ReactElement;
        ReplyMenuItem: (props: PrebuildMenuItemPropsType) => ReactElement;
        ThreadMenuItem: (props: PrebuildMenuItemPropsType) => ReactElement;
        OpenInChannelMenuItem: (props: PrebuildMenuItemPropsType) => ReactElement;
        EditMenuItem: (props: PrebuildMenuItemPropsType) => ReactElement;
        ResendMenuItem: (props: PrebuildMenuItemPropsType) => ReactElement;
        DeleteMenuItem: (props: PrebuildMenuItemPropsType) => ReactElement;
        MarkAsUnreadMenuItem: (props: PrebuildMenuItemPropsType) => ReactElement;
    };
};
export interface MessageMenuProps {
    className?: string;
    message: SendableMessageType;
    channel: GroupChannel | OpenChannel | null;
    isByMe?: boolean;
    replyType?: ReplyType;
    inThreadList?: boolean;
    renderTrigger?: (params: TriggerIconProps) => ReactElement;
    renderMenuItems?: (params: RenderMenuItemsParams) => ReactElement;
    disableDeleteMessage?: boolean;
    showEdit?: (bool: boolean) => void;
    showRemove?: (bool: boolean) => void;
    deleteMessage?: (message: SendableMessageType) => void;
    resendMessage?: (message: SendableMessageType) => void;
    markAsUnread?: (message: SendableMessageType) => void;
    setQuoteMessage?: (message: SendableMessageType) => void;
    onReplyInThread?: (props: {
        message: SendableMessageType;
    }) => void;
    onMoveToParentMessage?: () => void;
}
export declare const MessageMenu: ({ className, message, channel, isByMe, replyType, inThreadList, renderTrigger, renderMenuItems, disableDeleteMessage, showEdit, showRemove, deleteMessage, resendMessage, markAsUnread, setQuoteMessage, onReplyInThread, onMoveToParentMessage, }: MessageMenuProps) => React.JSX.Element;
// ===== ui/MessageMenu/MessageMenuProvider.d.ts =====
import React, { ReactNode, MutableRefObject, MouseEvent } from 'react';
import { SendableMessageType } from '../../utils';
interface CommonMessageMenuContextProps {
    message: SendableMessageType;
    hideMenu: () => void;
    setQuoteMessage: (message: SendableMessageType) => void;
    onReplyInThread: (props: {
        message: SendableMessageType;
    }) => void;
    onMoveToParentMessage: () => void;
    showEdit: (bool: boolean) => void;
    showRemove: (bool: boolean) => void;
    deleteMessage: (message: SendableMessageType) => void;
    resendMessage: (message: SendableMessageType) => void;
    markAsUnread?: (message: SendableMessageType, source?: 'manual' | 'internal') => void;
    isOnline: boolean;
    disableDeleteMessage: boolean | null;
    triggerRef: MutableRefObject<null>;
    containerRef: MutableRefObject<null>;
}
export interface MessageMenuContextProps extends CommonMessageMenuContextProps {
    showMenu: () => void;
    toggleMenu: () => void;
}
export interface MobileMessageMenuContextProps extends CommonMessageMenuContextProps {
    onDownloadClick?: (e: MouseEvent) => Promise<void>;
}
interface MessageMenuProviderProps {
    children: ReactNode;
    value: MessageMenuContextProps | MobileMessageMenuContextProps;
}
export declare const MessageMenuProvider: ({ children, value }: MessageMenuProviderProps) => React.JSX.Element;
export declare const useMessageMenuContext: () => MessageMenuContextProps | MobileMessageMenuContextProps;
export {};
// ===== ui/MessageMenu/index.d.ts =====
import './index.scss';
export { MessageMenu, type MessageMenuProps } from './MessageMenu';
export { MessageMenuProvider, useMessageMenuContext, type MessageMenuContextProps } from './MessageMenuProvider';
export { MenuItem, BottomSheetMenuItem, type MenuItemProps } from './menuItems/BasicItems';
// ===== ui/MessageMenu/menuItems/BasicItems.d.ts =====
import React, { MouseEvent, ReactNode } from 'react';
export interface MenuItemProps {
    className?: string;
    disabled?: boolean;
    tabIndex?: number;
    testID?: string;
    onClick?: (e: MouseEvent<HTMLLIElement | HTMLDivElement>) => void;
    children: ReactNode;
}
export declare const MenuItem: ({ className, disabled, tabIndex, testID, onClick, children, }: MenuItemProps) => React.JSX.Element;
export declare const BottomSheetMenuItem: ({ className, disabled, tabIndex, testID, onClick, children, }: MenuItemProps) => React.JSX.Element;
// ===== ui/MessageMenu/menuItems/MessageMenuItems.d.ts =====
import React, { FocusEvent, MouseEvent, MutableRefObject, ReactNode } from 'react';
import { IconProps } from '../../Icon';
import { MenuItemProps } from './BasicItems';
export interface TriggerIconProps {
    ref: MutableRefObject<any>;
    onClick?: (e: MouseEvent) => void;
    onBlur?: (e: FocusEvent) => void;
    renderIcon?: (props: IconProps) => ReactNode;
}
export declare const TriggerIcon: ({ ref, onClick, onBlur, renderIcon, }: TriggerIconProps) => React.JSX.Element;
export type PrebuildMenuItemPropsType = Omit<MenuItemProps, 'children'> & Partial<Pick<MenuItemProps, 'children'>>;
export declare const CopyMenuItem: (props: PrebuildMenuItemPropsType) => React.JSX.Element;
export declare const ReplyMenuItem: (props: PrebuildMenuItemPropsType) => React.JSX.Element;
export declare const ThreadMenuItem: (props: PrebuildMenuItemPropsType) => React.JSX.Element;
export declare const OpenInChannelMenuItem: (props: PrebuildMenuItemPropsType) => React.JSX.Element;
export declare const EditMenuItem: (props: PrebuildMenuItemPropsType) => React.JSX.Element;
export declare const ResendMenuItem: (props: PrebuildMenuItemPropsType) => React.JSX.Element;
export declare const DeleteMenuItem: (props: PrebuildMenuItemPropsType) => React.JSX.Element;
export declare const MarkAsUnreadMenuItem: (props: PrebuildMenuItemPropsType) => React.JSX.Element;
// ===== ui/MessageSearchFileItem/index.d.ts =====
import './index.scss';
import { ReactElement } from 'react';
import type { FileMessage } from '@sendbird/chat/message';
import { MultipleFilesMessage } from '@sendbird/chat/message';
interface Props {
    className?: string | Array<string>;
    message: FileMessage | MultipleFilesMessage;
    selected?: boolean;
    onClick?: (message: FileMessage | MultipleFilesMessage) => void;
}
export default function MessageSearchFileItem(props: Props): ReactElement;
export {};
// ===== ui/MessageSearchItem/index.d.ts =====
/// <reference types="react" />
import './index.scss';
import { UserMessage } from '@sendbird/chat/message';
interface Props {
    className?: string | Array<string>;
    message: UserMessage;
    selected?: boolean;
    onClick?: (message: UserMessage) => void;
}
export default function MessageSearchItem({ className, message, selected, onClick, }: Props): JSX.Element;
export {};
// ===== ui/MessageStatus/index.d.ts =====
import './index.scss';
import React from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { CoreMessageType } from '../../utils';
import { OutgoingMessageStates } from '../../utils/exports/getOutgoingMessageState';
import { Nullable } from '../../types';
export declare const MessageStatusTypes: typeof OutgoingMessageStates;
interface MessageStatusProps {
    className?: string;
    message?: CoreMessageType | null;
    channel: Nullable<GroupChannel>;
    isDateSeparatorConsidered?: boolean;
}
export default function MessageStatus({ className, message, channel, isDateSeparatorConsidered, }: MessageStatusProps): React.ReactElement;
export {};
// ===== ui/MessageTemplate/index.d.ts =====
import React from 'react';
import { type ComponentsUnion } from '@sendbird/uikit-message-template';
import './index.scss';
export interface MessageTemplateProps {
    templateVersion: number;
    templateItems: ComponentsUnion['properties'][];
}
export declare function MessageTemplate({ templateItems, templateVersion }: MessageTemplateProps): React.JSX.Element;
export default MessageTemplate;
// ===== ui/MobileFeedbackMenu/index.d.ts =====
import { ReactElement } from 'react';
import './index.scss';
/**
 * @deprecated This feature is deprecated and will be removed in May 2026.
 */
export interface MobileFeedbackMenuProps {
    hideMenu(): void;
    onEditFeedback(): void;
    onRemoveFeedback(): void;
}
export default function MobileFeedbackMenu(props: MobileFeedbackMenuProps): ReactElement;
// ===== ui/MobileMenu/MobileBottomSheet.d.ts =====
import React from 'react';
import type { MobileBottomSheetProps } from './types';
declare const MobileBottomSheet: React.FunctionComponent<MobileBottomSheetProps>;
export default MobileBottomSheet;
// ===== ui/MobileMenu/MobileContextMenu.d.ts =====
import React from 'react';
import type { BaseMenuProps } from './types';
declare const MobileContextMenu: React.FunctionComponent<BaseMenuProps>;
export default MobileContextMenu;
// ===== ui/MobileMenu/index.d.ts =====
import './mobile-menu.scss';
import React from 'react';
import MobileContextMenu from './MobileContextMenu';
import MobileBottomSheet from './MobileBottomSheet';
import type { MobileBottomSheetProps } from './types';
declare const MobileMenu: React.FC<MobileBottomSheetProps>;
export { MobileMenu, MobileContextMenu, MobileBottomSheet };
export default MobileMenu;
// ===== ui/MobileMenu/types.d.ts =====
import React, { MouseEvent, ReactNode } from 'react';
import type { EmojiContainer } from '@sendbird/chat';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import type { OpenChannel } from '@sendbird/chat/openChannel';
import { CoreMessageType, SendableMessageType } from '../../utils';
import { ReplyType } from '../../types';
import type { RenderMenuItemsParams } from '../MessageMenu/MessageMenu';
export type DeleteMenuStates = 'DISABLE' | 'HIDE' | 'ACTIVE';
type MobileRenderMenuItemsParams = {
    items: Omit<RenderMenuItemsParams['items'], 'OpenInChannelMenuItem'>;
};
export interface BaseMenuProps {
    channel: GroupChannel | OpenChannel;
    message: SendableMessageType;
    userId: string;
    hideMenu(): void;
    isByMe?: boolean;
    replyType?: ReplyType;
    inThreadList?: boolean;
    disabled?: boolean;
    deleteMenuState?: DeleteMenuStates;
    showEdit?: (bool: boolean) => void;
    showRemove?: (bool: boolean) => void;
    resendMessage?: (message: SendableMessageType) => void;
    deleteMessage?: (message: CoreMessageType) => Promise<void>;
    markAsUnread?: (message: SendableMessageType) => void;
    setQuoteMessage?: (message: SendableMessageType) => void;
    isReactionEnabled?: boolean;
    parentRef?: React.RefObject<HTMLElement>;
    onReplyInThread?: (props: {
        message: SendableMessageType;
    }) => void;
    isOpenedFromThread?: boolean;
    onDownloadClick?: (e: MouseEvent) => Promise<void>;
    renderMenuItems?: (params: MobileRenderMenuItemsParams) => ReactNode;
}
export interface MobileBottomSheetProps extends BaseMenuProps {
    emojiContainer?: EmojiContainer;
    toggleReaction?: (message: SendableMessageType, reactionKey: string, isReacted: boolean) => void;
}
export {};
// ===== ui/Modal/index.d.ts =====
import { ReactElement, ReactNode, MouseEvent, KeyboardEvent } from 'react';
import './index.scss';
import { ButtonTypes } from '../Button';
export interface ModalHeaderProps {
    titleText: string;
    onCloseClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}
export declare const ModalHeader: ({ titleText, onCloseClick }: ModalHeaderProps) => ReactElement;
export interface ModalBodyProps {
    children?: ReactNode;
}
export declare const ModalBody: ({ children }: ModalBodyProps) => ReactElement;
export interface ModalFooterProps {
    submitText: string;
    disabled?: boolean;
    type?: ButtonTypes;
    onCancel: () => void;
    onSubmit: () => void;
    hideCancelButton?: boolean;
}
export declare const ModalFooter: ({ submitText, disabled, hideCancelButton, type, onSubmit, onCancel, }: ModalFooterProps) => ReactElement;
export interface ModalProps {
    children?: ReactNode;
    className?: string;
    contentClassName?: string | Array<string>;
    isCloseOnClickOutside?: boolean;
    isFullScreenOnMobile?: boolean;
    titleText?: string;
    submitText?: string;
    disabled?: boolean;
    hideFooter?: boolean;
    type?: ButtonTypes;
    onClose?: (e?: MouseEvent | KeyboardEvent) => void;
    onSubmit?: (...args: any[]) => void;
    renderHeader?: () => ReactElement;
    customFooter?: ReactNode;
    /** @deprecated Please use `onClose` instead, we will remove `onCancel` in v4. * */
    onCancel?: () => void;
}
export declare function Modal(props: ModalProps): ReactElement;
export default Modal;
// ===== ui/OGMessageItemBody/index.d.ts =====
import './index.scss';
import { ReactElement } from 'react';
import type { UserMessage } from '@sendbird/chat/message';
interface Props {
    className?: string | Array<string>;
    message: UserMessage;
    isByMe?: boolean;
    mouseHover?: boolean;
    isMentionEnabled?: boolean;
    isReactionEnabled?: boolean;
    isMarkdownEnabled?: boolean;
    onMessageHeightChange?: () => void;
}
export default function OGMessageItemBody({ className, message, isByMe, mouseHover, isMentionEnabled, isReactionEnabled, isMarkdownEnabled, onMessageHeightChange, }: Props): ReactElement;
export {};
// ===== ui/OpenChannelAdminMessage/index.d.ts =====
import { ReactElement } from 'react';
import { AdminMessage } from '@sendbird/chat/message';
import './index.scss';
interface Props {
    className?: string | Array<string>;
    message: AdminMessage;
}
export default function OpenChannelAdminMessage({ className, message, }: Props): ReactElement;
export {};
// ===== ui/OpenchannelConversationHeader/index.d.ts =====
/// <reference types="react" />
import './index.scss';
interface Props {
    coverImage?: string;
    title?: string;
    subTitle?: string;
    amIOperator?: boolean;
    onActionClick?(): void;
}
export default function OpenchannelConversationHeader({ coverImage, title, subTitle, amIOperator, onActionClick, }: Props): JSX.Element;
export {};
// ===== ui/OpenchannelFileMessage/index.d.ts =====
/// <reference types="react" />
import { FileMessage } from '@sendbird/chat/message';
import './index.scss';
interface OpenChannelFileMessageProps {
    className?: string | Array<string>;
    message: FileMessage;
    isOperator?: boolean;
    isEphemeral?: boolean;
    userId: string;
    disabled?: boolean;
    chainTop?: boolean;
    chainBottom?: boolean;
    showRemove(bool: boolean): void;
    resendMessage(message: FileMessage): void;
}
export default function OpenChannelFileMessage({ className, message, isOperator, isEphemeral, userId, disabled, chainTop, showRemove, resendMessage, }: OpenChannelFileMessageProps): JSX.Element;
export {};
// ===== ui/OpenchannelOGMessage/index.d.ts =====
/// <reference types="react" />
import { UserMessage } from '@sendbird/chat/message';
import './index.scss';
interface OpenChannelOGMessageProps {
    message: UserMessage;
    isOperator?: boolean;
    isEphemeral?: boolean;
    className?: string | Array<string>;
    disabled?: boolean;
    showEdit(bool: boolean): void;
    showRemove(bool: boolean): void;
    resendMessage(message: UserMessage): void;
    chainTop?: boolean;
    chainBottom?: boolean;
    userId: string;
}
export default function OpenChannelOGMessage({ message, isOperator, isEphemeral, className, disabled, showEdit, showRemove, resendMessage, chainTop, userId, }: OpenChannelOGMessageProps): JSX.Element;
export {};
// ===== ui/OpenchannelThumbnailMessage/index.d.ts =====
/// <reference types="react" />
import { FileMessage } from '@sendbird/chat/message';
import './index.scss';
interface OpenChannelThumbnailMessageProps {
    className?: string | Array<string>;
    message: FileMessage;
    isOperator?: boolean;
    isEphemeral?: boolean;
    disabled: boolean;
    userId: string;
    chainTop: boolean;
    chainBottom: boolean;
    onClick(bool: boolean): void;
    showRemove(bool: boolean): void;
    resendMessage(message: FileMessage): void;
}
export default function OpenchannelThumbnailMessage({ className, message, isOperator, isEphemeral, disabled, userId, chainTop, onClick, showRemove, resendMessage, }: OpenChannelThumbnailMessageProps): JSX.Element;
export {};
// ===== ui/OpenchannelUserMessage/index.d.ts =====
import { ReactElement } from 'react';
import { UserMessage } from '@sendbird/chat/message';
import './index.scss';
interface OpenChannelUserMessageProps {
    className?: string | Array<string>;
    message: UserMessage;
    isOperator?: boolean;
    isEphemeral?: boolean;
    userId: string;
    disabled?: boolean;
    showEdit(bool: boolean): void;
    showRemove(bool: boolean): void;
    resendMessage(message: UserMessage): void;
    chainTop?: boolean;
    chainBottom?: boolean;
}
export default function OpenchannelUserMessage({ className, message, isOperator, isEphemeral, userId, resendMessage, disabled, showEdit, showRemove, chainTop, }: OpenChannelUserMessageProps): ReactElement;
export {};
// ===== ui/PlaceHolder/index.d.ts =====
import { ReactElement } from 'react';
import './index.scss';
export declare const PlaceHolderTypes: {
    readonly LOADING: "LOADING";
    readonly NO_CHANNELS: "NO_CHANNELS";
    readonly NO_MESSAGES: "NO_MESSAGES";
    readonly WRONG: "WRONG";
    readonly SEARCH_IN: "SEARCH_IN";
    readonly SEARCHING: "SEARCHING";
    readonly NO_RESULTS: "NO_RESULTS";
};
export interface PlaceHolderProps {
    className?: string | Array<string>;
    type: keyof typeof PlaceHolderTypes;
    iconSize?: string | number;
    searchInString?: string;
    retryToConnect?: () => void;
}
export default function PlaceHolder({ className, type, iconSize, searchInString, retryToConnect, }: PlaceHolderProps): ReactElement;
// ===== ui/PlaybackTime/index.d.ts =====
import React from 'react';
import { LabelTypography, LabelColors } from '../Label';
import { ObjectValues } from '../../utils/typeHelpers/objectValues';
export interface PlaybackTimeProps {
    className?: string;
    time: number;
    labelType?: ObjectValues<typeof LabelTypography>;
    labelColor?: ObjectValues<typeof LabelColors>;
}
export declare const PlaybackTime: ({ className, time, labelType, labelColor, }: PlaybackTimeProps) => React.ReactElement;
export default PlaybackTime;
// ===== ui/ProgressBar/index.d.ts =====
import React from 'react';
import './index.scss';
export declare const ProgressBarColorTypes: {
    readonly PRIMARY: "progress-bar-color--primary";
    readonly GRAY: "progress-bar-color--gray";
};
export type ProgressBarColorTypes = typeof ProgressBarColorTypes[keyof typeof ProgressBarColorTypes];
export interface ProgressBarProps {
    className?: string;
    disabled?: boolean;
    maxSize: number;
    currentSize: number;
    colorType?: ProgressBarColorTypes;
}
export declare const ProgressBar: ({ className, disabled, maxSize, currentSize, colorType, }: ProgressBarProps) => React.ReactElement;
export default ProgressBar;
// ===== ui/QuoteMessage/index.d.ts =====
import './index.scss';
import { ReactElement } from 'react';
import { SendableMessageType } from '../../utils';
interface Props {
    className?: string | Array<string>;
    message?: SendableMessageType;
    userId?: string;
    isByMe?: boolean;
    isUnavailable?: boolean;
    onClick?: () => void;
}
export default function QuoteMessage({ message, userId, isByMe, className, isUnavailable, onClick, }: Props): ReactElement;
export {};
// ===== ui/QuoteMessageInput/index.d.ts =====
import './index.scss';
import { ReactElement } from 'react';
import { SendableMessageType } from '../../utils';
interface Props {
    className?: string | Array<string>;
    replyingMessage: SendableMessageType;
    onClose?: (message: SendableMessageType) => void;
}
export default function QuoteMessageInput({ className, replyingMessage, onClose, }: Props): ReactElement;
export {};
// ===== ui/ReactionBadge/index.d.ts =====
import React, { KeyboardEvent, MouseEvent, ReactElement, TouchEvent } from 'react';
import './index.scss';
export interface ReactionBadgeProps {
    className?: string | Array<string>;
    testID?: string;
    children: ReactElement;
    count?: number | string;
    isAdd?: boolean;
    selected?: boolean;
    onClick?: (e: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => void;
}
declare const ReactionBadge: React.ForwardRefExoticComponent<ReactionBadgeProps & React.RefAttributes<HTMLDivElement>>;
export default ReactionBadge;
// ===== ui/ReactionButton/index.d.ts =====
import React, { KeyboardEvent, MouseEvent, ReactElement, TouchEvent } from 'react';
import './index.scss';
export interface ReactionButtonProps {
    children: ReactElement;
    className?: string | Array<string>;
    width?: string | number;
    height?: string | number;
    selected?: boolean;
    /**
     * @deprecated Please use the testID instead
     */
    dataSbId?: string;
    testID?: string;
    onClick?: (e: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => void;
}
declare const ReactionButton: React.ForwardRefExoticComponent<ReactionButtonProps & React.RefAttributes<HTMLDivElement>>;
export default ReactionButton;
// ===== ui/SortByRow/index.d.ts =====
import { ReactElement, ReactNode } from 'react';
import './index.scss';
export interface SortByRowProps {
    className?: string | Array<string>;
    maxItemCount: number;
    itemWidth: number;
    itemHeight: number;
    children: ReactNode;
}
export default function SortByRow({ className, maxItemCount, itemWidth, itemHeight, children, }: SortByRowProps): ReactElement;
// ===== ui/TemplateMessageItemBody/FallbackTemplateMessageItemBody.d.ts =====
import type { BaseMessage } from '@sendbird/chat/message';
import { ReactElement } from 'react';
export interface FallbackTemplateMessageItemBodyProps {
    className?: string | Array<string>;
    message: BaseMessage;
    isByMe?: boolean;
}
export declare function FallbackTemplateMessageItemBody({ className, message, isByMe, }: FallbackTemplateMessageItemBodyProps): ReactElement;
export default FallbackTemplateMessageItemBody;
// ===== ui/TemplateMessageItemBody/LoadingTemplateMessageItemBody.d.ts =====
import { ReactElement } from 'react';
export interface LoadingTemplateMessageItemBodyProps {
    className?: string;
    isByMe?: boolean;
}
export declare function LoadingTemplateMessageItemBody({ className, isByMe, }: LoadingTemplateMessageItemBodyProps): ReactElement;
export default LoadingTemplateMessageItemBody;
// ===== ui/TemplateMessageItemBody/index.d.ts =====
import './index.scss';
import { ReactElement } from 'react';
import type { BaseMessage } from '@sendbird/chat/message';
import { MessageTemplateItem } from './types';
import { SendbirdTheme } from '../../types';
export interface RenderData {
    filledMessageTemplateItemsList: {
        version: number;
        items: MessageTemplateItem[];
    }[];
    isErrored: boolean;
}
interface TemplateMessageItemBodyProps {
    className?: string;
    message: BaseMessage;
    isByMe?: boolean;
    theme?: SendbirdTheme;
}
export declare const replaceVariablesInTemplateString: ({ template, templateData, colorVariables, theme, }: {
    template: string;
    templateData?: Record<string, any>;
    colorVariables?: Record<string, string>;
    theme?: SendbirdTheme;
}) => string;
export declare function TemplateMessageItemBody({ className, message, isByMe, theme, }: TemplateMessageItemBodyProps): ReactElement;
export default TemplateMessageItemBody;
// ===== ui/TemplateMessageItemBody/types.d.ts =====
import { ComponentsUnion } from '@sendbird/uikit-message-template';
type SendbirdFontWeight = 'bold' | 'normal';
/**
 * The value of each theme property contains both light and dark value with comma separated string
 * ex)
 * {
 *   ...
 *   backgroundColor: "#800000FF, #20FFFFTT" // lgiht , dark with ARGB 8-digit hexacode
 *   ....
 * }
 *  */
export type MessageTemplateTheme = {
    key: string;
    notification: {
        backgroundColor: string;
        label?: {
            textColor: string;
            textSize: number;
            fontWeight?: SendbirdFontWeight;
        };
        category?: {
            textColor: string;
            textSize: number;
            fontWeight?: SendbirdFontWeight;
        };
        pressedColor: string;
        radius: number;
        sentAt: {
            textColor: string;
            textSize: number;
            fontWeight?: SendbirdFontWeight;
        };
        unreadIndicatorColor: string;
    };
    list: {
        backgroundColor: string;
        category: {
            textSize: number;
            fontWeight: SendbirdFontWeight;
            radius: number;
            backgroundColor: string;
            textColor: string;
            selectedBackgroundColor: string;
            selectedTextColor: string;
        };
        timeline: {
            backgroundColor: string;
            textColor: string;
            textSize?: number;
            fontWeight?: SendbirdFontWeight;
        };
        tooltip: {
            backgroundColor: string;
            textColor: string;
            textSize?: number;
            fontWeight?: SendbirdFontWeight;
        };
    };
    header: {
        backgroundColor: string;
        buttonIconTintColor: string;
        lineColor: string;
        textColor: string;
        textSize: number;
        fontWeight?: SendbirdFontWeight;
    };
    components?: {
        text: {
            textColor: string;
        };
        textButton: {
            textColor: string;
            backgroundColor: string;
            radius: number;
        };
    };
};
export type MessageTemplateItem = ComponentsUnion['properties'];
export type MessageTemplateData = SimpleTemplateData & {
    view_variables?: Record<string, SimpleTemplateData[]>;
    container_options?: {
        profile?: boolean;
        time?: boolean;
        nickname?: boolean;
    };
};
export type TemplateType = 'default';
export type SimpleTemplateData = {
    type?: TemplateType;
    key: string;
    variables?: Record<string, any>;
};
export interface SendbirdUiTemplate {
    version: number;
    body: {
        items: MessageTemplateItem[];
    };
}
export type SendbirdMessageTemplate = {
    key: string;
    created_at: number;
    updated_at: number;
    ui_template: SendbirdUiTemplate;
    name?: string;
    color_variables?: Record<string, string>;
};
export {};
// ===== ui/TextButton/index.d.ts =====
import { MouseEvent, KeyboardEvent, ReactElement } from 'react';
import './index.scss';
import { Colors } from '../../utils/color';
export interface TextButtonProps {
    className?: string | Array<string>;
    color?: Colors;
    disabled?: boolean;
    disableUnderline?: boolean;
    onClick?: (e: (MouseEvent | KeyboardEvent)) => void;
    children: ReactElement;
}
declare const TextButton: ({ className, color, disabled, disableUnderline, onClick, children, }: TextButtonProps) => ReactElement;
export default TextButton;
// ===== ui/TextMessageItemBody/index.d.ts =====
import './index.scss';
import { ReactElement } from 'react';
import type { UserMessage } from '@sendbird/chat/message';
interface Props {
    className?: string | Array<string>;
    message: UserMessage;
    isByMe?: boolean;
    mouseHover?: boolean;
    isMentionEnabled?: boolean;
    isReactionEnabled?: boolean;
    isMarkdownEnabled?: boolean;
}
export default function TextMessageItemBody({ className, message, isByMe, mouseHover, isMentionEnabled, isReactionEnabled, isMarkdownEnabled, }: Props): ReactElement;
export {};
// ===== ui/ThreadReplies/index.d.ts =====
import React, { RefObject } from 'react';
import { ThreadInfo } from '@sendbird/chat/message';
import './index.scss';
export interface ThreadRepliesProps {
    className?: string;
    threadInfo: ThreadInfo;
    onClick?: (e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void;
}
export declare function ThreadReplies({ className, threadInfo, onClick, }: ThreadRepliesProps, ref: RefObject<HTMLDivElement>): React.ReactElement;
declare const _default: React.ForwardRefExoticComponent<ThreadRepliesProps & React.RefAttributes<HTMLDivElement>>;
export default _default;
// ===== ui/ThumbnailMessageItemBody/index.d.ts =====
import './index.scss';
import { ReactElement } from 'react';
import type { FileMessage } from '@sendbird/chat/message';
import { MultipleFilesMessage } from '@sendbird/chat/message';
interface Props {
    className?: string | Array<string>;
    message: FileMessage | MultipleFilesMessage;
    isByMe?: boolean;
    mouseHover?: boolean;
    isReactionEnabled?: boolean;
    showFileViewer?: (bool: boolean) => void;
    style?: Record<string, any>;
}
export default function ThumbnailMessageItemBody({ className, message, isByMe, mouseHover, isReactionEnabled, showFileViewer, style, }: Props): ReactElement;
export {};
// ===== ui/Toggle/ToggleContainer.d.ts =====
import React from 'react';
import type { ReactNode } from 'react';
import { ToggleContextInterface } from './ToggleContext';
export interface ToggleContainerProps extends ToggleContextInterface {
    children?: ReactNode;
}
export declare function ToggleContainer({ checked, // null
defaultChecked, disabled, onChange, onFocus, onBlur, children, }: ToggleContainerProps): React.ReactElement;
// ===== ui/Toggle/ToggleContext.d.ts =====
import React, { ChangeEventHandler } from 'react';
export declare const TOGGLE_DEFAULT_VALUE: {
    checked: any;
    defaultChecked: boolean;
    disabled: boolean;
    onChange: () => void;
    onFocus: () => void;
    onBlur: () => void;
};
export interface ToggleContextInterface {
    checked?: boolean | null;
    defaultChecked?: boolean;
    disabled?: boolean;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    onFocus?: ChangeEventHandler<HTMLInputElement>;
    onBlur?: ChangeEventHandler<HTMLInputElement>;
}
export declare const ToggleContext: React.Context<ToggleContextInterface>;
export declare function useToggleContext(): ToggleContextInterface;
// ===== ui/Toggle/ToggleUI.d.ts =====
import React from 'react';
export interface ToggleUIProps {
    reversed?: boolean;
    width?: string;
    animationDuration?: string;
    style?: Record<string, string>;
    name?: string;
    id?: string;
    ariaLabel?: string;
    ariaLabelledby?: string;
}
export declare function ToggleUI(props: ToggleUIProps): React.ReactElement;
// ===== ui/Toggle/index.d.ts =====
import React from 'react';
import './index.scss';
import { ToggleContainer, ToggleContainerProps } from './ToggleContainer';
import { useToggleContext } from './ToggleContext';
import { ToggleUI, ToggleUIProps } from './ToggleUI';
export interface ToggleProps extends ToggleContainerProps, ToggleUIProps {
    className?: string;
}
declare function Toggle(props: ToggleProps): React.ReactElement;
export type { ToggleContainerProps, ToggleUIProps };
export { Toggle, ToggleContainer, ToggleUI, useToggleContext };
// ===== ui/Tooltip/index.d.ts =====
import { ReactElement } from 'react';
import './index.scss';
export interface TooltipProps {
    className?: string | Array<string>;
    children?: string | ReactElement;
}
export default function Tooltip({ className, children, }: TooltipProps): ReactElement;
// ===== ui/TooltipWrapper/index.d.ts =====
import { ReactElement } from 'react';
import './index.scss';
export interface TooltipWrapperProps {
    className?: string | Array<string>;
    children: ReactElement;
    hoverTooltip: ReactElement;
}
export default function TooltipWrapper({ className, children, hoverTooltip, }: TooltipWrapperProps): ReactElement;
// ===== ui/TypingIndicatorBubble/index.d.ts =====
import React from 'react';
import { Member } from '@sendbird/chat/groupChannel';
export interface TypingIndicatorBubbleProps {
    typingMembers: Member[];
    handleScroll?: (isBottomMessageAffected?: boolean) => void;
}
export interface AvatarStackProps {
    sources: string[];
    max: number;
}
declare const TypingIndicatorBubble: (props: TypingIndicatorBubbleProps) => React.JSX.Element;
export default TypingIndicatorBubble;
// ===== ui/UnknownMessageItemBody/index.d.ts =====
import { ReactElement } from 'react';
import './index.scss';
import { BaseMessage } from '@sendbird/chat/message';
interface Props {
    className?: string | Array<string>;
    isByMe?: boolean;
    message: BaseMessage;
    mouseHover?: boolean;
    isReactionEnabled?: boolean;
}
export default function UnknownMessageItemBody({ className, message, isByMe, mouseHover, isReactionEnabled, }: Props): ReactElement;
export {};
// ===== ui/UserListItem/index.d.ts =====
import { ChangeEvent, MutableRefObject, ReactElement, ReactNode } from 'react';
import type { User } from '@sendbird/chat';
import type { GroupChannel, Member } from '@sendbird/chat/groupChannel';
import './index.scss';
import { UserListItemMenuProps } from '../UserListItemMenu/UserListItemMenu';
export interface UserListItemProps {
    user: User | Member;
    channel?: GroupChannel;
    className?: string;
    checked?: boolean;
    checkBox?: boolean;
    isOperator?: boolean;
    disabled?: boolean;
    disableMessaging?: boolean;
    /** @deprecated Doesn't need to fill this props */
    currentUser?: string;
    /** @deprecated Use the props `renderListItemMenu` instead */
    action?({ actionRef, parentRef }: {
        actionRef: MutableRefObject<any>;
        parentRef?: MutableRefObject<any>;
    }): ReactElement;
    onChange?(e: ChangeEvent<HTMLInputElement>): void;
    avatarSize?: string;
    /** @deprecated Please use the onUserAvatarClick instead */
    onClick?(): void;
    onUserAvatarClick?(): void;
    renderListItemMenu?: (props: UserListItemMenuProps) => ReactNode;
    size?: 'normal' | 'small';
}
export declare function UserListItem({ user, channel, className, checked, checkBox, isOperator, disabled, disableMessaging, action, onChange, avatarSize, onClick, onUserAvatarClick, renderListItemMenu, size, }: UserListItemProps): ReactElement;
export default UserListItem;
// ===== ui/UserListItemMenu/UserListItemMenu.d.ts =====
import React, { MutableRefObject, ReactElement } from 'react';
import type { ToggleMenuItemProps } from './UserListItemMenuItems';
import { UserListItemMenuProviderProps } from './context';
export type RenderUserListItemMenuItemsParams = {
    items: {
        OperatorToggleMenuItem: (props: ToggleMenuItemProps) => ReactElement;
        MuteToggleMenuItem: (props: ToggleMenuItemProps) => ReactElement;
        BanToggleMenuItem: (props: ToggleMenuItemProps) => ReactElement;
    };
};
export interface UserListItemMenuProps extends Omit<UserListItemMenuProviderProps, 'children' | 'hideMenu' | 'toggleMenu'> {
    className?: string;
    renderTrigger?: (props: {
        ref: MutableRefObject<any>;
        toggleMenu: () => void;
    }) => ReactElement;
    renderMenuItems?: (params: RenderUserListItemMenuItemsParams) => ReactElement;
}
export declare const UserListItemMenu: (props: UserListItemMenuProps) => React.JSX.Element;
export default UserListItemMenu;
// ===== ui/UserListItemMenu/UserListItemMenuItems.d.ts =====
import React, { ReactNode } from 'react';
import { MenuItemProps } from '../MessageMenu';
export interface ToggleMenuItemProps extends Omit<MenuItemProps, 'children'> {
    children?: ReactNode;
}
export declare const OperatorToggleMenuItem: (props: ToggleMenuItemProps) => React.JSX.Element;
export declare const MuteToggleMenuItem: (props: ToggleMenuItemProps) => React.JSX.Element;
export declare const BanToggleMenuItem: (props: ToggleMenuItemProps) => React.JSX.Element;
// ===== ui/UserListItemMenu/context.d.ts =====
import React, { ReactNode } from 'react';
import { type User } from '@sendbird/chat';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import { useToggleBan, useToggleMute, useToggleOperator } from './hooks';
interface UserListItemMenuContextInterface extends UserListItemMenuContextValues, ReturnType<typeof useToggleOperator>, ReturnType<typeof useToggleMute>, ReturnType<typeof useToggleBan> {
    isCurrentUser: boolean;
    isCurrentUserOperator: boolean;
}
export type OnToggleStateHandlerType = (params: {
    user: User;
    newStatus: boolean;
    error?: Error;
}) => void;
export interface UserListItemMenuContextValues {
    channel?: GroupChannel;
    user: User;
    hideMenu: () => void;
    toggleMenu: () => void;
    onToggleOperatorState?: OnToggleStateHandlerType;
    onToggleMuteState?: OnToggleStateHandlerType;
    onToggleBanState?: OnToggleStateHandlerType;
}
export interface UserListItemMenuProviderProps extends UserListItemMenuContextValues {
    children: ReactNode;
    isOperator?: boolean;
    isMuted?: boolean;
    isBanned?: boolean;
}
export declare const UserListItemMenuProvider: ({ children, ...values }: UserListItemMenuProviderProps) => React.JSX.Element;
export declare const useUserListItemMenuContext: () => UserListItemMenuContextInterface;
export {};
// ===== ui/UserListItemMenu/hooks.d.ts =====
import type { UserListItemMenuContextValues } from './context';
export declare const useToggleOperator: ({ channel, user, onToggleOperatorState, isOperator: _isOperator, }: UserListItemMenuContextValues & {
    isOperator?: boolean;
}) => {
    isOperator: boolean;
    toggleOperator: () => Promise<void>;
};
export declare const useToggleMute: ({ channel, user, onToggleMuteState, isMuted: _isMuted, }: UserListItemMenuContextValues & {
    isMuted?: boolean;
}) => {
    isMuted: boolean;
    toggleMute: () => Promise<void>;
};
export declare const useToggleBan: ({ channel, user, onToggleBanState, isBanned: _isBanned, }: UserListItemMenuContextValues & {
    isBanned?: boolean;
}) => {
    isBanned: boolean;
    toggleBan: () => Promise<void>;
};
// ===== ui/UserListItemMenu/index.d.ts =====
import UserListItemMenu from './UserListItemMenu';
export { UserListItemMenu } from './UserListItemMenu';
export { UserListItemMenuProvider, useUserListItemMenuContext } from './context';
export default UserListItemMenu;
// ===== ui/UserProfile/index.d.ts =====
import './index.scss';
import { ReactElement } from 'react';
import type { GroupChannel, GroupChannelCreateParams } from '@sendbird/chat/groupChannel';
import type { User } from '@sendbird/chat';
interface Logger {
    info?(message: string, channel: GroupChannel): void;
}
interface Props {
    user?: User | null;
    currentUserId?: string;
    logger?: Logger;
    disableMessaging?: boolean;
    createChannel?(params: GroupChannelCreateParams): Promise<GroupChannel>;
    onSuccess?: () => void;
}
declare function UserProfile({ user, currentUserId, disableMessaging, onSuccess, }: Props): ReactElement;
export default UserProfile;
// ===== ui/VoiceMessageInput/index.d.ts =====
import React from 'react';
import './index.scss';
import { VoiceMessageInputStatus } from './types';
export interface VoiceMessageInputProps {
    minRecordTime?: number;
    maximumValue: number;
    currentValue?: number;
    currentType: VoiceMessageInputStatus;
    onCancelClick?: () => void;
    onControlClick?: (type: VoiceMessageInputStatus) => void;
    onSubmitClick?: () => void;
    renderCancelButton?: () => React.ReactElement;
    renderControlButton?: (type: VoiceMessageInputStatus) => React.ReactElement;
    renderSubmitButton?: () => React.ReactElement;
}
export declare const VoiceMessageInput: ({ minRecordTime, maximumValue, currentValue, currentType, onCancelClick, onControlClick, onSubmitClick, renderCancelButton, renderControlButton, renderSubmitButton, }: VoiceMessageInputProps) => React.ReactElement;
// ===== ui/VoiceMessageInput/types.d.ts =====
export declare const VoiceMessageInputStatus: {
    readonly READY_TO_RECORD: "READY_TO_RECORD";
    readonly RECORDING: "RECORDING";
    readonly READY_TO_PLAY: "READY_TO_PLAY";
    readonly PLAYING: "PLAYING";
};
export type VoiceMessageInputStatus = typeof VoiceMessageInputStatus[keyof typeof VoiceMessageInputStatus];
// ===== ui/VoiceMessageItemBody/index.d.ts =====
import React from 'react';
import { FileMessage } from '@sendbird/chat/message';
import './index.scss';
export interface VoiceMessageItemBodyProps {
    className?: string;
    message: FileMessage;
    channelUrl: string;
    isByMe?: boolean;
    isReactionEnabled?: boolean;
}
export declare const VoiceMessageItemBody: ({ className, message, channelUrl, isByMe, isReactionEnabled, }: VoiceMessageItemBodyProps) => React.ReactElement;
export default VoiceMessageItemBody;
// ===== ui/Word/index.d.ts =====
/// <reference types="react" />
/**
 * @deprecated  This component is deprecated and will be removed in the next major version.
 * Use TextFragment instead.
 */
import './index.scss';
import type { UserMessage } from '@sendbird/chat/message';
import { StringObj } from '../../utils';
interface WordProps {
    word: string;
    message: UserMessage;
    isByMe?: boolean;
    mentionTemplate?: string;
    renderString?: (stringObj: StringObj) => JSX.Element;
}
export default function Word(props: WordProps): JSX.Element | null;
export {};
// ===== utils/color.d.ts =====
import './color.scss';
export declare enum Colors {
    ONBACKGROUND_1 = "ONBACKGROUND_1",
    ONBACKGROUND_2 = "ONBACKGROUND_2",
    ONBACKGROUND_3 = "ONBACKGROUND_3",
    ONBACKGROUND_4 = "ONBACKGROUND_4",
    ONCONTENT_1 = "ONCONTENT_1",
    PRIMARY = "PRIMARY",
    ERROR = "ERROR"
}
export declare const changeColorToClassName: (color: Colors) => string;
// ===== utils/exports/getOutgoingMessageState.d.ts =====
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { OpenChannel } from '@sendbird/chat/openChannel';
import { Nullable } from '../../types';
import { CoreMessageType } from '../index';
export declare enum OutgoingMessageStates {
    NONE = "NONE",
    PENDING = "PENDING",
    SENT = "SENT",
    FAILED = "FAILED",
    DELIVERED = "DELIVERED",
    READ = "READ"
}
export declare const getOutgoingMessageState: (channel: Nullable<GroupChannel | OpenChannel>, message: CoreMessageType | undefined | null) => OutgoingMessageStates;
// ===== utils/index.d.ts =====
import { Emoji, EmojiContainer, User } from '@sendbird/chat';
import { GroupChannel, GroupChannelListQuery, GroupChannelListOrder } from '@sendbird/chat/groupChannel';
import { AdminMessage, BaseMessage, FileMessage, MessageListParams, MultipleFilesMessage, Reaction, UploadedFileInfo, UserMessage } from '@sendbird/chat/message';
import { HTMLTextDirection, Nullable } from '../types';
import { TemplateType } from '../ui/TemplateMessageItemBody/types';
export declare const SUPPORTED_MIMES: {
    IMAGE: string[];
    VIDEO: string[];
    AUDIO: string[];
    DOCUMENT: string[];
    APPLICATION: string[];
    ARCHIVE: string[];
};
export declare const SUPPORTED_FILE_EXTENSIONS: {
    IMAGE: string[];
    VIDEO: string[];
    AUDIO: string[];
    DOCUMENT: string[];
    ARCHIVE: string[];
};
export declare const getMimeTypesUIKitAccepts: (acceptableTypes?: string[]) => string;
export declare const isFileAllowedByAccept: (file: File, acceptableMimeTypes?: string[]) => boolean;
export interface UIKitMessageTypes {
    ADMIN: 'ADMIN';
    TEXT: 'TEXT';
    FILE: 'FILE';
    MULTIPLE_FILES: 'MULTIPLE_FILES';
    THUMBNAIL: 'THUMBNAIL';
    OG: 'OG';
    UNKNOWN: 'UNKNOWN';
}
export declare const UIKitMessageTypes: UIKitMessageTypes;
export interface UIKitFileTypes {
    IMAGE: 'IMAGE';
    AUDIO: 'AUDIO';
    VIDEO: 'VIDEO';
    GIF: 'GIF';
    VOICE: 'VOICE';
    OTHERS: 'OTHERS';
}
export declare const UIKitFileTypes: UIKitFileTypes;
export interface SendingMessageStatus {
    NONE: 'none';
    SUCCEEDED: 'succeeded';
    FAILED: 'failed';
    PENDING: 'pending';
}
export type CoreMessageType = AdminMessage | UserMessage | FileMessage | MultipleFilesMessage;
export type SendableMessageType = UserMessage | FileMessage | MultipleFilesMessage;
export declare const isMOVType: (type: string) => boolean;
/**
 * @link: https://sendbird.atlassian.net/browse/SBISSUE-16031?focusedCommentId=270601
 * We limitedly support .mov file type for ThumbnailMessage only in Safari browser.
 * */
export declare const isSupportedVideoFileTypeInSafari: (type: string) => boolean;
export declare const isImage: (type: string) => boolean;
export declare const isVideo: (type: string) => boolean;
export declare const isGif: (type: string) => boolean;
export declare const isSupportedFileView: (type: string) => boolean;
export declare const isAudio: (type: string) => boolean;
export declare const getUIKitFileTypes: () => UIKitFileTypes;
export declare const getUIKitFileType: (type: string) => string;
export declare const isSentMessage: (message: SendableMessageType) => boolean;
export declare const isDeliveredMessage: (channel: GroupChannel, message: SendableMessageType) => boolean;
export declare const isReadMessage: (channel: GroupChannel, message: SendableMessageType) => boolean;
export declare const isFailedMessage: (message: SendableMessageType) => boolean;
export declare const isPendingMessage: (message: SendableMessageType) => boolean;
export declare const isSentStatus: (state: string) => boolean;
export declare const isAdminMessage: (message: CoreMessageType) => message is AdminMessage;
export declare const isUserMessage: (message: CoreMessageType) => message is UserMessage;
export declare const isFileMessage: (message?: CoreMessageType) => message is FileMessage;
export declare const isMultipleFilesMessage: (message?: CoreMessageType) => message is MultipleFilesMessage;
export declare const isParentMessage: (message: CoreMessageType) => boolean;
export declare const isThreadMessage: (message: CoreMessageType) => boolean;
/**
 * @deprecated This feature is deprecated and will be removed in May 2026.
 */
export declare const isFormMessage: (message: CoreMessageType) => boolean;
export declare const isTemplateMessage: (message: CoreMessageType) => boolean;
export declare const isValidTemplateMessageType: (templatePayload: unknown) => boolean;
export declare const MessageTemplateTypes: Record<TemplateType, TemplateType>;
export declare const uiContainerType: {
    default: string;
};
export declare const isOGMessage: (message: CoreMessageType) => message is UserMessage;
export declare const isTextMessage: (message: CoreMessageType) => message is UserMessage;
export declare const isThumbnailMessage: (message: CoreMessageType) => message is FileMessage;
export declare const isImageMessage: (message: SendableMessageType) => message is FileMessage;
export declare const isVideoMessage: (message: SendableMessageType) => message is FileMessage;
export declare const isGifMessage: (message: SendableMessageType) => message is FileMessage;
export declare const isAudioMessage: (message: CoreMessageType) => message is FileMessage;
export declare const isImageFileInfo: (fileInfo: UploadedFileInfo) => boolean;
export declare const isAudioMessageMimeType: (type: string) => boolean;
export declare const isVoiceMessageMimeType: (type: string) => boolean;
export declare const isVoiceMessage: (message: Nullable<CoreMessageType>) => boolean;
export declare const isEditedMessage: (message: CoreMessageType) => boolean;
export declare const isEnabledOGMessage: (message: UserMessage) => boolean;
export declare const getUIKitMessageTypes: () => UIKitMessageTypes;
/**
 * Do not use this for MultipleFilesMessage. Use isMultipleFilesMessage() instead.
 */
export declare const getUIKitMessageType: (message: CoreMessageType) => string;
/**
 * @deprecated use SendingStatus of @sendbird/chat instead
 * */
export declare const getSendingMessageStatus: () => SendingMessageStatus;
export declare const getClassName: (classNames: string | Array<string | Array<string>>) => string;
export declare const isReactedBy: (userId: string, reaction: Reaction) => boolean;
interface StringSet {
    TOOLTIP__YOU: string;
    TOOLTIP__AND_YOU: string;
    TOOLTIP__UNKNOWN_USER: string;
}
export declare const getEmojiTooltipString: (reaction: Reaction, userId: string, memberNicknamesMap: Map<string, string>, stringSet: StringSet) => string;
export declare function getSuggestedReplies(message?: BaseMessage): string[];
/** @deprecated
 * URL detection in a message text will be handled in utils/tokens/tokenize.ts
 */
export declare const isUrl: (text: string) => boolean;
export declare const truncateString: (fullStr: string, strLen?: number) => string;
export declare const copyToClipboard: (text: string) => boolean;
export declare const getEmojiListAll: (emojiContainer: EmojiContainer) => Array<Emoji>;
export declare const getEmojiMapAll: (emojiContainer: EmojiContainer) => Map<string, Emoji>;
export declare const getEmojiListByCategoryIds: (emojiContainer: EmojiContainer, categoryIds: number[]) => Array<Emoji>;
export declare const getEmojiUrl: (emojiContainer?: EmojiContainer, emojiKey?: string) => string;
export declare const getUserName: (user: User) => string;
export declare const getSenderName: (message: SendableMessageType) => string;
export declare const hasSameMembers: <T>(a: T[], b: T[]) => boolean;
export declare const isFriend: (user: Nullable<User>) => boolean;
export declare const filterMessageListParams: (params: MessageListParams, message: SendableMessageType) => boolean;
export declare const filterChannelListParams: (params: GroupChannelListQuery, channel: GroupChannel, currentUserId: string) => boolean;
export declare const sortChannelList: (channels: GroupChannel[], order: GroupChannelListOrder) => GroupChannel[];
/**
 * Upserts given channel to the channel list and then returns the sorted channel list.
 */
export declare const getChannelsWithUpsertedChannel: (_channels: Array<GroupChannel>, channel: GroupChannel, order?: GroupChannelListOrder) => Array<GroupChannel>;
export declare enum StringObjType {
    normal = "normal",
    mention = "mention",
    url = "url"
}
export interface StringObj {
    type: StringObjType;
    value: string;
    userId?: string;
}
/**
 * @deprecated
 * use modules/message/utils/tokenize instead
 */
export declare const convertWordToStringObj: (word: string, _users: Array<User>, _template?: string) => Array<StringObj>;
export declare const arrayEqual: (array1: Array<unknown>, array2: Array<unknown>) => boolean;
export declare const isSendableMessage: (message?: BaseMessage | null) => message is SendableMessageType;
/**
 * If the channel is just created, the channel's createdAt and currentUser's invitedAt are the same.
 */
export declare const isChannelJustCreated: (channel: GroupChannel) => boolean;
export declare const getHTMLTextDirection: (direction: HTMLTextDirection, forceLeftToRightMessageLayout: boolean) => string;
export declare const DEFAULT_GROUP_CHANNEL_NAME = "Group Channel";
export declare const DEFAULT_AI_CHATBOT_CHANNEL_NAME = "AI Chatbot Widget Channel";
export declare const isDefaultChannelName: (channel: GroupChannel) => boolean;
export {};
// ===== utils/isVoiceMessage.d.ts =====
export declare const isVoiceMessage: (message: import("./index").CoreMessageType) => boolean;
// ===== utils/messages.d.ts =====
import { type BaseMessage } from '@sendbird/chat/message';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import { ReplyType } from '../types';
import type { CoreMessageType } from '.';
import { StringSet } from '../ui/Label/stringSet';
/**
 * exported, should be backward compatible
 * @returns [chainTop: `boolean`, chainBottom: `boolean`]
 */
export declare const compareMessagesForGrouping: (prevMessage: CoreMessageType, currMessage: CoreMessageType, nextMessage: CoreMessageType, stringSet: StringSet, currentChannel?: GroupChannel | null, replyType?: ReplyType) => boolean[];
export declare const getMessageCreatedAt: (message: BaseMessage, stringSet: StringSet) => string;
export declare const isSameGroup: (message: CoreMessageType, comparingMessage: CoreMessageType, stringSet: StringSet, currentChannel?: GroupChannel) => boolean;
declare const _default: {
    compareMessagesForGrouping: (prevMessage: CoreMessageType, currMessage: CoreMessageType, nextMessage: CoreMessageType, stringSet: StringSet, currentChannel?: GroupChannel, replyType?: ReplyType) => boolean[];
    getMessageCreatedAt: (message: BaseMessage, stringSet: StringSet) => string;
    isSameGroup: (message: CoreMessageType, comparingMessage: CoreMessageType, stringSet: StringSet, currentChannel?: GroupChannel) => boolean;
};
export default _default;
// ===== utils/storeManager.d.ts =====
export type Store<T> = {
    getState: () => T;
    setState: (partial: Partial<T> | ((state: T) => Partial<T>), force?: boolean) => void;
    subscribe: (listener: () => void) => () => void;
};
export declare function hasStateChanged<T>(prevState: T, updates: Partial<T>): boolean;
/**
 * A custom store creation utility
 */
export declare function createStore<T extends object>(initialState: T): Store<T>;
// ===== utils/typeHelpers/objectValues.d.ts =====
/**
 * Converts an object to an enum
 * @param obj
 * @returns {ObjectValues<typeof obj>}
 *
 * const LOG_LEVEL = {
 *  INFO: 'INFO',
 *  WARN: 'WARN',
 *  ERROR: 'ERROR',
 * } as const;
 * type logLevel = ObjectValues<typeof LOG_LEVEL>;
 * both of the below options are valid
 * const logLevel: logLevel = LOG_LEVEL.INFO;
 * const logLevel: logLevel = 'INFO';
* */
export type ObjectValues<T> = T[keyof T];
// ===== utils/typeHelpers/partialDeep.d.ts =====
/**
 * PartialDeep enables partial deep cloning of objects or nested objects.
 * It recursively makes the properties of the given type optional,
 * allowing partial modification at any level of nesting.
 *
 * Use case:
 * When working with complex data structures, selectively modify properties of an object
 * while maintaining the original structure and values.
 *
 * Brought the simplified idea from https://github.com/sindresorhus/type-fest/blob/main/source/partial-deep.d.ts
 * */
export type PartialDeep<T> = T extends object ? T extends Set<unknown> ? T : T extends (...args: any[]) => any ? T : {
    [P in keyof T]?: PartialDeep<T[P]>;
} : T;
export type TwoDepthPartial<T> = T extends object ? T extends Set<unknown> ? T : T extends (...args: any[]) => any ? T : {
    [P in keyof T]?: Partial<T[P]>;
} : T;
// ===== utils/typeHelpers/partialRequired.d.ts =====
export type PartialRequired<T, RequiredKeys extends keyof T> = Partial<Omit<T, RequiredKeys>> & Required<Pick<T, RequiredKeys>>;
// ===== utils/typeHelpers/reducers/createAction.d.ts =====
/**
 * CreateAction
 * @param T - the payload types { [K]: T[K]}
 * @returns the union of all the payload as actionTypes { type: K, payload: T[K] }
 * Note, recommend to keep the payload as optional if the payload is null
 * Note, keep a const object of the action types to avoid typos
 * see README.md for more info
 */
export type CreateAction<T> = {
    [K in keyof T]: T[K] extends null ? {
        type: K;
        payload?: null;
    } : {
        type: K;
        payload: T[K];
    };
}[keyof T];
