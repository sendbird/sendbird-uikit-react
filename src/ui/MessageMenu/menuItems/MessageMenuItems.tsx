import React, { FocusEvent, MouseEvent, MutableRefObject, ReactNode } from 'react';

import IconButton from '../../IconButton';
import Icon, { IconColors, IconProps, IconTypes } from '../../Icon';
import { noop } from '../../../utils/utils';
import { copyToClipboard, isUserMessage, isFailedMessage } from '../../../utils';
import { useLocalization } from '../../../lib/LocalizationContext';
import { useMessageMenuContext } from '../MessageMenuProvider';
import { MenuItem, MenuItemProps } from './BasicItems';

export interface TriggerIconProps {
  ref: MutableRefObject<any>;
  onClick?: (e: MouseEvent) => void;
  onBlur?: (e: FocusEvent) => void;
  renderIcon?: (props: IconProps) => ReactNode;
}
export const TriggerIcon = ({
  ref,
  onClick = noop,
  onBlur = noop,
  renderIcon = (props) => <Icon {...props} />,
}: TriggerIconProps) => {
  return (
    <IconButton
      ref={ref}
      width="32px"
      height="32px"
      onClick={onClick}
      onBlur={onBlur}
    >
      {renderIcon({
        type: IconTypes.MORE,
        fillColor: IconColors.CONTENT_INVERSE,
        width: '24px',
        height: '24px',
      })}
    </IconButton>
  );
};

export type PrebuildMenuItemPropsType = Omit<MenuItemProps, 'children'> & Partial<Pick<MenuItemProps, 'children'>>;

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
      {props.children ?? stringSet.MESSAGE_MENU__COPY}
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
      {props.children ?? stringSet.MESSAGE_MENU__REPLY}
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
      {props.children ?? stringSet.MESSAGE_MENU__THREAD}
    </MenuItem>
  );
};

export const OpenInChannelMenuItem = (props: PrebuildMenuItemPropsType) => {
  const { stringSet } = useLocalization();
  const { hideMenu, onMoveToParentMessage } = useMessageMenuContext();

  return (
    <MenuItem
      {...props}
      onClick={(e) => {
        onMoveToParentMessage();
        hideMenu();
        props.onClick?.(e);
      }}
    >
      {props.children ?? stringSet.MESSAGE_MENU__OPEN_IN_CHANNEL}
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
      {props.children ?? stringSet.MESSAGE_MENU__EDIT}
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
      {props.children ?? stringSet.MESSAGE_MENU__RESEND}
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
      {props.children ?? stringSet.MESSAGE_MENU__DELETE}
    </MenuItem>
  );
};
