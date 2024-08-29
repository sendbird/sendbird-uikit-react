import './index.scss';
import React, { ReactElement, useMemo, useRef } from 'react';
import type { Reaction } from '@sendbird/chat/message';
import type { Emoji, EmojiCategory, EmojiContainer } from '@sendbird/chat';

import ContextMenu, { EmojiListItems, getObservingId } from '../ContextMenu';
import Icon, { IconTypes, IconColors } from '../Icon';
import IconButton from '../IconButton';
import ImageRenderer from '../ImageRenderer';
import ReactionButton from '../ReactionButton';
import {
  getClassName,
  isPendingMessage,
  isFailedMessage,
  SendableMessageType,
  getEmojiListByCategoryIds,
} from '../../utils';
import { SpaceFromTriggerType } from '../../types';

export interface MessageEmojiMenuProps {
  className?: string | Array<string>;
  message: SendableMessageType;
  userId: string;
  spaceFromTrigger?: SpaceFromTriggerType;
  emojiContainer?: EmojiContainer;
  filterEmojiCategoryIds?: (message: SendableMessageType) => EmojiCategory['id'][];
  toggleReaction?: (message: SendableMessageType, reactionKey: string, isReacted: boolean) => void;
}

export function MessageEmojiMenu({
  className,
  message,
  userId,
  spaceFromTrigger = { x: 0, y: 0 },
  emojiContainer,
  filterEmojiCategoryIds,
  toggleReaction,
}: MessageEmojiMenuProps): ReactElement | null {
  const triggerRef = useRef(null);
  const containerRef = useRef(null);
  const filteredEmojis = useMemo(() => {
    return getEmojiListByCategoryIds(emojiContainer, filterEmojiCategoryIds?.(message));
  }, [emojiContainer, filterEmojiCategoryIds]);

  if (isPendingMessage(message) || isFailedMessage(message)) {
    return null;
  }

  return (
    <div
      className={getClassName([className ?? '', 'sendbird-message-item-reaction-menu'])}
      ref={containerRef}
    >
      <ContextMenu
        menuTrigger={(toggleDropdown: () => void): ReactElement => (
          <IconButton
            className="sendbird-message-item-reaction-menu__trigger"
            ref={triggerRef}
            width="32px"
            height="32px"
            onClick={(): void => {
              toggleDropdown();
            }}
          >
            <Icon
              className="sendbird-message-item-reaction-menu__trigger__icon"
              testID="sendbird-message-item-reaction-menu__trigger__icon"
              type={IconTypes.EMOJI_MORE}
              fillColor={IconColors.CONTENT_INVERSE}
              width="24px"
              height="24px"
            />
          </IconButton>
        )}
        menuItems={(closeDropdown: () => void): ReactElement => {
          if (filteredEmojis.length === 0) return null;

          return (
            <EmojiListItems
              id={getObservingId(message.messageId)}
              parentRef={triggerRef}
              parentContainRef={containerRef}
              closeDropdown={closeDropdown}
              spaceFromTrigger={spaceFromTrigger}
            >
              {filteredEmojis.map((emoji: Emoji): ReactElement => {
                const isReacted: boolean = message?.reactions
                  ?.find((reaction: Reaction) => reaction.key === emoji.key)
                  ?.userIds
                  ?.some((reactorId: string) => reactorId === userId) || false;
                return (
                  <ReactionButton
                    key={emoji.key}
                    width="36px"
                    height="36px"
                    selected={isReacted}
                    onClick={() => {
                      closeDropdown();
                      toggleReaction?.(message, emoji.key, isReacted);
                    }}
                    testID={`ui_emoji_reactions_menu_${emoji.key}`}
                  >
                    <ImageRenderer
                      url={emoji.url}
                      width="28px"
                      height="28px"
                      placeHolder={({ style }) => (
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
            </EmojiListItems>
          );
        }}
      />
    </div>
  );
}

// MessageItemReactionMenu - legacy name
export default MessageEmojiMenu;
