import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useContext,
} from 'react';
import { FileMessage } from '@sendbird/chat/message';
import format from 'date-fns/format';
import './index.scss';
import { SUPPORTING_TYPES, getSupportingFileType } from './utils';
import { useLocalization } from '../../lib/LocalizationContext';

import Avatar from '../Avatar';
import ContextMenu, { MenuItems, MenuItem } from '../ContextMenu';
import Icon, { IconTypes, IconColors } from '../Icon';
import IconButton from '../IconButton';
import ImageRenderer from '../ImageRenderer';
import Label, { LabelTypography, LabelColors } from '../Label';
import Loader from '../Loader';
import UserProfile from '../UserProfile';
import { UserProfileContext } from '../../lib/UserProfileContext';
import {
  checkIsSent,
  checkIsPending,
  checkIsFailed,
  isFineResend,
  isFineDelete,
  showMenuTrigger,
  getSenderFromMessage,
} from '../../utils/openChannelUtils';
import { useMediaQueryContext } from '../../lib/MediaQueryContext';
import OpenChannelMobileMenu from '../OpenChannelMobileMenu';
import useLongPress from '../../hooks/useLongPress';

interface LocalUrl {
  localUrl?: string;
}
interface OpenChannelThumbnailMessageProps {
  className?: string | Array<string>;
  message: FileMessage;
  isOperator?: boolean;
  isEphemeral?: boolean;
  disabled: boolean;
  userId: string;
  chainTop: boolean;
  chainBottom: boolean;
  onClick(bool: boolean): void,
  showRemove(bool: boolean): void,
  resendMessage(message: FileMessage): void;
}

