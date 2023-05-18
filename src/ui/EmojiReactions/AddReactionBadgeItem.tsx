import React, {
  KeyboardEvent,
  MouseEvent,
  TouchEvent,
} from 'react';
import ReactionBadge from '../ReactionBadge';
import Icon, { IconColors, IconTypes } from '../Icon';
import useLongPress from '../../hooks/useLongPress';

export interface AddReactionBadgeItemProps {
  onClick: (e: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => void;
}

export const AddReactionBadgeItem = ({
  onClick,
}: AddReactionBadgeItemProps): React.ReactElement => {
  const onlyClick = useLongPress({
    onLongPress: () => { /* noop */ },
    onClick,
  }, {
    shouldPreventDefault: true,
    shouldStopPropagation: true,
  });

  return (
    <div
      className="sendbird-emoji-reactions__add-reaction-badge"
      {...{ ...onlyClick }}
    >
      <ReactionBadge
        isAdd
      >
        <Icon
          type={IconTypes.EMOJI_MORE}
          fillColor={IconColors.ON_BACKGROUND_3}
          width="20px"
          height="20px"
        />
      </ReactionBadge>
    </div>
  );
};
