import React, { useMemo, useState, useRef, useEffect, useLayoutEffect } from 'react';
import format from 'date-fns/format';
import { FileMessage, UserMessage } from '@sendbird/chat/message';

import { useLocalization } from '../../../../lib/LocalizationContext';
import DateSeparator from '../../../../ui/DateSeparator';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import RemoveMessage from '../RemoveMessageModal';
import FileViewer from '../../../../ui/FileViewer';
import { useThreadContext } from '../../context/ThreadProvider';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import SuggestedMentionList from '../../../Channel/components/SuggestedMentionList';
import MessageInput from '../../../../ui/MessageInput';
import { ThreadListStateTypes } from '../../types';
import { MessageInputKeys } from '../../../../ui/MessageInput/const';
import ThreadListItemContent from './ThreadListItemContent';
import { Role } from '../../../../lib/types';
import { useDirtyGetMentions } from '../../../Message/hooks/useDirtyGetMentions';
import { getIsReactionEnabled } from '../../../../utils/getIsReactionEnabled';

export interface ThreadListItemProps {
  className?: string;
  message: UserMessage | FileMessage;
  chainTop?: boolean;
  chainBottom?: boolean;
  hasSeparator?: boolean;
  renderCustomSeparator?: (props: { message: UserMessage | FileMessage }) => React.ReactElement;
  handleScroll?: () => void;
}

export default function ThreadListItem({
  className,
  message,
  chainTop,
  chainBottom,
  hasSeparator,
  renderCustomSeparator,
  handleScroll,
}: ThreadListItemProps): React.ReactElement {
  const { stores, config } = useSendbirdStateContext();
  const {
    isReactionEnabled,
    isMentionEnabled,
    isOnline,
    replyType,
    userMention,
    logger,
  } = config;
  const userId = stores?.userStore?.user?.userId;
  const { dateLocale } = useLocalization();
  const threadContext = useThreadContext?.();
  const {
    currentChannel,
    nicknamesMap,
    emojiContainer,
    toggleReaction,
    threadListState,
    updateMessage,
    resendMessage,
    deleteMessage,
    isMuted,
    isChannelFrozen,
  } = threadContext;
  const openingMessage = threadContext?.message;

  const [showEdit, setShowEdit] = useState(false);
  const [showRemove, setShowRemove] = useState(false);
  const [showFileViewer, setShowFileViewer] = useState(false);
  const usingReaction = getIsReactionEnabled({
    globalLevel: isReactionEnabled,
    isSuper: currentChannel.isSuper,
    isBroadcast: currentChannel.isBroadcast,
  });

  // Move to message
  const messageScrollRef = useRef(null);
  useLayoutEffect(() => {
    if (openingMessage?.messageId === message?.messageId && messageScrollRef?.current) {
      messageScrollRef.current?.scrollIntoView({ block: 'center', inline: 'center' });
    }
  }, [openingMessage, messageScrollRef?.current]);

  // reactions
  useLayoutEffect(() => {
    handleScroll?.();
  }, [showEdit, message?.reactions?.length]);

  // mention
  const editMessageInputRef = useRef(null);
  const [mentionNickname, setMentionNickname] = useState('');
  const [mentionedUsers, setMentionedUsers] = useState([]);
  const [mentionedUserIds, setMentionedUserIds] = useState([]);
  const [messageInputEvent, setMessageInputEvent] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [mentionSuggestedUsers, setMentionSuggestedUsers] = useState([]);
  const displaySuggestedMentionList = isOnline
    && isMentionEnabled
    && mentionNickname.length > 0
    && !isMuted
    && !(isChannelFrozen && !(currentChannel.myRole === Role.OPERATOR));

  const mentionNodes = useDirtyGetMentions({ ref: editMessageInputRef }, { logger });
  const ableMention = mentionNodes?.length < userMention?.maxMentionCount;

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

  // edit input
  const disabled = !(threadListState === ThreadListStateTypes.INITIALIZED)
    || !isOnline
    || isMuted
    || isChannelFrozen;

  // memorize
  const MemorizedSeparator = useMemo(() => {
    if (typeof renderCustomSeparator === 'function') {
      return renderCustomSeparator?.({ message });
    }
  }, [message, renderCustomSeparator]);

  // Edit message
  if (showEdit && message.isUserMessage()) {
    return (
      <>
        {
          displaySuggestedMentionList && (
            <SuggestedMentionList
              targetNickname={mentionNickname}
              inputEvent={messageInputEvent}
              // renderUserMentionItem={renderUserMentionItem}
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
              maxMentionCount={userMention?.maxMentionCount}
              maxSuggestionCount={userMention?.maxSuggestionCount}
            />
          )
        }
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
            updateMessage({
              messageId,
              message,
              mentionedUsers,
              mentionTemplate,
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
      ref={messageScrollRef}
      className={`sendbird-thread-list-item ${className}`}
    >
      {/* date separator */}
      {
        hasSeparator && message?.createdAt && (MemorizedSeparator || (
          <DateSeparator>
            <Label
              type={LabelTypography.CAPTION_2}
              color={LabelColors.ONBACKGROUND_2}
            >
              {format(message?.createdAt, 'MMM dd, yyyy', { locale: dateLocale })}
            </Label>
          </DateSeparator>
        ))
      }
      <ThreadListItemContent
        userId={userId}
        channel={currentChannel}
        message={message}
        chainTop={chainTop}
        chainBottom={chainBottom}
        isReactionEnabled={usingReaction}
        isMentionEnabled={isMentionEnabled}
        disableQuoteMessage
        replyType={replyType}
        nicknamesMap={nicknamesMap}
        emojiContainer={emojiContainer}
        resendMessage={resendMessage}
        showRemove={setShowRemove}
        showFileViewer={setShowFileViewer}
        toggleReaction={toggleReaction}
        showEdit={setShowEdit}
      />
      {/* modal */}
      {showRemove && (
        <RemoveMessage
          message={message}
          onCancel={() => setShowRemove(false)}
        />
      )}
      {showFileViewer && (
        <FileViewer
          message={message as FileMessage}
          isByMe={message?.sender?.userId === userId}
          onClose={() => setShowFileViewer(false)}
          onDelete={() => {
            deleteMessage(message);
            setShowFileViewer(false);
          }}
        />
      )}
    </div>
  );
}
