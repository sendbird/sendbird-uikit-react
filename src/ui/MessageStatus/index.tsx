import './index.scss';
import React from 'react';
import format from 'date-fns/format';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import Icon, { IconTypes, IconColors } from '../Icon';
import Label, { LabelColors, LabelTypography } from '../Label';
import Loader from '../Loader';
import { CoreMessageType, isSentStatus } from '../../utils';
import {
  getOutgoingMessageState,
  OutgoingMessageStates,
} from '../../utils/exports/getOutgoingMessageState';
import { getLastMessageCreatedAt } from '../../modules/ChannelList/components/ChannelPreview/utils';
import { useLocalization } from '../../lib/LocalizationContext';
import { Nullable } from '../../types';
import { classnames } from '../../utils/utils';

export const MessageStatusTypes = OutgoingMessageStates;

interface MessageStatusProps {
  className?: string;
  message?: CoreMessageType | null;
  channel: Nullable<GroupChannel>;
  isDateSeparatorConsidered?: boolean;
}

const iconType = {
  [OutgoingMessageStates.SENT]: IconTypes.DONE,
  [OutgoingMessageStates.DELIVERED]: IconTypes.DONE_ALL,
  [OutgoingMessageStates.READ]: IconTypes.DONE_ALL,
  [OutgoingMessageStates.FAILED]: IconTypes.ERROR,
  [OutgoingMessageStates.PENDING]: undefined,
  [OutgoingMessageStates.NONE]: undefined,
};
const iconColor = {
  [OutgoingMessageStates.SENT]: IconColors.SENT,
  [OutgoingMessageStates.DELIVERED]: IconColors.SENT,
  [OutgoingMessageStates.READ]: IconColors.READ,
  [OutgoingMessageStates.FAILED]: IconColors.ERROR,
  [OutgoingMessageStates.PENDING]: undefined,
  [OutgoingMessageStates.NONE]: undefined,
};

export default function MessageStatus({
  className,
  message,
  channel,
  isDateSeparatorConsidered = true,
}: MessageStatusProps): React.ReactElement {
  const { stringSet, dateLocale } = useLocalization();
  const status = getOutgoingMessageState(channel, message);
  const hideMessageStatusIcon = channel?.isGroupChannel?.() && (
    (channel.isSuper || channel.isPublic || channel.isBroadcast)
    && !(status === OutgoingMessageStates.PENDING || status === OutgoingMessageStates.FAILED)
  );

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
          testID="sendbird-message-status-icon"
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
          className={classnames('sendbird-message-status__icon', hideMessageStatusIcon && 'hide-icon', status !== OutgoingMessageStates.FAILED && 'sendbird-message-status--sent')}
          testID="sendbird-message-status-icon"
          type={iconType[status] || IconTypes.ERROR}
          fillColor={iconColor[status]}
          width="16px"
          height="16px"
        />
      )}
      {isSentStatus(status) && (
        <Label
          className="sendbird-message-status__text"
          testID="sendbird-message-status-text"
          type={LabelTypography.CAPTION_3}
          color={LabelColors.ONBACKGROUND_2}
        >
          {
            isDateSeparatorConsidered
              ? format(message?.createdAt || 0, stringSet.DATE_FORMAT__MESSAGE_CREATED_AT, { locale: dateLocale })
              : getLastMessageCreatedAt({ channel, locale: dateLocale, stringSet })
          }
        </Label>
      )}
    </div>
  );
}
