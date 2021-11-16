import React, { ReactElement, useContext, useRef } from 'react';
import { FileMessage, GroupChannel, OpenChannel, UserMessage } from 'sendbird';

import ContextMenu, { MenuItems, MenuItem } from '../ContextMenu';
import Icon, { IconTypes, IconColors } from '../Icon';
import IconButton from '../IconButton';
import {
  getClassName,
  copyToClipboard,
  isUserMessage,
  isSentMessage,
  isFailedMessage,
  isPendingMessage,
} from '../../utils/index';
import { LocalizationContext } from '../../lib/LocalizationContext';

interface Props {
  className?: string | Array<string>;
  message: UserMessage | FileMessage;
  channel: GroupChannel | OpenChannel;
  isByMe?: boolean;
  disabled?: boolean;
  showEdit?: (bool: boolean) => void;
  showRemove?: (bool: boolean) => void;
  resendMessage?: (message: UserMessage | FileMessage) => void;
  setSupposedHover?: (bool: boolean) => void;
}

export default function MessageItemMenu({
  className,
  message,
  channel,
  isByMe = false,
  disabled = false,
  showEdit,
  showRemove,
  resendMessage,
  setSupposedHover,
}: Props): ReactElement {
  const { stringSet } = useContext(LocalizationContext);
  const triggerRef = useRef(null);
  const containerRef = useRef(null);

  const showMenuItemCopy: boolean = isUserMessage(message as UserMessage);
  const showMenuItemReply: boolean = false && !isFailedMessage(channel, message) && !isPendingMessage(channel, message);
  const showMenuItemEdit: boolean = (isUserMessage(message as UserMessage) && isSentMessage(channel, message) && isByMe);
  const showMenuItemResend: boolean = (isFailedMessage(channel, message) && message?.isResendable?.() && isByMe);
  const showMenuItemDelete: boolean = (isSentMessage(channel, message) && isByMe);

  if (!(showMenuItemCopy || showMenuItemEdit || showMenuItemResend || showMenuItemDelete)) {
    return null;
  }
  return (
    <div
      className={getClassName([className, 'sendbird-message-item-menu'])}
      ref={containerRef}
    >
      <ContextMenu
        menuTrigger={(toggleDropdown: () => void): ReactElement => (
          <IconButton
            className="sendbird-message-item-menu__trigger"
            ref={triggerRef}
            width="32px"
            height="32px"
            onClick={(): void => {
              toggleDropdown();
              setSupposedHover(true);
            }}
            onBlur={(): void => {
              setSupposedHover(false);
            }}
          >
            <Icon
              className="sendbird-message-item-menu__trigger__icon"
              type={IconTypes.MORE}
              fillColor={IconColors.CONTENT_INVERSE}
              width="24px"
              height="24px"
            />
          </IconButton>
        )}
        menuItems={(close: () => void): ReactElement => {
          const closeDropdown = (): void => {
            close();
            setSupposedHover(false);
          };
          return (
            <MenuItems
              className="sendbird-message-item-menu__list"
              parentRef={triggerRef}
              parentContainRef={containerRef}
              closeDropdown={closeDropdown}
              openLeft={isByMe}
            >
              {showMenuItemCopy && (
                <MenuItem
                  className="sendbird-message-item-menu__list__menu-item"
                  onClick={() => {
                    copyToClipboard((message as UserMessage)?.message);
                    closeDropdown();
                  }}
                >
                  {stringSet.MESSAGE_MENU__COPY}
                </MenuItem>
              )}
              {showMenuItemReply && (
                <MenuItem
                  className="sendbird-message-item-menu__list__menu-item"
                  onClick={() => {
                    // TODO: Add replying message logic
                    closeDropdown();
                  }}
                  disable={message?.parentMessageId > 0}
                >
                  {stringSet.MESSAGE_MENU__REPLY}
                </MenuItem>
              )}
              {showMenuItemEdit && (
                <MenuItem
                  className="sendbird-message-item-menu__list__menu-item"
                  onClick={() => {
                    if (!disabled) {
                      showEdit(true);
                      closeDropdown();
                    }
                  }}
                >
                  {stringSet.MESSAGE_MENU__EDIT}
                </MenuItem>
              )}
              {showMenuItemResend && (
                <MenuItem
                  className="sendbird-message-item-menu__list__menu-item"
                  onClick={() => {
                    if (!disabled) {
                      resendMessage(message);
                      closeDropdown();
                    }
                  }}
                >
                  {stringSet.MESSAGE_MENU__RESEND}
                </MenuItem>
              )}
              {showMenuItemDelete && (
                <MenuItem
                  className="sendbird-message-item-menu__list__menu-item"
                  onClick={() => {
                    if (!disabled) {
                      showRemove(true);
                      closeDropdown();
                    }
                  }}
                  disable={message?.threadInfo?.replyCount > 0}
                >
                  {stringSet.MESSAGE_MENU__DELETE}
                </MenuItem>
              )}
            </MenuItems>
          );
        }}
      />
    </div>
  );
}
