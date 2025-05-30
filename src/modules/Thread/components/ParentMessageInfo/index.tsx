import React, { ReactNode, useEffect, useRef, useState } from 'react';
import format from 'date-fns/format';
import { FileMessage } from '@sendbird/chat/message';

import './index.scss';
import RemoveMessage from '../RemoveMessageModal';
import ParentMessageInfoItem from './ParentMessageInfoItem';

import { getSenderName, SendableMessageType } from '../../../../utils';
import { getIsReactionEnabled } from '../../../../utils/getIsReactionEnabled';
import { useLocalization } from '../../../../lib/LocalizationContext';
import { useUserProfileContext } from '../../../../lib/UserProfileContext';
import SuggestedMentionList from '../SuggestedMentionList';

import Avatar from '../../../../ui/Avatar';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import FileViewer from '../../../../ui/FileViewer';
import { MessageEmojiMenu, MessageEmojiMenuProps } from '../../../../ui/MessageItemReactionMenu';
import ContextMenu, { EMOJI_MENU_ROOT_ID, getObservingId, MENU_OBSERVING_CLASS_NAME, MENU_ROOT_ID, MenuItems } from '../../../../ui/ContextMenu';
import ConnectedUserProfile from '../../../../ui/UserProfile';
import MessageInput from '../../../../ui/MessageInput';
import { MessageInputKeys } from '../../../../ui/MessageInput/const';
import { Role } from '../../../../lib/Sendbird/types';
import { useMediaQueryContext } from '../../../../lib/MediaQueryContext';
import useLongPress from '../../../../hooks/useLongPress';
import MobileMenu from '../../../../ui/MobileMenu';
import { useDirtyGetMentions } from '../../../Message/hooks/useDirtyGetMentions';
import { User } from '@sendbird/chat';
import { getCaseResolvedReplyType } from '../../../../lib/utils/resolvedReplyType';
import { classnames } from '../../../../utils/utils';
import { MessageMenu, MessageMenuProps } from '../../../../ui/MessageMenu';
import useElementObserver from '../../../../hooks/useElementObserver';
import useThread from '../../context/useThread';
import useSendbird from '../../../../lib/Sendbird/context/hooks/useSendbird';

export interface ParentMessageInfoProps {
  className?: string;
  renderEmojiMenu?: (props: MessageEmojiMenuProps) => ReactNode;
  renderMessageMenu?: (props: MessageMenuProps) => ReactNode;
}

