import React, { useContext, useEffect, useRef, useState } from 'react';
import format from 'date-fns/format';
import { FileMessage, UserMessage } from '@sendbird/chat/message';

import './index.scss';
import RemoveMessage from '../RemoveMessageModal';
import ParentMessageInfoItem from './ParentMessageInfoItem';

import {
  getSenderName,
} from '../../../../utils';
import { useLocalization } from '../../../../lib/LocalizationContext';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useThreadContext } from '../../context/ThreadProvider';
import { UserProfileContext } from '../../../../lib/UserProfileContext';
import SuggestedMentionList from '../../../Channel/components/SuggestedMentionList';

import Avatar from '../../../../ui/Avatar';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import FileViewer from '../../../../ui/FileViewer';
import MessageItemMenu from '../../../../ui/MessageItemMenu';
import MessageItemReactionMenu from '../../../../ui/MessageItemReactionMenu';
import ContextMenu, { MenuItems } from '../../../../ui/ContextMenu';
import ConnectedUserProfile from '../../../../ui/UserProfile';
import { UserProfileContextInterface } from '../../../../ui/MessageContent';
import MessageInput from '../../../../ui/MessageInput';
import { MessageInputKeys } from '../../../../ui/MessageInput/const';
import { Role } from '../../../../lib/types';
import { useMediaQueryContext } from '../../../../lib/MediaQueryContext';
import useLongPress from '../../../../hooks/useLongPress';
import MobileMenu from '../../../../ui/MobileMenu';
import { useDirtyGetMentions } from '../../../Message/hooks/useDirtyGetMentions';

export interface ParentMessageInfoProps {
  className?: string;
}

