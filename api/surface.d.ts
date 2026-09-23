// ===== public entry points =====
// App
// Channel
// Channel/components/ChannelHeader
// Channel/components/ChannelUI
// Channel/components/FileViewer
// Channel/components/FrozenNotification
// Channel/components/Message
// Channel/components/MessageInput
// Channel/components/MessageInputWrapper
// Channel/components/MessageList
// Channel/components/RemoveMessageModal
// Channel/components/SuggestedMentionList
// Channel/components/TypingIndicator
// Channel/components/UnreadCount
// Channel/context
// Channel/hooks/useHandleUploadFiles
// Channel/hooks/useInitialMessagesFetch
// Channel/utils/compareMessagesForGrouping
// Channel/utils/getMessagePartsInfo
// ChannelList
// ChannelList/components/AddChannel
// ChannelList/components/ChannelListHeader
// ChannelList/components/ChannelListUI
// ChannelList/components/ChannelPreview
// ChannelList/components/ChannelPreviewAction
// ChannelList/context
// ChannelSettings
// ChannelSettings/components/ChannelProfile
// ChannelSettings/components/ChannelSettingMenuList
// ChannelSettings/components/ChannelSettingsHeader
// ChannelSettings/components/ChannelSettingsMenuItem
// ChannelSettings/components/ChannelSettingsUI
// ChannelSettings/components/EditDetailsModal
// ChannelSettings/components/LeaveChannel
// ChannelSettings/components/ModerationPanel
// ChannelSettings/components/UserListItem
// ChannelSettings/components/UserPanel
// ChannelSettings/context
// ChannelSettings/hooks/useMenuList
// CreateChannel
// CreateChannel/components/CreateChannelUI
// CreateChannel/components/InviteUsers
// CreateChannel/components/SelectChannelType
// CreateChannel/context
// CreateOpenChannel
// CreateOpenChannel/components/CreateOpenChannelUI
// CreateOpenChannel/context
// EditUserProfile
// EditUserProfile/components/EditUserProfileUI
// EditUserProfile/context
// GroupChannel
// GroupChannel/components/FileViewer
// GroupChannel/components/FrozenNotification
// GroupChannel/components/GroupChannelHeader
// GroupChannel/components/GroupChannelUI
// GroupChannel/components/Message
// GroupChannel/components/MessageInputWrapper
// GroupChannel/components/MessageList
// GroupChannel/components/RemoveMessageModal
// GroupChannel/components/SuggestedMentionList
// GroupChannel/components/SuggestedReplies
// GroupChannel/components/TypingIndicator
// GroupChannel/components/UnreadCount
// GroupChannel/context
// GroupChannelList
// GroupChannelList/components/AddGroupChannel
// GroupChannelList/components/GroupChannelListHeader
// GroupChannelList/components/GroupChannelListItem
// GroupChannelList/components/GroupChannelListUI
// GroupChannelList/components/GroupChannelPreviewAction
// GroupChannelList/context
// Message/context
// Message/hooks/useDirtyGetMentions
// MessageSearch
// MessageSearch/components/MessageSearchUI
// MessageSearch/context
// OpenChannel
// OpenChannel/components/FrozenChannelNotification
// OpenChannel/components/OpenChannelHeader
// OpenChannel/components/OpenChannelInput
// OpenChannel/components/OpenChannelMessage
// OpenChannel/components/OpenChannelMessageList
// OpenChannel/components/OpenChannelUI
// OpenChannel/context
// OpenChannelList
// OpenChannelList/components/OpenChannelListUI
// OpenChannelList/components/OpenChannelPreview
// OpenChannelList/context
// OpenChannelSettings
// OpenChannelSettings/components/EditDetailsModal
// OpenChannelSettings/components/OpenChannelProfile
// OpenChannelSettings/components/OpenChannelSettingsUI
// OpenChannelSettings/components/OperatorUI
// OpenChannelSettings/components/ParticipantUI
// OpenChannelSettings/context
// SendbirdProvider
// Thread
// Thread/components/ParentMessageInfo
// Thread/components/ParentMessageInfoItem
// Thread/components/ThreadHeader
// Thread/components/ThreadList
// Thread/components/ThreadListItem
// Thread/components/ThreadMessageInput
// Thread/components/ThreadUI
// Thread/context
// Thread/context/types
// VoicePlayer/context
// VoicePlayer/useVoicePlayer
// VoiceRecorder/context
// VoiceRecorder/useVoiceRecorder
// handlers/ConnectionHandler
// handlers/GroupChannelHandler
// handlers/OpenChannelHandler
// handlers/SessionHandler
// handlers/UserEventHandler
// hooks/useConnectionState
// hooks/useLocalization
// hooks/useModal
// index
// lame.all
// pubSub/topics
// sendbirdSelectors
// ui/Accordion
// ui/AccordionGroup
// ui/AdminMessage
// ui/Avatar
// ui/Badge
// ui/BottomSheet
// ui/Button
// ui/ChannelAvatar
// ui/Checkbox
// ui/ConnectionStatus
// ui/ContextMenu
// ui/DateSeparator
// ui/EmojiReactions
// ui/FallbackTemplateMessageItemBody.tsx
// ui/FeedbackIconButton
// ui/FileMessageItemBody
// ui/FileViewer
// ui/Header
// ui/Icon
// ui/IconButton
// ui/ImageRenderer
// ui/Input
// ui/Label
// ui/LinkLabel
// ui/Loader
// ui/LoadingTemplateMessageItemBody.tsx
// ui/MentionLabel
// ui/MentionUserLabel
// ui/MessageContent
// ui/MessageFeedbackFailedModal
// ui/MessageFeedbackModal
// ui/MessageInput
// ui/MessageInput/hooks/usePaste
// ui/MessageItemMenu
// ui/MessageItemReactionMenu
// ui/MessageMenu
// ui/MessageSearchFileItem
// ui/MessageSearchItem
// ui/MessageStatus
// ui/MessageTemplate
// ui/MobileFeedbackMenu
// ui/MobileMenu
// ui/Modal
// ui/MutedAvatarOverlay
// ui/OGMessageItemBody
// ui/OpenChannelAdminMessage
// ui/OpenChannelAvatar
// ui/OpenchannelConversationHeader
// ui/OpenchannelFileMessage
// ui/OpenchannelOGMessage
// ui/OpenchannelThumbnailMessage
// ui/OpenchannelUserMessage
// ui/PlaceHolder
// ui/PlaybackTime
// ui/ProgressBar
// ui/QuoteMessage
// ui/QuoteMessageInput
// ui/ReactionBadge
// ui/ReactionButton
// ui/SortByRow
// ui/TemplateMessageItemBody
// ui/TextButton
// ui/TextMessageItemBody
// ui/ThreadReplies
// ui/ThumbnailMessageItemBody
// ui/Toggle
// ui/Tooltip
// ui/TooltipWrapper
// ui/TypingIndicatorBubble
// ui/UnknownMessageItemBody
// ui/UserListItem
// ui/UserListItemMenu
// ui/UserProfile
// ui/VoiceMessageInput
// ui/VoiceMessageItemBody
// ui/Word
// useSendbirdStateContext
// utils/message/getOutgoingMessageState
// utils/message/isVoiceMessage
// withSendbird
// ===== #Accordion =====
import React from 'react';
export declare const Accordion: ({ className, id, renderTitle, renderContent, renderFooter, }: AccordionProps) => React.JSX.Element;
// ===== #AccordionProps =====
import { ReactElement } from 'react';
export interface AccordionProps {
    className?: string;
    id: string;
    renderTitle?: () => ReactElement;
    renderContent?: () => ReactElement;
    renderFooter?: () => ReactElement;
}
// ===== #AppInfoStateType =====
export interface AppInfoStateType {
    messageTemplatesInfo?: MessageTemplatesInfo;
    /**
     * This represents template keys that are currently waiting for its fetch response.
     * Whenever initialized, request succeeds or fails, it needs to be updated.
     */
    waitingTemplateKeysMap: Record<string, WaitingTemplateKeyData>;
}
// ===== #AppInfoStore =====
export interface AppInfoStore {
    messageTemplatesInfo?: MessageTemplatesInfo;
    /**
     * This represents template keys that are currently waiting for its fetch response.
     * Whenever initialized, request succeeds or fails, it needs to be updated.
     */
    waitingTemplateKeysMap: Record<string, WaitingTemplateKeyData>;
}
// ===== #AppLayoutProps =====
import { User } from '@sendbird/chat';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { HTMLTextDirection } from '#HTMLTextDirection';
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
// ===== #AppProps~80cb9331 =====
import { User } from '@sendbird/chat';
import { Locale } from 'date-fns';
import { RenderUserProfileProps } from '#RenderUserProfileProps';
import { ReplyType } from '#ReplyType';
import { SendBirdProviderConfig } from '#SendBirdProviderConfig';
import { UserListQuery } from '#UserListQuery';
import { CustomExtensionParams } from '#CustomExtensionParams';
import { SBUEventHandlers } from '#SBUEventHandlers';
import { SendbirdChatInitParams } from '#SendbirdChatInitParams';
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
// ===== #ApplicationUserListQuery =====
interface ApplicationUserListQuery {
    limit?: number;
    userIdsFilter?: Array<string>;
    metaDataKeyFilter?: string;
    metaDataValuesFilter?: Array<string>;
}
// ===== #AudioStorageUnit =====
export type AudioStorageUnit = {
    playingStatus: VoicePlayerStatusType;
    audioFile: null | File;
    playbackTime: number;
    duration: number;
};
// ===== #AudioUnitDefaultValue =====
export declare const AudioUnitDefaultValue: () => AudioStorageUnit;
// ===== #BanToggleMenuItem =====
import React from 'react';
export declare const BanToggleMenuItem: (props: ToggleMenuItemProps) => React.JSX.Element;
// ===== #BannedMemberList =====
import { ReactElement } from 'react';
/** @deprecated Use the BannedUserList instead */
export declare const BannedMemberList: ({ renderUserListItem, bannedUserListQueryParams, }: BannedUserListProps) => ReactElement;
// ===== #BannedUserList =====
import { ReactElement } from 'react';
export declare const BannedUserList: ({ renderUserListItem, bannedUserListQueryParams, }: BannedUserListProps) => ReactElement;
// ===== #BannedUserListProps =====
import { ReactNode } from 'react';
import { BannedUserListQueryParams } from '@sendbird/chat';
import { UserListItemProps } from '#UserListItemProps';
interface BannedUserListProps {
    renderUserListItem?: (props: UserListItemProps) => ReactNode;
    bannedUserListQueryParams?: BannedUserListQueryParams;
}
// ===== #BaseMenuProps =====
import React from 'react';
import { MouseEvent } from 'react';
import { ReactNode } from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { OpenChannel } from '@sendbird/chat/openChannel';
import { CoreMessageType } from '#CoreMessageType';
import { SendableMessageType } from '#SendableMessageType';
import { ReplyType } from '#ReplyType';
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
// ===== #BaseViewer =====
import { MouseEvent } from 'react';
export interface BaseViewer {
    onClose: (e: React.MouseEvent | React.KeyboardEvent) => void;
}
// ===== #BottomSheetMenuItem =====
import React from 'react';
export declare const BottomSheetMenuItem: ({ className, disabled, tabIndex, testID, onClick, children, }: MenuItemProps) => React.JSX.Element;
// ===== #ButtonSizes =====
export declare enum ButtonSizes {
    BIG = "BIG",
    SMALL = "SMALL"
}
// ===== #ButtonTypes =====
export declare enum ButtonTypes {
    PRIMARY = "PRIMARY",
    SECONDARY = "SECONDARY",
    DANGER = "DANGER",
    DISABLED = "DISABLED",
    WARNING = "WARNING"
}
// ===== #CHANNEL_LIST_PARAMS_UPDATED =====
export declare const CHANNEL_LIST_PARAMS_UPDATED = "CHANNEL_LIST_PARAMS_UPDATED";
// ===== #CHANNEL_LIST_PAYLOAD_TYPES =====
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { GroupChannelListQuery } from '@sendbird/chat/groupChannel';
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
// ===== #CHANNEL_PAYLOAD_TYPES =====
import { EmojiContainer } from '@sendbird/chat';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { Member } from '@sendbird/chat/groupChannel';
import { ReactionEvent } from '@sendbird/chat/message';
import { MessageListParams } from '#MessageListParams';
import { CoreMessageType } from '#CoreMessageType';
import { SendableMessageType } from '#SendableMessageType';
import { FileUploadedPayload } from '#FileUploadedPayload';
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
// ===== #CHANNEL_TYPE =====
export declare enum CHANNEL_TYPE {
    GROUP = "group",
    SUPERGROUP = "supergroup",
    BROADCAST = "broadcast"
}
// ===== #CREATE_CHANNEL =====
export declare const CREATE_CHANNEL = "CREATE_CHANNEL";
// ===== #CallbackReturn =====
import { BaseMessage } from '@sendbird/chat/message';
export type CallbackReturn = (callback: (...args: [messages: BaseMessage[], error: null] | [messages: null, error: any]) => void) => void;
// ===== #ChannelActionTypes =====
import { CreateAction } from '#CreateAction';
export type ChannelActionTypes = CreateAction<CHANNEL_PAYLOAD_TYPES>;
// ===== #ChannelListActionTypes =====
import { CreateAction } from '#CreateAction';
export type ChannelListActionTypes = CreateAction<CHANNEL_LIST_PAYLOAD_TYPES>;
// ===== #ChannelListDataSource =====
import { useGroupChannelList as useGroupChannelListDataSource } from '@sendbird/uikit-tools';
type ChannelListDataSource = ReturnType<typeof useGroupChannelListDataSource>;
// ===== #ChannelListQueryParamsType =====
import { GroupChannelFilterParams } from '@sendbird/chat/groupChannel';
import { GroupChannelCollectionParams } from '@sendbird/chat/groupChannel';
export type ChannelListQueryParamsType = Omit<GroupChannelCollectionParams, 'filter'> & GroupChannelFilterParams;
// ===== #ChannelSettingsContext =====
import React from 'react';
import { ChannelSettingsState } from '#ChannelSettingsState';
export declare const ChannelSettingsContext: React.Context<import("#Store").Store<ChannelSettingsState>>;
// ===== #ChannelSettingsContextProps =====
import { ReactNode } from 'react';
import { UserProfileProviderProps } from '#UserProfileProviderProps';
export interface ChannelSettingsContextProps extends CommonChannelSettingsProps, Pick<UserProfileProviderProps, 'renderUserProfile' | 'disableUserProfile'> {
    children?: ReactNode;
    className?: string;
}
// ===== #ChannelSettingsProvider =====
import React from 'react';
import { ChannelSettingsContextProps } from '#ChannelSettingsContextProps';
declare const ChannelSettingsProvider: (props: ChannelSettingsContextProps) => React.JSX.Element;
// ===== #ChannelSettingsQueries =====
export interface ChannelSettingsQueries {
    applicationUserListQuery?: ApplicationUserListQuery;
}
// ===== #ChannelSettingsState =====
import { GroupChannel } from '@sendbird/chat/groupChannel';
export interface ChannelSettingsState extends CommonChannelSettingsProps {
    channel: GroupChannel | null;
    loading: boolean;
    invalidChannel: boolean;
    forceUpdateUI(): void;
    setChannelUpdateId(uniqId: string): void;
}
// ===== #ChannelURL =====
type ChannelURL = string;
// ===== #ClientAdminMessage =====
import { AdminMessage } from '@sendbird/chat/message';
export interface ClientAdminMessage extends AdminMessage, ClientMessage {
}
// ===== #ClientFileMessage =====
import { FileMessage } from '@sendbird/chat/message';
export interface ClientFileMessage extends FileMessage, ClientMessage {
}
// ===== #ClientMessage =====
import { User } from '@sendbird/chat';
export interface ClientMessage {
    reqId: string;
    file?: File;
    localUrl?: string;
    _sender: User;
}
// ===== #ClientMultipleFilesMessage =====
import { MultipleFilesMessage } from '@sendbird/chat/message';
export interface ClientMultipleFilesMessage extends MultipleFilesMessage, ClientMessage {
}
// ===== #ClientSentMessages =====
export type ClientSentMessages = ClientUserMessage | ClientFileMessage | ClientMultipleFilesMessage;
// ===== #ClientUserMessage =====
import { UserMessage } from '@sendbird/chat/message';
export interface ClientUserMessage extends UserMessage, ClientMessage {
}
// ===== #Colors~10b20cc3 =====
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
// ===== #Colors~49ff6d60 =====
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
// ===== #Colors~9177c283 =====
export declare enum Colors {
    ONBACKGROUND_1 = "ONBACKGROUND_1",
    ONBACKGROUND_2 = "ONBACKGROUND_2",
    ONBACKGROUND_3 = "ONBACKGROUND_3",
    ONBACKGROUND_4 = "ONBACKGROUND_4",
    ONCONTENT_1 = "ONCONTENT_1",
    PRIMARY = "PRIMARY",
    ERROR = "ERROR"
}
// ===== #CommonChannelSettingsProps =====
import { ReactNode } from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { GroupChannelUpdateParams } from '@sendbird/chat/groupChannel';
import { UserListItemProps } from '#UserListItemProps';
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
// ===== #CommonMessageMenuContextProps =====
import { MutableRefObject } from 'react';
import { SendableMessageType } from '#SendableMessageType';
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
// ===== #CommonUIKitConfigProps =====
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
// ===== #ConfigureSessionTypes =====
import SendbirdChat from '@sendbird/chat';
import { SessionHandler } from '@sendbird/chat';
import { SendbirdGroupChat } from '@sendbird/chat/groupChannel';
import { SendbirdOpenChat } from '@sendbird/chat/openChannel';
export type ConfigureSessionTypes = (sdk: SendbirdChat | SendbirdGroupChat | SendbirdOpenChat) => SessionHandler;
// ===== #ContextBaseType =====
import { User } from '@sendbird/chat';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { GroupChannelCreateParams } from '@sendbird/chat/groupChannel';
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
// ===== #CopyMenuItem =====
import React from 'react';
export declare const CopyMenuItem: (props: PrebuildMenuItemPropsType) => React.JSX.Element;
// ===== #CoreMessageType =====
import { AdminMessage } from '@sendbird/chat/message';
import { FileMessage } from '@sendbird/chat/message';
import { MultipleFilesMessage } from '@sendbird/chat/message';
import { UserMessage } from '@sendbird/chat/message';
export type CoreMessageType = AdminMessage | UserMessage | FileMessage | MultipleFilesMessage;
// ===== #CreateAction =====
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
// ===== #CreateChannelContext =====
import React from 'react';
declare const CreateChannelContext: React.Context<import("#Store").Store<CreateChannelState>>;
// ===== #CreateChannelProvider =====
import React from 'react';
declare const CreateChannelProvider: React.FC<CreateChannelProviderProps>;
// ===== #CreateChannelProviderProps =====
import React from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { GroupChannelCreateParams } from '@sendbird/chat/groupChannel';
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
// ===== #CreateChannelState =====
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { GroupChannelCreateParams } from '@sendbird/chat/groupChannel';
import { CHANNEL_TYPE } from '#CHANNEL_TYPE';
import { SendbirdChatType } from '#SendbirdChatType';
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
// ===== #CustomExtensionParams =====
export type CustomExtensionParams = Record<string, string>;
// ===== #CustomSubcomponentsProps =====
export type CustomSubcomponentsProps = Record<'ThumbnailMessageItemBody' | 'MultipleFilesMessageItemBody', Record<string, any>>;
// ===== #CustomUseReducerDispatcher =====
import React from 'react';
export type CustomUseReducerDispatcher = React.Dispatch<{
    type: string;
    payload: any;
}>;
// ===== #DEFAULT_AI_CHATBOT_CHANNEL_NAME =====
export declare const DEFAULT_AI_CHATBOT_CHANNEL_NAME = "AI Chatbot Widget Channel";
// ===== #DEFAULT_GROUP_CHANNEL_NAME =====
export declare const DEFAULT_GROUP_CHANNEL_NAME = "Group Channel";
// ===== #DeleteMenuItem =====
import React from 'react';
export declare const DeleteMenuItem: (props: PrebuildMenuItemPropsType) => React.JSX.Element;
// ===== #DeleteMenuStates =====
export type DeleteMenuStates = 'DISABLE' | 'HIDE' | 'ACTIVE';
// ===== #DesktopLayoutProps =====
export interface DesktopLayoutProps extends AppLayoutProps, SubLayoutCommonProps {
    showSettings: boolean;
    setShowSettings: React.Dispatch<boolean>;
    showSearch: boolean;
    setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
    showThread: boolean;
    setShowThread: React.Dispatch<boolean>;
}
// ===== #DynamicParams~5168e5b3 =====
import { OpenChannelListQuery } from '@sendbird/chat/openChannel';
interface DynamicParams {
    sdkInitialized: boolean;
    openChannelListQuery: OpenChannelListQuery;
}
// ===== #DynamicParams~5195adaa =====
interface DynamicParams {
    isConnected: boolean;
}
// ===== #DynamicProps~026dcb21 =====
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { FileMessageCreateParams } from '@sendbird/chat/message';
import { SendableMessageType } from '#SendableMessageType';
interface DynamicProps {
    currentChannel: GroupChannel | null;
    onBeforeSendFileMessage?: (file: File, quotedMessage?: SendableMessageType) => FileMessageCreateParams;
    sendMessageStart: (message: SendableMessageType) => void;
    sendMessageFailure: (message: SendableMessageType) => void;
}
// ===== #DynamicProps~d16f7a6f =====
import { User } from '@sendbird/chat';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { OpenChannel } from '@sendbird/chat/openChannel';
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
// ===== #EditMenuItem =====
import React from 'react';
export declare const EditMenuItem: (props: PrebuildMenuItemPropsType) => React.JSX.Element;
// ===== #EditUserProfileUIView =====
import React from 'react';
export declare const EditUserProfileUIView: ({ formRef, inputRef, onThemeChange, setProfileImage, }: EditUserProfileUIViewProps) => React.JSX.Element;
// ===== #EditUserProfileUIViewProps =====
import { Dispatch } from 'react';
import { MutableRefObject } from 'react';
export interface EditUserProfileUIViewProps {
    formRef: MutableRefObject<any>;
    inputRef: MutableRefObject<any>;
    setProfileImage: Dispatch<File | null>;
    onThemeChange?: (theme: string) => void;
}
// ===== #EmojiListItemsProps =====
import { ReactNode } from 'react';
import { RefObject } from 'react';
export interface EmojiListItemsProps {
    id?: string;
    closeDropdown: () => void;
    children: ReactNode;
    parentRef: RefObject<HTMLDivElement>;
    parentContainRef: RefObject<HTMLDivElement>;
    spaceFromTrigger?: SpaceFromTrigger;
}
// ===== #EmojiListItems~c8e6edc3 =====
import { ReactElement } from 'react';
import { Nullable } from '#Nullable';
export declare const EmojiListItems: ({ id, children, parentRef, parentContainRef, spaceFromTrigger, closeDropdown, }: EmojiListItemsProps) => Nullable<ReactElement>;
// ===== #EmojiManager =====
import { Emoji } from '@sendbird/chat';
import { EmojiContainer } from '@sendbird/chat';
import { Reaction } from '@sendbird/chat/message';
export declare class EmojiManager {
    private _emojiContainer;
    constructor(props: EmojiManagerParams);
    private get AllEmojisAsArray();
    private get AllEmojisAsMap();
    getAllEmojis(type: string): Emoji[] | Map<string, string>;
    getEmojiUrl(reactionKey: Reaction['key']): string;
    get emojiContainer(): EmojiContainer;
}
// ===== #EmojiManagerParams =====
import { Logger } from '#Logger~6cebce76';
import { SendbirdChatType } from '#SendbirdChatType';
export interface EmojiManagerParams {
    sdk: SendbirdChatType;
    logger?: Logger;
}
// ===== #EveryMessage =====
export type EveryMessage = ClientUserMessage | ClientFileMessage | ClientMultipleFilesMessage | ClientAdminMessage;
// ===== #FETCH_CHANNELS_FAILURE =====
export declare const FETCH_CHANNELS_FAILURE = "FETCH_CHANNELS_FAILURE";
// ===== #FETCH_CHANNELS_START =====
export declare const FETCH_CHANNELS_START = "FETCH_CHANNELS_START";
// ===== #FETCH_CHANNELS_SUCCESS =====
export declare const FETCH_CHANNELS_SUCCESS = "FETCH_CHANNELS_SUCCESS";
// ===== #FETCH_INITIAL_MESSAGES_FAILURE =====
export declare const FETCH_INITIAL_MESSAGES_FAILURE = "FETCH_INITIAL_MESSAGES_FAILURE";
// ===== #FETCH_INITIAL_MESSAGES_START =====
export declare const FETCH_INITIAL_MESSAGES_START = "FETCH_INITIAL_MESSAGES_START";
// ===== #FETCH_INITIAL_MESSAGES_SUCCESS =====
export declare const FETCH_INITIAL_MESSAGES_SUCCESS = "FETCH_INITIAL_MESSAGES_SUCCESS";
// ===== #FETCH_NEXT_MESSAGES_FAILURE =====
export declare const FETCH_NEXT_MESSAGES_FAILURE = "FETCH_NEXT_MESSAGES_FAILURE";
// ===== #FETCH_NEXT_MESSAGES_SUCCESS =====
export declare const FETCH_NEXT_MESSAGES_SUCCESS = "FETCH_NEXT_MESSAGES_SUCCESS";
// ===== #FETCH_PREV_MESSAGES_FAILURE =====
export declare const FETCH_PREV_MESSAGES_FAILURE = "FETCH_PREV_MESSAGES_FAILURE";
// ===== #FETCH_PREV_MESSAGES_SUCCESS =====
export declare const FETCH_PREV_MESSAGES_SUCCESS = "FETCH_PREV_MESSAGES_SUCCESS";
// ===== #FetchNextCallbackType =====
import { SendbirdError } from '@sendbird/chat';
import { OpenChannel } from '@sendbird/chat/openChannel';
export type FetchNextCallbackType = (callback: (channels?: Array<OpenChannel>, err?: SendbirdError) => void) => void;
// ===== #FileInfo =====
export interface FileInfo {
    name: string;
    type: string;
    url: string;
}
// ===== #FileUploadedPayload =====
import { UploadableFileInfo } from '@sendbird/chat/message';
export interface FileUploadedPayload {
    channelUrl: string;
    requestId: string;
    index: number;
    uploadableFileInfo: UploadableFileInfo;
    error: Error;
}
// ===== #FileViewerComponentProps =====
export type FileViewerComponentProps = SingleFileViewer | MultiFilesViewer;
// ===== #GroupChannelActions =====
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { SendbirdError } from '@sendbird/chat';
import { FileMessage } from '@sendbird/chat/message';
import { FileMessageCreateParams } from '@sendbird/chat/message';
import { MultipleFilesMessage } from '@sendbird/chat/message';
import { MultipleFilesMessageCreateParams } from '@sendbird/chat/message';
import { UserMessage } from '@sendbird/chat/message';
import { UserMessageCreateParams } from '@sendbird/chat/message';
import { UserMessageUpdateParams } from '@sendbird/chat/message';
import { SendableMessageType } from '#SendableMessageType';
import { MessageActions } from '#MessageActions~46cfb399';
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
// ===== #GroupChannelContext =====
import React from 'react';
import { GroupChannelState } from '#GroupChannelState';
export declare const GroupChannelContext: React.Context<import("#Store").Store<GroupChannelState>>;
// ===== #GroupChannelListContext =====
import React from 'react';
export declare const GroupChannelListContext: React.Context<import("#Store").Store<GroupChannelListState>>;
// ===== #GroupChannelListContextType =====
import React from 'react';
export interface GroupChannelListContextType extends ContextBaseType, ChannelListDataSource {
    typingChannelUrls: string[];
    scrollRef: React.RefObject<HTMLDivElement>;
}
// ===== #GroupChannelListItemBasicProps =====
import React from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { GroupChannelPreviewActionProps } from '#GroupChannelPreviewActionProps';
export interface GroupChannelListItemBasicProps {
    tabIndex: number;
    channel: GroupChannel;
    onClick: () => void;
    renderChannelAction: (props: GroupChannelPreviewActionProps) => React.ReactElement;
    isSelected?: boolean;
    isTyping?: boolean;
    onLeaveChannel?: () => Promise<void>;
}
// ===== #GroupChannelListItemView =====
import React from 'react';
export declare const GroupChannelListItemView: ({ channel, tabIndex, isTyping, isSelected, channelName, isMessageStatusEnabled, onClick, onLeaveChannel, renderChannelAction, }: GroupChannelListItemViewProps) => React.JSX.Element;
// ===== #GroupChannelListItemViewProps =====
export interface GroupChannelListItemViewProps extends GroupChannelListItemBasicProps {
    channelName: string;
    isMessageStatusEnabled?: boolean;
}
// ===== #GroupChannelListManager =====
import React from 'react';
export declare const GroupChannelListManager: React.FC<GroupChannelListProviderProps>;
// ===== #GroupChannelListProvider =====
import React from 'react';
export declare const GroupChannelListProvider: (props: GroupChannelListProviderProps) => React.JSX.Element;
// ===== #GroupChannelListProviderProps =====
import React from 'react';
import { UserProfileProviderProps } from '#UserProfileProviderProps';
import { PartialRequired } from '#PartialRequired';
export interface GroupChannelListProviderProps extends PartialRequired<ContextBaseType, 'onChannelSelect' | 'onChannelCreated'>, Pick<UserProfileProviderProps, 'onUserProfileMessage' | 'onStartDirectMessage' | 'renderUserProfile' | 'disableUserProfile'> {
    children?: React.ReactNode;
}
// ===== #GroupChannelListState =====
export interface GroupChannelListState extends GroupChannelListContextType {
}
// ===== #GroupChannelManager =====
import React from 'react';
import { GroupChannelProviderProps } from '#GroupChannelProviderProps';
declare const GroupChannelManager: React.FC<React.PropsWithChildren<GroupChannelProviderProps>>;
// ===== #GroupChannelProvider =====
import React from 'react';
import { GroupChannelProviderProps } from '#GroupChannelProviderProps';
declare const GroupChannelProvider: React.FC<GroupChannelProviderProps>;
// ===== #GroupChannelProviderProps =====
import { EmojiCategory } from '@sendbird/chat';
import { User } from '@sendbird/chat';
import { FileMessageCreateParams } from '@sendbird/chat/message';
import { MultipleFilesMessageCreateParams } from '@sendbird/chat/message';
import { UserMessageCreateParams } from '@sendbird/chat/message';
import { UserMessageUpdateParams } from '@sendbird/chat/message';
import { SendableMessageType } from '#SendableMessageType';
import { UserProfileProviderProps } from '#UserProfileProviderProps';
import { ReplyType } from '#ReplyType';
import { ThreadReplySelectType } from '#ThreadReplySelectType';
import { PropsWithChildren } from 'react';
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
// ===== #GroupChannelState =====
export interface GroupChannelState extends GroupChannelProviderProps, Omit<InternalGroupChannelState, keyof GroupChannelProviderProps> {
}
// ===== #GroupChannelUIBasicProps =====
import React from 'react';
import { RenderCustomSeparatorProps } from '#RenderCustomSeparatorProps';
import { RenderMessageParamsType } from '#RenderMessageParamsType';
import { GroupChannelHeaderProps } from '#GroupChannelHeaderProps';
import { GroupChannelMessageListProps } from '#GroupChannelMessageListProps';
import { MessageContentProps } from '#MessageContentProps';
import { SuggestedRepliesProps } from '#SuggestedRepliesProps';
import { TypingIndicatorBubbleProps } from '#TypingIndicatorBubbleProps';
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
// ===== #GroupChannelUIView =====
import React from 'react';
export declare const GroupChannelUIView: (props: GroupChannelUIViewProps) => React.JSX.Element;
// ===== #GroupChannelUIViewProps =====
export interface GroupChannelUIViewProps extends GroupChannelUIBasicProps {
    isLoading?: boolean;
    isInvalid: boolean;
    channelUrl: string;
    renderChannelHeader: GroupChannelUIBasicProps['renderChannelHeader'];
    renderMessageList: GroupChannelUIBasicProps['renderMessageList'];
    renderMessageInput: GroupChannelUIBasicProps['renderMessageInput'];
}
// ===== #GroupKey =====
export type GroupKey = string;
// ===== #HTMLTextDirection =====
export type HTMLTextDirection = 'ltr' | 'rtl';
// ===== #INIT_CHANNELS_FAILURE =====
export declare const INIT_CHANNELS_FAILURE = "INIT_CHANNELS_FAILURE";
// ===== #INIT_CHANNELS_START =====
export declare const INIT_CHANNELS_START = "INIT_CHANNELS_START";
// ===== #INIT_CHANNELS_SUCCESS =====
export declare const INIT_CHANNELS_SUCCESS = "INIT_CHANNELS_SUCCESS";
// ===== #INVITE_MEMBERS_SUCESS =====
export declare const INVITE_MEMBERS_SUCESS = "INVITE_MEMBERS_SUCESS";
// ===== #ImageCompressionOptions =====
export interface ImageCompressionOptions {
    compressionRate?: number;
    resizingWidth?: number | string;
    resizingHeight?: number | string;
    outputFormat?: ImageCompressionOutputFormatType;
}
// ===== #ImageCompressionOutputFormatType =====
export type ImageCompressionOutputFormatType = 'preserve' | 'png' | 'jpeg';
// ===== #InternalGroupChannelProvider =====
import React from 'react';
import { GroupChannelProviderProps } from '#GroupChannelProviderProps';
export declare const InternalGroupChannelProvider: (props: GroupChannelProviderProps) => React.JSX.Element;
// ===== #InternalGroupChannelState =====
import { SendbirdError } from '@sendbird/chat';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { PubSubTypes } from '#PubSubTypes';
import { ScrollTopicUnion } from '#ScrollTopicUnion';
import { ScrollTopics } from '#ScrollTopics';
import { SendableMessageType } from '#SendableMessageType';
import { ReplyType } from '#ReplyType';
import { ThreadReplySelectType } from '#ThreadReplySelectType';
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
// ===== #InternalThreadProvider =====
import React from 'react';
export declare const InternalThreadProvider: React.FC<React.PropsWithChildren<unknown>>;
// ===== #LEAVE_CHANNEL_SUCCESS =====
export declare const LEAVE_CHANNEL_SUCCESS = "LEAVE_CHANNEL_SUCCESS";
// ===== #LOG_LEVELS =====
export declare const LOG_LEVELS: {
    readonly DEBUG: "debug";
    readonly WARNING: "warning";
    readonly ERROR: "error";
    readonly INFO: "info";
    readonly ALL: "all";
};
// ===== #LocalFilePreview =====
export interface LocalFilePreview {
    localUrl: string;
    file: File;
}
// ===== #LocalizationContext =====
import React from 'react';
import { StringSet } from '#StringSet~cb28c5f7';
import { Locale } from 'date-fns';
declare const LocalizationContext: React.Context<{
    stringSet: StringSet;
    dateLocale: globalThis.Locale;
}>;
// ===== #LocalizationProvider =====
import React from 'react';
declare const LocalizationProvider: (props: LocalizationProviderProps) => React.ReactElement;
// ===== #LocalizationProviderProps =====
import React from 'react';
import { StringSet } from '#StringSet~cb28c5f7';
import { Locale } from 'date-fns';
interface LocalizationProviderProps {
    stringSet: StringSet;
    dateLocale?: Locale;
    children: React.ReactElement;
}
// ===== #LogLevel =====
import { ObjectValues } from '#ObjectValues';
export type LogLevel = ObjectValues<typeof LOG_LEVELS>;
// ===== #LoggerFactory =====
export declare const LoggerFactory: (lvl: LogLevel, customInterface?: () => void) => LoggerInterface;
// ===== #LoggerInterface =====
export interface LoggerInterface {
    info(title?: string, ...payload: unknown[]): void;
    error(title?: string, ...payload: unknown[]): void;
    warning(title?: string, ...payload: unknown[]): void;
}
// ===== #Logger~6cebce76 =====
import { LoggerInterface } from '#LoggerInterface';
export type Logger = LoggerInterface;
// ===== #MARK_AS_READ =====
export declare const MARK_AS_READ = "MARK_AS_READ";
// ===== #MARK_AS_UNREAD =====
export declare const MARK_AS_UNREAD = "MARK_AS_UNREAD";
// ===== #MAX_USER_MENTION_COUNT =====
export declare const MAX_USER_MENTION_COUNT = 10;
// ===== #MAX_USER_SUGGESTION_COUNT =====
export declare const MAX_USER_SUGGESTION_COUNT = 15;
// ===== #MESSAGE_LIST_PARAMS_CHANGED =====
export declare const MESSAGE_LIST_PARAMS_CHANGED = "MESSAGE_LIST_PARAMS_CHANGED";
// ===== #MODAL_ROOT =====
export declare const MODAL_ROOT = "sendbird-modal-root";
// ===== #MainProps =====
import { SendbirdError } from '@sendbird/chat';
import { CoreMessageType } from '#CoreMessageType';
interface MainProps {
    onResultLoaded?: (messages?: Array<CoreMessageType> | null, error?: SendbirdError | null) => void;
}
// ===== #MarkAsDeliveredSchedulerType =====
import { GroupChannel } from '@sendbird/chat/groupChannel';
export type MarkAsDeliveredSchedulerType = {
    push: (channel: GroupChannel) => void;
    clear: () => void;
    getQueue: () => GroupChannel[];
};
// ===== #MarkAsReadSchedulerType =====
import { GroupChannel } from '@sendbird/chat/groupChannel';
export type MarkAsReadSchedulerType = {
    push: (channel: GroupChannel) => void;
    clear: () => void;
    getQueue: () => GroupChannel[];
};
// ===== #MarkAsUnreadMenuItem =====
import React from 'react';
export declare const MarkAsUnreadMenuItem: (props: PrebuildMenuItemPropsType) => React.JSX.Element;
// ===== #MemberList =====
import { ReactElement } from 'react';
export declare const MemberList: ({ renderUserListItem, memberListQueryParams, }: MemberListProps) => ReactElement;
// ===== #MemberListProps =====
import { ReactNode } from 'react';
import { MemberListQueryParams } from '@sendbird/chat/groupChannel';
import { UserListItemProps } from '#UserListItemProps';
interface MemberListProps {
    renderUserListItem?: (props: UserListItemProps & {
        index: number;
    }) => ReactNode;
    memberListQueryParams?: MemberListQueryParams;
}
// ===== #MenuItemProps~31290fbd =====
import { MouseEvent } from 'react';
import { ReactNode } from 'react';
export interface MenuItemProps {
    className?: string;
    disabled?: boolean;
    tabIndex?: number;
    testID?: string;
    onClick?: (e: MouseEvent<HTMLLIElement | HTMLDivElement>) => void;
    children: ReactNode;
}
// ===== #MenuItemsProps =====
import React from 'react';
import { ReactElement } from 'react';
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
// ===== #MenuItemsState =====
interface MenuItemsState {
    menuStyle: MenuStyleType;
    handleClickOutside: (e: MouseEvent) => void;
}
// ===== #MenuItems~ffd38300 =====
import React from 'react';
import { ReactElement } from 'react';
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
// ===== #MenuItem~f655d1aa =====
import React from 'react';
export declare const MenuItem: ({ className, disabled, tabIndex, testID, onClick, children, }: MenuItemProps) => React.JSX.Element;
// ===== #MenuStyleType =====
type MenuStyleType = {
    top: number;
    left: number;
};
// ===== #MessageActions~46cfb399 =====
import { useMessageActions } from '#useMessageActions';
export type MessageActions = ReturnType<typeof useMessageActions>;
// ===== #MessageActions~5f3f5e99 =====
import { FileMessage } from '@sendbird/chat/message';
import { FileMessageCreateParams } from '@sendbird/chat/message';
import { MultipleFilesMessage } from '@sendbird/chat/message';
import { MultipleFilesMessageCreateParams } from '@sendbird/chat/message';
import { UserMessage } from '@sendbird/chat/message';
import { UserMessageCreateParams } from '@sendbird/chat/message';
import { UserMessageUpdateParams } from '@sendbird/chat/message';
type MessageActions = {
    sendUserMessage: (params: UserMessageCreateParams) => Promise<UserMessage>;
    sendFileMessage: (params: FileMessageCreateParams) => Promise<FileMessage>;
    sendVoiceMessage: (params: FileMessageCreateParams, duration: number) => Promise<FileMessage>;
    sendMultipleFilesMessage: (params: MultipleFilesMessageCreateParams) => Promise<MultipleFilesMessage>;
    updateUserMessage: (messageId: number, params: UserMessageUpdateParams) => Promise<UserMessage>;
} & Partial<MessageListDataSource>;
// ===== #MessageBody =====
import React from 'react';
export declare const MessageBody: (props: MessageBodyProps) => React.JSX.Element;
// ===== #MessageBodyProps =====
import { CoreMessageType } from '#CoreMessageType';
import { SendbirdStateConfig } from '#SendbirdStateConfig';
import { Nullable } from '#Nullable';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { OnBeforeDownloadFileMessageType } from '#OnBeforeDownloadFileMessageType';
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
// ===== #MessageDataSource =====
import { useGroupChannelMessages } from '@sendbird/uikit-tools';
type MessageDataSource = ReturnType<typeof useGroupChannelMessages>;
// ===== #MessageHeader =====
import React from 'react';
export declare const MessageHeader: (props: MessageHeaderProps) => React.JSX.Element;
// ===== #MessageHeaderProps =====
import { CoreMessageType } from '#CoreMessageType';
import { Nullable } from '#Nullable';
import { GroupChannel } from '@sendbird/chat/groupChannel';
export interface MessageHeaderProps {
    channel: Nullable<GroupChannel>;
    message: CoreMessageType;
}
// ===== #MessageId =====
type MessageId = number;
// ===== #MessageListDataSource =====
import { useGroupChannelMessages } from '@sendbird/uikit-tools';
type MessageListDataSource = ReturnType<typeof useGroupChannelMessages>;
// ===== #MessageListQueryParamsType =====
import { MessageCollectionParams } from '@sendbird/chat/groupChannel';
import { MessageFilterParams } from '@sendbird/chat/groupChannel';
export type MessageListQueryParamsType = Omit<MessageCollectionParams, 'filter'> & MessageFilterParams;
// ===== #MessageMenuContextProps =====
export interface MessageMenuContextProps extends CommonMessageMenuContextProps {
    showMenu: () => void;
    toggleMenu: () => void;
}
// ===== #MessageMenuProps~d32aa065 =====
import { ReactElement } from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { OpenChannel } from '@sendbird/chat/openChannel';
import { SendableMessageType } from '#SendableMessageType';
import { TriggerIconProps } from '#TriggerIconProps';
import { ReplyType } from '#ReplyType';
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
// ===== #MessageMenuProvider =====
import React from 'react';
export declare const MessageMenuProvider: ({ children, value }: MessageMenuProviderProps) => React.JSX.Element;
// ===== #MessageMenuProviderProps =====
import { ReactNode } from 'react';
interface MessageMenuProviderProps {
    children: ReactNode;
    value: MessageMenuContextProps | MobileMessageMenuContextProps;
}
// ===== #MessageMenu~e6e86bce =====
import React from 'react';
export declare const MessageMenu: ({ className, message, channel, isByMe, replyType, inThreadList, renderTrigger, renderMenuItems, disableDeleteMessage, showEdit, showRemove, deleteMessage, resendMessage, markAsUnread, setQuoteMessage, onReplyInThread, onMoveToParentMessage, }: MessageMenuProps) => React.JSX.Element;
// ===== #MessageProfile =====
import React from 'react';
export declare function MessageProfile({ className, isByMe, displayThreadReplies, bottom, message, channel, userId, chainBottom, }: MessageProfileProps): React.JSX.Element;
// ===== #MessageProfileProps =====
import { MessageContentProps } from '#MessageContentProps';
export interface MessageProfileProps extends MessageContentProps {
    className?: string;
    isByMe?: boolean;
    displayThreadReplies?: boolean;
    bottom?: string;
}
// ===== #MessageProps =====
import { EveryMessage } from '#EveryMessage';
import { RenderCustomSeparatorProps } from '#RenderCustomSeparatorProps';
import { RenderMessageParamsType } from '#RenderMessageParamsType';
import React from 'react';
import { CoreMessageType } from '#CoreMessageType';
import { MessageContentProps } from '#MessageContentProps';
import { SuggestedRepliesProps } from '#SuggestedRepliesProps';
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
// ===== #MessageSearchContext =====
import React from 'react';
export declare const MessageSearchContext: React.Context<import("#Store").Store<MessageSearchState>>;
// ===== #MessageSearchManager =====
import React from 'react';
declare const MessageSearchManager: React.FC<MessageSearchProviderProps>;
// ===== #MessageSearchProvider =====
import React from 'react';
declare const MessageSearchProvider: React.FC<MessageSearchProviderProps>;
// ===== #MessageSearchProviderProps =====
import React from 'react';
import { ClientSentMessages } from '#ClientSentMessages';
import { SendbirdError } from '@sendbird/chat';
import { MessageSearchQueryParams } from '@sendbird/chat/lib/__definition';
import { CoreMessageType } from '#CoreMessageType';
export interface MessageSearchProviderProps {
    channelUrl: string;
    children?: React.ReactElement;
    searchString?: string;
    messageSearchQuery?: MessageSearchQueryParams;
    onResultLoaded?(messages?: Array<CoreMessageType> | null, error?: SendbirdError | null): void;
    onResultClick?(message: ClientSentMessages): void;
}
// ===== #MessageSearchState =====
import React from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { MessageSearchQuery } from '@sendbird/chat/message';
import { ClientSentMessages } from '#ClientSentMessages';
import useScrollCallback from '#useScrollCallback';
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
// ===== #MessageTemplateData =====
export type MessageTemplateData = SimpleTemplateData & {
    view_variables?: Record<string, SimpleTemplateData[]>;
    container_options?: {
        profile?: boolean;
        time?: boolean;
        nickname?: boolean;
    };
};
// ===== #MessageTemplateItem =====
import { ComponentsUnion } from '@sendbird/uikit-message-template';
export type MessageTemplateItem = ComponentsUnion['properties'];
// ===== #MessageTemplateTheme =====
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
// ===== #MessageTemplateTypes =====
import { TemplateType } from '#TemplateType';
export declare const MessageTemplateTypes: Record<TemplateType, TemplateType>;
// ===== #MessageTemplatesInfo =====
export interface MessageTemplatesInfo {
    token: string;
    templatesMap: Record<string, ProcessedMessageTemplate>;
}
// ===== #MessageView =====
import React from 'react';
declare const MessageView: (props: MessageViewProps) => React.JSX.Element;
// ===== #MessageViewProps =====
import { EveryMessage } from '#EveryMessage';
import { ReplyType } from '#ReplyType';
import React from 'react';
import { EmojiCategory } from '@sendbird/chat';
import { EmojiContainer } from '@sendbird/chat';
import { User } from '@sendbird/chat';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { FileMessage } from '@sendbird/chat/message';
import { UserMessageCreateParams } from '@sendbird/chat/message';
import { UserMessageUpdateParams } from '@sendbird/chat/message';
import { ThreadReplySelectType } from '#ThreadReplySelectType';
import { CoreMessageType } from '#CoreMessageType';
import { SendableMessageType } from '#SendableMessageType';
import { OnBeforeDownloadFileMessageType } from '#OnBeforeDownloadFileMessageType';
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
// ===== #MobileBottomSheet =====
import React from 'react';
import { MobileBottomSheetProps } from '#MobileBottomSheetProps';
declare const MobileBottomSheet: React.FunctionComponent<MobileBottomSheetProps>;
// ===== #MobileBottomSheetProps =====
import { EmojiContainer } from '@sendbird/chat';
import { SendableMessageType } from '#SendableMessageType';
export interface MobileBottomSheetProps extends BaseMenuProps {
    emojiContainer?: EmojiContainer;
    toggleReaction?: (message: SendableMessageType, reactionKey: string, isReacted: boolean) => void;
}
// ===== #MobileContextMenu =====
import React from 'react';
import { BaseMenuProps } from '#BaseMenuProps';
declare const MobileContextMenu: React.FunctionComponent<BaseMenuProps>;
// ===== #MobileLayoutProps =====
export interface MobileLayoutProps extends AppLayoutProps, SubLayoutCommonProps {
}
// ===== #MobileMessageMenuContextProps =====
import { MouseEvent } from 'react';
export interface MobileMessageMenuContextProps extends CommonMessageMenuContextProps {
    onDownloadClick?: (e: MouseEvent) => Promise<void>;
}
// ===== #MobileRenderMenuItemsParams =====
import { RenderMenuItemsParams } from '#RenderMenuItemsParams';
type MobileRenderMenuItemsParams = {
    items: Omit<RenderMenuItemsParams['items'], 'OpenInChannelMenuItem'>;
};
// ===== #ModalRoot =====
import { ReactElement } from 'react';
export declare const ModalRoot: () => ReactElement;
// ===== #MultiFilesViewer =====
import { MouseEvent } from 'react';
export interface MultiFilesViewer extends SenderInfo, BaseViewer {
    viewerType: typeof ViewerTypes.MULTI;
    fileInfoList: FileInfo[];
    currentIndex: number;
    onClickLeft: () => void;
    onClickRight: () => void;
    onDownloadClick?: (e: MouseEvent) => Promise<void>;
}
// ===== #MuteMenuItem =====
import { ReactElement } from 'react';
export declare const MuteMenuItem: ({ channel, user, className, children, disable, dataSbId, testID, onChange, onError, }: MuteMenuItemProps) => ReactElement;
// ===== #MuteMenuItemProps =====
import { ReactElement } from 'react';
import { ReactNode } from 'react';
import { BaseChannel } from '@sendbird/chat';
import { User } from '@sendbird/chat';
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
// ===== #MuteToggleMenuItem =====
import React from 'react';
export declare const MuteToggleMenuItem: (props: ToggleMenuItemProps) => React.JSX.Element;
// ===== #MutedMemberList =====
import { ReactElement } from 'react';
export declare const MutedMemberList: ({ renderUserListItem, memberListQueryParams, }: MutedMemberListProps) => ReactElement;
// ===== #MutedMemberListProps =====
import { ReactNode } from 'react';
import { MemberListQueryParams } from '@sendbird/chat/groupChannel';
import { UserListItemProps } from '#UserListItemProps';
interface MutedMemberListProps {
    renderUserListItem?: (props: UserListItemProps) => ReactNode;
    memberListQueryParams?: MemberListQueryParams;
}
// ===== #NEXT_RESULT_SIZE =====
export declare const NEXT_RESULT_SIZE = 15;
// ===== #Nullable =====
export type Nullable<T> = T | null;
// ===== #ON_CHANNEL_ARCHIVED =====
export declare const ON_CHANNEL_ARCHIVED = "ON_CHANNEL_ARCHIVED";
// ===== #ON_CHANNEL_CHANGED =====
export declare const ON_CHANNEL_CHANGED = "ON_CHANNEL_CHANGED";
// ===== #ON_CHANNEL_DELETED =====
export declare const ON_CHANNEL_DELETED = "ON_CHANNEL_DELETED";
// ===== #ON_CHANNEL_FROZEN =====
export declare const ON_CHANNEL_FROZEN = "ON_CHANNEL_FROZEN";
// ===== #ON_CHANNEL_UNFROZEN =====
export declare const ON_CHANNEL_UNFROZEN = "ON_CHANNEL_UNFROZEN";
// ===== #ON_DELIVERY_RECEIPT_UPDATED =====
export declare const ON_DELIVERY_RECEIPT_UPDATED = "ON_DELIVERY_RECEIPT_UPDATED";
// ===== #ON_FILE_INFO_UPLOADED =====
export declare const ON_FILE_INFO_UPLOADED = "ON_FILE_INFO_UPLOADED";
// ===== #ON_LAST_MESSAGE_UPDATED =====
export declare const ON_LAST_MESSAGE_UPDATED = "ON_LAST_MESSAGE_UPDATED";
// ===== #ON_MESSAGE_DELETED =====
export declare const ON_MESSAGE_DELETED = "ON_MESSAGE_DELETED";
// ===== #ON_MESSAGE_DELETED_BY_REQ_ID =====
export declare const ON_MESSAGE_DELETED_BY_REQ_ID = "ON_MESSAGE_DELETED_BY_REQ_ID";
// ===== #ON_MESSAGE_RECEIVED =====
export declare const ON_MESSAGE_RECEIVED = "ON_MESSAGE_RECEIVED";
// ===== #ON_MESSAGE_THREAD_INFO_UPDATED =====
export declare const ON_MESSAGE_THREAD_INFO_UPDATED = "ON_MESSAGE_THREAD_INFO_UPDATED";
// ===== #ON_MESSAGE_UPDATED =====
export declare const ON_MESSAGE_UPDATED = "ON_MESSAGE_UPDATED";
// ===== #ON_REACTION_UPDATED =====
export declare const ON_REACTION_UPDATED = "ON_REACTION_UPDATED";
// ===== #ON_READ_RECEIPT_UPDATED =====
export declare const ON_READ_RECEIPT_UPDATED = "ON_READ_RECEIPT_UPDATED";
// ===== #ON_TYPING_STATUS_UPDATED =====
export declare const ON_TYPING_STATUS_UPDATED = "ON_TYPING_STATUS_UPDATED";
// ===== #ON_USER_JOINED =====
export declare const ON_USER_JOINED = "ON_USER_JOINED";
// ===== #ON_USER_LEFT =====
export declare const ON_USER_LEFT = "ON_USER_LEFT";
// ===== #ObjectValues =====
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
// ===== #OnBeforeDownloadFileMessageType =====
import { FileMessage } from '@sendbird/chat/message';
import { MultipleFilesMessage } from '@sendbird/chat/message';
export type OnBeforeDownloadFileMessageType = (params: {
    message: FileMessage | MultipleFilesMessage;
    index?: number;
}) => Promise<boolean>;
// ===== #OnBeforeHandler =====
export type OnBeforeHandler<T> = (params: T) => T | Promise<T> | void | Promise<void>;
// ===== #OnBeforeSendMFMType =====
import { MultipleFilesMessageCreateParams } from '@sendbird/chat/message';
import { SendableMessageType } from '#SendableMessageType';
export type OnBeforeSendMFMType = (files: Array<File>, quoteMessage?: SendableMessageType) => MultipleFilesMessageCreateParams;
// ===== #OnCreateChannelClickParams =====
import { CHANNEL_TYPE } from '#CHANNEL_TYPE';
type OnCreateChannelClickParams = {
    users: Array<string>;
    onClose: () => void;
    channelType: CHANNEL_TYPE;
};
// ===== #OnOpenChannelSelected =====
import { OpenChannel } from '@sendbird/chat/openChannel';
export type OnOpenChannelSelected = (channel: OpenChannel, e?: React.MouseEvent<HTMLDivElement | unknown>) => void;
// ===== #OnToggleStateHandlerType =====
import { User } from '@sendbird/chat';
export type OnToggleStateHandlerType = (params: {
    user: User;
    newStatus: boolean;
    error?: Error;
}) => void;
// ===== #OpenChannelListActionTypes =====
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
// ===== #OpenChannelListDispatcherType =====
import { Dispatch } from 'react';
import OpenChannelListActionTypes from '#OpenChannelListActionTypes';
export type OpenChannelListDispatcherType = Dispatch<{
    type: OpenChannelListActionTypes;
    payload: any;
}>;
// ===== #OpenChannelListFetchingStatus =====
export declare enum OpenChannelListFetchingStatus {
    EMPTY = "EMPTY",
    FETCHING = "FETCHING",
    DONE = "DONE",
    ERROR = "ERROR"
}
// ===== #OpenChannelListProviderInterface =====
import { OpenChannel } from '@sendbird/chat/openChannel';
import { Logger } from '#Logger~6cebce76';
import { FetchNextCallbackType } from '#FetchNextCallbackType';
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
// ===== #OpenChannelListProviderProps =====
export interface OpenChannelListProviderProps {
    className?: string;
    children?: React.ReactElement;
    queries?: {
        openChannelListQuery?: UserFilledOpenChannelListQuery;
    };
    onChannelSelected?: OnOpenChannelSelected;
}
// ===== #OpenInChannelMenuItem =====
import React from 'react';
export declare const OpenInChannelMenuItem: (props: PrebuildMenuItemPropsType) => React.JSX.Element;
// ===== #OperatorList =====
import { ReactElement } from 'react';
export declare const OperatorList: ({ renderUserListItem, operatorListQueryParams, }: OperatorListProps) => ReactElement;
// ===== #OperatorListProps =====
import { ReactNode } from 'react';
import { OperatorListQueryParams } from '@sendbird/chat';
import { UserListItemProps } from '#UserListItemProps';
interface OperatorListProps {
    renderUserListItem?: (props: UserListItemProps) => ReactNode;
    operatorListQueryParams?: OperatorListQueryParams;
}
// ===== #OperatorMenuItem =====
import { ReactElement } from 'react';
export declare const OperatorMenuItem: ({ channel, user, className, children, disable, dataSbId, testID, onChange, onError, }: OperatorMenuItemProps) => ReactElement;
// ===== #OperatorMenuItemProps =====
import { ReactElement } from 'react';
import { ReactNode } from 'react';
import { BaseChannel } from '@sendbird/chat';
import { User } from '@sendbird/chat';
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
// ===== #OperatorToggleMenuItem =====
import React from 'react';
export declare const OperatorToggleMenuItem: (props: ToggleMenuItemProps) => React.JSX.Element;
// ===== #Options =====
type Options = {
    publishSynchronous?: boolean;
};
// ===== #OverrideInviteUserType~6636c80a =====
import { GroupChannel } from '@sendbird/chat/groupChannel';
type OverrideInviteUserType = {
    users: Array<string>;
    onClose: () => void;
    channel: GroupChannel;
};
// ===== #OverrideInviteUserType~cd16c36b =====
import { CHANNEL_TYPE } from '#CHANNEL_TYPE';
type OverrideInviteUserType = {
    users: Array<string>;
    onClose: () => void;
    channelType: CHANNEL_TYPE;
};
// ===== #PREV_RESULT_SIZE =====
export declare const PREV_RESULT_SIZE = 30;
// ===== #Params =====
import { GroupChannelState } from '#GroupChannelState';
import { GroupChannel } from '@sendbird/chat/groupChannel';
interface Params extends GroupChannelState {
    scrollToBottom(animated?: boolean): Promise<void>;
    currentChannel: GroupChannel;
}
// ===== #PartialDeep =====
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
// ===== #PartialRequired =====
export type PartialRequired<T, RequiredKeys extends keyof T> = Partial<Omit<T, RequiredKeys>> & Required<Pick<T, RequiredKeys>>;
// ===== #PayloadByTopic =====
type PayloadByTopic<T extends keyof any, U> = U extends {
    topic: T;
    payload: infer P;
} ? P : never;
// ===== #PendingFile =====
export interface PendingFile {
    id: string;
    file: File;
    /** Object URL for image previews. Undefined for non-image files. Revoked on remove/unmount. */
    previewUrl?: string;
    isImage: boolean;
}
// ===== #PrebuildMenuItemPropsType =====
import { MenuItemProps } from '#MenuItemProps~31290fbd';
export type PrebuildMenuItemPropsType = Omit<MenuItemProps, 'children'> & Partial<Pick<MenuItemProps, 'children'>>;
// ===== #PrintLogProps =====
interface PrintLogProps {
    level: LogLevel;
    title?: string;
    description?: string;
    payload?: unknown[];
}
// ===== #ProcessedMessageTemplate =====
export type ProcessedMessageTemplate = {
    version: number;
    uiTemplate: string;
    colorVariables?: Record<string, string>;
};
// ===== #PromiseResolver =====
/**
 * You can pass the resolve function to scrollPubSub, if you want to catch when the scroll is finished.
 * */
