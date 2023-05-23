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
    showRemove,
    showEdit,
    resendMessage,
    setQuoteMessage,
    emojiContainer,
    toggleReaction,
    parentRef,
    onReplyInThread,
    isOpenedFromThread,
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
              resendMessage={resendMessage}
              setQuoteMessage={setQuoteMessage}
              emojiContainer={emojiContainer}
              toggleReaction={toggleReaction}
              isReactionEnabled={isReactionEnabled}
              onReplyInThread={onReplyInThread}
              isOpenedFromThread={isOpenedFromThread}
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
              showRemove={showRemove}
              resendMessage={resendMessage}
              setQuoteMessage={setQuoteMessage}
              parentRef={parentRef}
              onReplyInThread={onReplyInThread}
              isOpenedFromThread={isOpenedFromThread}
            />
          )
      }
    </>
  );
};

export default MobileMenu;
