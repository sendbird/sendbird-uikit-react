import React from 'react';
import { useIIFE } from '@sendbird/uikit-tools';

import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { getSuggestedReplies, isSendableMessage } from '../../../../utils';
import { isDisabledBecauseFrozen, isDisabledBecauseMuted } from '../../context/utils';
import MessageView, { MessageProps } from './MessageView';
import FileViewer from '../FileViewer';
import RemoveMessageModal from '../RemoveMessageModal';
import { ThreadReplySelectType } from '../../context/const';
import { useGroupChannel } from '../../context/hooks/useGroupChannel';

export const Message = (props: MessageProps): React.ReactElement => {
  const { config, emojiManager } = useSendbirdStateContext();
  const {
    state: {
      loading,
      currentChannel,
      animatedMessageId,
      replyType,
      threadReplySelectType,
      isReactionEnabled,
      nicknamesMap,
      renderUserMentionItem,
      filterEmojiCategoryIds,
      onQuoteMessageClick,
      onReplyInThreadClick,
      onMessageAnimated,
      onBeforeDownloadFileMessage,
      messages,
    },
    actions: {
      toggleReaction,
      setQuoteMessage,
      setAnimatedMessageId,
      scrollToMessage,
      updateUserMessage,
      sendUserMessage,
      resendMessage,
      deleteMessage,
    },
  } = useGroupChannel();

  const { message } = props;
  const initialized = !loading && Boolean(currentChannel);

  const shouldRenderSuggestedReplies = useIIFE(() => {
    const { enableSuggestedReplies, showSuggestedRepliesFor } = config.groupChannel;

    // Use `allMessages[allMessages.length - 1]` instead of `currentGroupChannel.lastMessage`
    // because lastMessage is not updated when **Bot** sends messages
    const lastMessageInView = messages[messages.length - 1];
    const hasUnsentMessage = isSendableMessage(lastMessageInView) && lastMessageInView.sendingStatus !== 'succeeded';
    const showSuggestedReplies = showSuggestedRepliesFor === 'all_messages'
      ? true
      : message.messageId === lastMessageInView.messageId;
    return enableSuggestedReplies && getSuggestedReplies(message).length > 0 && !hasUnsentMessage && showSuggestedReplies;
  });

  return (
    <MessageView
      {...props}
      channel={currentChannel!}
      emojiContainer={emojiManager.emojiContainer}
      editInputDisabled={
        !initialized
        || isDisabledBecauseFrozen(currentChannel ?? undefined)
        || isDisabledBecauseMuted(currentChannel ?? undefined)
        || !config.isOnline
      }
      shouldRenderSuggestedReplies={shouldRenderSuggestedReplies}
      isReactionEnabled={isReactionEnabled ?? false}
      replyType={replyType ?? 'NONE'}
      threadReplySelectType={threadReplySelectType ?? ThreadReplySelectType.PARENT}
      nicknamesMap={nicknamesMap}
      renderUserMentionItem={renderUserMentionItem}
      filterEmojiCategoryIds={filterEmojiCategoryIds}
      scrollToMessage={scrollToMessage}
      toggleReaction={toggleReaction}
      setQuoteMessage={setQuoteMessage}
      onQuoteMessageClick={onQuoteMessageClick}
      onReplyInThreadClick={onReplyInThreadClick}
      sendUserMessage={sendUserMessage}
      updateUserMessage={updateUserMessage}
      resendMessage={resendMessage}
      deleteMessage={deleteMessage as any}
      animatedMessageId={animatedMessageId}
      setAnimatedMessageId={setAnimatedMessageId}
      onMessageAnimated={onMessageAnimated}
      renderFileViewer={(props) => <FileViewer {...props} />}
      renderRemoveMessageModal={(props) => <RemoveMessageModal {...props} />}
      usedInLegacy={false}
      onBeforeDownloadFileMessage={onBeforeDownloadFileMessage}
    />
  );
};

export default Message;
