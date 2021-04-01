import React, { useContext } from 'react';

import Icon, { IconTypes, IconColors } from '../Icon';
import Label, { LabelTypography, LabelColors } from '../Label';
import { LocalizationContext } from '../../lib/LocalizationContext';

import './index.scss';

function ConnectionStatus() {
  const { stringSet } = useContext(LocalizationContext);
  return (
    <div className="sendbird-connection-status">
      <Label
        type={LabelTypography.BODY_2}
        color={LabelColors.ONBACKGROUND_2}
      >
        {stringSet.TRYING_TO_CONNECT}
      </Label>
      <Icon
        type={IconTypes.DISCONNECTED}
        fillColor={IconColors.SENT}
        width="14px"
        height="14px"
      />
    </div>
  );
}

export default ConnectionStatus;
