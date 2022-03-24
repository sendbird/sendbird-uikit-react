import React, { useMemo } from 'react';
import format from 'date-fns/format';
import './index.scss';

import Icon, { IconTypes, IconColors } from '../Icon';
import Label, { LabelColors, LabelTypography } from '../Label';
import Loader from '../Loader';

import {
  getOutgoingMessageState,
  getOutgoingMessageStates,
  isSentStatus,
} from '../../utils';
import { FileMessage, GroupChannel, UserMessage } from 'sendbird';
import { useLocalization } from '../../lib/LocalizationContext';

export const MessageStatusTypes = getOutgoingMessageStates();

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
  ), [channel?.getUnreadMemberCount?.(message), channel?.getUndeliveredMemberCount?.(message)]);
  const showMessageStatusIcon = channel?.isGroupChannel()
    && !channel?.isSuper
    && !channel?.isPublic
    && !channel?.isBroadcast;
  const iconType = {
    [MessageStatusTypes.SENT]: IconTypes.DONE,
    [MessageStatusTypes.DELIVERED]: IconTypes.DONE_ALL,
    [MessageStatusTypes.READ]: IconTypes.DONE_ALL,
    [MessageStatusTypes.FAILED]: IconTypes.ERROR,
  };
  const iconColor = {
    [MessageStatusTypes.SENT]: IconColors.SENT,
    [MessageStatusTypes.DELIVERED]: IconColors.SENT,
    [MessageStatusTypes.READ]: IconColors.READ,
    [MessageStatusTypes.FAILED]: IconColors.ERROR,
  };

  return (
    <div
      className={[
        ...(Array.isArray(className) ? className : [className]),
        'sendbird-message-status',
      ].join(' ')}
    >
      {(status === MessageStatusTypes.PENDING) ? (
        <Loader
          className={`sendbird-message-status__icon ${showMessageStatusIcon ? '' : 'hide-icon'}`}
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
          className={`sendbird-message-status__icon ${showMessageStatusIcon ? '' : 'hide-icon'}`}
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
