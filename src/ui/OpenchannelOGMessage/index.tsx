import React, { useState, useContext, useMemo, useRef, useEffect } from 'react';
import { UserMessage } from '@sendbird/chat/message';
import format from 'date-fns/format';
import './index.scss';

import Avatar from '../Avatar';
import ContextMenu, { MenuItems, MenuItem } from '../ContextMenu';
import Icon, { IconTypes, IconColors } from '../Icon';
import IconButton from '../IconButton';
import ImageRenderer from '../ImageRenderer';
import LinkLabel from '../LinkLabel';
import Label, { LabelTypography, LabelColors } from '../Label';
import Loader from '../Loader';
import UserProfile from '../UserProfile';
import Word from '../Word';
import { UserProfileContext } from '../../lib/UserProfileContext';

import uuidv4 from '../../utils/uuid';
import { copyToClipboard } from '../OpenchannelUserMessage/utils';
import { useLocalization } from '../../lib/LocalizationContext';
import { checkOGIsEnalbed } from './utils';
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
import useSendbirdStateContext from '../../hooks/useSendbirdStateContext';
import { useMediaQueryContext } from '../../lib/MediaQueryContext';
import useLongPress from '../../hooks/useLongPress';
import OpenChannelMobileMenu from '../OpenChannelMobileMenu';

interface Props {
  message: UserMessage;
  isOperator?: boolean;
  className?: string | Array<string>;
  disabled?: boolean;
  showEdit(bool: boolean): void;
  showRemove(bool: boolean): void;
  resendMessage(message: UserMessage): void;
  chainTop?: boolean;
  chainBottom?: boolean;
  userId: string;
}

