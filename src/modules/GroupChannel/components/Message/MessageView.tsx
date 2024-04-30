import type { EveryMessage, RenderCustomSeparatorProps, RenderMessageParamsType, ReplyType } from '../../../../types';
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { EmojiContainer, User } from '@sendbird/chat';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import type { FileMessage, UserMessage, UserMessageCreateParams, UserMessageUpdateParams } from '@sendbird/chat/message';
import format from 'date-fns/format';

import { useLocalization } from '../../../../lib/LocalizationContext';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { MAX_USER_MENTION_COUNT, MAX_USER_SUGGESTION_COUNT, ThreadReplySelectType } from '../../context/const';
import { isDisabledBecauseFrozen, isDisabledBecauseMuted } from '../../context/utils';
import { useDirtyGetMentions } from '../../../Message/hooks/useDirtyGetMentions';
import useDidMountEffect from '../../../../utils/useDidMountEffect';
import { CoreMessageType, getClassName, getSuggestedReplies, SendableMessageType } from '../../../../utils';
import DateSeparator from '../../../../ui/DateSeparator';
import Label, { LabelColors, LabelTypography } from '../../../../ui/Label';
import MessageInput from '../../../../ui/MessageInput';
import { MessageInputKeys } from '../../../../ui/MessageInput/const';
import MessageContent, { MessageContentProps } from '../../../../ui/MessageContent';

import SuggestedReplies, { SuggestedRepliesProps } from '../SuggestedReplies';
import SuggestedMentionListView from '../SuggestedMentionList/SuggestedMentionListView';
import type { OnBeforeDownloadFileMessageType } from '../../context/GroupChannelProvider';
import { deleteNullish } from '../../../../utils/utils';

export interface MessageProps {
  message: EveryMessage;
  hasSeparator?: boolean;
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
   * @deprecated Please use `children` instead
   * @description Customizes all child components of the message.
   * */
  renderMessage?: (props: RenderMessageParamsType) => React.ReactElement;
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

  renderFileViewer: (props: { message: FileMessage; onCancel: () => void }) => React.ReactElement;
  renderRemoveMessageModal?: (props: { message: EveryMessage; onCancel: () => void }) => React.ReactElement;
  /**
   * You can't use this prop in the Channel component (legacy).
   * Accepting this prop only for the GroupChannel.
   */
  onBeforeDownloadFileMessage?: OnBeforeDownloadFileMessageType;

  animatedMessageId: number;
  setAnimatedMessageId: React.Dispatch<React.SetStateAction<number>>;
  onMessageAnimated?: () => void;
  /** @deprecated * */
  highLightedMessageId?: number;
  /** @deprecated * */
  setHighLightedMessageId?: React.Dispatch<React.SetStateAction<number>>;
  /** @deprecated * */
  onMessageHighlighted?: () => void;
  usedInLegacy?: boolean;
}

// TODO: Refactor this component, is too complex now
const MessageView = (props: MessageViewProps) => {
  const {
    // MessageProps
    message,
    children,
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

    scrollToMessage,
    toggleReaction,
    setQuoteMessage,
    onQuoteMessageClick,
    onReplyInThreadClick,
    onBeforeDownloadFileMessage,

    sendUserMessage,
    updateUserMessage,
    resendMessage,
    deleteMessage,

    setAnimatedMessageId,
    animatedMessageId,
    onMessageAnimated,
    usedInLegacy = true,
  } = props;

  const {
    renderUserMentionItem,
    renderMessage,
    renderMessageContent = (props) => <MessageContent {...props} />,
    renderSuggestedReplies = (props) => <SuggestedReplies {...props} />,
    renderCustomSeparator,
    renderEditInput,
    renderFileViewer,
    renderRemoveMessageModal,
  } = deleteNullish(props);

  const { dateLocale, stringSet } = useLocalization();
  const globalStore = useSendbirdStateContext();

  const { userId, isOnline, userMention, logger, groupChannel } = globalStore.config;
  const maxUserMentionCount = userMention?.maxMentionCount || MAX_USER_MENTION_COUNT;
  const maxUserSuggestionCount = userMention?.maxSuggestionCount || MAX_USER_SUGGESTION_COUNT;

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
  const messageScrollRef = useRef(null);

  const displaySuggestedMentionList = isOnline && groupChannel.enableMention && mentionNickname.length > 0 && !isDisabledBecauseFrozen(channel) && !isDisabledBecauseMuted(channel);

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
   * Move the message list scroll
   * when the message's height is changed by `showEdit` OR `message.reactions`
   */
  useDidMountEffect(() => {
    handleScroll?.();
  }, [showEdit, message?.reactions?.length]);

  useDidMountEffect(() => {
    handleScroll?.(true);
  }, [message?.updatedAt, (message as UserMessage)?.message]);

  useLayoutEffect(() => {
    // Keep the scrollBottom value after fetching new message list (but GroupChannel module is not needed.)
    if (usedInLegacy) handleScroll?.(true);
  }, []);

  useLayoutEffect(() => {
    const timeouts = [];

    if (animatedMessageId === message.messageId && messageScrollRef?.current) {
      timeouts.push(
        setTimeout(() => {
          setIsAnimated(true);
        }, 500),
      );

      timeouts.push(
        setTimeout(() => {
          setAnimatedMessageId(null);
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

  const renderedCustomSeparator = useMemo(() => renderCustomSeparator?.({ message }) ?? null, [message, renderCustomSeparator]);

  const renderChildren = () => {
    if (children) {
      return children;
    }

    if (renderMessage) {
      const messageProps = { ...props, renderMessage: undefined };
      return renderMessage(messageProps);
    }

    return (
      <>
        {/* Message */}
        {renderMessageContent({
          className: 'sendbird-message-hoc__message-content',
          userId,
          scrollToMessage,
          channel,
          message,
          disabled: !isOnline,
          chainTop,
          chainBottom,
          isReactionEnabled,
          replyType,
          threadReplySelectType,
          nicknamesMap,
          emojiContainer,
          showEdit: setShowEdit,
          showRemove: setShowRemove,
          showFileViewer: setShowFileViewer,
          resendMessage,
          deleteMessage,
          toggleReaction,
          setQuoteMessage,
          onReplyInThread: onReplyInThreadClick,
          onQuoteMessageClick: onQuoteMessageClick,
          onMessageHeightChange: handleScroll,
          onBeforeDownloadFileMessage,
        })}
        { /* Suggested Replies */ }
        {
          shouldRenderSuggestedReplies && renderSuggestedReplies({
            replyOptions: getSuggestedReplies(message),
            onSendMessage: sendUserMessage,
            message,
          })
        }
        {/* Modal */}
        {showRemove && renderRemoveMessageModal({ message, onCancel: () => setShowRemove(false) })}
        {showFileViewer && renderFileViewer({ message: message as FileMessage, onCancel: () => setShowFileViewer(false) })}
      </>
    );
  };

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
            isMentionEnabled={groupChannel.enableMention}
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
      ])}
      style={children || renderMessage ? undefined : { marginBottom: '2px' }}
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
      {renderChildren()}
    </div>
  );
};

export default MessageView;
