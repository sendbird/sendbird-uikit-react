import React from 'react';
import type { BaseMenuProps } from './types';
import type { FileMessage, UserMessage } from '@sendbird/chat/message';
import { GroupChannel } from '@sendbird/chat/groupChannel';

import ContextMenu, { MenuItems } from '../ContextMenu';
import { MenuItem, PrebuildMenuItemPropsType } from '../MessageMenu/items';

import {
  isFailedMessage,
  isPendingMessage,
  isSentMessage,
  isUserMessage,
  copyToClipboard,
  isFileMessage,
  isThreadMessage,
  isVoiceMessage,
} from '../../utils';
import { useLocalization } from '../../lib/LocalizationContext';
import Icon, { IconTypes, IconColors } from '../Icon';
import Label, { LabelColors, LabelTypography } from '../Label';

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
    deleteMenuState,
    deleteMessage,
    setQuoteMessage,
    parentRef,
    onReplyInThread,
    isOpenedFromThread = false,
    onDownloadClick = null,
    renderMenuItems,
  } = props;
  const isByMe = message?.sender?.userId === userId;
  const { stringSet } = useLocalization();

  // Menu Items condition
  const showMenuItemCopy: boolean = isUserMessage(message as UserMessage);
  const showMenuItemEdit: boolean = (isUserMessage(message as UserMessage) && isSentMessage(message) && isByMe);
  const showMenuItemResend: boolean = (isFailedMessage(message) && message?.isResendable && isByMe);
  const showMenuItemDelete: boolean = !isPendingMessage(message) && isByMe;
  const showMenuItemDeleteByState = isByMe && (deleteMenuState === undefined || deleteMenuState !== 'HIDE');
  const showMenuItemDeleteFinal = showMenuItemDeleteByState && showMenuItemDelete;
  const showMenuItemDownload: boolean = !isPendingMessage(message) && isFileMessage(message)
    && !(isVoiceMessage(message) && ((channel as GroupChannel)?.isSuper || (channel as GroupChannel)?.isBroadcast));
  const showMenuItemReply: boolean = (replyType === 'QUOTE_REPLY')
    && !isFailedMessage(message)
    && !isPendingMessage(message)
    && channel?.isGroupChannel();
  const showMenuItemThread: boolean = (replyType === 'THREAD') && !isOpenedFromThread
    && !isFailedMessage(message)
    && !isPendingMessage(message)
    && !isThreadMessage(message)
    && channel?.isGroupChannel();
  const disableDelete = (
    (deleteMenuState !== undefined && deleteMenuState === 'DISABLE')
    || (message?.threadInfo?.replyCount ?? 0) > 0
  );

  const Copy = (props: PrebuildMenuItemPropsType) => (
    <MenuItem
      {...props}
      onClick={() => {
        hideMenu();
        copyToClipboard((message as UserMessage)?.message);
      }}
    >
      {props?.children ?? (
        <>
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
        </>
      )}
    </MenuItem>
  );
  const Reply = (props: PrebuildMenuItemPropsType) => (
    <MenuItem
      {...props}
      onClick={() => {
        hideMenu();
        setQuoteMessage?.(message);
      }}
    >
      {props?.children ?? (
        <>
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
        </>
      )}
    </MenuItem>
  );
  const Thread = (props: PrebuildMenuItemPropsType) => (
    <MenuItem
      {...props}
      onClick={() => {
        hideMenu();
        onReplyInThread?.({ message });
      }}
    >
      {props?.children ?? (
        <>
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
        </>
      )}
    </MenuItem>
  );
  const Edit = (props: PrebuildMenuItemPropsType) => (
    <MenuItem
      {...props}
      onClick={() => {
        hideMenu();
        showEdit?.(true);
      }}
    >
      {props?.children ?? (
        <>
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
        </>
      )}
    </MenuItem>
  );
  const Resend = (props: PrebuildMenuItemPropsType) => (
    <MenuItem
      {...props}
      onClick={() => {
        hideMenu();
        resendMessage?.(message);
      }}
    >
      {props?.children ?? (
        <>
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
        </>
      )}
    </MenuItem>
  );
  const Delete = (props: PrebuildMenuItemPropsType) => (
    <MenuItem
      {...props}
      onClick={() => {
        if (isFailedMessage(message)) {
          hideMenu();
          deleteMessage?.(message);
        } else if (!disableDelete) {
          hideMenu();
          showRemove?.(true);
        }
      }}
    >
      {props?.children ?? (
        <>
          <Label
            type={LabelTypography.SUBTITLE_1}
            color={
              disableDelete
                ? LabelColors.ONBACKGROUND_4
                : LabelColors.ONBACKGROUND_1
            }
          >
            {stringSet.MESSAGE_MENU__DELETE}
          </Label>
          <Icon
            type={IconTypes.DELETE}
            fillColor={
              disableDelete
                ? IconColors.ON_BACKGROUND_4
                : IconColors.PRIMARY
            }
            width="24px"
            height="24px"
          />
        </>
      )}
    </MenuItem>
  );
  const Download = (props: PrebuildMenuItemPropsType) => (
    <MenuItem
      {...props}
      onClick={() => {
        hideMenu();
      }}
    >
      {props?.children ?? (
        <a
          className="sendbird-message__contextmenu--hyperlink"
          rel="noopener noreferrer"
          href={fileMessage?.url}
          target="_blank"
          onClick={onDownloadClick}
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
      )}
    </MenuItem>
  );
  const prebuildItems = {
    Copy,
    Reply,
    Thread,
    Edit,
    Resend,
    Delete,
    Download,
  };

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
          {
            renderMenuItems?.({ close: hideMenu, prebuildItems }) ?? (
              <>
                {showMenuItemCopy && (<Copy />)}
                {showMenuItemReply && (<Reply />)}
                {showMenuItemThread && (<Thread />)}
                {showMenuItemEdit && (<Edit />)}
                {showMenuItemResend && (<Resend />)}
                {showMenuItemDeleteFinal && (<Delete />)}
                {showMenuItemDownload && (<Download />)}
              </>
            )
          }
        </MenuItems>
      )}
    />
  );
};

export default MobileContextMenu;
