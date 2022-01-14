import React, { useState, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';

import {
  getSenderName,
  copyToClipboard,
  checkOGIsEnalbed,
  getIsSentFromStatus,
  getSenderProfileUrl,
  getIsSentFromSendingStatus,
} from './utils';
import useMemoizedMessageText from './memoizedMessageText';
import './index.scss';
import { UserProfileContext } from '../../../lib/UserProfileContext';

import UserProfile from '../../../ui/UserProfile';
import IconButton from '../../../ui/IconButton';
import ImageRenderer from '../../../ui/ImageRenderer';
import MessageStatus from '../../../ui/MessageStatus';
import Icon, { IconTypes, IconColors } from '../../../ui/Icon';
import Label, { LabelTypography, LabelColors } from '../../../ui/Label';
import ContextMenu, { MenuItem, MenuItems } from '../../../ui/ContextMenu';
import Avatar from '../../../ui/Avatar';

import useMouseHover from '../../../hooks/onMouseHover';
import { LocalizationContext } from '../../../lib/LocalizationContext';

import EmojiReactions from '../EmojiReactions';

const GROUPING_PADDING = '1px';
const NORAML_PADDING = '8px';

const OGMessageSwitch = ({
  className,
  isByMe,
  userId,
  status,
  message,
  disabled,
  showEdit,
  chainTop,
  membersMap,
  showRemove,
  useReaction,
  emojiAllMap,
  chainBottom,
  resendMessage,
  toggleReaction,
  memoizedEmojiListItems,
}) => {
  const { ogMetaData } = message;

  const openLink = () => {
    if (checkOGIsEnalbed(message)) {
      const { url } = ogMetaData;
      window.open(url);
    }
  };

  const outoingMemoizedMessageText = useMemoizedMessageText({
    message: message.message,
    updatedAt: message.updatedAt,
    className: 'sendbird-og-message-word',
  });
  const incomingMemoizedMessageText = useMemoizedMessageText({
    message: message.message,
    updatedAt: message.updatedAt,
    className: 'sendbird-og-message-word',
    incoming: true,
  });

  return (
    <div
      className={[
        ...(Array.isArray(className) ? className : [className]),
        'sendbird-og-message',
        `sendbird-og-message${isByMe ? '--outgoing' : '--incoming'}`,
      ].join(' ')}
    >
      {
        isByMe
          ? (
            <OutgoingOGMessage
              status={status}
              userId={userId}
              message={message}
              disabled={disabled}
              openLink={openLink}
              showEdit={showEdit}
              chainTop={chainTop}
              showRemove={showRemove}
              membersMap={membersMap}
              chainBottom={chainBottom}
              useReaction={useReaction}
              emojiAllMap={emojiAllMap}
              resendMessage={resendMessage}
              toggleReaction={toggleReaction}
              memoizedMessageText={outoingMemoizedMessageText}
              memoizedEmojiListItems={memoizedEmojiListItems}
            />
          )
          : (
            <IncomingOGMessage
              userId={userId}
              message={message}
              openLink={openLink}
              chainTop={chainTop}
              membersMap={membersMap}
              chainBottom={chainBottom}
              useReaction={useReaction}
              emojiAllMap={emojiAllMap}
              toggleReaction={toggleReaction}
              memoizedMessageText={incomingMemoizedMessageText}
              memoizedEmojiListItems={memoizedEmojiListItems}
            />
          )
      }
    </div>
  );
};

function OutgoingOGMessage(props) {
  const {
    status,
    userId,
    message,
    disabled,
    openLink,
    showEdit,
    chainTop,
    showRemove,
    membersMap,
    chainBottom,
    emojiAllMap,
    useReaction,
    resendMessage,
    toggleReaction,
    memoizedMessageText,
    memoizedEmojiListItems,
  } = props;
  const {
    ogMetaData,
  } = message;
  const {
    defaultImage,
  } = ogMetaData;
  const MemoizedMessageText = memoizedMessageText;
  const MemoizedEmojiListItems = memoizedEmojiListItems;
  const { stringSet } = useContext(LocalizationContext);
  const isMessageSent = getIsSentFromStatus(status);
  const showEmojiReactions = useReaction
    && message.reactions
    && message.reactions.length > 0
    && getIsSentFromSendingStatus(message);

  const messageRef = useRef(null);
  const parentContainRef = useRef(null);
  const parentRefMenus = useRef(null);
  const parentRefReactions = useRef(null);
  const [mousehover, setMousehover] = useState(false);
  const [moreActive, setMoreActive] = useState(false);

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
      className="sendbird-outgoing-og-message"
      ref={messageRef}
      style={{
        paddingTop: chainTop ? GROUPING_PADDING : NORAML_PADDING,
        paddingBottom: chainBottom ? GROUPING_PADDING : NORAML_PADDING,
      }}
    >
      <div className="sendbird-outgoing-og-message--inner">
        <div className="sendbird-outgoing-og-message--left-padding">
          <div className="sendbird-outgoing-og-message__more" ref={parentContainRef}>
            <ContextMenu
              menuTrigger={(toggleDropdown) => (
                <IconButton
                  className="sendbird-outgoing-og-message__more__menu"
                  ref={parentRefMenus}
                  width="32px"
                  height="32px"
                  onClick={() => {
                    toggleDropdown();
                    handleMoreIconClick();
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
              menuItems={(closeDropdown) => (
                <MenuItems
                  parentRef={parentRefMenus}
                  // for catching location(x, y) of MenuItems
                  parentContainRef={parentContainRef}
                  // for toggling more options(menus & reactions)
                  closeDropdown={closeDropdown}
                  openLeft
                >
                  {
                    isMessageSent && (
                      <MenuItem
                        className="sendbird-outgoing-og-message__more__menu__copy"
                        onClick={() => {
                          copyToClipboard(message.message);
                          closeDropdown();
                        }}
                      >
                        {stringSet.CONTEXT_MENU_DROPDOWN__COPY}
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
                        {stringSet.CONTEXT_MENU_DROPDOWN__EDIT}
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
                        {stringSet.CONTEXT_MENU_DROPDOWN__RESEND}
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
                    {stringSet.CONTEXT_MENU_DROPDOWN__DELETE}
                  </MenuItem>
                </MenuItems>
              )}
            />
            {
              (isMessageSent && useReaction && (emojiAllMap.size > 0))
              && (
                <ContextMenu
                  menuTrigger={(toggleDropdown) => (
                    <IconButton
                      className="sendbird-outgoing-og-message__more__add-reaction"
                      ref={parentRefReactions}
                      width="32px"
                      height="32px"
                      onClick={toggleDropdown}
                    >
                      <Icon
                        type={IconTypes.EMOJI_MORE}
                        fillColor={IconColors.CONTENT_INVERSE}
                        width="24px"
                        height="24px"
                      />
                    </IconButton>
                  )}
                  menuItems={(closeDropdown) => (
                    <MemoizedEmojiListItems
                      message={message}
                      parentRef={parentRefReactions}
                      parentContainRef={parentContainRef}
                      closeDropdown={closeDropdown}
                      spaceFromTrigger={{ y: 2 }}
                    />
                  )}
                />
              )
            }
          </div>
          {
            !chainBottom && !(mousehover || moreActive) && (
              <div className="sendbird-outgoing-og-message__message-status">
                <MessageStatus
                  message={message}
                  status={status}
                />
              </div>
            )
          }
        </div>
        <div className="sendbird-outgoing-og-message--body">
          <div className="sendbird-outgoing-og-message__text-balloon">
            <MemoizedMessageText />
          </div>
          <div
            className={[
              'sendbird-outgoing-og-message__thumbnail',
              checkOGIsEnalbed(message) ? '' : 'sendbird-outgoing-og-message__thumbnail--disabled',
            ].join(' ')}
            role="button"
            onClick={openLink}
            onKeyDown={openLink}
            tabIndex={0}
          >
            {
              defaultImage && (
                <ImageRenderer
                  className="sendbird-outgoing-og-message__thumbnail__image"
                  url={defaultImage.url || ''}
                  alt={defaultImage.alt}
                  width="320px"
                  height="180px"
                  defaultComponent={(
                    <div className="sendbird-outgoing-og-message__thumbnail__image__placeholder">
                      <Icon
                        type={IconTypes.THUMBNAIL_NONE}
                        width="56px"
                        height="56px"
                      />
                    </div>
                  )}
                />
              )
            }
          </div>
          <div
            className={[
              'sendbird-outgoing-og-message__og-tag',
              checkOGIsEnalbed(message) ? '' : 'sendbird-outgoing-og-message__og-tag--disabled',
            ].join(' ')}
            role="button"
            onClick={openLink}
            onKeyDown={openLink}
            tabIndex={0}
          >
            {
              ogMetaData.title && (
                <div className="sendbird-outgoing-og-message__og-tag__title">
                  <Label type={LabelTypography.SUBTITLE_2} color={LabelColors.ONBACKGROUND_1}>
                    {ogMetaData.title}
                  </Label>
                </div>
              )
            }
            {
              ogMetaData.description && (
                <div className="sendbird-outgoing-og-message__og-tag__description">
                  <Label
                    className="sendbird-outgoing-og-message__og-tag__description__label"
                    type={LabelTypography.BODY_2}
                    color={LabelColors.ONBACKGROUND_1}
                  >
                    {ogMetaData.description}
                  </Label>
                </div>
              )
            }
            {
              ogMetaData.url && (
                <Label
                  className="sendbird-outgoing-og-message__og-tag__url"
                  type={LabelTypography.CAPTION_3}
                  color={LabelColors.ONBACKGROUND_2}
                >
                  {ogMetaData.url}
                </Label>
              )
            }
            {
              showEmojiReactions
              && (
                <div
                  className="sendbird-outgoing-og-message__og-tag__emoji-reactions--wrapper"
                  role="button"
                  onClick={(event) => event.stopPropagation()}
                  onKeyDown={(event) => event.stopPropagation()}
                  tabIndex={0}
                >
                  <EmojiReactions
                    className="sendbird-outgoing-og-message__og-tag__emoji-reactions"
                    userId={userId}
                    message={message}
                    membersMap={membersMap}
                    emojiAllMap={emojiAllMap}
                    toggleReaction={toggleReaction}
                    memoizedEmojiListItems={memoizedEmojiListItems}
                  />
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
}

function IncomingOGMessage(props) {
  const {
    userId,
    message,
    openLink,
    chainTop,
    membersMap,
    chainBottom,
    useReaction,
    emojiAllMap,
    toggleReaction,
    memoizedMessageText,
    memoizedEmojiListItems,
  } = props;
  const {
    ogMetaData,
  } = message;
  const {
    defaultImage,
  } = ogMetaData;
  const { stringSet, dateLocale } = useContext(LocalizationContext);
  const MemoizedMessageText = memoizedMessageText;
  const MemoizedEmojiListItems = memoizedEmojiListItems;
  const showEmojiReactions = (useReaction && message.reactions && message.reactions.length > 0);
  const showReactionAddButton = useReaction && emojiAllMap && (emojiAllMap.size > 0);

  const messageRef = useRef(null);
  const avatarRef = useRef(null);
  const parentRefReactions = useRef(null);
  const parentRefMenus = useRef(null);
  const parentContainRef = useRef(null);
  const {
    disableUserProfile,
    renderUserProfile,
  } = React.useContext(UserProfileContext);
  const [mousehover, setMousehover] = useState(false);
  const [moreActive, setMoreActive] = useState(false);

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
      className="sendbird-incoming-og-message"
      ref={messageRef}
      style={{
        paddingTop: chainTop ? GROUPING_PADDING : NORAML_PADDING,
        paddingBottom: chainBottom ? GROUPING_PADDING : NORAML_PADDING,
      }}
    >
      <div className="sendbird-incoming-og-message--inner">
        <div className="sendbird-incoming-og-message--body">
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
                    className="sendbird-incoming-og-message__avatar"
                    src={getSenderProfileUrl(message)}
                    alt="sender-profile-image"
                    width="28px"
                    height="28px"
                  />
                )}
                menuItems={(closeDropdown) => (
                  <MenuItems
                    parentRef={avatarRef}
                    // for catching location(x, y) of MenuItems
                    parentContainRef={avatarRef}
                    // for toggling more options(menus & reactions)
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
                className="sendbird-incoming-og-message__sender-name"
                type={LabelTypography.CAPTION_2}
                color={LabelColors.ONBACKGROUND_2}
              >
                {getSenderName(message)}
              </Label>
            )
          }
          <div className="sendbird-incoming-og-message__text-balloon">
            <MemoizedMessageText />
          </div>
          <div
            className={[
              'sendbird-incoming-og-message__thumbnail',
              checkOGIsEnalbed(message) ? '' : 'sendbird-incoming-og-message__thumbnail--disabled',
            ].join(' ')}
            role="button"
            onClick={openLink}
            onKeyDown={openLink}
            tabIndex={0}
          >
            {
              defaultImage && (
                <ImageRenderer
                  url={defaultImage.url || ''}
                  alt={defaultImage.alt || ''}
                  className="sendbird-incoming-og-message__thumbnail__image"
                  width="320px"
                  height="180px"
                  defaultComponent={(
                    <div className="sendbird-incoming-og-message__thumbnail__image__placeholder">
                      <Icon
                        type={IconTypes.THUMBNAIL_NONE}
                        width="56px"
                        height="56px"
                      />
                    </div>
                  )}
                />
              )
            }
          </div>
          <div
            className={[
              'sendbird-incoming-og-message__og-tag',
              checkOGIsEnalbed(message) ? '' : 'sendbird-incoming-og-message__og-tag--disabled',
            ].join(' ')}
            role="button"
            onClick={openLink}
            onKeyDown={openLink}
            tabIndex={0}
          >
            {
              ogMetaData.title && (
                <div className="sendbird-incoming-og-message__og-tag__title">
                  <Label
                    type={LabelTypography.SUBTITLE_2}
                    color={LabelColors.ONBACKGROUND_1}
                  >
                    {ogMetaData.title}
                  </Label>
                </div>
              )
            }
            {
              ogMetaData.description && (
                <div className="sendbird-incoming-og-message__og-tag__description">
                  <Label
                    className="sendbird-incoming-og-message__og-tag__description__label"
                    type={LabelTypography.BODY_2}
                    color={LabelColors.ONBACKGROUND_1}
                  >
                    {ogMetaData.description}
                  </Label>
                </div>
              )
            }
            {
              ogMetaData.url && (
                <div className="sendbird-incoming-og-message__og-tag__url">
                  <Label
                    className="sendbird-incoming-og-message__og-tag__url__label"
                    type={LabelTypography.CAPTION_3}
                    color={LabelColors.ONBACKGROUND_2}
                  >
                    {ogMetaData.url}
                  </Label>
                </div>
              )
            }
            {
              showEmojiReactions
              && (
                <div
                  className="sendbird-incoming-og-message__og-tag__emoji-reactions--wrapper"
                  role="button"
                  onClick={(event) => event.stopPropagation()}
                  onKeyDown={(event) => event.stopPropagation()}
                  tabIndex={0}
                >
                  <EmojiReactions
                    className="sendbird-incoming-og-message__og-tag__emoji-reactions"
                    userId={userId}
                    message={message}
                    membersMap={membersMap}
                    emojiAllMap={emojiAllMap}
                    toggleReaction={toggleReaction}
                    memoizedEmojiListItems={memoizedEmojiListItems}
                  />
                </div>
              )
            }
          </div>
        </div>
        <div className="sendbird-incoming-og-message--right-padding">
          {
            !chainBottom && !(mousehover || moreActive) && (
              <Label
                className="sendbird-incoming-og-message__sent-at"
                type={LabelTypography.CAPTION_3}
                color={LabelColors.ONBACKGROUND_2}
              >
                { format(message?.createdAt || 0, 'p', { locale: dateLocale}) }
              </Label>
            )
          }
          <div className="sendbird-incoming-og-message__more" ref={parentContainRef}>
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
                  menuItems={(closeDropdown) => (
                    <MemoizedEmojiListItems
                      parentRef={parentRefReactions}
                      parentContainRef={parentContainRef}
                      closeDropdown={closeDropdown}
                      message={message}
                      spaceFromTrigger={{ y: 2 }}
                    />
                  )}
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
              menuItems={(closeDropdown) => (
                <MenuItems
                  parentRef={parentRefMenus}
                  parentContainRef={parentContainRef}
                  closeDropdown={closeDropdown}
                >
                  <MenuItem
                    className="sendbird-incoming-og-message__more__menu__copy"
                    onClick={() => { copyToClipboard(message.message); closeDropdown(); }}
                  >
                    {stringSet.CONTEXT_MENU_DROPDOWN__COPY}
                  </MenuItem>
                </MenuItems>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OGMessageSwitch;

const noop = () => { };

OGMessageSwitch.propTypes = {
  isByMe: PropTypes.bool.isRequired,
  userId: PropTypes.string.isRequired,
  message: PropTypes.shape({
    message: PropTypes.string,
    sender: PropTypes.shape({}),
    ogMetaData: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      url: PropTypes.string,
      defaultImage: PropTypes.shape({
        url: PropTypes.string,
        alt: PropTypes.string,
      }),
    }),
    reactions: PropTypes.array,
    updatedAt: PropTypes.number,
  }).isRequired,
  useReaction: PropTypes.bool.isRequired,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  status: PropTypes.string,
  disabled: PropTypes.bool,
  showEdit: PropTypes.func,
  showRemove: PropTypes.func,
  resendMessage: PropTypes.func,
  toggleReaction: PropTypes.func,
  membersMap: PropTypes.instanceOf(Map),
  emojiAllMap: PropTypes.instanceOf(Map),
  memoizedEmojiListItems: PropTypes.func,
  chainTop: PropTypes.bool,
  chainBottom: PropTypes.bool,
};

OGMessageSwitch.defaultProps = {
  className: '',
  status: '',
  disabled: false,
  showEdit: noop,
  showRemove: noop,
  resendMessage: noop,
  toggleReaction: noop,
  membersMap: new Map(),
  emojiAllMap: new Map(),
  memoizedEmojiListItems: noop,
  chainTop: false,
  chainBottom: false,
};

OutgoingOGMessage.propTypes = {
  status: PropTypes.string,
  userId: PropTypes.string.isRequired,
  message: PropTypes.shape({
    message: PropTypes.string,
    ogMetaData: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      url: PropTypes.string,
      defaultImage: PropTypes.shape({
        url: PropTypes.string,
        alt: PropTypes.string,
      }),
    }),
    reactions: PropTypes.array,
    updatedAt: PropTypes.number,
    isResendable: PropTypes.func,
    errorCode: PropTypes.number,
  }).isRequired,
  disabled: PropTypes.bool.isRequired,
  openLink: PropTypes.func.isRequired,
  showEdit: PropTypes.func.isRequired,
  showRemove: PropTypes.func.isRequired,
  membersMap: PropTypes.instanceOf(Map).isRequired,
  emojiAllMap: PropTypes.instanceOf(Map).isRequired,
  useReaction: PropTypes.bool.isRequired,
  resendMessage: PropTypes.func.isRequired,
  toggleReaction: PropTypes.func.isRequired,
  memoizedMessageText: PropTypes.func.isRequired,
  memoizedEmojiListItems: PropTypes.func.isRequired,
  chainTop: PropTypes.bool.isRequired,
  chainBottom: PropTypes.bool.isRequired,
};

OutgoingOGMessage.defaultProps = {
  status: '',
};

IncomingOGMessage.propTypes = {
  userId: PropTypes.string.isRequired,
  message: PropTypes.shape({
    message: PropTypes.string,
    sender: PropTypes.shape({}),
    ogMetaData: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      url: PropTypes.string,
      defaultImage: PropTypes.shape({
        url: PropTypes.string,
        alt: PropTypes.string,
      }),
    }),
    reactions: PropTypes.array,
    updatedAt: PropTypes.number,
  }).isRequired,
  openLink: PropTypes.func.isRequired,
  membersMap: PropTypes.instanceOf(Map).isRequired,
  emojiAllMap: PropTypes.instanceOf(Map).isRequired,
  useReaction: PropTypes.bool.isRequired,
  toggleReaction: PropTypes.func.isRequired,
  memoizedMessageText: PropTypes.func.isRequired,
  memoizedEmojiListItems: PropTypes.func.isRequired,
  chainTop: PropTypes.bool.isRequired,
  chainBottom: PropTypes.bool.isRequired,
};
