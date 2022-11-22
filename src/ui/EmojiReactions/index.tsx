import './index.scss';
import React, { ReactElement, useContext, useRef } from 'react';
import type { FileMessage, Reaction, UserMessage } from '@sendbird/chat/message';
import type { Emoji, EmojiContainer } from '@sendbird/chat';

import Tooltip from '../Tooltip';
import TooltipWrapper from '../TooltipWrapper';
import ReactionBadge from '../ReactionBadge';
import ReactionButton from '../ReactionButton';
import ImageRenderer from '../ImageRenderer';
import Icon, { IconTypes, IconColors } from '../Icon';
import ContextMenu, { EmojiListItems } from '../ContextMenu';

import { getClassName, getEmojiListAll, getEmojiMapAll, getEmojiTooltipString, isReactedBy } from '../../utils';
import { LocalizationContext } from '../../lib/LocalizationContext';

interface Props {
  className?: string | Array<string>;
  userId: string;
  message: UserMessage | FileMessage;
  emojiContainer: EmojiContainer;
  memberNicknamesMap: Map<string, string>;
  spaceFromTrigger?: { x: number, y: number };
  isByMe?: boolean;
  toggleReaction?: (message: UserMessage | FileMessage, key: string, byMe: boolean) => void;
}

const EmojiReactions = ({
  className,
  userId,
  message,
  emojiContainer,
  memberNicknamesMap,
  spaceFromTrigger = { x: 0, y: 0 },
  isByMe = false,
  toggleReaction,
}: Props): ReactElement => {
  const { stringSet } = useContext(LocalizationContext);
  const emojisMap = getEmojiMapAll(emojiContainer);
  const addReactionRef = useRef(null);

  return (
    <div className={getClassName([
      className, 'sendbird-emoji-reactions',
      isByMe ? 'outgoing' : 'incoming',
    ])}>
      {(message?.reactions?.length > 0) && (
        message.reactions.map((reaction: Reaction): ReactElement => {
          const reactedByMe = isReactedBy(userId, reaction);
          return (
            <TooltipWrapper
              className="sendbird-emoji-reactions__reaction-badge"
              key={reaction?.key}
              hoverTooltip={(reaction?.userIds?.length > 0) && (
                <Tooltip>
                  {getEmojiTooltipString(reaction, userId, memberNicknamesMap, stringSet)}
                </Tooltip>
              )}
            >
              <ReactionBadge
                count={reaction.userIds.length}
                selected={reactedByMe}
                onClick={(e) => {
                  toggleReaction(message, reaction.key, reactedByMe);
                  e?.stopPropagation?.();
                }}
              >
                <ImageRenderer
                  circle
                  url={emojisMap.get(reaction?.key)?.url || ''}
                  width="20px"
                  height="20px"
                  defaultComponent={(
                    <Icon width="20px" height="20px" type={IconTypes.QUESTION} />
                  )}
                />
              </ReactionBadge>
            </TooltipWrapper>
          );
        })
      )}
      {(message?.reactions?.length < emojisMap.size) && (
        <ContextMenu
          menuTrigger={(toggleDropdown: () => void): ReactElement => (
            <ReactionBadge
              className="sendbird-emoji-reactions__add-reaction-badge"
              ref={addReactionRef}
              isAdd
              onClick={(e) => {
                toggleDropdown();
                e?.stopPropagation?.();
              }}
            >
              <Icon
                type={IconTypes.EMOJI_MORE}
                fillColor={IconColors.ON_BACKGROUND_3}
                width="20px"
                height="20px"
              />
            </ReactionBadge>
          )}
          menuItems={(closeDropdown: () => void): ReactElement => (
            <EmojiListItems
              parentRef={addReactionRef}
              parentContainRef={addReactionRef}
              closeDropdown={closeDropdown}
              spacefromTrigger={spaceFromTrigger}
            >
              {getEmojiListAll(emojiContainer).map((emoji: Emoji): ReactElement => {
                const isReacted: boolean = (message?.reactions?.
                  find((reaction: Reaction): boolean => reaction.key === emoji.key)?.userIds?.
                  some((reactorId: string): boolean => reactorId === userId));
                return (
                  <ReactionButton
                    key={emoji.key}
                    width="36px"
                    height="36px"
                    selected={isReacted}
                    onClick={(e): void => {
                      closeDropdown();
                      toggleReaction(message, emoji.key, isReacted);
                      e?.stopPropagation();
                    }}
                  >
                    <ImageRenderer
                      url={emoji?.url || ''}
                      width="28px"
                      height="28px"
                      placeHolder={(style: Record<string, unknown>): ReactElement => (
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
          )}
        />
      )}
    </div>
  );
}

export default EmojiReactions;