type PromiseResolver = () => void;
// ===== #PubSubTypes =====
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
// ===== #PublishingModuleType =====
export declare enum PublishingModuleType {
    CHANNEL = "CHANNEL",
    THREAD = "THREAD"
}
// ===== #REFRESH_CHANNELS_SUCCESS =====
export declare const REFRESH_CHANNELS_SUCCESS = "REFRESH_CHANNELS_SUCCESS";
// ===== #RESEND_MESSAGE_START =====
export declare const RESEND_MESSAGE_START = "RESEND_MESSAGE_START";
// ===== #RESET_CHANNEL_LIST =====
export declare const RESET_CHANNEL_LIST = "RESET_CHANNEL_LIST";
// ===== #RESET_MESSAGES =====
export declare const RESET_MESSAGES = "RESET_MESSAGES";
// ===== #RemoveMessageModalProps =====
import { EveryMessage } from '#EveryMessage';
export interface RemoveMessageModalProps {
    onSubmit?: () => void;
    onCancel: () => void;
    message: EveryMessage;
}
// ===== #RemoveMessageModalView =====
import React from 'react';
export declare const RemoveMessageModalView: (props: RemoveMessageModalViewProps) => React.JSX.Element;
// ===== #RemoveMessageModalViewProps =====
import { SendableMessageType } from '#SendableMessageType';
export interface RemoveMessageModalViewProps extends RemoveMessageModalProps {
    deleteMessage: (message: SendableMessageType) => Promise<void>;
}
// ===== #RenderCustomSeparatorProps =====
import { CoreMessageType } from '#CoreMessageType';
export interface RenderCustomSeparatorProps {
    message: CoreMessageType;
}
// ===== #RenderMenuItemsParams =====
import { ReactElement } from 'react';
import { PrebuildMenuItemPropsType } from '#PrebuildMenuItemPropsType';
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
// ===== #RenderMessageParamsType =====
import { MessageProps } from '#MessageProps';
export type RenderMessageParamsType = Omit<MessageProps, 'renderMessage'>;
// ===== #RenderMessageProps =====
import { CoreMessageType } from '#CoreMessageType';
export interface RenderMessageProps {
    message: CoreMessageType;
    chainTop: boolean;
    chainBottom: boolean;
}
// ===== #RenderUserListItemMenuItemsParams =====
import { ReactElement } from 'react';
import { ToggleMenuItemProps } from '#ToggleMenuItemProps';
export type RenderUserListItemMenuItemsParams = {
    items: {
        OperatorToggleMenuItem: (props: ToggleMenuItemProps) => ReactElement;
        MuteToggleMenuItem: (props: ToggleMenuItemProps) => ReactElement;
        BanToggleMenuItem: (props: ToggleMenuItemProps) => ReactElement;
    };
};
// ===== #RenderUserProfileProps =====
import { MutableRefObject } from 'react';
import { User } from '@sendbird/chat';
import { Member } from '@sendbird/chat/groupChannel';
export interface RenderUserProfileProps {
    user: User | Member;
    currentUserId: string;
    close(): void;
    avatarRef: MutableRefObject<any>;
}
// ===== #ReplyMenuItem =====
import React from 'react';
export declare const ReplyMenuItem: (props: PrebuildMenuItemPropsType) => React.JSX.Element;
// ===== #ReplyType =====
export type ReplyType = 'NONE' | 'QUOTE_REPLY' | 'THREAD';
// ===== #RequestId =====
type RequestId = string;
// ===== #ResendMenuItem =====
import React from 'react';
export declare const ResendMenuItem: (props: PrebuildMenuItemPropsType) => React.JSX.Element;
// ===== #Role =====
export declare const Role: {
    readonly OPERATOR: "operator";
    readonly NONE: "none";
};
// ===== #RoleType =====
export type RoleType = typeof Role[keyof typeof Role];
// ===== #SBUEventHandlers =====
import { SendbirdError } from '@sendbird/chat';
import { User } from '@sendbird/chat';
import { CoreMessageType } from '#CoreMessageType';
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
// ===== #SEND_MESSAGE_FAILURE =====
export declare const SEND_MESSAGE_FAILURE = "SEND_MESSAGE_FAILURE";
// ===== #SEND_MESSAGE_START =====
export declare const SEND_MESSAGE_START = "SEND_MESSAGE_START";
// ===== #SEND_MESSAGE_SUCCESS =====
export declare const SEND_MESSAGE_SUCCESS = "SEND_MESSAGE_SUCCESS";
// ===== #SET_CHANNEL_INVALID =====
export declare const SET_CHANNEL_INVALID = "SET_CHANNEL_INVALID";
// ===== #SET_CHANNEL_LOADING =====
export declare const SET_CHANNEL_LOADING = "SET_CHANNEL_LOADING";
// ===== #SET_CURRENT_CHANNEL =====
export declare const SET_CURRENT_CHANNEL = "SET_CURRENT_CHANNEL";
// ===== #SET_EMOJI_CONTAINER =====
export declare const SET_EMOJI_CONTAINER = "SET_EMOJI_CONTAINER";
// ===== #SUPPORTED_FILE_EXTENSIONS =====
export declare const SUPPORTED_FILE_EXTENSIONS: {
    IMAGE: string[];
    VIDEO: string[];
    AUDIO: string[];
    DOCUMENT: string[];
    ARCHIVE: string[];
};
// ===== #SUPPORTED_MIMES =====
export declare const SUPPORTED_MIMES: {
    IMAGE: string[];
    VIDEO: string[];
    AUDIO: string[];
    DOCUMENT: string[];
    APPLICATION: string[];
    ARCHIVE: string[];
};
// ===== #ScrollTopicUnion =====
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
// ===== #ScrollTopics =====
export type ScrollTopics = 'scrollToBottom' | 'scroll';
// ===== #SdkStore =====
import SendbirdChat from '@sendbird/chat';
import { GroupChannelModule } from '@sendbird/chat/groupChannel';
import { OpenChannelModule } from '@sendbird/chat/openChannel';
import { ModuleNamespaces } from '@sendbird/chat/lib/__definition';
export interface SdkStore {
    error: boolean;
    initialized: boolean;
    loading: boolean;
    sdk: SendbirdChat & ModuleNamespaces<[GroupChannelModule, OpenChannelModule]>;
}
// ===== #SendBirdProviderConfig =====
export interface SendBirdProviderConfig {
    logLevel?: 'debug' | 'warning' | 'error' | 'info' | 'all' | Array<string>;
    userMention?: {
        maxMentionCount?: number;
        maxSuggestionCount?: number;
    };
    isREMUnitEnabled?: boolean;
}
// ===== #SendFileMessageFunctionType =====
import { FileMessage } from '@sendbird/chat/message';
import { SendableMessageType } from '#SendableMessageType';
export type SendFileMessageFunctionType = (file: File, quoteMessage?: SendableMessageType) => Promise<FileMessage>;
// ===== #SendMFMFunctionType =====
import { MultipleFilesMessage } from '@sendbird/chat/message';
import { SendableMessageType } from '#SendableMessageType';
export type SendMFMFunctionType = (files: Array<File>, quoteMessage?: SendableMessageType) => Promise<MultipleFilesMessage>;
// ===== #SendMessageParams~31562896 =====
import { User } from '@sendbird/chat';
import { SendableMessageType } from '#SendableMessageType';
export type SendMessageParams = {
    message: string;
    quoteMessage?: SendableMessageType;
    mentionTemplate?: string;
    mentionedUsers?: Array<User>;
};
// ===== #SendableMessageType =====
import { FileMessage } from '@sendbird/chat/message';
import { MultipleFilesMessage } from '@sendbird/chat/message';
import { UserMessage } from '@sendbird/chat/message';
export type SendableMessageType = UserMessage | FileMessage | MultipleFilesMessage;
// ===== #SendbirdChatInitParams =====
import { SendbirdChatParams } from '@sendbird/chat';
import { Module } from '@sendbird/chat/lib/__definition';
export type SendbirdChatInitParams = Omit<SendbirdChatParams<Module[]>, 'appId'>;
// ===== #SendbirdChatType =====
import SendbirdChat from '@sendbird/chat';
import { GroupChannelModule } from '@sendbird/chat/groupChannel';
import { OpenChannelModule } from '@sendbird/chat/openChannel';
import { ModuleNamespaces } from '@sendbird/chat/lib/__definition';
export type SendbirdChatType = SendbirdChat & ModuleNamespaces<[GroupChannelModule, OpenChannelModule]>;
// ===== #SendbirdConfig =====
import { SBUGlobalPubSub } from '#SBUGlobalPubSub';
export interface SendbirdConfig {
    logLevel?: string | Array<string>;
    pubSub?: SBUGlobalPubSub;
    userMention?: {
        maxMentionCount?: number;
        maxSuggestionCount?: number;
    };
    isREMUnitEnabled?: boolean;
}
// ===== #SendbirdFontWeight =====
type SendbirdFontWeight = 'bold' | 'normal';
// ===== #SendbirdMessageTemplate =====
export type SendbirdMessageTemplate = {
    key: string;
    created_at: number;
    updated_at: number;
    ui_template: SendbirdUiTemplate;
    name?: string;
    color_variables?: Record<string, string>;
};
// ===== #SendbirdProviderProps =====
import React from 'react';
import SendbirdChat from '@sendbird/chat';
import { User } from '@sendbird/chat';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { GroupChannelCreateParams } from '@sendbird/chat/groupChannel';
import { StringSet } from '#StringSet~cb28c5f7';
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
// ===== #SendbirdProviderUtils =====
export interface SendbirdProviderUtils {
    updateMessageTemplatesInfo: (templateKeys: string[], messageId: number, createdAt: number) => Promise<void>;
    getCachedTemplate: (key: string) => ProcessedMessageTemplate | null;
}
// ===== #SendbirdState =====
import { EmojiManager } from '#EmojiManager';
export type SendbirdState = {
    config: SendbirdStateConfig;
    stores: SendbirdStateStore;
    eventHandlers?: SBUEventHandlers;
    emojiManager: EmojiManager;
    utils: SendbirdProviderUtils;
};
// ===== #SendbirdStateConfig =====
import React from 'react';
import { User } from '@sendbird/chat';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { GroupChannelCreateParams } from '@sendbird/chat/groupChannel';
import { SBUConfig } from '@sendbird/uikit-tools';
import { MarkAsReadSchedulerType } from '#MarkAsReadSchedulerType';
import { MarkAsDeliveredSchedulerType } from '#MarkAsDeliveredSchedulerType';
import { SBUGlobalPubSub } from '#SBUGlobalPubSub';
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
// ===== #SendbirdStateStore =====
export interface SendbirdStateStore {
    sdkStore: SdkStore;
    userStore: UserStore;
    appInfoStore: AppInfoStore;
}
// ===== #SendbirdTheme =====
export type SendbirdTheme = 'light' | 'dark';
// ===== #SendbirdUiTemplate =====
export interface SendbirdUiTemplate {
    version: number;
    body: {
        items: MessageTemplateItem[];
    };
}
// ===== #SenderInfo =====
export interface SenderInfo {
    profileUrl: string;
    nickname: string;
}
// ===== #SendingMessageStatus =====
export interface SendingMessageStatus {
    NONE: 'none';
    SUCCEEDED: 'succeeded';
    FAILED: 'failed';
    PENDING: 'pending';
}
// ===== #SimpleTemplateData =====
export type SimpleTemplateData = {
    type?: TemplateType;
    key: string;
    variables?: Record<string, any>;
};
// ===== #SingleFileViewer =====
import { MouseEvent } from 'react';
export interface SingleFileViewer extends SenderInfo, FileInfo, BaseViewer {
    viewerType?: typeof ViewerTypes.SINGLE;
    isByMe?: boolean;
    disableDelete?: boolean;
    onDelete: (e: MouseEvent) => void;
    onDownloadClick?: (e: MouseEvent) => Promise<void>;
}
// ===== #SpaceFromTrigger =====
type SpaceFromTrigger = {
    x: number;
    y: number;
};
// ===== #SpaceFromTriggerType =====
export type SpaceFromTriggerType = {
    x: number;
    y: number;
    top?: number;
    left?: number;
    height?: number;
};
// ===== #State =====
import { User } from '@sendbird/chat';
import { OpenChannel } from '@sendbird/chat/openChannel';
import { CoreMessageType } from '#CoreMessageType';
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
// ===== #StaticParams~648d642e =====
import { Logger } from '#Logger~6cebce76';
interface StaticParams {
    logger: Logger;
}
// ===== #StaticParams~901c1f39 =====
import { Logger } from '#Logger~6cebce76';
import { OpenChannelListDispatcherType } from '#OpenChannelListDispatcherType';
interface StaticParams {
    logger: Logger;
    openChannelListDispatcher: OpenChannelListDispatcherType;
}
// ===== #StaticProps~02290879 =====
import { Logger } from '#Logger~6cebce76';
import { SBUGlobalPubSub } from '#SBUGlobalPubSub';
interface StaticProps {
    logger: Logger;
    pubSub: SBUGlobalPubSub;
    isMentionEnabled: boolean;
}
// ===== #StaticProps~b9b9a4ff =====
import { Logger } from '#Logger~6cebce76';
import { SBUGlobalPubSub } from '#SBUGlobalPubSub';
interface StaticProps {
    logger: Logger;
    pubSub: SBUGlobalPubSub;
}
// ===== #Store =====
export type Store<T> = {
    getState: () => T;
    setState: (partial: Partial<T> | ((state: T) => Partial<T>), force?: boolean) => void;
    subscribe: (listener: () => void) => () => void;
};
// ===== #StringObj =====
export interface StringObj {
    type: StringObjType;
    value: string;
    userId?: string;
}
// ===== #StringObjType =====
export declare enum StringObjType {
    normal = "normal",
    mention = "mention",
    url = "url"
}
// ===== #StringSet~042c4a63 =====
interface StringSet {
    TOOLTIP__YOU: string;
    TOOLTIP__AND_YOU: string;
    TOOLTIP__UNKNOWN_USER: string;
}
// ===== #StringSet~cb28c5f7 =====
/**
 * NOTE:
 * Do not forget to update the string set table on Docs
 * When you update this string set
 *
 * `%d` will be replaced by a proper number
 */
