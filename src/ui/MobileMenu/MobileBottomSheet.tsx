import type { Emoji } from '@sendbird/chat';
import { Reaction, UserMessage } from '@sendbird/chat/message';
import React, { useState } from 'react';

import type { MobileBottomSheetProps } from './types';
import type { GroupChannel } from '@sendbird/chat/groupChannel';

import {
  getEmojiListAll,
  isFailedMessage,
  isPendingMessage,
  isSentMessage,
  isUserMessage,
  isFileMessage,
  isVoiceMessage,
  isThreadMessage,
} from '../../utils';
import BottomSheet from '../BottomSheet';
import ImageRenderer from '../ImageRenderer';
import ReactionButton from '../ReactionButton';
import Icon, { IconTypes, IconColors } from '../Icon';
import { classnames } from '../../utils/utils';
import { MessageMenuProvider, MobileMessageMenuContextProps } from '../MessageMenu/MessageMenuProvider';
import {
  CopyMenuItem,
  EditMenuItem,
  ResendMenuItem,
  ReplyMenuItem,
  ThreadMenuItem,
  DeleteMenuItem,
  DownloadMenuItem,
} from '../MessageMenu/menuItems/BottomSheetMenuItems';
import useSendbird from '../../lib/Sendbird/context/hooks/useSendbird';

const EMOJI_SIZE = 38;

