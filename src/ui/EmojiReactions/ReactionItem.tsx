import React, { useCallback, useContext } from 'react';

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
};

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
  const message = messageStore?.message as UserMessage;
  const { stringSet } = useContext(LocalizationContext);

  const userId = store.config.userId;
  const reactedByMe = isReactedBy(userId, reaction);

  const handleOnClick = () => {
    setShowEmojisBottomSheet('');
    toggleReaction?.((message), reaction.key, reactedByMe);
  };
  const longPress = useLongPress({
    onLongPress: () => {
      setShowEmojisBottomSheet(reaction.key);
    },
    onClick: handleOnClick,
  }, {
    shouldPreventDefault: true,
    shouldStopPropagation: true,
  });

  return (
    <TooltipWrapper
      className="sendbird-emoji-reactions__reaction-badge"
      hoverTooltip={(reaction?.userIds?.length > 0) ? (
        <Tooltip>
          {getEmojiTooltipString(reaction, userId, memberNicknamesMap, stringSet)}
        </Tooltip>
      ) : <></>}
    >
      <div
        {
        ...(
          isMobile
            ? { ...longPress }
            : { onClick: handleOnClick }
        )
        }
        data-reaction-key={reaction.key}
        data-is-reacted-by-me={reactedByMe}
      >
        <ReactionBadge
          count={reaction.userIds.length}
          selected={reactedByMe}
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
  );
}
