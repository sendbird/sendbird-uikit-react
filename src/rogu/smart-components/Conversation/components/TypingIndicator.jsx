import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';

import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { uuidv4 } from '../../../../utils/uuid';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';

const TypingIndicatorText = ({ members }) => {
  const { stringSet } = useContext(LocalizationContext);
  if (!members || members.length === 0) {
    return '';
  }

  if (members && members.length === 1) {
    return `${members[0].nickname} ${stringSet.TYPING_INDICATOR__IS_TYPING}`;
  }

  if (members && members.length === 2) {
    return `${members[0].nickname} ${stringSet.TYPING_INDICATOR__AND} ${members[1].nickname} ${stringSet.TYPING_INDICATOR__ARE_TYPING}`;
  }

  return stringSet.TYPING_INDICATOR__MULTIPLE_TYPING;
};

function TypingIndicator({ channelUrl, sb, logger }) {
  const [handlerId, setHandlerId] = useState(uuidv4());
  const [typingMembers, setTypingMembers] = useState([]);

  useEffect(() => {
    if (sb && sb.ChannelHandler) {
      sb.removeChannelHandler(handlerId);
      const newHandlerId = uuidv4();
      const handler = new sb.ChannelHandler();
      // there is a possible warning in here - setState called after unmount
      handler.onTypingStatusUpdated = (groupChannel) => {
        logger.info(
          'Channel > Typing Indicator: onTypingStatusUpdated',
          groupChannel,
        );
        const members = groupChannel.getTypingMembers();
        if (groupChannel.url === channelUrl) {
          setTypingMembers(members);
        }
      };
      sb.addChannelHandler(newHandlerId, handler);
      setHandlerId(newHandlerId);
    }

    return () => {
      setTypingMembers([]);
      if (sb && sb.removeChannelHandler) {
        sb.removeChannelHandler(handlerId);
      }
    };
  }, [channelUrl]);

  return (
    <Label type={LabelTypography.CAPTION_2} color={LabelColors.ONBACKGROUND_2}>
      <TypingIndicatorText members={typingMembers} />
    </Label>
  );
}

TypingIndicator.propTypes = {
  channelUrl: PropTypes.string.isRequired,
  sb: PropTypes.shape({
    ChannelHandler: PropTypes.func,
    removeChannelHandler: PropTypes.func,
    addChannelHandler: PropTypes.func,
  }).isRequired,
  logger: PropTypes.shape({
    info: PropTypes.func,
  }).isRequired,
};

export default TypingIndicator;