export type StringSet = Record<keyof typeof stringSet['en'], string>;
// ===== #SubLayoutCommonProps =====
import { SendableMessageType } from '#SendableMessageType';
interface SubLayoutCommonProps {
    highlightedMessage?: number | null;
    setHighlightedMessage?: React.Dispatch<number | null>;
    startingPoint?: number | null;
    setStartingPoint: React.Dispatch<number | null>;
    threadTargetMessage: SendableMessageType | null;
    setThreadTargetMessage: React.Dispatch<SendableMessageType>;
}
// ===== #SuggestedMentionListView =====
import React from 'react';
export declare const SuggestedMentionListView: (props: SuggestedMentionListViewProps) => React.JSX.Element;
// ===== #SuggestedMentionListViewProps =====
import React from 'react';
import { User } from '@sendbird/chat';
import { GroupChannel } from '@sendbird/chat/groupChannel';
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
// ===== #TOGGLE_DEFAULT_VALUE =====
export declare const TOGGLE_DEFAULT_VALUE: {
    checked: any;
    defaultChecked: boolean;
    disabled: boolean;
    onChange: () => void;
    onFocus: () => void;
    onBlur: () => void;
};
// ===== #TemplateType =====
export type TemplateType = 'default';
// ===== #ThreadContext =====
import React from 'react';
export declare const ThreadContext: React.Context<import("#Store").Store<ThreadState>>;
// ===== #ThreadManager =====
import React from 'react';
export declare const ThreadManager: React.FC<React.PropsWithChildren<ThreadProviderProps>>;
// ===== #ThreadMenuItem =====
import React from 'react';
export declare const ThreadMenuItem: (props: PrebuildMenuItemPropsType) => React.JSX.Element;
// ===== #ThreadMessageActions =====
import { FileMessage } from '@sendbird/chat/message';
import { MultipleFilesMessage } from '@sendbird/chat/message';
import { SendableMessageType } from '#SendableMessageType';
export interface ThreadMessageActions {
    sendMessage: (props: SendMessageParams) => void;
    sendFileMessage: (file: File, quoteMessage?: SendableMessageType) => Promise<FileMessage>;
    sendVoiceMessage: (file: File, duration: number, quoteMessage?: SendableMessageType) => void;
    sendMultipleFilesMessage: (files: Array<File>, quoteMessage?: SendableMessageType) => Promise<MultipleFilesMessage>;
    updateMessage: (props: UpdateMessageParams) => void;
    deleteMessage: (message: SendableMessageType) => Promise<void>;
    resendMessage: (failedMessage: SendableMessageType) => void;
}
// ===== #ThreadMessageDataSource =====
import { useGroupChannelThreadMessages } from '@sendbird/uikit-tools';
type ThreadMessageDataSource = ReturnType<typeof useGroupChannelThreadMessages>;
// ===== #ThreadProvider =====
import React from 'react';
export declare const ThreadProvider: (props: ThreadProviderProps) => React.JSX.Element;
// ===== #ThreadProviderProps =====
import React from 'react';
import { EmojiCategory } from '@sendbird/chat';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { FileMessageCreateParams } from '@sendbird/chat/message';
import { MultipleFilesMessageCreateParams } from '@sendbird/chat/message';
import { UserMessageCreateParams } from '@sendbird/chat/message';
import { UserProfileProviderProps } from '#UserProfileProviderProps';
import { OnBeforeDownloadFileMessageType } from '#OnBeforeDownloadFileMessageType';
import { SendableMessageType } from '#SendableMessageType';
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
// ===== #ThreadReplySelectType =====
export declare enum ThreadReplySelectType {
    PARENT = "PARENT",
    THREAD = "THREAD"
}
// ===== #ThreadState =====
import { EmojiContainer } from '@sendbird/chat';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { Member } from '@sendbird/chat/groupChannel';
import { CoreMessageType } from '#CoreMessageType';
import { SendableMessageType } from '#SendableMessageType';
import { ChannelStateTypes } from '#ChannelStateTypes';
import { ParentMessageStateTypes } from '#ParentMessageStateTypes';
import { ThreadListStateTypes } from '#ThreadListStateTypes';
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
// ===== #ToggleContainer =====
import React from 'react';
export declare function ToggleContainer({ checked, // null
defaultChecked, disabled, onChange, onFocus, onBlur, children, }: ToggleContainerProps): React.ReactElement;
// ===== #ToggleContainerProps =====
import { ReactNode } from 'react';
import { ToggleContextInterface } from '#ToggleContextInterface';
export interface ToggleContainerProps extends ToggleContextInterface {
    children?: ReactNode;
}
// ===== #ToggleContext =====
import React from 'react';
export declare const ToggleContext: React.Context<ToggleContextInterface>;
// ===== #ToggleContextInterface =====
import { ChangeEventHandler } from 'react';
export interface ToggleContextInterface {
    checked?: boolean | null;
    defaultChecked?: boolean;
    disabled?: boolean;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    onFocus?: ChangeEventHandler<HTMLInputElement>;
    onBlur?: ChangeEventHandler<HTMLInputElement>;
}
// ===== #ToggleMenuItemProps =====
import { ReactNode } from 'react';
import { MenuItemProps } from '#MenuItemProps~31290fbd:type';
export interface ToggleMenuItemProps extends Omit<MenuItemProps, 'children'> {
    children?: ReactNode;
}
// ===== #ToggleUI =====
import React from 'react';
export declare function ToggleUI(props: ToggleUIProps): React.ReactElement;
// ===== #ToggleUIProps =====
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
// ===== #ToolProps =====
import { LoggerInterface } from '#LoggerInterface';
interface ToolProps {
    logger: LoggerInterface;
}
// ===== #TriggerIcon =====
import React from 'react';
export declare const TriggerIcon: ({ ref, onClick, onBlur, renderIcon, }: TriggerIconProps) => React.JSX.Element;
// ===== #TriggerIconProps =====
import { FocusEvent } from 'react';
import { MouseEvent } from 'react';
import { MutableRefObject } from 'react';
import { ReactNode } from 'react';
import { IconProps } from '#IconProps';
export interface TriggerIconProps {
    ref: MutableRefObject<any>;
    onClick?: (e: MouseEvent) => void;
    onBlur?: (e: FocusEvent) => void;
    renderIcon?: (props: IconProps) => ReactNode;
}
// ===== #TwoDepthPartial =====
export type TwoDepthPartial<T> = T extends object ? T extends Set<unknown> ? T : T extends (...args: any[]) => any ? T : {
    [P in keyof T]?: Partial<T[P]>;
} : T;
// ===== #Types =====
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
// ===== #TypingIndicatorType =====
export declare enum TypingIndicatorType {
    Text = "text",
    Bubble = "bubble"
}
// ===== #Typography =====
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
// ===== #UIKIT_COMPATIBLE_FORM_VERSION =====
export declare const UIKIT_COMPATIBLE_FORM_VERSION = 1;
// ===== #UIKitFileTypes =====
export interface UIKitFileTypes {
    IMAGE: 'IMAGE';
    AUDIO: 'AUDIO';
    VIDEO: 'VIDEO';
    GIF: 'GIF';
    VOICE: 'VOICE';
    OTHERS: 'OTHERS';
}
export declare const UIKitFileTypes: UIKitFileTypes;
// ===== #UIKitMessageTypes =====
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
// ===== #UIKitOptions =====
import { SBUConfig } from '@sendbird/uikit-tools';
import { PartialDeep } from '#PartialDeep';
export type UIKitOptions = PartialDeep<{
    common: SBUConfig['common'];
    groupChannel: SBUConfig['groupChannel']['channel'];
    groupChannelList: SBUConfig['groupChannel']['channelList'];
    groupChannelSettings: SBUConfig['groupChannel']['setting'];
    openChannel: SBUConfig['openChannel']['channel'];
}>;
// ===== #UNLOAD_CHANNELS =====
export declare const UNLOAD_CHANNELS = "UNLOAD_CHANNELS";
// ===== #USER_MENTION_TEMP_CHAR =====
export declare const USER_MENTION_TEMP_CHAR = "@";
// ===== #UpdateMessageParams~4498314c =====
import { User } from '@sendbird/chat';
export type UpdateMessageParams = {
    messageId: number;
    message: string;
    mentionedUsers?: User[];
    mentionedUserIds?: string[];
    mentionTemplate?: string;
};
// ===== #UploadedFileInfoWithUpload =====
import { Thumbnail } from '@sendbird/chat/message';
export interface UploadedFileInfoWithUpload {
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    thumbnails?: Thumbnail[];
    url?: string;
    isUploaded?: boolean;
}
// ===== #UsePendingFilesParams =====
import { Logger } from '#Logger~6cebce76';
import { OpenGlobalModalProps } from '#OpenGlobalModalProps';
import { StringSet } from '#StringSet~cb28c5f7';
export interface UsePendingFilesParams {
    uikitUploadSizeLimit: number;
    uikitMultipleFilesMessageLimit: number;
    acceptableMimeTypes?: string[];
    openModal: (props: OpenGlobalModalProps) => void;
    stringSet: StringSet;
    logger?: Logger;
}
// ===== #UsePendingFilesReturn =====
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
// ===== #UseSendMFMDynamicParams =====
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { Nullable } from '#Nullable';
import { PublishingModuleType } from '#PublishingModuleType';
export interface UseSendMFMDynamicParams {
    currentChannel: Nullable<GroupChannel>;
    onBeforeSendMultipleFilesMessage?: OnBeforeSendMFMType;
    publishingModules: PublishingModuleType[];
}
// ===== #UseSendMFMStaticParams =====
import { Logger } from '#Logger~6cebce76';
export interface UseSendMFMStaticParams {
    logger: Logger;
    pubSub: any;
    scrollRef?: React.RefObject<HTMLDivElement>;
}
// ===== #UserFilledOpenChannelListQuery =====
export interface UserFilledOpenChannelListQuery {
    customTypes?: Array<string>;
    includeFrozen?: boolean;
    includeMetaData?: boolean;
    limit?: number;
    nameKeyword?: string;
    urlKeyword?: string;
}
// ===== #UserListItemMenu =====
import React from 'react';
export declare const UserListItemMenu: (props: UserListItemMenuProps) => React.JSX.Element;
// ===== #UserListItemMenuContextInterface =====
import { useToggleBan } from '#useToggleBan';
import { useToggleMute } from '#useToggleMute';
import { useToggleOperator } from '#useToggleOperator';
interface UserListItemMenuContextInterface extends UserListItemMenuContextValues, ReturnType<typeof useToggleOperator>, ReturnType<typeof useToggleMute>, ReturnType<typeof useToggleBan> {
    isCurrentUser: boolean;
    isCurrentUserOperator: boolean;
}
// ===== #UserListItemMenuContextValues =====
import { User } from '@sendbird/chat';
import { GroupChannel } from '@sendbird/chat/groupChannel';
export interface UserListItemMenuContextValues {
    channel?: GroupChannel;
    user: User;
    hideMenu: () => void;
    toggleMenu: () => void;
    onToggleOperatorState?: OnToggleStateHandlerType;
    onToggleMuteState?: OnToggleStateHandlerType;
    onToggleBanState?: OnToggleStateHandlerType;
}
// ===== #UserListItemMenuProps =====
import { MutableRefObject } from 'react';
import { ReactElement } from 'react';
import { UserListItemMenuProviderProps } from '#UserListItemMenuProviderProps';
export interface UserListItemMenuProps extends Omit<UserListItemMenuProviderProps, 'children' | 'hideMenu' | 'toggleMenu'> {
    className?: string;
    renderTrigger?: (props: {
        ref: MutableRefObject<any>;
        toggleMenu: () => void;
    }) => ReactElement;
    renderMenuItems?: (params: RenderUserListItemMenuItemsParams) => ReactElement;
}
// ===== #UserListItemMenuProvider =====
import React from 'react';
export declare const UserListItemMenuProvider: ({ children, ...values }: UserListItemMenuProviderProps) => React.JSX.Element;
// ===== #UserListItemMenuProviderProps =====
import { ReactNode } from 'react';
export interface UserListItemMenuProviderProps extends UserListItemMenuContextValues {
    children: ReactNode;
    isOperator?: boolean;
    isMuted?: boolean;
    isBanned?: boolean;
}
// ===== #UserListQuery =====
import { User } from '@sendbird/chat';
export interface UserListQuery {
    hasNext?: boolean;
    next(): Promise<Array<User>>;
    get isLoading(): boolean;
}
// ===== #UserProfileContext =====
import React from 'react';
/**
 * user profile goes deep inside the component tree
 * use this context as a short circuit to send in values
 */
