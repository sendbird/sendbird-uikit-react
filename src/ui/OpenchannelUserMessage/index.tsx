import React, {
  useMemo,
  useContext,
  useRef,
  useState,
  ReactElement,
  useEffect,
} from 'react';
import { UserMessage } from '@sendbird/chat/message';
import format from 'date-fns/format';
import './index.scss';

import Avatar from '../Avatar';
import ContextMenu, { MenuItems, MenuItem } from '../ContextMenu';
import Icon, { IconTypes, IconColors } from '../Icon';
import IconButton from '../IconButton';
import Label, { LabelTypography, LabelColors } from '../Label';
import Loader from '../Loader';
import UserProfile from '../UserProfile';
import { UserProfileContext } from '../../lib/UserProfileContext';

import { useLocalization } from '../../lib/LocalizationContext';
import { copyToClipboard } from './utils';
import uuidv4 from '../../utils/uuid';
import {
  checkIsPending,
  checkIsFailed,
  isFineCopy,
  isFineEdit,
  isFineResend,
  isFineDelete,
  showMenuTrigger,
} from '../../utils/openChannelUtils';
import { getSenderFromMessage } from '../../utils/openChannelUtils';

interface Props {
  className?: string | Array<string>;
  message: UserMessage;
  isOperator?: boolean;
  userId: string;
  disabled?: boolean;
  showEdit(bool: boolean): void;
  showRemove(bool: boolean): void;
  resendMessage(message: UserMessage): void;
  chainTop?: boolean;
  chainBottom?: boolean;
}

