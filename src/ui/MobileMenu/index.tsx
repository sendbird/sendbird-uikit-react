import './mobile-menu.scss';

import React from 'react';
import MobileContextMenu from './MobileContextMenu';
import MobileBottomSheet from './MobileBottomSheet';
import type { MobileBottomSheetProps } from './types';

const MobileMenu: React.FC<MobileBottomSheetProps> = (props: MobileBottomSheetProps) => {
  const {
    message,
    hideMenu,
    userId,
    channel,
    isReactionEnabled = false,
    isByMe,
    replyType,
    disabled,
    deleteMenuState,
    showRemove,
    showEdit,
    resendMessage,
    deleteMessage,
    setQuoteMessage,
    emojiContainer,
    toggleReaction,
    parentRef,
    onReplyInThread,
    isOpenedFromThread,
    onDownloadClick,
  } = props;
  return (
    <>
      {
        isReactionEnabled
          ? (
            <MobileBottomSheet
              channel={channel}
              message={message}
              hideMenu={hideMenu}
              isByMe={isByMe}
              userId={userId}
              replyType={replyType}
              disabled={disabled}
              showRemove={showRemove}
              showEdit={showEdit}
              deleteMenuState={deleteMenuState}
              resendMessage={resendMessage}
              deleteMessage={deleteMessage}
              setQuoteMessage={setQuoteMessage}
              emojiContainer={emojiContainer}
              toggleReaction={toggleReaction}
              isReactionEnabled={isReactionEnabled}
              onReplyInThread={onReplyInThread}
              isOpenedFromThread={isOpenedFromThread}
              onDownloadClick={onDownloadClick}
            />
          ) : (
            <MobileContextMenu
              channel={channel}
              userId={userId}
              message={message}
              hideMenu={hideMenu}
              isByMe={isByMe}
              showEdit={showEdit}
              replyType={replyType}
              disabled={disabled}
              deleteMenuState={deleteMenuState}
              showRemove={showRemove}
              resendMessage={resendMessage}
              deleteMessage={deleteMessage}
              setQuoteMessage={setQuoteMessage}
              parentRef={parentRef}
              onReplyInThread={onReplyInThread}
              isOpenedFromThread={isOpenedFromThread}
              onDownloadClick={onDownloadClick}
            />
          )
      }
    </>
  );
};

export default MobileMenu;
