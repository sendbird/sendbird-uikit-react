import React, { useContext } from 'react';

import './frozen-notification.scss';

import { LocalizationContext } from '../../../../lib/LocalizationContext';
import Label, { LabelTypography } from '../../../../ui/Label';

interface FrozenNotificationProps {
  className?: string;
}

const FrozenNotification = ({
  className = '',
}: FrozenNotificationProps): React.ReactElement => {
  const { stringSet } = useContext(LocalizationContext);
  return (
    <div className={`sendbird-notification sendbird-notification--frozen ${className}`}>
      <Label
        className="sendbird-notification__text"
        type={LabelTypography.CAPTION_2}
      >
        {stringSet.CHANNEL_FROZEN}
      </Label>
    </div>
  );
};

export default FrozenNotification;