export declare const UserProfileContext: React.Context<UserProfileContextInterface>;
// ===== #UserProfileContextInterface =====
import React from 'react';
import { User } from '@sendbird/chat';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { GroupChannelCreateParams } from '@sendbird/chat/groupChannel';
import { RenderUserProfileProps } from '#RenderUserProfileProps';
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
// ===== #UserProfileProvider =====
import React from 'react';
export declare const UserProfileProvider: ({ isOpenChannel, disableUserProfile: _disableUserProfile, renderUserProfile: _renderUserProfile, onUserProfileMessage: _onUserProfileMessage, onBeforeStartDirectMessage: _onBeforeStartDirectMessage, onStartDirectMessage: _onStartDirectMessage, children, }: UserProfileProviderProps) => React.JSX.Element;
// ===== #UserProfileProviderProps =====
import React from 'react';
import { RenderUserProfileProps } from '#RenderUserProfileProps';
export type UserProfileProviderProps = React.PropsWithChildren<Partial<UserProfileContextInterface> & {
    /** This prop is optional. It is no longer necessary to provide it because the value can be accessed through SendbirdStateContext. */
    disableUserProfile?: boolean;
    /** This prop is optional. It is no longer necessary to provide it because the value can be accessed through SendbirdStateContext. */
    renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
}>;
// ===== #UserStore =====
import { User } from '@sendbird/chat';
export interface UserStore {
    initialized: boolean;
    loading: boolean;
    user: User;
}
// ===== #VOICE_PLAYER_STATUS =====
export declare const VOICE_PLAYER_STATUS: {
    readonly IDLE: "IDLE";
    readonly PREPARING: "PREPARING";
    readonly PLAYING: "PLAYING";
    readonly PAUSED: "PAUSED";
    readonly COMPLETED: "COMPLETED";
};
// ===== #ViewerType =====
export type ViewerType = keyof typeof ViewerTypes;
// ===== #ViewerTypes =====
export declare const ViewerTypes: {
    readonly SINGLE: "SINGLE";
    readonly MULTI: "MULTI";
};
// ===== #VoiceMessageInputStatus =====
export declare const VoiceMessageInputStatus: {
    readonly READY_TO_RECORD: "READY_TO_RECORD";
    readonly RECORDING: "RECORDING";
    readonly READY_TO_PLAY: "READY_TO_PLAY";
    readonly PLAYING: "PLAYING";
};
export type VoiceMessageInputStatus = typeof VoiceMessageInputStatus[keyof typeof VoiceMessageInputStatus];
// ===== #VoiceMessageInputWrapper =====
import React from 'react';
export declare const VoiceMessageInputWrapper: ({ channel, onCancelClick, onSubmitClick, }: VoiceMessageInputWrapperProps) => React.ReactElement;
// ===== #VoiceMessageInputWrapperProps =====
import { GroupChannel } from '@sendbird/chat/groupChannel';
export type VoiceMessageInputWrapperProps = {
    channel?: GroupChannel;
    onCancelClick?: () => void;
    onSubmitClick?: (file: File, duration: number) => void;
};
// ===== #VoicePlayerInitialState =====
import { GroupKey } from '#GroupKey';
export interface VoicePlayerInitialState {
    currentPlayer: null | HTMLAudioElement;
    currentGroupKey: string;
    audioStorage: Record<GroupKey, AudioStorageUnit>;
}
// ===== #VoicePlayerStatus =====
export declare const VoicePlayerStatus: {
    readonly IDLE: "IDLE";
    readonly PREPARING: "PREPARING";
    readonly PLAYING: "PLAYING";
    readonly PAUSED: "PAUSED";
    readonly COMPLETED: "COMPLETED";
};
// ===== #VoicePlayerStatusType =====
import { ObjectValues } from '#ObjectValues';
export type VoicePlayerStatusType = ObjectValues<typeof VOICE_PLAYER_STATUS>;
// ===== #VoiceRecordOptions =====
interface VoiceRecordOptions {
    maxRecordingTime?: number;
    minRecordingTime?: number;
}
// ===== #WaitingTemplateKeyData =====
export interface WaitingTemplateKeyData {
    requestedAt: number;
    erroredMessageIds: number[];
}
// ===== #Word~a7b7fb7b =====
export type Word = {
    text: string;
    userId?: string;
};
// ===== #_default~411f7715 =====
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
// ===== #arrayEqual =====
export declare const arrayEqual: (array1: Array<unknown>, array2: Array<unknown>) => boolean;
// ===== #changeColorToClassName =====
export declare const changeColorToClassName: (color: Colors) => string;
// ===== #convertWordToStringObj =====
import { User } from '@sendbird/chat';
/**
 * @deprecated
 * use modules/message/utils/tokenize instead
 */
export declare const convertWordToStringObj: (word: string, _users: Array<User>, _template?: string) => Array<StringObj>;
// ===== #copyToClipboard =====
export declare const copyToClipboard: (text: string) => boolean;
// ===== #createStore =====
/**
 * A custom store creation utility
 */
export declare function createStore<T extends object>(initialState: T): Store<T>;
// ===== #filterChannelListParams =====
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { GroupChannelListQuery } from '@sendbird/chat/groupChannel';
export declare const filterChannelListParams: (params: GroupChannelListQuery, channel: GroupChannel, currentUserId: string) => boolean;
// ===== #filterMessageListParams =====
import { MessageListParams } from '@sendbird/chat/message';
export declare const filterMessageListParams: (params: MessageListParams, message: SendableMessageType) => boolean;
// ===== #generateGroupKey =====
export declare const generateGroupKey: (channelUrl?: string, key?: string) => GroupKey;
// ===== #getChannelsWithUpsertedChannel =====
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { GroupChannelListOrder } from '@sendbird/chat/groupChannel';
/**
 * Upserts given channel to the channel list and then returns the sorted channel list.
 */
