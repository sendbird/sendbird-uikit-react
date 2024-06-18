import React from 'react';
import { FileMessage } from '@sendbird/chat/message';

import { MenuItem, PrebuildMenuItemPropsType } from './menuItems';
import { copyToClipboard, isUserMessage, isFailedMessage } from '../../../utils';
import { useLocalization } from '../../../lib/LocalizationContext';
import Icon, { IconTypes, IconColors } from '../../Icon';
import Label, { LabelColors, LabelTypography } from '../../Label';
import { MobileMessageMenuContextProps, useMessageMenuContext } from '../MessageMenuProvider';

export const CopyMenuItem = (props: PrebuildMenuItemPropsType) => {
  const { stringSet } = useLocalization();
  const { message, hideMenu } = useMessageMenuContext();

  return (
    <MenuItem
      {...props}
      onClick={(e) => {
        if (isUserMessage(message)) copyToClipboard(message.message);
        hideMenu();
        props.onClick?.(e);
      }}
    >
      {props.children ?? (
        <>
          <Label type={LabelTypography.SUBTITLE_1} color={LabelColors.ONBACKGROUND_1}>
            {stringSet.MESSAGE_MENU__COPY}
          </Label>
          <Icon type={IconTypes.COPY} fillColor={IconColors.PRIMARY} width="24px" height="24px" />
        </>
      )}
    </MenuItem>
  );
};

export const ReplyMenuItem = (props: PrebuildMenuItemPropsType) => {
  const { stringSet } = useLocalization();
  const { message, hideMenu, setQuoteMessage } = useMessageMenuContext();

  return (
    <MenuItem
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
          <Label
            type={LabelTypography.SUBTITLE_1}
            color={(message.parentMessageId ?? 0) > 0 ? LabelColors.ONBACKGROUND_4 : LabelColors.ONBACKGROUND_1}
          >
            {stringSet.MESSAGE_MENU__REPLY}
          </Label>
          <Icon
            type={IconTypes.REPLY}
            fillColor={(message.parentMessageId ?? 0) > 0 ? IconColors.ON_BACKGROUND_4 : IconColors.PRIMARY}
            width="24px"
            height="24px"
          />
        </>
      )}
    </MenuItem>
  );
};

export const ThreadMenuItem = (props: PrebuildMenuItemPropsType) => {
  const { stringSet } = useLocalization();
  const { message, hideMenu, onReplyInThread } = useMessageMenuContext();

  return (
    <MenuItem
      {...props}
      onClick={(e) => {
        onReplyInThread({ message });
        hideMenu();
        props.onClick?.(e);
      }}
    >
      {props.children ?? (
        <>
          <Label type={LabelTypography.SUBTITLE_1} color={LabelColors.ONBACKGROUND_1}>
            {stringSet.MESSAGE_MENU__THREAD}
          </Label>
          <Icon type={IconTypes.THREAD} fillColor={IconColors.PRIMARY} width="24px" height="24px" />
        </>
      )}
    </MenuItem>
  );
};

export const EditMenuItem = (props: PrebuildMenuItemPropsType) => {
  const { stringSet } = useLocalization();
  const { hideMenu, showEdit, isOnline } = useMessageMenuContext();

  return (
    <MenuItem
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
          <Label type={LabelTypography.SUBTITLE_1} color={LabelColors.ONBACKGROUND_1}>
            {stringSet.MESSAGE_MENU__EDIT}
          </Label>
          <Icon type={IconTypes.EDIT} fillColor={IconColors.PRIMARY} width="24px" height="24px" />
        </>
      )}
    </MenuItem>
  );
};

export const ResendMenuItem = (props: PrebuildMenuItemPropsType) => {
  const { stringSet } = useLocalization();
  const { message, hideMenu, resendMessage, isOnline } = useMessageMenuContext();

  return (
    <MenuItem
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
          <Label type={LabelTypography.SUBTITLE_1} color={LabelColors.ONBACKGROUND_1}>
            {stringSet.MESSAGE_MENU__RESEND}
          </Label>
          <Icon type={IconTypes.REFRESH} fillColor={IconColors.PRIMARY} width="24px" height="24px" />
        </>
      )}
    </MenuItem>
  );
};

export const DeleteMenuItem = (props: PrebuildMenuItemPropsType) => {
  const { stringSet } = useLocalization();
  const { message, hideMenu, deleteMessage, showRemove, isOnline, disableDeleteMessage } = useMessageMenuContext();

  return (
    <MenuItem
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
          <Label
            type={LabelTypography.SUBTITLE_1}
            color={disableDeleteMessage ? LabelColors.ONBACKGROUND_4 : LabelColors.ONBACKGROUND_1}
          >
            {stringSet.MESSAGE_MENU__DELETE}
          </Label>
          <Icon type={IconTypes.DELETE} fillColor={IconColors.PRIMARY} width="24px" height="24px" />
        </>
      )}
    </MenuItem>
  );
};

export const DownloadMenuItem = (props: PrebuildMenuItemPropsType) => {
  const { stringSet } = useLocalization();
  const { hideMenu, message, onDownloadClick } = useMessageMenuContext() as MobileMessageMenuContextProps;
  const { url } = message as FileMessage;

  return (
    <MenuItem
      {...props}
      onClick={() => {
        hideMenu();
      }}
    >
      {props.children ?? (
        <a className="sendbird-message__contextmenu--hyperlink" rel="noopener noreferrer" href={url} target="_blank" onClick={onDownloadClick}>
          <Label type={LabelTypography.SUBTITLE_1} color={LabelColors.ONBACKGROUND_1}>
            {stringSet.MESSAGE_MENU__SAVE}
          </Label>
          <Icon type={IconTypes.DOWNLOAD} fillColor={IconColors.PRIMARY} width="24px" height="24px" />
        </a>
      )}
    </MenuItem>
  );
};
