import React, { useContext } from 'react';

import './frozen-channel-notification.scss';

import { LocalizationContext } from '../../../../lib/LocalizationContext';
import Label, { LabelTypography } from '../../../../ui/Label';

const FrozenNotification = (): JSX.Element => {
  const { stringSet } = useContext(LocalizationContext);
  return (
    <div className="sendbird-frozen-channel-notification">
      <Label
        className="sendbird-frozen-channel-notification__text"
        type={LabelTypography.CAPTION_2}
      >
        {stringSet.CHANNEL_FROZEN}
      </Label>
    </div>
  );
}

export default FrozenNotification;