export declare const getChannelsWithUpsertedChannel: (_channels: Array<GroupChannel>, channel: GroupChannel, order?: GroupChannelListOrder) => Array<GroupChannel>;
// ===== #getClassName =====
export declare const getClassName: (classNames: string | Array<string | Array<string>>) => string;
// ===== #getDefaultLogger =====
export declare const getDefaultLogger: () => LoggerInterface;
// ===== #getEmojiListAll =====
import { Emoji } from '@sendbird/chat';
import { EmojiContainer } from '@sendbird/chat';
export declare const getEmojiListAll: (emojiContainer: EmojiContainer) => Array<Emoji>;
// ===== #getEmojiListByCategoryIds =====
import { Emoji } from '@sendbird/chat';
import { EmojiContainer } from '@sendbird/chat';
export declare const getEmojiListByCategoryIds: (emojiContainer: EmojiContainer, categoryIds: number[]) => Array<Emoji>;
// ===== #getEmojiMapAll =====
import { Emoji } from '@sendbird/chat';
import { EmojiContainer } from '@sendbird/chat';
export declare const getEmojiMapAll: (emojiContainer: EmojiContainer) => Map<string, Emoji>;
// ===== #getEmojiTooltipString =====
import { Reaction } from '@sendbird/chat/message';
export declare const getEmojiTooltipString: (reaction: Reaction, userId: string, memberNicknamesMap: Map<string, string>, stringSet: StringSet) => string;
// ===== #getEmojiUrl =====
import { EmojiContainer } from '@sendbird/chat';
export declare const getEmojiUrl: (emojiContainer?: EmojiContainer, emojiKey?: string) => string;
// ===== #getHTMLTextDirection =====
import { HTMLTextDirection } from '#HTMLTextDirection';
export declare const getHTMLTextDirection: (direction: HTMLTextDirection, forceLeftToRightMessageLayout: boolean) => string;
// ===== #getMimeTypesUIKitAccepts =====
export declare const getMimeTypesUIKitAccepts: (acceptableTypes?: string[]) => string;
// ===== #getParsedVoiceAudioFileInfo =====
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
// ===== #getSenderName =====
export declare const getSenderName: (message: SendableMessageType) => string;
// ===== #getSendingMessageStatus =====
/**
 * @deprecated use SendingStatus of @sendbird/chat instead
 * */
export declare const getSendingMessageStatus: () => SendingMessageStatus;
// ===== #getStringSet =====
declare const getStringSet: (lang?: keyof typeof stringSet) => StringSet;
// ===== #getSuggestedReplies =====
import { BaseMessage } from '@sendbird/chat/message';
export declare function getSuggestedReplies(message?: BaseMessage): string[];
// ===== #getUIKitFileType =====
export declare const getUIKitFileType: (type: string) => string;
// ===== #getUIKitFileTypes =====
export declare const getUIKitFileTypes: () => UIKitFileTypes;
// ===== #getUIKitMessageType =====
import { MultipleFilesMessage } from '@sendbird/chat/message';
/**
 * Do not use this for MultipleFilesMessage. Use isMultipleFilesMessage() instead.
 */
export declare const getUIKitMessageType: (message: CoreMessageType) => string;
// ===== #getUIKitMessageTypes =====
export declare const getUIKitMessageTypes: () => UIKitMessageTypes;
// ===== #getUserName =====
import { User } from '@sendbird/chat';
export declare const getUserName: (user: User) => string;
// ===== #hasSameMembers =====
export declare const hasSameMembers: <T>(a: T[], b: T[]) => boolean;
// ===== #hasStateChanged =====
export declare function hasStateChanged<T>(prevState: T, updates: Partial<T>): boolean;
// ===== #initialState =====
declare const initialState: State;
// ===== #isAdminMessage =====
import { AdminMessage } from '@sendbird/chat/message';
export declare const isAdminMessage: (message: CoreMessageType) => message is AdminMessage;
// ===== #isAudio =====
export declare const isAudio: (type: string) => boolean;
// ===== #isAudioMessage =====
import { FileMessage } from '@sendbird/chat/message';
export declare const isAudioMessage: (message: CoreMessageType) => message is FileMessage;
// ===== #isAudioMessageMimeType =====
export declare const isAudioMessageMimeType: (type: string) => boolean;
// ===== #isChannelJustCreated =====
import { GroupChannel } from '@sendbird/chat/groupChannel';
/**
 * If the channel is just created, the channel's createdAt and currentUser's invitedAt are the same.
 */
export declare const isChannelJustCreated: (channel: GroupChannel) => boolean;
// ===== #isDefaultChannelName =====
import { GroupChannel } from '@sendbird/chat/groupChannel';
export declare const isDefaultChannelName: (channel: GroupChannel) => boolean;
// ===== #isDeliveredMessage =====
import { GroupChannel } from '@sendbird/chat/groupChannel';
export declare const isDeliveredMessage: (channel: GroupChannel, message: SendableMessageType) => boolean;
// ===== #isEditedMessage =====
export declare const isEditedMessage: (message: CoreMessageType) => boolean;
// ===== #isEnabledOGMessage =====
import { UserMessage } from '@sendbird/chat/message';
export declare const isEnabledOGMessage: (message: UserMessage) => boolean;
// ===== #isFailedMessage =====
export declare const isFailedMessage: (message: SendableMessageType) => boolean;
// ===== #isFileAllowedByAccept =====
export declare const isFileAllowedByAccept: (file: File, acceptableMimeTypes?: string[]) => boolean;
// ===== #isFileMessage =====
import { FileMessage } from '@sendbird/chat/message';
export declare const isFileMessage: (message?: CoreMessageType) => message is FileMessage;
// ===== #isFormMessage =====
/**
 * @deprecated This feature is deprecated and will be removed in May 2026.
 */
export declare const isFormMessage: (message: CoreMessageType) => boolean;
// ===== #isFriend =====
import { User } from '@sendbird/chat';
import { Nullable } from '#Nullable';
export declare const isFriend: (user: Nullable<User>) => boolean;
// ===== #isGif =====
export declare const isGif: (type: string) => boolean;
// ===== #isGifMessage =====
import { FileMessage } from '@sendbird/chat/message';
export declare const isGifMessage: (message: SendableMessageType) => message is FileMessage;
// ===== #isImage =====
export declare const isImage: (type: string) => boolean;
// ===== #isImageFileInfo =====
import { UploadedFileInfo } from '@sendbird/chat/message';
export declare const isImageFileInfo: (fileInfo: UploadedFileInfo) => boolean;
// ===== #isImageMessage =====
import { FileMessage } from '@sendbird/chat/message';
export declare const isImageMessage: (message: SendableMessageType) => message is FileMessage;
// ===== #isMOVType =====
export declare const isMOVType: (type: string) => boolean;
// ===== #isMultipleFilesMessage =====
import { MultipleFilesMessage } from '@sendbird/chat/message';
export declare const isMultipleFilesMessage: (message?: CoreMessageType) => message is MultipleFilesMessage;
// ===== #isOGMessage =====
import { UserMessage } from '@sendbird/chat/message';
export declare const isOGMessage: (message: CoreMessageType) => message is UserMessage;
// ===== #isParentMessage =====
export declare const isParentMessage: (message: CoreMessageType) => boolean;
// ===== #isPendingMessage =====
export declare const isPendingMessage: (message: SendableMessageType) => boolean;
// ===== #isReactedBy =====
import { Reaction } from '@sendbird/chat/message';
export declare const isReactedBy: (userId: string, reaction: Reaction) => boolean;
// ===== #isReadMessage =====
import { GroupChannel } from '@sendbird/chat/groupChannel';
export declare const isReadMessage: (channel: GroupChannel, message: SendableMessageType) => boolean;
// ===== #isSendableMessage =====
import { BaseMessage } from '@sendbird/chat/message';
export declare const isSendableMessage: (message?: BaseMessage | null) => message is SendableMessageType;
// ===== #isSentMessage =====
export declare const isSentMessage: (message: SendableMessageType) => boolean;
// ===== #isSentStatus =====
export declare const isSentStatus: (state: string) => boolean;
// ===== #isSupportedFileView =====
export declare const isSupportedFileView: (type: string) => boolean;
// ===== #isSupportedVideoFileTypeInSafari =====
/**
 * @link: https://sendbird.atlassian.net/browse/SBISSUE-16031?focusedCommentId=270601
 * We limitedly support .mov file type for ThumbnailMessage only in Safari browser.
 * */
export declare const isSupportedVideoFileTypeInSafari: (type: string) => boolean;
// ===== #isTemplateMessage =====
export declare const isTemplateMessage: (message: CoreMessageType) => boolean;
// ===== #isTextMessage =====
import { UserMessage } from '@sendbird/chat/message';
export declare const isTextMessage: (message: CoreMessageType) => message is UserMessage;
// ===== #isThreadMessage =====
export declare const isThreadMessage: (message: CoreMessageType) => boolean;
// ===== #isThumbnailMessage =====
import { FileMessage } from '@sendbird/chat/message';
export declare const isThumbnailMessage: (message: CoreMessageType) => message is FileMessage;
// ===== #isUrl =====
/** @deprecated
 * URL detection in a message text will be handled in utils/tokens/tokenize.ts
 */
export declare const isUrl: (text: string) => boolean;
// ===== #isUserMessage =====
import { UserMessage } from '@sendbird/chat/message';
export declare const isUserMessage: (message: CoreMessageType) => message is UserMessage;
// ===== #isValidTemplateMessageType =====
export declare const isValidTemplateMessageType: (templatePayload: unknown) => boolean;
// ===== #isVideo =====
export declare const isVideo: (type: string) => boolean;
// ===== #isVideoMessage =====
import { FileMessage } from '@sendbird/chat/message';
export declare const isVideoMessage: (message: SendableMessageType) => message is FileMessage;
// ===== #isVoiceMessageMimeType =====
export declare const isVoiceMessageMimeType: (type: string) => boolean;
// ===== #isVoiceMessage~c5fbb1df =====
import { Nullable } from '#Nullable';
export declare const isVoiceMessage: (message: Nullable<CoreMessageType>) => boolean;
// ===== #printLog =====
export declare const printLog: ({ level, title, description, payload, }: PrintLogProps) => void;
// ===== #pubSubFactory =====
declare const pubSubFactory: <T extends string | number | symbol = string | number | symbol, U extends {
    topic: T;
    payload: any;
} = any>(opts?: Options) => PubSubTypes<T, U>;
// ===== #sendbirdSelectorsInterface =====
import SendbirdChat from '@sendbird/chat';
import { User } from '@sendbird/chat';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { GroupChannelCreateParams } from '@sendbird/chat/groupChannel';
import { OpenChannel } from '@sendbird/chat/openChannel';
import { OpenChannelCreateParams } from '@sendbird/chat/openChannel';
import { FileMessageCreateParams } from '@sendbird/chat/message';
import { UserMessage } from '@sendbird/chat/message';
import { UserMessageCreateParams } from '@sendbird/chat/message';
import { UserMessageUpdateParams } from '@sendbird/chat/message';
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
// ===== #shouldPubSubPublishToChannel =====
export declare function shouldPubSubPublishToChannel(modules?: PublishingModuleType[]): boolean;
// ===== #shouldPubSubPublishToThread =====
export declare function shouldPubSubPublishToThread(modules?: PublishingModuleType[]): boolean;
// ===== #sortChannelList =====
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { GroupChannelListOrder } from '@sendbird/chat/groupChannel';
export declare const sortChannelList: (channels: GroupChannel[], order: GroupChannelListOrder) => GroupChannel[];
// ===== #stringSet =====
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
// ===== #truncateString =====
export declare const truncateString: (fullStr: string, strLen?: number) => string;
// ===== #uiContainerType =====
export declare const uiContainerType: {
    default: string;
};
// ===== #unnamed~00b5ee48 =====
export { GroupChannelProvider, useGroupChannelContext, GroupChannelManager, };
// ===== #unnamed~0364dc07 =====
import '../index.scss';
// ===== #unnamed~0a424893 =====
export {};
// ===== #unnamed~1d81a599 =====
export { MessageSearchProvider, useMessageSearchContext, MessageSearchManager, };
// ===== #unnamed~263401d1 =====
export default getStringSet;
// ===== #unnamed~29aae833 =====
export default BannedUserList;
// ===== #unnamed~33737e85 =====
export default MessageBody;
// ===== #unnamed~40f290cc =====
export default useMessageSearch;
// ===== #unnamed~4b06d6ed =====
export default MessageView;
// ===== #unnamed~4e499dd8 =====
export default MobileContextMenu;
// ===== #unnamed~6276c039 =====
export default OpenChannelListActionTypes;
// ===== #unnamed~6caabcb0 =====
export default MessageHeader;
// ===== #unnamed~6ec252e9 =====
export default UserListItemMenu;
// ===== #unnamed~700d530a =====
export default useSendbird;
// ===== #unnamed~729b0ca0 =====
export default initialState;
// ===== #unnamed~72ef68eb =====
import './index.scss';
// ===== #unnamed~746709cc =====
/// <reference types="react" />
// ===== #unnamed~75b74249 =====
export default useThreadMessageActions;
// ===== #unnamed~771a9910 =====
export { ChannelSettingsProvider, useChannelSettingsContext };
// ===== #unnamed~799556b1 =====
export default MessageProfile;
// ===== #unnamed~87179b8a =====
export default useFetchNextCallback;
// ===== #unnamed~8f60b613 =====
export default useCreateChannel;
// ===== #unnamed~946f8c96 =====
export default OperatorList;
// ===== #unnamed~96087111 =====
export default pubSubFactory;
// ===== #unnamed~97e6c307 =====
import './color.scss';
// ===== #unnamed~a790f578 =====
export { CreateChannelProvider, CreateChannelContext, useCreateChannelContext, };
// ===== #unnamed~ac971a38 =====
export default MemberList;
// ===== #unnamed~b8befd3f =====
export default useScrollCallback;
// ===== #unnamed~bd50d160 =====
export default useGroupChannelList;
// ===== #unnamed~beaa35db =====
export default RemoveMessageModalView;
// ===== #unnamed~c4fa0534 =====
export default _default;
// ===== #unnamed~c72815cf =====
export default useThread;
// ===== #unnamed~cb78ebce =====
export default MutedMemberList;
// ===== #unnamed~cc0225b0 =====
export default MobileBottomSheet;
// ===== #unnamed~cc77631e =====
export default VoiceMessageInputWrapper;
// ===== #unnamed~ce564dbd =====
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
// ===== #unnamed~d3de72db =====
export { LocalizationContext, LocalizationProvider, useLocalization };
// ===== #unnamed~d6e1e8b8 =====
import './voice-message-wrapper.scss';
// ===== #unnamed~d85a2579 =====
export default SuggestedMentionListView;
// ===== #unnamed~e7ef821b =====
export default ModalRoot;
// ===== #unnamed~f5d0df3a =====
export default useChannelSettings;
// ===== #unnamed~fdc54291 =====
export default EmojiListItems;
// ===== #useChannelSettings =====
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { ChannelSettingsState } from '#ChannelSettingsState';
export declare const useChannelSettings: () => {
    state: ChannelSettingsState;
    actions: {
        setChannel: (channel: GroupChannel) => void;
        setLoading: (loading: boolean) => void;
        setInvalid: (invalid: boolean) => void;
    };
};
// ===== #useChannelSettingsContext =====
import React from 'react';
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
    queries?: import("#ChannelSettingsQueries").ChannelSettingsQueries;
    renderUserListItem?: (props: import("#UserListItemProps").UserListItemProps) => React.ReactNode;
};
// ===== #useCreateChannel =====
import { CreateChannelState } from '#CreateChannelState';
import { CHANNEL_TYPE } from '#CHANNEL_TYPE';
declare const useCreateChannel: () => {
    state: CreateChannelState;
    actions: {
        setPageStep: (pageStep: number) => void;
        setType: (type: CHANNEL_TYPE) => void;
        createChannel: (params: import("@sendbird/chat/groupChannel").GroupChannelCreateParams) => Promise<import("@sendbird/chat/groupChannel").GroupChannel>;
    };
};
// ===== #useCreateChannelContext =====
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { GroupChannelCreateParams } from '@sendbird/chat/groupChannel';
import { CHANNEL_TYPE } from '#CHANNEL_TYPE';
import { SendbirdChatType } from '#SendbirdChatType';
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
// ===== #useFetchNextCallback =====
declare function useFetchNextCallback({ sdkInitialized, openChannelListQuery, }: DynamicParams, { logger, openChannelListDispatcher, }: StaticParams): FetchNextCallbackType;
// ===== #useGroupChannel =====
import { GroupChannelState } from '#GroupChannelState';
export declare const useGroupChannel: () => {
    state: GroupChannelState;
    actions: GroupChannelActions;
};
// ===== #useGroupChannelContext =====
import React from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { ThreadReplySelectType } from '#ThreadReplySelectType';
import { MessageListQueryParamsType } from '#MessageListQueryParamsType';
declare const useGroupChannelContext: () => {
    setCurrentChannel: (channel: GroupChannel) => void;
    handleChannelError: (error: import("@sendbird/chat").SendbirdError) => void;
    markAsReadAll: (channel: GroupChannel) => void;
    markAsUnread: (message: import("#SendableMessageType").SendableMessageType, source?: "manual" | "internal") => void;
    setReadStateChanged: (state: string) => void;
    setFirstUnreadMessageId: (messageId: string | number) => void;
    sendUserMessage: (params: import("@sendbird/chat/message").UserMessageCreateParams) => Promise<import("@sendbird/chat/message").UserMessage>;
    sendFileMessage: (params: import("@sendbird/chat/message").FileMessageCreateParams) => Promise<import("@sendbird/chat/message").FileMessage>;
    sendMultipleFilesMessage: (params: import("@sendbird/chat/message").MultipleFilesMessageCreateParams) => Promise<import("@sendbird/chat/message").MultipleFilesMessage>;
    updateUserMessage: (messageId: number, params: import("@sendbird/chat/message").UserMessageUpdateParams) => Promise<import("@sendbird/chat/message").UserMessage>;
    setNewMessageIds: (ids: number[]) => void;
    setQuoteMessage: (message: import("#SendableMessageType").SendableMessageType) => void;
    setAnimatedMessageId: (messageId: number) => void;
    setIsScrollBottomReached: (isReached: boolean) => void;
    scrollToBottom: (animated?: boolean) => Promise<void>;
    scrollToMessage: (createdAt: number, messageId: number, messageFocusAnimated?: boolean, scrollAnimated?: boolean) => Promise<void>;
    toggleReaction: (message: import("#SendableMessageType").SendableMessageType, emojiKey: string, isReacted: boolean) => void;
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
    replyType?: import("#ReplyType").ReplyType;
    threadReplySelectType?: ThreadReplySelectType;
    disableMarkAsRead?: boolean;
    scrollBehavior?: "auto" | "smooth";
    forceLeftToRightMessageLayout?: boolean;
    startingPoint?: number;
    animatedMessageId?: number;
    onMessageAnimated?: () => void;
    messageListQueryParams?: MessageListQueryParamsType;
    filterEmojiCategoryIds?: (message: import("#SendableMessageType").SendableMessageType) => number[];
    onBeforeSendUserMessage?: import("#OnBeforeHandler").OnBeforeHandler<import("@sendbird/chat/message").UserMessageCreateParams>;
    onBeforeSendFileMessage?: import("#OnBeforeHandler").OnBeforeHandler<import("@sendbird/chat/message").FileMessageCreateParams>;
    onBeforeSendVoiceMessage?: import("#OnBeforeHandler").OnBeforeHandler<import("@sendbird/chat/message").FileMessageCreateParams>;
    onBeforeSendMultipleFilesMessage?: import("#OnBeforeHandler").OnBeforeHandler<import("@sendbird/chat/message").MultipleFilesMessageCreateParams>;
    onBeforeUpdateUserMessage?: import("#OnBeforeHandler").OnBeforeHandler<import("@sendbird/chat/message").UserMessageUpdateParams>;
    onBeforeDownloadFileMessage?: import("#OnBeforeDownloadFileMessageType").OnBeforeDownloadFileMessageType;
    onBackClick?(): void;
    onChatHeaderActionClick?(event: React.MouseEvent<HTMLElement, MouseEvent>): void;
    onReplyInThreadClick?: (props: {
        message: import("#SendableMessageType").SendableMessageType;
    }) => void;
    onSearchClick?(): void;
    onQuoteMessageClick?: (props: {
        message: import("#SendableMessageType").SendableMessageType;
    }) => void;
    renderUserMentionItem?: (props: {
        user: import("@sendbird/chat").User;
    }) => JSX.Element;
    renderUserProfile?: ((props: import("#RenderUserProfileProps").RenderUserProfileProps) => React.ReactElement<any, string | React.JSXElementConstructor<any>>) & ((props: import("#RenderUserProfileProps").RenderUserProfileProps) => React.ReactElement<any, string | React.JSXElementConstructor<any>>);
    onStartDirectMessage?: (channel: GroupChannel) => void;
    onUserProfileMessage?: (channel: GroupChannel) => void;
    disableUserProfile?: boolean;
    children?: React.ReactNode;
    currentChannel: GroupChannel;
    fetchChannelError: import("@sendbird/chat").SendbirdError;
    nicknamesMap: Map<string, string>;
    quoteMessage: import("#SendableMessageType").SendableMessageType;
    isScrollBottomReached: boolean;
    readState: string;
    newMessageIds: number[];
    scrollRef: React.RefObject<HTMLDivElement>;
    scrollDistanceFromBottomRef: React.MutableRefObject<number>;
    scrollPositionRef: React.MutableRefObject<number>;
    messageInputRef: React.RefObject<HTMLDivElement>;
    markAsUnreadSourceRef: React.MutableRefObject<"manual" | "internal">;
    scrollPubSub: import("#PubSubTypes").PubSubTypes<import("#ScrollTopics").ScrollTopics, import("#ScrollTopicUnion").ScrollTopicUnion>;
};
// ===== #useGroupChannelList =====
import { GroupChannelListState } from '#GroupChannelListState';
export declare const useGroupChannelList: () => {
    state: GroupChannelListState;
    actions: {
        setGroupChannels: (channels: any) => void;
    };
};
// ===== #useGroupChannelListContext =====
import React from 'react';
import { User } from '@sendbird/chat';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { GroupChannelCreateParams } from '@sendbird/chat/groupChannel';
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
// ===== #useGroupChannelListStore =====
/**
 * @returns {ReturnType<typeof createStore<GroupChannelListState>>}
 */