export default function OpenchannelThumbnailMessage({
  className,
  message,
  isOperator,
  isEphemeral = false,
  disabled,
  userId,
  chainTop,
  onClick,
  showRemove,
  resendMessage,
}: OpenChannelThumbnailMessageProps): JSX.Element {
  const {
    type,
    url,
    thumbnails,
    localUrl,
  }: FileMessage & LocalUrl = message;
  const status = message?.sendingStatus;
  const thumbnailUrl = (thumbnails && thumbnails.length > 0 && thumbnails[0].url) || null;
  const { stringSet, dateLocale } = useLocalization();
  const { disableUserProfile, renderUserProfile } = useContext(UserProfileContext);
  const [messageWidth, setMessageWidth] = useState(360);
  const [contextMenu, setContextMenu] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef(null);
  const contextMenuRef = useRef(null);
  const avatarRef = useRef(null);
  const onLongPress = useLongPress({
    onLongPress: () => { setContextMenu(true); },
    onClick: () => { onClick(true); },
  });
  const { isMobile } = useMediaQueryContext();

  const memorizedThumbnailPlaceHolder = useMemo(() => (type) => ({ style }) => ( // eslint-disable-line
    <div style={style}>
      <Icon
        type={type}
        fillColor={IconColors.ON_BACKGROUND_2}
        width="56px"
        height="56px"
      />
    </div>
  ), []);

  const isMessageSent = checkIsSent(status);
  const isPending = checkIsPending(status);
  const isFailed = checkIsFailed(status);
  const sender = getSenderFromMessage(message);

  useEffect(() => {
    const thumbnailWidth = (messageRef?.current?.clientWidth ?? 0) - 80;
    setMessageWidth(thumbnailWidth > 360 ? 360 : thumbnailWidth);
  }, []);

  return (
    <>
      <div
        className={[
          ...(Array.isArray(className) ? className : [className]),
          'sendbird-openchannel-thumbnail-message',
        ].join(' ')}
        ref={messageRef}
      >
        <div className="sendbird-openchannel-thumbnail-message__left">
          {
            !chainTop && (
              <ContextMenu
                menuTrigger={(toggleDropdown) => (
                  <Avatar
                    className="sendbird-openchannel-thumbnail-message__left__avatar"
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
                  renderUserProfile
                    ? (
                      renderUserProfile({
                        user: sender,
                        close: closeDropdown,
                        currentUserId: userId,
                        avatarRef,
                      })
                    )
                    : (
                      <MenuItems
                        parentRef={avatarRef}
                        parentContainRef={avatarRef}
                        closeDropdown={closeDropdown}
                        style={{ paddingTop: '0px', paddingBottom: '0px' }}
                      >
                        <UserProfile
                          user={sender}
                          onSuccess={closeDropdown}
                          disableMessaging
                        />
                      </MenuItems>
                    )
                )}
              />
            )
          }
        </div>
        <div className="sendbird-openchannel-thumbnail-message__right">
          {
            !chainTop && (
              <div className="sendbird-openchannel-thumbnail-message__right__title">
                <Label
                  className="sendbird-openchannel-thumbnail-message__right__title__sender-name"
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
                  className="sendbird-openchannel-thumbnail-message__right__title__sent-at"
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
          <div className="sendbird-openchannel-thumbnail-message__right__body" ref={mobileMenuRef}>
            <div
              className="sendbird-openchannel-thumbnail-message__right__body__wrap"
              role="button"
              onClick={() => {
                if (isMessageSent) {
                  onClick(true);
                }
              }}
              onKeyDown={() => {
                if (isMessageSent) {
                  onClick(true);
                }
              }}
              tabIndex={0}
              {...(isMobile ? { ...onLongPress } : {})}
            >
              <div className="sendbird-openchannel-thumbnail-message__right__body__wrap__overlay" />
              {
                {
                  [SUPPORTING_TYPES.VIDEO]: (
                    (url || localUrl)
                      ? (
                        <div className="sendbird-openchannel-thumbnail-message__right__body__wrap__video" >
                          {
                            (thumbnailUrl)
                              ? (
                                <ImageRenderer
                                  className="sendbird-openchannel-thumbnail-message__right__body__wrap__video"
                                  url={thumbnailUrl}
                                  width={messageWidth}
                                  height="270px"
                                  alt="image"
                                  placeHolder={memorizedThumbnailPlaceHolder(IconTypes.PLAY)}
                                />
                              )
                              : (
                                <video className="sendbird-openchannel-thumbnail-message__right__body__wrap__video__video">
                                  <source src={url || localUrl} type={type} />
                                </video>
                              )
                          }
                          <Icon
                            className="sendbird-openchannel-thumbnail-message__right__body__wrap__video__icon"
                            type={IconTypes.PLAY}
                            fillColor={IconColors.ON_BACKGROUND_2}
                            width="56px"
                            height="56px"
                          />
                        </div>
                      )
                      : (
                        <Icon
                          className="sendbird-openchannel-thumbnail-message__right__body__wrap__video--icon"
                          type={IconTypes.PHOTO}
                          fillColor={IconColors.ON_BACKGROUND_2}
                          width="56px"
                          height="56px"
                        />
                      )
                  ),
                  [SUPPORTING_TYPES.IMAGE]: (
                    (url || localUrl)
                      ? (
                        <ImageRenderer
                          className="sendbird-openchannel-thumbnail-message__right__body__wrap__image"
                          url={thumbnailUrl || url || localUrl}
                          alt="image"
                          width={messageWidth}
                          height="270px"
                          placeHolder={memorizedThumbnailPlaceHolder(IconTypes.PHOTO)}
                        />
                      )
                      : (
                        <Icon
                          className="sendbird-openchannel-thumbnail-message__right__body__wrap__image--icon"
                          type={IconTypes.PHOTO}
                          fillColor={IconColors.ON_BACKGROUND_2}
                          width="56px"
                          height="56px"
                        />
                      )
                  ),
                  [SUPPORTING_TYPES.UNSUPPORTED]: (
                    <Icon
                      className="sendbird-openchannel-thumbnail-message__right__body__wrap__unknown"
                      type={IconTypes.PHOTO}
                      fillColor={IconColors.ON_BACKGROUND_2}
                      width="56px"
                      height="56px"
                    />
                  ),
                }[getSupportingFileType(type)]
              }
            </div>
          </div>
          {
            (isPending || isFailed) && (
              <div className="sendbird-openchannel-thumbnail-message__right__tail">
                {
                  isPending && (
                    <Loader
                      width="16px"
                      height="16px"
                    >
                      <Icon
                        className="sendbird-openchannel-thumbnail-message__right__tail__pending"
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
                      className="sendbird-openchannel-thumbnail-message__right__tail__failed"
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
              className="sendbird-openchannel-thumbnail-message__context-menu"
              ref={contextMenuRef}
            >
              {
                (isFineResend({ message, userId, status }) || !isEphemeral) && (
                  <ContextMenu
                    menuTrigger={(toggleDropdown) => (
                      showMenuTrigger({ message, userId, status }) && (
                        <IconButton
                          className="sendbird-openchannel-thumbnail-message__context-menu--icon"
                          width="32px"
                          height="32px"
                          onClick={toggleDropdown}
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
                          isFineResend({ message, userId, status }) && (
                            <MenuItem
                              onClick={() => {
                                resendMessage(message);
                                closeDropdown();
                              }}
                              dataSbId="open_channel_thumbnail_message_menu_resend"
                            >
                              {stringSet.CONTEXT_MENU_DROPDOWN__RESEND}
                            </MenuItem>
                          )
                        }
                        {
                          (!isEphemeral && isFineDelete({ message, userId, status })) && (
                            <MenuItem
                              onClick={() => {
                                if (disabled) {
                                  return;
                                }
                                showRemove(true);
                                closeDropdown();
                              }}
                              dataSbId="open_channel_thumbnail_message_menu_delete"
                            >
                              {stringSet.CONTEXT_MENU_DROPDOWN__DELETE}
                            </MenuItem>
                          )
                        }
                      </MenuItems>
                    )}
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
