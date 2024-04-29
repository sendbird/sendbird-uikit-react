import React from 'react';
import { useIIFE } from '@sendbird/uikit-tools';

import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { getSuggestedReplies, isSendableMessage } from '../../../../utils';
import { isDisabledBecauseFrozen, isDisabledBecauseMuted } from '../../context/utils';
import { useGroupChannelContext } from '../../context/GroupChannelProvider';
import MessageView, { MessageProps } from './MessageView';
import FileViewer from '../FileViewer';
import RemoveMessageModal from '../RemoveMessageModal';

export const Message = (props: MessageProps): React.ReactElement => {
  const { config, emojiManager } = useSendbirdStateContext();
  const {
    loading,
    currentChannel,
    animatedMessageId,
    setAnimatedMessageId,
    scrollToMessage,
    replyType,
    threadReplySelectType,
    isReactionEnabled,
    toggleReaction,
    nicknamesMap,
    setQuoteMessage,
    renderUserMentionItem,
    onQuoteMessageClick,
    onReplyInThreadClick,
    onMessageAnimated,
    onBeforeDownloadFileMessage,
    messages,
    updateUserMessage,
    sendUserMessage,
    resendMessage,
    deleteMessage,
  } = useGroupChannelContext();

  const { message } = props;
  const initialized = !loading && Boolean(currentChannel);

  const shouldRenderSuggestedReplies = useIIFE(() => {
    const { enableSuggestedReplies, showSuggestedRepliesFor } = config.groupChannel;

    const lastMessageInView = messages[messages.length - 1];
    const hasUnsentMessage = isSendableMessage(lastMessageInView) && lastMessageInView.sendingStatus !== 'succeeded';
    const showSuggestedReplies = showSuggestedRepliesFor === 'all_messages' ? true : message.messageId === currentChannel?.lastMessage?.messageId;

    return enableSuggestedReplies && getSuggestedReplies(message).length > 0 && !hasUnsentMessage && showSuggestedReplies;
  });

  return (
    <MessageView
      {...props}
      channel={currentChannel}
      emojiContainer={emojiManager.emojiContainer}
      editInputDisabled={
        !initialized || isDisabledBecauseFrozen(currentChannel ?? undefined) || isDisabledBecauseMuted(currentChannel ?? undefined) || !config.isOnline
      }
      shouldRenderSuggestedReplies={shouldRenderSuggestedReplies}
      isReactionEnabled={isReactionEnabled ?? false}
      replyType={replyType ?? 'NONE'}
      threadReplySelectType={threadReplySelectType}
      nicknamesMap={nicknamesMap}
      renderUserMentionItem={renderUserMentionItem}
      scrollToMessage={scrollToMessage}
      toggleReaction={toggleReaction}
      setQuoteMessage={setQuoteMessage}
      onQuoteMessageClick={onQuoteMessageClick}
      onReplyInThreadClick={onReplyInThreadClick}
      sendUserMessage={sendUserMessage}
      updateUserMessage={updateUserMessage}
      resendMessage={resendMessage}
      deleteMessage={deleteMessage}
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
