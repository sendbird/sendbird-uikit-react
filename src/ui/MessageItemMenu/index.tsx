import './index.scss';
import React, { ReactElement, useContext, useRef } from 'react';
import type { UserMessage } from '@sendbird/chat/message';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import type { OpenChannel } from '@sendbird/chat/openChannel';

import ContextMenu, { MenuItems, MenuItem, MenuItemProps } from '../ContextMenu';
import Icon, { IconTypes, IconColors } from '../Icon';
import IconButton from '../IconButton';
import {
  getClassName,
  copyToClipboard,
  isUserMessage,
  isSentMessage,
  isFailedMessage,
  isPendingMessage,
  SendableMessageType,
} from '../../utils/index';
import { LocalizationContext } from '../../lib/LocalizationContext';
import { Role } from '../../lib/Sendbird/types';
import { ReplyType } from '../../types';
import { deleteNullish } from '../../utils/utils';

export interface MessageMenuRenderMenuItemProps extends Omit<MenuItemProps, 'children' | 'className'> {
  className?: string;
  text: string;
}
export interface MessageMenuProps {
  className?: string | Array<string>;
  message: SendableMessageType;
  channel: GroupChannel | OpenChannel | null;
  isByMe?: boolean;
  disabled?: boolean;
  replyType?: ReplyType;
  disableDeleteMessage?: boolean;
  showEdit?: (bool: boolean) => void;
  showRemove?: (bool: boolean) => void;
  deleteMessage?: (message: SendableMessageType) => void;
  resendMessage?: (message: SendableMessageType) => void;
  setQuoteMessage?: (message: SendableMessageType) => void;
  setSupposedHover?: (bool: boolean) => void;
  onReplyInThread?: (props: { message: SendableMessageType }) => void;
  onMoveToParentMessage?: () => void;
  renderMenuItem?: (props: MessageMenuRenderMenuItemProps) => ReactElement;
}

