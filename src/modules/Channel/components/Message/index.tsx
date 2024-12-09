import React from 'react';

import { useChannelContext } from '../../context/ChannelProvider';
import { getSuggestedReplies } from '../../../../utils';
import { isDisabledBecauseFrozen, isDisabledBecauseMuted } from '../../context/utils';
import MessageView, { MessageProps } from '../../../GroupChannel/components/Message/MessageView';
import FileViewer from '../FileViewer';
import RemoveMessageModal from '../RemoveMessageModal';
import useSendbird from '../../../../lib/Sendbird/context/hooks/useSendbird';

const Message = (props: MessageProps) => {
  const { state: { config } } = useSendbird();
  const {
    initialized,
    currentGroupChannel,
    animatedMessageId,
    setAnimatedMessageId,
    updateMessage,
    scrollToMessage,
    replyType,
    threadReplySelectType,
    isReactionEnabled,
    toggleReaction,
    emojiContainer,
    nicknamesMap,
    setQuoteMessage,
    resendMessage,
    deleteMessage,
    renderUserMentionItem,
    onReplyInThread,
    onQuoteMessageClick,
    onMessageAnimated,
    sendMessage,
    localMessages,
    allMessages,
  } = useChannelContext();

  const { message } = props;

  if (!currentGroupChannel) return null;

  return (
    <MessageView
      {...props}
      channel={currentGroupChannel}
      emojiContainer={emojiContainer}
      editInputDisabled={
        !initialized || isDisabledBecauseFrozen(currentGroupChannel) || isDisabledBecauseMuted(currentGroupChannel) || !config.isOnline
      }
      shouldRenderSuggestedReplies={
        config?.groupChannel?.enableSuggestedReplies
        && (
          config?.groupChannel?.showSuggestedRepliesFor === 'all_messages'
            ? true
            : message.messageId === allMessages[allMessages.length - 1].messageId
            // Use `allMessages[allMessages.length - 1]` instead of `currentGroupChannel.lastMessage`
            // because lastMessage is not updated when **Bot** sends messages
        )
        // the options should appear only when there's no failed or pending messages
        && localMessages?.length === 0
        && getSuggestedReplies(message).length > 0
      }
      isReactionEnabled={isReactionEnabled}
      replyType={replyType}
      threadReplySelectType={threadReplySelectType}
      nicknamesMap={nicknamesMap}
      renderUserMentionItem={renderUserMentionItem}
      scrollToMessage={scrollToMessage}
      toggleReaction={toggleReaction}
      setQuoteMessage={setQuoteMessage}
      onQuoteMessageClick={onQuoteMessageClick}
      onReplyInThreadClick={onReplyInThread}
      sendUserMessage={(params) => {
        sendMessage({
          message: params.message,
          mentionedUsers: params.mentionedUsers,
          mentionTemplate: params.mentionedMessageTemplate,
        });
      }}
      updateUserMessage={(messageId, params) => {
        updateMessage({
          messageId,
          message: params.message ?? '',
          mentionedUsers: params.mentionedUsers,
          mentionTemplate: params.mentionedMessageTemplate,
        });
      }}
      resendMessage={resendMessage}
      deleteMessage={deleteMessage}
      animatedMessageId={animatedMessageId}
      setAnimatedMessageId={setAnimatedMessageId}
      onMessageAnimated={onMessageAnimated}
      renderFileViewer={(props) => <FileViewer {...props} />}
      renderRemoveMessageModal={(props) => <RemoveMessageModal {...props} />}
    />
  );
};

export default Message;
