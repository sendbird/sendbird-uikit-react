import { UIKitOptions, CommonUIKitConfigProps } from '../types';
import { getCaseResolvedReplyType } from './resolvedReplyType';

export function uikitConfigMapper({
  legacyConfig,
  uikitOptions = {},
}: { legacyConfig: CommonUIKitConfigProps, uikitOptions?: UIKitOptions }): UIKitOptions {
  const {
    replyType,
    isMentionEnabled,
    isReactionEnabled,
    disableUserProfile,
    isVoiceMessageEnabled,
    isTypingIndicatorEnabledOnChannelList,
    isMessageReceiptStatusEnabledOnChannelList,
    showSearchIcon,
  } = legacyConfig;
  return {
    common: {
      enableUsingDefaultUserProfile: uikitOptions.common?.enableUsingDefaultUserProfile
        ?? (typeof disableUserProfile === 'boolean' ? !disableUserProfile : undefined),
    },
    groupChannel: {
      enableOgtag: uikitOptions.groupChannel?.enableOgtag,
      enableMention: uikitOptions.groupChannel?.enableMention ?? isMentionEnabled,
      enableReactions: uikitOptions.groupChannel?.enableReactions ?? isReactionEnabled,
      enableReactionsSupergroup: uikitOptions.groupChannel?.enableReactionsSupergroup,
      enableTypingIndicator: uikitOptions.groupChannel?.enableTypingIndicator,
      enableVoiceMessage: uikitOptions.groupChannel?.enableVoiceMessage ?? isVoiceMessageEnabled,
      replyType: uikitOptions.groupChannel?.replyType
        ?? (replyType != null ? getCaseResolvedReplyType(replyType).lowerCase : undefined),
      threadReplySelectType: uikitOptions.groupChannel?.threadReplySelectType,
      input: {
        enableDocument: uikitOptions.groupChannel?.input?.enableDocument,
      },
      typingIndicatorTypes: uikitOptions.groupChannel?.typingIndicatorTypes,
      enableFeedback: uikitOptions.groupChannel?.enableFeedback,
      enableSuggestedReplies: uikitOptions.groupChannel?.enableSuggestedReplies,
      showSuggestedRepliesFor: uikitOptions.groupChannel?.showSuggestedRepliesFor,
      suggestedRepliesDirection: uikitOptions.groupChannel?.suggestedRepliesDirection,
    },
    groupChannelList: {
      enableTypingIndicator: uikitOptions.groupChannelList?.enableTypingIndicator ?? isTypingIndicatorEnabledOnChannelList,
      enableMessageReceiptStatus: uikitOptions.groupChannelList?.enableMessageReceiptStatus ?? isMessageReceiptStatusEnabledOnChannelList,
    },
    groupChannelSettings: {
      enableMessageSearch: uikitOptions.groupChannelSettings?.enableMessageSearch ?? showSearchIcon,
    },
    openChannel: {
      enableOgtag: uikitOptions.openChannel?.enableOgtag,
      input: {
        enableDocument: uikitOptions.openChannel?.input?.enableDocument,
      },
    },
  };
}
