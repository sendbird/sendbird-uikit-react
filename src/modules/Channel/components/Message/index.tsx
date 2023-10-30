import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useLayoutEffect,
} from 'react';
import type { FileMessage } from '@sendbird/chat/message';
import format from 'date-fns/format';

import useDidMountEffect from '../../../../utils/useDidMountEffect';
import SuggestedMentionList from '../SuggestedMentionList';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useChannelContext } from '../../context/ChannelProvider';
import { getClassName } from '../../../../utils';
import { isDisabledBecauseFrozen, isDisabledBecauseMuted } from '../../context/utils';
import { MAX_USER_MENTION_COUNT, MAX_USER_SUGGESTION_COUNT } from '../../context/const';

import DateSeparator from '../../../../ui/DateSeparator';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import MessageInput from '../../../../ui/MessageInput';
import MessageContent from '../../../../ui/MessageContent';
import FileViewer from '../FileViewer';
import RemoveMessageModal from '../RemoveMessageModal';
import { MessageInputKeys } from '../../../../ui/MessageInput/const';
import { EveryMessage, RenderCustomSeparatorProps, RenderMessageProps } from '../../../../types';
import { useLocalization } from '../../../../lib/LocalizationContext';
import { useHandleOnScrollCallback } from '../../../../hooks/useHandleOnScrollCallback';
import { useDirtyGetMentions } from '../../../Message/hooks/useDirtyGetMentions';
import SuggestedReplies from '../SuggestedReplies';

type MessageUIProps = {
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
};

