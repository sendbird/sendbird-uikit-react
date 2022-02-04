import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import format from 'date-fns/format';

import './index.scss';
import Icon, { IconTypes, IconColors } from '../Icon';
import Label, { LabelColors, LabelTypography } from '../Label';
import Loader from '../Loader';

import {
  getOutgoingMessageStates,
  isSentStatus,
} from '../../utils';
import { LocalizationContext } from '../../lib/LocalizationContext';

export const MessageStatusTypes = getOutgoingMessageStates();
export default function MessageStatus({
  className,
  message,
  channel,
  status,
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

  return (
    <div
      className={[
        ...(Array.isArray(className) ? className : [className]),
        'sendbird-message-status',
      ].join(' ')}
    >
      {(showMessageStatusIcon) && (
        (status === MessageStatusTypes.PENDING) ? (
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
            type={iconType[status] || IconTypes.ERROR}
            fillColor={iconColor[status]}
            width="16px"
            height="16px"
          />
        )
      )}
      {isSentStatus(status) && (
        <Label
          className="sendbird-message-status__text"
          type={LabelTypography.CAPTION_3}
          color={LabelColors.ONBACKGROUND_2}
        >
          {format(message?.createdAt, 'p', dateLocale)}
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
  }),
  status: PropTypes.string,
};

MessageStatus.defaultProps = {
  className: '',
  message: null,
  channel: null,
  status: '',
};
