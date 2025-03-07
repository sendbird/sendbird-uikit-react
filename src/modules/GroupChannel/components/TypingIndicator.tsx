import React, { useEffect, useState, useContext } from 'react';
import type { Member } from '@sendbird/chat/groupChannel';
import { GroupChannelHandler } from '@sendbird/chat/groupChannel';

import Label, { LabelTypography, LabelColors } from '../../../ui/Label';
import { LocalizationContext } from '../../../lib/LocalizationContext';
import { uuidv4 } from '../../../utils/uuid';
import useSendbird from '../../../lib/Sendbird/context/hooks/useSendbird';

export interface TypingIndicatorTextProps {
  members: Member[];
}

export const TypingIndicatorText = ({ members }: TypingIndicatorTextProps) => {
  function getText() {
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
  }

  return <>{getText()}</>;
};

export interface TypingIndicatorProps {
  channelUrl: string;
}

export const TypingIndicator = ({ channelUrl }: TypingIndicatorProps) => {
  const { state } = useSendbird();
  const sb = state?.stores?.sdkStore?.sdk;
  const logger = state?.config?.logger;
  const [handlerId, setHandlerId] = useState(uuidv4());
  const [typingMembers, setTypingMembers] = useState<Member[]>([]);

  useEffect(() => {
    if (sb?.groupChannel?.addGroupChannelHandler) {
      sb.groupChannel.removeGroupChannelHandler(handlerId);
      const newHandlerId = uuidv4();
      const handler = new GroupChannelHandler({
        onTypingStatusUpdated: (groupChannel) => {
          // there is a possible warning in here - setState called after unmount
          logger.info('Channel > Typing Indicator: onTypingStatusUpdated', groupChannel);
          if (groupChannel.url === channelUrl) {
            const members = groupChannel.getTypingUsers();
            setTypingMembers(members);
          }
        },
      });
      sb.groupChannel.addGroupChannelHandler(newHandlerId, handler);
      setHandlerId(newHandlerId);
    }

    return () => {
      setTypingMembers([]);
      if (sb?.groupChannel?.removeGroupChannelHandler) {
        sb.groupChannel.removeGroupChannelHandler(handlerId);
      }
    };
  }, [channelUrl]);

  return (
    <Label
      className="sendbird-conversation__footer__typing-indicator__text"
      type={LabelTypography.CAPTION_2}
      color={LabelColors.ONBACKGROUND_2}
    >
      <TypingIndicatorText members={typingMembers} />
    </Label>
  );
};

export default TypingIndicator;
