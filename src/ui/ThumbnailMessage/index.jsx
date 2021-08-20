import React, {
  useContext,
  useState,
  useRef,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';

import './index.scss';
import {
  getMessageCreatedAt,
  getIsSentFromStatus,
  getIsSentFromSendingStatus,
} from './util';
import { UserProfileContext } from '../../lib/UserProfileContext';
import Avatar from '../Avatar/index';
import UserProfile from '../UserProfile';
import Label, { LabelTypography, LabelColors } from '../Label';
import ContextMenu, { MenuItem, MenuItems } from '../ContextMenu';
import IconButton from '../IconButton';
import Icon, { IconTypes, IconColors } from '../Icon';
import ImageRenderer from '../ImageRenderer';
import MessageStatus from '../MessageStatus';
import EmojiReactions from '../EmojiReactions';
import {
  isGif,
  isImage,
  isVideo,
  unSupported,
} from '../FileViewer/types';
import {
  getSenderName,
  getSenderProfileUrl,
} from '../../utils/utils';
import useMouseHover from '../../hooks/onMouseHover';
import { LocalizationContext } from '../../lib/LocalizationContext';

const noop = () => { };

const OUTGOING_THUMBNAIL_MESSAGE = 'sendbird-outgoing-thumbnail-message';
const INCOMING_THUMBNAIL_MESSAGE = 'sendbird-incoming-thumbnail-message';
const GROUPING_PADDING = '1px';
const NORMAL_PADDING = '8px';

export default function ThumbnailMessage({
  message = {},
  userId,
  disabled,
  isByMe,
  onClick,
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
}) {
  return (
    isByMe
      ? (
        <OutgoingThumbnailMessage
          userId={userId}
          status={status}
          message={message}
          onClick={onClick}
          disabled={disabled}
          chainTop={chainTop}
          showRemove={showRemove}
          membersMap={membersMap}
          chainBottom={chainBottom}
          useReaction={useReaction}
          emojiAllMap={emojiAllMap}
          resendMessage={resendMessage}
          toggleReaction={toggleReaction}
          memoizedEmojiListItems={memoizedEmojiListItems}
        />
      )
      : (
        <IncomingThumbnailMessage
          userId={userId}
          status={status}
          message={message}
          onClick={onClick}
          chainTop={chainTop}
          membersMap={membersMap}
          chainBottom={chainBottom}
          useReaction={useReaction}
          emojiAllMap={emojiAllMap}
          toggleReaction={toggleReaction}
          memoizedEmojiListItems={memoizedEmojiListItems}
        />
      )
  );
}

export function OutgoingThumbnailMessage({
  message = {},
  userId,
  disabled,
  onClick,
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
}) {
  const {
    type,
    url,
    localUrl,
    thumbnails,
  } = message;
  const thumbnailUrl = (thumbnails && thumbnails.length > 0 && thumbnails[0].url) || null;
  const { stringSet } = useContext(LocalizationContext);
  const messageRef = useRef(null);
  const parentContainRef = useRef(null);
  const menuRef = useRef(null);
  const reactionAddRef = useRef(null);
  const [mousehover, setMousehover] = useState(false);
  const [moreActive, setMoreActive] = useState(false);
  const [menuDisplaying, setMenuDisplaying] = useState(false);
  /* eslint-disable react/prop-types */
  const memorizedThumbnailPlaceHolder = useMemo(() => (iconType) => ({ style }) => (
    <div style={style}>
      <Icon
        type={iconType}
        fillColor={IconColors.ON_BACKGROUND_2}
        width="56px"
        height="56px"
      />
    </div>
  ), []);

  const showReactionAddButton = useReaction
    && emojiAllMap
    && (emojiAllMap.size > 0)
    && getIsSentFromSendingStatus(message);
  const MemoizedEmojiListItems = memoizedEmojiListItems;
  const isMessageSent = getIsSentFromStatus(status);

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
      className={OUTGOING_THUMBNAIL_MESSAGE}
      ref={messageRef}
      style={{
        paddingTop: chainTop ? GROUPING_PADDING : NORMAL_PADDING,
        paddingBottom: chainBottom ? GROUPING_PADDING : NORMAL_PADDING,
      }}
    >
      <div className={`${OUTGOING_THUMBNAIL_MESSAGE}--inner`}>
        <div className={`${OUTGOING_THUMBNAIL_MESSAGE}__left-padding`}>
          <div
            className={`${OUTGOING_THUMBNAIL_MESSAGE}-left-padding__more`}
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
                          {stringSet.CONTEXT_MENU_DROPDOWN__RESEND}
                        </MenuItem>
                      )
                    }
                    <MenuItem onClick={() => {
                      if (disabled) { return; }
                      showRemove(true);
                      closeDropdown();
                    }}
                    >
                      {stringSet.CONTEXT_MENU_DROPDOWN__DELETE}
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
                      ref={reactionAddRef}
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
                        parentRef={reactionAddRef}
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
            (!chainBottom && !(mousehover || moreActive || menuDisplaying)) && (
              <MessageStatus
                className={`${OUTGOING_THUMBNAIL_MESSAGE}-left-padding__status`}
                message={message}
                status={status}
              />
            )
          }
        </div>
        <div className={`${OUTGOING_THUMBNAIL_MESSAGE}__body`}>
          <div
            className={`${OUTGOING_THUMBNAIL_MESSAGE}-body__wrap`}
          >
            <div
              className={`${OUTGOING_THUMBNAIL_MESSAGE}-body__wrap--inner`}
              role="button"
              onClick={isMessageSent ? () => onClick(true) : () => { }}
              onKeyDown={isMessageSent ? () => onClick(true) : () => { }}
              tabIndex={0}
            >
              {
                isVideo(type) && (
                  <>
                    {
                      (thumbnailUrl)
                        ? (
                          <ImageRenderer
                            className={`${OUTGOING_THUMBNAIL_MESSAGE}-body__video`}
                            url={thumbnailUrl}
                            alt="video/thumbnail"
                            width="404px"
                            height="280px"
                            defaultComponent={(
                              <div className={`${OUTGOING_THUMBNAIL_MESSAGE}__thumbnail-placeholder--video`}>
                                <Icon
                                  type={IconTypes.PLAY}
                                  fillColor={IconColors.ON_BACKGROUND_2}
                                  width="56px"
                                  height="56px"
                                />
                              </div>
                            )}
                            placeHolder={memorizedThumbnailPlaceHolder(IconTypes.PLAY)}
                          />
                        )
                        : (
                          /* eslint-disable-next-line jsx-a11y/media-has-caption */
                          <video className={`${OUTGOING_THUMBNAIL_MESSAGE}-body__video`}>
                            <source src={url || localUrl} type={type} />
                          </video>
                        )
                    }
                    <div className={`${OUTGOING_THUMBNAIL_MESSAGE}-body__video-icon--wrap`}>
                      <Icon
                        className={`${OUTGOING_THUMBNAIL_MESSAGE}-body__video-icon`}
                        type={IconTypes.PLAY}
                        fillColor={IconColors.ON_BACKGROUND_2}
                        width="34px"
                        height="34px"
                      />
                    </div>
                  </>
                )
              }
              {
                isImage(type) && (
                  <>
                    <ImageRenderer
                      className={`${OUTGOING_THUMBNAIL_MESSAGE}-body__img`}
                      url={thumbnailUrl || url || localUrl}
                      alt="image/thumbnail"
                      width="404px"
                      height="280px"
                      defaultComponent={(
                        <div className={`${OUTGOING_THUMBNAIL_MESSAGE}__thumbnail-placeholder--image`}>
                          <Icon
                            type={IconTypes.PHOTO}
                            fillColor={IconColors.ON_BACKGROUND_2}
                            width="56px"
                            height="56px"
                          />
                        </div>
                      )}
                      placeHolder={memorizedThumbnailPlaceHolder(IconTypes.PHOTO)}
                    />
                    {
                      isGif(type) && (
                        <div className={`${OUTGOING_THUMBNAIL_MESSAGE}-body__gif-icon--wrap`}>
                          <Icon
                            className={`${OUTGOING_THUMBNAIL_MESSAGE}-body__gif-icon`}
                            type={IconTypes.GIF}
                            fillColor={IconColors.ON_BACKGROUND_2}
                            width="34px"
                            height="34px"
                          />
                        </div>
                      )
                    }
                  </>
                )
              }
              {
                unSupported(type) && (
                  <div className={`${OUTGOING_THUMBNAIL_MESSAGE}-body__other`}>
                    {stringSet.UNKNOWN__UNKNOWN_MESSAGE_TYPE}
                  </div>
                )
              }
              <div className={`${OUTGOING_THUMBNAIL_MESSAGE}-body__wrap__overlay`} />
            </div>
            {
              (useReaction && message.reactions && message.reactions.length > 0)
              && (
                <EmojiReactions
                  className={`${OUTGOING_THUMBNAIL_MESSAGE}-body__wrap__emoji-reactions`}
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

export function IncomingThumbnailMessage({
  message = {},
  userId,
  onClick,
  status,
  useReaction,
  emojiAllMap,
  membersMap,
  toggleReaction,
  memoizedEmojiListItems,
  chainTop,
  chainBottom,
}) {
  const {
    type,
    url,
    localUrl,
    thumbnails,
  } = message;
  const thumbnailUrl = (thumbnails && thumbnails.length > 0 && thumbnails[0].url) || null;
  const {
    disableUserProfile,
    renderUserProfile,
  } = React.useContext(UserProfileContext);
  const { stringSet } = useContext(LocalizationContext);
  const messageRef = useRef(null);
  const parentContainRef = useRef(null);
  const reactionAddRef = useRef(null);
  const avatarRef = useRef(null);
  const [mousehover, setMousehover] = useState(false);
  const [moreActive, setMoreActive] = useState(false);
  const [menuDisplaying, setMenuDisplaying] = useState(false);
  /* eslint-disable react/prop-types */
  const memorizedThumbnailPlaceHolder = useMemo(() => (iconType) => ({ style }) => (
    <div style={style}>
      <Icon
        type={iconType}
        fillColor={IconColors.ON_BACKGROUND_2}
        width="56px"
        height="56px"
      />
    </div>
  ), []);

  const showReactionAddButton = (useReaction && emojiAllMap && emojiAllMap.size > 0);
  const MemoizedEmojiListItems = memoizedEmojiListItems;
  const isMessageSent = getIsSentFromStatus(status);

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
      className={INCOMING_THUMBNAIL_MESSAGE}
      ref={messageRef}
      style={{
        paddingTop: chainTop ? GROUPING_PADDING : NORMAL_PADDING,
        paddingBottom: chainBottom ? GROUPING_PADDING : NORMAL_PADDING,
      }}
    >
      {
        !chainTop && (
          <Label
            className={`${INCOMING_THUMBNAIL_MESSAGE}__sender-name`}
            type={LabelTypography.CAPTION_2}
            color={LabelColors.ONBACKGROUND_2}
          >
            {getSenderName(message) || ''}
          </Label>
        )
      }
      <div className={`${INCOMING_THUMBNAIL_MESSAGE}--inner`}>
        <div className={`${INCOMING_THUMBNAIL_MESSAGE}__body`}>
          <div className={`${INCOMING_THUMBNAIL_MESSAGE}-body__wrap`}>
            {
              !chainBottom && (
                <ContextMenu
                  menuTrigger={(toggleDropdown) => (
                    <Avatar
                      className={`${INCOMING_THUMBNAIL_MESSAGE}__avatar`}
                      ref={avatarRef}
                      onClick={() => {
                        if (!disableUserProfile) {
                          toggleDropdown();
                        }
                      }}
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
            <div
              className={`${INCOMING_THUMBNAIL_MESSAGE}-body__wrap--inner`}
              role="button"
              onClick={isMessageSent ? () => onClick(true) : () => { }}
              onKeyDown={isMessageSent ? () => onClick(true) : () => { }}
              tabIndex={0}
            >
              {
                isVideo(type) && (
                  <>
                    {
                      (thumbnailUrl)
                        ? (
                          <ImageRenderer
                            className={`${INCOMING_THUMBNAIL_MESSAGE}__video`}
                            url={thumbnailUrl}
                            alt="video/thumbnail"
                            width="404px"
                            height="280px"
                            defaultComponent={(
                              <div className={`${INCOMING_THUMBNAIL_MESSAGE}__thumbnail-placeholder--video`}>
                                <Icon
                                  type={IconTypes.PLAY}
                                  fillColor={IconColors.ON_BACKGROUND_2}
                                  width="56px"
                                  height="56px"
                                />
                              </div>
                            )}
                            placeHolder={memorizedThumbnailPlaceHolder(IconTypes.PLAY)}
                          />
                        )
                        : (
                          /* eslint-disable-next-line jsx-a11y/media-has-caption */
                          <video className={`${INCOMING_THUMBNAIL_MESSAGE}__video`}>
                            <source src={url || localUrl} type={type} />
                          </video>
                        )
                    }
                    <div className={`${INCOMING_THUMBNAIL_MESSAGE}__video-icon--wrap`}>
                      <Icon
                        className={`${INCOMING_THUMBNAIL_MESSAGE}__video-icon`}
                        type={IconTypes.PLAY}
                        fillColor={IconColors.ON_BACKGROUND_2}
                        width="34px"
                        height="34px"
                      />
                    </div>
                  </>
                )
              }
              {
                isImage(type) && (
                  <>
                    <ImageRenderer
                      className={`${INCOMING_THUMBNAIL_MESSAGE}__img`}
                      url={thumbnailUrl || url || localUrl}
                      alt="image/thumbnail"
                      width="404px"
                      height="280px"
                      defaultComponent={(
                        <div className={`${INCOMING_THUMBNAIL_MESSAGE}__thumbnail-placeholder--image`}>
                          <Icon
                            type={IconTypes.PHOTO}
                            fillColor={IconColors.ON_BACKGROUND_2}
                            width="56px"
                            height="56px"
                          />
                        </div>
                      )}
                      placeHolder={memorizedThumbnailPlaceHolder(IconTypes.PHOTO)}
                    />
                    {
                      isGif(type) && (
                        <div className={`${INCOMING_THUMBNAIL_MESSAGE}__gif-icon--wrap`}>
                          <Icon
                            className={`${INCOMING_THUMBNAIL_MESSAGE}__gif-icon`}
                            type={IconTypes.GIF}
                            fillColor={IconColors.ON_BACKGROUND_2}
                            width="34px"
                            height="34px"
                          />
                        </div>
                      )
                    }
                  </>
                )
              }
              {
                unSupported(type) && (
                  <div className={`${INCOMING_THUMBNAIL_MESSAGE}__other`}>
                    {stringSet.UNKNOWN__UNKNOWN_MESSAGE_TYPE}
                  </div>
                )
              }
              <div className={`${INCOMING_THUMBNAIL_MESSAGE}-body__wrap-overlay`} />
            </div>
            {
              (useReaction && message.reactions && message.reactions.length > 0)
              && (
                <EmojiReactions
                  className={`${INCOMING_THUMBNAIL_MESSAGE}__wrap__emoji-reactions`}
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
        <div className={`${INCOMING_THUMBNAIL_MESSAGE}__right-padding`}>
          {
            !chainBottom && !(mousehover || moreActive || menuDisplaying) && (
              <Label
                className={`${INCOMING_THUMBNAIL_MESSAGE}__sent-at`}
                type={LabelTypography.CAPTION_3}
                color={LabelColors.ONBACKGROUND_2}
              >
                {getMessageCreatedAt(message)}
              </Label>
            )
          }
          <div
            className={`${INCOMING_THUMBNAIL_MESSAGE}__more`}
            ref={parentContainRef}
          >
            {
              showReactionAddButton && (
                <ContextMenu
                  menuTrigger={(toggleDropdown) => (
                    <IconButton
                      ref={reactionAddRef}
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
                        parentRef={reactionAddRef}
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
        </div>
      </div>
    </div>
  );
}

ThumbnailMessage.propTypes = {
  message: PropTypes.shape({
    type: PropTypes.string,
    url: PropTypes.string,
    localUrl: PropTypes.string,
  }).isRequired,
  userId: PropTypes.string,
  resendMessage: PropTypes.func,
  status: PropTypes.string,
  isByMe: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  showRemove: PropTypes.func,
  useReaction: PropTypes.bool.isRequired,
  emojiAllMap: PropTypes.instanceOf(Map),
  membersMap: PropTypes.instanceOf(Map),
  toggleReaction: PropTypes.func,
  memoizedEmojiListItems: PropTypes.func,
  chainTop: PropTypes.bool,
  chainBottom: PropTypes.bool,
};
ThumbnailMessage.defaultProps = {
  isByMe: false,
  disabled: false,
  resendMessage: noop,
  onClick: noop,
  showRemove: noop,
  status: '',
  userId: '',
  emojiAllMap: new Map(),
  membersMap: new Map(),
  toggleReaction: noop,
  memoizedEmojiListItems: () => '',
  chainTop: false,
  chainBottom: false,
};

OutgoingThumbnailMessage.propTypes = {
  message: PropTypes.shape({
    type: PropTypes.string,
    url: PropTypes.string,
    localUrl: PropTypes.string,
  }).isRequired,
  userId: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  resendMessage: PropTypes.func.isRequired,
  status: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  showRemove: PropTypes.func.isRequired,
  useReaction: PropTypes.bool.isRequired,
  emojiAllMap: PropTypes.instanceOf(Map).isRequired,
  membersMap: PropTypes.instanceOf(Map).isRequired,
  toggleReaction: PropTypes.func.isRequired,
  memoizedEmojiListItems: PropTypes.func.isRequired,
  chainTop: PropTypes.bool.isRequired,
  chainBottom: PropTypes.bool.isRequired,
};
OutgoingThumbnailMessage.defaultProps = {
  status: '',
};

IncomingThumbnailMessage.propTypes = {
  message: PropTypes.shape({
    type: PropTypes.string,
    url: PropTypes.string,
    localUrl: PropTypes.string,
  }).isRequired,
  userId: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  status: PropTypes.string,
  useReaction: PropTypes.bool.isRequired,
  emojiAllMap: PropTypes.instanceOf(Map).isRequired,
  membersMap: PropTypes.instanceOf(Map).isRequired,
  toggleReaction: PropTypes.func.isRequired,
  memoizedEmojiListItems: PropTypes.func.isRequired,
  chainTop: PropTypes.bool.isRequired,
  chainBottom: PropTypes.bool.isRequired,
};
IncomingThumbnailMessage.defaultProps = {
  status: '',
};
