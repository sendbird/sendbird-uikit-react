import './open-channel-mobile-menu.scss';

import React from 'react';
import type { FileMessage, UserMessage } from '@sendbird/chat/message';
import ContextMenu, { MenuItems, MenuItem } from '../ContextMenu';
import {
  isFineDelete,
  isFineResend,
  isFineCopy,
  isFineEdit,
  isFineDownload,
} from '../../utils/openChannelUtils';
import useSendbirdStateContext from '../../hooks/useSendbirdStateContext';
import { useLocalization } from '../../lib/LocalizationContext';

type Props = {
  message: UserMessage | FileMessage;
  parentRef: React.RefObject<HTMLDivElement>;
  resendMessage?(): void;
  showRemove?(): void;
  copyToClipboard?(): void;
  showEdit?(): void;
  hideMenu(): void;
};

const OpenChannelMobileMenu: React.FC<Props> = (props: Props) => {
  const {
    message,
    parentRef,
    resendMessage,
    showEdit,
    showRemove,
    copyToClipboard,
    hideMenu,
  } = props;
  const userMessage = message as UserMessage;
  const status = message?.sendingStatus;
  const { stringSet } = useLocalization();
  const userId = useSendbirdStateContext()?.config?.userId;
  const fileMessage = message as FileMessage;
  return (
    <ContextMenu
      isOpen
      menuItems={() => (
        <MenuItems
          className="sendbird-openchannel__mobile-menu"
          parentRef={parentRef}
          parentContainRef={parentRef}
          closeDropdown={hideMenu}
        >
          {
            isFineCopy({ message: userMessage, userId, status }) && (
              <MenuItem
                className="sendbird-openchannel-og-message__top__context-menu__copy"
                onClick={() => {
                  copyToClipboard();
                }}
              >
                <>{stringSet.CONTEXT_MENU_DROPDOWN__COPY}</>
              </MenuItem>
            )
          }
          {
            isFineEdit({ message, userId, status }) && (
              <MenuItem
                className="sendbird-openchannel-og-message__top__context-menu__edit"
                onClick={() => {
                  showEdit();
                }}
              >
                <>{stringSet.CONTEXT_MENU_DROPDOWN__EDIT}</>
              </MenuItem>
            )
          }
          {
            isFineResend({ message, userId, status }) && (
              <MenuItem
                onClick={() => {
                  resendMessage();
                }}
              >
                <>{stringSet.CONTEXT_MENU_DROPDOWN__RESEND}</>
              </MenuItem>
            )
          }
          {
            isFineDelete({ message, userId, status }) && (
              <MenuItem
                onClick={() => {
                  showRemove();
                }}
              >
                <>{stringSet.CONTEXT_MENU_DROPDOWN__DELETE}</>
              </MenuItem>
            )
          }
          {
            isFineDownload({ message, status }) && (
                <MenuItem
                  onClick={() => {
                    hideMenu();
                  }}
                >
                  <a
                    className="sendbird-openchannel__mobile-menu-hyperlink"
                    rel="noopener noreferrer"
                    href={fileMessage?.url}
                    target="_blank"
                  >
                    {stringSet.CONTEXT_MENU_DROPDOWN__SAVE}
                  </a>
                </MenuItem>
            )
          }
        </MenuItems>
      )
    }/>
  )
}

export default OpenChannelMobileMenu;