export default function OpenchannelOGMessage({
  message,
  isOperator,
  className,
  disabled,
  showEdit,
  showRemove,
  resendMessage,
  chainTop,
  userId,
}: Props): JSX.Element {
  if (!message || message.messageType !== 'user') {
    return null;
  }

  const openLink = () => {
    if (checkOGIsEnalbed(message)) {
      const { url } = ogMetaData;
      window.open(url);
    }
  };

  const status = message?.sendingStatus;
  const { ogMetaData } = message;
  const { defaultImage } = ogMetaData;
  const sdk = useSendbirdStateContext?.()?.stores?.sdkStore?.sdk;
  const { stringSet, dateLocale } = useLocalization();
  const { disableUserProfile, renderUserProfile } = useContext<UserProfileContext>(UserProfileContext);
  const [contextStyle, setContextStyle] = useState({});
  const [contextMenu, setContextMenu] = useState(false);
  const onLongPress = useLongPress({
    onLongPress: () => setContextMenu(true),
    onClick: openLink,
  }, { delay: 300 });
  const messageComponentRef = useRef(null);
  const contextMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const avatarRef = useRef(null);

  const isPending = checkIsPending(status);
  const isFailed = checkIsFailed(status);
  const sender = getSenderFromMessage(message);
  const { isMobile } = useMediaQueryContext();

  const MemoizedMessageText = useMemo(() => () => {
    const wordClassName = 'sendbird-openchannel-og-message--word';
    const splitMessage = message.message.split(' ');
    const matchedMessage = splitMessage
      .map((word) => (
        <Word
          key={uuidv4()}
          word={word}
          message={message}
          isByMe={message?.sender?.userId === sdk?.currentUser?.userId}
        />
      ));

    if (message.updatedAt > 0) {
      matchedMessage.push(
        <Label
          key={uuidv4()}
          className={wordClassName}
          type={LabelTypography.BODY_1}
          color={LabelColors.ONBACKGROUND_2}
        >
          {stringSet.MESSAGE_EDITED}
        </Label>,
      );
    }

    return matchedMessage;
  }, [message, message.updatedAt]);

  // place conxt menu top depending clientHeight of message component
  useEffect(() => {
    if (messageComponentRef?.current?.clientHeight > 36) {
      setContextStyle({ top: '8px ' });
    } else {
      setContextStyle({ top: '2px' });
    }
  }, [window.innerWidth]);

  return (
    <div
      className={[
        ...(Array.isArray(className) ? className : [className]),
        'sendbird-openchannel-og-message',
      ].join(' ')}
      ref={messageComponentRef}
    >
      <div
        className="sendbird-openchannel-og-message__top"
      >
        <div className="sendbird-openchannel-og-message__top__left">
          {
            !chainTop && (
              <ContextMenu
                menuTrigger={(toggleDropdown) => (
                  <Avatar
                    className="sendbird-openchannel-og-message__top__left__avatar"
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
        <div className="sendbird-openchannel-og-message__top__right">
          {
            !chainTop && (
              <div className="sendbird-openchannel-og-message__top__right__title">
                <Label
                  className="sendbird-openchannel-og-message__top__right__title__sender-name"
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
                  className="sendbird-openchannel-og-message__top__right__title__sent-at"
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
          <div className="sendbird-openchannel-og-message__top__right__description">
            <Label
              className="sendbird-openchannel-og-message__top__right__description__message"
              type={LabelTypography.BODY_1}
              color={LabelColors.ONBACKGROUND_1}
            >
              {MemoizedMessageText()}
            </Label>
          </div>
        </div>
        {
          !isMobile && (
            <div
              className="sendbird-openchannel-og-message__top__context-menu"
              ref={contextMenuRef}
              style={contextStyle}
            >
              <ContextMenu
                menuTrigger={(toggleDropdown) => (
                  showMenuTrigger({ message: message, userId: userId, status: status }) && (
                    <IconButton
                      className="sendbird-openchannel-og-message__top__context-menu--icon"
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
                      isFineCopy({ message, userId, status }) && (
                        <MenuItem
                          className="sendbird-openchannel-og-message__top__context-menu__copy"
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
                      isFineEdit({ message, userId, status }) && (
                        <MenuItem
                          className="sendbird-openchannel-og-message__top__context-menu__edit"
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
                      isFineResend({ message, userId, status }) && (
                        <MenuItem
                          className="sendbird-openchannel-og-message__top__context-menu__resend"
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
                      isFineDelete({ message, userId, status }) && (
                        <MenuItem
                          className="sendbird-openchannel-og-message__top__context-menu__delete"
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
          )
        }
      </div>
      <div className="sendbird-openchannel-og-message__bottom">
        <div className="sendbird-openchannel-og-message__bottom__og-tag" ref={mobileMenuRef}>
          {
            ogMetaData.url && (
              <Label
                className="sendbird-openchannel-og-message__bottom__og-tag__url"
                type={LabelTypography.CAPTION_3}
                color={LabelColors.ONBACKGROUND_2}
              >
                {ogMetaData.url}
              </Label>
            )
          }
          {
            ogMetaData.title && (
              <LinkLabel
                className="sendbird-openchannel-og-message__bottom__og-tag__title"
                src={ogMetaData.url}
                type={LabelTypography.SUBTITLE_2}
                color={LabelColors.PRIMARY}
              >
                {
                  ogMetaData.title
                }
              </LinkLabel>
            )
          }
          {
            ogMetaData.description && (
              <Label
                className="sendbird-openchannel-og-message__bottom__og-tag__description"
                type={LabelTypography.BODY_2}
                color={LabelColors.ONBACKGROUND_1}
              >
                {ogMetaData.description}
              </Label>
            )
          }
          {
            ogMetaData.url && (
              <div
                className="sendbird-openchannel-og-message__bottom__og-tag__thumbnail"
                role="button"
                onClick={openLink}
                onKeyDown={openLink}
                tabIndex={0}
                {...(isMobile ? { ...onLongPress } : {})}
              >
                {
                  defaultImage && (
                    <ImageRenderer
                      className="sendbird-openchannel-og-message__bottom__og-tag__thumbnail__image"
                      url={defaultImage.url || ''}
                      alt={defaultImage.alt || ''}
                      height="189px"
                      defaultComponent={(
                        <div className="sendbird-openchannel-og-message__bottom__og-tag__thumbnail__image--placeholder">
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
            )
          }
        </div>
        {
          (isPending || isFailed) && (
            <div className="sendbird-openchannel-og-message__top__right__tail">
              {
                isPending && (
                  <Loader
                    width="16px"
                    height="16px"
                  >
                    <Icon
                      className="sendbird-openchannel-og-message__top__right__tail__pending"
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
                    className="sendbird-openchannel-og-message__top__right__tail__failed"
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
    </div>
  );
}
