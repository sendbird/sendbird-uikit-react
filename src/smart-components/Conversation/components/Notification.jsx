import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import './notification.scss';
import { LocalizationContext } from '../../../lib/LocalizationContext';
import Label, { LabelTypography, LabelColors } from '../../../ui/Label';
import Icon, { IconTypes, IconColors } from '../../../ui/Icon';

export default function Notification({
  count,
  time,
  onClick,
}) {
  const { stringSet } = useContext(LocalizationContext);
  const timeArray = time.split(' ');
  timeArray.splice(-2, 0, stringSet.CHANNEL__MESSAGE_LIST__NOTIFICATION__ON);
  return (
    // eslint-disable-next-line
    <div className="sendbird-notification" onClick={onClick}>
      <Label className="sendbird-notification__text" color={LabelColors.ONCONTENT_1} type={LabelTypography.CAPTION_2}>
        {`${count} `}
        {stringSet.CHANNEL__MESSAGE_LIST__NOTIFICATION__NEW_MESSAGE}
        {` ${timeArray.join(' ')}`}
      </Label>
      <Icon
        width="24px"
        height="24px"
        type={IconTypes.CHEVRON_DOWN}
        fillColor={IconColors.CONTENT}
      />
    </div>
  );
}

Notification.propTypes = {
  count: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  time: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

Notification.defaultProps = {
  count: 0,
  time: '',
};
