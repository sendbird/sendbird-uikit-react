import React, { ReactElement, useRef } from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { OpenChannel } from '@sendbird/chat/openChannel';

import { SendableMessageType, copyToClipboard, isFailedMessage, isUserMessage } from '../../utils';
import { classnames, noop } from '../../utils/utils';
import useSendbirdStateContext from '../../hooks/useSendbirdStateContext';
import ContextMenu, { MenuItems } from '../ContextMenu';
import { MenuItem, PrebuildMenuItemPropsType, TriggerIcon, TriggerIconProps } from './items';
import { useLocalization } from '../../lib/LocalizationContext';
import { ReplyType } from '../../types';
import {
  MenuConditionsParams,
  showMenuItemCopy,
  showMenuItemDelete,
  showMenuItemEdit,
  showMenuItemOpenInChannel,
  showMenuItemReply,
  showMenuItemResend,
  showMenuItemThread,
} from '../../utils/menuConditions';

interface RenderTriggerParams extends TriggerIconProps {
  TriggerIcon: (props: TriggerIconProps) => ReactElement;
}
type PrebuildItemsType = { [key: string]: (props: PrebuildMenuItemPropsType) => ReactElement };
type RenderMenuItemsParams = {
  close: () => void;
  prebuildItems: PrebuildItemsType;
};

export interface MessageMenuProps {
  className?: string;
  message: SendableMessageType;
  channel: GroupChannel | OpenChannel | null;
  isByMe?: boolean;
  replyType?: ReplyType;
  renderTrigger?: (params: RenderTriggerParams) => ReactElement;
  renderMenuItems?: (params: RenderMenuItemsParams) => ReactElement;

