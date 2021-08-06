import React, { useState, useRef, useContext } from 'react';
import PropTypes from 'prop-types';

import './index.scss';
import * as utils from './utils';

import { LocalizationContext } from '../../../lib/LocalizationContext';
import Avatar from '../../../ui/Avatar/index';
import UserProfile from '../../../ui/UserProfile';
import Label, { LabelTypography, LabelColors } from '../../../ui/Label';
import MessageStatus from '../../../ui/MessageStatus';
import ContextMenu, { MenuItems, MenuItem } from '../../../ui/ContextMenu';
import IconButton from '../../../ui/IconButton';
import Icon, { IconColors, IconTypes } from '../../../ui/Icon';
import { UserProfileContext } from '../../../lib/UserProfileContext';
import useMouseHover from '../../../hooks/onMouseHover';

const GROUPING_PADDING = '1px';
const NORMAL_PADDING = '8px';

export default function UnknownMessage({
  message,
  isByMe,
  status,
  className,
  showRemove,
  chainTop,
  chainBottom,
}) {
  return (
    <div
      className={[
        ...(Array.isArray(className) ? className : [className]),
        'sendbird-unknown-message',
        `sendbird-unknown-message${isByMe ? '--outgoing' : '--incoming'}`,
      ].join(' ')}
    >
      {
        isByMe
          ? (
            <OutgoingUnknownMessage
              status={status}
              message={message}
              chainTop={chainTop}
              showRemove={showRemove}
              chainBottom={chainBottom}
            />
          )
          : (
            <IncomingUnknownMessage
              message={message}
              chainTop={chainTop}
              chainBottom={chainBottom}
            />
          )
      }
    </div>
  );
}

UnknownMessage.propTypes = {
  message: PropTypes.shape({}).isRequired,
  isByMe: PropTypes.bool,
  status: PropTypes.string,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  showRemove: PropTypes.func,
  chainTop: PropTypes.bool,
  chainBottom: PropTypes.bool,
};

UnknownMessage.defaultProps = {
  isByMe: false,
  status: '',
  className: '',
  showRemove: () => { },
  chainTop: false,
  chainBottom: false,
};

function OutgoingUnknownMessage({
  message,
  status,
  showRemove,
  chainTop,
  chainBottom,
}) {
  const messageRef = useRef(null);
  const parentContainRef = useRef(null);
  const menuRef = useRef(null);
  const [mousehover, setMousehover] = useState(false);
  const [moreActive, setMoreActive] = useState(false);
  const [menuDisplaying, setMenuDisplaying] = useState(false);
  const { stringSet } = useContext(LocalizationContext);
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
      className="sendbird-outgoing-unknown-message"
      ref={messageRef}
      style={{
        paddingTop: chainTop ? GROUPING_PADDING : NORMAL_PADDING,
        paddingBottom: chainBottom ? GROUPING_PADDING : NORMAL_PADDING,
      }}
    >
      <div className="sendbird-outgoing-unknown-message--inner">
        <div className="sendbird-outgoing-unknown-message--left-padding">
          <div
            className="sendbird-outgoing-unknown-message__more"
            ref={parentContainRef}
          >
            <ContextMenu
              menuTrigger={(toggleDropdown) => (
                <IconButton
                  className="sendbird-outgoing-unknown-message__more__menu"
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
                    <MenuItem
                      onClick={() => { showRemove(true); closeDropdown(); }}
                    >
                      Delete
                    </MenuItem>
                  </MenuItems>
                );
              }}
            />
          </div>
          {
            (!chainBottom && !(mousehover || moreActive || menuDisplaying)) && (
              <div className="sendbird-outgoing-unknown-message__message-status">
                <MessageStatus
                  message={message}
                  status={status}
                />
              </div>
            )
          }
        </div>
        <div className="sendbird-outgoing-unknown-message__body">
          <div className="sendbird-outgoing-unknown-message__body__text-balloon">
            <Label
              className="sendbird-outgoing-unknown-message__body__text-balloon__header"
              type={LabelTypography.BODY_1}
              color={LabelColors.ONBACKGROUND_1}
            >
              {stringSet.UNKNOWN__UNKNOWN_MESSAGE_TYPE}
            </Label>
            <Label
              className="sendbird-outgoing-unknown-message__body__text-balloon__description"
              type={LabelTypography.BODY_1}
              color={LabelColors.ONBACKGROUND_2}
            >
              {stringSet.UNKNOWN__CANNOT_READ_MESSAGE}
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}

