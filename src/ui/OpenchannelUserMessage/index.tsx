import React, {
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
  getSenderFromMessage,
} from '../../utils/openChannelUtils';
import { useMediaQueryContext } from '../../lib/MediaQueryContext';
import OpenChannelMobileMenu from '../OpenChannelMobileMenu';
import useLongPress from '../../hooks/useLongPress';
import { isEditedMessage } from '../../utils';

interface OpenChannelUserMessageProps {
  className?: string | Array<string>;
  message: UserMessage;
  isOperator?: boolean;
  isEphemeral?: boolean;
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
  isEphemeral = false,
  userId,
  resendMessage,
  disabled,
  showEdit,
  showRemove,
  chainTop,
}: OpenChannelUserMessageProps): ReactElement {
  // hooks
  const { stringSet, dateLocale } = useLocalization();
  const { disableUserProfile, renderUserProfile } = useContext(UserProfileContext);
  const messageRef = useRef(null);
  const avatarRef = useRef(null);
  const contextMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const [contextStyle, setContextStyle] = useState({});
  const [contextMenu, setContextMenu] = useState(false);

  // consts
  const status = message?.sendingStatus;
  const isPending = checkIsPending(status);
  const isFailed = checkIsFailed(status);
  const sender = getSenderFromMessage(message);

  // place context menu top depending clientHeight of message component
  useEffect(() => {
    if (messageRef?.current?.clientHeight > 36) {
      setContextStyle({ top: '8px ' });
    } else {
      setContextStyle({ top: '2px' });
    }
  }, [window.innerWidth]);

  const onLongPress = useLongPress({
    onLongPress: () => {
      setContextMenu(true);
    },
  });

  const { isMobile } = useMediaQueryContext();
  if (!message || message.messageType !== 'user') {
    return <></>;
  }

  return (
    <>
      <div
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
                    style={{ paddingTop: '0px', paddingBottom: '0px' }}
                  >
                    {
                      renderUserProfile
                        ? (
                          renderUserProfile({
                            user: sender,
                            close: closeDropdown,
                            currentUserId: userId,
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
          <div
            {...(isMobile ? { ...onLongPress } : {})}
            className="sendbird-openchannel-user-message__right__bottom" ref={mobileMenuRef}>
            <Label
              className="sendbird-openchannel-user-message__right__bottom__message"
              type={LabelTypography.BODY_1}
              color={LabelColors.ONBACKGROUND_1}
            >
              {message?.message}
              {isEditedMessage(message) && (
                <Label
                  key={uuidv4()}
                  type={LabelTypography.BODY_1}
                  color={LabelColors.ONBACKGROUND_2}
                  calssName="sendbird-openchannel-user-message-word"
                >
                  {` ${stringSet.MESSAGE_EDITED} `}
                </Label>
              )}
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
          !isMobile && (
            <div
              className="sendbird-openchannel-user-message__context-menu"
              ref={contextMenuRef}
              style={contextStyle}
            >
              <ContextMenu
                menuTrigger={(toggleDropdown) => (
                  showMenuTrigger({ message: message, userId: userId, status: status }) && (
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
                          dataSbId="open_channel_user_message_menu_copy"
                        >
                          {stringSet.CONTEXT_MENU_DROPDOWN__COPY}
                        </MenuItem>
                      )
                    }
                    {
                      (!isEphemeral && isFineEdit({ message: message, userId: userId, status: status })) && (
                        <MenuItem
                          className="sendbird-openchannel-user-message__context-menu__edit"
                          onClick={() => {
                            if (disabled) {
                              return;
                            }
                            showEdit(true);
                            closeDropdown();
                          }}
                          dataSbId="open_channel_user_message_menu_edit"
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
                          dataSbId="open_channel_user_message_menu_resend"
                        >
                          {stringSet.CONTEXT_MENU_DROPDOWN__RESEND}
                        </MenuItem>
                      )
                    }
                    {
                      (!isEphemeral && isFineDelete({ message: message, userId: userId, status: status })) && (
                        <MenuItem
                          className="sendbird-openchannel-user-message__context-menu__delete"
                          onClick={() => {
                            if (disabled) {
                              return;
                            }
                            showRemove(true);
                            closeDropdown();
                          }}
                          dataSbId="open_channel_user_message_menu_delete"
                        >
                          {stringSet.CONTEXT_MENU_DROPDOWN__DELETE}
                        </MenuItem>
                      )
                    }
                  </MenuItems>
                )}
              />
            </div>

          )
        }
      </div>
      {
        contextMenu && (
          <OpenChannelMobileMenu
            message={message}
            parentRef={mobileMenuRef}
            hideMenu={() => {
              setContextMenu(false);
            }}
            showRemove={() => {
              setContextMenu(false);
              showRemove(true);
            }}
            showEdit={() => {
              setContextMenu(false);
              showEdit(true);
            }}
            copyToClipboard={() => {
              setContextMenu(false);
              copyToClipboard(message?.message);
            }}
            resendMessage={() => {
              setContextMenu(false);
              resendMessage(message);
            }}
          />
        )
      }
    </>
  );
}