export default function OpenchannelUserMessage({
  className,
  message,
  isOperator,
  userId,
  resendMessage,
  disabled,
  showEdit,
  showRemove,
  chainTop,
}: Props): ReactElement {
  if (!message || message.messageType !== 'user') {
    return null;
  }

  // hooks
  const { stringSet, dateLocale } = useLocalization();
  const { disableUserProfile, renderUserProfile } = useContext(UserProfileContext);
  const messageRef = useRef(null);
  const avatarRef = useRef(null);
  const contextMenuRef = useRef(null);
  const [contextStyle, setContextStyle] = useState({});

  // consts
  const status = message?.sendingStatus;
  const isPending = checkIsPending(status);
  const isFailed = checkIsFailed(status);
  const sender = getSenderFromMessage(message);

  const MemoizedMessageText = useMemo(() => () => {
    const splitMessage = message.message.split(/\r/);
    const matchedMessage = splitMessage.map((word) => (word !== '' ? word : <br />));
    if (message.updatedAt > 0) {
      matchedMessage.push(
        <Label
          key={uuidv4()}
          type={LabelTypography.BODY_1}
          color={LabelColors.ONBACKGROUND_2}
          calssName="sendbird-openchannel-user-message-word"
        >
          {` ${stringSet.MESSAGE_EDITED} `}
        </Label>,
      );
    }
    return matchedMessage;
  }, [message, message.updatedAt]);

  // place context menu top depending clientHeight of message component
  useEffect(() => {
    if (messageRef?.current?.clientHeight > 36) {
      setContextStyle({ top: '8px ' });
    } else {
      setContextStyle({ top: '2px' });
    }
  }, [window.innerWidth]);

  return (
    <div
      data-testid="sendbird-openchannel-user-message"
      className={[
        ...(Array.isArray(className) ? className : [className]),
        'sendbird-openchannel-user-message',
      ].join(' ')}
      ref={messageRef}
    >
      <div className="sendbird-openchannel-user-message__left">
        {
          !chainTop && (
            <ContextMenu
              menuTrigger={(toggleDropdown) => (
                <Avatar
                  className="sendbird-openchannel-user-message__left__avatar"
                  src={sender.profileUrl || ''}
                  ref={avatarRef}
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
                  parentRef={avatarRef}
                  parentContainRef={avatarRef}
                  closeDropdown={closeDropdown}
                  style={{ paddingTop: 0, paddingBottom: 0 }}
                >
                  {
                    renderUserProfile
                    ? (
                      renderUserProfile({
                        user: sender,
                        close: closeDropdown,
                      })
                    )
                    : (
                      <UserProfile
                        user={sender}
                        onSuccess={closeDropdown}
                        disableMessaging
                      />
                    )
                  }
                </MenuItems>
              )}
            />
          )
        }
      </div>
      <div className="sendbird-openchannel-user-message__right">
        {
          !chainTop && (
            <div className="sendbird-openchannel-user-message__right__top">
              <Label
                className="sendbird-openchannel-user-message__right__top__sender-name"
                type={LabelTypography.CAPTION_2}
                color={isOperator ? LabelColors.SECONDARY_3 : LabelColors.ONBACKGROUND_2}
              >
                {
                  sender && (
                    sender.friendName
                    || sender.nickname
                    || sender.userId
                  )
                }
              </Label>
              <Label
                className="sendbird-openchannel-user-message__right__top__sent-at"
                type={LabelTypography.CAPTION_3}
                color={LabelColors.ONBACKGROUND_3}
              >
                {
                  message?.createdAt && (
                    format(message?.createdAt, 'p', {
                      locale: dateLocale,
                    })
                  )
                }
              </Label>
            </div>
          )
        }
        <div className="sendbird-openchannel-user-message__right__bottom">
          <Label
            className="sendbird-openchannel-user-message__right__bottom__message"
            type={LabelTypography.BODY_1}
            color={LabelColors.ONBACKGROUND_1}
          >
            {MemoizedMessageText()}
          </Label>
        </div>
        {
          (isPending || isFailed) && (
            <div className="sendbird-openchannel-user-message__right__tail">
              {
                isPending && (
                  <Loader
                    width="16px"
                    height="16px"
                  >
                    <Icon
                      className="sendbird-openchannel-user-message__right__tail__pending"
                      type={IconTypes.SPINNER}
                      fillColor={IconColors.PRIMARY}
                      width="16px"
                      height="16px"
                    />
                  </Loader>
                )
              }
              {
                isFailed && (
                  <Icon
                    className="sendbird-openchannel-user-message__right__tail__failed"
                    type={IconTypes.ERROR}
                    fillColor={IconColors.ERROR}
                    width="16px"
                    height="16px"
                  />
                )
              }
            </div>
          )
        }
      </div>
      {
        <div
          className="sendbird-openchannel-user-message__context-menu"
          ref={contextMenuRef}
          style={contextStyle}
        >
          <ContextMenu
            menuTrigger={(toggleDropdown) => (
              showMenuTrigger({ message: message, userId: userId, status: status}) && (
                <IconButton
                  className="sendbird-openchannel-user-message__context-menu--icon"
                  width="32px"
                  height="32px"
                  onClick={() => {
                    toggleDropdown();
                  }}
                >
                  <Icon
                    type={IconTypes.MORE}
                    fillColor={IconColors.CONTENT_INVERSE}
                    width="24px"
                    height="24px"
                  />
                </IconButton>
              )
            )}
            menuItems={(closeDropdown) => (
              <MenuItems
                parentRef={contextMenuRef}
                parentContainRef={contextMenuRef}
                closeDropdown={closeDropdown}
                openLeft
              >
                {
                  isFineCopy({ message: message, userId: userId, status: status }) && (
                    <MenuItem
                      className="sendbird-openchannel-user-message__context-menu__copy"
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
                  isFineEdit({ message: message, userId: userId, status: status }) && (
                    <MenuItem
                      className="sendbird-openchannel-user-message__context-menu__edit"
                      onClick={() => {
                        if (disabled) {
                          return;
                        }
                        showEdit(true);
                        closeDropdown();
                      }}
                    >
                      {stringSet.CONTEXT_MENU_DROPDOWN__EDIT}
                    </MenuItem>
                  )
                }
                {
                  isFineResend({ message: message, userId: userId, status: status }) && (
                    <MenuItem
                      className="sendbird-openchannel-user-message__context-menu__resend"
                      onClick={() => {
                        resendMessage(message);
                        closeDropdown();
                      }}
                    >
                      {stringSet.CONTEXT_MENU_DROPDOWN__RESEND}
                    </MenuItem>
                  )
                }
                {
                  isFineDelete({ message: message, userId: userId, status: status }) && (
                    <MenuItem
                      className="sendbird-openchannel-user-message__context-menu__delete"
                      onClick={() => {
                        if (disabled) {
                          return;
                        }
                        showRemove(true);
                        closeDropdown();
                      }}
                    >
                      {stringSet.CONTEXT_MENU_DROPDOWN__DELETE}
                    </MenuItem>
                  )
                }
              </MenuItems>
            )}
          />
        </div>
      }
    </div>
  );
}
