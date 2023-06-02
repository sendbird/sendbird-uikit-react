import React from 'react';
import type { BaseMenuProps } from './types';
import type { FileMessage, UserMessage } from '@sendbird/chat/message';

import ContextMenu, { MenuItems, MenuItem } from '../ContextMenu';

import {
  isFailedMessage,
  isPendingMessage,
  isSentMessage,
  isUserMessage,
  copyToClipboard,
  isFileMessage,
  isThreadMessage,
} from '../../utils';
import { useLocalization } from '../../lib/LocalizationContext';
import Icon, { IconTypes, IconColors } from '../Icon';
import Label, { LabelColors, LabelTypography } from '../Label';
import { GroupChannel } from '@sendbird/chat/groupChannel';

const MobileContextMenu: React.FunctionComponent<BaseMenuProps> = (props: BaseMenuProps): React.ReactElement => {
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
    onReplyInThread,
    isOpenedFromThread = false,
  } = props;
  const isByMe = message?.sender?.userId === userId;
  const { stringSet } = useLocalization();
  const showMenuItemCopy: boolean = isUserMessage(message as UserMessage);
  const showMenuItemEdit: boolean = (isUserMessage(message as UserMessage) && isSentMessage(message) && isByMe);
  const showMenuItemResend: boolean = (isFailedMessage(message) && message?.isResendable && isByMe);
  const showMenuItemDelete: boolean = !isPendingMessage(message) && isByMe;
  const showMenuItemDownload: boolean = !isPendingMessage(message)
    && isFileMessage(message)
    && !(channel as GroupChannel)?.isSuper
    && !(channel as GroupChannel)?.isBroadcast;
  const showMenuItemReply: boolean = (replyType === 'QUOTE_REPLY')
    && !isFailedMessage(message)
    && !isPendingMessage(message)
    && channel?.isGroupChannel();
  const showMenuItemThread: boolean = (replyType === 'THREAD') && !isOpenedFromThread
    && !isFailedMessage(message)
    && !isPendingMessage(message)
    && !isThreadMessage(message)
    && channel?.isGroupChannel();

  const fileMessage = message as FileMessage;
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
              dataSbId="ui_mobile_message_item_menu_copy"
            >
              <Label
                type={LabelTypography.SUBTITLE_1}
                color={LabelColors.ONBACKGROUND_1}
              >
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
              disable={(message?.parentMessageId ?? 0) > 0}
              dataSbId="ui_mobile_message_item_menu_reply"
            >
              <Label
                type={LabelTypography.SUBTITLE_1}
                color={
                  (message?.parentMessageId ?? 0) > 0
                    ? LabelColors.ONBACKGROUND_4
                    : LabelColors.ONBACKGROUND_1
                }
              >
                {stringSet.MESSAGE_MENU__REPLY}
              </Label>
              <Icon
                type={IconTypes.REPLY}
                fillColor={
                  (message?.parentMessageId ?? 0) > 0
                    ? IconColors.ON_BACKGROUND_4
                    : IconColors.PRIMARY
                }
                width="24px"
                height="24px"
              />
            </MenuItem>
          )}
          {showMenuItemThread && (
            <MenuItem
              className="sendbird-message__mobile-context-menu-item menu-item-reply"
              onClick={() => {
                hideMenu();
                onReplyInThread?.({ message });
              }}
              dataSbId="ui_mobile_message_item_menu_thread"
            >
              <Label
                type={LabelTypography.SUBTITLE_1}
                color={LabelColors.ONBACKGROUND_1}
              >
                {stringSet.MESSAGE_MENU__THREAD}
              </Label>
              <Icon
                type={IconTypes.THREAD}
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
              dataSbId="ui_mobile_message_item_menu_edit"
            >
              <Label
                type={LabelTypography.SUBTITLE_1}
                color={LabelColors.ONBACKGROUND_1}
              >
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
              dataSbId="ui_mobile_message_item_menu_resend"
            >
              <Label
                type={LabelTypography.SUBTITLE_1}
                color={LabelColors.ONBACKGROUND_1}
              >
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
              disable={(message?.threadInfo?.replyCount ?? 0) > 0}
              dataSbId="ui_mobile_message_item_menu_delete"
            >
              <Label
                type={LabelTypography.SUBTITLE_1}
                color={
                  (message?.threadInfo?.replyCount ?? 0) > 0
                    ? LabelColors.ONBACKGROUND_4
                    : LabelColors.ONBACKGROUND_1
                }
              >
                {stringSet.MESSAGE_MENU__DELETE}
              </Label>
              <Icon
                type={IconTypes.DELETE}
                fillColor={
                  (message?.threadInfo?.replyCount ?? 0) > 0
                    ? IconColors.ON_BACKGROUND_4
                    : IconColors.PRIMARY
                }
                width="24px"
                height="24px"
              />
            </MenuItem>
          )}
          {showMenuItemDownload && (
            <MenuItem
              className="sendbird-message__mobile-context-menu-item menu-item-save"
              onClick={() => {
                hideMenu();
              }}
              dataSbId="ui_mobile_message_item_menu_download_file"
            >
              <a
                className="sendbird-message__contextmenu--hyperlink"
                rel="noopener noreferrer"
                href={fileMessage?.url}
                target="_blank"
              >
                <Label
                  type={LabelTypography.SUBTITLE_1}
                  color={LabelColors.ONBACKGROUND_1}
                >
                  {stringSet.MESSAGE_MENU__SAVE}
                </Label>
                <Icon
                  type={IconTypes.DOWNLOAD}
                  fillColor={IconColors.PRIMARY}
                  width="24px"
                  height="24px"
                />
              </a>
            </MenuItem>
          )}
        </MenuItems>
      )}
    />
  );
};

export default MobileContextMenu;
