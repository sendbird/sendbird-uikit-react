import React, { useState, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import './index.scss';

import { UserProfileContext } from '../../../lib/UserProfileContext';
import Avatar from '../../../ui/Avatar';
import IconButton from '../../../ui/IconButton';
import Icon, { IconTypes, IconColors } from '../../../ui/Icon';
import TextButton from '../../../ui/TextButton';
import UserProfile from '../../../ui/UserProfile';
import Label, { LabelColors, LabelTypography } from '../../../ui/Label';
import MessageStatus from '../../../ui/MessageStatus';
import ContextMenu, { MenuItem, MenuItems } from '../../../ui/ContextMenu';
import EmojiReactions from '../EmojiReactions';

import { getSenderProfileUrl, getSenderName, getMessageCreatedAt } from '../../../utils/utils';
import {
  truncate,
  getIsSentFromStatus,
  getIsSentFromSendingStatus,
} from './utils';
import useMouseHover from '../../../hooks/onMouseHover';
import { LocalizationContext } from '../../../lib/LocalizationContext';

const MAX_TRUNCATE_LENGTH = 40;
const GROUPAING_PADDING = '1px';
const NORMAL_PADDING = '8px';
const noop = () => { };

function checkFileType(fileUrl) {
  let result = null;
  const imageFile = /(\.gif|\.jpg|\.jpeg|\.txt|\.pdf)$/i;
  const audioFile = /(\.mp3)$/i;
  if (imageFile.test(fileUrl)) {
    result = IconTypes.FILE_DOCUMENT;
  } else if (audioFile.test(fileUrl)) {
    result = IconTypes.FILE_AUDIO;
  }
  return result;
}

const MessageSwitch = ({
  message,
  userId,
  disabled,
  isByMe,
  showRemove,
  status,
  resendMessage,
  useReaction,
  emojiAllMap,
  membersMap,
  toggleReaction,
  memoizedEmojiListItems,
  chainTop,
  chainBottom,
}) => (
  <div className={`sendbird-file-message${isByMe ? '--outgoing' : '--incoming'}`}>
    {
      isByMe
        ? (
          <OutgoingFileMessage
            message={message}
            userId={userId}
            disabled={disabled}
            showRemove={showRemove}
            status={status}
            resendMessage={resendMessage}
            useReaction={useReaction}
            emojiAllMap={emojiAllMap}
            membersMap={membersMap}
            toggleReaction={toggleReaction}
            memoizedEmojiListItems={memoizedEmojiListItems}
            chainTop={chainTop}
            chainBottom={chainBottom}
          />
        )
        : (
          <IncomingFileMessage
            userId={userId}
            message={message}
            useReaction={useReaction}
            emojiAllMap={emojiAllMap}
            membersMap={membersMap}
            toggleReaction={toggleReaction}
            memoizedEmojiListItems={memoizedEmojiListItems}
            chainTop={chainTop}
            chainBottom={chainBottom}
          />
        )
    }
  </div>
);

MessageSwitch.propTypes = {
  message: PropTypes.shape({}),
  userId: PropTypes.string,
  isByMe: PropTypes.bool,
  disabled: PropTypes.bool,
  showRemove: PropTypes.func,
  resendMessage: PropTypes.func,
  status: PropTypes.string.isRequired,
  useReaction: PropTypes.bool.isRequired,
  emojiAllMap: PropTypes.instanceOf(Map),
  membersMap: PropTypes.instanceOf(Map),
  toggleReaction: PropTypes.func,
  memoizedEmojiListItems: PropTypes.func,
  chainTop: PropTypes.bool,
  chainBottom: PropTypes.bool,
};

MessageSwitch.defaultProps = {
  message: {},
  isByMe: false,
  disabled: false,
  showRemove: noop,
  resendMessage: noop,
  userId: '',
  emojiAllMap: new Map(),
  membersMap: new Map(),
  toggleReaction: noop,
  memoizedEmojiListItems: () => '',
  chainTop: false,
  chainBottom: false,
};

export function OutgoingFileMessage({
  message,
  userId,
  status,
  showRemove,
  disabled,
  resendMessage,
  useReaction,
  emojiAllMap,
  membersMap,
  toggleReaction,
  memoizedEmojiListItems,
  chainTop,
  chainBottom,
}) {
  const { url } = message;
  const openFileUrl = () => { window.open(url); };
  const messageRef = useRef(null);
  const parentContainRef = useRef(null);
  const menuRef = useRef(null);
  const reactionAddButtonRef = useRef(null);
  const [mousehover, setMousehover] = useState(false);
  const [moreActive, setMoreActive] = useState(false);
  const [menuDisplaying, setMenuDisplaying] = useState(false);
  const MemoizedEmojiListItems = memoizedEmojiListItems;
  const isMessageSent = getIsSentFromStatus(status);
  const showReactionAddButton = useReaction
    && emojiAllMap
    && (emojiAllMap.size > 0)
    && getIsSentFromSendingStatus(message);
  const showEmojiReactions = isMessageSent
    && useReaction
    && message.reactions
    && (message.reactions.length > 0)
    && getIsSentFromSendingStatus(message);

  const handleMoreIconClick = () => {
    setMoreActive(true);
  };
  const handleMoreIconBlur = () => {
    setMoreActive(false);
  };

  useMouseHover({
    ref: messageRef,
    setHover: setMousehover,
  });

  return (
    <div
      className="sendbird-file-message__outgoing"
      ref={messageRef}
      style={{
        paddingTop: chainTop ? GROUPAING_PADDING : NORMAL_PADDING,
        paddingBottom: chainBottom ? GROUPAING_PADDING : NORMAL_PADDING,
      }}
    >
      <div className="sendbird-file-message__outgoing--inner">
        <div className="sendbird-file-message__outgoing__left-padding">
          <div
            className="sendbird-file-message__outgoing__left-padding__more"
            ref={parentContainRef}
          >
            <ContextMenu
              menuTrigger={(toggleDropdown) => (
                <IconButton
                  ref={menuRef}
                  width="32px"
                  height="32px"
                  onClick={() => {
                    toggleDropdown();
                    handleMoreIconClick();
                    setMenuDisplaying(true);
                  }}
                  onBlur={() => {
                    handleMoreIconBlur();
                  }}
                >
                  <Icon
                    type={IconTypes.MORE}
                    fillColor={IconColors.CONTENT_INVERSE}
                    width="24px"
                    height="24px"
                  />
                </IconButton>
              )}
              menuItems={(close) => {
                const closeDropdown = () => {
                  close();
                  setMenuDisplaying(false);
                };
                return (
                  <MenuItems
                    /**
                     * parentRef: For catching location(x, y) of MenuItems
                     * parentContainRef: For toggling more options(menus & reactions)
                     */
                    parentRef={menuRef}
                    parentContainRef={parentContainRef}
                    closeDropdown={closeDropdown}
                    openLeft
                  >
                    {
                      (message && message.isResendable && message.isResendable()) && (
                        <MenuItem
                          onClick={() => {
                            resendMessage(message);
                            closeDropdown();
                          }}
                        >
                          Resend
                        </MenuItem>
                      )
                    }
                    <MenuItem onClick={() => {
                      if (disabled) { return; }
                      showRemove(true);
                      closeDropdown();
                    }}
                    >
                      Delete
                    </MenuItem>
                  </MenuItems>
                );
              }}
            />
            {
              showReactionAddButton && (
                <ContextMenu
                  menuTrigger={(toggleDropdown) => (
                    <IconButton
                      ref={reactionAddButtonRef}
                      width="32px"
                      height="32px"
                      onClick={() => {
                        toggleDropdown();
                        handleMoreIconClick();
                        setMenuDisplaying(true);
                      }}
                      onBlur={() => {
                        handleMoreIconBlur();
                      }}
                    >
                      <Icon
                        type={IconTypes.EMOJI_MORE}
                        fillColor={IconColors.CONTENT_INVERSE}
                        width="24px"
                        height="24px"
                      />
                    </IconButton>
                  )}
                  menuItems={(close) => {
                    const closeDropdown = () => {
                      close();
                      setMenuDisplaying(false);
                    };
                    return (
                      <MemoizedEmojiListItems
                        message={message}
                        parentRef={reactionAddButtonRef}
                        parentContainRef={parentContainRef}
                        closeDropdown={closeDropdown}
                        spaceFromTrigger={{ y: 2 }}
                      />
                    );
                  }}
                />
              )
            }
          </div>
          {
            !chainBottom && !(mousehover || moreActive || menuDisplaying) && (
              <div className="sendbird-file-message__outgoing__left-padding__status">
                <MessageStatus
                  message={message}
                  status={status}
                />
              </div>
            )
          }
        </div>
        <div className="sendbird-file-message__outgoing__tooltip">
          <div className="sendbird-file-message__outgoing__tooltip__inner">
            {
              checkFileType(url)
                ? (
                  <div className="sendbird-file-message__outgoing__tooltip__icon-box">
                    <Icon
                      className="sendbird-file-message__outgoing__tooltip__icon-box__icon"
                      type={checkFileType(url)}
                      fillColor={IconColors.PRIMARY}
                      width="24px"
                      height="24px"
                    />
                  </div>
                )
                : null
            }
            <TextButton
              className="sendbird-file-message__outgoing__tooltip__text"
              onClick={openFileUrl}
              color={LabelColors.ONCONTENT_1}
            >
              <Label
                type={LabelTypography.BODY_1}
                color={LabelColors.ONCONTENT_1}
              >
                {truncate(message.name || message.url, MAX_TRUNCATE_LENGTH)}
              </Label>
            </TextButton>
          </div>
          {
            showEmojiReactions && (
              <EmojiReactions
                className="sendbird-file-message__outgoing__tooltip__emoji-reactions"
                userId={userId}
                message={message}
                emojiAllMap={emojiAllMap}
                membersMap={membersMap}
                toggleReaction={toggleReaction}
                memoizedEmojiListItems={memoizedEmojiListItems}
              />
            )
          }
        </div>
      </div>
    </div>
  );
}

export function IncomingFileMessage({
  message,
  userId,
  useReaction,
  emojiAllMap,
  membersMap,
  toggleReaction,
  memoizedEmojiListItems,
  chainTop,
  chainBottom,
}) {
  const openFileUrl = () => { window.open(message.url); };
  const messageRef = useRef(null);
  const {
    disableUserProfile,
    renderUserProfile,
  } = React.useContext(UserProfileContext);
  const parentContainRef = useRef(null);
  const avatarRef = useRef(null);
  const reactionAddButtonRef = useRef(null);
  const [mousehover, setMousehover] = useState(false);
  const [moreActive, setMoreActive] = useState(false);
  const [menuDisplaying, setMenuDisplaying] = useState(false);
  const { dateLocale } = useContext(LocalizationContext);
  const showReactionAddButton = useReaction && emojiAllMap && (emojiAllMap.size > 0);
  const MemoizedEmojiListItems = memoizedEmojiListItems;

  const handleMoreIconClick = () => {
    setMoreActive(true);
  };
  const handleMoreIconBlur = () => {
    setMoreActive(false);
  };

  useMouseHover({
    ref: messageRef,
    setHover: setMousehover,
  });

  return (
    <div
      className="sendbird-file-message__incoming"
      ref={messageRef}
      style={{
        paddingTop: chainTop ? GROUPAING_PADDING : NORMAL_PADDING,
        paddingBottom: chainBottom ? GROUPAING_PADDING : NORMAL_PADDING,
      }}
    >
      <div className="sendbird-file-message__incoming--inner">
        <div className="sendbird-file-message__incoming__body">
          {
            !chainBottom && (
              <ContextMenu
                menuTrigger={(toggleDropdown) => (
                  <Avatar
                    ref={avatarRef}
                    onClick={() => {
                      if (!disableUserProfile) {
                        toggleDropdown();
                      }
                    }}
                    className="sendbird-file-message__incoming__body__avatar"
                    src={getSenderProfileUrl(message)}
                    width="28px"
                    height="28px"
                  />
                )}
                menuItems={(closeDropdown) => (
                  <MenuItems
                    /**
                     * parentRef: For catching location(x, y) of MenuItems
                     * parentContainRef: For toggling more options(menus & reactions)
                     */
                    parentRef={avatarRef}
                    parentContainRef={avatarRef}
                    closeDropdown={closeDropdown}
                    style={{ paddingTop: 0, paddingBottom: 0 }}
                  >
                    {
                      renderUserProfile
                        ? renderUserProfile({
                          user: message.sender,
                          close: closeDropdown,
                        })
                        : (
                          <UserProfile
                            user={message.sender}
                            onSuccess={closeDropdown}
                          />
                        )
                    }
                  </MenuItems>
                )}
              />
            )
          }
          {
            !chainTop && (
              <Label
                className="sendbird-file-message__incoming__body__sender-name"
                type={LabelTypography.CAPTION_2}
                color={LabelColors.ONBACKGROUND_2}
              >
                {getSenderName(message)}
              </Label>
            )
          }
          <div className="sendbird-file-message__incoming__body__tooltip">
            <div className="sendbird-file-message__incoming__body__tooltip__inner">
              {
                checkFileType(message.url)
                  ? (
                    <div className="sendbird-file-message__incoming__body__tooltip__icon-box">
                      <Icon
                        className="sendbird-file-message__incoming__body__tooltip__icon-box__icon"
                        type={checkFileType(message.url)}
                        fillColor={IconColors.PRIMARY}
                        width="24px"
                        height="24px"
                      />
                    </div>
                  )
                  : null
              }
              <TextButton
                className="sendbird-file-message__incoming__body__tooltip__text"
                onClick={openFileUrl}
              >
                <Label
                  type={LabelTypography.BODY_1}
                  color={LabelColors.ONBACKGROUND_1}
                >
                  {truncate(message.name || message.url, MAX_TRUNCATE_LENGTH)}
                </Label>
              </TextButton>
            </div>
            {
              (useReaction && message.reactions && (message.reactions.length > 0)) && (
                <EmojiReactions
                  className="sendbird-file-message__incoming__body__tooltip__emoji-reactions"
                  userId={userId}
                  message={message}
                  emojiAllMap={emojiAllMap}
                  membersMap={membersMap}
                  toggleReaction={toggleReaction}
                  memoizedEmojiListItems={memoizedEmojiListItems}
                />
              )
            }
          </div>
        </div>
        <div className="sendbird-file-message__incoming__right-padding">
          <div
            className="sendbird-file-message__incoming__right-padding__more"
            ref={parentContainRef}
            style={{ top: chainTop ? 6 : 18 }}
          >
            {
              showReactionAddButton && (
                <ContextMenu
                  menuTrigger={(toggleDropdown) => (
                    <IconButton
                      ref={reactionAddButtonRef}
                      width="32px"
                      height="32px"
                      onClick={() => {
                        toggleDropdown();
                        handleMoreIconClick();
                        setMenuDisplaying(true);
                      }}
                      onBlur={() => {
                        handleMoreIconBlur();
                      }}
                    >
                      <Icon
                        width="24px"
                        height="24px"
                        type={IconTypes.EMOJI_MORE}
                        fillColor={IconColors.CONTENT_INVERSE}
                      />
                    </IconButton>
                  )}
                  menuItems={(close) => {
                    const closeDropdown = () => {
                      close();
                      setMenuDisplaying(false);
                    };
                    return (
                      <MemoizedEmojiListItems
                        message={message}
                        parentRef={reactionAddButtonRef}
                        parentContainRef={parentContainRef}
                        closeDropdown={closeDropdown}
                        spaceFromTrigger={{ y: 2 }}
                      />
                    );
                  }}
                />
              )
            }
          </div>
          {
            !chainBottom && !(mousehover || moreActive || menuDisplaying) && (
              <Label
                className="sendbird-file-message__incoming__right-padding__sent-at"
                type={LabelTypography.CAPTION_3}
                color={LabelColors.ONBACKGROUND_2}
              >
                {format(message?.createdAt, 'p', dateLocale)}
              </Label>
            )
          }
        </div>
      </div>
    </div>
  );
}

OutgoingFileMessage.propTypes = {
  message: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.array,
    PropTypes.object,
  ])),
  userId: PropTypes.string,
  status: PropTypes.string,
  showRemove: PropTypes.func,
  resendMessage: PropTypes.func,
  useReaction: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  emojiAllMap: PropTypes.instanceOf(Map),
  membersMap: PropTypes.instanceOf(Map),
  toggleReaction: PropTypes.func,
  memoizedEmojiListItems: PropTypes.func,
  chainTop: PropTypes.bool.isRequired,
  chainBottom: PropTypes.bool.isRequired,
};

OutgoingFileMessage.defaultProps = {
  status: '',
  showRemove: noop,
  resendMessage: noop,
  message: {},
  userId: '',
  disabled: false,
  emojiAllMap: new Map(),
  membersMap: new Map(),
  toggleReaction: noop,
  memoizedEmojiListItems: () => '',
};

IncomingFileMessage.propTypes = {
  message: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.array,
    PropTypes.object,
  ])),
  userId: PropTypes.string,
  useReaction: PropTypes.bool.isRequired,
  emojiAllMap: PropTypes.instanceOf(Map),
  membersMap: PropTypes.instanceOf(Map),
  toggleReaction: PropTypes.func,
  memoizedEmojiListItems: PropTypes.func,
  chainTop: PropTypes.bool.isRequired,
  chainBottom: PropTypes.bool.isRequired,
};

IncomingFileMessage.defaultProps = {
  message: {},
  userId: '',
  emojiAllMap: new Map(),
  membersMap: new Map(),
  toggleReaction: noop,
  memoizedEmojiListItems: () => '',
};

export default MessageSwitch;