export declare const useGroupChannelListStore: () => {
    state: GroupChannelListState;
    updateState: (updates: Partial<GroupChannelListState>) => void;
};
// ===== #useLocalization =====
import { StringSet } from '#StringSet~cb28c5f7';
import { Locale } from 'date-fns';
declare const useLocalization: () => {
    stringSet: StringSet;
    dateLocale: globalThis.Locale;
};
// ===== #useMarkAsDeliveredScheduler =====
export declare function useMarkAsDeliveredScheduler({ isConnected, }: DynamicParams, { logger, }: StaticParams): MarkAsDeliveredSchedulerType;
// ===== #useMarkAsReadScheduler =====
export declare function useMarkAsReadScheduler({ isConnected, }: DynamicParams, { logger, }: StaticParams): MarkAsReadSchedulerType;
// ===== #useMessageActions =====
/**
 * @description This hook controls common processes related to message sending, updating.
 * */
export declare function useMessageActions(params: Params): MessageActions;
// ===== #useMessageListScroll =====
import { DependencyList } from 'react';
export declare function useMessageListScroll(behavior: 'smooth' | 'auto', deps?: DependencyList): {
    scrollRef: import("react").MutableRefObject<HTMLDivElement>;
    scrollPubSub: import("#PubSubTypes").PubSubTypes<ScrollTopics, ScrollTopicUnion>;
    scrollDistanceFromBottomRef: import("react").MutableRefObject<number>;
    scrollPositionRef: import("react").MutableRefObject<number>;
};
// ===== #useMessageMenuContext =====
export declare const useMessageMenuContext: () => MessageMenuContextProps | MobileMessageMenuContextProps;
// ===== #useMessageSearch =====
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { MessageSearchQuery } from '@sendbird/chat/message';
import { ClientSentMessages } from '#ClientSentMessages';
import { MessageSearchState } from '#MessageSearchState';
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
// ===== #useMessageSearchContext =====
import React from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { MessageSearchQuery } from '@sendbird/chat/message';
import { ClientSentMessages } from '#ClientSentMessages';
import { SendbirdError } from '@sendbird/chat';
import { MessageSearchQueryParams } from '@sendbird/chat/lib/__definition';
import useScrollCallback from '#useScrollCallback';
import { CoreMessageType } from '#CoreMessageType';
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
// ===== #usePendingFiles =====
/**
 * Holds files staged for the message composer before send. Producers (file
 * picker, drag-and-drop, clipboard paste) all call addFiles. The owning
 * wrapper drains pendingFiles on submit and calls clear().
 */
export declare const usePendingFiles: ({ uikitUploadSizeLimit, uikitMultipleFilesMessageLimit, acceptableMimeTypes, openModal, stringSet, logger, }: UsePendingFilesParams) => UsePendingFilesReturn;
// ===== #useScrollCallback =====
declare function useScrollCallback({ onResultLoaded }: MainProps, { logger }: ToolProps): CallbackReturn;
// ===== #useSendFileMessageCallback =====
export default function useSendFileMessageCallback({ currentChannel, onBeforeSendFileMessage, sendMessageStart, sendMessageFailure, }: DynamicProps, { logger, pubSub, }: StaticProps): SendFileMessageFunctionType;
// ===== #useSendMultipleFilesMessage =====
/**
 * pubSub is used instead of messagesDispatcher to avoid redundantly calling
 * because this useSendMultipleFilesMessage is used in the Channel and Thread both
 */
export declare const useSendMultipleFilesMessage: ({ currentChannel, onBeforeSendMultipleFilesMessage, publishingModules, }: UseSendMFMDynamicParams, { logger, pubSub, scrollRef, }: UseSendMFMStaticParams) => Array<SendMFMFunctionType>;
// ===== #useSendbird =====
import { User } from '@sendbird/chat';
import { LoggerInterface } from '#LoggerInterface';
import { MessageTemplatesInfo } from '#MessageTemplatesInfo';
import { SendbirdState } from '#SendbirdState';
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
// ===== #useThread =====
import { ThreadState } from '#ThreadState';
import { FileUploadInfoParams } from '#FileUploadInfoParams';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { Member } from '@sendbird/chat/groupChannel';
import { CoreMessageType } from '#CoreMessageType';
import { SendableMessageType } from '#SendableMessageType';
import { EmojiContainer } from '@sendbird/chat';
import { User } from '@sendbird/chat';
import { BaseMessage } from '@sendbird/chat/message';
import { ReactionEvent } from '@sendbird/chat/message';
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
        sendMessage: (props: import("#SendMessageParams~31562896").SendMessageParams) => void;
        sendFileMessage: (file: File, quoteMessage?: SendableMessageType) => Promise<import("@sendbird/chat/message").FileMessage>;
        sendVoiceMessage: (file: File, duration: number, quoteMessage?: SendableMessageType) => void;
        sendMultipleFilesMessage: (files: File[], quoteMessage?: SendableMessageType) => Promise<import("@sendbird/chat/message").MultipleFilesMessage>;
        updateMessage: (props: import("#UpdateMessageParams~4498314c").UpdateMessageParams) => void;
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
// ===== #useThreadContext =====
import React from 'react';
import { EmojiCategory } from '@sendbird/chat';
import { EmojiContainer } from '@sendbird/chat';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { Member } from '@sendbird/chat/groupChannel';
import { FileMessage } from '@sendbird/chat/message';
import { FileMessageCreateParams } from '@sendbird/chat/message';
import { MultipleFilesMessage } from '@sendbird/chat/message';
import { MultipleFilesMessageCreateParams } from '@sendbird/chat/message';
import { UserMessageCreateParams } from '@sendbird/chat/message';
import { OnBeforeDownloadFileMessageType } from '#OnBeforeDownloadFileMessageType';
import { CoreMessageType } from '#CoreMessageType';
import { SendableMessageType } from '#SendableMessageType';
import { ChannelStateTypes } from '#ChannelStateTypes';
import { ParentMessageStateTypes } from '#ParentMessageStateTypes';
import { ThreadListStateTypes } from '#ThreadListStateTypes';
export declare const useThreadContext: () => {
    onMessageReceived: (channel: GroupChannel, message: SendableMessageType) => void;
    onReactionUpdated: (reactionEvent: import("@sendbird/chat/message").ReactionEvent) => void;
    onFileInfoUpdated: (params: import("#FileUploadInfoParams").FileUploadInfoParams) => void;
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
    sendMessage: (props: import("#SendMessageParams~31562896").SendMessageParams) => void;
    sendFileMessage: (file: File, quoteMessage?: SendableMessageType) => Promise<FileMessage>;
    sendVoiceMessage: (file: File, duration: number, quoteMessage?: SendableMessageType) => void;
    sendMultipleFilesMessage: (files: File[], quoteMessage?: SendableMessageType) => Promise<MultipleFilesMessage>;
    updateMessage: (props: import("#UpdateMessageParams~4498314c").UpdateMessageParams) => void;
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
    renderUserProfile?: ((props: import("#RenderUserProfileProps").RenderUserProfileProps) => React.ReactElement<any, string | React.JSXElementConstructor<any>>) & ((props: import("#RenderUserProfileProps").RenderUserProfileProps) => React.ReactElement<any, string | React.JSXElementConstructor<any>>);
    disableUserProfile?: boolean;
};
// ===== #useThreadMessageActions =====
import { ThreadState } from '#ThreadState';
export declare function useThreadMessageActions(state: ThreadState, { logger, pubSub, isMentionEnabled }: StaticProps): ThreadMessageActions;
// ===== #useToggleBan =====
import { UserListItemMenuContextValues } from '#UserListItemMenuContextValues';
export declare const useToggleBan: ({ channel, user, onToggleBanState, isBanned: _isBanned, }: UserListItemMenuContextValues & {
    isBanned?: boolean;
}) => {
    isBanned: boolean;
    toggleBan: () => Promise<void>;
};
// ===== #useToggleContext =====
export declare function useToggleContext(): ToggleContextInterface;
// ===== #useToggleMute =====
import { UserListItemMenuContextValues } from '#UserListItemMenuContextValues';
export declare const useToggleMute: ({ channel, user, onToggleMuteState, isMuted: _isMuted, }: UserListItemMenuContextValues & {
    isMuted?: boolean;
}) => {
    isMuted: boolean;
    toggleMute: () => Promise<void>;
};
// ===== #useToggleOperator =====
import { UserListItemMenuContextValues } from '#UserListItemMenuContextValues';
export declare const useToggleOperator: ({ channel, user, onToggleOperatorState, isOperator: _isOperator, }: UserListItemMenuContextValues & {
    isOperator?: boolean;
}) => {
    isOperator: boolean;
    toggleOperator: () => Promise<void>;
};
// ===== #useUserListItemMenuContext =====
export declare const useUserListItemMenuContext: () => UserListItemMenuContextInterface;
// ===== #useUserProfileContext =====
export declare const useUserProfileContext: () => UserProfileContextInterface;
// ===== #voicePlayerInitialState =====
export declare const voicePlayerInitialState: VoicePlayerInitialState;
// ===== @App =====
/**
 * This is a drop in Chat solution
 * Can also be used as an example for creating
 * default chat apps
 */
import React from 'react';
import { SendbirdProviderProps } from '#SendbirdProviderProps:type';
import './index.scss';
import { AppLayoutProps } from '#AppLayoutProps';
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
// ===== @Channel =====
import React from 'react';
import { ChannelContextProps } from '#ChannelContextProps';
import { ChannelUIProps } from '#ChannelUIProps';
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
// ===== @Channel/components/ChannelHeader =====
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
// ===== @Channel/components/ChannelUI =====
import React from 'react';
import { GroupChannelUIBasicProps } from '#GroupChannelUIBasicProps';
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
// ===== @Channel/components/FileViewer =====
import React from 'react';
import { FileMessage } from '@sendbird/chat/message';
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
// ===== @Channel/components/FrozenNotification =====
import FrozenNotification from '#FrozenNotification~d4a441f8';
export default FrozenNotification;
// ===== @Channel/components/Message =====
import React from 'react';
import { MessageProps } from '#MessageProps';
/**
 * @deprecated This component is deprecated and will be removed in the next major update.
 * Please use the `GroupChannel` component from '@sendbird/uikit-react/GroupChannel' instead.
 * For more information, please refer to the migration guide:
 * https://docs.sendbird.com/docs/chat/uikit/v3/react/introduction/group-channel-migration-guide
 */
declare const Message: (props: MessageProps) => React.JSX.Element;
export default Message;
// ===== @Channel/components/MessageInput|Channel/components/MessageInputWrapper =====
import React from 'react';
import { GroupChannelUIBasicProps } from '#GroupChannelUIBasicProps';
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
// ===== @Channel/components/MessageList =====
import '../../../GroupChannel/components/MessageList/index.scss';
import React from 'react';
import { GroupChannelMessageListProps } from '#GroupChannelMessageListProps';
import { GroupChannelUIBasicProps } from '#GroupChannelUIBasicProps';
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
// ===== @Channel/components/RemoveMessageModal =====
import React from 'react';
import { RemoveMessageModalProps } from '#RemoveMessageModalProps';
/**
 * @deprecated This component is deprecated and will be removed in the next major update.
 * Please use the `GroupChannel` component from '@sendbird/uikit-react/GroupChannel' instead.
 * For more information, please refer to the migration guide:
 * https://docs.sendbird.com/docs/chat/uikit/v3/react/introduction/group-channel-migration-guide
 */
declare const RemoveMessageModal: (props: RemoveMessageModalProps) => React.JSX.Element;
export default RemoveMessageModal;
// ===== @Channel/components/SuggestedMentionList =====
import React from 'react';
import { SuggestedMentionListViewProps } from '#SuggestedMentionListViewProps';
export type SuggestedMentionListProps = Omit<SuggestedMentionListViewProps, 'currentChannel'>;
/**
 * @deprecated This component is deprecated and will be removed in the next major update.
 * Please use the `GroupChannel` component from '@sendbird/uikit-react/GroupChannel' instead.
 * For more information, please refer to the migration guide:
 * https://docs.sendbird.com/docs/chat/uikit/v3/react/introduction/group-channel-migration-guide
 */
export declare const SuggestedMentionList: (props: SuggestedMentionListProps) => React.JSX.Element;
export default SuggestedMentionList;
// ===== @Channel/components/TypingIndicator =====
import TypingIndicator from '#TypingIndicator';
export default TypingIndicator;
// ===== @Channel/components/UnreadCount =====
import UnreadCount from '#UnreadCount';
export default UnreadCount;
// ===== @Channel/context =====
import React from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { Member } from '@sendbird/chat/groupChannel';
import { BaseMessage } from '@sendbird/chat/message';
import { FileMessage } from '@sendbird/chat/message';
import { FileMessageCreateParams } from '@sendbird/chat/message';
import { MessageListParams as SDKMessageListParams } from '@sendbird/chat/message';
import { MultipleFilesMessage } from '@sendbird/chat/message';
import { MultipleFilesMessageCreateParams } from '@sendbird/chat/message';
import { UserMessage } from '@sendbird/chat/message';
import { UserMessageCreateParams } from '@sendbird/chat/message';
import { UserMessageUpdateParams } from '@sendbird/chat/message';
import { EmojiContainer } from '@sendbird/chat';
import { SendbirdError } from '@sendbird/chat';
import { User } from '@sendbird/chat';
import { Nullable } from '#Nullable';
import { ReplyType } from '#ReplyType';
import { UserProfileProviderProps } from '#UserProfileProviderProps';
import { CoreMessageType } from '#CoreMessageType';
import { SendableMessageType } from '#SendableMessageType';
import { ThreadReplySelectType } from '#ThreadReplySelectType';
import * as channelActions from '#ChannelActionTypes~1ebb8961';
import { ChannelActionTypes } from '#ChannelActionTypes';
export { ThreadReplySelectType } from '#ThreadReplySelectType';
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
// ===== @Channel/hooks/useHandleUploadFiles =====
import { Logger } from '#Logger~6cebce76';
import { SendMFMFunctionType } from '#SendMFMFunctionType';
import { SendableMessageType } from '#SendableMessageType';
import { SendFileMessageFunctionType } from '#SendFileMessageFunctionType';
import { FileMessage } from '@sendbird/chat/message';
import { MultipleFilesMessage } from '@sendbird/chat/message';
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
// ===== @Channel/hooks/useInitialMessagesFetch =====
import React from 'react';
import { MessageListParams as MessageListParamsInternal } from '#MessageListParams';
import { ReplyType as ReplyTypeInternal } from '#ReplyType';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { LoggerInterface } from '#LoggerInterface';
import { ChannelActionTypes } from '#ChannelActionTypes';
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
// ===== @Channel/utils/compareMessagesForGrouping =====
import { BaseMessage } from '@sendbird/chat/message';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { ReplyType } from '#ReplyType';
import { CoreMessageType } from '#CoreMessageType';
import { StringSet } from '#StringSet~cb28c5f7';
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
// ===== @Channel/utils/getMessagePartsInfo =====
/// <reference types="react" />
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { CoreMessageType } from '#CoreMessageType';
import { StringSet } from '#StringSet~cb28c5f7';
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
// ===== @ChannelList =====
import React from 'react';
import { ChannelListProviderProps } from '#ChannelListProviderProps';
import { ChannelListUIProps } from '#ChannelListUIProps';
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
// ===== @ChannelList/components/AddChannel =====
import React from 'react';
export declare const AddChannel: () => React.JSX.Element;
export default AddChannel;
// ===== @ChannelList/components/ChannelListHeader =====
import ChannelListHeader from '#GroupChannelListHeader';
export default ChannelListHeader;
// ===== @ChannelList/components/ChannelListUI =====
import React from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { GroupChannelListItemBasicProps } from '#GroupChannelListItemBasicProps';
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
// ===== @ChannelList/components/ChannelPreview =====
import React from 'react';
import { GroupChannelListItemBasicProps } from '#GroupChannelListItemBasicProps';
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
// ===== @ChannelList/components/ChannelPreviewAction =====
import GroupChannelPreviewAction from '#GroupChannelPreviewAction';
export default GroupChannelPreviewAction;
// ===== @ChannelList/context =====
import React from 'react';
import { User } from '@sendbird/chat';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { GroupChannelCreateParams } from '@sendbird/chat/groupChannel';
import { GroupChannelListOrder } from '@sendbird/chat/groupChannel';
import { GroupChannelListQuery as GroupChannelListQuerySb } from '@sendbird/chat/groupChannel';
import { GroupChannelUserIdsFilter } from '@sendbird/chat/groupChannel';
import { HiddenChannelFilter } from '@sendbird/chat/groupChannel';
import { MyMemberStateFilter } from '@sendbird/chat/groupChannel';
import { PublicChannelFilter } from '@sendbird/chat/groupChannel';
import { QueryType } from '@sendbird/chat/groupChannel';
import { SuperChannelFilter } from '@sendbird/chat/groupChannel';
import { UnreadChannelFilter } from '@sendbird/chat/groupChannel';
import { ChannelListActionTypes } from '#ChannelListActionTypes';
import { UserProfileProviderProps } from '#UserProfileProviderProps';
import { CHANNEL_TYPE } from '#CHANNEL_TYPE';
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
// ===== @ChannelSettings =====
import React from 'react';
import { ChannelSettingsUIProps } from '#ChannelSettingsUIProps';
import { ChannelSettingsContextProps } from '#ChannelSettingsContextProps';
interface ChannelSettingsProps extends ChannelSettingsContextProps, Omit<ChannelSettingsUIProps, 'renderUserListItem'> {
}
declare const ChannelSettings: React.FC<ChannelSettingsProps>;
export default ChannelSettings;
// ===== @ChannelSettings/components/ChannelProfile =====
import './channel-profile.scss';
import React from 'react';
declare const ChannelProfile: React.FC;
export default ChannelProfile;
// ===== @ChannelSettings/components/ChannelSettingMenuList =====
import '../ModerationPanel/admin-panel.scss';
import '../UserPanel/user-panel.scss';
import React from 'react';
import useMenuItems from '#useMenuItems';
interface MenuListByRoleProps {
    menuItems: ReturnType<typeof useMenuItems>;
}
export declare const MenuListByRole: ({ menuItems, }: MenuListByRoleProps) => React.JSX.Element;
export default MenuListByRole;
// ===== @ChannelSettings/components/ChannelSettingsHeader =====
import React from 'react';
import { MouseEvent } from 'react';
import { HeaderCustomProps } from '#HeaderCustomProps';
export interface ChannelSettingsHeaderProps extends HeaderCustomProps {
    onCloseClick?: (e: MouseEvent) => void;
}
export declare const ChannelSettingsHeader: ({ onCloseClick, renderLeft, renderMiddle, renderRight, }: ChannelSettingsHeaderProps) => React.JSX.Element;
export default ChannelSettingsHeader;
// ===== @ChannelSettings/components/ChannelSettingsMenuItem =====
import React from 'react';
import { ReactNode } from 'react';
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
// ===== @ChannelSettings/components/ChannelSettingsUI =====
import './channel-settings-ui.scss';
import React from 'react';
import { ReactNode } from 'react';
import useMenuItems from '#useMenuItems';
import { ChannelSettingsHeaderProps } from '#ChannelSettingsHeaderProps';
import { UserListItemProps } from '#UserListItemProps';
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
export { OperatorList } from '#OperatorList';
export { MemberList } from '#MemberList';
export { MutedMemberList } from '#MutedMemberList';
export { BannedUserList } from '#BannedUserList';
// ===== @ChannelSettings/components/EditDetailsModal =====
import React from 'react';
export type EditDetailsProps = {
    onSubmit: () => void;
    onCancel: () => void;
};
declare const EditDetails: React.FC<EditDetailsProps>;
export default EditDetails;
// ===== @ChannelSettings/components/LeaveChannel =====
import './leave-channel.scss';
import React from 'react';
export type LeaveChannelProps = {
    onSubmit: () => void;
    onCancel: () => void;
};
declare const LeaveChannel: React.FC<LeaveChannelProps>;
export default LeaveChannel;
// ===== @ChannelSettings/components/ModerationPanel =====
import './admin-panel.scss';
import { ReactElement } from 'react';
/**
 * @deprecated
 * `ModerationPanel` is deprecated.
 * Use `@sendbird/ChannelSettings/components/ChannelSettingMenuList` instead.
 */
export default function ModerationPanel(): ReactElement;
// ===== @ChannelSettings/components/UserListItem =====
import { UserListItem as UIUserListItem } from '#UserListItem~6fc9478d';
/**
 * @deprecated This modules has been deprecated, please import from '@sendbird/uikit-react/ui/UserListItem'
 */
export declare const UserListItem: typeof UIUserListItem;
export default UserListItem;
// ===== @ChannelSettings/components/UserPanel =====
import './user-panel.scss';
import React from 'react';
declare const UserPanel: React.FC;
/**
 * @deprecated
 * `UserPanel` is deprecated.
 * Use `@sendbird/ChannelSettings/components/ChannelSettingMenuList` instead.
 */
