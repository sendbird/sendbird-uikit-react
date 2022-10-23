import './open-channel-mobile-menu.scss';

import React from 'react';
import type { FileMessage, UserMessage } from '@sendbird/chat/message';
import ContextMenu, { MenuItems, MenuItem } from '../ContextMenu';
import {
  isFineDelete,
  isFineResend,
  isFineCopy,
  isFineEdit,
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
};

const OpenChannelMobileMenu = (props: Props) => {
  const {
    message,
    parentRef,
    resendMessage,
    showEdit,
    showRemove,
    copyToClipboard,
  } = props;
  const userMessage = message as UserMessage;
  const status = message?.sendingStatus;
  const { stringSet } = useLocalization();
  const userId = useSendbirdStateContext()?.config?.userId;
  return (
    <ContextMenu
      isOpen
      menuItems={() => (
        <MenuItems
          className="sendbird-openchannel__mobile-menu"
          parentRef={parentRef}
          parentContainRef={parentRef}
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
        </MenuItems>
      )
    }/>
  )
}

export default OpenChannelMobileMenu;
