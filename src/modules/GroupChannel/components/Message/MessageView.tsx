import React, { useRef, useMemo, useState, useEffect, useLayoutEffect } from 'react';
import format from 'date-fns/format';
import type { User } from '@sendbird/chat';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import type { BaseMessage, FileMessage, UserMessage, UserMessageCreateParams, UserMessageUpdateParams } from '@sendbird/chat/message';

import useDidMountEffect from '../../../../utils/useDidMountEffect';
import SuggestedMentionList from '../SuggestedMentionList';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useGroupChannelContext } from '../../context/GroupChannelProvider';
import { SendableMessageType, getClassName, getSuggestedReplies, isSendableMessage } from '../../../../utils';
import { isDisabledBecauseFrozen, isDisabledBecauseMuted } from '../../context/utils';
import { MAX_USER_MENTION_COUNT, MAX_USER_SUGGESTION_COUNT, ThreadReplySelectType } from '../../context/const';

import type { EveryMessage, RenderCustomSeparatorProps, RenderMessageProps, ReplyType } from '../../../../types';
import type { SendMessageType, UpdateMessageType } from '../../../Channel/context/ChannelProvider';
import DateSeparator from '../../../../ui/DateSeparator';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import MessageInput from '../../../../ui/MessageInput';
import MessageContent from '../../../../ui/MessageContent';
import FileViewer from '../FileViewer';
import RemoveMessageModal from '../RemoveMessageModal';
import { MessageInputKeys } from '../../../../ui/MessageInput/const';
import { useLocalization } from '../../../../lib/LocalizationContext';
import { useDirtyGetMentions } from '../../../Message/hooks/useDirtyGetMentions';
import SuggestedReplies from '../SuggestedReplies';
import { useIIFE } from '@sendbird/uikit-tools';

export interface MessageViewProps {
  message: EveryMessage;
  hasSeparator?: boolean;
  chainTop?: boolean;
  chainBottom?: boolean;
  handleScroll?: (isBottomMessageAffected?: boolean) => void;
  // for extending
  renderMessage?: (props: RenderMessageProps) => React.ReactElement;
  renderCustomSeparator?: (props: RenderCustomSeparatorProps) => React.ReactElement;
  renderEditInput?: () => React.ReactElement;
  renderMessageContent?: () => React.ReactElement;
}

interface MessageViewChannelContextInterface {
  loading: boolean;
  currentChannel: GroupChannel;
  animatedMessageId: number;
  setAnimatedMessageId: React.Dispatch<React.SetStateAction<number>>;
  scrollToMessage?: (createdAt: number, messageId: number) => void;
  replyType?: ReplyType;
  threadReplySelectType?: ThreadReplySelectType;
  isReactionEnabled?: boolean;
  toggleReaction(message: SendableMessageType, emojiKey: string, isReacted: boolean): void;
  nicknamesMap: Map<string, string>;
  setQuoteMessage: React.Dispatch<React.SetStateAction<SendableMessageType | null>>;
  renderUserMentionItem?: (props: { user: User }) => JSX.Element;
  onQuoteMessageClick?: (props: { message: SendableMessageType }) => void;
  onReplyInThreadClick?: (props: { message: SendableMessageType }) => void;
  onMessageAnimated?: () => void;
  messages: BaseMessage[];
  sendUserMessage: ((params: UserMessageCreateParams) => Promise<UserMessage>) | SendMessageType;
  updateUserMessage: ((messageId: number, params: UserMessageUpdateParams) => Promise<UserMessage>) | UpdateMessageType;
  resendMessage: (failedMessage: SendableMessageType) => (Promise<SendableMessageType> | void);
  deleteMessage: (message: SendableMessageType) => Promise<void>;
}