export default UserPanel;
// ===== @ChannelSettings/context =====
export * from '#ChannelSettingsContext~8bd9ae9b';
export * from '#ChannelSettingsContextProps~e4116872';
export { useChannelSettings } from '#useChannelSettings';
// ===== @ChannelSettings/hooks/useMenuList =====
import React from 'react';
import { IconProps } from '#IconProps';
import { LabelProps } from '#LabelProps';
import { MenuItemActionProps } from '#MenuItemActionProps';
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
// ===== @CreateChannel =====
import React from 'react';
import { CreateChannelUIProps } from '#CreateChannelUIProps';
import { CreateChannelProviderProps } from '#CreateChannelProviderProps';
export interface CreateChannelProps extends CreateChannelProviderProps, CreateChannelUIProps {
}
declare const CreateChannel: React.FC<CreateChannelProps>;
export default CreateChannel;
// ===== @CreateChannel/components/CreateChannelUI =====
import './create-channel-ui.scss';
import React from 'react';
export interface CreateChannelUIProps {
    onCancel?(): void;
    renderStepOne?: (props: void) => React.ReactElement;
}
declare const CreateChannel: React.FC<CreateChannelUIProps>;
export default CreateChannel;
// ===== @CreateChannel/components/InviteUsers =====
import React from 'react';
import './invite-users.scss';
import { UserListQuery } from '#UserListQuery';
export interface InviteUsersProps {
    onCancel?: () => void;
    userListQuery?(): UserListQuery;
}
declare const InviteUsers: React.FC<InviteUsersProps>;
export default InviteUsers;
// ===== @CreateChannel/components/SelectChannelType =====
import React from 'react';
export interface SelectChannelTypeProps {
    onCancel?(): void;
}
declare const SelectChannelType: React.FC<SelectChannelTypeProps>;
export default SelectChannelType;
// ===== @CreateChannel/context =====
export * from '#CreateChannelContext~6c503f78';
export { default as useCreateChannel } from '#useCreateChannel';
// ===== @CreateOpenChannel =====
import React from 'react';
import { CreateOpenChannelUIProps } from '#CreateOpenChannelUIProps';
import { CreateOpenChannelProviderProps } from '#CreateOpenChannelProviderProps';
export interface CreateOpenChannelProps extends CreateOpenChannelProviderProps, CreateOpenChannelUIProps {
}
declare function CreateOpenChannel({ className, onCreateChannel, onBeforeCreateChannel, closeModal, renderHeader, renderProfileInput, }: CreateOpenChannelProps): React.ReactElement;
export default CreateOpenChannel;
// ===== @CreateOpenChannel/components/CreateOpenChannelUI =====
import React from 'react';
import './index.scss';
export interface CreateOpenChannelUIProps {
    closeModal?: () => void;
    renderHeader?: () => React.ReactElement;
    renderProfileInput?: () => React.ReactElement;
}
declare function CreateOpenChannelUI({ closeModal, renderHeader, renderProfileInput, }: CreateOpenChannelUIProps): React.ReactElement;
export default CreateOpenChannelUI;
// ===== @CreateOpenChannel/context =====
import React from 'react';
import { OpenChannel } from '@sendbird/chat/openChannel';
import { OpenChannelCreateParams } from '@sendbird/chat/openChannel';
import { Logger } from '#Logger~6cebce76';
import { SdkStore } from '#SdkStore';
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
// ===== @EditUserProfile =====
import React from 'react';
import { EditUserProfileProps } from '#EditUserProfileProps';
declare const EditUserProfile: React.FC<EditUserProfileProps>;
export default EditUserProfile;
// ===== @EditUserProfile/components/EditUserProfileUI =====
import React from 'react';
import { User } from '@sendbird/chat';
import './edit-user-profile.scss';
import { EditUserProfileUIView } from '#EditUserProfileUIView';
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
// ===== @EditUserProfile/context =====
import { User } from '@sendbird/chat';
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
// ===== @GroupChannel =====
import React from 'react';
import { GroupChannelProviderProps } from '#GroupChannelProviderProps';
import { GroupChannelUIProps } from '#GroupChannelUIProps';
export interface GroupChannelProps extends GroupChannelProviderProps, GroupChannelUIProps {
}
export declare const GroupChannel: (props: GroupChannelProps) => React.JSX.Element;
export default GroupChannel;
// ===== @GroupChannel/components/FileViewer =====
import React from 'react';
import { FileMessage } from '@sendbird/chat/message';
export interface FileViewerProps {
    onCancel: () => void;
    message: FileMessage;
}
export declare const FileViewer: (props: FileViewerProps) => React.JSX.Element;
export default FileViewer;
// ===== @GroupChannel/components/FrozenNotification =====
import './index.scss';
import React from 'react';
export interface FrozenNotificationProps {
    className?: string;
}
export declare const FrozenNotification: ({ className, }: FrozenNotificationProps) => React.ReactElement;
export default FrozenNotification;
// ===== @GroupChannel/components/GroupChannelHeader =====
import React from 'react';
import { HeaderCustomProps } from '#HeaderCustomProps';
export interface GroupChannelHeaderProps extends HeaderCustomProps {
    className?: string;
}
export declare const GroupChannelHeader: (props: GroupChannelHeaderProps) => React.JSX.Element;
export default GroupChannelHeader;
// ===== @GroupChannel/components/GroupChannelUI =====
import React from 'react';
import { GroupChannelUIBasicProps } from '#GroupChannelUIBasicProps';
export interface GroupChannelUIProps extends GroupChannelUIBasicProps {
}
export declare const GroupChannelUI: (props: GroupChannelUIProps) => React.JSX.Element;
export default GroupChannelUI;
// ===== @GroupChannel/components/Message =====
import React from 'react';
import { MessageProps } from '#MessageProps';
export declare const Message: (props: MessageProps) => React.ReactElement;
export default Message;
// ===== @GroupChannel/components/MessageInputWrapper =====
import React from 'react';
import { GroupChannelUIBasicProps } from '#GroupChannelUIBasicProps';
export interface MessageInputWrapperProps {
    value?: string;
    disabled?: boolean;
    acceptableMimeTypes?: string[];
    renderFileUploadIcon?: GroupChannelUIBasicProps['renderFileUploadIcon'];
    renderVoiceMessageIcon?: GroupChannelUIBasicProps['renderVoiceMessageIcon'];
    renderSendMessageIcon?: GroupChannelUIBasicProps['renderSendMessageIcon'];
}
export declare const MessageInputWrapper: (props: MessageInputWrapperProps) => React.JSX.Element;
export { VoiceMessageInputWrapper } from '#VoiceMessageInputWrapper';
export { type VoiceMessageInputWrapperProps } from '#VoiceMessageInputWrapperProps';
export default MessageInputWrapper;
// ===== @GroupChannel/components/MessageList =====
import './index.scss';
import React from 'react';
import { GroupChannelUIBasicProps } from '#GroupChannelUIBasicProps';
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
// ===== @GroupChannel/components/RemoveMessageModal =====
import React from 'react';
import { RemoveMessageModalProps } from '#RemoveMessageModalProps';
export declare const RemoveMessageModal: (props: RemoveMessageModalProps) => React.JSX.Element;
export default RemoveMessageModal;
// ===== @GroupChannel/components/SuggestedMentionList =====
import React from 'react';
import { SuggestedMentionListViewProps } from '#SuggestedMentionListViewProps';
export type SuggestedMentionListProps = SuggestedMentionListViewProps;
export declare const SuggestedMentionList: (props: SuggestedMentionListProps) => React.JSX.Element;
export default SuggestedMentionList;
// ===== @GroupChannel/components/SuggestedReplies =====
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
// ===== @GroupChannel/components/TypingIndicator =====
import React from 'react';
import { Member } from '@sendbird/chat/groupChannel';
export interface TypingIndicatorTextProps {
    members: Member[];
}
export declare const TypingIndicatorText: ({ members }: TypingIndicatorTextProps) => React.JSX.Element;
export interface TypingIndicatorProps {
    channelUrl: string;
}
export declare const TypingIndicator: ({ channelUrl }: TypingIndicatorProps) => React.JSX.Element;
export default TypingIndicator;
// ===== @GroupChannel/components/UnreadCount =====
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
// ===== @GroupChannel/context =====
export * from '#GroupChannelContext~d3040dd1';
export * from '#GroupChannelProviderProps~8042978d';
export { useGroupChannel } from '#useGroupChannel';
// ===== @GroupChannelList =====
import React from 'react';
import { GroupChannelListProviderProps } from '#GroupChannelListProviderProps';
import { GroupChannelListUIProps } from '#GroupChannelListUIProps';
export interface GroupChannelListProps extends GroupChannelListProviderProps, GroupChannelListUIProps {
}
export declare const GroupChannelList: (props: GroupChannelListProps) => React.JSX.Element;
export default GroupChannelList;
// ===== @GroupChannelList/components/AddGroupChannel =====
import React from 'react';
export declare const AddGroupChannel: () => React.JSX.Element;
export default AddGroupChannel;
// ===== @GroupChannelList/components/GroupChannelListHeader =====
import React from 'react';
import './index.scss';
import { HeaderCustomProps } from '#HeaderCustomProps';
export interface GroupChannelListHeaderProps extends HeaderCustomProps {
    /** @deprecated Use the props `renderMiddle` instead */
    renderTitle?: () => React.ReactElement;
    renderIconButton?: (props: void) => React.ReactElement;
    onEdit?: (props: void) => void;
    allowProfileEdit?: boolean;
}
export declare const GroupChannelListHeader: ({ renderTitle, renderIconButton, onEdit, allowProfileEdit, renderLeft, renderMiddle, renderRight, }: GroupChannelListHeaderProps) => React.JSX.Element;
export default GroupChannelListHeader;
// ===== @GroupChannelList/components/GroupChannelListItem =====
import React from 'react';
import { GroupChannelListItemBasicProps } from '#GroupChannelListItemBasicProps';
export interface GroupChannelListItemProps extends GroupChannelListItemBasicProps {
}
export declare const GroupChannelListItem: ({ channel, isSelected, isTyping, renderChannelAction, onLeaveChannel, onClick, tabIndex, }: GroupChannelListItemProps) => React.JSX.Element;
// ===== @GroupChannelList/components/GroupChannelListUI =====
import './index.scss';
import React from 'react';
import { GroupChannelListItemBasicProps } from '#GroupChannelListItemBasicProps';
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
// ===== @GroupChannelList/components/GroupChannelPreviewAction =====
import React from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
export interface GroupChannelPreviewActionProps {
    channel?: GroupChannel;
    disabled?: boolean;
    onLeaveChannel?: () => Promise<void>;
}
export declare function GroupChannelPreviewAction({ channel, disabled, onLeaveChannel }: GroupChannelPreviewActionProps): React.JSX.Element;
export default GroupChannelPreviewAction;
// ===== @GroupChannelList/context =====
export * from '#ChannelListQueryParamsType~3251211d';
export { useGroupChannelList } from '#useGroupChannelList';
// ===== @Message/context =====
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
// ===== @Message/hooks/useDirtyGetMentions =====
/// <reference types="react" />
import { Logger } from '#Logger~6cebce76';
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
// ===== @MessageSearch =====
/// <reference types="react" />
import './index.scss';
import { MessageSearchUIProps } from '#MessageSearchUIProps';
import { MessageSearchProviderProps } from '#MessageSearchProviderProps';
export interface MessageSearchPannelProps extends MessageSearchUIProps, MessageSearchProviderProps {
    onCloseClick?: () => void;
}
declare function MessageSearchPannel(props: MessageSearchPannelProps): JSX.Element;
export default MessageSearchPannel;
// ===== @MessageSearch/components/MessageSearchUI =====
import React from 'react';
import './index.scss';
import { ClientSentMessages } from '#ClientSentMessages';
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
// ===== @MessageSearch/context =====
export * from '#MessageSearchContext~757a2dd0';
export { default as useMessageSearch } from '#useMessageSearch';
// ===== @OpenChannel =====
import React from 'react';
import { OpenChannelUIProps } from '#OpenChannelUIProps~e11c3115';
import { OpenChannelProviderProps } from '#OpenChannelProviderProps';
export interface OpenChannelProps extends OpenChannelProviderProps, OpenChannelUIProps {
}
declare const OpenChannel: React.FC<OpenChannelProps>;
export default OpenChannel;
// ===== @OpenChannel/components/FrozenChannelNotification =====
/// <reference types="react" />
import './frozen-channel-notification.scss';
declare const FrozenNotification: () => JSX.Element;
export default FrozenNotification;
// ===== @OpenChannel/components/OpenChannelHeader =====
/// <reference types="react" />
import './open-channel-header.scss';
export default function OpenchannelConversationHeader(): JSX.Element;
// ===== @OpenChannel/components/OpenChannelInput =====
import React from 'react';
export type MessageInputWrapperProps = {
    value?: string;
};
declare const _default: React.ForwardRefExoticComponent<MessageInputWrapperProps & React.RefAttributes<HTMLInputElement>>;
export default _default;
// ===== @OpenChannel/components/OpenChannelMessage =====
import './open-channel-message.scss';
import React from 'react';
import { ReactElement } from 'react';
import { RenderMessageProps } from '#RenderMessageProps';
import { CoreMessageType } from '#CoreMessageType';
export type OpenChannelMessageProps = {
    renderMessage?: (props: RenderMessageProps) => React.ReactElement;
    message: CoreMessageType;
    chainTop?: boolean;
    chainBottom?: boolean;
    hasSeparator?: boolean;
    editDisabled?: boolean;
};
export default function OpenChannelMessage(props: OpenChannelMessageProps): ReactElement;
// ===== @OpenChannel/components/OpenChannelMessageList =====
import './openchannel-message-list.scss';
import React from 'react';
import { RenderMessageProps } from '#RenderMessageProps';
export type OpenChannelMessageListProps = {
    renderMessage?: (props: RenderMessageProps) => React.ReactElement;
    renderPlaceHolderEmptyList?: () => React.ReactElement;
};
/** @deprecated * */
export type OpenchannelMessageListProps = OpenChannelMessageListProps;
declare const _default: React.ForwardRefExoticComponent<OpenChannelMessageListProps & React.RefAttributes<HTMLDivElement>>;
export default _default;
// ===== @OpenChannel/components/OpenChannelUI =====
import './open-channel-ui.scss';
import React from 'react';
import { RenderMessageProps } from '#RenderMessageProps';
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
// ===== @OpenChannel/context =====
import React from 'react';
import { FileMessageCreateParams } from '@sendbird/chat/message';
import { UserMessageCreateParams } from '@sendbird/chat/message';
import { RenderUserProfileProps } from '#RenderUserProfileProps';
import { State as MessageStoreState } from '#State';
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
// ===== @OpenChannelList =====
import { ReactElement } from 'react';
import { OpenChannelListUIProps } from '#OpenChannelListUIProps';
import { OpenChannelListProviderProps } from '#OpenChannelListProviderProps';
export interface OpenChannelListProps extends OpenChannelListProviderProps, OpenChannelListUIProps {
}
declare function OpenChannelList({ className, queries, onChannelSelected, renderHeader, renderChannelPreview, renderPlaceHolderEmpty, renderPlaceHolderError, renderPlaceHolderLoading, }: OpenChannelListProps): ReactElement;
export default OpenChannelList;
// ===== @OpenChannelList/components/OpenChannelListUI =====
import React from 'react';
import { OpenChannel } from '@sendbird/chat/openChannel';
import './index.scss';
import { OnOpenChannelSelected } from '#OnOpenChannelSelected';
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
// ===== @OpenChannelList/components/OpenChannelPreview =====
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
// ===== @OpenChannelList/context =====
import React from 'react';
import { OpenChannelListProviderInterface } from '#OpenChannelListProviderInterface';
import { OpenChannelListProviderProps } from '#OpenChannelListProviderProps';
export declare function useOpenChannelListContext(): OpenChannelListProviderInterface;
export declare const OpenChannelListProvider: React.FC<OpenChannelListProviderProps>;
declare const _default: {
    OpenChannelListProvider: React.FC<OpenChannelListProviderProps>;
    useOpenChannelListContext: typeof useOpenChannelListContext;
};
export default _default;
// ===== @OpenChannelSettings =====
import React from 'react';
import { OpenChannelUIProps } from '#OpenChannelUIProps~4905480f';
import { OpenChannelSettingsContextProps } from '#OpenChannelSettingsContextProps';
export interface OpenChannelSettingsProps extends OpenChannelSettingsContextProps, OpenChannelUIProps {
}
declare const OpenChannelSetting: React.FC<OpenChannelSettingsProps>;
export default OpenChannelSetting;
// ===== @OpenChannelSettings/components/EditDetailsModal =====
import { ReactElement } from 'react';
interface Props {
    onCancel(): void;
}
declare const EditDetails: (props: Props) => ReactElement;
export default EditDetails;
// ===== @OpenChannelSettings/components/OpenChannelProfile =====
import { ReactElement } from 'react';
import './channel-profile.scss';
export default function ChannelProfile(): ReactElement;
// ===== @OpenChannelSettings/components/OpenChannelSettingsUI =====
import './open-channel-ui.scss';
import React from 'react';
export interface OpenChannelUIProps {
    renderOperatorUI?: () => React.ReactElement;
    renderParticipantList?: () => React.ReactElement;
}
declare const OpenChannelUI: React.FC<OpenChannelUIProps>;
export default OpenChannelUI;
// ===== @OpenChannelSettings/components/OperatorUI =====
import React from 'react';
export declare const copyToClipboard: (text: string) => boolean;
export interface OperatorUIProps {
    renderChannelProfile?: () => React.ReactElement;
}
export declare const OperatorUI: React.FC<OperatorUIProps>;
export default OperatorUI;
// ===== @OpenChannelSettings/components/ParticipantUI =====
import { ReactElement } from 'react';
interface ParticipantListProps {
    isOperatorView?: boolean;
}
export default function ParticipantList({ isOperatorView, }: ParticipantListProps): ReactElement;
export {};
// ===== @OpenChannelSettings/context =====
import React from 'react';
import { OpenChannel } from '@sendbird/chat/openChannel';
import { OpenChannelUpdateParams } from '@sendbird/chat/openChannel';
import { RenderUserProfileProps } from '#RenderUserProfileProps';
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
// ===== @SendbirdProvider =====
import React from 'react';
import './index.scss';
import './__experimental__typography.scss';
import { SendbirdProviderProps } from '#SendbirdProviderProps';
export type { SendbirdProviderProps } from '#SendbirdProviderProps';
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
// ===== @Thread =====
import React from 'react';
import { ThreadProviderProps } from '#ThreadProviderProps';
import { ThreadUIProps } from '#ThreadUIProps';
export interface ThreadProps extends ThreadProviderProps, ThreadUIProps {
    className?: string;
}
declare const Thread: (props: ThreadProps) => React.JSX.Element;
export default Thread;
// ===== @Thread/components/ParentMessageInfo =====
import React from 'react';
import { ReactNode } from 'react';
import './index.scss';
import { MessageEmojiMenuProps } from '#MessageEmojiMenuProps';
import { MessageMenuProps } from '#MessageMenuProps~d32aa065:type';
export interface ParentMessageInfoProps {
    className?: string;
    renderEmojiMenu?: (props: MessageEmojiMenuProps) => ReactNode;
    renderMessageMenu?: (props: MessageMenuProps) => ReactNode;
}
export default function ParentMessageInfo({ className, renderEmojiMenu, renderMessageMenu, }: ParentMessageInfoProps): React.ReactElement;
// ===== @Thread/components/ParentMessageInfoItem =====
import { ReactElement } from 'react';
import './ParentMessageInfoItem.scss';
import { SendableMessageType } from '#SendableMessageType';
import { OnBeforeDownloadFileMessageType } from '#OnBeforeDownloadFileMessageType';
export interface ParentMessageInfoItemProps {
    className?: string;
    message: SendableMessageType;
    showFileViewer?: (bool: boolean) => void;
    onBeforeDownloadFileMessage?: OnBeforeDownloadFileMessageType;
}
export default function ParentMessageInfoItem({ className, message, showFileViewer, onBeforeDownloadFileMessage, }: ParentMessageInfoItemProps): ReactElement;
// ===== @Thread/components/ThreadHeader =====
import React from 'react';
import { KeyboardEvent } from 'react';
import { MouseEvent } from 'react';
import { TouchEvent } from 'react';
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
// ===== @Thread/components/ThreadList =====
import React from 'react';
import { RefObject } from 'react';
import './index.scss';
import { SendableMessageType } from '#SendableMessageType';
import { ThreadListItemProps } from '#ThreadListItemProps';
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
// ===== @Thread/components/ThreadListItem =====
import React from 'react';
import { SendableMessageType } from '#SendableMessageType';
import { MessageComponentRenderers } from '#MessageComponentRenderers';
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
// ===== @Thread/components/ThreadMessageInput =====
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
// ===== @Thread/components/ThreadUI =====
import React from 'react';
import { ReactNode } from 'react';
import './index.scss';
import { ParentMessageStateTypes } from '#ParentMessageStateTypes';
import { ThreadListStateTypes } from '#ThreadListStateTypes';
import { SendableMessageType } from '#SendableMessageType';
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
// ===== @Thread/context =====
export * from '#InternalThreadProvider~a1e5db45';
export { default as useThread } from '#useThread';
// ===== @Thread/context/types =====
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
// ===== @VoicePlayer/context =====
import React from 'react';
import { VoicePlayerInitialState } from '#VoicePlayerInitialState';
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
// ===== @VoicePlayer/useVoicePlayer =====
import { VoicePlayerStatusType } from '#VoicePlayerStatusType';
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
// ===== @VoiceRecorder/context =====
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
// ===== @VoiceRecorder/useVoiceRecorder =====
import { VoiceRecorderEventHandler } from '#VoiceRecorderEventHandler';
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
// ===== @handlers/ConnectionHandler =====
import { ConnectionHandler } from '@sendbird/chat';
/**
 * Returns the instance of ConnectionHandler
 */
export default ConnectionHandler;
// ===== @handlers/GroupChannelHandler =====
import { GroupChannelHandler } from '@sendbird/chat/groupChannel';
/**
 * Returns the instance of GroupChannelHandler
 * workaround for: https://sendbird.atlassian.net/browse/UIKIT-1993
 * Recommended fix: remove instanceOf validation check from SDK
 */
export default GroupChannelHandler;
// ===== @handlers/OpenChannelHandler =====
/**
 * Returns the instance of OpenChannelHandler
 */
import { OpenChannelHandler } from '@sendbird/chat/openChannel';
export default OpenChannelHandler;
// ===== @handlers/SessionHandler =====
/**
 * Returns the instance of SessionHandler
 */
import { SessionHandler } from '@sendbird/chat';
export default SessionHandler;
// ===== @handlers/UserEventHandler =====
import { UserEventHandler } from '@sendbird/chat';
/**
 * Returns the class of UserEventHandler
 */
export default UserEventHandler;
// ===== @hooks/useConnectionState =====
import { ConnectionState } from '@sendbird/chat';
export declare const useConnectionState: () => ConnectionState;
// ===== @hooks/useLocalization =====
/**
 * This file is only for re-exporting the `useLocalization` hook.
 * It should not be used internally within the project.
 */
