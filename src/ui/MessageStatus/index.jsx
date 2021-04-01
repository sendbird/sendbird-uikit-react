import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';
import Icon, { IconTypes, IconColors } from '../Icon';
import Label, { LabelColors, LabelTypography } from '../Label';
import Loader from '../Loader';
import MessageStatusType from './type';

import { getMessageCreatedAt } from '../../utils/utils';

const MessageStatusTypes = MessageStatusType;
export { MessageStatusTypes };
export default function MessageStatus({
  className,
  message,
  status,
}) {
  const label = () => {
    switch (status) {
      case MessageStatusType.FAILED:
      case MessageStatusType.PENDING: {
        return null;
      }
      case MessageStatusType.SENT:
      case MessageStatusType.DELIVERED:
      case MessageStatusType.READ: {
        return (
          <Label
            className="sendbird-message-status__text"
            type={LabelTypography.CAPTION_3}
            color={LabelColors.ONBACKGROUND_2}
          >
            {getMessageCreatedAt(message)}
          </Label>
        );
      }
      default: return null;
    }
  };

  const icon = {
    PENDING: (
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
    ),
    SENT: (
      <Icon
        className="sendbird-message-status__icon"
        type={IconTypes.DONE}
        fillColor={IconColors.SENT}
        width="16px"
        height="16px"
      />
    ),
    DELIVERED: (
      <Icon
        className="sendbird-message-status__icon"
        type={IconTypes.DONE_ALL}
        fillColor={IconColors.SENT}
        width="16px"
        height="16px"
      />
    ),
    READ: (
      <Icon
        className="sendbird-message-status__icon"
        type={IconTypes.DONE_ALL}
        fillColor={IconColors.READ}
        width="16px"
        height="16px"
      />
    ),
    FAILED: (
      <Icon
        className="sendbird-message-status__icon"
        type={IconTypes.ERROR}
        fillColor={IconColors.ERROR}
        width="16px"
        height="16px"
      />
    ),
  };

  return (
    <div
      className={[
        ...(Array.isArray(className) ? className : [className]),
        'sendbird-message-status',
      ].join(' ')}
    >
      {icon[status]}
      <br />
      {label(status)}
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
  }),
  status: PropTypes.string,
};

MessageStatus.defaultProps = {
  className: '',
  message: null,
  status: '',
};
