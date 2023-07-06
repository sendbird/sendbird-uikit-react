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
import { Nullable, SpaceFromTriggerType } from '../../types';

import { getClassName, getEmojiListAll, getEmojiMapAll } from '../../utils';
import { ReactedMembersBottomSheet } from '../MobileMenu/ReactedMembersBottomSheet';
import ReactionItem from './ReactionItem';
import { useMediaQueryContext } from '../../lib/MediaQueryContext';
import { AddReactionBadgeItem } from './AddReactionBadgeItem';
import { MobileEmojisBottomSheet } from '../MobileMenu/MobileEmojisBottomSheet';

interface Props {
  className?: string | Array<string>;
  userId: string;
  message: UserMessage | FileMessage;
  channel: Nullable<GroupChannel>;
  emojiContainer: EmojiContainer;
  memberNicknamesMap: Map<string, string>;
  spaceFromTrigger?: SpaceFromTriggerType;
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
  const addReactionRef = useRef(null);
  const [showEmojiList, setShowEmojiList] = useState(false);
  const [selectedEmojiKey, setSelectedEmojiKey] = useState('');

  const emojisMap = getEmojiMapAll(emojiContainer);
  const showAddReactionBadge = (message.reactions?.length ?? 0) < emojisMap.size;

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
              setEmojiKey={setSelectedEmojiKey}
              toggleReaction={toggleReaction}
              emojisMap={emojisMap}
              channel={channel}
            />
          );
        })
      )}
      {(!isMobile && showAddReactionBadge) && (
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
              spaceFromTrigger={spaceFromTrigger}
            >
              {getEmojiListAll(emojiContainer).map((emoji: Emoji): ReactElement => {
                const isReacted: boolean = (message?.reactions
                  ?.find((reaction: Reaction): boolean => reaction.key === emoji.key)?.userIds
                  ?.some((reactorId: string): boolean => reactorId === userId)) || false;
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
                    dataSbId={`ui_emoji_reactions_menu_${emoji.key}`}
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
      {(isMobile && showAddReactionBadge) && (
        <AddReactionBadgeItem
          onClick={() => {
            setShowEmojiList(true);
          }}
        />
      )}
      {(isMobile && showEmojiList) && (
        <MobileEmojisBottomSheet
          userId={userId}
          message={message}
          emojiContainer={emojiContainer}
          hideMenu={() => {
            setShowEmojiList(false);
          }}
          toggleReaction={toggleReaction}
        />
      )}
      {(isMobile && selectedEmojiKey && channel !== null) && (
        <ReactedMembersBottomSheet
          message={message}
          channel={channel}
          emojiKey={selectedEmojiKey}
          hideMenu={() => {
            setSelectedEmojiKey('');
          }}
          emojiContainer={emojiContainer}
        />
      )}
    </div>
  );
};

export default EmojiReactions;