const MobileBottomSheet: React.FunctionComponent<MobileBottomSheetProps> = (props: MobileBottomSheetProps) => {
  const {
    hideMenu,
    channel,
    emojiContainer,
    message,
    replyType,
    userId,
    resendMessage,
    deleteMessage,
    toggleReaction,
    isReactionEnabled = false,
    showEdit,
    showRemove,
    deleteMenuState,
    setQuoteMessage,
    onReplyInThread,
    isOpenedFromThread = false,
    onDownloadClick,
    renderMenuItems,
  } = props;
  const isByMe = message?.sender?.userId === userId;
  const { state: { config: { isOnline } } } = useSendbird();
  const showMenuItemCopy: boolean = isUserMessage(message as UserMessage);
  const showMenuItemEdit: boolean = (isUserMessage(message as UserMessage) && isSentMessage(message) && isByMe);
  const showMenuItemResend: boolean = (isOnline && isFailedMessage(message) && message?.isResendable && isByMe);

  const showMenuItemDelete: boolean = !isPendingMessage(message) && isByMe;
  const showMenuItemDeleteByState = isByMe && (deleteMenuState === undefined || deleteMenuState !== 'HIDE');
  const showMenuItemDeleteFinal = showMenuItemDeleteByState && showMenuItemDelete;

  const disableDelete = (
    (deleteMenuState !== undefined && deleteMenuState === 'DISABLE')
    || (message?.threadInfo?.replyCount ?? 0) > 0
  );

  const showMenuItemDownload: boolean = isSentMessage(message) && isFileMessage(message) && !isVoiceMessage(message);
  const showReaction: boolean = !isFailedMessage(message) && !isPendingMessage(message) && isReactionEnabled;
  const showMenuItemReply: boolean = (replyType === 'QUOTE_REPLY')
    && !isFailedMessage(message)
    && !isPendingMessage(message)
    && (channel?.isGroupChannel() && !(channel as GroupChannel)?.isBroadcast);
  const showMenuItemThread: boolean = (replyType === 'THREAD') && !isOpenedFromThread
    && !isFailedMessage(message)
    && !isPendingMessage(message)
    && !isThreadMessage(message)
    && (channel?.isGroupChannel() && !(channel as GroupChannel)?.isBroadcast);

  const maxEmojisPerRow = Math.floor(window.innerWidth / EMOJI_SIZE) - 1;
  const [showEmojisOnly, setShowEmojisOnly] = useState<boolean>(false);
  const emojis = emojiContainer && getEmojiListAll(emojiContainer);
  const visibleEmojis = showEmojisOnly ? emojis : emojis?.slice(0, maxEmojisPerRow);
  const canShowMoreEmojis = emojis && emojis.length > maxEmojisPerRow;

  const contextValue: MobileMessageMenuContextProps = {
    message,
    hideMenu,
    setQuoteMessage,
    onReplyInThread,
    onMoveToParentMessage: () => { },
    showEdit,
    showRemove,
    deleteMessage,
    resendMessage,
    isOnline,
    disableDeleteMessage: disableDelete,
    triggerRef: null,
    containerRef: null,
    onDownloadClick,
  };

  return (
    <MessageMenuProvider value={contextValue}>
      <BottomSheet onBackdropClick={hideMenu}>
        <div className="sendbird-message__bottomsheet">
          {showReaction && (
            <div className="sendbird-message__bottomsheet-reactions">
              <ul className="sendbird-message__bottomsheet-reaction-bar">
                <div
                  className={classnames(
                    'sendbird-message__bottomsheet-reaction-bar__row',
                    showEmojisOnly && 'sendbird-message__bottomsheet-reaction-bar__all',
                  )}
                >
                  {visibleEmojis.map((emoji: Emoji): React.ReactElement => {
                    const isReacted: boolean = message?.reactions
                      ?.filter((reaction: Reaction): boolean => reaction.key === emoji.key)[0]
                      ?.userIds
                      ?.some((reactorId: string): boolean => reactorId === userId);
                    return (
                      <ReactionButton
                        key={emoji.key}
                        width={`${EMOJI_SIZE}px`}
                        height={`${EMOJI_SIZE}px`}
                        selected={isReacted}
                        onClick={(): void => {
                          hideMenu();
                          toggleReaction?.(message, emoji.key, isReacted);
                        }}
                        testID={`ui_mobile_emoji_reactions_menu_${emoji.key}`}
                      >
                        <ImageRenderer
                          url={emoji?.url || ''}
                          width="28px"
                          height="28px"
                          placeHolder={({ style }): React.ReactElement => (
                            <div style={style}>
                              <Icon
                                type={IconTypes.QUESTION}
                                fillColor={IconColors.ON_BACKGROUND_3}
                                width="28px"
                                height="28px"
                              />
                            </div>
                          )}
                        />
                      </ReactionButton>
                    );
                  })}
                  {canShowMoreEmojis && !showEmojisOnly && (
                    <ReactionButton
                      key="emoji_more"
                      width="38px"
                      height="38px"
                      onClick={(): void => setShowEmojisOnly(true)}
                      testID="ui_mobile_emoji_reactions_menu_emojiadd"
                    >
                      <ImageRenderer
                        url={''}
                        width="28px"
                        height="28px"
                        placeHolder={({ style }): React.ReactElement => (
                          <div style={style}>
                            <Icon
                              type={IconTypes.EMOJI_MORE}
                              fillColor={IconColors.ON_BACKGROUND_3}
                              width="28px"
                              height="28px"
                            />
                          </div>
                        )}
                      />
                    </ReactionButton>
                  )}
                </div>
              </ul>
            </div>
          )}
          {!showEmojisOnly && (
            <div className="sendbird-message__bottomsheet--actions">
              {renderMenuItems?.({
                items: {
                  CopyMenuItem,
                  EditMenuItem,
                  ResendMenuItem,
                  ReplyMenuItem,
                  ThreadMenuItem,
                  DeleteMenuItem,
                },
              }) ?? (
                  <>
                    {showMenuItemCopy && <CopyMenuItem />}
                    {showMenuItemEdit && <EditMenuItem />}
                    {showMenuItemResend && <ResendMenuItem />}
                    {showMenuItemReply && <ReplyMenuItem />}
                    {showMenuItemThread && <ThreadMenuItem />}
                    {showMenuItemDeleteFinal && <DeleteMenuItem />}
                    {showMenuItemDownload && <DownloadMenuItem />}
                  </>
              )}
            </div>
          )}
        </div>
      </BottomSheet>
    </MessageMenuProvider>
  );
};

export default MobileBottomSheet;
