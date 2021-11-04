import React, { ReactElement, useRef } from 'react';
import { FileMessage, UserMessage, Emoji, Reaction, EmojiContainer } from 'sendbird';
import './index.scss';

import ContextMenu, { EmojiListItems } from '../ContextMenu';
import Icon, { IconTypes, IconColors } from '../Icon';
import IconButton from '../IconButton';
import ImageRenderer from '../ImageRenderer';
import ReactionButton from '../ReactionButton';
import { getClassName, getEmojiListAll } from '../../utils';

interface Props {
  className?: string | Array<string>;
  message: UserMessage | FileMessage;
  userId: string;
  spaceFromTrigger?: Record<string, unknown>;
  emojiContainer?: EmojiContainer;
  toggleReaction?: (message: UserMessage | FileMessage, reactionKey: string, isReacted: boolean) => void;
  setSupposedHover?: (bool: boolean) => void;
}

export default function MessageItemReactionMenu({
  className,
  message,
  userId,
  spaceFromTrigger = {},
  emojiContainer,
  toggleReaction,
  setSupposedHover,
}: Props): ReactElement {
  const triggerRef = useRef(null);
  const containerRef = useRef(null);

  return (
    <div
      className={getClassName([className, 'sendbird-message-item-reaction-menu'])}
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
              setSupposedHover(true);
            }}
            onBlur={(): void => {
              setSupposedHover(false);
            }}
          >
            <Icon
              className="sendbird-message-item-reaction-menu__trigger__icon"
              type={IconTypes.EMOJI_MORE}
              fillColor={IconColors.CONTENT_INVERSE}
              width="24px"
              height="24px"
            />
          </IconButton>
        )}
        menuItems={(close: () => void): ReactElement => {
          const closeDropdown = (): void => {
            close();
            setSupposedHover(false);
          };
          return (
            <EmojiListItems
              parentRef={triggerRef}
              parentContainRef={containerRef}
              closeDropdown={closeDropdown}
              spaceFromTrigger={spaceFromTrigger}
            >
              {getEmojiListAll(emojiContainer).map((emoji: Emoji): ReactElement => {
                const isReacted: boolean = message?.reactions?.
                  filter((reaction: Reaction) => reaction.key === emoji.key)[0]?.userIds?.
                  some((reactorId: string) => reactorId === userId);
                return (
                  <ReactionButton
                    key={emoji.key}
                    width="36px"
                    height="36px"
                    selected={isReacted}
                    onClick={() => {
                      closeDropdown();
                      toggleReaction(message, emoji.key, isReacted);
                    }}
                  >
                    <ImageRenderer
                      url={emoji.url}
                      width="28px"
                      height="28px"
                      placeHolder={(style) => (
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