  disableDeleteMessage?: boolean;
  showEdit?: (bool: boolean) => void;
  showRemove?: (bool: boolean) => void;
  deleteMessage?: (message: SendableMessageType) => void;
  resendMessage?: (message: SendableMessageType) => void;
  setQuoteMessage?: (message: SendableMessageType) => void;
  setSupposedHover?: (bool: boolean) => void;
  onReplyInThread?: (props: { message: SendableMessageType }) => void;
  onMoveToParentMessage?: () => void;
}
export const MessageMenu = ({
  className,
  message,
  channel,
  isByMe,
  replyType,
  renderTrigger = TriggerIcon,
  renderMenuItems,

  disableDeleteMessage = null,
  showEdit = noop,
  showRemove = noop,
  deleteMessage,
  resendMessage,
  setQuoteMessage,
  setSupposedHover,
  onReplyInThread,
  onMoveToParentMessage,
}: MessageMenuProps) => {
  const { stringSet } = useLocalization();
  const { config } = useSendbirdStateContext();
  const { isOnline } = config;

  const triggerRef = useRef(null);
  const containerRef = useRef(null);

  const params: MenuConditionsParams = {
    message,
    channel,
    isByMe,
    replyType,
    onReplyInThread,
    onMoveToParentMessage,
  };

  // # Menu Items
  const Copy = (props: PrebuildMenuItemPropsType) => (
    <MenuItem
      {...props}
      onClick={(e) => {
        if (isUserMessage(message)) copyToClipboard(message?.message);
        props?.onClick?.(e);
      }}
    >
      {props?.children ?? stringSet.MESSAGE_MENU__COPY}
    </MenuItem>
  );
  const Reply = (props: PrebuildMenuItemPropsType) => (
    <MenuItem
      {...props}
      disabled={message?.parentMessageId > 0}
      onClick={(e) => {
        setQuoteMessage?.(message);
        props?.onClick?.(e);
      }}
    >
      {props?.children ?? stringSet.MESSAGE_MENU__REPLY}
    </MenuItem>
  );
  const Thread = (props: PrebuildMenuItemPropsType) => (
    <MenuItem
      {...props}
      onClick={(e) => {
        onReplyInThread?.({ message });
        props?.onClick?.(e);
      }}
    >
      {props?.children ?? stringSet.MESSAGE_MENU__THREAD}
    </MenuItem>
  );
  const OpenInChannel = (props: PrebuildMenuItemPropsType) => (
    <MenuItem
      {...props}
      onClick={(e) => {
        onMoveToParentMessage?.();
        props?.onClick?.(e);
      }}
    >
      {props?.children ?? stringSet.MESSAGE_MENU__OPEN_IN_CHANNEL}
    </MenuItem>
  );
  const Edit = (props: PrebuildMenuItemPropsType) => (
    <MenuItem
      {...props}
      onClick={(e) => {
        if (isOnline) {
          showEdit?.(true);
          props?.onClick?.(e);
        }
      }}
    >
      {props?.children ?? stringSet.MESSAGE_MENU__EDIT}
    </MenuItem>
  );
  const Resend = (props: PrebuildMenuItemPropsType) => (
    <MenuItem
      {...props}
      onClick={(e) => {
        if (isOnline) {
          resendMessage?.(message);
          props?.onClick?.(e);
        }
      }}
    >
      {props?.children ?? stringSet.MESSAGE_MENU__RESEND}
    </MenuItem>
  );
  const Delete = (props: PrebuildMenuItemPropsType) => (
    <MenuItem
      {...props}
      disabled={
        typeof disableDeleteMessage === 'boolean'
          ? disableDeleteMessage
          : (message?.threadInfo?.replyCount ?? 0) > 0
      }
      onClick={(e) => {
        if (isFailedMessage(message)) {
          deleteMessage?.(message);
        } else if (isOnline) {
          showRemove?.(true);
          props?.onClick?.(e);
        }
      }}
    >
      {props?.children ?? stringSet.MESSAGE_MENU__DELETE}
    </MenuItem>
  );

  const withAction = (Component, action) => (props: PrebuildMenuItemPropsType) => (
    <Component {...props} onClick={(e) => { action(); props?.onClick?.(e); }} />
  );
  const getPrebuildItems = (handleClose: () => void): PrebuildItemsType => ({
    Copy: withAction(Copy, handleClose),
    Reply: withAction(Reply, handleClose),
    Thread: withAction(Thread, handleClose),
    OpenInChannel: withAction(OpenInChannel, handleClose),
    Edit: withAction(Edit, handleClose),
    Resend: withAction(Resend, handleClose),
    Delete: withAction(Delete, handleClose),
  });

  return (
    <div
      className={classnames('sendbird-message-menu', className)}
      ref={containerRef}
    >
      <ContextMenu
        menuTrigger={(toggleDropdown) => (
          renderTrigger({
            toggleDropdown,
            ref: triggerRef,
            setSupposedHover,
            TriggerIcon,
          })
        )}
        menuItems={(closeMenu) => {
          const handleCloseEvent = () => {
            closeMenu();
            setSupposedHover?.(false);
          };
          const prebuildItems = getPrebuildItems(handleCloseEvent);
          return (
            <MenuItems
              parentRef={triggerRef}
              parentContainRef={containerRef}
              closeDropdown={handleCloseEvent}
              openLeft={isByMe}
            >
              {renderMenuItems?.({ close: handleCloseEvent, prebuildItems }) ?? (
                // Default Menus
                <>
                  {showMenuItemCopy(params) && <prebuildItems.Copy />}
                  {showMenuItemReply(params) && <prebuildItems.Reply />}
                  {showMenuItemThread(params) && <prebuildItems.Thread />}
                  {showMenuItemOpenInChannel(params) && <prebuildItems.OpenInChannel />}
                  {showMenuItemEdit(params) && <prebuildItems.Edit />}
                  {showMenuItemResend(params) && <prebuildItems.Resend />}
                  {showMenuItemDelete(params) && <prebuildItems.Delete />}
                </>

              )}
            </MenuItems>
          );
        }}
      />
    </div>
  );
};
