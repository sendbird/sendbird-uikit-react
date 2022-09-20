import React, { useContext, useRef } from 'react';
import { FileMessage } from '@sendbird/chat/message';
import format from 'date-fns/format';
import './index.scss';

import Avatar from '../Avatar';
import ContextMenu, { MenuItems, MenuItem } from '../ContextMenu';
import Label, { LabelTypography, LabelColors } from '../Label';
import Loader from '../Loader';
import Icon, { IconTypes, IconColors } from '../Icon';
import IconButton from '../IconButton';
import TextButton from '../TextButton';
import UserProfile from '../UserProfile';
import { UserProfileContext } from '../../lib/UserProfileContext';

import { useLocalization } from '../../lib/LocalizationContext';
import { checkFileType, truncate } from './utils';
import {
  checkIsPending,
  checkIsFailed,
  isFineDelete,
  isFineResend,
  showMenuTrigger,
} from '../../utils/openChannelUtils';
import { getSenderFromMessage } from '../../utils/openChannelUtils';

interface Props {
  className?: string | Array<string>;
  message: FileMessage;
  isOperator?: boolean;
  userId: string;
  disabled?: boolean;
  chainTop?: boolean;
  chainBottom?: boolean;
  showRemove(bool: boolean): void;
  resendMessage(message: FileMessage): void;
}

export default function OpenchannelFileMessage({
  className,
  message,
  isOperator,
  userId,
  disabled,
  chainTop,
  showRemove,
  resendMessage,
}: Props): JSX.Element {
  const status = message?.sendingStatus;
  const { dateLocale, stringSet } = useLocalization();
  const contextMenuRef = useRef(null);
  const avatarRef = useRef(null);
  const { disableUserProfile, renderUserProfile } = useContext(UserProfileContext);

  const openFileUrl = () => { window.open(message.url); };

  const isPending = checkIsPending(status);
  const isFailed = checkIsFailed(status);
  const sender = getSenderFromMessage(message);

  return (
    <div
      className={[
        ...(Array.isArray(className) ? className : [className]),
        'sendbird-openchannel-file-message',
      ].join(' ')}
    >
      <div className="sendbird-openchannel-file-message__left">
        {
            !chainTop && (
              <ContextMenu
                menuTrigger={(toggleDropdown) => (
                  <Avatar
                    className="sendbird-openchannel-file-message__left__avatar"
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
      <div className="sendbird-openchannel-file-message__right">
        {
          !chainTop && (
            <div className="sendbird-openchannel-file-message__right__title">
              <Label
                className="sendbird-openchannel-file-message__right__title__sender-name"
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
                className="sendbird-openchannel-file-message__right__title__sent-at"
                type={LabelTypography.CAPTION_3}
                color={LabelColors.ONBACKGROUND_3}
              >
                {
                  message?.createdAt && (
                    format(message.createdAt, 'p', {
                      locale: dateLocale,
                    })
                  )
                }
              </Label>
            </div>
          )
        }
        <div className="sendbird-openchannel-file-message__right__body">
          {
            checkFileType(message.url) && (
              <Icon
                className="sendbird-openchannel-file-message__right__body__icon"
                type={checkFileType(message.url)}
                fillColor={IconColors.PRIMARY}
                width="48px"
                height="48px"
              />
            )
          }
          <TextButton
            className="sendbird-openchannel-file-message__right__body__file-name"
            onClick={openFileUrl}
          >
            <Label
              type={LabelTypography.BODY_1}
              color={LabelColors.ONBACKGROUND_1}
            >
              {truncate(message.name || message.url, 40)}
            </Label>
          </TextButton>
        </div>
        {
          (isPending || isFailed) && (
            <div className="sendbird-openchannel-file-message__right__tail">
              {
                isPending && (
                  <Loader
                    width="16px"
                    height="16px"
                  >
                    <Icon
                      className="sendbird-openchannel-file-message__right__tail__pending"
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
                    className="sendbird-openchannel-file-message__right__tail__failed"
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
      <div
        className="sendbird-openchannel-file-message__context-menu"
        ref={contextMenuRef}
      >
        {
            <ContextMenu
              menuTrigger={(toggleDropdown) => (
                showMenuTrigger({ message, userId, status }) && (
                  <IconButton
                    className="sendbird-openchannel-file-message__context-menu__icon"
                    width="32px"
                    height="32px"
                    onClick={toggleDropdown}
                  >
                    <Icon
                      type={IconTypes.MORE}
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
                    isFineResend({ message, userId, status }) && (
                      <MenuItem
                        onClick={() => {
                          if (disabled) { return; }
                          resendMessage(message);
                          closeDropdown();
                        }}
                      >
                        {stringSet.CONTEXT_MENU_DROPDOWN__RESEND}
                      </MenuItem>
                    )
                  }
                  {
                    isFineDelete({ message, userId, status }) && (
                      <MenuItem
                        onClick={() => {
                          if (disabled) { return; }
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
        }
      </div>
    </div>
  );
}
