import React, { MutableRefObject } from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import type { UserMessage } from '@sendbird/chat/message';
import type { BaseMenuProps } from './types';

import {
  isFailedMessage,
  isPendingMessage,
  isSentMessage,
  isUserMessage,
  isFileMessage,
  isThreadMessage,
  isVoiceMessage,
} from '../../utils';

import { MessageMenuProvider } from '../MessageMenu';
import type { MobileMessageMenuContextProps } from '../MessageMenu/MessageMenuProvider';
import {
  CopyMenuItem,
  ReplyMenuItem,
  ThreadMenuItem,
  EditMenuItem,
  ResendMenuItem,
  DeleteMenuItem,
  DownloadMenuItem,
} from '../MessageMenu/menuItems/MobileMenuItems';
import useSendbirdStateContext from '../../hooks/useSendbirdStateContext';
import { MenuItems } from '../ContextMenu';
import { noop } from '../../utils/utils';

const MobileContextMenu: React.FunctionComponent<BaseMenuProps> = (props: BaseMenuProps): React.ReactElement => {
  const {
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
    hideMenu: hideMobileMenu,
  } = props;
  const isByMe = message?.sender?.userId === userId;
  const { config } = useSendbirdStateContext();
  const { isOnline } = config;

  // Menu Items condition
  const showMenuItemCopy: boolean = isUserMessage(message as UserMessage);
  const showMenuItemEdit: boolean = isUserMessage(message as UserMessage) && isSentMessage(message) && isByMe;
  const showMenuItemResend: boolean = isFailedMessage(message) && message?.isResendable && isByMe;
  const showMenuItemDelete: boolean = !isPendingMessage(message) && isByMe;
  const showMenuItemDeleteByState = isByMe && (deleteMenuState === undefined || deleteMenuState !== 'HIDE');
  const showMenuItemDeleteFinal = showMenuItemDeleteByState && showMenuItemDelete;
  const showMenuItemDownload: boolean = !isPendingMessage(message) && isFileMessage(message) && !(isVoiceMessage(message) && (channel as GroupChannel)?.isSuper || (channel as GroupChannel)?.isBroadcast);
  const showMenuItemReply: boolean = replyType === 'QUOTE_REPLY' && !isFailedMessage(message) && !isPendingMessage(message) && channel?.isGroupChannel();
  const showMenuItemThread: boolean = replyType === 'THREAD' && !isOpenedFromThread && !isFailedMessage(message) && !isPendingMessage(message) && !isThreadMessage(message) && channel?.isGroupChannel();
  const disableDeleteMessage = (deleteMenuState !== undefined && deleteMenuState === 'DISABLE') || (message?.threadInfo?.replyCount ?? 0) > 0;

  const contextValue: MobileMessageMenuContextProps = {
    message,
    hideMenu: hideMobileMenu,
    setQuoteMessage,
    onReplyInThread,
    onMoveToParentMessage: noop,
    showEdit,
    showRemove,
    deleteMessage,
    resendMessage,
    isOnline,
    disableDeleteMessage,
    triggerRef: parentRef as MutableRefObject<null>,
    containerRef: parentRef as MutableRefObject<null>,
    onDownloadClick,
  };

  return (
    <MessageMenuProvider value={contextValue}>
      <MenuItems
        className="sendbird-message__mobile-context-menu"
        parentRef={parentRef}
        parentContainRef={parentRef}
        closeDropdown={hideMobileMenu}
      >
        {
          renderMenuItems?.({
            items: {
              CopyMenuItem,
              ReplyMenuItem,
              ThreadMenuItem,
              EditMenuItem,
              ResendMenuItem,
              DeleteMenuItem,
            },
          }) ?? (
            <>
              {showMenuItemCopy && <CopyMenuItem />}
              {showMenuItemReply && <ReplyMenuItem />}
              {showMenuItemThread && <ThreadMenuItem />}
              {showMenuItemEdit && <EditMenuItem />}
              {showMenuItemResend && <ResendMenuItem />}
              {showMenuItemDeleteFinal && <DeleteMenuItem />}
              {showMenuItemDownload && <DownloadMenuItem />}
            </>
          )
        }
      </MenuItems>
    </MessageMenuProvider>
  );
};

export default MobileContextMenu;
