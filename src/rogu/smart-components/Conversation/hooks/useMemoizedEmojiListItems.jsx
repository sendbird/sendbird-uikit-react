import React, { useMemo } from 'react';

import { EmojiListItems } from '../../../../ui/ContextMenu';
import ReactionButton from '../../../../ui/ReactionButton';
import ImageRenderer from '../../../../ui/ImageRenderer';
import Icon, { IconTypes } from '../../../../ui/Icon';

export default function useMemoizedEmojiListItems({
  emojiContainer, toggleReaction,
}, {
  useReaction,
  logger,
  userId,
  emojiAllList,
}) {
  /* eslint-disable react/prop-types */
  return useMemo(() => ({
    parentRef,
    parentContainRef,
    message,
    closeDropdown,
    spaceFromTrigger = {},
  }) => {
    if (!useReaction || !(parentRef || parentContainRef || message || closeDropdown)) {
      logger.warning('Channel: Invalid Params in memoizedEmojiListItems');
      return null;
    }

    return (
      <EmojiListItems
        parentRef={parentRef}
        parentContainRef={parentContainRef}
        closeDropdown={closeDropdown}
        spaceFromTrigger={spaceFromTrigger}
      >
        {
          emojiAllList.map((emoji) => {
            const reactedReaction = message.reactions
              .filter((reaction) => reaction.key === emoji.key)[0];
            const isReacted = reactedReaction
              ? !(reactedReaction.userIds.indexOf(userId) < 0)
              : false;
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
                  defaultComponent={
                    <Icon width="28px" height="28px" type={IconTypes.QUESTION} />
                  }
                />
              </ReactionButton>
            );
          })
        }
      </EmojiListItems>
    );
  }, [emojiContainer, toggleReaction]);
}
