import './mobile-menu.scss';

import React from 'react';
// import MobileContextMenu from './MobileContextMenu';
import MobileBottomSheet from './MobileBottomSheet';
import type { MobileMenuProps } from './types';

const MobileMenu: React.FC<MobileMenuProps> = (props: MobileMenuProps) => {
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
  } = props;
  return (
    <>
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
      />
      {/* {
        isReactionEnabled
          ? (
          ): (
            // <MobileContextMenu
            //   message={message}
            //   hideMenu={hideMenu}
            //   isByMe={isByMe}
            //   replyType={replyType}
            //   disabled={disabled}
            //   showRemove={showRemove}
            //   resendMessage={resendMessage}
            //   setQuoteMessage={setQuoteMessage}
            // />
          )
      } */}
    </>
  );
};

export default MobileMenu;