export default function ParentMessageInfo({
  className,
  renderEmojiMenu = (props) => <MessageEmojiMenu {...props} />,
  renderMessageMenu = (props) => <MessageMenu {...props} />,
}: ParentMessageInfoProps): React.ReactElement {
  const { state: { stores, config } } = useSendbird();
  const { isOnline, userMention, logger, groupChannel } = config;
  const userId = stores.userStore.user?.userId ?? '';
  const { dateLocale, stringSet } = useLocalization();
  const {
    state: {
      currentChannel,
      parentMessage,
      allThreadMessages,
      emojiContainer,
      onMoveToParentMessage,
      onHeaderActionClick,
      isMuted,
      isChannelFrozen,
      onBeforeDownloadFileMessage,
      filterEmojiCategoryIds,
    },
    actions: {
      toggleReaction,
      updateMessage,
      deleteMessage,
    },
  } = useThread();
  const { isMobile } = useMediaQueryContext();

  const isMenuMounted = useElementObserver(
    `#${getObservingId(parentMessage.messageId)}.${MENU_OBSERVING_CLASS_NAME}`,
    [
      document.getElementById(MENU_ROOT_ID),
      document.getElementById(EMOJI_MENU_ROOT_ID),
    ],
  );
  const [showRemove, setShowRemove] = useState(false);
  const [showFileViewer, setShowFileViewer] = useState(false);
  const isReactionEnabled = getIsReactionEnabled({
    channel: currentChannel,
    config,
  });
  const isMentionEnabled = groupChannel.enableMention;
  const replyType = getCaseResolvedReplyType(groupChannel.replyType).upperCase;
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

  const handleOnDownloadClick = async (e: React.MouseEvent) => {
    if (!onBeforeDownloadFileMessage) return;

    try {
      const allowDownload = await onBeforeDownloadFileMessage({ message: parentMessage as FileMessage });
      if (!allowDownload) {
        e.preventDefault();
        logger?.info?.('ParentMessageInfo: Not allowed to download.');
      }
    } catch (err) {
      logger?.error?.('ParentMessageInfo: Error occurred while determining download continuation:', err);
    }
  };

  // User Profile
  const avatarRef = useRef(null);
  const { disableUserProfile, renderUserProfile } = useUserProfileContext();

  if (showEditInput && parentMessage?.isUserMessage?.()) {
    return (
      <>
        {
          displaySuggestedMentionList && (
            <SuggestedMentionList
              className="parent-message-info--suggested-mention-list"
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
          channel={currentChannel}
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
          renderUserProfile
            ? renderUserProfile({
              user: parentMessage?.sender,
              close: closeDropdown,
              currentUserId: userId,
              avatarRef,
            })
            : (
              <MenuItems
                parentRef={avatarRef}
                parentContainRef={avatarRef}
                closeDropdown={closeDropdown}
                style={{ paddingTop: '0px', paddingBottom: '0px' }}
              >
                <ConnectedUserProfile
                  user={parentMessage?.sender}
                  currentUserId={userId}
                  onSuccess={closeDropdown}
                />
              </MenuItems>
            )
        )}
      />
      <div className="sendbird-parent-message-info__content">
        <div className="sendbird-parent-message-info__content__info">
          <Label
            className={
              isReactionEnabled
                ? 'sendbird-parent-message-info__content__info__sender-name--use-reaction'
                : 'sendbird-parent-message-info__content__info__sender-name'
            }
            type={LabelTypography.CAPTION_2}
            color={LabelColors.ONBACKGROUND_2}
          >
            {
              currentChannel?.members?.find((member) => member?.userId === parentMessage?.sender?.userId)
                ?.nickname || getSenderName?.(parentMessage as SendableMessageType)
            }
          </Label>
          <Label
            className="sendbird-parent-message-info__content__info__sent-at"
            type={LabelTypography.CAPTION_3}
            color={LabelColors.ONBACKGROUND_2}
          >
            {format(parentMessage?.createdAt || 0, stringSet.DATE_FORMAT__MESSAGE_CREATED_AT, { locale: dateLocale })}
          </Label>
        </div>
        {/* message content body */}
        <ParentMessageInfoItem
          message={parentMessage}
          showFileViewer={setShowFileViewer}
          onBeforeDownloadFileMessage={onBeforeDownloadFileMessage}
        />
      </div>
      {/* context menu */}
      {!isMobile && (
        <div className='sendbird-parent-message-info__menu-container'>
          {
            renderMessageMenu({
              className: classnames('sendbird-parent-message-info__context-menu', isReactionEnabled && 'use-reaction', isMenuMounted && 'sendbird-mouse-hover'),
              channel: currentChannel,
              message: parentMessage,
              isByMe: userId === parentMessage?.sender?.userId,
              disableDeleteMessage: allThreadMessages.length > 0,
              replyType: replyType,
              showEdit: setShowEditInput,
              showRemove: setShowRemove,
              onMoveToParentMessage: () => {
                onMoveToParentMessage?.({ message: parentMessage, channel: currentChannel });
              },
              deleteMessage: deleteMessage,
            })
          }
          {isReactionEnabled && (
            renderEmojiMenu({
              className: classnames('sendbird-parent-message-info__reaction-menu', isMenuMounted && 'sendbird-mouse-hover'),
              message: parentMessage,
              userId: userId,
              emojiContainer: emojiContainer,
              toggleReaction: toggleReaction,
              filterEmojiCategoryIds,
            })
          )}
        </div>
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
          onDownloadClick={handleOnDownloadClick}
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
          deleteMessage={deleteMessage}
          deleteMenuState={
            allThreadMessages?.length === 0
              ? 'ACTIVE'
              : 'HIDE'
          }
          isReactionEnabled={isReactionEnabled}
          isByMe={isByMe}
          emojiContainer={emojiContainer}
          showEdit={setShowEditInput}
          showRemove={setShowRemove}
          toggleReaction={toggleReaction}
          isOpenedFromThread
          onDownloadClick={handleOnDownloadClick}
        />
      )}
    </div>
  );
}
