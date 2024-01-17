import type { EveryMessage, RenderCustomSeparatorProps, RenderMessageProps, ReplyType } from '../../../../types';
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { EmojiContainer, User } from '@sendbird/chat';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import type { FileMessage, UserMessageCreateParams, UserMessageUpdateParams } from '@sendbird/chat/message';
import format from 'date-fns/format';

import { useLocalization } from '../../../../lib/LocalizationContext';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { MAX_USER_MENTION_COUNT, MAX_USER_SUGGESTION_COUNT, ThreadReplySelectType } from '../../context/const';
import { isDisabledBecauseFrozen, isDisabledBecauseMuted } from '../../../GroupChannel/context/utils';
import { useDirtyGetMentions } from '../../../Message/hooks/useDirtyGetMentions';
import useDidMountEffect from '../../../../utils/useDidMountEffect';
import { CoreMessageType, getClassName, getSuggestedReplies, SendableMessageType } from '../../../../utils';
import DateSeparator from '../../../../ui/DateSeparator';
import Label, { LabelColors, LabelTypography } from '../../../../ui/Label';
import MessageInput from '../../../../ui/MessageInput';
import { MessageInputKeys } from '../../../../ui/MessageInput/const';
import MessageContent from '../../../../ui/MessageContent';
import SuggestedReplies from '../SuggestedReplies';
import RemoveMessageModal from '../RemoveMessageModal';
import FileViewer from '../../../GroupChannel/components/FileViewer';
import SuggestedMentionListView from '../SuggestedMentionList/SuggestedMentionListView';

export interface MessageProps {
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

export interface MessageViewProps extends MessageProps {
  channel: GroupChannel;
  emojiContainer: EmojiContainer;

  editInputDisabled: boolean;
  shouldRenderSuggestedReplies: boolean;
  isReactionEnabled: boolean;
  replyType: ReplyType;
  threadReplySelectType: ThreadReplySelectType;
  nicknamesMap: Map<string, string>;

  renderUserMentionItem: (props: { user: User }) => React.ReactElement;
  scrollToMessage: (createdAt: number, messageId: number) => void;
  toggleReaction: (message: SendableMessageType, emojiKey: string, isReacted: boolean) => void;
  setQuoteMessage: React.Dispatch<React.SetStateAction<SendableMessageType>>;
  onQuoteMessageClick: (params: { message: SendableMessageType }) => void;
  onReplyInThreadClick: (params: { message: SendableMessageType }) => void;

  sendUserMessage: (params: UserMessageCreateParams) => void;
  updateUserMessage: (messageId: number, params: UserMessageUpdateParams) => void;
  resendMessage: (failedMessage: SendableMessageType) => void;
  deleteMessage: (message: CoreMessageType) => Promise<void>;

  animatedMessageId: number;
  setAnimatedMessageId: React.Dispatch<React.SetStateAction<number>>;
  onMessageAnimated?: () => void;
  /** @deprecated * */
  highLightedMessageId?: number;
  /** @deprecated * */
  setHighLightedMessageId?: React.Dispatch<React.SetStateAction<number>>;
  /** @deprecated * */
  onMessageHighlighted?: () => void;
}

// TODO: Refactor this component, is too complex now
const MessageView = ({
  // MessageProps
  message,
  renderMessage,
  renderMessageContent,
  renderCustomSeparator,
  renderEditInput,
  hasSeparator,
  chainTop,
  chainBottom,
  handleScroll,

  // MessageViewProps
  channel,
  emojiContainer,
  editInputDisabled,
  shouldRenderSuggestedReplies,
  isReactionEnabled,
  replyType,
  threadReplySelectType,
  nicknamesMap,

  renderUserMentionItem,
  scrollToMessage,
  toggleReaction,
  setQuoteMessage,
  onQuoteMessageClick,
  onReplyInThreadClick,

  sendUserMessage,
  updateUserMessage,
  resendMessage,
  deleteMessage,

  setAnimatedMessageId,
  animatedMessageId,
  onMessageAnimated,
  highLightedMessageId,
  setHighLightedMessageId,
  onMessageHighlighted,
}: MessageViewProps) => {
  const { dateLocale, stringSet } = useLocalization();
  const globalStore = useSendbirdStateContext();

  const { userId, isOnline, isMentionEnabled, userMention, logger } = globalStore.config;
  const maxUserMentionCount = userMention?.maxMentionCount || MAX_USER_MENTION_COUNT;
  const maxUserSuggestionCount = userMention?.maxSuggestionCount || MAX_USER_SUGGESTION_COUNT;

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

  const displaySuggestedMentionList = isOnline && isMentionEnabled && mentionNickname.length > 0 && !isDisabledBecauseFrozen(channel) && !isDisabledBecauseMuted(channel);

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
    // Keep the scrollBottom value after fetching new message list
    handleScroll?.(true);
  }, []);

  useLayoutEffect(() => {
    const timeouts = [];

    if (highLightedMessageId === message.messageId && messageScrollRef?.current) {
      setIsAnimated(false);
      timeouts.push(
        setTimeout(() => {
          setIsHighlighted(true);
        }, 500),
      );
      timeouts.push(
        setTimeout(() => {
          setHighLightedMessageId(0);
          onMessageHighlighted?.();
        }, 1600),
      );
    } else {
      setIsHighlighted(false);
    }
    return () => {
      timeouts.forEach((it) => clearTimeout(it));
    };
  }, [highLightedMessageId, messageScrollRef.current, message.messageId]);

  useLayoutEffect(() => {
    const timeouts = [];

    if (animatedMessageId === message.messageId && messageScrollRef?.current) {
      setIsHighlighted(false);

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
  }, [animatedMessageId, messageScrollRef.current, message.messageId]);

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
            <SuggestedMentionListView
              currentChannel={channel}
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
            channel={channel}
            disabled={editInputDisabled}
            ref={editMessageInputRef}
            mentionSelectedUser={selectedUser}
            isMentionEnabled={isMentionEnabled}
            message={message}
            onStartTyping={() => {
              channel?.startTyping?.();
            }}
            onUpdateMessage={({ messageId, message, mentionTemplate }) => {
              updateUserMessage(messageId, {
                message,
                mentionedUsers,
                mentionedMessageTemplate: mentionTemplate,
              });
              setShowEdit(false);
              channel?.endTyping?.();
            }}
            onCancelEdit={() => {
              setMentionNickname('');
              setMentionedUsers([]);
              setMentionedUserIds([]);
              setMentionSuggestedUsers([]);
              setShowEdit(false);
              channel?.endTyping?.();
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
          channel={channel}
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
          onReplyInThread={onReplyInThreadClick}
          onQuoteMessageClick={onQuoteMessageClick}
          onMessageHeightChange={handleScroll}
        />
      )}
      {
        /** Suggested Replies */
        shouldRenderSuggestedReplies && <SuggestedReplies replyOptions={getSuggestedReplies(message)} onSendMessage={sendUserMessage} />
      }
      {/* Modal */}
      {showRemove && <RemoveMessageModal message={message} onCancel={() => setShowRemove(false)} />}
      {showFileViewer && <FileViewer message={message as FileMessage} onCancel={() => setShowFileViewer(false)} />}
    </div>
  );
};

export default MessageView;
