import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

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
import { LocalizationContext } from '../../lib/LocalizationContext';

export const MessageStatusTypes = getOutgoingMessageStates();
export default function MessageStatus({
  className,
  message,
  channel,
}) {
  const { dateLocale } = useContext(LocalizationContext);
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

  const messageStatus = useMemo(() => (
    getOutgoingMessageState(channel, message)
  ), [channel?.getUnreadMemberCount?.(message), channel?.getUndeliveredMemberCount?.(message)]);

  return (
    <div
      className={[
        ...(Array.isArray(className) ? className : [className]),
        'sendbird-message-status',
      ].join(' ')}
    >
      {(showMessageStatusIcon) && (
        (messageStatus === MessageStatusTypes.PENDING) ? (
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
            className="sendbird-message-status__icon"
            type={iconType[messageStatus] || IconTypes.ERROR}
            fillColor={iconColor[messageStatus]}
            width="16px"
            height="16px"
          />
        )
      )}
      {isSentStatus(messageStatus) && (
        <Label
          className="sendbird-message-status__text"
          type={LabelTypography.CAPTION_3}
          color={LabelColors.ONBACKGROUND_2}
        >
          {format(message?.createdAt, 'p', { locale: dateLocale })}
        </Label>
      )}
    </div>
  );
}

MessageStatus.propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  message: PropTypes.shape({
    createdAt: PropTypes.number,
    sender: PropTypes.shape({
      friendName: PropTypes.string,
      nickname: PropTypes.string,
      userId: PropTypes.string,
      profileUrl: PropTypes.string,
    }),
    sendingStatus: PropTypes.string,
  }),
  channel: PropTypes.shape({
    isGroupChannel: PropTypes.func,
    isSuper: PropTypes.bool,
    isBroadcast: PropTypes.bool,
    isPublic: PropTypes.bool,
    getUnreadMemberCount: PropTypes.func,
    getUndeliveredMemberCount: PropTypes.func,
  }),
};

MessageStatus.defaultProps = {
  className: '',
  message: null,
  channel: null,
};
