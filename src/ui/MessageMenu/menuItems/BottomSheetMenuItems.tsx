import React from 'react';
import { FileMessage } from '@sendbird/chat/message';

import { PrebuildMenuItemPropsType } from './MessageMenuItems';
import { copyToClipboard, isUserMessage, isFailedMessage } from '../../../utils';
import { useLocalization } from '../../../lib/LocalizationContext';
import { MobileMessageMenuContextProps, useMessageMenuContext } from '../MessageMenuProvider';
import Icon, { IconTypes, IconColors } from '../../Icon';
import Label, { LabelColors, LabelTypography } from '../../Label';
import { BottomSheetMenuItem } from './BasicItems';

export const CopyMenuItem = (props: PrebuildMenuItemPropsType) => {
  const { stringSet } = useLocalization();
  const { message, hideMenu } = useMessageMenuContext();

  return (
    <BottomSheetMenuItem
      {...props}
      onClick={(e) => {
        if (isUserMessage(message)) copyToClipboard(message.message);
        hideMenu();
        props.onClick?.(e);
      }}
    >
      {props.children ?? (
        <>
          <Icon type={IconTypes.COPY} fillColor={IconColors.PRIMARY} width="24px" height="24px" />
          <Label type={LabelTypography.SUBTITLE_1} color={LabelColors.ONBACKGROUND_1}>
            {stringSet.MESSAGE_MENU__COPY}
          </Label>
        </>
      )}
    </BottomSheetMenuItem>
  );
};

export const EditMenuItem = (props: PrebuildMenuItemPropsType) => {
  const { stringSet } = useLocalization();
  const { hideMenu, showEdit, isOnline } = useMessageMenuContext();

  return (
    <BottomSheetMenuItem
      {...props}
      onClick={(e) => {
        if (isOnline) {
          showEdit(true);
          hideMenu();
          props.onClick?.(e);
        }
      }}
    >
      {props.children ?? (
        <>
          <Icon type={IconTypes.EDIT} fillColor={IconColors.PRIMARY} width="24px" height="24px" />
          <Label type={LabelTypography.SUBTITLE_1} color={LabelColors.ONBACKGROUND_1}>
            {stringSet.MESSAGE_MENU__EDIT}
          </Label>
        </>
      )}
    </BottomSheetMenuItem>
  );
};

export const ResendMenuItem = (props: PrebuildMenuItemPropsType) => {
  const { stringSet } = useLocalization();
  const { message, hideMenu, resendMessage, isOnline } = useMessageMenuContext();

  return (
    <BottomSheetMenuItem
      {...props}
      onClick={(e) => {
        if (isOnline) {
          resendMessage(message);
          hideMenu();
          props.onClick?.(e);
        }
      }}
    >
      {props.children ?? (
        <>
          <Icon type={IconTypes.REFRESH} fillColor={IconColors.PRIMARY} width="24px" height="24px" />
          <Label type={LabelTypography.SUBTITLE_1} color={LabelColors.ONBACKGROUND_1}>
            {stringSet.MESSAGE_MENU__RESEND}
          </Label>
        </>
      )}
    </BottomSheetMenuItem>
  );
};

export const ReplyMenuItem = (props: PrebuildMenuItemPropsType) => {
  const { stringSet } = useLocalization();
  const { message, hideMenu, setQuoteMessage } = useMessageMenuContext();

  return (
    <BottomSheetMenuItem
      {...props}
      disabled={message.parentMessageId > 0}
      onClick={(e) => {
        setQuoteMessage(message);
        hideMenu();
        props.onClick?.(e);
      }}
    >
      {props.children ?? (
        <>
          <Icon
            type={IconTypes.REPLY}
            fillColor={(message.parentMessageId ?? 0) > 0 ? IconColors.ON_BACKGROUND_3 : IconColors.PRIMARY}
            width="24px"
            height="24px"
          />
          <Label
            type={LabelTypography.SUBTITLE_1}
            color={(message.parentMessageId ?? 0) > 0 ? LabelColors.ONBACKGROUND_4 : LabelColors.ONBACKGROUND_1}
          >
            {stringSet.MESSAGE_MENU__REPLY}
          </Label>
        </>
      )}
    </BottomSheetMenuItem>
  );
};