import { useLocalization } from '#useLocalization';
export { useLocalization } from '#useLocalization';
export default useLocalization;
// ===== @hooks/useModal =====
import React from 'react';
import { ReactElement } from 'react';
import { ModalProps } from '#ModalProps';
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
export * from '#MODAL_ROOT~9daefae7';
// ===== @index =====
export { default as SendBirdProvider } from '#SendbirdProvider';
export { default as App } from '#App';
export { default as ChannelSettings } from '#ChannelSettings';
export { default as ChannelList } from '#ChannelList';
export { default as Channel } from '#Channel';
export { default as getStringSet } from '#getStringSet';
export { default as OpenChannel } from '#OpenChannel';
export { default as OpenChannelSettings } from '#OpenChannelSetting';
export { default as MessageSearch } from '#MessageSearchPannel';
export { withSendBird } from '#withSendBird';
export { useSendbirdStateContext } from '#useSendbirdStateContext';
export { useSendbird } from '#useSendbird';
export { default as sendbirdSelectors } from '#sendbirdSelectors';
export { default as sendBirdSelectors } from '#sendbirdSelectors';
export { TypingIndicatorType } from '#TypingIndicatorType';
// ===== @pubSub/topics =====
import { PublishingModuleType } from '#PublishingModuleType';
import { UploadableFileInfo } from '@sendbird/chat/message';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { PubSubTypes } from '#PubSubTypes';
import { OpenChannel } from '@sendbird/chat/openChannel';
import { SendableMessageType } from '#SendableMessageType';
export { PublishingModuleType } from '#PublishingModuleType';
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
// ===== @sendbirdSelectors =====
import { User } from '@sendbird/chat';
import { FailedMessageHandler } from '@sendbird/chat/message';
import { MessageHandler } from '@sendbird/chat/message';
import { UserMessage } from '@sendbird/chat/message';
import { UserMessageCreateParams } from '@sendbird/chat/message';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { GroupChannelCreateParams } from '@sendbird/chat/groupChannel';
import { OpenChannel } from '@sendbird/chat/openChannel';
import { OpenChannelCreateParams } from '@sendbird/chat/openChannel';
import { FileMessage } from '@sendbird/chat/lib/__definition';
import { FileMessageCreateParams } from '@sendbird/chat/lib/__definition';
import { SendableMessage } from '@sendbird/chat/lib/__definition';
import { UserMessageUpdateParams } from '@sendbird/chat/lib/__definition';
import { SendbirdState } from '#SendbirdState';
import { SendableMessageType } from '#SendableMessageType';
import { PublishingModuleType } from '#PublishingModuleType';
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
export declare const getPubSub: (state: SendbirdState) => import("#SBUGlobalPubSub").SBUGlobalPubSub;
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
    getPubSub: (state: SendbirdState) => import("#SBUGlobalPubSub").SBUGlobalPubSub;
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
// ===== @ui/Accordion =====
/// <reference types="react" />
import './index.scss';
import { Accordion } from '#Accordion';
export default Accordion;
export declare const AccordionGroup: ({ className, children, allowMultipleOpen, }: import("#AccordionGroupProps").AccordionGroupProps) => import("react").JSX.Element;
export * from '#Accordion~6ddc0ea3';
export * from '#AccordionGroupContext~55e793e2';
// ===== @ui/AccordionGroup =====
import React from 'react';
import { ReactElement } from 'react';
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
// ===== @ui/AdminMessage =====
import { ReactElement } from 'react';
import { AdminMessage as AdminMessageType } from '@sendbird/chat/message';
import './index.scss';
interface AdminMessageProps {
    className?: string | Array<string>;
    message: AdminMessageType;
}
export default function AdminMessage({ className, message, }: AdminMessageProps): ReactElement | null;
export {};
// ===== @ui/Avatar =====
import React from 'react';
import { ReactElement } from 'react';
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
// ===== @ui/Badge =====
import { ReactElement } from 'react';
import './index.scss';
export interface BadgeProps {
    count: string | number;
    maxLevel?: number;
    className?: string | Array<string>;
}
export default function Badge({ count, maxLevel, className, }: BadgeProps): ReactElement;
// ===== @ui/BottomSheet =====
import './bottom-sheet.scss';
import React from 'react';
interface BottomSheetProps {
    className?: string;
    children: React.ReactElement;
    onBackdropClick?: () => void;
}
declare const BottomSheet: React.FunctionComponent<BottomSheetProps>;
export default BottomSheet;
// ===== @ui/Button =====
import { ReactElement } from 'react';
import './index.scss';
import { LabelColors } from '#LabelColors';
import { ButtonSizes } from '#ButtonSizes';
import { ButtonTypes } from '#ButtonTypes';
import { ObjectValues } from '#ObjectValues';
import { Typography } from '#Typography';
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
export * from '#ButtonSizes~13561d05';
// ===== @ui/ChannelAvatar =====
/// <reference types="react" />
import './index.scss';
import { GroupChannel } from '@sendbird/chat/groupChannel';
interface Props {
    channel: GroupChannel;
    userId: string;
    theme: string;
    width?: number;
    height?: number;
}
declare function ChannelAvatar({ channel, userId, theme, width, height, }: Props): JSX.Element;
export default ChannelAvatar;
// ===== @ui/Checkbox =====
import { ChangeEvent } from 'react';
import { ReactElement } from 'react';
import './index.scss';
export interface CheckboxProps {
    id?: string;
    checked?: boolean;
    disabled?: boolean;
    onChange?(e: ChangeEvent<HTMLInputElement>): void;
}
export default function Checkbox({ id, checked, disabled, onChange, }: CheckboxProps): ReactElement;
// ===== @ui/ConnectionStatus =====
import { ReactElement } from 'react';
import './index.scss';
declare function ConnectionStatus(): ReactElement;
export default ConnectionStatus;
// ===== @ui/ContextMenu =====
import React from 'react';
import { MouseEvent } from 'react';
import { ReactElement } from 'react';
import { ReactNode } from 'react';
import './index.scss';
import _MenuItems from '#MenuItems~ffd38300';
import { MuteMenuItem } from '#MuteMenuItem';
import { OperatorMenuItem } from '#OperatorMenuItem';
export declare const MENU_OBSERVING_CLASS_NAME = "sendbird-observing-message-menu";
export declare const getObservingId: (txt: string | number) => string;
export declare const MenuItems: typeof _MenuItems;
export declare const EmojiListItems: ({ id, children, parentRef, parentContainRef, spaceFromTrigger, closeDropdown, }: import("#EmojiListItemsProps").EmojiListItemsProps) => React.ReactElement<any, string | React.JSXElementConstructor<any>>;
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
// ===== @ui/DateSeparator =====
import { ReactElement } from 'react';
import './index.scss';
import { Colors } from '#Colors~9177c283';
export interface DateSeparatorProps {
    children?: string | ReactElement;
    className?: string | Array<string>;
    separatorColor?: Colors;
}
declare const DateSeparator: ({ children, className, separatorColor, }: DateSeparatorProps) => ReactElement;
export default DateSeparator;
// ===== @ui/EmojiReactions =====
import './index.scss';
import { ReactElement } from 'react';
import { EmojiCategory } from '@sendbird/chat';
import { EmojiContainer } from '@sendbird/chat';
import { User } from '@sendbird/chat';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { Nullable } from '#Nullable';
import { SpaceFromTriggerType } from '#SpaceFromTriggerType';
import { SendableMessageType } from '#SendableMessageType';
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
// ===== @ui/FallbackTemplateMessageItemBody.tsx =====
import { BaseMessage } from '@sendbird/chat/message';
import { ReactElement } from 'react';
export interface FallbackTemplateMessageItemBodyProps {
    className?: string | Array<string>;
    message: BaseMessage;
    isByMe?: boolean;
}
export declare function FallbackTemplateMessageItemBody({ className, message, isByMe, }: FallbackTemplateMessageItemBodyProps): ReactElement;
export default FallbackTemplateMessageItemBody;
// ===== @ui/FeedbackIconButton =====
import React from 'react';
import { MouseEvent } from 'react';
import { ReactNode } from 'react';
import './index.scss';
export interface FeedbackIconButtonProps {
    children: ReactNode;
    isSelected: boolean;
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
}
declare const FeedbackIconButton: React.ForwardRefExoticComponent<FeedbackIconButtonProps & React.RefAttributes<HTMLButtonElement>>;
export default FeedbackIconButton;
// ===== @ui/FileMessageItemBody =====
import './index.scss';
import { ReactElement } from 'react';
import { FileMessage } from '@sendbird/chat/message';
import { OnBeforeDownloadFileMessageType } from '#OnBeforeDownloadFileMessageType';
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
// ===== @ui/FileViewer =====
import './index.scss';
import { FileMessage } from '@sendbird/chat/message';
import { MultipleFilesMessage } from '@sendbird/chat/message';
import { MouseEvent } from 'react';
import { ReactElement } from 'react';
import { FileViewerComponentProps } from '#FileViewerComponentProps';
import { UploadedFileInfoWithUpload } from '#UploadedFileInfoWithUpload';
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
// ===== @ui/Header =====
import React from 'react';
import { KeyboardEvent } from 'react';
import { MouseEvent } from 'react';
import { ReactElement } from 'react';
import { ReactNode } from 'react';
import { TouchEvent } from 'react';
import './index.scss';
import { Types as IconTypes } from '#Types';
import { Colors as IconColors } from '#Colors~49ff6d60';
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
// ===== @ui/Icon =====
import React from 'react';
import './index.scss';
import { Types } from '#Types';
import { Colors } from '#Colors~49ff6d60';
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
// ===== @ui/IconButton =====
import React from 'react';
import { FocusEvent } from 'react';
import { MouseEvent } from 'react';
import { ReactNode } from 'react';
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
// ===== @ui/ImageRenderer =====
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
// ===== @ui/Input =====
import React from 'react';
import { ReactElement } from 'react';
import { ReactNode } from 'react';
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
// ===== @ui/Label =====
import React from 'react';
import './index.scss';
import { Colors } from '#Colors~10b20cc3';
import { Typography } from '#Typography';
import { ObjectValues } from '#ObjectValues';
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
declare const LabelStringSet: import("#StringSet~cb28c5f7").StringSet;
export { LabelTypography, LabelColors, LabelStringSet };
export default Label;
// ===== @ui/LinkLabel =====
import React from 'react';
import { ReactNode } from 'react';
import { LabelColors } from '#LabelColors';
import { LabelTypography } from '#LabelTypography';
import './index.scss';
import { ObjectValues } from '#ObjectValues';
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
// ===== @ui/Loader =====
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
// ===== @ui/LoadingTemplateMessageItemBody.tsx =====
import { ReactElement } from 'react';
export interface LoadingTemplateMessageItemBodyProps {
    className?: string;
    isByMe?: boolean;
}
export declare function LoadingTemplateMessageItemBody({ className, isByMe, }: LoadingTemplateMessageItemBodyProps): ReactElement;
export default LoadingTemplateMessageItemBody;
// ===== @ui/MentionLabel =====
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
// ===== @ui/MentionUserLabel =====
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
// ===== @ui/MessageContent =====
import React from 'react';
import { ReactElement } from 'react';
import { ReactNode } from 'react';
import './index.scss';
import { MessageMenuProps } from '#MessageMenuProps~d32aa065:type';
import { MessageEmojiMenuProps } from '#MessageEmojiMenuProps';
import { EmojiReactionsProps } from '#EmojiReactionsProps';
import { OnBeforeDownloadFileMessageType } from '#OnBeforeDownloadFileMessageType';
import { CoreMessageType } from '#CoreMessageType';
import { SendableMessageType } from '#SendableMessageType';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { EmojiCategory } from '@sendbird/chat';
import { EmojiContainer } from '@sendbird/chat';
import { ThreadReplySelectType } from '#ThreadReplySelectType';
import { Nullable } from '#Nullable';
import { ReplyType } from '#ReplyType';
import { MessageProfileProps } from '#MessageProfileProps';
import { MessageBodyProps } from '#MessageBodyProps';
import { MessageHeaderProps } from '#MessageHeaderProps';
import { MobileBottomSheetProps } from '#MobileBottomSheetProps';
export { MessageBody } from '#MessageBody';
export { MessageHeader } from '#MessageHeader';
export { MessageProfile } from '#MessageProfile';
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
// ===== @ui/MessageFeedbackFailedModal =====
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
// ===== @ui/MessageFeedbackModal =====
import { ReactElement } from 'react';
import './index.scss';
import { CoreMessageType } from '#CoreMessageType';
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
// ===== @ui/MessageInput =====
import React from 'react';
import './index.scss';
import { PendingFile } from '#PendingFile';
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
// ===== @ui/MessageInput/hooks/usePaste =====
import React from 'react';
import { DynamicProps } from '#DynamicProps~d16f7a6f';
export declare function usePaste({ ref, setIsInput, channel, setMentionedUsers, onAddFiles, }: DynamicProps): (e: React.ClipboardEvent<HTMLDivElement>) => void;
export default usePaste;
// ===== @ui/MessageItemMenu =====
import './index.scss';
import { ReactElement } from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { OpenChannel } from '@sendbird/chat/openChannel';
import { MenuItemProps } from '#MenuItemProps~5fab0aff';
import { SendableMessageType } from '#SendableMessageType';
import { ReplyType } from '#ReplyType';
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
// ===== @ui/MessageItemReactionMenu =====
import './index.scss';
import { ReactElement } from 'react';
import { EmojiCategory } from '@sendbird/chat';
import { EmojiContainer } from '@sendbird/chat';
import { SendableMessageType } from '#SendableMessageType';
import { SpaceFromTriggerType } from '#SpaceFromTriggerType';
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
// ===== @ui/MessageMenu =====
import './index.scss';
export { MessageMenu } from '#MessageMenu~e6e86bce';
export { type MessageMenuProps } from '#MessageMenuProps~d32aa065';
export { MessageMenuProvider } from '#MessageMenuProvider';
export { type MessageMenuContextProps } from '#MessageMenuContextProps';
export { useMessageMenuContext } from '#useMessageMenuContext';
export { BottomSheetMenuItem } from '#BottomSheetMenuItem';
export { MenuItem } from '#MenuItem~f655d1aa';
export { type MenuItemProps } from '#MenuItemProps~31290fbd';
// ===== @ui/MessageSearchFileItem =====
import './index.scss';
import { ReactElement } from 'react';
import { FileMessage } from '@sendbird/chat/message';
import { MultipleFilesMessage } from '@sendbird/chat/message';
interface Props {
    className?: string | Array<string>;
    message: FileMessage | MultipleFilesMessage;
    selected?: boolean;
    onClick?: (message: FileMessage | MultipleFilesMessage) => void;
}
export default function MessageSearchFileItem(props: Props): ReactElement;
export {};
// ===== @ui/MessageSearchItem =====
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
// ===== @ui/MessageStatus =====
import './index.scss';
import React from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { CoreMessageType } from '#CoreMessageType';
import { OutgoingMessageStates } from '#OutgoingMessageStates';
import { Nullable } from '#Nullable';
export declare const MessageStatusTypes: typeof OutgoingMessageStates;
interface MessageStatusProps {
    className?: string;
    message?: CoreMessageType | null;
    channel: Nullable<GroupChannel>;
    isDateSeparatorConsidered?: boolean;
}
export default function MessageStatus({ className, message, channel, isDateSeparatorConsidered, }: MessageStatusProps): React.ReactElement;
export {};
// ===== @ui/MessageTemplate =====
import React from 'react';
import { ComponentsUnion } from '@sendbird/uikit-message-template';
import './index.scss';
export interface MessageTemplateProps {
    templateVersion: number;
    templateItems: ComponentsUnion['properties'][];
}
export declare function MessageTemplate({ templateItems, templateVersion }: MessageTemplateProps): React.JSX.Element;
export default MessageTemplate;
// ===== @ui/MobileFeedbackMenu =====
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
// ===== @ui/MobileMenu =====
import './mobile-menu.scss';
import React from 'react';
import MobileContextMenu from '#MobileContextMenu';
import MobileBottomSheet from '#MobileBottomSheet';
import { MobileBottomSheetProps } from '#MobileBottomSheetProps';
declare const MobileMenu: React.FC<MobileBottomSheetProps>;
export { MobileMenu, MobileContextMenu, MobileBottomSheet };
export default MobileMenu;
// ===== @ui/Modal =====
import { KeyboardEvent } from 'react';
import { MouseEvent } from 'react';
import { ReactElement } from 'react';
import { ReactNode } from 'react';
import './index.scss';
import { ButtonTypes } from '#ButtonTypes';
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
// ===== @ui/MutedAvatarOverlay =====
import './muted-avatar-overlay.scss';
import { ReactElement } from 'react';
interface Props {
    height?: number;
    width?: number;
}
export default function MutedAvatarOverlay(props: Props): ReactElement;
export {};
// ===== @ui/OGMessageItemBody =====
import './index.scss';
import { ReactElement } from 'react';
import { UserMessage } from '@sendbird/chat/message';
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
// ===== @ui/OpenChannelAdminMessage =====
import { ReactElement } from 'react';
import { AdminMessage } from '@sendbird/chat/message';
import './index.scss';
interface Props {
    className?: string | Array<string>;
    message: AdminMessage;
}
export default function OpenChannelAdminMessage({ className, message, }: Props): ReactElement;
export {};
// ===== @ui/OpenChannelAvatar =====
/// <reference types="react" />
import { OpenChannel } from '@sendbird/chat/openChannel';
interface Props {
    channel: OpenChannel;
    theme: string;
    height?: number;
    width?: number;
}
declare function ChannelAvatar({ channel, theme, height, width, }: Props): JSX.Element;
export default ChannelAvatar;
// ===== @ui/OpenchannelConversationHeader =====
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
// ===== @ui/OpenchannelFileMessage =====
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
// ===== @ui/OpenchannelOGMessage =====
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
// ===== @ui/OpenchannelThumbnailMessage =====
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
// ===== @ui/OpenchannelUserMessage =====
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
// ===== @ui/PlaceHolder =====
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
// ===== @ui/PlaybackTime =====
import React from 'react';
import { LabelColors } from '#LabelColors';
import { LabelTypography } from '#LabelTypography';
import { ObjectValues } from '#ObjectValues';
export interface PlaybackTimeProps {
    className?: string;
    time: number;
    labelType?: ObjectValues<typeof LabelTypography>;
    labelColor?: ObjectValues<typeof LabelColors>;
}
export declare const PlaybackTime: ({ className, time, labelType, labelColor, }: PlaybackTimeProps) => React.ReactElement;
export default PlaybackTime;
// ===== @ui/ProgressBar =====
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
// ===== @ui/QuoteMessage =====
import './index.scss';
import { ReactElement } from 'react';
import { SendableMessageType } from '#SendableMessageType';
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
// ===== @ui/QuoteMessageInput =====
import './index.scss';
import { ReactElement } from 'react';
import { SendableMessageType } from '#SendableMessageType';
interface Props {
    className?: string | Array<string>;
    replyingMessage: SendableMessageType;
    onClose?: (message: SendableMessageType) => void;
}
export default function QuoteMessageInput({ className, replyingMessage, onClose, }: Props): ReactElement;
export {};
// ===== @ui/ReactionBadge =====
import React from 'react';
import { KeyboardEvent } from 'react';
import { MouseEvent } from 'react';
import { ReactElement } from 'react';
import { TouchEvent } from 'react';
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
// ===== @ui/ReactionButton =====
import React from 'react';
import { KeyboardEvent } from 'react';
import { MouseEvent } from 'react';
import { ReactElement } from 'react';
import { TouchEvent } from 'react';
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
// ===== @ui/SortByRow =====
import { ReactElement } from 'react';
import { ReactNode } from 'react';
import './index.scss';
export interface SortByRowProps {
    className?: string | Array<string>;
    maxItemCount: number;
    itemWidth: number;
    itemHeight: number;
    children: ReactNode;
}
export default function SortByRow({ className, maxItemCount, itemWidth, itemHeight, children, }: SortByRowProps): ReactElement;
// ===== @ui/TemplateMessageItemBody =====
import './index.scss';
import { ReactElement } from 'react';
import { BaseMessage } from '@sendbird/chat/message';
import { MessageTemplateItem } from '#MessageTemplateItem';
import { SendbirdTheme } from '#SendbirdTheme';
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
// ===== @ui/TextButton =====
import { KeyboardEvent } from 'react';
import { MouseEvent } from 'react';
import { ReactElement } from 'react';
import './index.scss';
import { Colors } from '#Colors~9177c283';
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
// ===== @ui/TextMessageItemBody =====
import './index.scss';
import { ReactElement } from 'react';
import { UserMessage } from '@sendbird/chat/message';
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
// ===== @ui/ThreadReplies =====
import React from 'react';
import { RefObject } from 'react';
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
// ===== @ui/ThumbnailMessageItemBody =====
import './index.scss';
import { ReactElement } from 'react';
import { FileMessage } from '@sendbird/chat/message';
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
// ===== @ui/Toggle =====
import React from 'react';
import './index.scss';
import { ToggleContainer } from '#ToggleContainer';
import { ToggleContainerProps } from '#ToggleContainerProps';
import { useToggleContext } from '#useToggleContext';
import { ToggleUI } from '#ToggleUI';
import { ToggleUIProps } from '#ToggleUIProps';
export interface ToggleProps extends ToggleContainerProps, ToggleUIProps {
    className?: string;
}
declare function Toggle(props: ToggleProps): React.ReactElement;
export type { ToggleContainerProps, ToggleUIProps };
export { Toggle, ToggleContainer, ToggleUI, useToggleContext };
// ===== @ui/Tooltip =====
import { ReactElement } from 'react';
import './index.scss';
export interface TooltipProps {
    className?: string | Array<string>;
    children?: string | ReactElement;
}
export default function Tooltip({ className, children, }: TooltipProps): ReactElement;
// ===== @ui/TooltipWrapper =====
import { ReactElement } from 'react';
import './index.scss';
export interface TooltipWrapperProps {
    className?: string | Array<string>;
    children: ReactElement;
    hoverTooltip: ReactElement;
}
export default function TooltipWrapper({ className, children, hoverTooltip, }: TooltipWrapperProps): ReactElement;
// ===== @ui/TypingIndicatorBubble =====
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
// ===== @ui/UnknownMessageItemBody =====
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
// ===== @ui/UserListItem =====
import { ChangeEvent } from 'react';
import { MutableRefObject } from 'react';
import { ReactElement } from 'react';
import { ReactNode } from 'react';
import { User } from '@sendbird/chat';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { Member } from '@sendbird/chat/groupChannel';
import './index.scss';
import { UserListItemMenuProps } from '#UserListItemMenuProps';
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
// ===== @ui/UserListItemMenu =====
import UserListItemMenu from '#UserListItemMenu';
export { UserListItemMenu } from '#UserListItemMenu';
export { UserListItemMenuProvider } from '#UserListItemMenuProvider';
export { useUserListItemMenuContext } from '#useUserListItemMenuContext';
export default UserListItemMenu;
// ===== @ui/UserProfile =====
import './index.scss';
import { ReactElement } from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { GroupChannelCreateParams } from '@sendbird/chat/groupChannel';
import { User } from '@sendbird/chat';
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
// ===== @ui/VoiceMessageInput =====
import React from 'react';
import './index.scss';
import { VoiceMessageInputStatus } from '#VoiceMessageInputStatus';
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
// ===== @ui/VoiceMessageItemBody =====
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
// ===== @ui/Word =====
/// <reference types="react" />
/**
 * @deprecated  This component is deprecated and will be removed in the next major version.
 * Use TextFragment instead.
 */
import './index.scss';
import { UserMessage } from '@sendbird/chat/message';
import { StringObj } from '#StringObj';
interface WordProps {
    word: string;
    message: UserMessage;
    isByMe?: boolean;
    mentionTemplate?: string;
    renderString?: (stringObj: StringObj) => JSX.Element;
}
export default function Word(props: WordProps): JSX.Element | null;
export {};
// ===== @useSendbirdStateContext =====
import { SendbirdState } from '#SendbirdState';
export declare function useSendbirdStateContext(): SendbirdState;
export default useSendbirdStateContext;
// ===== @utils/message/getOutgoingMessageState =====
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { OpenChannel } from '@sendbird/chat/openChannel';
import { Nullable } from '#Nullable';
import { CoreMessageType } from '#CoreMessageType';
export declare enum OutgoingMessageStates {
    NONE = "NONE",
    PENDING = "PENDING",
    SENT = "SENT",
    FAILED = "FAILED",
    DELIVERED = "DELIVERED",
    READ = "READ"
}
export declare const getOutgoingMessageState: (channel: Nullable<GroupChannel | OpenChannel>, message: CoreMessageType | undefined | null) => OutgoingMessageStates;
// ===== @utils/message/isVoiceMessage =====
export declare const isVoiceMessage: (message: import("#CoreMessageType").CoreMessageType) => boolean;
// ===== @withSendbird =====
/**
 * This file is for the backward compatibility.
 */
import { withSendBird } from '#withSendBird';
/**
 * @deprecated This function is deprecated. Use `useSendbird` instead.
 * */
export default withSendBird;
