export default {
  // legacy
  index: 'src/index.ts',

  // lame-js
  // remove when they remove 1.2.2
  'lame.all': 'src/_externals/lamejs/lame.all.js',

  // Easy to use app
  App: 'src/modules/App/index.tsx',

  // SendbirdProvider
  SendbirdProvider: 'src/lib/Sendbird.tsx',
  sendbirdSelectors: 'src/lib/selectors.ts',
  useSendbirdStateContext: 'src/hooks/useSendbirdStateContext.tsx',
  withSendbird: 'src/lib/SendbirdSdkContext.tsx',

  // Voice message
  'VoiceRecorder/context': 'src/hooks/VoiceRecorder/index.tsx',
  'VoiceRecorder/useVoiceRecorder': 'src/hooks/VoiceRecorder/useVoiceRecorder.tsx',
  'VoicePlayer/context': 'src/hooks/VoicePlayer/index.tsx',
  'VoicePlayer/useVoicePlayer': 'src/hooks/VoicePlayer/useVoicePlayer.tsx',

  // handlers - experimental
  'handlers/ConnectionHandler': 'src/lib/handlers/ConnectionHandler.ts',
  'handlers/GroupChannelHandler': 'src/lib/handlers/GroupChannelHandler.ts',
  'handlers/OpenChannelHandler': 'src/lib/handlers/OpenChannelHandler.ts',
  'handlers/UserEventHandler': 'src/lib/handlers/UserEventHandler.ts',
  'handlers/SessionHandler': 'src/lib/handlers/SessionHandler.ts',

  // pubSub
  'pubSub/topics': 'src/lib/pubSub/topics.ts',
  // hooks
  'hooks/useModal': 'src/hooks/useModal/index.tsx',
  // utils
  'utils/message/getOutgoingMessageState': 'src/utils/exports/getOutgoingMessageState.ts',
  'utils/message/isVoiceMessage': 'src/utils/isVoiceMessage.ts',

  // ChannelList
  ChannelList: 'src/modules/ChannelList/index.tsx',
  'ChannelList/context': 'src/modules/ChannelList/context/ChannelListProvider.tsx',
  'ChannelList/components/AddChannel': 'src/modules/ChannelList/components/AddChannel/index.tsx',
  'ChannelList/components/ChannelListUI': 'src/modules/ChannelList/components/ChannelListUI/index.tsx',
  'ChannelList/components/ChannelListHeader': 'src/modules/ChannelList/components/ChannelListHeader/index.tsx',
  'ChannelList/components/ChannelPreview': 'src/modules/ChannelList/components/ChannelPreview/index.tsx',
  'ChannelList/components/ChannelPreviewAction': 'src/modules/ChannelList/components/ChannelPreviewAction.tsx',

  // ChannelSettings
  ChannelSettings: 'src/modules/ChannelSettings/index.tsx',
  'ChannelSettings/context': 'src/modules/ChannelSettings/context/ChannelSettingsProvider.tsx',
  'ChannelSettings/components/ModerationPanel': 'src/modules/ChannelSettings/components/ModerationPanel/index.tsx',
  'ChannelSettings/components/ChannelProfile': 'src/modules/ChannelSettings/components/ChannelProfile/index.tsx',
  'ChannelSettings/components/ChannelSettingsUI': 'src/modules/ChannelSettings/components/ChannelSettingsUI/index.tsx',
  'ChannelSettings/components/EditDetailsModal': 'src/modules/ChannelSettings/components/EditDetailsModal/index.tsx',
  'ChannelSettings/components/LeaveChannel': 'src/modules/ChannelSettings/components/LeaveChannel/index.tsx',
  'ChannelSettings/components/UserListItem': 'src/modules/ChannelSettings/components/UserListItem/index.tsx',
  'ChannelSettings/components/UserPanel': 'src/modules/ChannelSettings/components/UserPanel/index.tsx',

  // Channel
  Channel: 'src/modules/Channel/index.tsx',
  'Channel/context': 'src/modules/Channel/context/ChannelProvider.tsx',
  'Channel/hooks/useInitialMessagesFetch': 'src/modules/Channel/context/hooks/useInitialMessagesFetch.ts',
  'Channel/hooks/useHandleUploadFiles': 'src/modules/Channel/hooks/useHandleUploadFiles.tsx',
  'Channel/utils/getMessagePartsInfo': 'src/modules/Channel/components/MessageList/getMessagePartsInfo.ts',
  'Channel/utils/compareMessagesForGrouping': 'src/modules/Channel/context/compareMessagesForGrouping.ts',
  'Channel/components/ChannelHeader': 'src/modules/Channel/components/ChannelHeader/index.tsx',
  'Channel/components/ChannelUI': 'src/modules/Channel/components/ChannelUI/index.tsx',
  'Channel/components/FileViewer': 'src/modules/Channel/components/FileViewer/index.tsx',
  'Channel/components/FrozenNotification': 'src/modules/Channel/components/FrozenNotification/index.tsx',
  'Channel/components/Message': 'src/modules/Channel/components/Message/index.tsx',
  'Channel/components/MessageInput': 'src/modules/Channel/components/MessageInput/index.tsx',
  'Channel/components/MessageList': 'src/modules/Channel/components/MessageList/index.tsx',
  'Channel/components/RemoveMessageModal': 'src/modules/Channel/components/RemoveMessageModal.tsx',
  'Channel/components/TypingIndicator': 'src/modules/Channel/components/TypingIndicator.tsx',
  'Channel/components/UnreadCount': 'src/modules/Channel/components/UnreadCount/index.tsx',
  'Channel/components/SuggestedMentionList': 'src/modules/Channel/components/SuggestedMentionList/index.tsx',

  // OpenChannel
  OpenChannel: 'src/modules/OpenChannel/index.tsx',
  'OpenChannel/context': 'src/modules/OpenChannel/context/OpenChannelProvider.tsx',
  'OpenChannel/components/FrozenChannelNotification': 'src/modules/OpenChannel/components/FrozenChannelNotification/index.tsx',
  'OpenChannel/components/OpenChannelHeader': 'src/modules/OpenChannel/components/OpenChannelHeader/index.tsx',
  'OpenChannel/components/OpenChannelInput': 'src/modules/OpenChannel/components/OpenChannelInput/index.tsx',
  'OpenChannel/components/OpenChannelMessage': 'src/modules/OpenChannel/components/OpenChannelMessage/index.tsx',
  'OpenChannel/components/OpenChannelMessageList': 'src/modules/OpenChannel/components/OpenChannelMessageList/index.tsx',
  'OpenChannel/components/OpenChannelUI': 'src/modules/OpenChannel/components/OpenChannelUI/index.tsx',

  // OpenChannelList
  OpenChannelList: 'src/modules/OpenChannelList/index.tsx',
  'OpenChannelList/context': 'src/modules/OpenChannelList/context/OpenChannelListProvider.tsx',
  'OpenChannelList/components/OpenChannelListUI': 'src/modules/OpenChannelList/components/OpenChannelListUI/index.tsx',
  'OpenChannelList/components/OpenChannelPreview': 'src/modules/OpenChannelList/components/OpenChannelPreview/index.tsx',

  // CreateOpenChannel
  CreateOpenChannel: 'src/modules/CreateOpenChannel/index.tsx',
  'CreateOpenChannel/context': 'src/modules/CreateOpenChannel/context/CreateOpenChannelProvider.tsx',
  'CreateOpenChannel/components/CreateOpenChannelUI': 'src/modules/CreateOpenChannel/components/CreateOpenChannelUI/index.tsx',

  // OpenChannelSettings
  OpenChannelSettings: 'src/modules/OpenChannelSettings/index.tsx',
  'OpenChannelSettings/context': 'src/modules/OpenChannelSettings/context/OpenChannelSettingsProvider.tsx',
  'OpenChannelSettings/components/EditDetailsModal': 'src/modules/OpenChannelSettings/components/EditDetailsModal.tsx',
  'OpenChannelSettings/components/OpenChannelProfile': 'src/modules/OpenChannelSettings/components/OpenChannelProfile/index.tsx',
  'OpenChannelSettings/components/OpenChannelSettingsUI': 'src/modules/OpenChannelSettings/components/OpenChannelSettingsUI/index.tsx',
  'OpenChannelSettings/components/OperatorUI': 'src/modules/OpenChannelSettings/components/OperatorUI/index.tsx',
  'OpenChannelSettings/components/ParticipantUI': 'src/modules/OpenChannelSettings/components/ParticipantUI/index.tsx',

  // MessageSearch
  MessageSearch: 'src/modules/MessageSearch/index.tsx',
  'MessageSearch/context': 'src/modules/MessageSearch/context/MessageSearchProvider.tsx',
  'MessageSearch/components/MessageSearchUI': 'src/modules/MessageSearch/components/MessageSearchUI/index.tsx',

  // Message
  'Message/context': 'src/modules/Message/context/MessageProvider.tsx',
  'Message/hooks/useDirtyGetMentions': 'src/modules/Message/hooks/useDirtyGetMentions.ts',

  // Thread
  Thread: 'src/modules/Thread/index.tsx',
  'Thread/context': 'src/modules/Thread/context/ThreadProvider.tsx',
  'Thread/context/types': 'src/modules/Thread/types.tsx',
  'Thread/components/ThreadUI': 'src/modules/Thread/components/ThreadUI/index.tsx',
  'Thread/components/ThreadHeader': 'src/modules/Thread/components/ThreadHeader/index.tsx',
  'Thread/components/ParentMessageInfo': 'src/modules/Thread/components/ParentMessageInfo/index.tsx',
  'Thread/components/ParentMessageInfoItem': 'src/modules/Thread/components/ParentMessageInfo/ParentMessageInfoItem.tsx',
  'Thread/components/ThreadList': 'src/modules/Thread/components/ThreadList/index.tsx',
  'Thread/components/ThreadListItem': 'src/modules/Thread/components/ThreadList/ThreadListItem.tsx',
  'Thread/components/ThreadMessageInput': 'src/modules/Thread/components/ThreadMessageInput/index.tsx',

  // CreateChannel
  CreateChannel: 'src/modules/CreateChannel/index.tsx',
  'CreateChannel/context': 'src/modules/CreateChannel/context/CreateChannelProvider.tsx',
  'CreateChannel/components/CreateChannelUI': 'src/modules/CreateChannel/components/CreateChannelUI/index.tsx',
  'CreateChannel/components/InviteUsers': 'src/modules/CreateChannel/components/InviteUsers/index.tsx',
  'CreateChannel/components/SelectChannelType': 'src/modules/CreateChannel/components/SelectChannelType.tsx',

  // EditUserProfile
  EditUserProfile: 'src/modules/EditUserProfile/index.tsx',
  'EditUserProfile/context': 'src/modules/EditUserProfile/context/EditUserProfileProvider.tsx',
  'EditUserProfile/components/EditUserProfileUI': 'src/modules/EditUserProfile/components/EditUserProfileUI/index.tsx',

  // UI Components
  'ui/Accordion': 'src/ui/Accordion/index.tsx',
  'ui/AccordionGroup': 'src/ui/Accordion/AccordionGroup.tsx',
  'ui/AdminMessage': 'src/ui/AdminMessage/index.tsx',
  'ui/Avatar': 'src/ui/Avatar/index.tsx',
  'ui/MutedAvatarOverlay': 'src/ui/Avatar/MutedAvatarOverlay.tsx',
  'ui/Button': 'src/ui/Button/index.tsx',
  'ui/Badge': 'src/ui/Badge/index.tsx',
  'ui/BottomSheet': 'src/ui/BottomSheet/index.tsx',
  'ui/ChannelAvatar': 'src/ui/ChannelAvatar/index.tsx',
  'ui/OpenChannelAvatar': 'src/ui/ChannelAvatar/OpenChannelAvatar.tsx',
  'ui/Checkbox': 'src/ui/Checkbox/index.tsx',
  'ui/ConnectionStatus': 'src/ui/ConnectionStatus/index.tsx',
  'ui/ContextMenu': 'src/ui/ContextMenu/index.tsx',
  'ui/DateSeparator': 'src/ui/DateSeparator/index.tsx',
  'ui/EmojiReactions': 'src/ui/EmojiReactions/index.tsx',
  'ui/FileMessageItemBody': 'src/ui/FileMessageItemBody/index.tsx',
  'ui/FileViewer': 'src/ui/FileViewer/index.tsx',
  'ui/Icon': 'src/ui/Icon/index.tsx',
  'ui/IconButton': 'src/ui/IconButton/index.tsx',
  'ui/ImageRenderer': 'src/ui/ImageRenderer/index.tsx',
  'ui/Input': 'src/ui/Input/index.tsx',
  'ui/Label': 'src/ui/Label/index.tsx',
  'ui/LinkLabel': 'src/ui/LinkLabel/index.tsx',
  'ui/Loader': 'src/ui/Loader/index.tsx',
  'ui/MentionUserLabel': 'src/ui/MentionUserLabel/index.tsx',
  'ui/MentionLabel': 'src/ui/MentionLabel/index.tsx',
  'ui/MessageContent': 'src/ui/MessageContent/index.tsx',
  // MessageInput is a special case - shouldbe turned into a module
  'ui/MessageInput': 'src/ui/MessageInput/index.tsx',
  'ui/MessageInput/hooks/usePaste': 'src/ui/MessageInput/hooks/usePaste/index.ts',
  'ui/MessageItemMenu': 'src/ui/MessageItemMenu/index.tsx',
  'ui/MessageItemReactionMenu': 'src/ui/MessageItemReactionMenu/index.tsx',
  'ui/MessageSearchFileItem': 'src/ui/MessageSearchFileItem/index.tsx',
  'ui/MessageSearchItem': 'src/ui/MessageSearchItem/index.tsx',
  'ui/MessageStatus': 'src/ui/MessageStatus/index.tsx',
  'ui/Modal': 'src/ui/Modal/index.tsx',
  'ui/OGMessageItemBody': 'src/ui/OGMessageItemBody/index.tsx',
  'ui/OpenChannelAdminMessage': 'src/ui/OpenChannelAdminMessage/index.tsx',
  // should we rename it to OpenChannel?
  'ui/OpenchannelConversationHeader': 'src/ui/OpenchannelConversationHeader/index.tsx',
  'ui/OpenchannelFileMessage': 'src/ui/OpenchannelFileMessage/index.tsx',
  'ui/OpenchannelOGMessage': 'src/ui/OpenchannelOGMessage/index.tsx',
  'ui/OpenchannelThumbnailMessage': 'src/ui/OpenchannelThumbnailMessage/index.tsx',
  'ui/OpenchannelUserMessage': 'src/ui/OpenchannelUserMessage/index.tsx',
  'ui/PlaceHolder': 'src/ui/PlaceHolder/index.tsx',
  'ui/PlaybackTime': 'src/ui/PlaybackTime/index.tsx',
  'ui/ProgressBar': 'src/ui/ProgressBar/index.tsx',
  'ui/QuoteMessage': 'src/ui/QuoteMessage/index.tsx',
  'ui/QuoteMessageInput': 'src/ui/QuoteMessageInput/index.tsx',
  'ui/ReactionBadge': 'src/ui/ReactionBadge/index.tsx',
  'ui/ReactionButton': 'src/ui/ReactionButton/index.tsx',
  'ui/SortByRow': 'src/ui/SortByRow/index.tsx',
  'ui/TextButton': 'src/ui/TextButton/index.tsx',
  'ui/TextMessageItemBody': 'src/ui/TextMessageItemBody/index.tsx',
  'ui/ThreadReplies': 'src/ui/ThreadReplies/index.tsx',
  'ui/ThumbnailMessageItemBody': 'src/ui/ThumbnailMessageItemBody/index.tsx',
  'ui/Toggle': 'src/ui/Toggle/index.tsx',
  'ui/Tooltip': 'src/ui/Tooltip/index.tsx',
  'ui/TooltipWrapper': 'src/ui/TooltipWrapper/index.tsx',
  'ui/TypingIndicatorBubble': 'src/ui/TypingIndicatorBubble/index.tsx',
  'ui/UnknownMessageItemBody': 'src/ui/UnknownMessageItemBody/index.tsx',
  'ui/UserListItem': 'src/ui/UserListItem/index.tsx',
  'ui/UserProfile': 'src/ui/UserProfile/index.tsx',
  'ui/VoiceMessageInput': 'src/ui/VoiceMessageInput/index.tsx',
  'ui/VoiceMessageItemBody': 'src/ui/VoiceMessageItemBody/index.tsx',
  'ui/Word': 'src/ui/Word/index.tsx',
};
