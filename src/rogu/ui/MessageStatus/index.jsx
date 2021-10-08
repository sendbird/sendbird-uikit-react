import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';
import Icon, { IconTypes } from '../Icon';
import Label, { LabelColors, LabelTypography } from '../Label';

import {
  getMessageCreatedAt,
  getOutgoingMessageStates,
  isSentStatus,
} from '../../../utils';

export const MessageStatusTypes = getOutgoingMessageStates();
export default function MessageStatus({
  className,
  message,
  status,
}) {
  const iconType = {
    [MessageStatusTypes.SENT]: IconTypes.ROGU_SENT,
    [MessageStatusTypes.DELIVERED]: IconTypes.ROGU_SENT,
    [MessageStatusTypes.READ]: IconTypes.ROGU_READ_ALL,
    [MessageStatusTypes.FAILED]: IconTypes.ROGU_ERROR,
  };

  return (
    <div
      className={[
        ...(Array.isArray(className) ? className : [className]),
        'rogu-message-status',
      ].join(' ')}
    >
      {isSentStatus(status) && (
        <Label
          className="rogu-message-status__text"
          type={LabelTypography.CAPTION_3}
          color={LabelColors.ONBACKGROUND_2}
        >
          {getMessageCreatedAt(message)}
        </Label>
      )}
      {(status === MessageStatusTypes.PENDING)
        ? (
          <div className="rogu-flex">
            <Label
              className="rogu-message-status__text"
              type={LabelTypography.CAPTION_3}
              color={LabelColors.ONBACKGROUND_2}
            >
              Mengirim
            </Label>
            <Icon
              className="rogu-message-status__icon"
              type={IconTypes.ROGU_PENDING}
              width="18px"
              height="18px"
            />
          </div>
        )
        : (
          <div className="rogu-flex">
            {status === MessageStatusTypes.FAILED
              && (
              <Label
                className="rogu-message-status__text"
                type={LabelTypography.CAPTION_3}
                color={LabelColors.ONBACKGROUND_2}
              >
                Gagal terkirim
              </Label>
              )}
            <Icon
              className="rogu-message-status__icon"
              type={iconType[status] || IconTypes.ERROR}
              width="18px"
              height="18px"
            />
          </div>
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
