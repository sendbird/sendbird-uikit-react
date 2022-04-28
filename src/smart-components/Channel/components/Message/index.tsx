import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useMemo,
} from 'react';
import format from 'date-fns/format';

import SuggestedMentionList from '../SuggestedMentionList';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useChannel } from '../../context/ChannelProvider';
import { getClassName } from '../../../../utils';
import { isDisabledBecauseFrozen } from '../../context/utils';
import { MAX_USER_MENTION_COUNT, MAX_USER_SUGGESTION_COUNT } from '../../context/const';

import DateSeparator from '../../../../ui/DateSeparator';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import MessageInput from '../../../../ui/MessageInput';
import MessageContent from '../../../../ui/MessageContent';
import FileViewer from '../FileViewer';
import RemoveMessageModal from '../RemoveMessageModal';
import { MessageInputKeys } from '../../../../ui/MessageInput/const';
import { EveryMessage, RenderMessageProps } from '../../../../types';
import { useLocalization } from '../../../../lib/LocalizationContext';

type MessageUIProps = {
  message: EveryMessage;
  hasSeparator?: boolean;
  chainTop?: boolean;
  chainBottom?: boolean;
  handleScroll: () => void;
  // for extending
  renderMessage?: (props: RenderMessageProps) => React.ReactNode;
  renderCustomSeperator?: () => React.ReactNode;
  renderEditInput?: () => React.ReactNode;
  renderMessageContent?: () => React.ReactNode;
};

const Message: React.FC<MessageUIProps> = (props: MessageUIProps) => {
  const {
    message,
    hasSeparator,
    chainTop,
    chainBottom,
    handleScroll,
    renderCustomSeperator,
    renderEditInput,
    renderMessage,
    renderMessageContent,
  } = props;

  const { dateLocale } = useLocalization();
  const globalStore = useSendbirdStateContext();
  const {
    userId,
    isOnline,
    isMentionEnabled,
    userMention,
  } = globalStore?.config;
  const maxUserMentionCount = userMention?.maxMentionCount || MAX_USER_MENTION_COUNT;
  const maxUserSuggestionCount = userMention?.maxSuggestionCount || MAX_USER_SUGGESTION_COUNT;

  const {
    currentGroupChannel,
    highLightedMessageId,
    setHighLightedMessageId,
    animatedMessageId,
    setAnimatedMessageId,
    updateMessage,
    scrollToMessage,
    replyType,
    useReaction,
    toggleReaction,
    emojiContainer,
    nicknamesMap,
    setQuoteMessage,
    resendMessage,
    renderUserMentionItem,
  } = useChannel();

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
  const [ableMention, setAbleMention] = useState(true);
  const editMessageInputRef = useRef(null);
  const useMessageScrollRef = useRef(null);

  const displaySuggestedMentionList = (isMentionEnabled && mentionNickname.length > 0);

  useEffect(() => {
    if (mentionedUsers?.length >= maxUserMentionCount) {
      setAbleMention(false);
    } else {
      setAbleMention(true);
    }
  }, [mentionedUsers]);

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
    handleScroll?.();
  }, [showEdit, message?.reactions?.length]);

  useLayoutEffect(() => {
    if (highLightedMessageId === message.messageId) {
      if (useMessageScrollRef && useMessageScrollRef.current) {
        useMessageScrollRef.current.scrollIntoView({ block: 'center', inline: 'center' });
        setIsAnimated(false);
        setTimeout(() => {
          setIsHighlighted(true);
        }, 500);
        setTimeout(() => {
          setHighLightedMessageId(0);
        }, 1600);
      }
    } else {
      setIsHighlighted(false);
    }
  }, [highLightedMessageId, useMessageScrollRef.current, message.messageId]);

  useLayoutEffect(() => {
    if (animatedMessageId === message.messageId) {
      if (useMessageScrollRef && useMessageScrollRef.current) {
        useMessageScrollRef.current.scrollIntoView({ block: 'center', inline: 'center' });
        setIsHighlighted(false);
        setTimeout(() => {
          setIsAnimated(true);
        }, 500);
        setTimeout(() => {
          setAnimatedMessageId(0);
        }, 1600);
      }
    } else {
      setIsAnimated(false);
    }
  }, [animatedMessageId, useMessageScrollRef.current, message.messageId]);
  const renderedMessage = useMemo(() => {
    return renderMessage?.({
      message,
      chainTop,
      chainBottom,
    });
  }, [message, renderMessage]);

  if (renderedMessage) {
    return (
      <div
        ref={useMessageScrollRef}
        className={getClassName([
          'sendbird-msg-hoc sendbird-msg--scroll-ref',
          isAnimated ? 'sendbird-msg-hoc__animated' : '',
          isHighlighted ? 'sendbird-msg-hoc__highlighted' : '',
        ])}
      >
        {/* date-separator */}
        {
          // TODO: Add message instance as a function parameter
          hasSeparator && renderCustomSeperator?.() || (
            <DateSeparator>
              <Label type={LabelTypography.CAPTION_2} color={LabelColors.ONBACKGROUND_2}>
                {format(message.createdAt, 'MMMM dd, yyyy', {
                  locale: dateLocale,
                })}
              </Label>
            </DateSeparator>
          )
        }
        {renderedMessage}
      </div>
    );
  }

  if (showEdit && message.isUserMessage()) {
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
              ableAddMention={ableMention}
              maxSuggestionCount={maxUserSuggestionCount}
            />
          )
        }
        <MessageInput
          isEdit
          disabled={isDisabledBecauseFrozen(currentGroupChannel)}
          ref={editMessageInputRef}
          mentionSelectedUser={selectedUser}
          isMentionEnabled={isMentionEnabled}
          message={message}
          onUpdateMessage={({ messageId, message, mentionTemplate }) => {
            updateMessage({
              messageId,
              message,
              mentionedUsers,
              mentionTemplate,
            });
            setShowEdit(false);
          }}
          onCancelEdit={() => { setShowEdit(false); }}
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
            if (displaySuggestedMentionList
              && (e.key === MessageInputKeys.Enter || e.key === MessageInputKeys.ArrowUp || e.key === MessageInputKeys.ArrowDown)
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
      ref={useMessageScrollRef}
    >
      {/* date-separator */}
      {
        hasSeparator && (renderCustomSeperator?.() || (
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
            useReaction={useReaction}
            replyType={replyType}
            nicknamesMap={nicknamesMap}
            emojiContainer={emojiContainer}
            showEdit={setShowEdit}
            showRemove={setShowRemove}
            showFileViewer={setShowFileViewer}
            resendMessage={resendMessage}
            toggleReaction={toggleReaction}
            setQuoteMessage={setQuoteMessage}
          />
        )
      }
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
            message={message as SendbirdUIKit.ClientFileMessage}
            onCancel={() => setShowFileViewer(false)}
          />
        )
      }
    </div>
  );
};

export default Message;
