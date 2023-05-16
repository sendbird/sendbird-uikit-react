import React, { useContext } from 'react';

import { FileMessage, Reaction, UserMessage } from '@sendbird/chat/message';

import Tooltip from '../Tooltip';
import TooltipWrapper from '../TooltipWrapper';
import ReactionBadge from '../ReactionBadge';
import ImageRenderer from '../ImageRenderer';
import Icon, { IconTypes } from '../Icon';
import { useMediaQueryContext } from '../../lib/MediaQueryContext';
import useLongPress from '../../hooks/useLongPress';
import { LocalizationContext } from '../../lib/LocalizationContext';
import useSendbirdStateContext from '../../hooks/useSendbirdStateContext';
import { getEmojiTooltipString, isReactedBy } from '../../utils';
import { useMessageContext } from '../../modules/Message/context/MessageProvider';
import { Emoji } from '@sendbird/chat';

type Props = {
  reaction: Reaction;
  memberNicknamesMap: Map<string, string>;
  setShowEmojisBottomSheet: React.Dispatch<React.SetStateAction<string>>;
  toggleReaction?: (message: UserMessage | FileMessage, key: string, byMe: boolean) => void;
  emojisMap: Map<string, Emoji>;
}

export default function ReactionItem({
  reaction,
  memberNicknamesMap,
  setShowEmojisBottomSheet,
  toggleReaction,
  emojisMap,
}: Props) {
  const store = useSendbirdStateContext();
  const { isMobile } = useMediaQueryContext();
  const messageStore = useMessageContext();
  const { stringSet } = useContext(LocalizationContext);

  const message = messageStore?.message as UserMessage;
  const longPress = useLongPress({
    onLongPress: () => {
      setShowEmojisBottomSheet(reaction.key);
    },
    onClick: () => {
      toggleReaction?.((message), reaction.key, reactedByMe);
    },
  }, {
    shouldPreventDefault: true,
  });

  const userId = store.config.userId;
  const reactedByMe = isReactedBy(userId, reaction);

  return (
    <TooltipWrapper
      className="sendbird-emoji-reactions__reaction-badge"
      hoverTooltip={(reaction?.userIds?.length > 0) ? (
        <Tooltip>
          {getEmojiTooltipString(reaction, userId, memberNicknamesMap, stringSet)}
        </Tooltip>
      ): <></>}
    >
      <div
        {
          ...(
            isMobile
              ? { ...longPress }
              : {}
          )
        }
        data-reaction-key={reaction.key}
        data-is-reacted-by-me={reactedByMe}
      >
        <ReactionBadge
          count={reaction.userIds.length}
          selected={reactedByMe}
          onClick={(e) => {
            toggleReaction?.(message, reaction.key, reactedByMe);
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
      </div>
    </TooltipWrapper>
  )
}
