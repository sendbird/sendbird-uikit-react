import React, { useMemo, useState, useRef, useEffect, useLayoutEffect } from 'react';
import format from 'date-fns/format';
import type { FileMessage, MultipleFilesMessage } from '@sendbird/chat/message';

import { useLocalization } from '../../../../lib/LocalizationContext';
import DateSeparator from '../../../../ui/DateSeparator';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import RemoveMessage from '../RemoveMessageModal';
import FileViewer from '../../../../ui/FileViewer';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import SuggestedMentionList from '../SuggestedMentionList';
import MessageInput from '../../../../ui/MessageInput';
import { ThreadListStateTypes } from '../../types';
import { MessageInputKeys } from '../../../../ui/MessageInput/const';
import ThreadListItemContent from './ThreadListItemContent';
import { Role } from '../../../../lib/types';
import { useDirtyGetMentions } from '../../../Message/hooks/useDirtyGetMentions';
import { getIsReactionEnabled } from '../../../../utils/getIsReactionEnabled';
import { SendableMessageType } from '../../../../utils';
import { User } from '@sendbird/chat';
import { getCaseResolvedReplyType } from '../../../../lib/utils/resolvedReplyType';
import { classnames } from '../../../../utils/utils';
import { MessageComponentRenderers } from '../../../../ui/MessageContent';
import useThread from '../../context/useThread';

export interface ThreadListItemProps extends MessageComponentRenderers {
  className?: string;
  message: SendableMessageType;
  chainTop?: boolean;
  chainBottom?: boolean;
  hasSeparator?: boolean;
  renderCustomSeparator?: (props: { message: SendableMessageType }) => React.ReactElement;
  handleScroll?: () => void;
}

export default function ThreadListItem(props: ThreadListItemProps): React.ReactElement {
  const {
    className,
    message,
    chainTop,
    chainBottom,
    hasSeparator,
    renderCustomSeparator,
    handleScroll,
  } = props;
  const { stores, config } = useSendbirdStateContext();
  const { isOnline, userMention, logger, groupChannel } = config;
  const userId = stores?.userStore?.user?.userId;
  const { dateLocale, stringSet } = useLocalization();
  const {
    state: {
      message: openingMessage,
      currentChannel,
      nicknamesMap,
      emojiContainer,
      threadListState,
      isMuted,
      isChannelFrozen,
      onBeforeDownloadFileMessage,
    },
    actions: {
      toggleReaction,
      updateMessage,
      resendMessage,
      deleteMessage,
    },
  } = useThread();

  const [showEdit, setShowEdit] = useState(false);
  const [showRemove, setShowRemove] = useState(false);
  const [showFileViewer, setShowFileViewer] = useState(false);
  const isReactionEnabled = getIsReactionEnabled({
    channel: currentChannel,
    config,
  });
  const isMentionEnabled = groupChannel.enableMention;
  const replyType = getCaseResolvedReplyType(groupChannel.replyType).upperCase;

  // Move to message
  const messageScrollRef = useRef<HTMLDivElement>(null);
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
  const [mentionedUsers, setMentionedUsers] = useState<User[]>([]);
  const [mentionedUserIds, setMentionedUserIds] = useState<string[]>([]);
  const [messageInputEvent, setMessageInputEvent] = useState<React.KeyboardEvent<HTMLDivElement> | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [mentionSuggestedUsers, setMentionSuggestedUsers] = useState<User[]>([]);
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
              inputEvent={messageInputEvent ?? undefined}
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
      className={classnames('sendbird-thread-list-item', className)}
      data-testid="sendbird-thread-list-item"
    >
      {/* date separator */}
      {
        hasSeparator && message?.createdAt && (MemorizedSeparator || (
          <DateSeparator>
            <Label
              type={LabelTypography.CAPTION_2}
              color={LabelColors.ONBACKGROUND_2}
            >
              {format(message?.createdAt, stringSet.DATE_FORMAT__THREAD_LIST__DATE_SEPARATOR, { locale: dateLocale })}
            </Label>
          </DateSeparator>
        ))
      }
      <ThreadListItemContent
        {...props}
        userId={userId}
        channel={currentChannel}
        message={message}
        chainTop={chainTop}
        chainBottom={chainBottom}
        isReactionEnabled={isReactionEnabled}
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
          message={message as FileMessage | MultipleFilesMessage}
          isByMe={message?.sender?.userId === userId}
          onClose={() => setShowFileViewer(false)}
          onDelete={() => {
            deleteMessage(message);
            setShowFileViewer(false);
          }}
          onDownloadClick={async (e) => {
            if (!onBeforeDownloadFileMessage) return;

            try {
              const allowDownload = await onBeforeDownloadFileMessage({ message: message as FileMessage | MultipleFilesMessage });
              if (!allowDownload) {
                e.preventDefault();
                logger.info?.('ThreadListItem: Not allowed to download.');
              }
            } catch (err) {
              logger.error?.('ThreadListItem: Error occurred while determining download continuation:', err);
            }
          }}
        />
      )}
    </div>
  );
}
