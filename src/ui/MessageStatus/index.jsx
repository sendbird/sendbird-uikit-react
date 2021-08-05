import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';
import Icon, { IconTypes, IconColors } from '../Icon';
import Label, { LabelColors, LabelTypography } from '../Label';
import Loader from '../Loader';

import {
  getMessageCreatedAt,
  getOutgoingMessageStates,
  isSentStatus,
} from '../../utils';

export const MessageStatusTypes = getOutgoingMessageStates();
export default function MessageStatus({
  className,
  message,
  status,
}) {
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
      {(status === MessageStatusTypes.PENDING)
        ? (
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
        )
        : (
          <Icon
            className="sendbird-message-status__icon"
            type={iconType[status]}
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
          {getMessageCreatedAt(message)}
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
  status: PropTypes.string,
};

MessageStatus.defaultProps = {
  className: '',
  message: null,
  status: '',
};
