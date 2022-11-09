import './index.scss';
import React, { useMemo } from 'react';
import format from 'date-fns/format';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { FileMessage, UserMessage } from '@sendbird/chat/message';

import Icon, { IconTypes, IconColors } from '../Icon';
import Label, { LabelColors, LabelTypography } from '../Label';
import Loader from '../Loader';

import { isSentStatus } from '../../utils';
import {
  getOutgoingMessageState,
  OutgoingMessageStates,
} from '../../utils/exports/getOutgoingMessageState';
import { useLocalization } from '../../lib/LocalizationContext';

export const MessageStatusTypes = OutgoingMessageStates;

interface MessageStatusProps {
  className?: string;
  message: UserMessage | FileMessage;
  channel: GroupChannel;
}

export default function MessageStatus({
  className,
  message,
  channel,
}: MessageStatusProps): React.ReactElement {
  const { dateLocale } = useLocalization();
  const status = useMemo(() => (
    getOutgoingMessageState(channel, message)
  ), [channel, message]);
  const hideMessageStatusIcon = channel?.isGroupChannel?.() && (
    (channel.isSuper || channel.isPublic || channel.isBroadcast)
    && !(status === OutgoingMessageStates.PENDING || status === OutgoingMessageStates.FAILED)
  );
  const iconType = {
    [OutgoingMessageStates.SENT]: IconTypes.DONE,
    [OutgoingMessageStates.DELIVERED]: IconTypes.DONE_ALL,
    [OutgoingMessageStates.READ]: IconTypes.DONE_ALL,
    [OutgoingMessageStates.FAILED]: IconTypes.ERROR,
  };
  const iconColor = {
    [OutgoingMessageStates.SENT]: IconColors.SENT,
    [OutgoingMessageStates.DELIVERED]: IconColors.SENT,
    [OutgoingMessageStates.READ]: IconColors.READ,
    [OutgoingMessageStates.FAILED]: IconColors.ERROR,
  };

  return (
    <div
      className={[
        ...(Array.isArray(className) ? className : [className]),
        'sendbird-message-status',
      ].join(' ')}
    >
      {(status === OutgoingMessageStates.PENDING) ? (
        <Loader
          className="sendbird-message-status__icon"
          width="16px"
          height="16px"
        >
          <Icon
            type={IconTypes.SPINNER}
            fillColor={IconColors.PRIMARY}
            width="16px"
            height="16px"
          />
        </Loader>
      ) : (
        <Icon
          className={`sendbird-message-status__icon ${hideMessageStatusIcon ? 'hide-icon' : ''}`}
          type={iconType[status] || IconTypes.ERROR}
          fillColor={iconColor[status]}
          width="16px"
          height="16px"
        />
      )}
      {isSentStatus(status) && (
        <Label
          className="sendbird-message-status__text"
          type={LabelTypography.CAPTION_3}
          color={LabelColors.ONBACKGROUND_2}
        >
          {format(message?.createdAt || 0, 'p', {
            locale: dateLocale,
          })}
        </Label>
      )}
    </div>
  );
}
