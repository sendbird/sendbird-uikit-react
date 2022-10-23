import React from 'react';
import type { BaseMenuProps } from './types';

// import {
//   MenuItem,
//   MenuItems
// } from '../ContextMenu';

// const MobileContextMenu: React.FunctionComponent<MobileContextMenuProps> = (props: MobileContextMenuProps) => {
const MobileContextMenu: React.FunctionComponent<BaseMenuProps> = () => {
  return (
    <>component</>
    // <MenuItems
    //   className="sendbird-message-item-menu__list"
    //   parentRef={triggerRef}
    //   parentContainRef={containerRef}
    //   closeDropdown={closeDropdown}
    //   openLeft={isByMe}
    // >
    //   {showMenuItemCopy && (
    //     <MenuItem
    //       className="sendbird-message-item-menu__list__menu-item menu-item-copy"
    //       onClick={() => {
    //         copyToClipboard((message as UserMessage)?.message);
    //         closeDropdown();
    //       }}
    //     >
    //       {stringSet.MESSAGE_MENU__COPY}
    //     </MenuItem>
    //   )}
    //   {showMenuItemReply && (
    //     <MenuItem
    //       className="sendbird-message-item-menu__list__menu-item menu-item-reply"
    //       onClick={() => {
    //         setQuoteMessage(message);
    //         closeDropdown();
    //       }}
    //       disable={message?.parentMessageId > 0}
    //     >
    //       {stringSet.MESSAGE_MENU__REPLY}
    //     </MenuItem>
    //   )}
    //   {showMenuItemEdit && (
    //     <MenuItem
    //       className="sendbird-message-item-menu__list__menu-item menu-item-edit"
    //       onClick={() => {
    //         if (!disabled) {
    //           showEdit(true);
    //           closeDropdown();
    //         }
    //       }}
    //     >
    //       {stringSet.MESSAGE_MENU__EDIT}
    //     </MenuItem>
    //   )}
    //   {showMenuItemResend && (
    //     <MenuItem
    //       className="sendbird-message-item-menu__list__menu-item menu-item-resend"
    //       onClick={() => {
    //         if (!disabled) {
    //           resendMessage(message);
    //           closeDropdown();
    //         }
    //       }}
    //     >
    //       {stringSet.MESSAGE_MENU__RESEND}
    //     </MenuItem>
    //   )}
    //   {showMenuItemDelete && (
    //     <MenuItem
    //       className="sendbird-message-item-menu__list__menu-item menu-item-delete"
    //       onClick={() => {
    //         if (!disabled) {
    //           showRemove(true);
    //           closeDropdown();
    //         }
    //       }}
    //       disable={message?.threadInfo?.replyCount > 0}
    //     >
    //       {stringSet.MESSAGE_MENU__DELETE}
    //     </MenuItem>
    //   )}
    // </MenuItems>
  );
};

export default MobileContextMenu;