function IncomingUnknownMessage({
  message,
  chainTop,
  chainBottom,
}) {
  const { sender } = message;
  const avatarRef = useRef(null);
  const { stringSet } = useContext(LocalizationContext);
  const {
    disableUserProfile,
    renderUserProfile,
  } = React.useContext(UserProfileContext);
  return (
    <div
      className="sendbird-incoming-unknown-message"
      style={{
        paddingTop: chainTop ? GROUPING_PADDING : NORMAL_PADDING,
        paddingBottom: chainBottom ? GROUPING_PADDING : NORMAL_PADDING,
      }}
    >
      <div className="sendbird-incoming-unknown-message--inner">
        <div className="sendbird-incoming-unknown-message__left">
          {
            !chainBottom && (
              <ContextMenu
                menuTrigger={(toggleDropdown) => (
                  <Avatar
                    className="sendbird-incoming-unknown-message__left__sender-profile-image"
                    ref={avatarRef}
                    src={sender.profileUrl}
                    alt="sender-profile-image"
                    width="28px"
                    height="28px"
                    onClick={() => {
                      if (!disableUserProfile) {
                        toggleDropdown();
                      }
                    }}
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
        </div>
        <div className="sendbird-incoming-unknown-message__body">
          {
            !chainTop && (
              <Label
                className="sendbird-incoming-unknown-message__body__sender-name"
                type={LabelTypography.CAPTION_2}
                color={LabelColors.ONBACKGROUND_2}
              >
                {sender.nickname || stringSet.NO_NAME}
              </Label>
            )
          }
          <div className="sendbird-incoming-unknown-message__body__text-balloon">
            <Label
              className="sendbird-incoming-unknown-message__body__text-balloon__header"
              type={LabelTypography.BODY_1}
              color={LabelColors.ONBACKGROUND_1}
            >
              {stringSet.UNKNOWN__UNKNOWN_MESSAGE_TYPE}
            </Label>
            <Label
              className="sendbird-incoming-unknown-message__body__text-balloon__description"
              type={LabelTypography.BODY_1}
              color={LabelColors.ONBACKGROUND_2}
            >
              {stringSet.UNKNOWN__CANNOT_READ_MESSAGE}
            </Label>
          </div>
        </div>
        <div className="sendbird-incoming-unknown-message--right-padding">
          {
            !chainBottom && (
              <Label
                className="sendbird-incoming-unknown-message__sent-at"
                type={LabelTypography.CAPTION_3}
                color={LabelColors.ONBACKGROUND_2}
              >
                {utils.getMessageCreatedAt(message)}
              </Label>
            )
          }
        </div>
      </div>
    </div>
  );
}

OutgoingUnknownMessage.propTypes = {
  message: PropTypes.shape({}).isRequired,
  status: PropTypes.string.isRequired,
  showRemove: PropTypes.func,
  chainTop: PropTypes.bool.isRequired,
  chainBottom: PropTypes.bool.isRequired,
};

OutgoingUnknownMessage.defaultProps = {
  showRemove: () => { },
};

IncomingUnknownMessage.propTypes = {
  message: PropTypes.shape({
    sender: PropTypes.shape({
      nickname: PropTypes.string,
      profileUrl: PropTypes.string,
    }),
  }).isRequired,
  chainTop: PropTypes.bool.isRequired,
  chainBottom: PropTypes.bool.isRequired,
};
