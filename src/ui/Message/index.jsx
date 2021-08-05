import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

import { UserProfileContext } from '../../lib/UserProfileContext';
import './index.scss';
import UserProfile from '../UserProfile';
import Avatar from '../Avatar/index';
import Icon, { IconTypes, IconColors } from '../Icon';
import IconButton from '../IconButton';
import MessageStatus from '../MessageStatus';
import Label, { LabelTypography, LabelColors } from '../Label';
import ContextMenu, { MenuItem, MenuItems } from '../ContextMenu';
import EmojiReactions from '../EmojiReactions';
import {
  copyToClipboard,
  getMessageCreatedAt,
  getSenderName,
  getSenderProfileUrl,
  getIsSentFromStatus,
  getIsSentFromSendingStatus,
} from './utils';
import useMemoizedMessageText from './memoizedMessageText';
import useMouseHover from '../../hooks/onMouseHover';

const noop = () => { };
const GROUPING_PADDING = '1px';
const NORMAL_PADDING = '8px';

export default function Message(props) {
  const {
    className,
    message,
    isByMe,
    userId,
    resendMessage,
    disabled,
    showEdit,
    showRemove,
    status,
    useReaction,
    emojiAllMap,
    membersMap,
    toggleReaction,
    memoizedEmojiListItems,
    chainTop,
    chainBottom,
  } = props;

  if (!message) return null;

  const outgoingMemoizedMessageText = useMemoizedMessageText({
    className: 'sendbird-user-message-word',
    message: message.message,
    updatedAt: message.updatedAt,
  });
  const incomingMemoizedMessageText = useMemoizedMessageText({
    className: 'sendbird-user-message-word',
    message: message.message,
    updatedAt: message.updatedAt,
    incoming: true,
  });

  return (
    <div
      className={[
        ...(Array.isArray(className) ? className : [className]),
        'sendbird-message',
        `sendbird-message${isByMe ? '--outgoing' : '--incoming'}`,
      ].join(' ')}
    >
      {
        isByMe
          ? (
            <OutgoingUserMessage
              userId={userId}
              message={message}
              resendMessage={resendMessage}
              disabled={disabled}
              showEdit={showEdit}
              showRemove={showRemove}
              status={status}
              useReaction={useReaction}
              emojiAllMap={emojiAllMap}
              membersMap={membersMap}
              toggleReaction={toggleReaction}
              memoizedMessageText={outgoingMemoizedMessageText}
              memoizedEmojiListItems={memoizedEmojiListItems}
              chainTop={chainTop}
              chainBottom={chainBottom}
            />
          )
          : (
            <IncomingUserMessage
              userId={userId}
              message={message}
              useReaction={useReaction}
              emojiAllMap={emojiAllMap}
              membersMap={membersMap}
              toggleReaction={toggleReaction}
              memoizedMessageText={incomingMemoizedMessageText}
              memoizedEmojiListItems={memoizedEmojiListItems}
              chainTop={chainTop}
              chainBottom={chainBottom}
            />
          )
      }
    </div>
  );
}

Message.propTypes = {
  isByMe: PropTypes.bool,
  disabled: PropTypes.bool,
  userId: PropTypes.string,
  message: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.array,
    PropTypes.object,
  ])).isRequired,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  showEdit: PropTypes.func,
  status: PropTypes.string,
  showRemove: PropTypes.func,
  resendMessage: PropTypes.func,
  useReaction: PropTypes.bool.isRequired,
  emojiAllMap: PropTypes.instanceOf(Map),
  membersMap: PropTypes.instanceOf(Map),
  toggleReaction: PropTypes.func,
  memoizedEmojiListItems: PropTypes.func,
  chainTop: PropTypes.bool,
  chainBottom: PropTypes.bool,
};

Message.defaultProps = {
  isByMe: false,
  disabled: false,
  userId: '',
  resendMessage: noop,
  className: '',
  showEdit: noop,
  showRemove: noop,
  status: '',
  emojiAllMap: new Map(),
  membersMap: new Map(),
  toggleReaction: noop,
  memoizedEmojiListItems: () => '',
  chainTop: false,
  chainBottom: false,
};

