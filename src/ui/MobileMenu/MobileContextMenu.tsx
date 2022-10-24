import React from 'react';
import type { BaseMenuProps } from './types';
import type { UserMessage } from '@sendbird/chat/message';
import type { GroupChannel } from '@sendbird/chat/groupChannel';

import ContextMenu, { MenuItems, MenuItem } from '../ContextMenu';

import {
  isFailedMessage,
  isPendingMessage,
  isSentMessage,
  isUserMessage,
  copyToClipboard,
} from '../../utils';
import { useLocalization } from '../../lib/LocalizationContext';
import Icon, { IconTypes, IconColors } from '../Icon';
import Label, { LabelTypography } from '../Label';

const MobileContextMenu: React.FunctionComponent<BaseMenuProps> = (props: BaseMenuProps) => {
  const {
    hideMenu,
    channel,
    message,
    replyType,
    userId,
    resendMessage,
    showEdit,
    showRemove,
    setQuoteMessage,
    parentRef,
  } = props;
  const isByMe = message?.sender?.userId === userId;
  const { stringSet } = useLocalization();
  const showMenuItemCopy: boolean = isUserMessage(message as UserMessage);
  const showMenuItemEdit: boolean = (isUserMessage(message as UserMessage) && isSentMessage(message) && isByMe);
  const showMenuItemResend: boolean = (isFailedMessage(message) && message?.isResendable && isByMe);
  const showMenuItemDelete: boolean = !isPendingMessage(message) && isByMe;
  const showMenuItemReply: boolean = (replyType === 'QUOTE_REPLY')
    && !isFailedMessage(message)
    && !isPendingMessage(message)
    && (channel?.isGroupChannel() && !(channel as GroupChannel)?.isBroadcast);

  return (
    <ContextMenu
      isOpen
      menuItems={() => (
        <MenuItems
          className="sendbird-message__mobile-context-menu"
          parentRef={parentRef}
          parentContainRef={parentRef}
          closeDropdown={hideMenu}
        >
          {showMenuItemCopy && (
            <MenuItem
              className="sendbird-message__mobile-context-menu-item menu-item-copy"
              onClick={() => {
                hideMenu();
                copyToClipboard((message as UserMessage)?.message);
              }}
            >
              <Label type={LabelTypography.SUBTITLE_1}>
                {stringSet?.MESSAGE_MENU__COPY}
              </Label>
              <Icon
                type={IconTypes.COPY}
                fillColor={IconColors.PRIMARY}
                width="24px"
                height="24px"
              />
            </MenuItem>
          )}
          {showMenuItemReply && (
            <MenuItem
              className="sendbird-message__mobile-context-menu-item menu-item-reply"
              onClick={() => {
                hideMenu();
                setQuoteMessage(message);
              }}
              disable={message?.parentMessageId > 0}
            >
              <Label type={LabelTypography.SUBTITLE_1}>
                {stringSet.MESSAGE_MENU__REPLY}
              </Label>
              <Icon
                type={IconTypes.REPLY}
                fillColor={IconColors.PRIMARY}
                width="24px"
                height="24px"
              />
            </MenuItem>
          )}
          {showMenuItemEdit && (
            <MenuItem
              className="sendbird-message__mobile-context-menu-item menu-item-edit"
              onClick={() => {
                hideMenu();
                showEdit(true);
              }}
            >
              <Label type={LabelTypography.SUBTITLE_1}>
                {stringSet.MESSAGE_MENU__EDIT}
              </Label>
              <Icon
                type={IconTypes.EDIT}
                fillColor={IconColors.PRIMARY}
                width="24px"
                height="24px"
              />
            </MenuItem>
          )}
          {showMenuItemResend && (
            <MenuItem
              className="sendbird-message__mobile-context-menu-item menu-item-resend"
              onClick={() => {
                hideMenu();
                resendMessage(message);
              }}
            >
              <Label type={LabelTypography.SUBTITLE_1}>
                {stringSet.MESSAGE_MENU__RESEND}
              </Label>
              <Icon
                type={IconTypes.REFRESH}
                fillColor={IconColors.PRIMARY}
                width="24px"
                height="24px"
              />
            </MenuItem>
          )}
          {showMenuItemDelete && (
            <MenuItem
              className="sendbird-message__mobile-context-menu-item menu-item-delete"
              onClick={() => {
                hideMenu();
                showRemove(true);
              }}
              disable={message?.threadInfo?.replyCount > 0}
            >
              <Label type={LabelTypography.SUBTITLE_1}>
                {stringSet.MESSAGE_MENU__DELETE}
              </Label>
              <Icon
                type={IconTypes.DELETE}
                fillColor={IconColors.PRIMARY}
                width="24px"
                height="24px"
              />
            </MenuItem>
          )}
        </MenuItems>
      )}
    />
  );
};

export default MobileContextMenu;
