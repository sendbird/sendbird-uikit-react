import React, { ReactElement, useMemo } from 'react';
import { EmojiContainer } from '@sendbird/chat';
import { FileMessage, Reaction, UserMessage } from '@sendbird/chat/message';

import BottomSheet from '../BottomSheet';
import { getEmojiListAll } from '../../utils';
import ReactionButton from '../ReactionButton';
import ImageRenderer from '../ImageRenderer';
import Icon, { IconColors, IconTypes } from '../Icon';

export interface MobileEmojisBottomSheetProps {
  userId: string;
  message: UserMessage | FileMessage;
  emojiContainer: EmojiContainer;
  hideMenu: () => void;
  toggleReaction?: (message: UserMessage | FileMessage, key: string, byMe: boolean) => void;
}

export const MobileEmojisBottomSheet = ({
  userId,
  message,
  emojiContainer,
  hideMenu,
  toggleReaction,
}: MobileEmojisBottomSheetProps): ReactElement => {
  const emojiAllList = useMemo(() => {
    return getEmojiListAll(emojiContainer);
  }, [emojiContainer]);
  return (
    <BottomSheet onBackdropClick={hideMenu}>
      <div className="sendbird-message__bottomsheet sendbird-message__emojis-bottomsheet">
        {emojiAllList.map((emoji) => {
          const isReacted: boolean = (message?.reactions
            ?.find((reaction: Reaction): boolean => reaction.key === emoji.key)?.userIds
            ?.some((reactorId: string): boolean => reactorId === userId)) ?? false;
          return (
            <ReactionButton
              key={emoji.key}
              width="44px"
              height="44px"
              selected={isReacted}
              onClick={(e) => {
                e?.stopPropagation();
                toggleReaction?.(message, emoji.key, isReacted);
                hideMenu();
              }}
            >
              <ImageRenderer
                url={emoji.url}
                width="38px"
                height="38px"
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
      </div>
    </BottomSheet>
  );
};
