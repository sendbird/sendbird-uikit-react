import './index.scss';
import React, { ReactElement, useRef, useState } from 'react';
import type { Emoji, EmojiContainer } from '@sendbird/chat';
import type { FileMessage, Reaction, UserMessage } from '@sendbird/chat/message';
import type { GroupChannel } from '@sendbird/chat/groupChannel';

import ReactionBadge from '../ReactionBadge';
import ReactionButton from '../ReactionButton';
import ImageRenderer from '../ImageRenderer';
import Icon, { IconTypes, IconColors } from '../Icon';
import ContextMenu, { EmojiListItems } from '../ContextMenu';
import { Nullable } from '../../types';

import { getClassName, getEmojiListAll, getEmojiMapAll } from '../../utils';
import { ReactedMembersBottomSheet } from '../MobileMenu/ReactedMembersBottomSheet';
import ReactionItem from './ReactionItem';
import { useMediaQueryContext } from '../../lib/MediaQueryContext';

interface Props {
  className?: string | Array<string>;
  userId: string;
  message: UserMessage | FileMessage;
  channel: Nullable<GroupChannel>;
  emojiContainer: EmojiContainer;
  memberNicknamesMap: Map<string, string>;
  spaceFromTrigger?: { x: number, y: number };
  isByMe?: boolean;
  toggleReaction?: (message: UserMessage | FileMessage, key: string, byMe: boolean) => void;
}

const EmojiReactions = ({
  className = '',
  userId,
  message,
  channel,
  emojiContainer,
  memberNicknamesMap,
  spaceFromTrigger = { x: 0, y: 0 },
  isByMe = false,
  toggleReaction,
}: Props): ReactElement => {
  const { isMobile } = useMediaQueryContext();
  const emojisMap = getEmojiMapAll(emojiContainer);
  const addReactionRef = useRef(null);
  const [showEmojisBottomSheet, setShowEmojisBottomSheet] = useState('');

  return (
    <div className={getClassName([
      className, 'sendbird-emoji-reactions',
      isByMe ? 'outgoing' : 'incoming',
    ])}>
      {((message.reactions?.length ?? 0) > 0) && (
        message.reactions?.map((reaction: Reaction): ReactElement => {
          return (
            <ReactionItem
              key={reaction?.key}
              reaction={reaction}
              memberNicknamesMap={memberNicknamesMap}
              setShowEmojisBottomSheet={setShowEmojisBottomSheet}
              toggleReaction={toggleReaction}
              emojisMap={emojisMap}
            />
          );
        })
      )}
      {((message.reactions?.length ?? 0) < emojisMap.size) && (
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
                const isReacted: boolean = (message?.reactions
                  ?.find((reaction: Reaction): boolean => reaction.key === emoji.key)?.userIds
                  ?.some((reactorId: string): boolean => reactorId === userId));
                return (
                  <ReactionButton
                    key={emoji.key}
                    width="36px"
                    height="36px"
                    selected={isReacted}
                    onClick={(e): void => {
                      closeDropdown();
                      toggleReaction?.(message, emoji.key, isReacted);
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
      {(isMobile && showEmojisBottomSheet && channel !== null) && (
        <ReactedMembersBottomSheet
          message={message}
          channel={channel}
          emojiKey={showEmojisBottomSheet}
          hideMenu={() => {
            setShowEmojisBottomSheet('');
          }}
          emojiContainer={emojiContainer}
        />
      )}
    </div>
  );
};

export default EmojiReactions;