// TODO: Refactor this component, is too complex now
export const MessageView = ({
  message,
  hasSeparator,
  chainTop,
  chainBottom,
  handleScroll,
  renderCustomSeparator,
  renderEditInput,
  renderMessage,
  renderMessageContent,

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
  messages,
  updateUserMessage,
  sendUserMessage,
  resendMessage,
  deleteMessage,
}: MessageViewProps & MessageViewChannelContextInterface): React.ReactElement => {
  const { dateLocale, stringSet } = useLocalization();
  const globalStore = useSendbirdStateContext();

  const { userId, isOnline, isMentionEnabled, userMention, logger } = globalStore.config;
  const maxUserMentionCount = userMention?.maxMentionCount || MAX_USER_MENTION_COUNT;
  const maxUserSuggestionCount = userMention?.maxSuggestionCount || MAX_USER_SUGGESTION_COUNT;

  const { emojiManager } = useSendbirdStateContext();

  const initialized = !loading && Boolean(currentChannel);

  const [showEdit, setShowEdit] = useState(false);
  const [showRemove, setShowRemove] = useState(false);
  const [showFileViewer, setShowFileViewer] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);
  const [mentionNickname, setMentionNickname] = useState('');
  const [mentionedUsers, setMentionedUsers] = useState([]);
  const [mentionedUserIds, setMentionedUserIds] = useState([]);
  const [messageInputEvent, setMessageInputEvent] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [mentionSuggestedUsers, setMentionSuggestedUsers] = useState([]);
  const editMessageInputRef = useRef(null);
  const displaySuggestedMentionList = isOnline
    && isMentionEnabled
    && mentionNickname.length > 0
    && !isDisabledBecauseFrozen(currentChannel)
    && !isDisabledBecauseMuted(currentChannel);
  const disabled = !initialized || isDisabledBecauseFrozen(currentChannel) || isDisabledBecauseMuted(currentChannel) || !isOnline;

  const mentionNodes = useDirtyGetMentions({ ref: editMessageInputRef }, { logger });
  const ableMention = mentionNodes?.length < maxUserMentionCount;

  useEffect(() => {
    setMentionedUsers(
      mentionedUsers.filter(({ userId }) => {
        const i = mentionedUserIds.indexOf(userId);
        if (i < 0) {
          return false;
        } else {
          mentionedUserIds.splice(i, 1);
          return true;
        }
      }),
    );
  }, [mentionedUserIds]);

  useLayoutEffect(() => {
    // Keep the scrollBottom value after fetching new message list
    handleScroll?.(true);
  }, []);
  /**
   * Move the messsage list scroll
   * when the message's height is changed by `showEdit` OR `message.reactions`
   */
  useDidMountEffect(() => {
    handleScroll?.();
  }, [showEdit, message?.reactions?.length]);
  useDidMountEffect(() => {
    handleScroll?.(true);
  }, [message?.updatedAt]);

  useLayoutEffect(() => {
    const timeouts = [];

    if (animatedMessageId === message.messageId) {
      timeouts.push(
        setTimeout(() => {
          setIsAnimated(true);
        }, 500),
      );
      timeouts.push(
        setTimeout(() => {
          setAnimatedMessageId(0);
          onMessageAnimated?.();
        }, 1600),
      );
    } else {
      setIsAnimated(false);
    }

    return () => {
      timeouts.forEach((it) => clearTimeout(it));
    };
  }, [animatedMessageId, setAnimatedMessageId]);

  const renderedMessage = useMemo(() => {
    return renderMessage?.({ message, chainTop, chainBottom });
  }, [message, renderMessage]);

  const renderedCustomSeparator = useMemo(() => {
    return renderCustomSeparator?.({ message });
  }, [message, renderCustomSeparator]);

  if (renderedMessage) {
    return (
      <div
        // do not delete this data attribute, used for scroll to given message
        // and also for testing
        data-sb-message-id={message.messageId}
        data-sb-created-at={message.createdAt}
        className={getClassName(['sendbird-msg-hoc sendbird-msg--scroll-ref', isAnimated ? 'sendbird-msg-hoc__animated' : ''])}
      >
        {/* date-separator */}
        {
          // TODO: Add message instance as a function parameter
          hasSeparator
          && (renderedCustomSeparator || (
            <DateSeparator>
              <Label type={LabelTypography.CAPTION_2} color={LabelColors.ONBACKGROUND_2}>
                {format(message.createdAt, stringSet.DATE_FORMAT__MESSAGE_LIST__DATE_SEPARATOR, {
                  locale: dateLocale,
                })}
              </Label>
            </DateSeparator>
          ))
        }
        {renderedMessage}
      </div>
    );
  }

  if (showEdit && message?.isUserMessage?.()) {
    return (
      renderEditInput?.() || (
        <>
          {displaySuggestedMentionList && (
            <SuggestedMentionList
              currentChannel={currentChannel}
              targetNickname={mentionNickname}
              inputEvent={messageInputEvent}
              renderUserMentionItem={renderUserMentionItem}
              onUserItemClick={(user) => {
                if (user) {
                  setMentionedUsers([...mentionedUsers, user]);
                }
                setMentionNickname('');
                setSelectedUser(user);
                setMessageInputEvent(null);
              }}
              onFocusItemChange={() => {
                setMessageInputEvent(null);
              }}
              onFetchUsers={(users) => {
                setMentionSuggestedUsers(users);
              }}
              ableAddMention={ableMention}
              maxMentionCount={maxUserMentionCount}
              maxSuggestionCount={maxUserSuggestionCount}
            />
          )}
          <MessageInput
            isEdit
            channel={currentChannel}
            disabled={disabled}
            ref={editMessageInputRef}
            mentionSelectedUser={selectedUser}
            isMentionEnabled={isMentionEnabled}
            message={message}
            onStartTyping={() => {
              currentChannel?.startTyping?.();
            }}
            onUpdateMessage={({ messageId, message, mentionTemplate }) => {
              updateUserMessage(messageId, {
                message,
                mentionedUsers,
                mentionedMessageTemplate: mentionTemplate,
              });
              setShowEdit(false);
              currentChannel?.endTyping?.();
            }}
            onCancelEdit={() => {
              setMentionNickname('');
              setMentionedUsers([]);
              setMentionedUserIds([]);
              setMentionSuggestedUsers([]);
              setShowEdit(false);
              currentChannel?.endTyping?.();
            }}
            onUserMentioned={(user) => {
              if (selectedUser?.userId === user?.userId) {
                setSelectedUser(null);
                setMentionNickname('');
              }
            }}
            onMentionStringChange={(mentionText) => {
              setMentionNickname(mentionText);
            }}
            onMentionedUserIdsUpdated={(userIds) => {
              setMentionedUserIds(userIds);
            }}
            onKeyDown={(e) => {
              if (
                displaySuggestedMentionList
                && mentionSuggestedUsers?.length > 0
                && ((e.key === MessageInputKeys.Enter && ableMention)
                  || e.key === MessageInputKeys.ArrowUp
                  || e.key === MessageInputKeys.ArrowDown)
              ) {
                setMessageInputEvent(e);
                return true;
              }
              return false;
            }}
          />
        </>
      )
    );
  }

  const shouldRenderSuggestedReplies = useIIFE(() => {
    if (message.messageId !== currentChannel?.lastMessage?.messageId) return false;
    if (getSuggestedReplies(message).length === 0) return false;
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && isSendableMessage(lastMessage) && lastMessage.sendingStatus !== 'succeeded') return false;

    return true;
  });

  return (
    <div
      className={getClassName(['sendbird-msg-hoc sendbird-msg--scroll-ref', isAnimated ? 'sendbird-msg-hoc__animated' : ''])}
      style={{ marginBottom: '2px' }}
      data-sb-message-id={message.messageId}
      data-sb-created-at={message.createdAt}
    >
      {/* date-separator */}
      {hasSeparator
        && (renderedCustomSeparator || (
          <DateSeparator>
            <Label type={LabelTypography.CAPTION_2} color={LabelColors.ONBACKGROUND_2}>
              {format(message.createdAt, stringSet.DATE_FORMAT__MESSAGE_LIST__DATE_SEPARATOR, {
                locale: dateLocale,
              })}
            </Label>
          </DateSeparator>
        ))}
      {/* Message */}
      {renderMessageContent?.() || (
        <MessageContent
          className="sendbird-message-hoc__message-content"
          userId={userId}
          scrollToMessage={scrollToMessage}
          channel={currentChannel}
          message={message}
          disabled={!isOnline}
          chainTop={chainTop}
          chainBottom={chainBottom}
          isReactionEnabled={isReactionEnabled}
          replyType={replyType}
          threadReplySelectType={threadReplySelectType}
          nicknamesMap={nicknamesMap}
          emojiContainer={emojiManager.emojiContainer}
          showEdit={setShowEdit}
          showRemove={setShowRemove}
          showFileViewer={setShowFileViewer}
          resendMessage={resendMessage}
          deleteMessage={deleteMessage as any}
          toggleReaction={toggleReaction}
          setQuoteMessage={setQuoteMessage}
          onReplyInThread={onReplyInThreadClick}
          onQuoteMessageClick={onQuoteMessageClick}
          onMessageHeightChange={handleScroll}
        />
      )}
      {/** Suggested Replies */}
      {shouldRenderSuggestedReplies && <SuggestedReplies replyOptions={getSuggestedReplies(message)} onSendMessage={sendUserMessage} />}
      {/* Modal */}
      {showRemove && <RemoveMessageModal message={message} onCancel={() => setShowRemove(false)} />}
      {showFileViewer && <FileViewer message={message as FileMessage} onCancel={() => setShowFileViewer(false)} />}
    </div>
  );
};

export default MessageView;
