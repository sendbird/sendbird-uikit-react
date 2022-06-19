import './index.scss';
import React, { ReactElement, useContext, useRef } from 'react';
import type { FileMessage, UserMessage } from '@sendbird/chat/message';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import type { OpenChannel } from '@sendbird/chat/openChannel';

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
import { ReplyType } from '../../index';

interface Props {
  className?: string | Array<string>;
  message: UserMessage | FileMessage;
  channel: GroupChannel | OpenChannel;
  isByMe?: boolean;
  disabled?: boolean;
  replyType?: ReplyType;
  showEdit?: (bool: boolean) => void;
  showRemove?: (bool: boolean) => void;
  resendMessage?: (message: UserMessage | FileMessage) => void;
  setQuoteMessage?: (message: UserMessage | FileMessage) => void;
  setSupposedHover?: (bool: boolean) => void;
}

export default function MessageItemMenu({
  className,
  message,
  channel,
  isByMe = false,
  disabled = false,
  replyType,
  showEdit,
  showRemove,
  resendMessage,
  setQuoteMessage,
  setSupposedHover,
}: Props): ReactElement {
  const { stringSet } = useContext(LocalizationContext);
  const triggerRef = useRef(null);
  const containerRef = useRef(null);

  const showMenuItemCopy: boolean = isUserMessage(message as UserMessage);
  const showMenuItemEdit: boolean = (isUserMessage(message as UserMessage) && isSentMessage(message) && isByMe);
  const showMenuItemResend: boolean = (isFailedMessage(message) && message?.isResendable && isByMe);
  const showMenuItemDelete: boolean = !isPendingMessage(message) && isByMe;
  /**
   * TODO: Manage timing issue
   * User delete pending message -> Sending message success
   */
  const showMenuItemReply: boolean = (replyType === 'QUOTE_REPLY')
    && !isFailedMessage(message)
    && !isPendingMessage(message)
    && (channel?.isGroupChannel() && !(channel as GroupChannel)?.isBroadcast);

  if (!(showMenuItemCopy || showMenuItemReply || showMenuItemEdit || showMenuItemResend || showMenuItemDelete)) {
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
                  className="sendbird-message-item-menu__list__menu-item menu-item-copy"
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
                  className="sendbird-message-item-menu__list__menu-item menu-item-reply"
                  onClick={() => {
                    setQuoteMessage(message);
                    closeDropdown();
                  }}
                  disable={message?.parentMessageId > 0}
                >
                  {stringSet.MESSAGE_MENU__REPLY}
                </MenuItem>
              )}
              {showMenuItemEdit && (
                <MenuItem
                  className="sendbird-message-item-menu__list__menu-item menu-item-edit"
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
                  className="sendbird-message-item-menu__list__menu-item menu-item-resend"
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
                  className="sendbird-message-item-menu__list__menu-item menu-item-delete"
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
