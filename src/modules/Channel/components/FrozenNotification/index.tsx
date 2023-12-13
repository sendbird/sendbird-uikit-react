/* We operate the CSS files for Channel&GroupChannel modules in the GroupChannel */
import '../../../GroupChannel/components/FrozenNotification/index.scss';
import React, { useContext } from 'react';

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