function OutgoingUserMessage({
  userId,
  message,
  showEdit,
  disabled,
  showRemove,
  status,
  resendMessage,
  useReaction,
  emojiAllMap,
  membersMap,
  toggleReaction,
  memoizedMessageText,
  memoizedEmojiListItems,
  chainTop,
  chainBottom,
}) {
  const MemoizedMessageText = memoizedMessageText;
  const MemoizedEmojiListItems = memoizedEmojiListItems;
  // TODO: when message.requestState is succeeded, consider if it's SENT or DELIVERED
  const messageRef = useRef(null);
  const parentRefReactions = useRef(null);
  const parentRefMenus = useRef(null);
  const parentContainRef = useRef(null);
  const [mousehover, setMousehover] = useState(false);
  const [moreActive, setMoreActive] = useState(false);
  const [menuDisplaying, setMenuDisplaying] = useState(false);

  const isMessageSent = getIsSentFromStatus(status);
  const showReactionAddButton = useReaction
    && (emojiAllMap.size > 0)
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
      className="sendbird-user-message--outgoing"
      ref={messageRef}
      style={{
        paddingTop: chainTop ? GROUPING_PADDING : NORMAL_PADDING,
        paddingBottom: chainBottom ? GROUPING_PADDING : NORMAL_PADDING,
      }}
    >
      <div className="sendbird-user-message--inner">
        <div className="sendbird-user-message__left-padding">
          <div className="sendbird-user-message__more" ref={parentContainRef}>
            <ContextMenu
              menuTrigger={(toggleDropdown) => (
                <IconButton
                  className="sendbird-user-message__more__menu"
                  ref={parentRefMenus}
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
                    parentRef={parentRefMenus}
                    parentContainRef={parentContainRef}
                    closeDropdown={closeDropdown}
                    openLeft
                  >
                    {
                      isMessageSent && (
                        <MenuItem
                          className="sendbird-user-message--copy"
                          onClick={() => { copyToClipboard(message.message); closeDropdown(); }}
                        >
                          Copy
                        </MenuItem>
                      )
                    }
                    {
                      isMessageSent && (
                        <MenuItem
                          onClick={() => {
                            if (disabled) { return; }
                            showEdit(true);
                            closeDropdown();
                          }}
                        >
                          Edit
                        </MenuItem>
                      )
                    }
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
                    <MenuItem
                      onClick={() => {
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
              (isMessageSent && showReactionAddButton)
              && (
                <ContextMenu
                  menuTrigger={(toggleDropdown) => (
                    <IconButton
                      className="sendbird-user-message__more__add-reaction"
                      ref={parentRefReactions}
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
                        parentRef={parentRefReactions}
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
              <div className="sendbird-user-message__status">
                <MessageStatus
                  message={message}
                  status={status}
                />
              </div>
            )
          }
        </div>
        <div className="sendbird-user-message__text-balloon">
          <div className="sendbird-user-message__text-balloon__inner">
            <div className="sendbird-user-message__text-balloon__inner__text-place">
              <Label
                className="sendbird-user-message__text-balloon__inner__text-place__text"
                type={LabelTypography.BODY_1}
                color={LabelColors.ONCONTENT_1}
              >
                <MemoizedMessageText />
              </Label>
            </div>
            {
              (useReaction && message.reactions && message.reactions.length > 0)
              && (
                <EmojiReactions
                  className="sendbird-user-message__text-balloon__inner__emoji-reactions"
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
    </div>
  );
}

function IncomingUserMessage({
  userId,
  message,
  useReaction,
  emojiAllMap,
  membersMap,
  toggleReaction,
  memoizedMessageText,
  memoizedEmojiListItems,
  chainTop,
  chainBottom,
}) {
  const MemoizedMessageText = memoizedMessageText;
  const MemoizedEmojiListItems = memoizedEmojiListItems;
  const messageRef = useRef(null);
  const parentRefReactions = useRef(null);
  const parentRefMenus = useRef(null);
  const parentContainRef = useRef(null);
  const avatarRef = useRef(null);
  const {
    disableUserProfile,
    renderUserProfile,
  } = React.useContext(UserProfileContext);
  const [mousehover, setMousehover] = useState(false);
  const [moreActive, setMoreActive] = useState(false);
  const [menuDisplaying, setMenuDisplaying] = useState(false);
  const showReactionAddButton = useReaction && emojiAllMap && (emojiAllMap.size > 0);
  const showEmojiReactions = (useReaction && message.reactions && message.reactions.length > 0);

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
      ref={messageRef}
      className="sendbird-user-message--incoming"
      style={{
        paddingTop: chainTop ? GROUPING_PADDING : NORMAL_PADDING,
        paddingBottom: chainBottom ? GROUPING_PADDING : NORMAL_PADDING,
      }}
    >
      <div className="sendbird-user-message--inner">
        <div className="sendbird-user-message--body">
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
                    className="sendbird-user-message__avatar"
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
                className="sendbird-user-message__sender-name"
                type={LabelTypography.CAPTION_2}
                color={LabelColors.ONBACKGROUND_2}
              >
                {getSenderName(message)}
              </Label>
            )
          }
          <div className="sendbird-user-message__text-balloon">
            <div className="sendbird-user-message__text-balloon__inner">
              <div className="sendbird-user-message__text-balloon__inner__text-place">
                <Label
                  className="sendbird-user-message__text-balloon__inner__text-place__text"
                  type={LabelTypography.BODY_1}
                  color={LabelColors.ONBACKGROUND_1}
                >
                  <MemoizedMessageText />
                </Label>
              </div>
              {
                showEmojiReactions && (
                  <EmojiReactions
                    className="sendbird-user-message__text-balloon__inner__emoji-reactions"
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
        <div className="sendbird-user-message__right-padding">
          <div
            className="sendbird-user-message__more"
            ref={parentContainRef}
            style={{ top: chainTop ? '6px' : '22px' }}
          >
            {
              showReactionAddButton
              && (
                <ContextMenu
                  menuTrigger={(toggleDropdown) => (
                    <IconButton
                      ref={parentRefReactions}
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
                        parentRef={parentRefReactions}
                        parentContainRef={parentContainRef}
                        closeDropdown={closeDropdown}
                        message={message}
                        spaceFromTrigger={{ y: 2 }}
                      />
                    );
                  }}
                />
              )
            }
            <ContextMenu
              menuTrigger={(toggleDropdown) => (
                <IconButton
                  ref={parentRefMenus}
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
                    type={IconTypes.MORE}
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
                  <MenuItems
                    parentRef={parentRefMenus}
                    parentContainRef={parentContainRef}
                    closeDropdown={closeDropdown}
                  >
                    <MenuItem
                      className="sendbird-user-message--copy"
                      onClick={() => { copyToClipboard(message.message); closeDropdown(); }}
                    >
                      Copy
                    </MenuItem>
                  </MenuItems>
                );
              }}
            />
          </div>
          {
            !chainBottom && !(mousehover || moreActive || menuDisplaying) && (
              <Label
                className="sendbird-user-message__sent-at"
                type={LabelTypography.CAPTION_3}
                color={LabelColors.ONBACKGROUND_2}
              >
                {getMessageCreatedAt(message)}
              </Label>
            )
          }
        </div>
      </div>
    </div>
  );
}

IncomingUserMessage.propTypes = {
  userId: PropTypes.string.isRequired,
  message: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.array,
    PropTypes.object,
  ])),
  useReaction: PropTypes.bool.isRequired,
  emojiAllMap: PropTypes.instanceOf(Map),
  membersMap: PropTypes.instanceOf(Map),
  toggleReaction: PropTypes.func,
  memoizedMessageText: PropTypes.func.isRequired,
  memoizedEmojiListItems: PropTypes.func,
  chainTop: PropTypes.bool.isRequired,
  chainBottom: PropTypes.bool.isRequired,
};