export const ThreadMenuItem = (props: PrebuildMenuItemPropsType) => {
  const { stringSet } = useLocalization();
  const { message, hideMenu, onReplyInThread } = useMessageMenuContext();

  return (
    <BottomSheetMenuItem
      {...props}
      onClick={(e) => {
        onReplyInThread({ message });
        hideMenu();
        props.onClick?.(e);
      }}
    >
      {props.children ?? (
        <>
          <Icon type={IconTypes.THREAD} fillColor={IconColors.PRIMARY} width="24px" height="24px" />
          <Label type={LabelTypography.SUBTITLE_1} color={LabelColors.ONBACKGROUND_1}>
            {stringSet.MESSAGE_MENU__THREAD}
          </Label>
        </>
      )}
    </BottomSheetMenuItem>
  );
};

export const DeleteMenuItem = (props: PrebuildMenuItemPropsType) => {
  const { stringSet } = useLocalization();
  const { message, hideMenu, deleteMessage, showRemove, isOnline, disableDeleteMessage } = useMessageMenuContext();

  return (
    <BottomSheetMenuItem
      {...props}
      disabled={
        typeof disableDeleteMessage === 'boolean'
          ? disableDeleteMessage
          : (message.threadInfo?.replyCount ?? 0) > 0
      }
      onClick={(e) => {
        if (isFailedMessage(message)) {
          deleteMessage(message);
        } else if (isOnline) {
          showRemove(true);
          hideMenu();
          props.onClick?.(e);
        }
      }}
    >
      {props.children ?? (
        <>
          <Icon type={IconTypes.DELETE} fillColor={IconColors.PRIMARY} width="24px" height="24px" />
          <Label
            type={LabelTypography.SUBTITLE_1}
            color={disableDeleteMessage ? LabelColors.ONBACKGROUND_4 : LabelColors.ONBACKGROUND_1}
          >
            {stringSet.MESSAGE_MENU__DELETE}
          </Label>
        </>
      )}
    </BottomSheetMenuItem>
  );
};

export const DownloadMenuItem = (props: PrebuildMenuItemPropsType) => {
  const { stringSet } = useLocalization();
  const { hideMenu, message, onDownloadClick } = useMessageMenuContext() as MobileMessageMenuContextProps;
  const { url } = message as FileMessage;

  return (
    <BottomSheetMenuItem onClick={() => hideMenu()}>
      {props.children ?? (
        <a
          className="sendbird-message__bottomsheet--hyperlink"
          rel="noopener noreferrer"
          href={url}
          target="_blank"
          onClick={onDownloadClick}
        >
          <Icon type={IconTypes.DOWNLOAD} fillColor={IconColors.PRIMARY} width="24px" height="24px" />
          <Label type={LabelTypography.SUBTITLE_1} color={LabelColors.ONBACKGROUND_1}>
            {stringSet.MESSAGE_MENU__SAVE}
          </Label>
        </a>
      )}
    </BottomSheetMenuItem>
  );
};

export const MarkAsUnreadMenuItem = (props: PrebuildMenuItemPropsType) => {
  const { stringSet } = useLocalization();
  const { message, hideMenu, markAsUnread } = useMessageMenuContext();

  return (
    <BottomSheetMenuItem
      {...props}
      onClick={(e) => {
        if (markAsUnread) {
          markAsUnread(message, 'manual');
        }
        hideMenu();
        props.onClick?.(e);
      }}
    >
      {props.children ?? (
        <>
          <Icon type={IconTypes.MARK_AS_UNREAD} fillColor={IconColors.PRIMARY} width="24px" height="24px" />
          <Label type={LabelTypography.SUBTITLE_1} color={LabelColors.ONBACKGROUND_1}>
            {stringSet.MESSAGE_MENU__MARK_AS_UNREAD}
          </Label>
        </>
      )}
    </BottomSheetMenuItem>
  );
};