export default function ParentMessageInfo({
  className,
}: ParentMessageInfoProps): React.ReactElement {
  const { stores, config } = useSendbirdStateContext();
  const {
    isMentionEnabled,
    isReactionEnabled,
    replyType,
    isOnline,
    userMention,
    logger,
  } = config;
  const userId = stores.userStore.user?.userId ?? '';
  const { dateLocale } = useLocalization();
  const {
    currentChannel,
    parentMessage,
    allThreadMessages,
    emojiContainer,
    toggleReaction,
    updateMessage,
    deleteMessage,
    onMoveToParentMessage,
    onHeaderActionClick,
    isMuted,
    isChannelFrozen,
  } = useThreadContext();
  const { isMobile } = useMediaQueryContext();

  const [showRemove, setShowRemove] = useState(false);
  const [supposedHover, setSupposedHover] = useState(false);
  const [showFileViewer, setShowFileViewer] = useState(false);
  const usingReaction = isReactionEnabled && !currentChannel?.isSuper && !currentChannel?.isBroadcast;
  const isByMe = userId === parentMessage.sender.userId;

  // Mobile
  const mobileMenuRef = useRef(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const longPress = useLongPress({
    onLongPress: () => {
      if (isMobile) {
        setShowMobileMenu(true);
      }
    },
  }, {
    shouldPreventDefault: false,
  });

  // Edit message
  const [showEditInput, setShowEditInput] = useState(false);
  const disabled = !isOnline || isMuted || isChannelFrozen && !(currentChannel?.myRole === Role.OPERATOR);

  // Mention
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

  // User Profile
  const avatarRef = useRef(null);
  const {
    disableUserProfile,
    renderUserProfile,
  } = useContext<UserProfileContextInterface>(UserProfileContext);

  if (showEditInput && parentMessage?.isUserMessage?.()) {
    return (
      <>
        {
          displaySuggestedMentionList && (
            <SuggestedMentionList
              className="parent-message-info--suggested-mention-list"
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
          disabled={disabled}
          ref={editMessageInputRef}
          mentionSelectedUser={selectedUser}
          isMentionEnabled={isMentionEnabled}
          message={parentMessage}
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
            setShowEditInput(false);
            currentChannel?.endTyping?.();
          }}
          onCancelEdit={() => {
            setMentionNickname('');
            setMentionedUsers([]);
            setMentionedUserIds([]);
            setMentionSuggestedUsers([]);
            setShowEditInput(false);
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
      className={`sendbird-parent-message-info ${className}`}
      {...(isMobile) ? { ...longPress } : {}}
      ref={mobileMenuRef}
    >
      <ContextMenu
        menuTrigger={(toggleDropdown) => (
          <Avatar
            className="sendbird-parent-message-info__sender"
            ref={avatarRef}
            src={
              currentChannel?.members?.find((m) => m?.userId === parentMessage?.sender?.userId)?.profileUrl
              || parentMessage?.sender?.profileUrl
            }
            alt="thread message sender"
            width="40px"
            height="40px"
            onClick={() => {
              if (!disableUserProfile) {
                toggleDropdown();
              }
            }}
          />
        )}
        menuItems={(closeDropdown) => (
          <MenuItems
            parentRef={avatarRef}
            parentContainRef={avatarRef}
            closeDropdown={closeDropdown}
            style={{ paddingTop: '0px', paddingBottom: '0px' }}
          >
            {renderUserProfile
              ? renderUserProfile({ user: parentMessage?.sender, close: closeDropdown })
              : (
                <ConnectedUserProfile
                  user={parentMessage?.sender}
                  currentUserId={userId}
                  onSuccess={closeDropdown}
                />
              )}
          </MenuItems>
        )}
      />
      <div className="sendbird-parent-message-info__content">
        <div className="sendbird-parent-message-info__content__info">
          <Label
            className={`sendbird-parent-message-info__content__info__sender-name${usingReaction ? '--use-reaction' : ''}`}
            type={LabelTypography.CAPTION_2}
            color={LabelColors.ONBACKGROUND_2}
          >
            {
              currentChannel?.members?.find((member) => member?.userId === parentMessage?.sender?.userId)
                ?.nickname || getSenderName?.(parentMessage as UserMessage | FileMessage)
            }
          </Label>
          <Label
            className="sendbird-parent-message-info__content__info__sent-at"
            type={LabelTypography.CAPTION_3}
            color={LabelColors.ONBACKGROUND_2}
          >
            {format(parentMessage?.createdAt || 0, 'p', { locale: dateLocale })}
          </Label>
        </div>
        {/* message content body */}
        <ParentMessageInfoItem
          message={parentMessage}
          showFileViewer={setShowFileViewer}
        />
      </div>
      {/* context menu */}
      {!isMobile && (
        <MessageItemMenu
          className={`sendbird-parent-message-info__context-menu ${usingReaction ? 'use-reaction' : ''} ${supposedHover ? 'sendbird-mouse-hover' : ''}`}
          channel={currentChannel}
          message={parentMessage}
          isByMe={userId === parentMessage?.sender?.userId}
          disableDeleteMessage={allThreadMessages.length > 0}
          replyType={replyType}
          showEdit={setShowEditInput}
          showRemove={setShowRemove}
          setSupposedHover={setSupposedHover}
          onMoveToParentMessage={() => {
            onMoveToParentMessage({ message: parentMessage, channel: currentChannel });
          }}
        />
      )}
      {(usingReaction && !isMobile) && (
        <MessageItemReactionMenu
          className={`sendbird-parent-message-info__reaction-menu ${supposedHover ? 'sendbird-mouse-hover' : ''}`}
          message={parentMessage}
          userId={userId}
          emojiContainer={emojiContainer}
          toggleReaction={toggleReaction}
          setSupposedHover={setSupposedHover}
        />
      )}
      {showRemove && (
        <RemoveMessage
          onCancel={() => setShowRemove(false)}
          onSubmit={() => {
            onHeaderActionClick?.();
          }}
          message={parentMessage}
        />
      )}
      {showFileViewer && (
        <FileViewer
          message={parentMessage as FileMessage}
          onClose={() => setShowFileViewer(false)}
          onDelete={() => {
            deleteMessage(parentMessage)
              .then(() => {
                setShowFileViewer(false);
              });
          }}
        />
      )}
      {showMobileMenu && (
        <MobileMenu
          parentRef={mobileMenuRef}
          channel={currentChannel}
          message={parentMessage}
          userId={userId}
          replyType={replyType}
          hideMenu={() => {
            setShowMobileMenu(false);
          }}
          isReactionEnabled={isReactionEnabled}
          isByMe={isByMe}
          emojiContainer={emojiContainer}
          showEdit={setShowEditInput}
          showRemove={setShowRemove}
          toggleReaction={toggleReaction}
          isOpenedFromThread
        />
      )}
    </div>
  );
}