export function MessageMenu(props: MessageMenuProps): ReactElement | null {
  const {
    className,
    message,
    channel,
    isByMe = false,
    disabled = false,
    replyType,
    disableDeleteMessage = null,
    showEdit,
    showRemove,
    deleteMessage,
    resendMessage,
    setQuoteMessage,
    setSupposedHover,
    onReplyInThread,
    onMoveToParentMessage = null,
  } = props;

  const { renderMenuItem = (props: MessageMenuRenderMenuItemProps) => <MenuItem {...props}>{props.text}</MenuItem> } = deleteNullish(props);

  const { stringSet } = useContext(LocalizationContext);
  const triggerRef = useRef(null);
  const containerRef = useRef(null);

  const showMenuItemCopy: boolean = isUserMessage(message as UserMessage);
  const showMenuItemEdit: boolean = (!channel?.isEphemeral && isUserMessage(message as UserMessage) && isSentMessage(message) && isByMe);
  const showMenuItemResend: boolean = (isFailedMessage(message) && message?.isResendable && isByMe);
  const showMenuItemDelete: boolean = !channel?.isEphemeral && !isPendingMessage(message) && isByMe;
  const showMenuItemOpenInChannel: boolean = onMoveToParentMessage !== null;
  /**
   * TODO: Manage timing issue
   * User delete pending message -> Sending message success
   */
  const isReplyTypeEnabled = !isFailedMessage(message)
    && !isPendingMessage(message)
    && (channel?.isGroupChannel?.()
      && !channel?.isEphemeral
      && (
        ((channel as GroupChannel)?.isBroadcast && channel?.myRole === Role.OPERATOR)
        || !(channel as GroupChannel)?.isBroadcast
      ));
  const showMenuItemReply = isReplyTypeEnabled && replyType === 'QUOTE_REPLY';
  const showMenuItemThread = isReplyTypeEnabled && replyType === 'THREAD' && !message?.parentMessageId && onReplyInThread;

  if (!(showMenuItemCopy
    || showMenuItemReply
    || showMenuItemThread
    || showMenuItemOpenInChannel
    || showMenuItemEdit
    || showMenuItemResend
    || showMenuItemDelete
  )) {
    return null;
  }
  return (
    <div
      className={getClassName([className ?? '', 'sendbird-message-item-menu'])}
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
              setSupposedHover?.(true);
            }}
            onBlur={(): void => {
              setSupposedHover?.(false);
            }}
          >
            <Icon
              className="sendbird-message-item-menu__trigger__icon"
              testID="sendbird-message-item-menu__trigger__icon"
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
            setSupposedHover?.(false);
          };
          return (
            <MenuItems
              className="sendbird-message-item-menu__list"
              testID="sendbird-message-item-menu__list"
              parentRef={triggerRef}
              parentContainRef={containerRef}
              closeDropdown={closeDropdown}
              openLeft={isByMe}
            >
              {showMenuItemCopy && (
                renderMenuItem({
                  className: 'sendbird-message-item-menu__list__menu-item menu-item-copy',
                  onClick: () => {
                    copyToClipboard((message as UserMessage)?.message);
                    closeDropdown();
                  },
                  dataSbId: 'ui_message_item_menu_copy',
                  text: stringSet.MESSAGE_MENU__COPY,
                })
              )}
              {showMenuItemReply && (
                renderMenuItem({
                  className: 'sendbird-message-item-menu__list__menu-item menu-item-reply',
                  onClick: () => {
                    setQuoteMessage?.(message);
                    closeDropdown();
                  },
                  disable: message?.parentMessageId > 0,
                  dataSbId: 'ui_message_item_menu_reply',
                  text: stringSet.MESSAGE_MENU__REPLY,
                })
              )}
              {showMenuItemThread && (
                renderMenuItem({
                  className: 'sendbird-message-item-menu__list__menu-item menu-item-thread',
                  onClick: () => {
                    onReplyInThread?.({ message });
                    closeDropdown();
                  },
                  dataSbId: 'ui_message_item_menu_thread',
                  text: stringSet.MESSAGE_MENU__THREAD,
                })
              )}
              {showMenuItemOpenInChannel && (
                renderMenuItem({
                  className: 'sendbird-message-item-menu__list__menu-item menu-item-open-channel',
                  onClick: () => {
                    onMoveToParentMessage?.();
                    closeDropdown();
                  },
                  dataSbId: 'ui_message_item_menu_open_in_channel',
                  text: stringSet.MESSAGE_MENU__OPEN_IN_CHANNEL,
                })
              )}
              {showMenuItemEdit && (
                renderMenuItem({
                  className: 'sendbird-message-item-menu__list__menu-item menu-item-edit',
                  onClick: () => {
                    if (!disabled) {
                      showEdit?.(true);
                      closeDropdown();
                    }
                  },
                  dataSbId: 'ui_message_item_menu_edit',
                  text: stringSet.MESSAGE_MENU__EDIT,
                })
              )}
              {showMenuItemResend && (
                renderMenuItem({
                  className: 'sendbird-message-item-menu__list__menu-item menu-item-resend',
                  onClick: () => {
                    if (!disabled) {
                      resendMessage?.(message);
                      closeDropdown();
                    }
                  },
                  dataSbId: 'ui_message_item_menu_resend',
                  text: stringSet.MESSAGE_MENU__RESEND,
                })
              )}
              {showMenuItemDelete && (
                renderMenuItem({
                  className: 'sendbird-message-item-menu__list__menu-item menu-item-delete',
                  onClick: () => {
                    if (isFailedMessage(message)) {
                      deleteMessage?.(message);
                    } else if (!disabled) {
                      showRemove?.(true);
                      closeDropdown();
                    }
                  },
                  disable: (
                    typeof disableDeleteMessage === 'boolean'
                      ? disableDeleteMessage
                      : (message?.threadInfo?.replyCount ?? 0) > 0
                  ),
                  dataSbId: 'ui_message_item_menu_delete',
                  text: stringSet.MESSAGE_MENU__DELETE,
                })
              )}
            </MenuItems>
          );
        }}
      />
    </div>
  );
}

// MessageItemMenu - legacy name
export default MessageMenu;
