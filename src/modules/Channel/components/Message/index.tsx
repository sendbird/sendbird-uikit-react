import React from 'react';
import type { UserMessage } from '@sendbird/chat/message';

import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useChannelContext } from '../../context/ChannelProvider';
import { getSuggestedReplies } from '../../../../utils';
import { isDisabledBecauseFrozen, isDisabledBecauseMuted } from '../../context/utils';
import MessageView, { MessageProps } from '../../../GroupChannel/components/Message/MessageView';

const Message = (props: MessageProps): React.ReactElement => {
  const { config } = useSendbirdStateContext();
  const {
    initialized,
    currentGroupChannel,
    highLightedMessageId,
    setHighLightedMessageId,
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
    onMessageHighlighted,
    sendMessage,
    localMessages,
  } = useChannelContext();

  const { message } = props;

  return (
    <MessageView
      {...props}
      channel={currentGroupChannel}
      emojiContainer={emojiContainer}
      editInputDisabled={
        !initialized || isDisabledBecauseFrozen(currentGroupChannel) || isDisabledBecauseMuted(currentGroupChannel) || !config.isOnline
      }
      shouldRenderSuggestedReplies={
        message.messageId === currentGroupChannel?.lastMessage?.messageId &&
        // the options should appear only when there's no failed or pending messages
        localMessages.every((message) => (message as UserMessage).sendingStatus === 'succeeded') &&
        getSuggestedReplies(message).length > 0
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
          message: params.message,
          mentionedUsers: params.mentionedUsers,
          mentionTemplate: params.mentionedMessageTemplate,
        });
      }}
      resendMessage={resendMessage}
      deleteMessage={deleteMessage}
      animatedMessageId={animatedMessageId}
      setAnimatedMessageId={setAnimatedMessageId}
      onMessageAnimated={onMessageAnimated}
      highLightedMessageId={highLightedMessageId}
      setHighLightedMessageId={setHighLightedMessageId}
      onMessageHighlighted={onMessageHighlighted}
    />
  );
};

export default Message;
