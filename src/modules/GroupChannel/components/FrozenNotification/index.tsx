import './index.scss';
import React, { useContext } from 'react';

import { LocalizationContext } from '../../../../lib/LocalizationContext';
import Label, { LabelTypography } from '../../../../ui/Label';
import { classnames } from '../../../../utils/utils';

export interface FrozenNotificationProps {
  className?: string;
}

export const FrozenNotification = ({
  className = '',
}: FrozenNotificationProps): React.ReactElement => {
  const { stringSet } = useContext(LocalizationContext);
  return (
    <div className={classnames('sendbird-notification', 'sendbird-notification--frozen', className)}>
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
