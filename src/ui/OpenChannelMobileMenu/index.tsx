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
import { SendableMessageType } from '../../utils';

type Props = {
  message: SendableMessageType;
  parentRef: React.RefObject<HTMLDivElement>;
  resendMessage?(): void;
  showRemove?(): void;
  copyToClipboard?(): void;
  showEdit?(): void;
  hideMenu(): void;
  isEphemeral?: boolean;
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
    isEphemeral = false,
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
                dataSbId="open_channel_mobile_context_menu_copy"
              >
                <>{stringSet.CONTEXT_MENU_DROPDOWN__COPY}</>
              </MenuItem>
            )
          }
          {
            (!isEphemeral && isFineEdit({ message, userId, status })) && (
              <MenuItem
                className="sendbird-openchannel-og-message__top__context-menu__edit"
                onClick={() => {
                  showEdit();
                }}
                dataSbId="open_channel_mobile_context_menu_edit"
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
                dataSbId="open_channel_mobile_context_menu_resend"
              >
                <>{stringSet.CONTEXT_MENU_DROPDOWN__RESEND}</>
              </MenuItem>
            )
          }
          {
            (!isEphemeral && isFineDelete({ message, userId, status })) && (
              <MenuItem
                onClick={() => {
                  showRemove();
                }}
                dataSbId="open_channel_mobile_context_menu_delete"
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
                  dataSbId="open_channel_mobile_context_menu_download_file"
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
  );
};

export default OpenChannelMobileMenu;