IncomingUserMessage.defaultProps = {
  message: {},
  emojiAllMap: new Map(),
  membersMap: new Map(),
  toggleReaction: noop,
  memoizedEmojiListItems: () => '',
};

OutgoingUserMessage.propTypes = {
  userId: PropTypes.string.isRequired,
  message: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.array,
    PropTypes.object,
  ])),
  showEdit: PropTypes.func,
  showRemove: PropTypes.func,
  disabled: PropTypes.bool,
  resendMessage: PropTypes.func,
  status: PropTypes.string.isRequired,
  useReaction: PropTypes.bool.isRequired,
  emojiAllMap: PropTypes.instanceOf(Map),
  membersMap: PropTypes.instanceOf(Map),
  toggleReaction: PropTypes.func,
  memoizedMessageText: PropTypes.func.isRequired,
  memoizedEmojiListItems: PropTypes.func,
  chainTop: PropTypes.bool.isRequired,
  chainBottom: PropTypes.bool.isRequired,
};

OutgoingUserMessage.defaultProps = {
  message: {},
  resendMessage: noop,
  showEdit: noop,
  showRemove: noop,
  disabled: false,
  emojiAllMap: new Map(),
  membersMap: new Map(),
  toggleReaction: noop,
  memoizedEmojiListItems: () => '',
};