// todo: Refactor this component, is too complex now
const Message = ({
  message,
  hasSeparator,
  chainTop,
  chainBottom,
  handleScroll,
  renderCustomSeparator,
  renderEditInput,
  renderMessage,
  renderMessageContent,
}: MessageUIProps): React.ReactElement => {
  const { dateLocale } = useLocalization();
  const globalStore = useSendbirdStateContext();

  const {
    userId,
    isOnline,
    isMentionEnabled,
    userMention,
    logger,
  } = globalStore.config;
  const maxUserMentionCount = userMention?.maxMentionCount || MAX_USER_MENTION_COUNT;
  const maxUserSuggestionCount = userMention?.maxSuggestionCount || MAX_USER_SUGGESTION_COUNT;

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
    onScrollCallback,
    setIsScrolled,
    sendMessage,
  } = useChannelContext();
  const [showEdit, setShowEdit] = useState(false);
  const [showRemove, setShowRemove] = useState(false);
  const [showFileViewer, setShowFileViewer] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [mentionNickname, setMentionNickname] = useState('');
  const [mentionedUsers, setMentionedUsers] = useState([]);
  const [mentionedUserIds, setMentionedUserIds] = useState([]);
  const [messageInputEvent, setMessageInputEvent] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [mentionSuggestedUsers, setMentionSuggestedUsers] = useState([]);
  const editMessageInputRef = useRef(null);
  const messageScrollRef = useRef(null);
  const displaySuggestedMentionList = isOnline
    && isMentionEnabled
    && mentionNickname.length > 0
    && !isDisabledBecauseFrozen(currentGroupChannel)
    && !isDisabledBecauseMuted(currentGroupChannel);
  const disabled = !initialized
    || isDisabledBecauseFrozen(currentGroupChannel)
    || isDisabledBecauseMuted(currentGroupChannel)
    || !isOnline;

  const handleOnScroll = useHandleOnScrollCallback({
    hasMore: false,
    onScroll: onScrollCallback,
    scrollRef: messageScrollRef,
    setIsScrolled,
  });

  const mentionNodes = useDirtyGetMentions({ ref: editMessageInputRef }, { logger });
  const ableMention = mentionNodes?.length < maxUserMentionCount;

  useEffect(() => {
    setMentionedUsers(mentionedUsers.filter(({ userId }) => {
      const i = mentionedUserIds.indexOf(userId);
      if (i < 0) {
        return false;
      } else {
        mentionedUserIds.splice(i, 1);
        return true;
      }
    }));
  }, [mentionedUserIds]);

  useLayoutEffect(() => {
    // Keep the scrollBottom value after fetching new message list
    handleScroll?.();
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
    let animationTimeout = null;
    let messageHighlightedTimeout = null;
    if (highLightedMessageId === message.messageId && messageScrollRef?.current) {
      handleOnScroll();
      setIsAnimated(false);
      animationTimeout = setTimeout(() => {
        setIsHighlighted(true);
      }, 500);
      messageHighlightedTimeout = setTimeout(() => {
        setHighLightedMessageId(0);
        onMessageHighlighted?.();
      }, 1600);
    } else {
      setIsHighlighted(false);
    }
    return () => {
      clearTimeout(animationTimeout);
      clearTimeout(messageHighlightedTimeout);
    };
  }, [highLightedMessageId, messageScrollRef.current, message.messageId]);

  useLayoutEffect(() => {
    let animationTimeout = null;
    let messageAnimatedTimeout = null;
    if (animatedMessageId === message.messageId && messageScrollRef?.current) {
      handleOnScroll();
      setIsHighlighted(false);
      animationTimeout = setTimeout(() => {
        setIsAnimated(true);
      }, 500);
      messageAnimatedTimeout = setTimeout(() => {
        setAnimatedMessageId(0);
        onMessageAnimated?.();
      }, 1600);
    } else {
      setIsAnimated(false);
    }
    return () => {
      clearTimeout(animationTimeout);
      clearTimeout(messageAnimatedTimeout);
    };
  }, [animatedMessageId, messageScrollRef.current, message.messageId, onMessageAnimated]);
  const renderedMessage = useMemo(() => {
    return renderMessage?.({
      message,
      chainTop,
      chainBottom,
    });
  }, [message, renderMessage]);
  const renderedCustomSeparator = useMemo(() => {
    if (renderCustomSeparator) {
      return renderCustomSeparator?.({ message: message });
    }
    return null;
  }, [message, renderCustomSeparator]);

  const suggestedReplies = useMemo(() => {
    return message.extendedMessagePayload?.suggested_replies as string[] | undefined ?? [];
  }, [(message.extendedMessagePayload?.suggested_replies as string[] | undefined)?.length]);

  if (renderedMessage) {
    return (
      <div
        // do not delete this data attribute, used for scroll to given message
        // and also for testing
        data-sb-message-id={message.messageId}
        data-sb-created-at={message.createdAt}
        ref={messageScrollRef}
        className={getClassName([
          'sendbird-msg-hoc sendbird-msg--scroll-ref',
          isAnimated ? 'sendbird-msg-hoc__animated' : '',
          isHighlighted ? 'sendbird-msg-hoc__highlighted' : '',
        ])}
      >
        {/* date-separator */}
        {
          // TODO: Add message instance as a function parameter
          hasSeparator && (renderedCustomSeparator || (
            <DateSeparator>
              <Label type={LabelTypography.CAPTION_2} color={LabelColors.ONBACKGROUND_2}>
                {format(message.createdAt, 'MMMM dd, yyyy', {
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
    return renderEditInput?.() || (
      <>
        {
          displaySuggestedMentionList && (
            <SuggestedMentionList
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
          )
        }
        <MessageInput
          isEdit
          channel={currentGroupChannel}
          disabled={disabled}
          ref={editMessageInputRef}
          mentionSelectedUser={selectedUser}
          isMentionEnabled={isMentionEnabled}
          message={message}
          onStartTyping={() => {
            currentGroupChannel?.startTyping?.();
          }}
          onUpdateMessage={({ messageId, message, mentionTemplate }) => {
            updateMessage({
              messageId,
              message,
              mentionedUsers,
              mentionTemplate,
            });
            setShowEdit(false);
            currentGroupChannel?.endTyping?.();
          }}
          onCancelEdit={() => {
            setMentionNickname('');
            setMentionedUsers([]);
            setMentionedUserIds([]);
            setMentionSuggestedUsers([]);
            setShowEdit(false);
            currentGroupChannel?.endTyping?.();
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
            if (displaySuggestedMentionList && mentionSuggestedUsers?.length > 0
              && ((e.key === MessageInputKeys.Enter && ableMention) || e.key === MessageInputKeys.ArrowUp || e.key === MessageInputKeys.ArrowDown)
            ) {
              setMessageInputEvent(e);
              return true;
            }
            return false;
          }}
        />
      </>
    );
  }

  return (
    <div
      className={getClassName([
        'sendbird-msg-hoc sendbird-msg--scroll-ref',
        isAnimated ? 'sendbird-msg-hoc__animated' : '',
        isHighlighted ? 'sendbird-msg-hoc__highlighted' : '',
      ])}
      style={{ marginBottom: '2px' }}
      data-sb-message-id={message.messageId}
      data-sb-created-at={message.createdAt}
      ref={messageScrollRef}
    >
      {/* date-separator */}
      {
        hasSeparator && (renderedCustomSeparator || (
          <DateSeparator>
            <Label type={LabelTypography.CAPTION_2} color={LabelColors.ONBACKGROUND_2}>
              {format(message.createdAt, 'MMMM dd, yyyy', {
                locale: dateLocale,
              })}
            </Label>
          </DateSeparator>
        ))
      }
      {/* Message */}
      {
        renderMessageContent?.() || (
          <MessageContent
            className="sendbird-message-hoc__message-content"
            userId={userId}
            scrollToMessage={scrollToMessage}
            channel={currentGroupChannel}
            message={message}
            disabled={!isOnline}
            chainTop={chainTop}
            chainBottom={chainBottom}
            isReactionEnabled={isReactionEnabled}
            replyType={replyType}
            threadReplySelectType={threadReplySelectType}
            nicknamesMap={nicknamesMap}
            emojiContainer={emojiContainer}
            showEdit={setShowEdit}
            showRemove={setShowRemove}
            showFileViewer={setShowFileViewer}
            resendMessage={resendMessage}
            deleteMessage={deleteMessage}
            toggleReaction={toggleReaction}
            setQuoteMessage={setQuoteMessage}
            onReplyInThread={onReplyInThread}
            onQuoteMessageClick={onQuoteMessageClick}
            onMessageHeightChange={handleScroll}
          />
        )
      }
      {/** Suggested Replies */}
      {message.messageId === currentGroupChannel?.lastMessage.messageId
        && suggestedReplies.length > 0 && (
          <SuggestedReplies replyOptions={suggestedReplies} onSendMessage={sendMessage} />
      )}
      {/* Modal */}
      {
        showRemove && (
          <RemoveMessageModal
            message={message}
            onCancel={() => setShowRemove(false)}
          />
        )
      }
      {
        showFileViewer && (
          <FileViewer
            message={message as FileMessage}
            onCancel={() => setShowFileViewer(false)}
          />
        )
      }
    </div>
  );
};

export default Message;
